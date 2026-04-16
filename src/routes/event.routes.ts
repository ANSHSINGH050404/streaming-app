import { Router } from "express";
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../controllers/event.controller";
import { adminAuth } from "../middleware/auth.middleware";

const router = Router();

router.get("/", getEvents);
router.get("/:id", getEventById);

// Admin only routes
router.post("/", adminAuth, createEvent);
router.patch("/:id", adminAuth, updateEvent);
router.delete("/:id", adminAuth, deleteEvent);

export default router;
