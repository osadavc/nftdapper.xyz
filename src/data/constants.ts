export const SIGN_MESSAGE =
  "Sign This Message To Get Access To NFT Dapper. This won't trigger any transactions or cost any gas.";

export const CHAINS = [
  {
    name: "Ethereum Mainnet",
    value: 1,
    isTestnet: false,
    image: "/icons/networks/ethereum.png",
    blockExplorer: "https://etherscan.io/tx/",
  },
  {
    name: "Polygon Mainnet",
    value: 137,
    isTestnet: false,
    image: "/icons/networks/polygon.png",
    blockExplorer: "https://polygonscan.com/tx",
  },
  {
    name: "Rinkeby Testnet",
    value: 4,
    isTestnet: true,
    image: "/icons/networks/ethereum.png",
    blockExplorer: "https://rinkeby.etherscan.io/tx",
  },
  {
    name: "Mumbai Testnet",
    value: 80001,
    isTestnet: true,
    image: "/icons/networks/polygon.png",
    blockExplorer: "https://mumbai.polygonscan.com/tx",
  },
  {
    name: "Solana",
    value: 0,
    isTestnet: false,
    disabled: true,
    image: "/icons/networks/solana.png",
    blockExplorer: "https://explorer.solana.com/tx",
  },
];
