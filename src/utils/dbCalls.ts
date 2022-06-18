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
  description,
}: {
  ownerId: string;
  name: string;
  chainId: number;
  description: string;
}) => {
  const project = await prisma.project.create({
    data: {
      name,
      chainId: `CHAIN${chainId}` as Chain,
      ownerId,
      description,
    },
    select: {
      name: true,
      id: true,
      chainId: true,
      description: true,
    },
  });

  return project;
};

export const getProjectOfAUser = async ({
  projectId,
  ownerId,
}: {
  projectId: string;
  ownerId: string;
}) => {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: ownerId,
    },
  });

  return project;
};
