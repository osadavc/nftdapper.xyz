import { useEffect, useState } from "react";
import useStore from "store";
import { useContractRead, useProvider } from "wagmi";
import StatCard from "./StatCard";

const Overview = () => {
  const openedProject = useStore((state) => state.openedProject);
  const provider = useProvider();

  const [balance, setBalance] = useState<string | null>(null);

  const { data: totalSupply } = useContractRead(
    {
      addressOrName: openedProject?.smartContract?.contractAddress!,
      contractInterface:
        openedProject?.smartContract?.abi &&
        JSON.parse(openedProject?.smartContract?.abi!),
    },
    "totalSupply"
  );

  useEffect(() => {
    if (!openedProject?.smartContract?.contractAddress) return;

    (async () => {
      const balance = await provider.getBalance(
        openedProject?.smartContract?.contractAddress!
      );
      setBalance(balance.toString());
    })();
  }, [openedProject]);

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
              ? `${openedProject.smartContract.mintFee} ETH`
              : openedProject?.smartContract?.contractAddress
              ? "FREE"
              : "-"
          }
        />
        <StatCard
          title="Balance Of The Contract"
          count={balance}
          suffix={"Ξ"}
        />
      </div>
    </div>
  );
};

export default Overview;
