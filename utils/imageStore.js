const fs = require("fs");
const path = require("path");

const UPLOADS_ROOT = path.join(__dirname, "..", "uploads");
const ENTITY_DIRS = {
  brands: path.join(UPLOADS_ROOT, "brands"),
  categories: path.join(UPLOADS_ROOT, "categories"),
  products: path.join(UPLOADS_ROOT, "products"),
  banners: path.join(UPLOADS_ROOT, "banners"),
};

function ensureUploadDirectoriesExist() {
  fs.mkdirSync(UPLOADS_ROOT, { recursive: true });
  Object.values(ENTITY_DIRS).forEach((dir) => fs.mkdirSync(dir, { recursive: true }));
}

function getNextSerialNumberForDir(targetDir) {
  ensureUploadDirectoriesExist();
  const files = fs.readdirSync(targetDir).filter((f) => !fs.statSync(path.join(targetDir, f)).isDirectory());
  let maxSerial = 0;
  for (const file of files) {
    const base = path.parse(file).name; // e.g., "12" from "12.jpg"
    const num = parseInt(base, 10);
    if (!Number.isNaN(num) && num > maxSerial) maxSerial = num;
  }
  return maxSerial + 1;
}

function saveBufferWithSerial(targetDir, buffer, extension) {
  const safeExt = (extension || "").replace(/^\./, "").toLowerCase() || "jpg";
  const serial = getNextSerialNumberForDir(targetDir);
  const filename = `${serial}.${safeExt}`;
  const filePath = path.join(targetDir, filename);
  fs.writeFileSync(filePath, buffer);
  return { serial, filename, filePath };
}

function saveBrandImage(buffer, extension) {
  return saveBufferWithSerial(ENTITY_DIRS.brands, buffer, extension);
}

function saveCategoryImage(buffer, extension) {
  return saveBufferWithSerial(ENTITY_DIRS.categories, buffer, extension);
}

function saveProductImage(buffer, extension) {
  return saveBufferWithSerial(ENTITY_DIRS.products, buffer, extension);
}

module.exports = {
  ensureUploadDirectoriesExist,
  saveBrandImage,
  saveCategoryImage,
  saveProductImage,
  paths: {
    root: UPLOADS_ROOT,
    ...ENTITY_DIRS,
  },
};


