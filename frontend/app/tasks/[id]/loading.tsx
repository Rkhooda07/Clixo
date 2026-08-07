import { Skeleton } from "@/components/ui/Skeleton";

export default function TaskDetailLoading() {
  return (
    <div className="flex flex-col gap-6 p-10">
      <Skeleton className="h-[120px] rounded-lg" />
      <Skeleton className="h-[320px] rounded-lg" />
      <Skeleton className="h-[240px] rounded-lg" />
      <Skeleton className="h-[200px] rounded-lg" />
    </div>
  );
}
