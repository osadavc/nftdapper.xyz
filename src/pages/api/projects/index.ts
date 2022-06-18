import { NextApiResponse } from "next";

import nc from "next-connect";

import {
  auth,
  onError,
  onNoMatch,
  NextApiRequestWithUser,
} from "utils/apiUtils";
import { createANewProject, getAllProjectsFromAUser } from "utils/dbCalls";

const handler = nc<NextApiRequestWithUser, NextApiResponse>({
  onError,
  onNoMatch,
})
  .use(auth)
  .get(async (req, res) => {
    const projects = await getAllProjectsFromAUser(req.user.id);
    res.status(200).json(projects);
  })
  .post(async (req, res) => {
    const { name, chainId, description } = req.body;

    if (!name || !chainId || !description) {
      res.status(400).json({
        error: "Missing required fields",
      });
    }

    const project = await createANewProject({
      chainId,
      name,
      description,
      ownerId: req.user.id,
    });

    res.status(200).json(project);
  });

export default handler;
