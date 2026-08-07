import { WalletProviders } from "@/components/wallet/WalletProviders";

export const metadata = {
  title: "Dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WalletProviders reconnectOnMount={false}>{children}</WalletProviders>;
}
