import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { auth } from "./auth.js";

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 8081;

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());

// Mount Better Auth routes - use toNodeHandler for Express compatibility
app.all("/api/auth/*", auth.handler);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Better Auth server is running" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Better Auth server running on http://localhost:${PORT}`);
  console.log(`📍 Auth endpoints available at http://localhost:${PORT}/api/auth/*`);
});
