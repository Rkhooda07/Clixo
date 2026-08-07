import { Skeleton } from "@/components/ui/Skeleton";
import { PageWrapper } from "@/components/layout/PageWrapper";

export default function DashboardLoading() {
  return (
    <div className="flex flex-1 flex-col">
      <PageWrapper className="pt-8 pb-6">
        <Skeleton className="h-[104px] rounded-lg" />
      </PageWrapper>

      <PageWrapper className="flex items-end justify-between gap-4 border-b border-line">
        <div className="flex gap-6 pb-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="mb-1.5 h-[30px] w-[110px] rounded-md" />
      </PageWrapper>

      <PageWrapper className="flex flex-col gap-3 py-6">
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="h-12 rounded-md" />
        ))}
      </PageWrapper>
    </div>
  );
}
