import jwt from "jsonwebtoken";
import User from "../models/user.js";

const protectRoute = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    if (token) {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      const resp = await User.findById(decodedToken.userId).select(
        "isAdmin email"
      );

      req.user = {
        email: resp.email,
        isAdmin: resp.isAdmin,
        userId: decodedToken.userId,
      };

      next();
    } else {
      return res
        .status(401)
        .json({ status: false, message: "Not authorized. Try login again." });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(401)
      .json({ status: false, message: "Not authorized. Try login again." });
  }
};

const isAdminRoute = (req, res, next) => {
  if (req.user && req.user?.role ==="admin") {
    next();
  } else {
    return res.status(401).json({
      status: false,
      message: "Not authorized as admin. Try login as admin.",
    });
  }
};
const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) {
      return next();
    }
    return res.status(403).json({
      status: false,
      message: `Access denied. Required role: ${roles.join(" or ")}`,
    });
  };
};

const isSuperAdmin = (req, res, next) => {
  if (req.user?.email === "admin@gmail.com") {
    return next();
  }
  return res.status(403).json({
    status: false,
    message: "Access denied. Super Admin only.",
  });
};


export { isAdminRoute, protectRoute,isSuperAdmin,allowRoles };
