"use client";

import {
  Address,
  ConnectButton,
  Connector,
  NFTCard,
  useAccount,
} from "@ant-design/web3";
import { createConfig, http, useReadContract, useWriteContract } from "wagmi";
import { mainnet } from "wagmi/chains";
import { OkxWallet, WagmiWeb3ConfigProvider } from "@ant-design/web3-wagmi";
import { Button, message } from "antd";
import { parseEther } from "viem";
import { writeContract } from "@wagmi/core";

const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(
      "https://mainnet.infura.io/v3/e28e06a003ae4942856f008e39a0f109",
    ),
  },
});

const CallTest = () => {
  const { account } = useAccount();
  console.log("account", account?.address as `0x${string}`);
  const result = useReadContract({
    abi: [
      {
        type: "function",
        name: "balanceOf",
        stateMutability: "view",
        inputs: [{ name: "account", type: "address" }],
        outputs: [{ type: "uint256" }],
      },
    ],
    address: "0xEcd0D12E21805803f70de03B72B1C162dB0898d9",
    functionName: "balanceOf",
    args: [account?.address as `0x${string}`],
  });
  console.log("result", result);

  const { writeContract } = useWriteContract();

  return (
    <div>
      {result.data?.toString()}
      <Button
        onClick={() => {
          writeContract(
            {
              abi: [
                {
                  type: "function",
                  name: "mint",
                  stateMutability: "payable",
                  inputs: [
                    {
                      internalType: "uint256",
                      name: "quantity",
                      type: "uint256",
                    },
                  ],
                  outputs: [],
                },
              ],
              address: "0xEcd0D12E21805803f70de03B72B1C162dB0898d9",
              functionName: "mint",
              args: [1],
              value: parseEther("0.01"),
            },
            {
              onSuccess: () => {
                message.success("mint success");
              },
              onError: (err: any) => {
                message.error(err.message);
              },
            },
          );
        }}
      >
        Mint
      </Button>
    </div>
  );
};

export default function Page() {
  return (
    <WagmiWeb3ConfigProvider
      eip6963={{ autoAddInjectedWallets: true }}
      config={config}
      wallets={[OkxWallet()]}
    >
      <Address format address="0xEcd0D12E21805803f70de03B72B1C162dB0898d9" />
      <NFTCard
        address="0xEcd0D12E21805803f70de03B72B1C162dB0898d9"
        tokenId={641}
      />
      <Connector>
        <ConnectButton />
      </Connector>
      <CallTest />
    </WagmiWeb3ConfigProvider>
  );
}

// async function getAccount() {
//   const accounts = await window.ethereum
//     ?.request({method: "eth_requestAccounts"})
//     .catch((err: any) => {
//       if (err.code === 4001) {
//         console.log("please connect metamask");
//       } else {
//         console.log(err)
//       }
//     });
//   return accounts[0]
// }