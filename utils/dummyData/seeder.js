const fs = require("fs");
require("colors");
const dotenv = require("dotenv");
const Product = require("../../models/productMode");
const Banner = require("../../models/bannerModel");
const Category = require("../../models/categoryModel");
const Brand = require("../../models/brandModel");
const dbConnection = require("../../config/database");

dotenv.config({ path: "../../config.env" });

// connect to DB
dbConnection();

// Read data
const products = JSON.parse(fs.readFileSync("./products.json"));
const banners = JSON.parse(fs.readFileSync("./banners.json"));
const categories = JSON.parse(fs.readFileSync("./categories.json"));
const brands = JSON.parse(fs.readFileSync("./brands.json"));

// Insert data into DB
const insertData = async () => {
  try {
    // Insert categories first
    const createdCategories = await Category.create(categories);
    console.log("Categories inserted".green);

    // Insert brands
    const createdBrands = await Brand.create(brands);
    console.log("Brands inserted".green);

    // Get first category and brand ID to assign to products
    const defaultCategoryId = createdCategories[0]._id;
    const defaultBrandId = createdBrands[0]._id;

    // Update products to use the first category and brand
    const productsWithRefs = products.map((product) => ({
      ...product,
      category: defaultCategoryId,
      brand: defaultBrandId,
    }));

    await Product.create(productsWithRefs);
    console.log("Products inserted".green);

    await Banner.create(banners);
    console.log("Banners inserted".green);

    console.log("Data Inserted".green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
}; // Delete data from DB
const destroyData = async () => {
  try {
    await Product.deleteMany();
    await Banner.deleteMany();
    await Category.deleteMany();
    await Brand.deleteMany();
    console.log("Data Destroyed".red.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// node seeder.js -d
if (process.argv[2] === "-i") {
  insertData();
} else if (process.argv[2] === "-d") {
  destroyData();
}
