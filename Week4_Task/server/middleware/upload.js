const multer = require("multer");
const path = require("path");
const fs = require("fs");

const UPLOAD_DIR = path.join(__dirname, "..", "uploads");

// Make sure the uploads folder actually exists before multer tries to
// write into it — this avoids a confusing crash on a fresh clone of
// the repo where the folder might not have been created yet.
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Where and how to name uploaded files on disk.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    // Prefix with a timestamp + random number so two people uploading
    // "photo.jpg" at the same time never overwrite each other.
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

/**
 * Rejects the upload before it's even written to disk if the file
 * isn't a genuinely allowed image type. This checks the browser-
 * reported MIME type; combined with the extension check on the
 * frontend, this is a reasonable safeguard for an evaluation project
 * (a production system handling untrusted uploads at scale would
 * typically also verify the file's actual binary signature/"magic
 * bytes" server-side, not just the reported MIME type).
 */
const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    const err = new Error("Only JPEG, PNG, WEBP, or GIF images are allowed.");
    err.code = "INVALID_FILE_TYPE";
    return cb(err);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
});

module.exports = upload;
