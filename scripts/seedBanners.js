const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const Banner = require("../models/bannerModel");

dotenv.config({ path: path.join(__dirname, "..", "config.env") });

// Sample banners data - matching frontend expectations
const sampleBanners = [
  {
    name: "Featured Products",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
    link: "/products",
    isActive: true,
    order: 1,
  },
  {
    name: "Electronics",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&h=600&fit=crop",
    link: "/categories/electronics",
    isActive: true,
    order: 2,
  },
  {
    name: "Fashion",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=600&fit=crop",
    link: "/categories/fashion",
    isActive: true,
    order: 3,
  },
  {
    name: "Home & Garden",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
    link: "/categories/home",
    isActive: true,
    order: 4,
  },
  {
    name: "Sports",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
    link: "/categories/sports",
    isActive: true,
    order: 5,
  },
  {
    name: "Beauty",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=600&fit=crop",
    link: "/categories/beauty",
    isActive: true,
    order: 6,
  },
];

// Connect to database
mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    return seedBanners();
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

async function seedBanners() {
  try {
    // Check if banners already exist
    const existingBanners = await Banner.countDocuments();
    
    if (existingBanners > 0) {
      console.log(`⚠️  Found ${existingBanners} existing banners.`);
      console.log("Do you want to:");
      console.log("1. Skip seeding");
      console.log("2. Add new banners anyway");
      console.log("3. Clear existing and seed fresh");
      console.log("\nRun with arguments:");
      console.log("  node seedBanners.js skip    - Skip if exists");
      console.log("  node seedBanners.js add     - Add anyway");
      console.log("  node seedBanners.js fresh   - Clear and reseed");
      
      const arg = process.argv[2];
      
      if (!arg || arg === "skip") {
        console.log("⏭️  Skipping seed. Use 'add' or 'fresh' to proceed.");
        process.exit(0);
      } else if (arg === "fresh") {
        console.log("🗑️  Clearing existing banners...");
        await Banner.deleteMany({});
        console.log("✅ Cleared existing banners");
      }
    }

    // Create banners
    console.log("🌱 Seeding banners...");
    const createdBanners = await Banner.insertMany(sampleBanners);
    
    console.log(`✅ Successfully created ${createdBanners.length} banners!`);
    console.log("\n📋 Created Banners:");
    createdBanners.forEach((banner, index) => {
      console.log(`   ${index + 1}. ${banner.name} (Order: ${banner.order})`);
    });
    
    console.log("\n🔗 Test the banners:");
    console.log("   GET http://localhost:8000/banners");
    console.log("   GET http://localhost:8000/api/v1/banners");
    console.log("   GET http://localhost:8000/backend/banners");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding banners:", error);
    process.exit(1);
  }
}

