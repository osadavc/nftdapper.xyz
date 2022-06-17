import { Chain } from "@prisma/client";

import prisma from "./prisma";

export const getAllProjectsFromAUser = async (userId: string) => {
  const projects = await prisma.project.findMany({
    where: {
      ownerId: userId,
    },
  });

  return projects;
};

export const createANewProject = async ({
  ownerId,
  name,
  chainId,
}: {
  ownerId: string;
  name: string;
  chainId: number;
}) => {
  const project = await prisma.project.create({
    data: {
      name,
      chainId: `CHAIN${chainId}` as Chain,
      ownerId,
    },
  });

  return project;
};
