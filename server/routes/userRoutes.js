import express from "express";
import { isAdminRoute, isSuperAdmin, protectRoute } from "../middlewares/authMiddlewave.js";
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
  markNotiAsRead,
  googleAuth,
  forgotPassword,
  resetPassword,
  inviteMember,
  getInvitation,
  acceptInvite,
} from "../controllers/userController.js";

const router = express.Router();

// Role updates
router.put("/update-role/:id", protectRoute, isSuperAdmin, updateUserRole);

// Auth Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/google-auth", googleAuth);

// Password Reset Routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Team & Invitations
router.get("/get-team", getTeamList);
router.post("/invite-member", protectRoute, isAdminRoute, inviteMember);
router.get("/invitation/:token", getInvitation);
router.post("/accept-invite", acceptInvite);

// Notifications
router.get("/notifications", protectRoute, getNotificationsList);
router.patch("/notification/read-all", protectRoute, markAllNotiRead);
router.patch("/notification/read/:id", protectRoute, markNotiAsRead);

// User Profile
router.put("/profile", protectRoute, updateUserProfile);
router.put("/read-noti", protectRoute, markNotificationRead);
router.put("/change-password", protectRoute, changeUserPassword);

// Admin Deletion
router
  .route("/:id")
  .delete(protectRoute, isSuperAdmin, deleteUserProfile);

export default router;
