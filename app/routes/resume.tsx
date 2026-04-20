import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router"
import { AlertTriangle } from "lucide-react"
import ATS from "~/components/ATS"
import Details from "~/components/Details"
import { DetailsPageSkeleton } from "~/components/LoadingSkeletons"
import Navbar from "~/components/Navbar"
import Summary from "~/components/Summary"
import { Alert, AlertDescription } from "~/components/ui/alert"
import { Button } from "~/components/ui/button"
import { useToast } from "~/hooks/useToast"
import { usePuterStore } from "~/lib/puter"
import { getLocalResumePdfKey, getLocalResumePreviewKey } from "~/lib/utils"

export const meta = () => [
  { title: "Resumind | Review" },
  { name: "description", content: "Detailed overview of your resume" },
]

const ResumeReview = () => {
  const { auth, fs, kv, isLoading } = usePuterStore()
  const { id } = useParams()
  const { error: showError } = useToast()
  const navigate = useNavigate()

  const [imageUrl, setImageUrl] = useState("")
  const [resumeUrl, setResumeUrl] = useState("")
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [resumeMeta, setResumeMeta] = useState<{
    companyName?: string
    jobTitle?: string
  } | null>(null)
  const [contentError, setContentError] = useState("")
  const [previewError, setPreviewError] = useState("")
  const [localIsLoading, setLocalIsLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate(`/auth?next=/resume/${id}`)
    }
  }, [auth.isAuthenticated, id, isLoading, navigate])

  useEffect(() => {
    if (isLoading || !auth.isAuthenticated) {
      return
    }

    let resumeObjectUrl = ""
    let imageObjectUrl = ""
    let localResumeUrl = ""
    let localImageUrl = ""
    let cancelled = false
    const localResumePdfKey = id ? getLocalResumePdfKey(id) : ""
    const localResumePreviewKey = id ? getLocalResumePreviewKey(id) : ""

    const pause = (delayMs: number) =>
      new Promise((resolve) => setTimeout(resolve, delayMs))

    const clearLocalResumeUrl = () => {
      if (!localResumeUrl) {
        return
      }

      if (localResumePdfKey) {
        sessionStorage.removeItem(localResumePdfKey)
      }

      URL.revokeObjectURL(localResumeUrl)
      localResumeUrl = ""
    }

    const clearLocalPreviewUrl = () => {
      if (!localImageUrl) {
        return
      }

      if (localResumePreviewKey) {
        sessionStorage.removeItem(localResumePreviewKey)
      }

      URL.revokeObjectURL(localImageUrl)
      localImageUrl = ""
    }

    const applyLocalAssets = () => {
      if (localResumePdfKey) {
        const storedResumeUrl = sessionStorage.getItem(localResumePdfKey)

        if (storedResumeUrl) {
          localResumeUrl = storedResumeUrl
          setResumeUrl((currentUrl) => currentUrl || storedResumeUrl)
        }
      }

      if (localResumePreviewKey) {
        const storedPreviewUrl = sessionStorage.getItem(localResumePreviewKey)

        if (storedPreviewUrl) {
          localImageUrl = storedPreviewUrl
          setImageUrl((currentUrl) => currentUrl || storedPreviewUrl)
        }
      }
    }

    const loadImagePreview = async (imagePath: string) => {
      const imageBlob = await fs.read(imagePath)

      if (!imageBlob || cancelled) {
        return false
      }

      if (imageObjectUrl) {
        URL.revokeObjectURL(imageObjectUrl)
      }

      imageObjectUrl = URL.createObjectURL(imageBlob)
      setImageUrl(imageObjectUrl)
      clearLocalPreviewUrl()

      return true
    }

    const pollForPreview = async () => {
      for (let attempt = 0; attempt < 6; attempt += 1) {
        await pause(800)

        if (cancelled) {
          return
        }

        if (localResumePreviewKey) {
          const storedPreviewUrl = sessionStorage.getItem(localResumePreviewKey)

          if (storedPreviewUrl) {
            localImageUrl = storedPreviewUrl
            setImageUrl((currentUrl) => currentUrl || storedPreviewUrl)
            return
          }
        }

        const latestResume = await kv.get(`resume:${id}`)

        if (!latestResume) {
          return
        }

        const latestData = JSON.parse(latestResume) as Resume

        if (!latestData.imagePath) {
          continue
        }

        const previewLoaded = await loadImagePreview(latestData.imagePath)

        if (previewLoaded) {
          return
        }
      }
    }

    const loadResume = async () => {
      try {
        setLocalIsLoading(true)
        setContentError("")
        setPreviewError("")
        applyLocalAssets()

        const resume = await kv.get(`resume:${id}`)

        if (!resume) {
          setContentError("Resume not found")
          showError("Resume not found")
          return
        }

        const data = JSON.parse(resume) as Resume
        setResumeMeta({
          companyName: data.companyName,
          jobTitle: data.jobTitle,
        })
        setFeedback(data.feedback)
        setLocalIsLoading(false)

        const resumeBlob = await fs.read(data.resumePath)
        if (!resumeBlob) {
          if (!localResumeUrl) {
            setPreviewError("The PDF is still syncing. The analysis is ready below.")
          }
          return
        }

        const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" })
        resumeObjectUrl = URL.createObjectURL(pdfBlob)
        setResumeUrl(resumeObjectUrl)
        clearLocalResumeUrl()

        if (data.imagePath) {
          const previewLoaded = await loadImagePreview(data.imagePath)

          if (!previewLoaded) {
            void pollForPreview()
          }
        } else {
          void pollForPreview()
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load resume"
        setContentError(message)
        showError(message)
      } finally {
        if (!cancelled) {
          setLocalIsLoading(false)
        }
      }
    }

    void loadResume()

    return () => {
      cancelled = true
      clearLocalResumeUrl()
      clearLocalPreviewUrl()
      if (resumeObjectUrl) URL.revokeObjectURL(resumeObjectUrl)
      if (imageObjectUrl) URL.revokeObjectURL(imageObjectUrl)
    }
  }, [auth.isAuthenticated, fs, id, isLoading, kv, showError])

  return (
    <main className="!pt-0 overflow-hidden bg-[#f6f8fc]">
      <div className="absolute inset-x-0 top-0 -z-10 h-[460px] bg-[radial-gradient(circle_at_top_left,_rgba(255,199,186,0.75),_transparent_38%),radial-gradient(circle_at_top_right,_rgba(155,189,255,0.68),_transparent_34%),linear-gradient(180deg,_#fffdfd_0%,_#f6f8fc_50%,_#f3f6fb_100%)]" />
      <Navbar />

      <section className="px-4 pb-6 pt-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Button
            asChild
            variant="outline"
            className="rounded-full border-slate-200 bg-white/80"
          >
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 xl:grid-cols-[0.76fr_1.24fr]">
          <aside className="rounded-[36px] border border-white/80 bg-white/85 p-5 shadow-[0_28px_80px_rgba(15,23,42,0.1)] backdrop-blur xl:sticky xl:top-28 xl:h-fit">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-400">
                  Resume preview
                </p>
                <h2 className="mt-3 !text-3xl !font-semibold !tracking-[-0.04em] !text-slate-950">
                  {resumeMeta?.companyName || "Resume analysis"}
                </h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {resumeMeta?.jobTitle || "Open the full document or review the visual preview below."}
                </p>
              </div>

              {resumeUrl && (
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-slate-200 bg-white"
                >
                  <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                    Open PDF
                  </a>
                </Button>
              )}
            </div>

            {previewError && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{previewError}</AlertDescription>
              </Alert>
            )}

            {imageUrl ? (
              <div className="overflow-hidden rounded-[28px] bg-[#f7f8fc] p-4">
                <img
                  src={imageUrl}
                  alt="Resume preview"
                  className="w-full rounded-[22px] object-contain shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
                  decoding="async"
                  title="resume"
                />
              </div>
            ) : (
              <div className="flex min-h-[420px] items-center justify-center rounded-[28px] bg-[#f7f8fc]">
                <img
                  src="/images/resume-scan-2.gif"
                  alt="Animated loading preview"
                  className="h-32 w-32"
                />
              </div>
            )}
          </aside>

          <section className="rounded-[36px] border border-white/80 bg-white/85 p-6 shadow-[0_28px_80px_rgba(15,23,42,0.1)] backdrop-blur lg:p-8">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-400">
                Detailed review
              </p>
              <h1 className="mt-3 !text-5xl !leading-[1.03] !tracking-[-0.05em] !text-slate-950 sm:!text-6xl">
                Resume analysis
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
                Score breakdown, ATS feedback, and the next improvements to focus on.
              </p>
            </div>

            {contentError ? (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{contentError}</AlertDescription>
              </Alert>
            ) : feedback ? (
              <div className="space-y-6">
                <Summary feedback={feedback} />
                <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
                <Details feedback={feedback} />
              </div>
            ) : localIsLoading ? (
              <DetailsPageSkeleton />
            ) : null}
          </section>
        </div>
      </section>
    </main>
  )
}

export default ResumeReview
