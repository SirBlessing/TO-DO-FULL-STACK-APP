import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";

dotenv.config();

const app = express();
app.use(cors({
  origin: "http://localhost:5173" // your React app
}));
app.use(express.json());





// ✅ Test route
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

// ✅ Get all todos
app.get("/todos", async (req, res) => {
  const result = await pool.query("SELECT * FROM todos ORDER BY id ASC");
  res.json(result.rows);
});

// ✅ Add a todo
app.post("/todos", async (req, res) => {
  const { text } = req.body;
  const result = await pool.query(
    "INSERT INTO todos (text, completed) VALUES ($1, $2) RETURNING *",
    [text, false]
  );
  res.json(result.rows[0]);
});

// ✅ Update completion
app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  await pool.query("UPDATE todos SET completed = $1 WHERE id = $2", [
    completed,
    id,
  ]);
  res.sendStatus(200);
});

// ✅ Delete todo
app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM todos WHERE id = $1", [id]);
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
