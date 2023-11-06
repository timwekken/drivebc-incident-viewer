import type { NextApiRequest, NextApiResponse } from "next";
import getEventsWithPolylines from "../../server/get-events-with-polylines";

/**
 * API handler for retrieving events with polylines based on provided event IDs.
 * @param {NextApiRequest} req - The Next.js API request object which should include 'eventIds[]' query.
 * @param {NextApiResponse} res - The Next.js API response object.
 * @returns {Promise<void>} - A Promise that resolves to void.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const eventIds = req.query?.["eventIds[]"] as string[];
  try {
    if (!eventIds || !Array.isArray(eventIds)) {
      return res
        .status(400)
        .json({ error: "Invalid or missing 'eventIds[]' parameter." });
    }
    // Get the events and polylines from the db
    const events = await getEventsWithPolylines(eventIds);
    if (!events) {
      return res
        .status(404)
        .json({ error: "Events not found for the provided IDs." });
    }
    res.status(200).json(events);
  } catch (err) {
    console.error("Error fetching listings:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
}
