import type { NextApiRequest, NextApiResponse } from "next";
import dbo from "../../server/db-connection";
import updateEventsForDatetime from "../../server/update-events-for-datetime";

dbo.connectToServer();

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.query.key !== 'W2Q9URmYZH') {
    res.status(404).end();
    return;
  }
  updateEventsForDatetime()
    .then((results) => {
      res.status(200).json(results);
    })
    .catch((err) => {
      res.status(400).json({ error: "Error fetching listings!" });
    });
}
