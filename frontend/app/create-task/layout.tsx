import { WalletProviders } from "@/components/wallet/WalletProviders";

export const metadata = {
  title: "Post a Task",
};

export default function CreateTaskLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WalletProviders reconnectOnMount={false}>{children}</WalletProviders>;
}
