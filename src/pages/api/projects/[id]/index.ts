import { NextApiResponse } from "next";
import nc from "next-connect";

import {
  auth,
  onError,
  onNoMatch,
  NextApiRequestWithUser,
} from "utils/apiUtils";
import { updateProject } from "utils/dbCalls";

const handler = nc<NextApiRequestWithUser, NextApiResponse>({
  onError,
  onNoMatch,
})
  .use(auth)
  .patch(async (req, res) => {
    const { id } = req.query;
    const { projectName, description, chainId } = req.body;

    if (typeof id != "string") {
      return res.status(400).send("Invalid project id");
    }

    const project = await updateProject({
      ownerId: req.user.id,
      projectId: id,
      name: projectName,
      chainId,
      description,
    });

    res.status(200).json(project);
  });

export default handler;
