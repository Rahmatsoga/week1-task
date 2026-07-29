const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");
const sendTokenCookie = require("../utils/generateToken");

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(409);
    throw new Error("An account with this email already exists");
  }

  const user = await User.create({ name, email, password });
  sendTokenCookie(res, user._id);

  res.status(201).json({
    success: true,
    data: { id: user._id, name: user.name, email: user.email },
    error: null,
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  sendTokenCookie(res, user._id);

  res.status(200).json({
    success: true,
    data: { id: user._id, name: user.name, email: user.email },
    error: null,
  });
});

const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ success: true, data: { message: "Logged out" }, error: null });
});

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: req.user, error: null });
});

module.exports = { register, login, logout, getMe };
