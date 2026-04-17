import { Router } from "express";
import {
  getAllUsers,
  signup,
  verify,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";
import { userAuth } from "../middleware/auth.middleware";

const router = Router();

router.get("/", userAuth, getAllUsers);
router.post("/signup", signup);
router.post("/verify", verify);
router.get("/me", userAuth, (req, res) => {
  res.json(req.user);
});
router.get("/:id", userAuth, getUserById);
router.patch("/:id", userAuth, updateUser);
router.delete("/:id", userAuth, deleteUser);

export default router;
