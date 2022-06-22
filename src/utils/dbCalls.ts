import { Chain, SmartContractFeatures } from "@prisma/client";

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

type ContractFeatures = Omit<SmartContractFeatures, "id" | "smartContractId">;

export const saveDraftProject = async ({
  projectId,
  ownerId,
  abi,
  features,
  maxMintAmount,
  mintFee,
  saleStartingTime,
}: {
  projectId: string;
  ownerId: string;
  abi: string;
  features: ContractFeatures;
  maxMintAmount?: number;
  mintFee?: number;
  saleStartingTime?: number;
}) => {
  const fetchedProject = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: ownerId,
    },
    select: {
      smartContract: true,
      chainId: true,
      name: true,
      description: true,
      id: true,
      ownerId: true,
      owner: true,
      smartContractId: true,
    },
  });

  if (!fetchedProject) {
    throw new Error("Project not found");
  }

  const project = await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      smartContract: {
        create: {
          abi,
          features: {
            create: features,
          },
          maxMintAmount,
          mintFee,
          saleStartingTime: saleStartingTime?.toString(),
        },
      },
    },
    select: {
      smartContract: true,
    },
  });

  return project;
};
