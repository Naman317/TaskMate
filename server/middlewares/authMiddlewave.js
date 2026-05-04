import jwt from "jsonwebtoken";
import User from "../models/user.js";

const protectRoute = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    // Fallback to Authorization header if cookie is missing
    if (!token && req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    console.log(`protectRoute: Token present: ${!!token} (${token ? "Found" : "Not Found"})`);

    if (token) {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      const resp = await User.findById(decodedToken.userId).select(
        "isAdmin email role"
      );

      req.user = {
        email: resp.email,
        isAdmin: resp.isAdmin || resp.email?.toLowerCase() === (process.env.SUPER_ADMIN_EMAIL || "admin@gmail.com").toLowerCase(),
        role: resp.role,
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
  if (req.user && (req.user.isAdmin || req.user.role === "admin")) {
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
    // Super admin (identified by email) bypasses role checks
    const superAdminEmail = (process.env.SUPER_ADMIN_EMAIL || "admin@gmail.com").toLowerCase();
    const isSuper = req.user?.email?.toLowerCase() === superAdminEmail;

    if (req.user && (isSuper || roles.includes(req.user.role))) {
      return next();
    }
    return res.status(403).json({
      status: false,
      message: `Access denied. Required role: ${roles.join(" or ")}`,
    });
  };
};

const isSuperAdmin = (req, res, next) => {
  const superAdminEmail = (process.env.SUPER_ADMIN_EMAIL || "admin@gmail.com").toLowerCase();
  if (req.user?.email?.toLowerCase() === superAdminEmail) {
    return next();
  }
  return res.status(403).json({
    status: false,
    message: `Access denied. Super Admin only.`,
  });
};


export { isAdminRoute, protectRoute,isSuperAdmin,allowRoles };
