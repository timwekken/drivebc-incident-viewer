import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dbo from "./server/db-connection.js";
import getMajorEventsWithPolylines from "./server/get-events-with-polylines.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dbo.connectToServer();

app.get("/api/v1/get_polylines", (req, res) => {
  // get all event ids from the req
  const eventIds = req.query?.eventIds;
  // Get the evnts and polylines from the db
  getMajorEventsWithPolylines(eventIds)
    .then((results) => {
      res.json(results);
    })
    .catch((err) => {
      res.send("Error fetching listings!");
    });
});

// Frontend
app.use("/", express.static(path.join(__dirname, "public")));
app.get("/*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const { PORT = 80 } = process.env;
app.listen(PORT, () => {
  console.log();
  console.log(`  App running in port ${PORT}`);
  console.log();
  console.log(`  > Local: \x1b[36mhttp://localhost:\x1b[1m${PORT}/\x1b[0m`);
});
