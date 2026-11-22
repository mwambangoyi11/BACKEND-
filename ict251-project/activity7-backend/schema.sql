-- Creates the records table. Safe to run more than once.
-- SQLite generates id; the API never accepts an id from a client.
-- AUTOINCREMENT means a deleted id is never handed out again.
CREATE TABLE IF NOT EXISTS records (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT NOT NULL CHECK (length(title) BETWEEN 3 AND 80),
  category    TEXT NOT NULL CHECK (length(category) BETWEEN 2 AND 40),
  description TEXT NOT NULL CHECK (length(description) BETWEEN 5 AND 300),
  status      TEXT NOT NULL CHECK (status IN ('Pending', 'In progress', 'Completed'))
);
