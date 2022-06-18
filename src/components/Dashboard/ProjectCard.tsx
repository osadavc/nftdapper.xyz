import Link from "next/link";

import { Tooltip } from "@mantine/core";
import { Project } from "@prisma/client";
import { CHAINS } from "data/constants";
import { FC } from "react";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: FC<ProjectCardProps> = ({ project }) => {
  const chainInformation = CHAINS.find(
    (item) => item.value == parseInt(project.chainId.slice(5))
  );

  return (
    <Link href={`/dashboard/${project.id}`}>
      <div className="flex w-full cursor-pointer justify-between rounded-md border bg-gray-50 px-4 py-5 hover:border-[#7880e7]">
        <div className="flex flex-col">
          <h2 className="font-inter font-medium">{project.name}</h2>
          <p className="mt-[0.1rem] text-zinc-500">{project.description}</p>
        </div>

        <div className="flex items-center space-x-2">
          <Tooltip label={chainInformation?.name}>
            <img
              src={chainInformation?.image}
              alt={`${project.name} Logo`}
              className="h-5 w-5 rounded-full"
            />
          </Tooltip>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
