import { Card, CardContent } from "~/components/ui/card"
import ScoreGauge from "./ScoreGauge"
import { ScoreCard } from "./ScoreCard"
import { cn } from "~/lib/utils"

const getSummaryTone = (score: number) => {
  if (score >= 70) {
    return {
      pill: "border-emerald-100 bg-emerald-50 text-emerald-700",
      label: "Strong submission",
    }
  }

  if (score >= 50) {
    return {
      pill: "border-amber-100 bg-amber-50 text-amber-700",
      label: "Solid foundation",
    }
  }

  return {
    pill: "border-rose-100 bg-rose-50 text-rose-700",
    label: "High-impact revision needed",
  }
}

const Summary = ({ feedback }: { feedback: Feedback }) => {
  const tone = getSummaryTone(feedback.overallScore)

  const scoreCards = [
    {
      title: "Tone & Style",
      score: feedback.toneAndStyle.score,
      description: "How polished, professional, and readable the resume feels.",
    },
    {
      title: "Content",
      score: feedback.content.score,
      description: "How well your experience and outcomes support the role.",
    },
    {
      title: "Structure",
      score: feedback.structure.score,
      description: "How clearly the layout guides both ATS tools and recruiters.",
    },
    {
      title: "Skills",
      score: feedback.skills.score,
      description: "How effectively your technical and role-fit skills are surfaced.",
    },
  ]

  return (
    <Card className="overflow-hidden rounded-[34px] border border-white/80 bg-white/85 shadow-[0_26px_70px_rgba(15,23,42,0.08)]">
      <div className="h-24 bg-[radial-gradient(circle_at_top_left,_rgba(255,199,186,0.8),_transparent_40%),radial-gradient(circle_at_top_right,_rgba(155,189,255,0.6),_transparent_35%),linear-gradient(180deg,_rgba(255,255,255,0.92),_rgba(255,255,255,0.88))]" />

      <CardContent className="relative -mt-10 p-6 lg:p-8">
        <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr] xl:items-center">
          <div className="space-y-5">
            <div
              className={cn(
                "inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium",
                tone.pill
              )}
            >
              {tone.label}
            </div>

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
              <ScoreGauge score={feedback.overallScore} />

              <div className="space-y-3">
                <h2 className="!text-3xl !font-semibold !tracking-[-0.04em] !text-slate-950 sm:!text-4xl">
                  Your resume score
                </h2>
                <p className="text-sm leading-7 text-slate-600 sm:text-base">
                  This overview shows how the resume performs across the areas
                  that most affect readability, ATS matching, and recruiter
                  confidence.
                </p>
                <div className="flex flex-wrap gap-2 text-sm">
                  {["ATS-aware review", "Saved in dashboard", "Actionable feedback"].map(
                    (item) => (
                      <span
                        key={item}
                        className="rounded-full bg-white px-3 py-1 text-slate-500 shadow-sm"
                      >
                        {item}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {scoreCards.map((item) => (
              <ScoreCard
                key={item.title}
                title={item.title}
                score={item.score}
                description={item.description}
                showProgress
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default Summary
