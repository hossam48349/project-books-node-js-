import express from "express";
import {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { getUserBooks } from "../controllers/book.controller.js";
import {
  signup,
  login,
  refreshAccessToken,
} from "../controllers/auth.controller.js";
import {
  verifyAccessToken,
  allowedTo,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh-token", refreshAccessToken);

router.get("/", verifyAccessToken, allowedTo("admin"), getAllUsers);

router.post("/", createUser);

router.patch("/:id", verifyAccessToken, allowedTo("admin", "user"), updateUser);

router.delete("/:id", verifyAccessToken, allowedTo("admin", "user"), deleteUser);

router.get(
  "/:userId/books",
  verifyAccessToken,
  allowedTo("admin", "user"),
  getUserBooks
);

export default router;