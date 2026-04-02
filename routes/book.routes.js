import express from "express";
import {
  createBook,
  updateBook,
  deleteBook,
  getAllBooks,
} from "../controllers/book.controller.js";
import {
  verifyAccessToken,
  allowedTo,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", verifyAccessToken, allowedTo("admin", "user"), createBook);
router.get("/", verifyAccessToken, allowedTo("admin", "user"), getAllBooks);
router.patch("/:id", verifyAccessToken, allowedTo("admin", "user"), updateBook);
router.delete("/:id", verifyAccessToken, allowedTo("admin", "user"), deleteBook);

export default router;