import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { auth } from "./auth";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8081;

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());

// Mount Better Auth routes
app.all("/api/auth/*", async (req, res) => {
  const response = await auth.handler(
    new Request(`${req.protocol}://${req.get('host')}${req.originalUrl}`, {
      method: req.method,
      headers: req.headers as Record<string, string>,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    })
  );
  
  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });
  
  res.status(response.status).send(await response.text());
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Better Auth server is running" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Better Auth server running on http://localhost:${PORT}`);
  console.log(`📍 Auth endpoints available at http://localhost:${PORT}/api/auth/*`);
});
