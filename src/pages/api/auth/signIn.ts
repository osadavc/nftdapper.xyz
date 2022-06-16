import { NextApiRequest, NextApiResponse } from "next";

import { User } from "@prisma/client";
import { JWT_SECRET } from "config";
import Cookies from "cookies";
import { SIGN_MESSAGE } from "data/constants";
import { ethers } from "ethers";
import jwt from "jsonwebtoken";
import nc from "next-connect";

import { onError, onNoMatch } from "utils/apiUtils";
import prisma from "utils/prisma";

const handler = nc<NextApiRequest, NextApiResponse>({
  onError,
  onNoMatch,
}).post(async (req, res) => {
  const { walletAddress, signature } = req.body;

  if (!walletAddress || !signature) {
    return res.status(400).json({
      error: "Missing walletAddress or signature",
    });
  }

  const signatureAddress = await ethers.utils.verifyMessage(
    SIGN_MESSAGE,
    signature
  );

  if (signatureAddress !== walletAddress) {
    return res.status(400).json({
      error: "Invalid signature",
    });
  }

  let user: User | null;

  user = await prisma.user.findFirst({
    where: {
      walletAddress,
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        walletAddress,
      },
    });
  }

  const accessToken = await jwt.sign(user, JWT_SECRET);

  const cookies = new Cookies(req, res);
  cookies.set("__nft_access_token__", accessToken, {
    httpOnly: true,
  });

  return res.status(200).json({
    status: 200,
  });
});

export default handler;
