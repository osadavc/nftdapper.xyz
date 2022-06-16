import { NextApiResponse } from "next";

import nc from "next-connect";

import {
  auth,
  NextApiRequestWithUser,
  onError,
  onNoMatch,
} from "utils/apiUtils";

const handler = nc<NextApiRequestWithUser, NextApiResponse>({
  onError,
  onNoMatch,
})
  .use(auth)
  .get((req, res) => {
    res.status(200).json({
      status: 200,
      message: "Hello World",
    });
  });

export default handler;
