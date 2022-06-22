import { NextApiResponse } from "next";
import nc from "next-connect";
import solc from "solc";
import fs from "fs";
import path from "path";

import {
  auth,
  onError,
  onNoMatch,
  NextApiRequestWithUser,
} from "utils/apiUtils";
import { generateSmartContract } from "utils/generateSmartContract";

const openzeppelinPath = path.join(
  "node_modules",
  "@openzeppelin",
  "contracts"
);

const erc721aPath = path.join("node_modules", "erc721a", "contracts");

const findImports = (filePath: string) => {
  if (filePath.startsWith("erc721a")) {
    const erc721source = fs.readFileSync(
      path.join(erc721aPath, ...filePath.split("/").slice(2)),
      {
        encoding: "utf8",
      }
    );

    return { contents: erc721source };
  }

  const openzeppelinSource = fs.readFileSync(
    path.join(openzeppelinPath, ...filePath.split("/").slice(2)),
    {
      encoding: "utf8",
    }
  );

  return { contents: openzeppelinSource };
};

const handler = nc<NextApiRequestWithUser, NextApiResponse>({
  onError,
  onNoMatch,
})
  .use(auth)
  .post((req, res) => {
    interface RequestBody {
      collectionName: string;
      collectionSymbol: string;
      maxSupply: number;
      pausable: boolean;
      saleStartingTime: boolean;
      mintMultiple: boolean;
      paidMint: boolean;
      maxNumber?: number;
      mintFee?: number;
      saleStartingTimeInput?: number;
    }

    const body = req.body as RequestBody;

    const { code, name } = generateSmartContract({
      features: {
        mintMultiple: body.mintMultiple,
        paidMint: body.paidMint,
        pausable: body.pausable,
        saleStartingTime: body.saleStartingTime,
        delayedReveal: false,
      },
      tokenName: body.collectionName,
      tokenSymbol: body.collectionSymbol,
      maxSupply: body.maxSupply,
      maxNumberOfTokens: body.mintMultiple ? body.maxNumber : undefined,
      price: body.paidMint ? body.mintFee : undefined,
      saleStartTime: body.saleStartingTimeInput
        ? body.saleStartingTimeInput
        : undefined,
    });

    const compilerInput = {
      language: "Solidity",
      sources: {
        "contract.sol": {
          content: code,
        },
      },

      settings: {
        outputSelection: {
          "*": {
            "*": ["*"],
          },
        },
      },
    };

    const output = JSON.parse(
      solc.compile(JSON.stringify(compilerInput), { import: findImports })
    );

    const deployerInfo = {
      abi: output.contracts["contract.sol"][name].abi,
      bytecode: output.contracts["contract.sol"][name].evm.bytecode.object,
    };

    res.status(200).send(deployerInfo);
  });

export default handler;
