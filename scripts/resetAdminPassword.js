const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config({ path: path.join(__dirname, "..", "config.env") });

const User = require("../models/userModel");

const resetAdminPassword = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.DB_URI);
    console.log("✅ Connected to database");

    // Find admin user
    const adminEmail = "admin@admin.com";
    const newPassword = "admin123"; // Change this to your desired password

    const admin = await User.findOne({ email: adminEmail });

    if (!admin) {
      console.log(`❌ No user found with email: ${adminEmail}`);
      console.log("\n📝 Creating new admin user...");
      
      const newAdmin = await User.create({
        name: "Admin User",
        email: adminEmail,
        password: newPassword,
        role: "admin",
      });

      console.log("✅ Admin user created successfully!");
      console.log("\n🔐 Login Credentials:");
      console.log(`   Email: ${newAdmin.email}`);
      console.log(`   Password: ${newPassword}`);
    } else {
      console.log(`✅ Found user: ${admin.name} (${admin.email})`);
      console.log(`   Current role: ${admin.role}`);
      
      // Update password and ensure role is admin
      admin.password = newPassword;
      admin.role = "admin";
      await admin.save();

      console.log("\n✅ Admin password updated successfully!");
      console.log("\n🔐 Login Credentials:");
      console.log(`   Email: ${admin.email}`);
      console.log(`   Password: ${newPassword}`);
    }

    console.log("\n✨ You can now login to your frontend!");
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

resetAdminPassword();

