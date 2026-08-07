export const metadata = {
  title: "Browse Tasks",
};

// No WalletProviders here on purpose: browsing needs the auth token, not a
// wallet connection. The navbar's lazily-loaded connect button is the only
// wallet surface on this route.
export default function BrowseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
