const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");
const sendTokenCookie = require("../utils/generateToken");

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(409);
    throw new Error("An account with this email already exists");
  }

  // Password is hashed automatically by the pre-save hook on the model
  const user = await User.create({ name, email, password });

  sendTokenCookie(res, user._id);

  res.status(201).json({
    success: true,
    data: { id: user._id, name: user.name, email: user.email },
    error: null,
  });
});

/**
 * @desc    Log in an existing user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  // .select("+password") is needed because the schema excludes it by default
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    // Deliberately vague message: don't reveal whether the email exists
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

/**
 * @desc    Log out the current user by clearing the auth cookie
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0), // immediately expire the cookie
  });

  res.status(200).json({ success: true, data: { message: "Logged out" }, error: null });
});

/**
 * @desc    Get the currently logged-in user's profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  // req.user is populated by the `protect` auth middleware
  res.status(200).json({ success: true, data: req.user, error: null });
});

module.exports = { register, login, logout, getMe };
