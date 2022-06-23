import { Chain, SmartContractFeatures } from "@prisma/client";

import prisma from "./prisma";

const select = {
  chainId: true,
  description: true,
  name: true,
  id: true,
  ownerId: true,
  owner: true,
  smartContract: true,
  smartContractId: true,
};

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
    select,
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
          maxMintAmount: parseInt(maxMintAmount?.toString()!),
          mintFee: parseFloat(mintFee?.toString()!),
          saleStartingTime: saleStartingTime?.toString(),
        },
      },
    },
    include: {
      smartContract: true,
    },
  });

  return project;
};

export const updateAddress = async ({
  projectId,
  ownerId,
  address,
}: {
  projectId: string;
  ownerId: string;
  address: string;
}) => {
  const fetchedProject = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: ownerId,
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
        update: {
          contractAddress: address,
        },
      },
    },
    select,
  });

  return project;
};
