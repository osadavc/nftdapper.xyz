import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
  PreviewData,
} from "next";

import { JWT_SECRET } from "config";
import Cookies from "cookies";
import jwt from "jsonwebtoken";
import { ParsedUrlQuery } from "querystring";

export interface User {
  id: string;
  walletAddress: string;
}

export interface NextApiRequestWithUser extends NextApiRequest {
  user: User;
}

export const onError = (
  err: any,
  req: NextApiRequest,
  res: NextApiResponse
) => {
  console.log(err);
  res.status(500).json({ statusCode: 500, message: err.message });
};

export const onNoMatch = (req: NextApiRequest, res: NextApiResponse) => {
  res.status(404).json({ statusCode: 404, message: "Not Found" });
};

export const auth = async (
  req: NextApiRequestWithUser,
  res: NextApiResponse,
  next: Function
) => {
  const cookies = new Cookies(req, res);
  const accessToken = cookies.get("__nft_access_token__");

  if (!accessToken) {
    return res.status(401).json({
      statusCode: 401,
      message: "Unauthorized",
    });
  }

  const payload = await jwt.verify(accessToken, JWT_SECRET);

  if (!payload) {
    return res.status(401).json({
      status: 401,
      error: "Unauthorized",
    });
  }

  req.user = payload as User;
  next();
};

export const getUser = async ({
  req,
  res,
}: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) => {
  const cookies = new Cookies(req, res);
  const accessToken = cookies.get("__nft_access_token__");

  if (!accessToken) {
    return null;
  }

  const payload = await jwt.verify(accessToken, JWT_SECRET);

  if (!payload) {
    return null;
  }

  return payload;
};
