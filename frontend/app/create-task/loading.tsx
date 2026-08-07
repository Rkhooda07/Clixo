import { Skeleton } from "@/components/ui/Skeleton";
import { PageWrapper } from "@/components/layout/PageWrapper";

export default function CreateTaskLoading() {
  return (
    <PageWrapper>
      <div className="mx-auto max-w-[800px] pt-10 pb-12">
        <div className="mb-8 flex gap-4">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-3 w-24" />
          ))}
        </div>
        <div className="flex items-start gap-6">
          <Skeleton className="h-[420px] min-w-0 flex-1 rounded-lg" />
          <Skeleton className="hidden h-[220px] w-[220px] shrink-0 rounded-lg lg:block" />
        </div>
      </div>
    </PageWrapper>
  );
}
