import { generateSmartContract } from "utils/generateSmartContract";

const SmartContract = () => {
  console.log(
    generateSmartContract({
      features: {
        maxMintCount: true,
        delayedReveal: false,
        mintMultiple: false,
        paidMint: false,
        pausable: true,
        saleStartingTime: true,
      },
      maxSupply: 1000000,
      tokenName: "Test Token",
      tokenSymbol: "TT",
      saleStartTime: 1,
    })
  );

  return (
    <div>
      <h1>Smart Contract</h1>
    </div>
  );
};

export default SmartContract;
