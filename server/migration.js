import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.js";

dotenv.config();

const migrateUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for migration...");

    const superAdminEmail = (process.env.SUPER_ADMIN_EMAIL || "admin@gmail.com").toLowerCase();
    
    // 1. Identify and fix Super Admin
    console.log(`Setting Super Admin for ${superAdminEmail}...`);
    const superAdmin = await User.findOneAndUpdate(
      { email: superAdminEmail },
      { 
        role: "admin", // They are an admin role, but email gives super powers
        isAdmin: true,
        isActive: true 
      },
      { new: true, upsert: false }
    );

    if (superAdmin) {
      console.log("Super Admin synchronized.");
    } else {
      console.warn("Super Admin user not found in database! Please check the email.");
    }

    // 2. Normalize Admins
    console.log("Synchronizing isAdmin and role fields...");
    
    // Any user with isAdmin: true should have role: 'admin'
    await User.updateMany(
      { isAdmin: true, role: { $ne: "admin" } },
      { $set: { role: "admin" } }
    );

    // Any user with role: 'admin' should have isAdmin: true
    await User.updateMany(
      { role: "admin", isAdmin: false },
      { $set: { isAdmin: true } }
    );

    // 3. Cleanup stale data
    // Ensure all users have a role (default to 'user')
    await User.updateMany(
      { role: { $exists: false } },
      { $set: { role: "user", isAdmin: false } }
    );

    console.log("Migration completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

migrateUsers();
