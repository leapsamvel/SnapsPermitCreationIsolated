import React from "react";
import { Keplr, Window as KeplrWindow } from "@keplr-wallet/types";
import "./App.css";
import {
  connectSnap,
  getSnap,
  CosmjsOfflineSigner,
  suggestChain,
  getKey,
} from "@leapwallet/cosmos-snap-provider";

function App() {
  return (
    <div className="App">
      <button onClick={() => keplr()}>Connect + Create Permit in Keplr</button>
      <button onClick={() => leap()}>Connect + Create Permit in Leap</button>
      <button onClick={() => metamaskCosmosSnap()}>
        Connect + Create Permit in Metamask with Metamask Cosmos Snap
      </button>
      <button onClick={() => cosmosSnapProvider()}>
        Connect + Create Permit in Metamask with Cosmos Snap Provider
      </button>
    </div>
  );
}

const chainId = "archway-1";

const keplr = async () => {
  const walletExtensionClient = window.keplr!;
  await walletExtensionClient.experimentalSuggestChain(chainConfig);
  await walletExtensionClient.enable(chainId);
  walletExtensionClient.defaultOptions = {
    sign: {
      preferNoSetFee: true,
      preferNoSetMemo: true,
    },
  };
  const offlineSigner = await walletExtensionClient.getOfflineSignerAuto(
    chainId
  );
  const account = (await offlineSigner.getAccounts())[0];
  //@ts-ignore
  const { signature } = await window.keplr.signAmino(
    chainId,
    account.address,
    {
      account_number: "0", // Must be 0
      chain_id: chainId,
      fee: {
        amount: [
          {
            denom: "aarch",
            amount: "0",
          },
        ],
        gas: "0",
      },
      memo: "", // Must be empty
      msgs: [
        {
          type: "permit",
          value: "Astrovault User Permit",
        },
      ],
      sequence: "0", // Must be 0
    },
    {
      preferNoSetFee: true, // Fee must be 0, so hide it from the user
      preferNoSetMemo: true, // Memo must be empty, so hide it from the user
    }
  );

  console.log("KEPLR", signature);
};

const leap = async () => {
  const walletExtensionClient = window.leap!;
  await walletExtensionClient.experimentalSuggestChain(chainConfig);
  await walletExtensionClient.enable(chainId);
  walletExtensionClient.defaultOptions = {
    sign: {
      preferNoSetFee: true,
      preferNoSetMemo: true,
    },
  };
  const offlineSigner = await walletExtensionClient.getOfflineSignerAuto(
    chainId
  );
  const account = (await offlineSigner.getAccounts())[0];
  //@ts-ignore
  const { signature } = await window.leap.signAmino(
    chainId,
    account.address,
    {
      account_number: "0", // Must be 0
      chain_id: chainId,
      fee: {
        amount: [
          {
            denom: "aarch",
            amount: "0",
          },
        ],
        gas: "0",
      },
      memo: "", // Must be empty
      msgs: [
        {
          type: "permit",
          value: "Astrovault User Permit",
        },
      ],
      sequence: "0", // Must be 0
    },
    {
      preferNoSetFee: true, // Fee must be 0, so hide it from the user
      preferNoSetMemo: true, // Memo must be empty, so hide it from the user
    }
  );

  console.log("LEAP", signature);
};

const metamaskCosmosSnap = async () => {
  const snapInstalled = await getSnap();
  if (!snapInstalled) {
    await connectSnap(); // Initiates installation if not already present
  }
  await suggestChain(chainConfig, {});
  const accountRaw = await getKey(chainId);

  const request = {
    method: "wallet_invokeSnap",
    params: {
      snapId: "npm:@leapwallet/metamask-cosmos-snap",
      request: {
        method: "signAmino",
        params: {
          chainId: chainId,
          signerAddress: accountRaw.address,
          signDoc: {
            account_number: "0", // Must be 0
            chain_id: chainId,
            fee: {
              amount: [
                {
                  denom: "aarch",
                  amount: "0",
                },
              ],
              gas: "0",
            },
            memo: "", // Must be empty
            msgs: [
              {
                type: "permit",
                value: "Astrovault User Permit",
              },
            ],
            sequence: "0", // Must be 0
          },
          isADR36: true
        },
      },
    },
  };
  const { signature } = await window.ethereum.request(request);

  console.log("MetamaskCosmosSnap", signature);
};

const cosmosSnapProvider = async () => {
  const snapInstalled = await getSnap();
  if (!snapInstalled) {
    await connectSnap(); // Initiates installation if not already present
  }
  await suggestChain(chainConfig, {});
  const offlineSigner = new CosmjsOfflineSigner(chainId);
  const accountRaw = await getKey(chainId);

  const { signature } = await offlineSigner.signAmino(
    accountRaw.address,
    {
      account_number: "0", // Must be 0
      chain_id: chainId,
      fee: {
        amount: [
          {
            denom: "aarch",
            amount: "0",
          },
        ],
        gas: "0",
      },
      memo: "", // Must be empty
      msgs: [
        {
          type: "permit",
          value: "Astrovault User Permit",
        },
      ],
      sequence: "0", // Must be 0
    },
    {
      preferNoSetFee: true, // Fee must be 0, so hide it from the user
      isADR36: true
    }
  );

  console.log("CosmosSnapProvider", signature);
};

export default App;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends KeplrWindow {
    leap?: Keplr;
    ethereum?: any;
  }
}

export const chainConfig = {
  bech32Config: {
    bech32PrefixAccAddr: "archway",
    bech32PrefixAccPub: "archwaypub",
    bech32PrefixConsAddr: "archwayvalcons",
    bech32PrefixConsPub: "archwayvalconspub",
    bech32PrefixValAddr: "archwayvaloper",
    bech32PrefixValPub: "archwayvaloperpub",
  },
  bip44: {
    coinType: 118,
  },
  chainId: "archway-1",
  chainName: "Archway",
  chainSymbolImageUrl:
    "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/archway/chain.png",
  currencies: [
    {
      coinDecimals: 18,
      coinDenom: "ARCH",
      coinGeckoId: "archway",
      coinMinimalDenom: "aarch",
    },
  ],
  features: ["cosmwasm"],
  feeCurrencies: [
    {
      coinDecimals: 18,
      coinDenom: "ARCH",
      coinGeckoId: "archway",
      coinMinimalDenom: "aarch",
      gasPriceStep: {
        low: 1000000000000,
        average: 1500000000000,
        high: 2000000000000,
      },
    },
  ],
  rest: "https://api.mainnet.archway.io",
  rpc: "https://rpc.mainnet.archway.io",
  stakeCurrency: {
    coinDecimals: 18,
    coinDenom: "ARCH",
    coinGeckoId: "archway",
    coinMinimalDenom: "aarch",
  },
  nodeProvider: {
    name: "Phi Labs",
    email: "support@philabs.xyz",
    website: "https://philabs.xyz",
  },
  walletUrlForStaking: "https://wallet.keplr.app/chains/archway",
};
