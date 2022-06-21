import useStore from "store";
import StatCard from "./StatCard";

const Overview = () => {
  const openedProject = useStore((state) => state.openedProject);

  return (
    <div className="mt-3 px-6">
      <div className="mb-3">
        <p className="text-center text-sm text-gray-500">
          Go through above steps to setup your NFT drop. After setting it up,
          you will start seeing your statistics below.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <StatCard title="Total NFTs Minted" count={null} />
        <StatCard title="NFT Public Sale Price" count={null} />
        <StatCard title="Balance Of The Contract" count={null} suffix={"Ξ"} />
      </div>
    </div>
  );
};

export default Overview;
