import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// ✅ Define allowed origins for both local + deployed frontend
const allowedOrigins = [
  "http://localhost:5173",
  "https://todobyblessing.netlify.app"
];

// ✅ Configure CORS properly
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

// ✅ GET all todos
app.get("/todos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM todos ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching todos:", err.message);
    res.status(500).json({ error: "Error fetching todos", details: err.message });
  }
});

// ✅ POST - Add a new todo
app.post("/todos", async (req, res) => {
  try {
    const { text } = req.body;
    const result = await pool.query(
      "INSERT INTO todos (text, completed) VALUES ($1, $2) RETURNING *",
      [text, false]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error adding todo:", err.message);
    res.status(500).json({ error: "Error adding todo", details: err.message });
  }
});

// ✅ PUT - Update completion
app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;
    await pool.query("UPDATE todos SET completed = $1 WHERE id = $2", [
      completed,
      id,
    ]);
    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error updating todo:", err.message);
    res.status(500).json({ error: "Error updating todo", details: err.message });
  }
});

// ✅ DELETE - Delete a todo
app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM todos WHERE id = $1", [id]);
    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error deleting todo:", err.message);
    res.status(500).json({ error: "Error deleting todo", details: err.message });
  }
});

// ✅ Start server
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
