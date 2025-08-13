import express from "express";
import {
  createSubTask,
  createTask,
  dashboardStatistics,
  deleteRestoreTask,
  getTask,
  getTasks,
  postTaskActivity,
  trashTask,
  updateTask,
} from "../controllers/taskController.js";

import { isAdminRoute, protectRoute } from "../middlewares/authMiddlewave.js";

const router = express.Router();

// Task Creation 
router.post("/create", protectRoute, createTask);

// Activities & Subtasks
router.post("/activity/:id", protectRoute, postTaskActivity);
router.put("/create-subtask/:id", protectRoute, isAdminRoute, createSubTask);

// Dashboard
router.get("/dashboard", protectRoute, dashboardStatistics);

// Task Retrieval
router.get("/", protectRoute, getTasks);
router.get("/:id", protectRoute, getTask);

// Task Update & Trash

router.put("/update/:id", protectRoute, updateTask);                 // Edit
router.put("/:id", protectRoute, trashTask);                         // Soft delete (move to trash)

router.delete(
  "/delete-restore/:id?",
  protectRoute,
  deleteRestoreTask
);


export default router;
