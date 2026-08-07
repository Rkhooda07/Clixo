import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { taskApi } from "@/lib/api";
import { BrowsePage } from "@/components/browse/BrowsePage";

// The task list is public, so it can be fetched on the server and stream in
// with the HTML instead of waiting for hydration. loading.tsx is the Suspense
// boundary, so the shell still paints immediately.
export const revalidate = 30;

export default async function BrowseRoute() {
  // A per-request client — never the module singleton, which on the server
  // would be shared across every visitor.
  const queryClient = new QueryClient();

  // prefetchQuery swallows errors by design: if the API is unreachable the
  // page still renders and the client retries the same query key.
  await queryClient.prefetchQuery({
    queryKey: ["tasks"],
    queryFn: () => taskApi.getAll(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BrowsePage />
    </HydrationBoundary>
  );
}
