// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import dbo from "../../server/db-connection";
import getEventsWithPolylines from "../../server/get-events-with-polylines";

// TODO: configure types instead of any

dbo.connectToServer();

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  // get all event ids from the req
  const eventIds = req.query?.["date"];
  // Get the evnts and polylines from the db
  getEventsWithPolylines(eventIds as string[])
    .then((results) => {
      res.status(200).json(results);
    })
    .catch((err) => {
      res.status(400).json({ error: "Error fetching listings!" });
    });
}
