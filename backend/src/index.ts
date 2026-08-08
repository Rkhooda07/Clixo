import express from "express";
import dotenv from "dotenv";
import uploadRouter from "./routes/uploadRoutes.ts";  // Coz we're using "type: module"
import taskRouter from "./routes/taskRoutes.ts";
import submissionRoutes from "./routes/submissionRoutes.ts";
import aggregationRoutes from "./routes/aggregationRoutes.ts";
import rewardRoutes from "./routes/rewardRoutes.ts";
import rewardSettlementRoutes from "./routes/rewardSettlementRoutes.ts";
import authRoutes from "./routes/authRoutes.ts";
import payoutRoutes from "./routes/payoutRoutes.ts";
import meRoutes from "./routes/meRoutes.ts";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
// Deployed origins come from ALLOWED_ORIGINS (comma-separated); the localhost
// entries stay so a fresh clone works with no env at all.
const allowedOrigins = new Set([
  ...(process.env.ALLOWED_ORIGINS?.split(",").map((s) => s.trim()).filter(Boolean) ?? []),
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3001",
]);

app.use((req, res, next) => {
  const origin = req.headers.origin;

  // The response body varies by Origin; without this a CDN can hand one
  // origin's Access-Control-Allow-Origin to another.
  res.header("Vary", "Origin");

  if (origin && allowedOrigins.has(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

// Middleware to parse JSON (optional, but useful for other routes)
app.use(express.json());

// Route for file uploads
app.use("/api/upload", uploadRouter);

// Route for task creation
app.use("/api/tasks", taskRouter);

// Route for submissions
app.use("/api/submissions", submissionRoutes);

// Route for aggregations
app.use("/api", aggregationRoutes);

// Route for preview of rewards
app.use("/api", rewardRoutes);

// Route for settlement of rewards
app.use("/api", rewardSettlementRoutes);

// Route for Siwe challenge creation
app.use("/api", authRoutes);

// Route for payout preview
app.use("/api", payoutRoutes);

// me endpoints for users and workers 
app.use("/api/me", meRoutes);

// Basic root route
app.get("/", (req, res) => {
  res.send("✅ Clixo backend is running!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
