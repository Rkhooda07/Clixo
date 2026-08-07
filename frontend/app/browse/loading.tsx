import { Skeleton, TaskCardSkeleton } from "@/components/ui/Skeleton";
import { PageWrapper } from "@/components/layout/PageWrapper";

export default function BrowseLoading() {
  return (
    <PageWrapper className="flex flex-1 flex-col">
      <div className="flex flex-col gap-5 pt-10 pb-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-2.5 w-16" />
            <Skeleton className="h-6 w-40" />
          </div>
          <Skeleton className="h-[34px] w-[240px] rounded-md" />
        </div>
        <Skeleton className="h-8 w-[320px]" />
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4 pb-10">
        {Array.from({ length: 6 }, (_, i) => (
          <TaskCardSkeleton key={i} />
        ))}
      </div>
    </PageWrapper>
  );
}
