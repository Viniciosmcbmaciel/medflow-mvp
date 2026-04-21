import express from "express";

const app = express();

app.get("/", (_req, res) => {
  res.send("API online");
});

app.get("/health", (_req, res) => {
  res.json({ ok: true, test: "minimal-app" });
});

export default app;