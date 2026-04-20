import {
  ArrowRight,
  BarChart3,
  FileText,
  Gauge,
  LayoutDashboard,
  Sparkles,
  Upload,
} from "lucide-react"
import { Link } from "react-router"
import Navbar from "~/components/Navbar"
import { Button } from "~/components/ui/button"
import { usePuterStore } from "~/lib/puter"

const featureCards = [
  {
    title: "Role-aware resume reviews",
    description:
      "Upload a resume, paste the job description, and get feedback grounded in the exact position you want.",
    icon: Sparkles,
  },
  {
    title: "ATS scoring with next steps",
    description:
      "See how your resume performs against structure, content, tone, and keyword alignment before you apply.",
    icon: Gauge,
  },
  {
    title: "One place for every submission",
    description:
      "Keep your reviewed resumes in a single dashboard so each draft and application is easy to revisit.",
    icon: LayoutDashboard,
  },
  {
    title: "Built for repeat improvement",
    description:
      "Use every review cycle to tighten bullet points, sharpen outcomes, and submit a stronger next version.",
    icon: FileText,
  },
]

const workflowSteps = [
  {
    title: "Upload your resume and role details",
    description:
      "Add the PDF, company name, job title, and job description so the review has real context.",
    icon: Upload,
  },
  {
    title: "Let the AI score the submission",
    description:
      "Resumind generates ATS feedback and practical suggestions instead of a vague pass-or-fail response.",
    icon: Sparkles,
  },
  {
    title: "Track progress from the dashboard",
    description:
      "Open past analyses any time, compare ideas, and keep momentum across multiple applications.",
    icon: BarChart3,
  },
]

const proofPoints = [
  { value: "ATS-ready", label: "scoring across key resume dimensions" },
  { value: "Role-specific", label: "feedback tailored to each job post" },
  { value: "Reusable", label: "saved reviews you can revisit later" },
]

export const meta = () => [
  { title: "Resumind | AI Resume Review Workspace" },
  {
    name: "description",
    content:
      "Resumind helps job seekers upload resumes, receive ATS feedback, and track every review from one dashboard.",
  },
]

