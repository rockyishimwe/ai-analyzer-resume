import type { ReactNode } from "react"
import { Card, CardContent } from "~/components/ui/card"
import { cn } from "~/lib/utils"

interface ScoreCardProps {
  title: string
  score: number
  maxScore?: number
  icon?: ReactNode
  description?: string
  showProgress?: boolean
}

const getScoreTone = (score: number) => {
  if (score >= 70) {
    return {
      badge: "border-emerald-100 bg-emerald-50 text-emerald-700",
      progress: "from-emerald-400 to-cyan-400",
    }
  }

  if (score >= 50) {
    return {
      badge: "border-amber-100 bg-amber-50 text-amber-700",
      progress: "from-amber-400 to-rose-400",
    }
  }

  return {
    badge: "border-rose-100 bg-rose-50 text-rose-700",
    progress: "from-rose-400 to-orange-400",
  }
}

export const ScoreCard = ({
  title,
  score,
  maxScore = 100,
  icon,
  description,
  showProgress = false,
}: ScoreCardProps) => {
  const percentage = Math.min((score / maxScore) * 100, 100)
  const tone = getScoreTone(score)

  return (
    <Card className="w-full rounded-[24px] border border-slate-200 bg-[#fbfcff] shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              {icon}
              <h3 className="text-base font-semibold text-slate-950">{title}</h3>
            </div>
            {description && (
              <p className="text-sm leading-6 text-slate-600">{description}</p>
            )}

            {showProgress && (
              <div className="mt-4">
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={cn(
                      "h-full rounded-full bg-gradient-to-r transition-all duration-500",
                      tone.progress
                    )}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div
            className={cn(
              "rounded-full border px-3 py-1 text-sm font-semibold",
              tone.badge
            )}
          >
            {score}/{maxScore}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
