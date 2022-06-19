import { Tooltip } from "@mantine/core";
import { Project } from "@prisma/client";
import { CHAINS } from "data/constants";
import { FC } from "react";

interface ProjectInfoProps {
  project: Project;
}

const ProjectInfo: FC<ProjectInfoProps> = ({ project }) => {
  const chainInformation = CHAINS.find(
    (item) => item.value == parseInt(project?.chainId.slice(5))
  );

  return (
    <div className="mb-6 flex items-center justify-between rounded-md bg-[#fcfcfc] py-3 px-5">
      <div className="flex flex-col">
        <h2 className="font-inter font-medium">{project?.name}</h2>
        <p className="text-zinc-500">{project?.description}</p>
      </div>

      <div className="flex items-center space-x-2">
        <Tooltip label={chainInformation?.name}>
          <img
            src={chainInformation?.image}
            alt={`${project?.name} Logo`}
            className="h-5 w-5 rounded-full"
          />
        </Tooltip>
      </div>
    </div>
  );
};

export default ProjectInfo;
