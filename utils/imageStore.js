const fs = require("fs");
const path = require("path");
const os = require("os");

// Preferred uploads root is either provided by env (useful for hosts) or the repo uploads folder.
// When running in serverless environments the repo folder may be read-only; in that case
// we fall back to the system temp directory (os.tmpdir()).
const DEFAULT_UPLOADS_ROOT = path.join(__dirname, "..", "uploads");

function resolveUploadsRoot() {
  const envRoot = process.env.UPLOADS_DIR;
  const preferred = envRoot || DEFAULT_UPLOADS_ROOT;
  try {
    fs.mkdirSync(preferred, { recursive: true });
    return preferred;
  } catch (err) {
    // If we cannot create the preferred directory (e.g. read-only filesystem on serverless),
    // fall back to os.tmpdir() which is writable on most serverless platforms.
    const fallback = path.join(os.tmpdir(), "uploads");
    try {
      fs.mkdirSync(fallback, { recursive: true });
      console.warn(
        `Uploads directory '${preferred}' is not writable; using fallback '${fallback}'.`
      );
      return fallback;
    } catch (err2) {
      // As a last resort, log and rethrow — but keep the error informative.
      console.error(
        "Failed to create uploads directory in both preferred and fallback locations:",
        err,
        err2
      );
      throw err2;
    }
  }
}

function getEntityDir(name) {
  return path.join(resolveUploadsRoot(), name);
}

function ensureUploadDirectoriesExist() {
  try {
    const root = resolveUploadsRoot();
    const dirs = ["brands", "categories", "products", "banners"].map((d) =>
      path.join(root, d)
    );
    dirs.forEach((dir) => {
      try {
        fs.mkdirSync(dir, { recursive: true });
      } catch (e) {
        // Do not throw — if directory creation fails (read-only), we will fall back to os.tmpdir()
        console.warn(`Could not create upload dir '${dir}':`, e.message);
      }
    });
  } catch (err) {
    // If resolveUploadsRoot threw, log and continue — callers should be robust to missing dirs.
    console.warn(
      "ensureUploadDirectoriesExist: could not ensure uploads directories:",
      err.message || err
    );
  }
}

function getNextSerialNumberForDir(targetDir) {
  // Try to ensure directories exist but don't throw if it fails
  ensureUploadDirectoriesExist();
  try {
    const files = fs
      .readdirSync(targetDir)
      .filter((f) => !fs.statSync(path.join(targetDir, f)).isDirectory());
    let maxSerial = 0;
    files.forEach((file) => {
      const base = path.parse(file).name; // e.g., "12" from "12.jpg"
      const num = parseInt(base, 10);
      if (!Number.isNaN(num) && num > maxSerial) maxSerial = num;
    });
    return maxSerial + 1;
  } catch (err) {
    // If reading the directory failed (e.g., doesn't exist or not readable), start from 1
    return 1;
  }
}

function saveBufferWithSerial(targetDir, buffer, extension) {
  const safeExt = (extension || "").replace(/^\./, "").toLowerCase() || "jpg";
  try {
    const serial = getNextSerialNumberForDir(targetDir);
    const filename = `${serial}.${safeExt}`;
    const filePath = path.join(targetDir, filename);
    fs.writeFileSync(filePath, buffer);
    return { serial, filename, filePath };
  } catch (err) {
    // Writing failed (read-only filesystem). Throw a descriptive error so callers can handle it.
    const msg = `Failed to save file to '${targetDir}': ${err.message}`;
    const e = new Error(msg);
    e.cause = err;
    throw e;
  }
}

function saveBrandImage(buffer, extension) {
  return saveBufferWithSerial(getEntityDir("brands"), buffer, extension);
}

function saveCategoryImage(buffer, extension) {
  return saveBufferWithSerial(getEntityDir("categories"), buffer, extension);
}

function saveProductImage(buffer, extension) {
  return saveBufferWithSerial(getEntityDir("products"), buffer, extension);
}

module.exports = {
  ensureUploadDirectoriesExist,
  saveBrandImage,
  saveCategoryImage,
  saveProductImage,
  paths: {
    root: () => resolveUploadsRoot(),
    brands: () => getEntityDir("brands"),
    categories: () => getEntityDir("categories"),
    products: () => getEntityDir("products"),
    banners: () => getEntityDir("banners"),
  },
};
