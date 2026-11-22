// Optional: prepares the database and reports how many records it holds.
// Run with: npm run setup   (db.js already does this on every server start)
const db = require("../db");
const { total } = db.prepare("SELECT COUNT(*) AS total FROM records").get();
console.log(`Database ready. 'records' table holds ${total} record(s).`);
db.close();
