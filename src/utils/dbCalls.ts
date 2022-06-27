import { Chain, SmartContractFeatures, Location } from "@prisma/client";
import axios from "axios";

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
    select: {
      ...select,
      metadataSuffix: true,
      metadataURL: true,
      mintPage: true,
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
  code,
}: {
  projectId: string;
  ownerId: string;
  abi: string;
  features: ContractFeatures;
  maxMintAmount?: number;
  mintFee?: number;
  saleStartingTime?: number;
  code: string;
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

  const result = await prisma.smartContract.create({
    data: {
      code,
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

export const updateContract = async ({
  projectId,
  ownerId,
  maxNumber,
  mintFee,
  saleStartingTimeInput,
}: {
  projectId: string;
  ownerId: string;
  maxNumber?: number;
  mintFee?: number;
  saleStartingTimeInput?: string;
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
          maxMintAmount: maxNumber && parseInt(maxNumber?.toString()!),
          mintFee: mintFee && parseFloat(mintFee?.toString()!),
          saleStartingTime: saleStartingTimeInput
            ? saleStartingTimeInput?.toString()
            : undefined,
        },
      },
    },
    select: {
      smartContract: true,
    },
  });

  return project;
};

export const updateMetadataLocation = async ({
  projectId,
  ownerId,
  metadataHash,
  metadataSuffix,
}: {
  projectId: string;
  ownerId: string;
  metadataHash: string;
  metadataSuffix: string;
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
      metadataURL: metadataHash,
      metadataSuffix: metadataSuffix ? ".json" : "",
    },
    select: {
      metadataSuffix: true,
      metadataURL: true,
      id: true,
    },
  });

  return project;
};

export const updateProject = async ({
  projectId,
  ownerId,
  name,
  description,
  chainId,
}: {
  projectId: string;
  ownerId: string;
  name: string;
  description: string;
  chainId: number;
}) => {
  const fetchedProject = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: ownerId,
    },
    select: {
      smartContract: {
        select: {
          contractAddress: true,
        },
      },
      chainId: true,
    },
  });

  if (!fetchedProject) {
    throw new Error("Project not found");
  }

  if (
    fetchedProject.smartContract?.contractAddress &&
    chainId != parseInt(fetchedProject.chainId.split("CHAIN")[1])
  ) {
    throw new Error("Cannot update project with deployed contract");
  }

  const project = await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      name,
      description,
      chainId: `CHAIN${chainId}` as Chain,
    },
    select: {
      name: true,
      description: true,
      chainId: true,
    },
  });

  return project;
};

export const setMintingPageDetails = async ({
  projectId,
  ownerId,
  location,
  domain,
}: {
  projectId: string;
  ownerId: string;
  location: Location;
  domain: string;
}) => {
  const fetchedProject = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: ownerId,
    },
    select: {
      metadataURL: true,
      metadataSuffix: true,
    },
  });

  if (!fetchedProject) {
    throw new Error("Project not found");
  }

  const imageList: string[] = [];

  for (let i = 1; i <= 5; i++) {
    const { data: metadata } = await axios.get(
      `https://ipfs.io/ipfs/${fetchedProject.metadataURL}/${i}${fetchedProject.metadataSuffix}`
    );

    imageList.push(`https://ipfs.io/ipfs/${metadata.image.split("//")[1]}`);
  }

  const project = prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      mintPage: {
        upsert: {
          create: {
            domain,
            location,
            imageList,
          },
          update: {
            domain,
            location,
            imageList,
          }
        },
      },
    },
    include: {
      mintPage: true,
    },
  });

  return project;
};

export const getProjectFromDomain = async (domain: string) => {
  const domainInfo = await prisma.project.findFirst({
    where: {
      mintPage: {
        domain,
      },
    },
    include: {
      mintPage: true,
      smartContract: {
        select: {
          contractAddress: true,
          abi: true,
          maxMintAmount: true,
          features: {
            select: {
              mintMultiple: true,
              paidMint: true,
            },
          },
        },
      },
    },
  });

  return domainInfo;
};
