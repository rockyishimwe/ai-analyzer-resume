import { ArrowRight, LogIn, LogOut } from "lucide-react"
import { Link, useLocation } from "react-router"
import { Button } from "~/components/ui/button"
import { usePuterStore } from "~/lib/puter"
import { cn } from "~/lib/utils"

const Navbar = () => {
  const location = useLocation()
  const { auth, isLoading } = usePuterStore()

  const isWorkspaceRoute =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/upload") ||
    location.pathname.startsWith("/resume")

  const dashboardHref = auth.isAuthenticated
    ? "/dashboard"
    : "/auth?next=/dashboard"
  const primaryHref = auth.isAuthenticated ? "/upload" : "/auth?next=/upload"
  const primaryLabel = auth.isAuthenticated ? "Upload Resume" : "Get Started"

  return (
    <header className="px-4 pt-4 sm:px-6 lg:px-8">
      <nav className="navbar sticky top-4 z-40 max-w-6xl border border-white/60 bg-white/80 px-4 py-3 shadow-[0_18px_45px_rgba(15,23,42,0.12)] backdrop-blur sm:px-6">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white">
              R
            </div>
            <div>
              <p className="text-lg font-semibold tracking-[0.2em] text-slate-950">
                RESUMIND
              </p>
              <p className="hidden text-xs text-slate-500 sm:block">
                AI resume review workspace
              </p>
            </div>
          </Link>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            to="/"
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950",
              location.pathname === "/" &&
                "bg-slate-950 text-white hover:bg-slate-950 hover:text-white"
            )}
          >
            Overview
          </Link>
          <Link
            to={dashboardHref}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950",
              isWorkspaceRoute &&
                "bg-slate-950 text-white hover:bg-slate-950 hover:text-white"
            )}
          >
            Dashboard
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {auth.isAuthenticated ? (
            <Button
              variant="outline"
              size="lg"
              className="hidden rounded-full border-slate-200 bg-white/70 sm:inline-flex"
              onClick={() => void auth.signOut()}
            >
              <LogOut className="size-4" />
              Log Out
            </Button>
          ) : (
            <Button
              asChild
              variant="outline"
              size="lg"
              className="hidden rounded-full border-slate-200 bg-white/70 sm:inline-flex"
            >
              <Link to="/auth?next=/dashboard">
                <LogIn className="size-4" />
                {isLoading ? "Checking..." : "Sign In"}
              </Link>
            </Button>
          )}

          <Button asChild size="lg" className="rounded-full px-4 sm:px-5">
            <Link to={primaryHref}>
              {primaryLabel}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
