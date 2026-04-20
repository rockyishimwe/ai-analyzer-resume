import { AlertTriangle } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router"
import { ResumeCardSkeleton } from "~/components/LoadingSkeletons"
import Navbar from "~/components/Navbar"
import ResumeCard from "~/components/ResumeCard"
import { Alert, AlertDescription } from "~/components/ui/alert"
import { Button } from "~/components/ui/button"
import { useToast } from "~/hooks/useToast"
import { usePuterStore } from "~/lib/puter"

export const meta = () => [
  { title: "Resumind | Dashboard" },
  {
    name: "description",
    content:
      "Review saved resume analyses, track application feedback, and upload a fresh resume from your Resumind dashboard.",
  },
]

export default function Dashboard() {
  const { auth, isLoading, kv } = usePuterStore()
  const { error: showError } = useToast()
  const navigate = useNavigate()

  const [resumes, setResumes] = useState<Resume[]>([])
  const [loadingResumes, setLoadingResumes] = useState(true)
  const [loadError, setLoadError] = useState("")

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate("/auth?next=/dashboard")
    }
  }, [auth.isAuthenticated, isLoading, navigate])

  useEffect(() => {
    if (!auth.isAuthenticated) {
      setLoadingResumes(false)
      return
    }

    let cancelled = false

    const loadResumes = async () => {
      try {
        setLoadingResumes(true)
        setLoadError("")

        const resumeItems = (await kv.list("resume:*", true)) as
          | KVItem[]
          | undefined

        const parsedResumes = (resumeItems ?? []).map(
          (resume) => JSON.parse(resume.value) as Resume
        )

        if (!cancelled) {
          setResumes(parsedResumes)
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load resumes"

        if (!cancelled) {
          setLoadError(message)
          showError(message)
        }
      } finally {
        if (!cancelled) {
          setLoadingResumes(false)
        }
      }
    }

    void loadResumes()

    return () => {
      cancelled = true
    }
  }, [auth.isAuthenticated, kv, showError])

  const averageScore = resumes.length
    ? Math.round(
        resumes.reduce((sum, resume) => sum + resume.feedback.overallScore, 0) /
          resumes.length
      )
    : 0
  const bestScore = resumes.length
    ? Math.max(...resumes.map((resume) => resume.feedback.overallScore))
    : 0

  const stats = [
    { label: "Saved reviews", value: resumes.length, hint: "Tracked in your workspace" },
    { label: "Average score", value: averageScore, hint: "Across uploaded resumes" },
    { label: "Best score", value: bestScore, hint: "Your strongest submission so far" },
  ]

  return (
    <main className="!pt-0 overflow-hidden bg-[#f6f8fc]">
      <div className="absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(circle_at_top_left,_rgba(255,199,186,0.8),_transparent_38%),radial-gradient(circle_at_top_right,_rgba(155,189,255,0.72),_transparent_34%),linear-gradient(180deg,_#fffdfd_0%,_#f6f8fc_52%,_#f3f6fb_100%)]" />
      <Navbar />

      <section className="px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-10">
          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[36px] border border-white/80 bg-white/85 p-8 shadow-[0_28px_80px_rgba(15,23,42,0.1)] backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-400">
                Private dashboard
              </p>
              <h1 className="mt-4 !text-5xl !leading-[1.03] !tracking-[-0.05em] !text-slate-950 sm:!text-6xl">
                Your resume review workspace.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                Keep every scored submission in one place, jump back into detailed
                feedback, and keep pushing each application toward a stronger next draft.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="rounded-full px-6">
                  <Link to="/upload">Upload Resume</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full border-slate-200 bg-white/80 px-6"
                >
                  <Link to="/">View Project Intro</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[28px] border border-white/80 bg-white/82 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
                    {item.label}
                  </p>
                  <div className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-slate-950">
                    {item.value}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{item.hint}</p>
                </div>
              ))}
            </div>
          </div>

          {loadError && (
            <Alert variant="destructive" className="max-w-2xl">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{loadError}</AlertDescription>
            </Alert>
          )}

          {loadingResumes && (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <ResumeCardSkeleton key={item} />
              ))}
            </div>
          )}

          {!loadingResumes && resumes.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {resumes.map((resume) => (
                <ResumeCard key={resume.id} resume={resume} />
              ))}
            </div>
          )}

          {!loadingResumes && resumes.length === 0 && !loadError && (
            <div className="rounded-[36px] border border-white/80 bg-white/85 p-10 text-center shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-400">
                No saved reviews yet
              </p>
              <h2 className="mt-4 !text-3xl !font-semibold !tracking-[-0.04em] !text-slate-950">
                Start with one resume and build your review history from there.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-600">
                Upload a resume, pair it with the role details, and Resumind will
                generate ATS feedback, scoring, and concrete revision guidance.
              </p>

              <Button asChild size="lg" className="mt-8 rounded-full px-6">
                <Link to="/upload">Upload Resume</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
