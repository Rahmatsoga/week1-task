const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("./asyncHandler");

/**
 * Protects a route: verifies the JWT sent as an httpOnly cookie.
 * If valid, attaches the corresponding user to req.user and lets the
 * request continue. If missing or invalid, responds with 401
 * (Unauthorized) before the controller ever runs.
 */
const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401);
    throw new Error("Not authorized — no token provided");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    res.status(401);
    throw new Error("Not authorized — invalid or expired token");
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    res.status(401);
    throw new Error("Not authorized — user no longer exists");
  }

  req.user = user;
  next();
});

module.exports = { protect };
