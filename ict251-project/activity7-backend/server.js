require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");
const { notFound, errorHandler } = require("./middleware/errors");
const { guidePage } = require("./guide");

const app = express();

// Hosts such as Render sit behind a proxy; this makes req.protocol "https".
app.set("trust proxy", 1);

// Browser origins allowed to call the API (your Activity 8 frontend).
const origins = (process.env.CLIENT_ORIGINS || "")
  .split(",").map(value => value.trim()).filter(Boolean);
app.use(cors({ origin: origins }));
app.use(express.json({ limit: "10kb" }));

// GET / : readable API guide for the marker
app.get("/", (req, res) => {
  const baseUrl = process.env.PUBLIC_URL || `${req.protocol}://${req.get("host")}`;
  res.status(200).type("html").send(guidePage(baseUrl.replace(/\/+$/, "")));
});

// GET /health : checks that the server and the database both respond
app.get("/health", (req, res) => {
  try {
    db.prepare("SELECT 1").get();
    res.status(200).json({ status: "ok", database: "ok" });
  } catch (error) {
    console.error("Health check failed:", error.message);
    res.status(503).json({ status: "error", database: "unavailable", message: "Database is not responding." });
  }
});

app.use("/api/records", require("./routes/records"));

// These two must stay last.
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(port, "0.0.0.0", () => {
    console.log(`Server listening on port ${port}`);
  });
}

module.exports = app;
