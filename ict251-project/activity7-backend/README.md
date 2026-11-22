# Activity 7 Backend: Campus Maintenance Requests API

Node.js + Express + SQLite REST API for the Activity 6 frontend.
Same four fields: `title`, `category`, `description`, `status` (plus generated `id`).
SQLite is Node's built-in `node:sqlite` module, so you only install express, cors and dotenv.
**Requires Node.js 22.13 or newer** (check with `node -v`; install the current LTS if lower).

## Files

| File | Purpose |
|---|---|
| `server.js` | App, CORS, `GET /` guide, `GET /health`, router mount, 404 and error handlers |
| `routes/records.js` | The five record routes |
| `validate.js` | Id and record validation (same rules as the frontend) |
| `middleware/errors.js` | Unknown-route 404 and error middleware (400 / 500) |
| `guide.js` | HTML for the API guide at `/` |
| `db.js` | Opens the SQLite file, creates the table, seeds it when empty |
| `schema.sql` / `seed.sql` | Table and nine made-up records |
| `data/maintenance.db` | Created automatically on first start |

## Run locally

1. `npm install` (also creates `package-lock.json`; commit it)
2. Edit `.env` and set `STUDENT_NUMBER`
3. `npm start`, then open http://localhost:3000

The table and the nine records are created automatically the first time. Restarting keeps your changes.
To start fresh, stop the server and delete `data/maintenance.db`.
You may see "ExperimentalWarning: SQLite is an experimental feature". That is normal.

## Test (Postman or any API client)

For POST and PUT use a raw JSON body with `Content-Type: application/json`:

```json
{
  "title": "Broken classroom light",
  "category": "Electrical",
  "description": "The light in Room B12 does not switch on.",
  "status": "Pending"
}
```

| Test | Expected |
|---|---|
| `GET /health` | 200 `{"status":"ok","database":"ok"}` |
| `GET /api/records` | 200 array |
| `POST /api/records` valid | 201 with new `id` |
| `GET /api/records/<id>` | 200 same record |
| `PUT /api/records/<id>` all four fields | 200, same `id`, new values |
| `DELETE /api/records/<id>` | 200 `{"message":"Record deleted."}`, then GET gives 404 |
| POST with missing title or status `Done` | 400 `{"message":"..."}` |
| `/api/records/abc`, `/api/records/0`, malformed JSON | 400 |
| `/api/records/999999` (GET, PUT, DELETE) | 404 |
| Restart server, GET a record | still there |

## Deploy on Render

1. Push this folder to GitHub (`.env`, `node_modules` and `data/*.db` are ignored; include `package-lock.json`).
2. Render > New > **Web Service** > pick the repo. Root directory: this folder if nested.
   Runtime Node, build `npm install`, start `npm start`.
3. Environment variables: `CLIENT_ORIGINS` (frontend address, Activity 8), `STUDENT_NUMBER`, `PROJECT_NAME`,
   and `NODE_VERSION` = `22` (or `24`) so Render uses a Node version that has `node:sqlite`.
4. Deploy, open the HTTPS URL (the guide page), check `/health`, repeat the test table online.
5. Submit the base URL, for example `https://your-backend.onrender.com`.

**Important: persistence.** Render's free web service has a temporary disk. The SQLite file is wiped on every
redeploy or restart, and the server then recreates it with the nine seed records, so records you added are lost.
To keep data, attach a Render **persistent disk** (paid plan), mount it at `/var/data`, and set
`DB_PATH=/var/data/maintenance.db`. Ask your lecturer whether the free temporary disk is acceptable for marking.
Free services also sleep when idle; the first request may take about a minute.
