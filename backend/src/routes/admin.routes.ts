import { Router } from "express";
import {
  getAllAdmin,
  signup,
  verify,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/admin.controller";
import { adminAuth } from "../middleware/auth.middleware";

const router = Router();

router.get("/", adminAuth, getAllAdmin);
router.post("/signup", signup);
router.post("/verify", verify);
router.get("/me", adminAuth, (req, res) => {
  res.json(req.admin);
});
router.get("/:id", adminAuth, getUserById);
router.patch("/:id", adminAuth, updateUser);
router.delete("/:id", adminAuth, deleteUser);

export default router;
