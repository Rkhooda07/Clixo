import { WalletProviders } from "@/components/wallet/WalletProviders";

export const metadata = {
  title: "Give Your Opinion",
};

export default function VoteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WalletProviders reconnectOnMount={false}>{children}</WalletProviders>;
}
