import express from "express";
import userRoutes from "./routes/user.routes";
import adminRoutes from './routes/admin.routes'
import eventRoutes from './routes/event.routes'
const app = express();

app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Routes
app.use("/users", userRoutes);
app.use("/admin", adminRoutes);
app.use("/events",eventRoutes)

export default app;
