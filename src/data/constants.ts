export const SIGN_MESSAGE =
  "Sign This Message To Get Access To NFT Dapper. This won't trigger any transactions or cost any gas.";

export const CHAINS = [
  {
    name: "Ethereum Mainnet",
    value: 1,
    isTestnet: false,
  },
  {
    name: "Polygon Mainnet",
    value: 137,
    isTestnet: false,
  },
  {
    name: "Rinkeby Testnet",
    value: 4,
    isTestnet: true,
  },
  {
    name: "Mumbai Testnet",
    value: 80001,
    isTestnet: true,
  },
  {
    name: "Solana",
    value: 0,
    isTestnet: false,
    disabled: true,
  },
];
