import { PageWrapper } from "@/components/layout/PageWrapper";
import { EmptyState } from "@/components/ui/EmptyState";

export default function NotFound() {
  return (
    <PageWrapper className="flex flex-1 flex-col justify-center py-16">
      <EmptyState
        message="This page doesn't exist."
        detail="The link may be broken, or the task may have been removed."
        action={{ label: "Browse open tasks", href: "/browse" }}
      />
    </PageWrapper>
  );
}
