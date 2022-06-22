import { existsSync } from "fs";
import { NextApiResponse } from "next";
import nc from "next-connect";
import path from "path";

import { onError, onNoMatch, NextApiRequestWithUser } from "utils/apiUtils";

const openzeppelinPath = path.join(
  "node_modules",
  "@openzeppelin",
  "contracts",
  "package.json"
);

const erc721aPath = path.join(
  "node_modules",
  "erc721a",
  "contracts",
  "IERC721A.sol"
);

const handler = nc<NextApiRequestWithUser, NextApiResponse>({
  onError,
  onNoMatch,
}).get((req, res) => {
  const isOpenZeppelin = existsSync(openzeppelinPath);
  const erc721a = existsSync(erc721aPath);

  if (isOpenZeppelin && erc721a) {
    return res.status(200).json({ message: "pong" });
  }

  return res.status(500).json({ message: "contracts not found" });
});

export default handler;
