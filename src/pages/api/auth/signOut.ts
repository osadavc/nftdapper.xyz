import {  NextApiResponse } from "next";

import Cookies from "cookies";
import nc from "next-connect";

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
  .delete((req, res) => {
    const cookies = new Cookies(req, res);
    cookies.set("__nft_access_token__");

    res.status(200).json({ message: "Logged out" });
  });

export default handler;
