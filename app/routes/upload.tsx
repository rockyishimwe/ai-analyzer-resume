import { type FormEvent, useEffect, useRef, useState } from "react"
import { Gauge, LayoutDashboard, Sparkles } from "lucide-react"
import { useNavigate } from "react-router"
import Navbar from "~/components/Navbar"
import FileUploader from "~/components/FileUploader"
import { FormInput, FormTextarea } from "~/components/FormComponents"
import { Alert, AlertDescription } from "~/components/ui/alert"
import { Button } from "~/components/ui/button"
import { prepareInstructions, AIResponseFormat } from "~/constants"
import { useToast } from "~/hooks/useToast"
import { convertPdfToImage, extractTextFromPdf } from "~/lib/pdf2img"
import { usePuterStore } from "~/lib/puter"
import {
  createContentSignature,
  generateUUID,
  parseAIJsonResponse,
} from "~/lib/utils"
import { uploadResumeSchema, validateFile } from "~/lib/validation"

const uploadHighlights = [
  {
    title: "ATS performance",
    description: "See how likely the resume is to clear automated screening.",
    icon: Gauge,
  },
  {
    title: "Actionable feedback",
    description: "Get practical notes you can use on the very next draft.",
    icon: Sparkles,
  },
  {
    title: "Saved in dashboard",
    description: "Come back to each review later without losing the context.",
    icon: LayoutDashboard,
  },
]

