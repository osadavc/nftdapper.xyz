import { ethers } from "ethers";
import useStore from "store";
import { useContractRead, useBalance } from "wagmi";
import StatCard from "./StatCard";

const Overview = () => {
  const openedProject = useStore((state) => state.openedProject);

  const { data: totalSupply } = useContractRead(
    {
      addressOrName: openedProject?.smartContract?.contractAddress!,
      contractInterface:
        openedProject?.smartContract?.abi &&
        JSON.parse(openedProject?.smartContract?.abi!),
    },
    "totalSupply"
  );

  const { data: balance } = useBalance({
    addressOrName: openedProject?.smartContract?.contractAddress!,
  });

  return (
    <div className="mt-3 px-6">
      <div className="mb-3">
        <p className="text-center text-sm text-gray-500">
          Go through above steps to setup your NFT drop. After setting it up,
          you will start seeing your statistics below.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <StatCard title="Total NFTs Minted" count={totalSupply?.toString()!} />
        <StatCard
          title="NFT Public Sale Price"
          count={
            openedProject?.smartContract?.mintFee
              ? `${openedProject.smartContract.mintFee} Ξ`
              : openedProject?.smartContract?.contractAddress
              ? "FREE"
              : "-"
          }
        />
        <StatCard
          title="Balance Of The Contract"
          count={
            ethers.utils.formatEther(balance?.value ?? 0).toString() ?? null
          }
          suffix={" Ξ"}
        />
      </div>
    </div>
  );
};

export default Overview;
