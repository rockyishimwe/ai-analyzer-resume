import { useEffect, useState } from "react"
import { ArrowRight } from "lucide-react"
import { Link } from "react-router"
import { Card, CardContent, CardHeader } from "~/components/ui/card"
import { usePuterStore } from "~/lib/puter"
import { cn } from "~/lib/utils"
import ScoreCircle from "./ScoreCircle"

const getCardTone = (score: number) => {
  if (score >= 70) {
    return "border-emerald-100 bg-emerald-50 text-emerald-700"
  }

  if (score >= 50) {
    return "border-amber-100 bg-amber-50 text-amber-700"
  }

  return "border-rose-100 bg-rose-50 text-rose-700"
}

const ResumeCard = ({
  resume: { id, companyName, jobTitle, feedback, imagePath },
}: {
  resume: Resume
}) => {
  const { fs } = usePuterStore()
  const [resumeUrl, setResumeUrl] = useState("")

  useEffect(() => {
    let objectUrl = ""

    const loadResumePreview = async () => {
      const blob = await fs.read(imagePath)
      if (!blob) return

      objectUrl = URL.createObjectURL(blob)
      setResumeUrl(objectUrl)
    }

    void loadResumePreview()

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [fs, imagePath])

  return (
    <Link to={`/resume/${id}`} className="group block h-full animate-in fade-in duration-700">
      <Card className="h-full overflow-hidden rounded-[30px] border border-white/80 bg-white/82 shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(15,23,42,0.14)]">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Saved review
              </p>
              <h3 className="mt-3 break-words text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                {companyName || "Resume review"}
              </h3>
              <p className="mt-2 break-words text-sm leading-6 text-slate-500">
                {jobTitle || "Open the full feedback breakdown and ATS notes."}
              </p>
            </div>

            <div
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em]",
                getCardTone(feedback.overallScore)
              )}
            >
              {feedback.overallScore >= 70
                ? "Strong"
                : feedback.overallScore >= 50
                  ? "Promising"
                  : "Needs work"}
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex h-full flex-col gap-5">
          <div className="overflow-hidden rounded-[26px] bg-[#f7f8fc] p-3">
            {resumeUrl ? (
              <img
                src={resumeUrl}
                alt="Resume preview"
                className="h-[340px] w-full rounded-[20px] object-cover object-top transition duration-300 group-hover:scale-[1.02] max-sm:h-[220px]"
              />
            ) : (
              <div className="flex h-[340px] items-center justify-center rounded-[20px] bg-white text-sm text-slate-400 max-sm:h-[220px]">
                Preparing preview...
              </div>
            )}
          </div>

          <div className="mt-auto flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-950">Open detailed review</p>
              <p className="mt-1 text-sm text-slate-500">
                View scores, ATS feedback, and action items
              </p>
            </div>

            <div className="flex items-center gap-2">
              <ScoreCircle score={feedback.overallScore} />
              <div className="hidden rounded-full bg-slate-950 p-3 text-white transition group-hover:translate-x-1 sm:flex">
                <ArrowRight className="size-4" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default ResumeCard
