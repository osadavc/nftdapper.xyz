import { BsLightningChargeFill } from "react-icons/bs";
import { MdMoneyOffCsred, MdOutlineCodeOff } from "react-icons/md";

const whyData = [
  {
    title: "No Code",
    description:
      "You can build and launch a whole NFT drop without a single line of code.",
    icon: <MdOutlineCodeOff />,
  },
  {
    title: "No Fees *",
    description: "We don't charge you a fee from your earnings from NFT drop",
    icon: <MdMoneyOffCsred />,
  },
  {
    icon: <BsLightningChargeFill />,
    title: "Super Fast",
    description: "You can build and launch a whole NFT drop in seconds.",
  },
];

const WhySection = () => {
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-6 pt-32 pb-24">
      <h1 className="bg-gradient-to-br from-[#7880e7] to-[#2a3192] bg-clip-text text-center text-4xl font-bold text-transparent md:text-5xl md:!leading-[unset]">
        Why NFT Dapper ?
      </h1>
      <p className="mt-2 w-[80%] text-center text-lg capitalize md:text-xl">
        Why you should consider using NFT Dapper ? Seriously why ?
      </p>

      <div className="mt-20 grid grid-cols-1 gap-y-10 md:grid-cols-3 md:gap-y-0 md:gap-x-10">
        {whyData.map((item, key) => (
          <WhyCard key={key} item={item} />
        ))}
      </div>
    </div>
  );
};

const WhyCard = ({
  item,
}: {
  item: {
    icon: React.ReactNode;
    title: string;
    description: string;
  };
}) => {
  return (
    <div className="flex flex-col items-center text-center md:items-start md:text-left">
      <div className="mb-5 w-min rounded-md bg-gradient-to-br from-[#7880e7] to-[#2a3192] p-5 text-5xl text-white">
        {item.icon}
      </div>
      <h2 className="text-2xl font-semibold">{item.title}</h2>
      <p className="mt-2 text-lg">{item.description}</p>
    </div>
  );
};

export default WhySection;
