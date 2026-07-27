const jwt = require("jsonwebtoken");

/**
 * Signs a JWT for the given user id and sets it as an httpOnly cookie
 * on the response. httpOnly means client-side JavaScript can never
 * read this cookie (protects against XSS token theft); it's
 * automatically attached by the browser on every request to our API.
 */
const sendTokenCookie = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days, in ms
  });

  return token;
};

module.exports = sendTokenCookie;
