import { cn } from "~/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "./Accordion"

const getScoreTone = (score: number) => {
  if (score >= 70) {
    return {
      badge: "border-emerald-100 bg-emerald-50 text-emerald-700",
      label: "Strong",
    }
  }

  if (score >= 40) {
    return {
      badge: "border-amber-100 bg-amber-50 text-amber-700",
      label: "Mixed",
    }
  }

  return {
    badge: "border-rose-100 bg-rose-50 text-rose-700",
    label: "Needs work",
  }
}

const ScoreBadge = ({ score }: { score: number }) => {
  const tone = getScoreTone(score)

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold",
        tone.badge
      )}
    >
      <span>{score}/100</span>
      <span className="hidden text-xs uppercase tracking-[0.24em] sm:inline">
        {tone.label}
      </span>
    </div>
  )
}

const TipPanel = ({
  title,
  tips,
  variant,
}: {
  title: string
  tips: { type: "good" | "improve"; tip: string; explanation: string }[]
  variant: "good" | "improve"
}) => {
  const styles =
    variant === "good"
      ? {
          panel: "border-emerald-100 bg-emerald-50/70",
          text: "text-emerald-800",
          title: "text-emerald-700",
          icon: "/icons/check.svg",
          empty: "No standout strengths were called out here yet.",
        }
      : {
          panel: "border-amber-100 bg-amber-50/70",
          text: "text-amber-800",
          title: "text-amber-700",
          icon: "/icons/warning.svg",
          empty: "No major revision notes were added in this section.",
        }

  return (
    <div className={cn("rounded-[26px] border p-5", styles.panel)}>
      <p className={cn("text-sm font-semibold uppercase tracking-[0.3em]", styles.title)}>
        {title}
      </p>

      <div className="mt-4 space-y-3">
        {tips.length > 0 ? (
          tips.map((tip) => (
            <div
              key={`${title}-${tip.tip}`}
              className="rounded-[22px] bg-white/75 p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <img src={styles.icon} alt="" className="mt-1 size-5 flex-shrink-0" />
                <div className="space-y-2">
                  <p className={cn("text-base font-semibold", styles.text)}>{tip.tip}</p>
                  <p className="text-sm leading-7 text-slate-600">{tip.explanation}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="rounded-[22px] bg-white/75 px-4 py-3 text-sm leading-7 text-slate-500">
            {styles.empty}
          </p>
        )}
      </div>
    </div>
  )
}

const CategoryHeader = ({
  title,
  categoryScore,
  tipCount,
}: {
  title: string
  categoryScore: number
  tipCount: number
}) => {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          Category feedback
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <p className="text-2xl font-semibold text-slate-950">{title}</p>
          <ScoreBadge score={categoryScore} />
        </div>
      </div>

      <p className="text-sm leading-6 text-slate-500">
        {tipCount} detailed note{tipCount === 1 ? "" : "s"}
      </p>
    </div>
  )
}

const CategoryContent = ({
  tips,
}: {
  tips: { type: "good" | "improve"; tip: string; explanation: string }[]
}) => {
  const strengths = tips.filter((tip) => tip.type === "good")
  const improvements = tips.filter((tip) => tip.type === "improve")

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <TipPanel title="What is working" tips={strengths} variant="good" />
      <TipPanel
        title="What to improve next"
        tips={improvements}
        variant="improve"
      />
    </div>
  )
}

const Details = ({ feedback }: { feedback: Feedback }) => {
  const sections = [
    {
      id: "tone-style",
      title: "Tone & Style",
      score: feedback.toneAndStyle.score,
      tips: feedback.toneAndStyle.tips,
    },
    {
      id: "content",
      title: "Content",
      score: feedback.content.score,
      tips: feedback.content.tips,
    },
    {
      id: "structure",
      title: "Structure",
      score: feedback.structure.score,
      tips: feedback.structure.tips,
    },
    {
      id: "skills",
      title: "Skills",
      score: feedback.skills.score,
      tips: feedback.skills.tips,
    },
  ]

  return (
    <section className="w-full space-y-4">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-400">
          Detailed feedback
        </p>
        <h2 className="!text-3xl !font-semibold !tracking-[-0.04em] !text-slate-950 sm:!text-4xl">
          Where the resume is strong and where to tighten it next.
        </h2>
      </div>

      <Accordion defaultOpen="tone-style" className="space-y-4">
        {sections.map((section) => (
          <AccordionItem key={section.id} id={section.id}>
            <AccordionHeader itemId={section.id}>
              <CategoryHeader
                title={section.title}
                categoryScore={section.score}
                tipCount={section.tips.length}
              />
            </AccordionHeader>
            <AccordionContent itemId={section.id}>
              <CategoryContent tips={section.tips} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}

export default Details
