import { Card, CardContent, CardHeader } from "~/components/ui/card"
import { Skeleton } from "~/components/ui/skeleton"

export const ResumeCardSkeleton = () => (
  <Card className="h-full rounded-[30px] border border-white/80 bg-white/82 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
    <CardHeader className="pb-4">
      <Skeleton className="h-4 w-24 rounded-full" />
      <Skeleton className="mt-3 h-8 w-2/3 rounded-full" />
      <Skeleton className="mt-2 h-5 w-1/2 rounded-full" />
    </CardHeader>
    <CardContent className="flex flex-col gap-5">
      <Skeleton className="h-[340px] w-full rounded-[26px] max-sm:h-[220px]" />
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32 rounded-full" />
          <Skeleton className="h-4 w-48 rounded-full" />
        </div>
        <Skeleton className="h-24 w-24 rounded-full" />
      </div>
    </CardContent>
  </Card>
)

export const SummaryCardSkeleton = () => (
  <Card className="rounded-[34px] border border-white/80 bg-white/85 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
    <div className="h-24" />
    <CardContent className="space-y-6 p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
        <Skeleton className="h-44 w-52 rounded-[30px]" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-10 w-3/5 rounded-full" />
          <Skeleton className="h-4 w-full rounded-full" />
          <Skeleton className="h-4 w-4/5 rounded-full" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((item) => (
          <Card key={item} className="rounded-[24px]">
            <CardContent className="p-5">
              <Skeleton className="h-5 w-1/2 rounded-full" />
              <Skeleton className="mt-3 h-4 w-full rounded-full" />
              <Skeleton className="mt-2 h-4 w-2/3 rounded-full" />
              <Skeleton className="mt-4 h-2 w-full rounded-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </CardContent>
  </Card>
)

export const ATSSkeleton = () => (
  <Card className="rounded-[34px] border border-white/80 bg-white/85 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
    <div className="h-16" />
    <CardContent className="space-y-6 p-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
        <Skeleton className="h-40 rounded-[28px]" />
        <Skeleton className="h-40 rounded-[28px]" />
      </div>
      <Skeleton className="h-2 w-full rounded-full" />
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-56 rounded-[26px]" />
        <Skeleton className="h-56 rounded-[26px]" />
      </div>
    </CardContent>
  </Card>
)

export const DetailsPageSkeleton = () => (
  <div className="space-y-8">
    <Skeleton className="h-8 w-1/3 rounded-full" />
    <SummaryCardSkeleton />
    <ATSSkeleton />
    {[1, 2, 3].map((item) => (
      <Card
        key={item}
        className="rounded-[30px] border border-white/80 bg-white/85 shadow-[0_18px_45px_rgba(15,23,42,0.06)]"
      >
        <CardHeader>
          <Skeleton className="h-8 w-1/2 rounded-full" />
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-48 rounded-[26px]" />
          <Skeleton className="h-48 rounded-[26px]" />
        </CardContent>
      </Card>
    ))}
  </div>
)
