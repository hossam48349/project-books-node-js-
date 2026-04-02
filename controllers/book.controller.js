import Book from "../models/book.model.js";
import User from "../models/user.model.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

const normalizeTags = (tags) => {
  if (Array.isArray(tags)) {
    return tags;
  }

  if (typeof tags === "string") {
    try {
      const parsedTags = JSON.parse(tags);
      if (Array.isArray(parsedTags)) {
        return parsedTags;
      }
    } catch (error) {}

    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
  }

  return tags;
};

export const createBook = catchAsync(async (req, res, next) => {
  const { title, tags, status } = req.body;
  const userId = req.user.id;

  const user = await User.findById(userId);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const book = await Book.create({
    userId,
    title,
    tags: normalizeTags(tags),
    status,
  });

  res.status(201).json({
    message: "book created successfully",
    data: book,
  });
});

export const updateBook = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const book = await Book.findById(id);

  if (!book) {
    return next(new AppError("Book not found!", 404));
  }

  if (req.role !== "admin" && book.userId.toString() !== req.user.id) {
    return next(new AppError("You can only update your own books", 403));
  }

  const allowedUpdates = ["title", "tags", "status"];

  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      if (field === "tags") {
        book[field] = normalizeTags(req.body[field]);
      } else {
        book[field] = req.body[field];
      }
    }
  });

  await book.save();

  res.status(200).json({
    message: "success",
    data: book,
  });
});

export const deleteBook = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const book = await Book.findById(id);

  if (!book) {
    return next(new AppError("Book Not Found", 404));
  }

  if (req.role !== "admin" && book.userId.toString() !== req.user.id) {
    return next(new AppError("You can only delete your own books", 403));
  }

  await book.deleteOne();

  res.status(200).json({
    message: "book deleted successfully",
  });
});

export const getUserBooks = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  if (req.role !== "admin" && req.user.id !== userId) {
    return next(new AppError("You can only view your own books", 403));
  }

  const user = await User.findById(userId);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const books = await Book.find({ userId }).populate({
    path: "userId",
    select: "username firstName lastName",
  });

  res.status(200).json({
    message: "success",
    data: books,
  });
});

export const getAllBooks = catchAsync(async (req, res, next) => {
  const { limit = 10, skip = 0 } = req.query;

  const books = await Book.find()
    .limit(+limit)
    .skip(+skip)
    .sort({ createdAt: -1 })
    .populate({
      path: "userId",
      select: "username firstName lastName",
    });

  res.status(200).json({
    message: "success",
    data: books,
  });
});