const Upload = () => {
  const { auth, isLoading, fs, ai, kv } = usePuterStore()
  const navigate = useNavigate()
  const { success, error: showError } = useToast()

  const [isProcessing, setIsProcessing] = useState(false)
  const [statusText, setStatusText] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const companyNameRef = useRef<HTMLInputElement>(null)
  const jobTitleRef = useRef<HTMLInputElement>(null)
  const jobDescriptionRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate("/auth?next=/upload")
    }
  }, [auth.isAuthenticated, isLoading, navigate])

  const handleFileSelect = (selectedFile: File | null) => {
    setFile(selectedFile)
    setErrors((prev) => ({ ...prev, file: "" }))
  }

  const cacheFeedback = async (cacheKey: string, feedback: Feedback) => {
    try {
      await kv.set(cacheKey, JSON.stringify(feedback))
    } catch (cacheError) {
      console.error("Failed to cache feedback:", cacheError)
    }
  }

  const getCachedFeedback = async (cacheKey: string) => {
    try {
      const cachedFeedback = await kv.get(cacheKey)

      if (!cachedFeedback) {
        return null
      }

      return JSON.parse(cachedFeedback) as Feedback
    } catch (cacheError) {
      console.error("Failed to read cached feedback:", cacheError)
      return null
    }
  }

  const persistPreviewInBackground = async ({
    file,
    resumeId,
  }: {
    file: File
    resumeId: string
  }) => {
    try {
      const previewImage = await convertPdfToImage(file)

      if (!previewImage.file) {
        return
      }

      const uploadedImage = await fs.upload([previewImage.file])

      if (!uploadedImage) {
        return
      }

      const storedResume = await kv.get(`resume:${resumeId}`)

      if (!storedResume) {
        return
      }

      const parsedResume = JSON.parse(storedResume) as Resume

      await kv.set(
        `resume:${resumeId}`,
        JSON.stringify({
          ...parsedResume,
          imagePath: uploadedImage.path,
        })
      )
    } catch (previewError) {
      console.error("Failed to generate resume preview:", previewError)
    }
  }

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string
    jobTitle: string
    jobDescription: string
    file: File
  }) => {
    setIsProcessing(true)
    setStatusText("")

    try {
      setStatusText("Uploading your resume...")
      const [uploadedFile, resumeText] = await Promise.all([
        fs.upload([file]),
        extractTextFromPdf(file),
      ])

      if (!uploadedFile) {
        throw new Error("Failed to upload file")
      }

      const uuid = generateUUID()
      const cacheKey = `analysis-cache:${await createContentSignature([
        companyName,
        jobTitle,
        jobDescription,
        resumeText || file.name,
        resumeText ? "" : `${file.size}:${file.lastModified}`,
      ])}`

      setStatusText("Checking for a matching analysis...")
      const cachedFeedback = await getCachedFeedback(cacheKey)
      let parsedFeedback: Feedback
      let usedCachedFeedback = false
      let completionMessage = ""

      if (cachedFeedback) {
        parsedFeedback = cachedFeedback
        usedCachedFeedback = true
      } else {
        setStatusText("Analyzing your resume...")
        const feedback = await ai.feedback({
          filePath: uploadedFile.path,
          resumeText,
          message: prepareInstructions({
            jobTitle,
            jobDescription,
            AIResponseFormat,
          }),
        })

        if (!feedback) {
          throw new Error("Failed to analyze resume")
        }

        const feedbackText =
          typeof feedback.message.content === "string"
            ? feedback.message.content
            : feedback.message.content[0].text
        const responseModel = feedback.usage?.[0]?.model

        parsedFeedback = parseAIJsonResponse<Feedback>(feedbackText)
        await cacheFeedback(cacheKey, parsedFeedback)

        if (responseModel) {
          completionMessage = `Analysis completed with ${responseModel}.`
          setStatusText(completionMessage)
        }
      }

      const data: {
        id: string
        resumePath: string
        imagePath: string
        companyName: string
        jobTitle: string
        jobDescription: string
        feedback: Feedback
      } = {
        id: uuid,
        resumePath: uploadedFile.path,
        imagePath: "",
        companyName,
        jobTitle,
        jobDescription,
        feedback: parsedFeedback,
      }

      await kv.set(`resume:${uuid}`, JSON.stringify(data))
      void persistPreviewInBackground({ file, resumeId: uuid })

      success(
        usedCachedFeedback
          ? "Loaded a matching analysis from cache. Redirecting..."
          : completionMessage
            ? `${completionMessage} Redirecting...`
            : "Resume analysis complete! Redirecting..."
      )
      setTimeout(() => navigate(`/resume/${uuid}`), 500)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred"
      showError(`Error: ${errorMessage}`)
      setStatusText("")
      setIsProcessing(false)
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})

    const companyName = companyNameRef.current?.value || ""
    const jobTitle = jobTitleRef.current?.value || ""
    const jobDescription = jobDescriptionRef.current?.value || ""

    if (!file) {
      setErrors({ file: "Please select a PDF file" })
      showError("Please select a PDF file")
      return
    }

    const fileValidation = validateFile(file)
    if (!fileValidation.valid) {
      setErrors({ file: fileValidation.error || "Invalid file" })
      showError(fileValidation.error || "Invalid file")
      return
    }

    const validation = uploadResumeSchema.safeParse({
      companyName,
      jobTitle,
      jobDescription,
    })

    if (!validation.success) {
      const newErrors: Record<string, string> = {}

      validation.error.issues.forEach((issue) => {
        const path = issue.path[0]
        if (path === "companyName") newErrors.companyName = issue.message
        if (path === "jobTitle") newErrors.jobTitle = issue.message
        if (path === "jobDescription") newErrors.jobDescription = issue.message
      })

      setErrors(newErrors)
      showError("Please fix the form errors")
      return
    }

    void handleAnalyze({ companyName, jobTitle, jobDescription, file })
  }

  return (
    <main className="pt-0! overflow-hidden bg-[#f6f8fc]">
      <div className="absolute inset-x-0 top-0 -z-10 h-140 bg-[radial-gradient(circle_at_top_left,_rgba(255,199,186,0.82),_transparent_36%),radial-gradient(circle_at_top_right,_rgba(155,189,255,0.7),_transparent_32%),linear-gradient(180deg,_#fffdfd_0%,_#f6f8fc_50%,_#f3f6fb_100%)]" />
      <Navbar />

      <section className="px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 xl:grid-cols-[0.82fr_1.18fr]">
          <div className="space-y-6">
            <div className="rounded-[36px] bg-slate-950 p-8 text-white shadow-[0_28px_80px_rgba(15,23,42,0.18)]">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/45">
                Resume review studio
              </p>
              <h1 className="mt-4 !text-5xl !leading-[1.03] !tracking-[-0.05em] !text-white sm:!text-6xl">
                Upload once. Review deeply.
              </h1>
              <p className="mt-5 text-base leading-8 text-slate-300 sm:text-lg">
                Add the role context, send your resume through the reviewer, and
                get a cleaner explanation of what helps or hurts the application.
              </p>
            </div>

            <div className="grid gap-4">
              {uploadHighlights.map(({ title, description, icon: Icon }) => (
                <div
                  key={title}
                  className="rounded-[28px] border border-white/80 bg-white/82 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <h2 className="!text-2xl !font-semibold !tracking-[-0.03em] !text-slate-950">
                        {title}
                      </h2>
                      <p className="mt-2 text-sm leading-7 text-slate-600">
                        {description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[36px] border border-white/80 bg-white/86 p-6 shadow-[0_28px_80px_rgba(15,23,42,0.1)] backdrop-blur lg:p-8">
            {isProcessing ? (
              <div className="space-y-6">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-400">
                  Analysis in progress
                </p>
                <h2 className="!text-3xl !font-semibold !tracking-[-0.04em] !text-slate-950 sm:!text-4xl">
                  We are reviewing your resume now.
                </h2>
                <p className="text-base leading-8 text-slate-600">{statusText}</p>
                <div className="overflow-hidden rounded-[30px] bg-[#f7f8fc] p-4">
                  <img
                    src="/images/resume-scan.gif"
                    alt="Animated resume scanning preview"
                    className="w-full rounded-[22px]"
                  />
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-400">
                  New review
                </p>
                <h2 className="mt-3 !text-3xl !font-semibold !tracking-[-0.04em] !text-slate-950 sm:!text-4xl">
                  Give the reviewer enough context to be useful.
                </h2>
                <p className="mt-4 text-base leading-8 text-slate-600">
                  A better brief creates better feedback. Add the company, the job
                  title, the job description, and the resume PDF you want scored.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
                  {errors.file && (
                    <Alert variant="destructive">
                      <AlertDescription>{errors.file}</AlertDescription>
                    </Alert>
                  )}

                  <FormInput
                    ref={companyNameRef}
                    type="text"
                    label="Company Name"
                    placeholder="e.g., Google, Microsoft, etc."
                    id="company-name"
                    error={errors.companyName}
                    helperText="The company you are applying to."
                    required
                  />

                  <FormInput
                    ref={jobTitleRef}
                    type="text"
                    label="Job Title"
                    placeholder="e.g., Senior Frontend Engineer"
                    id="job-title"
                    error={errors.jobTitle}
                    helperText="The role you want the resume aligned to."
                    required
                  />

                  <FormTextarea
                    ref={jobDescriptionRef}
                    label="Job Description"
                    placeholder="Paste the full job description here..."
                    id="job-description"
                    error={errors.jobDescription}
                    helperText="Include responsibilities, requirements, and keyword-heavy sections."
                    rows={6}
                    required
                  />

                  <div className="space-y-2">
                    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Resume File
                      <span className="ml-1 text-red-500">*</span>
                    </p>
                    <FileUploader onFileSelect={handleFileSelect} />
                  </div>

                  <Button
                    type="submit"
                    disabled={isProcessing || !file}
                    size="lg"
                    className="h-12 w-full rounded-full text-base"
                  >
                    Analyze Resume
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}

export default Upload
