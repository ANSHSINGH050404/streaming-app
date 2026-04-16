import express from "express";
import userRoutes from "./routes/user.routes";
import adminRoutes from './routes/admin.routes'
import eventRoutes from './routes/event.routes'
import cors from "cors";
const app = express();

app.use(express.json());
app.use(cors({origin:"*"}))



// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});



// Routes
app.use("/users", userRoutes);
app.use("/admin", adminRoutes);
app.use("/events",eventRoutes)

export default app;
