const multer = require("multer");
const path = require("path");
const fs = require("fs");
const ApiError = require("../utils/apiError");

const UPLOADS_ROOT = path.join(__dirname, "..", "uploads");

// Ensure directories exist
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Get next serial number for a directory
function getNextSerial(targetDir) {
  ensureDir(targetDir);
  const files = fs
    .readdirSync(targetDir)
    .filter((f) => !fs.statSync(path.join(targetDir, f)).isDirectory());
  let maxSerial = 0;
  for (const file of files) {
    const base = path.parse(file).name;
    const num = parseInt(base, 10);
    if (!Number.isNaN(num) && num > maxSerial) maxSerial = num;
  }
  return maxSerial + 1;
}

// Create multer storage for a specific entity type
function createStorage(entityType) {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const destDir = path.join(UPLOADS_ROOT, entityType);
      ensureDir(destDir);
      cb(null, destDir);
    },
    filename: (req, file, cb) => {
      const destDir = path.join(UPLOADS_ROOT, entityType);
      const serial = getNextSerial(destDir);
      const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
      const filename = `${serial}${ext}`;
      cb(null, filename);
    },
  });
}

// File filter to accept only images
const imageFileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError("Only image files are allowed (jpeg, jpg, png, gif, webp)", 400), false);
  }
};

// Create upload middleware for each entity type
const uploadProductImage = multer({
  storage: createStorage("products"),
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).single("image");

const uploadCategoryImage = multer({
  storage: createStorage("categories"),
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("image");

const uploadBrandImage = multer({
  storage: createStorage("brands"),
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("image");

// Multiple images for products (e.g., gallery)
const uploadProductImages = multer({
  storage: createStorage("products"),
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).array("images", 10); // Max 10 images

const uploadBannerImage = multer({
  storage: createStorage("banners"),
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("image");

module.exports = {
  uploadProductImage,
  uploadCategoryImage,
  uploadBrandImage,
  uploadProductImages,
  uploadBannerImage,
};

