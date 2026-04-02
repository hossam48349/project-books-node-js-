import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import userRouter from "./routes/user.routes.js";
import bookRouter from "./routes/book.routes.js";
import User from "./models/user.model.js";
import Book from "./models/book.model.js";
import AppError from "./utils/appError.js";

dotenv.config();

const app = express();

mongoose
  .connect(process.env.MONGO_URL || "mongodb://127.0.0.1:27017/BookDB")
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.get("/", async (req, res, next) => {
  try {
    const users = await User.find().select("username firstName lastName role");
    const books = await Book.find().populate({
      path: "userId",
      select: "username firstName lastName",
    });

    res.render("data", {
      users,
      books,
    });
  } catch (err) {
    next(err); 
  }
});

app.use("/users", userRouter);
app.use("/books", bookRouter);


app.use((req, res, next) => {
  next(new AppError(`${req.originalUrl} Route Not Found`, 404));
});


app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: err.status || "error",
    message: err.message || "Internal Server Error",
  });
});


app.listen(process.env.PORT || 3000, () => {
  console.log(`Server Started on port ${process.env.PORT || 3000}`);
});