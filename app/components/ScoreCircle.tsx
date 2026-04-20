import { useId } from "react"
import { cn } from "~/lib/utils"

const getScoreTone = (score: number) => {
  if (score >= 70) {
    return {
      innerClass: "bg-emerald-50",
      track: "#d1fae5",
      start: "#34d399",
      end: "#38bdf8",
    }
  }

  if (score >= 50) {
    return {
      innerClass: "bg-amber-50",
      track: "#fde68a",
      start: "#f59e0b",
      end: "#fb7185",
    }
  }

  return {
    innerClass: "bg-rose-50",
    track: "#fecdd3",
    start: "#fb7185",
    end: "#f97316",
  }
}

const ScoreCircle = ({ score = 75 }: { score: number }) => {
  const radius = 40
  const stroke = 8
  const normalizedRadius = radius - stroke / 2
  const circumference = 2 * Math.PI * normalizedRadius
  const progress = score / 100
  const strokeDashoffset = circumference * (1 - progress)
  const gradientId = useId()
  const tone = getScoreTone(score)

  return (
    <div className="relative flex h-24 w-24 items-center justify-center">
      <div className={cn("absolute inset-[18px] rounded-full", tone.innerClass)} />

      <svg
        height="100%"
        width="100%"
        viewBox="0 0 100 100"
        className="relative z-10 -rotate-90"
      >
        <circle
          cx="50"
          cy="50"
          r={normalizedRadius}
          stroke={tone.track}
          strokeWidth={stroke}
          fill="transparent"
        />
        <defs>
          <linearGradient id={gradientId} x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={tone.start} />
            <stop offset="100%" stopColor={tone.end} />
          </linearGradient>
        </defs>
        <circle
          cx="50"
          cy="50"
          r={normalizedRadius}
          stroke={`url(#${gradientId})`}
          strokeWidth={stroke}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>

      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
        <span className="text-[0.6rem] font-semibold uppercase tracking-[0.24em] text-slate-400">
          Score
        </span>
        <span className="text-sm font-semibold text-slate-950">{score}</span>
      </div>
    </div>
  )
}

export default ScoreCircle
