import { ethers } from "ethers";
import useStore from "store";
import { useContract } from "wagmi";

const ContractControls = () => {
  const openedProject = useStore((state) => state.openedProject);
  const contract = useContract({
    addressOrName: openedProject?.smartContract?.contractAddress!,
    contractInterface:
      openedProject?.smartContract?.abi &&
      JSON.parse(openedProject?.smartContract?.abi!),
  }) as ethers.Contract;

  return (
    <div className="space-y-8">
      {openedProject?.smartContract?.features.pausable && (
        <div>
          <h2 className="text-xl">
            Feature: <span className="font-semibold">Pausable</span>
          </h2>
        </div>
      )}

      {openedProject?.smartContract?.features.mintMultiple && (
        <div>
          <h2 className="text-xl">
            Feature: <span className="font-semibold">Mint Multiple</span>
          </h2>
        </div>
      )}

      {openedProject?.smartContract?.features.paidMint && (
        <div>
          <h2 className="text-xl">
            Feature: <span className="font-semibold">Paid Mint</span>
          </h2>
        </div>
      )}

      {openedProject?.smartContract?.features.saleStartingTime && (
        <div>
          <h2 className="text-xl">
            Feature: <span className="font-semibold">Sale Starting Time</span>
          </h2>
        </div>
      )}
    </div>
  );
};

export default ContractControls;
