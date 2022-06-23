import { Chain, SmartContractFeatures } from "@prisma/client";

import prisma from "./prisma";

const select = {
  chainId: true,
  description: true,
  name: true,
  id: true,
  ownerId: true,
  owner: true,
  smartContract: {
    select: {
      features: true,
      abi: true,
      contractAddress: true,
      maxMintAmount: true,
      mintFee: true,
      saleStartingTime: true,
    },
  },
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
  // console.log({
  //   projectId,
  //   ownerId,
  //   abi,
  //   features,
  //   maxMintAmount: parseInt(maxMintAmount?.toString()!),
  //   mintFee: parseFloat(mintFee?.toString()!),
  //   saleStartingTime: saleStartingTime?.toString(),
  // });

  const fetchedProject = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: ownerId,
    },
  });

  if (!fetchedProject) {
    throw new Error("Project not found");
  }

  const result = await prisma.smartContract.create({
    data: {
      abi,
      features: {
        create: features,
      },
      maxMintAmount: maxMintAmount && parseInt(maxMintAmount?.toString()!),
      mintFee: mintFee && parseFloat(mintFee?.toString()!),
      saleStartingTime: saleStartingTime
        ? saleStartingTime?.toString()
        : undefined,
      Project: {
        connect: {
          id: projectId,
        },
      },
    },
    include: {
      features: true,
      Project: true,
    },
  });

  return result;
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
