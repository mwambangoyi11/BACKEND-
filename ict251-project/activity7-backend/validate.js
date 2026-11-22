// Shared validation rules (identical to the Activity 6 frontend).
// The backend never trusts the browser: every write is checked here.

const STATUSES = ["Pending", "In progress", "Completed"];
const MAX_ID = Number.MAX_SAFE_INTEGER; // ids beyond this cannot exist

// Returns { valid: true, id } or { valid: false, message }.
// "id" must be a positive whole number written with digits only.
function parseId(value) {
  if (typeof value !== "string" || !/^[1-9][0-9]*$/.test(value)) {
    return { valid: false, message: "Id must be a positive whole number." };
  }
  const id = Number(value);
  // A well-formed id larger than any stored id cannot exist: treat as "not found".
  return { valid: true, id, outOfRange: id > MAX_ID };
}

function checkText(value, label, min, max) {
  if (typeof value !== "string") {
    return { error: `${label} is required and must be text.` };
  }
  const text = value.trim();
  if (text.length < min || text.length > max) {
    return { error: `${label} must have ${min} to ${max} characters.` };
  }
  return { text };
}

// Validates the four editable fields. Any client-supplied id is ignored.
// Returns { valid: true, values: {title, category, description, status} }
// or { valid: false, message }.
function validateRecord(body) {
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    return { valid: false, message: "Request body must be a JSON object." };
  }

  const title = checkText(body.title, "Title", 3, 80);
  if (title.error) return { valid: false, message: title.error };

  const category = checkText(body.category, "Category", 2, 40);
  if (category.error) return { valid: false, message: category.error };

  const description = checkText(body.description, "Description", 5, 300);
  if (description.error) return { valid: false, message: description.error };

  if (typeof body.status !== "string") {
    return { valid: false, message: "Status is required and must be text." };
  }
  const status = body.status.trim();
  if (!STATUSES.includes(status)) {
    return {
      valid: false,
      message: "Status must be one of: Pending, In progress, Completed."
    };
  }

  return {
    valid: true,
    values: {
      title: title.text,
      category: category.text,
      description: description.text,
      status
    }
  };
}

module.exports = { STATUSES, parseId, validateRecord };
