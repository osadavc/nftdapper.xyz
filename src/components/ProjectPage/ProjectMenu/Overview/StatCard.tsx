import { FC } from "react";

interface StatCardProps {
  title: string | null;
  count: string | null;
  suffix?: string;
}

const StatCard: FC<StatCardProps> = ({ title, count, suffix = "" }) => {
  return (
    <div className="h-full w-full rounded-md bg-[#fcfcfc] p-5 text-center">
      <h1 className="font-nunito font-semibold">{title}</h1>
      <h3 className="mt-1 font-black">
        {count ?? "-"}
        {count && suffix}
      </h3>
    </div>
  );
};

export default StatCard;
