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
  // page still renders and the client retries the same query key. No retry
  // here — the axios timeout is 15s, and retrying on the server would hold the
  // RSC render open for a minute before giving the client anything to draw.
  await queryClient.prefetchQuery({
    queryKey: ["tasks"],
    queryFn: () => taskApi.getAll(),
    retry: false,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BrowsePage />
    </HydrationBoundary>
  );
}
