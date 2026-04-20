import { Card, CardContent, CardHeader } from "~/components/ui/card"
import { cn } from "~/lib/utils"

interface Suggestion {
  type: "good" | "improve"
  tip: string
}

interface ATSProps {
  score: number
  suggestions: Suggestion[]
}

const getATSTone = (score: number) => {
  if (score >= 70) {
    return {
      banner:
        "bg-[linear-gradient(135deg,rgba(16,185,129,0.18),rgba(56,189,248,0.18))]",
      badge: "border-emerald-100 bg-emerald-50 text-emerald-700",
      progress: "from-emerald-400 to-cyan-400",
      iconSrc: "/icons/ats-good.svg",
      label: "Ready to compete",
    }
  }

  if (score >= 50) {
    return {
      banner:
        "bg-[linear-gradient(135deg,rgba(245,158,11,0.18),rgba(251,113,133,0.18))]",
      badge: "border-amber-100 bg-amber-50 text-amber-700",
      progress: "from-amber-400 to-rose-400",
      iconSrc: "/icons/ats-warning.svg",
      label: "Promising, but sharpen it",
    }
  }

  return {
    banner:
      "bg-[linear-gradient(135deg,rgba(251,113,133,0.2),rgba(249,115,22,0.18))]",
    badge: "border-rose-100 bg-rose-50 text-rose-700",
    progress: "from-rose-400 to-orange-400",
    iconSrc: "/icons/ats-bad.svg",
    label: "Needs targeted revisions",
  }
}

const TipGroup = ({
  title,
  emptyText,
  items,
  variant,
}: {
  title: string
  emptyText: string
  items: Suggestion[]
  variant: "good" | "improve"
}) => {
  const styles =
    variant === "good"
      ? {
          panel: "border-emerald-100 bg-emerald-50/70",
          icon: "/icons/check.svg",
          title: "text-emerald-700",
          text: "text-emerald-800",
        }
      : {
          panel: "border-amber-100 bg-amber-50/70",
          icon: "/icons/warning.svg",
          title: "text-amber-700",
          text: "text-amber-800",
        }

  return (
    <div className={cn("rounded-[26px] border p-5", styles.panel)}>
      <h3 className={cn("text-sm font-semibold uppercase tracking-[0.3em]", styles.title)}>
        {title}
      </h3>

      <div className="mt-4 space-y-3">
        {items.length > 0 ? (
          items.map((suggestion) => (
            <div
              key={`${title}-${suggestion.tip}`}
              className="flex items-start gap-3 rounded-2xl bg-white/70 px-4 py-3"
            >
              <img src={styles.icon} alt="" className="mt-0.5 size-5 flex-shrink-0" />
              <p className={cn("text-sm leading-7", styles.text)}>{suggestion.tip}</p>
            </div>
          ))
        ) : (
          <p className="rounded-2xl bg-white/70 px-4 py-3 text-sm leading-7 text-slate-500">
            {emptyText}
          </p>
        )}
      </div>
    </div>
  )
}

const ATS = ({ score, suggestions }: ATSProps) => {
  const tone = getATSTone(score)
  const strengths = suggestions.filter((item) => item.type === "good")
  const improvements = suggestions.filter((item) => item.type === "improve")

  return (
    <Card className="overflow-hidden rounded-[34px] border border-white/80 bg-white/85 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
      <div className={cn("h-16 w-full", tone.banner)} />

      <CardHeader className="relative -mt-6 px-6 pb-4 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="rounded-[28px] bg-white/85 p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-slate-950">
                <img src={tone.iconSrc} alt="ATS score icon" className="size-8" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="!text-3xl !font-semibold !tracking-[-0.04em] !text-slate-950">
                    ATS score
                  </h2>
                  <div
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm font-semibold",
                      tone.badge
                    )}
                  >
                    {tone.label}
                  </div>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                  This estimate reflects how likely the resume is to pass initial
                  ATS screening before a recruiter reads it.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-slate-200 bg-[#fbfcff] px-6 py-5 text-center shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
              ATS rating
            </p>
            <div className="mt-3 text-5xl font-semibold tracking-[-0.05em] text-slate-950">
              {score}
            </div>
            <p className="mt-2 text-sm text-slate-500">out of 100</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 px-6 pb-6 lg:px-8 lg:pb-8">
        <div>
          <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
            <span>Current ATS strength</span>
            <span>{score}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className={cn(
                "h-full rounded-full bg-gradient-to-r transition-all duration-500",
                tone.progress
              )}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <TipGroup
            title="What is already helping"
            emptyText="No clear strengths were highlighted yet, so focus on building the essentials."
            items={strengths}
            variant="good"
          />
          <TipGroup
            title="What to improve next"
            emptyText="No ATS risks were flagged in this pass."
            items={improvements}
            variant="improve"
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default ATS
