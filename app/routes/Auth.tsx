import { useEffect, useState } from "react"
import { FileText, LayoutDashboard, Sparkles } from "lucide-react"
import { useLocation, useNavigate } from "react-router"
import Navbar from "~/components/Navbar"
import { Button } from "~/components/ui/button"
import { usePuterStore } from "~/lib/puter"

const authHighlights = [
  {
    title: "Save each review",
    description: "Keep ATS scores and improvement notes attached to every upload.",
    icon: FileText,
  },
  {
    title: "Pick up where you left off",
    description: "Return to the dashboard without losing earlier feedback cycles.",
    icon: LayoutDashboard,
  },
  {
    title: "Use sharper guidance",
    description: "Turn every upload into concrete, role-specific revision steps.",
    icon: Sparkles,
  },
]

export const meta = () => [
  { title: "Resumind | Auth" },
  { name: "description", content: "Log into your account" },
]

const Auth = () => {
  const { isLoading, auth } = usePuterStore()
  const location = useLocation()
  const next = new URLSearchParams(location.search).get("next") || "/dashboard"
  const navigate = useNavigate()
  const [authAction, setAuthAction] = useState<"sign-in" | "sign-out" | null>(
    null
  )

  useEffect(() => {
    if (!isLoading && auth.isAuthenticated) {
      navigate(next, { replace: true })
    }
  }, [auth.isAuthenticated, isLoading, navigate, next])

  useEffect(() => {
    if (!isLoading) {
      setAuthAction(null)
    }
  }, [isLoading])

  const handleSignIn = async () => {
    setAuthAction("sign-in")
    await auth.signIn()
  }

  const handleSignOut = async () => {
    setAuthAction("sign-out")
    await auth.signOut()
  }

  return (
    <main className="!pt-0 overflow-hidden bg-[#f6f8fc]">
      <div className="absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(circle_at_top_left,_rgba(255,199,186,0.82),_transparent_36%),radial-gradient(circle_at_top_right,_rgba(155,189,255,0.72),_transparent_32%),linear-gradient(180deg,_#fffdfd_0%,_#f6f8fc_52%,_#f3f6fb_100%)]" />
      <Navbar />

      <section className="px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[36px] bg-slate-950 p-8 text-white shadow-[0_28px_80px_rgba(15,23,42,0.18)]">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/45">
              Sign in to continue
            </p>
            <h1 className="mt-4 !text-5xl !leading-[1.03] !tracking-[-0.05em] !text-white sm:!text-6xl">
              Your review workspace stays ready when you are.
            </h1>
            <p className="mt-5 text-base leading-8 text-slate-300 sm:text-lg">
              Logging in unlocks saved reviews, upload history, and the cleaner
              workflow behind the new Resumind interface.
            </p>
          </div>

          <div className="rounded-[36px] border border-white/80 bg-white/86 p-6 shadow-[0_28px_80px_rgba(15,23,42,0.1)] backdrop-blur lg:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-400">
              Account access
            </p>
            <h2 className="mt-3 !text-3xl !font-semibold !tracking-[-0.04em] !text-slate-950 sm:!text-4xl">
              Continue your resume review journey.
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Sign in to upload resumes, store AI feedback, and jump back into your
              dashboard whenever a new application comes up.
            </p>

            <div className="mt-8 grid gap-4">
              {authHighlights.map(({ title, description, icon: Icon }) => (
                <div
                  key={title}
                  className="rounded-[26px] border border-slate-200 bg-[#fbfcff] p-5 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-950">{title}</h3>
                      <p className="mt-2 text-sm leading-7 text-slate-600">
                        {description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              {isLoading ? (
                <Button className="h-14 w-full rounded-full text-base" disabled>
                  {authAction === "sign-in"
                    ? "Opening sign-in..."
                    : authAction === "sign-out"
                      ? "Signing you out..."
                      : "Checking your account..."}
                </Button>
              ) : auth.isAuthenticated ? (
                <Button
                  variant="outline"
                  className="h-14 w-full rounded-full border-slate-200 bg-white text-base"
                  onClick={() => void handleSignOut()}
                >
                  Log Out
                </Button>
              ) : (
                <Button
                  className="h-14 w-full rounded-full text-base"
                  onClick={() => void handleSignIn()}
                >
                  Log In
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Auth
