"use client";

import { WalletProviders } from "./WalletProviders";
import { ConnectButton } from "./ConnectButton";

/**
 * The navbar's wallet entry point, bundled together with the wallet stack it
 * needs. The Navbar pulls this in via next/dynamic, so wagmi/RainbowKit land
 * in an async chunk that never blocks first paint or hydration.
 *
 * The navbar instance is the one that owns reconnect-on-mount: it is present
 * on every route, so the handshake fires exactly once per page load.
 */
export function NavbarWallet({
  reconnectOnMount = true,
}: {
  reconnectOnMount?: boolean;
}) {
  return (
    <WalletProviders reconnectOnMount={reconnectOnMount}>
      <ConnectButton />
    </WalletProviders>
  );
}