export default function Home() {
  const { auth } = usePuterStore()

  const primaryHref = auth.isAuthenticated
    ? "/dashboard"
    : "/auth?next=/dashboard"
  const primaryLabel = auth.isAuthenticated ? "Open Dashboard" : "Start Reviewing"
  const secondaryHref = auth.isAuthenticated
    ? "/upload"
    : "/auth?next=/upload"
  const secondaryLabel = auth.isAuthenticated
    ? "Upload Another Resume"
    : "Upload Your First Resume"

  return (
    <main className="!pt-0 overflow-hidden bg-[#f6f8fc] text-slate-950">
      <div className="absolute inset-x-0 top-0 -z-10 h-[720px] bg-[radial-gradient(circle_at_top_left,_rgba(255,199,186,0.9),_transparent_38%),radial-gradient(circle_at_top_right,_rgba(155,189,255,0.75),_transparent_34%),linear-gradient(180deg,_#fffdfd_0%,_#f7f9fd_45%,_#f4f7fb_100%)]" />
      <Navbar />

      <section className="px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm backdrop-blur">
              <span className="inline-flex size-2 rounded-full bg-emerald-500" />
              Introducing Resumind
            </div>

            <div className="space-y-5">
              <h1 className="!max-w-3xl !text-5xl !leading-[1.03] !tracking-[-0.05em] !text-slate-950 sm:!text-6xl lg:!text-7xl">
                Turn every resume submission into a smarter next draft.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
                Resumind is the landing place for your resume review workflow:
                upload a resume, pair it with the role you want, receive AI-backed
                feedback, and keep each submission organized in one clean dashboard.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-full px-6">
                <Link to={primaryHref}>
                  {primaryLabel}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full border-slate-200 bg-white/80 px-6"
              >
                <Link to={secondaryHref}>{secondaryLabel}</Link>
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {proofPoints.map((item) => (
                <div
                  key={item.value}
                  className="rounded-[24px] border border-white/80 bg-white/75 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur"
                >
                  <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">
                    {item.value}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -left-10 top-12 h-40 w-40 rounded-full bg-[#ffb39f]/45 blur-3xl" />
            <div className="absolute right-2 top-0 h-52 w-52 rounded-full bg-[#98bdff]/45 blur-3xl" />

            <div className="relative rounded-[34px] border border-white/70 bg-white/82 p-5 shadow-[0_28px_90px_rgba(30,41,59,0.16)] backdrop-blur">
              <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="rounded-[28px] bg-[#f7f8fc] p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
                        Resume preview
                      </p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">
                        Frontend Engineer application
                      </p>
                    </div>
                    <div className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500 shadow-sm">
                      PDF uploaded
                    </div>
                  </div>
                  <img
                    src="/images/resume_01.png"
                    alt="Sample resume preview card"
                    className="h-[360px] w-full rounded-[22px] object-cover object-top shadow-[0_16px_50px_rgba(15,23,42,0.12)]"
                  />
                </div>

                <div className="space-y-4">
                  <div className="rounded-[28px] bg-slate-950 p-5 text-white shadow-[0_20px_40px_rgba(15,23,42,0.28)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/60">
                      ATS snapshot
                    </p>
                    <div className="mt-4 flex items-end gap-3">
                      <span className="text-5xl font-semibold">91</span>
                      <span className="mb-2 text-sm text-emerald-300">
                        Strong match
                      </span>
                    </div>
                    <div className="mt-4 h-2 rounded-full bg-white/10">
                      <div className="h-2 w-[78%] rounded-full bg-emerald-300" />
                    </div>
                    <p className="mt-4 text-sm leading-6 text-slate-300">
                      Clear structure, stronger keywords, and measurable impact
                      are all surfaced in one review.
                    </p>
                  </div>

                  <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
                      Improvement focus
                    </p>
                    <div className="mt-4 space-y-3">
                      {[
                        "Sharpen role-specific keywords",
                        "Quantify outcomes in experience bullets",
                        "Tighten the opening summary",
                      ].map((item) => (
                        <div
                          key={item}
                          className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-[38px] border border-white/80 bg-white/80 p-6 shadow-[0_26px_70px_rgba(15,23,42,0.08)] backdrop-blur lg:p-10">
          <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
            <div className="space-y-5">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-400">
                Project intro
              </p>
              <h2 className="!text-3xl !font-semibold !tracking-[-0.04em] !text-slate-950 sm:!text-4xl">
                A practical workspace for job seekers who want more than a resume score.
              </h2>
              <p className="text-base leading-8 text-slate-600 sm:text-lg">
                This project is designed to make resume improvement feel guided
                instead of guessy. Rather than dropping a file into a black box,
                users get specific feedback tied to the role, can revisit old
                analyses, and move through future applications with more clarity.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {featureCards.map(({ title, description, icon: Icon }) => (
                <article
                  key={title}
                  className="rounded-[28px] border border-slate-200 bg-[#fbfcff] p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(15,23,42,0.08)]"
                >
                  <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-slate-950">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="workflow" className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-400">
              Workflow
            </p>
            <h2 className="!text-3xl !font-semibold !tracking-[-0.04em] !text-slate-950 sm:!text-4xl">
              From upload to insight in three clear moves.
            </h2>
            <p className="mx-auto max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
              The landing experience introduces the product, while the workspace
              takes care of the real review cycle once you sign in.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {workflowSteps.map(({ title, description, icon: Icon }, index) => (
              <article
                key={title}
                className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]"
              >
                <div className="flex items-center justify-between">
                  <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-[#eef2ff] text-slate-950">
                    <Icon className="size-5" />
                  </div>
                  <span className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-300">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-slate-950">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-[40px] bg-slate-950 px-6 py-12 text-white shadow-[0_28px_80px_rgba(15,23,42,0.18)] sm:px-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/45">
                Ready to use it?
              </p>
              <h2 className="mt-4 !text-3xl !font-semibold !tracking-[-0.04em] !text-white sm:!text-4xl">
                Start the first review and let the project introduce itself through the workflow.
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-300">
                The new landing page explains the product clearly, and the dashboard
                is now waiting separately for actual resume reviews.
              </p>
            </div>

            <Button
              asChild
              size="lg"
              className="rounded-full bg-white px-6 text-slate-950 hover:bg-slate-100"
            >
              <Link to={secondaryHref}>
                {secondaryLabel}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
