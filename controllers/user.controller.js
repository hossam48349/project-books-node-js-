import User from "../models/user.model.js";
import Book from "../models/book.model.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().select("firstName -_id");

  res.status(200).json({
    message: "success",
    data: users,
  });
});

export const createUser = catchAsync(async (req, res, next) => {
  const { username, password, firstName, lastName, dob, image } = req.body;

  const user = await User.create({
    username,
    password,
    firstName,
    lastName,
    dob,
    image,
  });

  res.status(201).json({
    message: "success",
    data: user,
  });
});

export const updateUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (req.role !== "admin" && req.user.id !== id) {
    return next(new AppError("You can only update your own account", 403));
  }

  const user = await User.findById(id).select("+password");

  if (!user) {
    return next(new AppError("User not found!", 404));
  }

  const allowedUpdates = [
    "username",
    "password",
    "firstName",
    "lastName",
    "dob",
    "image",
  ];

  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  });

  await user.save();

  res.status(200).json({
    message: "user was edited successfully",
    data: user,
  });
});

export const deleteUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (req.role !== "admin" && req.user.id !== id) {
    return next(new AppError("You can only delete your own account", 403));
  }

  const user = await User.findByIdAndDelete(id);

  if (!user) {
    return next(new AppError("User Not Found", 404));
  }

  await Book.deleteMany({ userId: id });

  res.status(200).json({
    message: "user deleted successfully",
  });
});