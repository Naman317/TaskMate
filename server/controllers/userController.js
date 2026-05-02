import { response } from "express";
import Notice from "../models/notification.js";

import User from "../models/user.js";
import { createJWT } from "../utils/index.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, isAdmin, title, role } = req.body;
    const userExist = await User.findOne({ email });
    if (userExist)
      return res.status(400).json({ status: false, message: "User already exists" });

    const user = new User({ name, email, password, isAdmin, title, role });
    await user.save();
    createJWT(res, user._id);

    user.password = undefined;
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ status: false, message: "Invalid email." });
   

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ status: false, message: "Invalid email or password" });

    createJWT(res, user._id);
    user.password = undefined;
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};

export const logoutUser = async (req, res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: "Logout successful" });
};

export const getTeamList = async (req, res) => {
  try {
    const users = await User.find({ email: { $ne: "admin@gmail.com" } }).select("_id name email role");


    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching team list:", error);
    return res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};


export const getNotificationsList = async (req, res) => {
  try {
    const { userId } = req.user;

    const notifications = await Notice.find({ team: userId })
      .populate("task", "title") // Optional: populate task title
      .sort({ createdAt: -1 });

    res.status(200).json({ status: true, notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ status: false, message: "Error fetching notifications" });
  }
};

export const markNotiAsRead = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;

    const notice = await Notice.findById(id);

    if (!notice) {
      return res.status(404).json({ status: false, message: "Notification not found" });
    }

    if (!notice.isRead.includes(userId)) {
      notice.isRead.push(userId);
      await notice.save();
    }

    res.status(200).json({ status: true, message: "Marked as read" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ status: false, message: "Failed to mark as read" });
  }
};


export const markAllNotiRead = async (req, res) => {
  try {
    const { userId } = req.user;

    await Notice.updateMany(
      {
        team: userId,
        isRead: { $ne: userId }, // $ne = not equal, safer than $nin for scalar comparison
      },
      {
        $addToSet: { isRead: userId }, // avoids duplicates automatically
      }
    );

    res.status(200).json({ status: true, message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking all notifications read:", error);
    res.status(500).json({ status: false, message: "Failed to mark all as read" });
  }
};



export const updateUserProfile = async (req, res) => {
  try {
    const { userId, isAdmin } = req.user;
    const { _id } = req.body;

    const id =
      isAdmin && userId === _id
        ? userId
        : isAdmin && userId !== _id
        ? _id
        : userId;

    const user = await User.findById(id);

    if (user) {
      user.name = req.body.name || user.name;
      user.title = req.body.title || user.title;
      user.role = req.body.role || user.role;

      const updatedUser = await user.save();

      user.password = undefined;

      res.status(201).json({
        status: true,
        message: "Profile Updated Successfully.",
        user: updatedUser,
      });
    } else {
      res.status(404).json({ status: false, message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const { id } = req.params;
    const user = req.user;

    // Only super admin can update roles
    if (user.email !== "admin@gmail.com") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Validate allowed roles
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Set isAdmin based on role
    const isAdmin = role === "admin";

    const updated = await User.findByIdAndUpdate(
      id,
      { role, isAdmin },
      { new: true }
    ).select("-password"); // remove password in response for safety

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Role updated successfully", user: updated });
  } catch (err) {
    console.error("Error updating role:", err);
    res.status(500).json({ message: "Role update failed" });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const { userId } = req.user;

    const { isReadType, id } = req.query;

    if (isReadType === "all") {
      await Notice.updateMany(
        { team: userId, isRead: { $nin: [userId] } },
        { $push: { isRead: userId } },
        { new: true }
      );
    } else {
      await Notice.findOneAndUpdate(
        { _id: id, isRead: { $nin: [userId] } },
        { $push: { isRead: userId } },
        { new: true }
      );
    }

    res.status(201).json({ status: true, message: "Done" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};
export const changeUserPassword = async (req, res) => {
  try {
    const { oldPassword, password: newPassword } = req.body;
    const { userId } = req.user;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ status: false, message: "Both old and new passwords are required." });
    }

    const user = await User.findById(userId).select("+password");
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ status: false, message: "Old password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ status: true, message: "Password changed successfully." });
  } catch (error) {
    console.error("Password change error:", error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const deleteUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    await User.findByIdAndDelete(id);

    res
      .status(200)
      .json({ status: true, message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};
