import type { NextApiRequest, NextApiResponse } from "next";
import updateEventsForDatetime from "../../server/update-events-for-datetime";

const AUTHORIZATION_KEY = "W2Q9URmYZH";

/**
 * API handler for updating events with polylines (for currently active events)
 * @param {NextApiRequest} req - The Next.js API request object which should include a key in the query
 * @param {NextApiResponse} res - The Next.js API response object.
 * @returns {Promise<void>} - A Promise that resolves to void.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Check if the authorization key is included in the query parameters
    const { key } = req.query;
    if (key !== AUTHORIZATION_KEY) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    // If the authorization key is correct, proceed to update events
    const results = await updateEventsForDatetime();
    return res.status(200).json(results);
  } catch (err) {
    console.error("Error updating events:", err);
    return res.status(500).json({ error: "Error updating events" });
  }
}
