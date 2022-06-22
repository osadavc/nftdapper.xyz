import { NextApiResponse } from "next";
import nc from "next-connect";
import solc from "solc";

import {
  auth,
  onError,
  onNoMatch,
  NextApiRequestWithUser,
} from "utils/apiUtils";

const handler = nc<NextApiRequestWithUser, NextApiResponse>({
  onError,
  onNoMatch,
})
  .use(auth)
  .post((req, res) => {
    solc.compile("");
  });

export default handler;
