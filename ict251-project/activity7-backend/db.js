require("dotenv").config();
const fs = require("fs");
const path = require("path");
// Built into Node.js 22.13+ (no npm package needed).
const { DatabaseSync } = require("node:sqlite");

const file = process.env.DB_PATH || path.join(__dirname, "data", "maintenance.db");
fs.mkdirSync(path.dirname(file), { recursive: true });

const db = new DatabaseSync(file);

// Create the table, and insert the starting records only when it is empty.
// Running this on every start is safe: nothing is duplicated or overwritten.
db.exec(fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8"));
const { total } = db.prepare("SELECT COUNT(*) AS total FROM records").get();
if (total === 0 && String(process.env.SKIP_SEED).toLowerCase() !== "true") {
  db.exec(fs.readFileSync(path.join(__dirname, "seed.sql"), "utf8"));
}

module.exports = db;
