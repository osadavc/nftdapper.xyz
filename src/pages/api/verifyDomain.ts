import { NextApiResponse } from "next";
import nc from "next-connect";

import { onError, onNoMatch, NextApiRequestWithUser } from "utils/apiUtils";
import { getProjectFromDomain } from "utils/dbCalls";

const handler = nc<NextApiRequestWithUser, NextApiResponse>({
  onError,
  onNoMatch,
}).all(async (req, res) => {
  const domain = req.query.domain as string;
  const project = await getProjectFromDomain(domain);

  if (!project) {
    return res.status(404).json({
      error: "Project not found",
    });
  }

  return res.status(200).json(project);
});

export default handler;
