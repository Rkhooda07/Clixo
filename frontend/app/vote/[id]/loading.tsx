import { Skeleton } from "@/components/ui/Skeleton";
import { PageWrapper } from "@/components/layout/PageWrapper";

export default function VoteLoading() {
  return (
    <>
      {/* Desktop: gallery on the left, task context rail on the right */}
      <div className="hidden flex-1 md:flex">
        <div className="grid flex-[0_0_60%] grid-cols-2 content-start gap-4 p-10">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="aspect-video rounded-lg" />
          ))}
        </div>
        <div className="flex flex-[0_0_40%] flex-col gap-4 border-l border-line bg-surface px-6 py-8">
          <Skeleton className="h-2.5 w-28" />
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-8 w-32" />
          <div className="mt-auto">
            <Skeleton className="h-[38px] w-full rounded-md" />
          </div>
        </div>
      </div>

      {/* Mobile: stacked gallery */}
      <PageWrapper className="flex flex-col gap-4 py-4 md:hidden">
        <Skeleton className="h-14 rounded-md" />
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="aspect-video rounded-lg" />
        ))}
      </PageWrapper>
    </>
  );
}
