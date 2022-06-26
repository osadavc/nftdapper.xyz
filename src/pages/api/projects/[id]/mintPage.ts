import { Location } from "@prisma/client";
import { NextApiResponse } from "next";
import nc from "next-connect";

import {
  auth,
  onError,
  onNoMatch,
  NextApiRequestWithUser,
} from "utils/apiUtils";
import { setMintingPageDetails } from "utils/dbCalls";

const handler = nc<NextApiRequestWithUser, NextApiResponse>({
  onError,
  onNoMatch,
})
  .use(auth)
  .patch(async (req, res) => {
    const { id } = req.query;
    const { location, input } = req.body;

    if (typeof id != "string") {
      return res.status(400).send("Invalid project id");
    }

    const project = await setMintingPageDetails({
      projectId: id,
      ownerId: req.user.id,
      domain:
        location == "subdomain"
          ? `${input}.${process.env.NEXT_PUBLIC_ROOT_URL}`
          : input,
      location: location as Location,
    });

    res.status(200).send(project);
  });

export default handler;
