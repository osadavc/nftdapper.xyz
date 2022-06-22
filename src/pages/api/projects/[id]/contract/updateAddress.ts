import { NextApiResponse } from "next";
import nc from "next-connect";

import {
  auth,
  onError,
  onNoMatch,
  NextApiRequestWithUser,
} from "utils/apiUtils";
import { updateAddress } from "utils/dbCalls";

const handler = nc<NextApiRequestWithUser, NextApiResponse>({
  onError,
  onNoMatch,
})
  .use(auth)
  .post(async (req, res) => {
    const { id } = req.query;
    const { address } = req.body;

    if (typeof id !== "string") {
      return res.status(400).json({ message: "invalid project id" });
    }

    const project = await updateAddress({
      address,
      ownerId: req.user.id,
      projectId: id,
    });

    return res.status(200).json(project);
  });

export default handler;
