import { Router } from "express";
import {
  getAllAdmin,
  signup,
  verify,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/admin.controller";

const router = Router();

router.get("/", getAllAdmin);
router.post("/signup", signup);
router.post("/verify", verify);
router.get("/:id", getUserById);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
