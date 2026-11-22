// Final handler for any route that does not exist.
function notFound(req, res) {
  res.status(404).json({ message: "Route not found." });
}

// Error middleware: it must have exactly four parameters.
// eslint-disable-next-line no-unused-vars
function errorHandler(error, req, res, next) {
  // Malformed JSON from body parsing -> 400.
  if (error.type === "entity.parse.failed" || error instanceof SyntaxError) {
    return res.status(400).json({ message: "Request body must be valid JSON." });
  }
  if (error.type === "entity.too.large") {
    return res.status(400).json({ message: "Request body is too large." });
  }

  // Anything else is unexpected: log the details, hide them from the client.
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`, error);
  res.status(500).json({ message: "Unexpected server error. Please try again." });
}

module.exports = { notFound, errorHandler };
