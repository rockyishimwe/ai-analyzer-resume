import { useEffect, useId, useRef, useState } from "react"
import { cn } from "~/lib/utils"

const getGaugeTone = (score: number) => {
  if (score >= 70) {
    return {
      text: "text-emerald-600",
      start: "#34d399",
      end: "#38bdf8",
      track: "#dbeafe",
      label: "Strong fit",
    }
  }

  if (score >= 50) {
    return {
      text: "text-amber-600",
      start: "#f59e0b",
      end: "#fb7185",
      track: "#fde68a",
      label: "Promising",
    }
  }

  return {
    text: "text-rose-600",
    start: "#fb7185",
    end: "#f97316",
    track: "#fecdd3",
    label: "Needs work",
  }
}

const ScoreGauge = ({ score = 75 }: { score: number }) => {
  const [pathLength, setPathLength] = useState(0)
  const pathRef = useRef<SVGPathElement>(null)
  const gradientId = useId()
  const percentage = Math.min(Math.max(score / 100, 0), 1)
  const tone = getGaugeTone(score)

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength())
    }
  }, [])

  return (
    <div className="rounded-[30px] border border-white/80 bg-white/80 px-6 py-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
      <div className="relative h-28 w-52">
        <svg viewBox="0 0 100 50" className="h-full w-full">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={tone.start} />
              <stop offset="100%" stopColor={tone.end} />
            </linearGradient>
          </defs>

          <path
            d="M10,50 A40,40 0 0,1 90,50"
            fill="none"
            stroke={tone.track}
            strokeWidth="10"
            strokeLinecap="round"
          />

          <path
            ref={pathRef}
            d="M10,50 A40,40 0 0,1 90,50"
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={pathLength || 1}
            strokeDashoffset={(pathLength || 1) * (1 - percentage)}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pt-5">
          <div className="text-3xl font-semibold tracking-[-0.04em] text-slate-950">
            {score}
          </div>
          <div className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
            out of 100
          </div>
        </div>
      </div>

      <div className="mt-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          Overall match
        </p>
        <p className={cn("mt-2 text-sm font-semibold", tone.text)}>{tone.label}</p>
      </div>
    </div>
  )
}

export default ScoreGauge
