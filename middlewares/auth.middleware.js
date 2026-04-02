import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const verifyAccessToken = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ message: "unauthenticated" });
  }

  try {
    const token = authorization.split(" ")[1];

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    req.role = user.role;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired access token" });
  }
};

export const allowedTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.role)) {
      return res.status(403).json({ message: "You are not Authorized" });
    }

    next();
  };
};