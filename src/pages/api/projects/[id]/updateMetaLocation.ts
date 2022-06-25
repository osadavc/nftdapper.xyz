import { NextApiResponse } from "next";
import nc from "next-connect";

import {
  auth,
  onError,
  onNoMatch,
  NextApiRequestWithUser,
} from "utils/apiUtils";
import { updateMetadataLocation } from "utils/dbCalls";

const handler = nc<NextApiRequestWithUser, NextApiResponse>({
  onError,
  onNoMatch,
})
  .use(auth)
  .patch(async (req, res) => {
    const { id } = req.query;
    const { ipfsHash, isJSON } = req.body;

    if (typeof id !== "string")
      return res.status(400).json({ error: "Invalid id" });

    const project = await updateMetadataLocation({
      metadataHash: ipfsHash,
      metadataSuffix: isJSON ? "json" : "",
      ownerId: req.user.id,
      projectId: id,
    });

    res.status(200).json(project);
  });

export default handler;
