import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";

import authRoutes from "./routes/auth.routes";
import postRoutes from "./routes/post.routes";
import n8nRoutes from "./routes/n8n.routes";
import uploadRoutes from "./routes/upload.routes";
import eventRoutes from "./routes/event.routes";
import tagRoutes from "./routes/tag.routes";
import investmentRoutes from "./routes/investment.routes";
import businessRoutes from "./routes/business.routes";

const app = express();

app.use(cors());
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan("dev"));
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/n8n", n8nRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/investments", investmentRoutes);
app.use("/api/businesses", businessRoutes);

export default app;