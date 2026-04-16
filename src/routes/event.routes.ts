import { Router } from "express";
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  bookEvent,
} from "../controllers/event.controller";
import { adminAuth, userAuth } from "../middleware/auth.middleware";

const router = Router();

router.get("/", getEvents);
router.get("/:id", getEventById);
router.post("/:id/book", userAuth, bookEvent);

// Admin only routes
router.post("/", adminAuth, createEvent);
router.patch("/:id", adminAuth, updateEvent);
router.delete("/:id", adminAuth, deleteEvent);

export default router;
