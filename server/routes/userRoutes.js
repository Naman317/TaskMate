import express from "express";
import { isAdminRoute, protectRoute } from "../middlewares/authMiddlewave.js";
import {
  changeUserPassword,
  deleteUserProfile,
  getNotificationsList,
  getTeamList,
  loginUser,
  logoutUser,
  markNotificationRead,
  registerUser,
  updateUserProfile,
  updateUserRole,
  markAllNotiRead,
  markNotiAsRead
} from "../controllers/userController.js";

const router = express.Router();
router.put("/update-role/:id", protectRoute,updateUserRole);

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.get("/get-team", getTeamList);
router.get("/notifications", protectRoute, getNotificationsList);
router.patch("/notification/read-all", protectRoute, markAllNotiRead);
router.patch("/notification/read/:id", protectRoute, markNotiAsRead);

router.put("/profile", protectRoute, updateUserProfile);
router.put("/read-noti", protectRoute, markNotificationRead);
router.put("/change-password", protectRoute, changeUserPassword);

// //   FOR ADMIN ONLY - ADMIN ROUTES
router
  .route("/:id")
  .delete(protectRoute, isAdminRoute, deleteUserProfile);

export default router;
