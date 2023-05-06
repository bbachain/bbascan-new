import { WalletAdapterNetwork, WalletError } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import {
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { Cluster, clusterApiUrl } from '@solana/web3.js';
import { FC, ReactNode, useCallback, useMemo } from 'react';
import { AutoConnectProvider, useAutoConnect } from './AutoConnectProvider';
import { notify } from "../utils/notifications";
import { NetworkConfigurationProvider, useNetworkConfiguration } from './NetworkConfigurationProvider';
import dynamic from "next/dynamic";
import { SupplyProvider } from './SupplyProvider';
import { ClusterProvider } from './ClusterProvider';
import { StatsInfoProvider } from './StatsInfoProvider';

const ReactUIWalletModalProviderDynamic = dynamic(
  async () =>
  (await import("@solana/wallet-adapter-react-ui")).WalletModalProvider,
  { ssr: false }
);

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { autoConnect } = useAutoConnect();
  const { networkConfiguration } = useNetworkConfiguration();
  const network = networkConfiguration as WalletAdapterNetwork;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new SolflareWalletAdapter(),
    ],
    []
  );

  const onError = useCallback(
    (error: WalletError) => {
      notify({ type: 'error', message: error.message ? `${error.name}: ${error.message}` : error.name });
      console.error(error);
    },
    []
  );

  return (
    // TODO: updates needed for updating and referencing endpoint: wallet adapter rework
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} onError={onError} autoConnect={autoConnect}>
        <ReactUIWalletModalProviderDynamic>
          {children}
        </ReactUIWalletModalProviderDynamic>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export const ContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ClusterProvider>
      <StatsInfoProvider>
        <SupplyProvider>
          <NetworkConfigurationProvider>
            <AutoConnectProvider>
              <WalletContextProvider>{children}</WalletContextProvider>
            </AutoConnectProvider>
          </NetworkConfigurationProvider>
        </SupplyProvider>
      </StatsInfoProvider>
    </ClusterProvider>
  );
};
