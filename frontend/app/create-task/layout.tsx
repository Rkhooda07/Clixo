export const metadata = {
  title: "Post a Task",
};

/**
 * Metadata only, on purpose. loading.tsx is the Suspense fallback that lives
 * inside this layout, so anything imported here has to download and execute
 * before the skeleton can paint. The wallet stack (~694 kB raw) used to be
 * imported right here; it now sits inside the page, below the boundary.
 */
export default function CreateTaskLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
