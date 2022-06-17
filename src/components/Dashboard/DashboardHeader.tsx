import { ActionIcon, Tooltip } from "@mantine/core";
import { FC } from "react";
import { TbPlus } from "react-icons/tb";

interface DashboardHeaderProps {
  toggleDrawer: () => void;
}

const DashboardHeader: FC<DashboardHeaderProps> = ({ toggleDrawer }) => {
  return (
    <div className="text-2xl flex items-center">
      <div className="flex-grow font-nunito">
        <h3 className="font-bold">Projects</h3>
        <h4 className="text-base font-inter capitalize">
          Create Or Manage Your Projects Below
        </h4>
      </div>

      <Tooltip label="Create New Project">
        <ActionIcon
          className="bg-black text-white hover:bg-black/90"
          onClick={toggleDrawer}
        >
          <TbPlus />
        </ActionIcon>
      </Tooltip>
    </div>
  );
};

export default DashboardHeader;
