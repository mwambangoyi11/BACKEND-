const router = require("express").Router();
const db = require("../db");
const { parseId, validateRecord } = require("../validate");

const COLUMNS = "id, title, category, description, status";

// Sends a JSON error in the shared format { "message": "..." }.
function fail(res, status, message) {
  return res.status(status).json({ message });
}

// GET /api/records : read all records
router.get("/", (req, res, next) => {
  try {
    const rows = db.prepare(`SELECT ${COLUMNS} FROM records ORDER BY id`).all();
    res.status(200).json(rows);
  } catch (error) {
    next(error);
  }
});

// GET /api/records/:id : read one record
router.get("/:id", (req, res, next) => {
  try {
    const parsed = parseId(req.params.id);
    if (!parsed.valid) return fail(res, 400, parsed.message);
    if (parsed.outOfRange) return fail(res, 404, "Record not found.");

    const row = db.prepare(`SELECT ${COLUMNS} FROM records WHERE id = ?`).get(parsed.id);
    if (!row) return fail(res, 404, "Record not found.");
    res.status(200).json(row);
  } catch (error) {
    next(error);
  }
});

// POST /api/records : create a record (client id is ignored)
router.post("/", (req, res, next) => {
  try {
    const checked = validateRecord(req.body);
    if (!checked.valid) return fail(res, 400, checked.message);
    const { title, category, description, status } = checked.values;

    const row = db.prepare(
      "INSERT INTO records (title, category, description, status) " +
        `VALUES (?, ?, ?, ?) RETURNING ${COLUMNS}`
    ).get(title, category, description, status);
    res.status(201).json(row);
  } catch (error) {
    next(error);
  }
});

// PUT /api/records/:id : replace all four editable fields
router.put("/:id", (req, res, next) => {
  try {
    const parsed = parseId(req.params.id);
    if (!parsed.valid) return fail(res, 400, parsed.message);

    const checked = validateRecord(req.body);
    if (!checked.valid) return fail(res, 400, checked.message);
    if (parsed.outOfRange) return fail(res, 404, "Record not found.");
    const { title, category, description, status } = checked.values;

    const row = db.prepare(
      "UPDATE records SET title = ?, category = ?, description = ?, " +
        `status = ? WHERE id = ? RETURNING ${COLUMNS}`
    ).get(title, category, description, status, parsed.id);
    if (!row) return fail(res, 404, "Record not found.");
    res.status(200).json(row);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/records/:id : delete a record
router.delete("/:id", (req, res, next) => {
  try {
    const parsed = parseId(req.params.id);
    if (!parsed.valid) return fail(res, 400, parsed.message);
    if (parsed.outOfRange) return fail(res, 404, "Record not found.");

    const result = db.prepare("DELETE FROM records WHERE id = ?").run(parsed.id);
    if (result.changes === 0) return fail(res, 404, "Record not found.");
    res.status(200).json({ message: "Record deleted." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
