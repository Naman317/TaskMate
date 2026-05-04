import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const createJWT = (req, res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  const host = req.get("host") || req.headers.host || "";
  const origin = req.get("origin") || "";
  const isProduction = process.env.NODE_ENV === "production" || 
                       !host.includes("localhost") || 
                       origin.includes("vercel.app");

  console.log(`Setting cookie for host: ${host}, origin: ${origin}, isProduction: ${isProduction}`);

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 1 * 24 * 60 * 60 * 1000,
  });

  return token;
};


export const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
