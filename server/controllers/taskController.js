import Notice from "../models/notification.js";
import Task from "../models/task.js";
import User from "../models/user.js";
import mongoose from "mongoose";


export const createTask = async (req, res) => {
  try {
    const { userId, isAdmin } = req.user;
    const { title, team, stage, date, priority } = req.body;

    if (!title || !date) {
      return res.status(400).json({
        status: false,
        message: "Title and Date are required.",
      });
    }

    if (!Array.isArray(team) || team.length === 0) {
      return res.status(400).json({
        status: false,
        message: "At least one team member must be assigned.",
      });
    }

    const normalizedStage = stage?.toLowerCase() || "todo";
    const normalizedPriority = priority?.toLowerCase() || "normal";

    let text = "New task has been assigned to you";
    if (team?.length > 1) {
      text += ` and ${team.length - 1} others.`;
    }

    text += ` The task priority is set at ${normalizedPriority.toUpperCase()} priority. The task date is ${new Date(date).toDateString()}.`;

    const activity = {
      type: "assigned",
      activity: text,
      by: userId,
    };

    const task = await Task.create({
      title,
      team,
      stage: normalizedStage,
      date,
      priority: normalizedPriority,
      activities: activity,
      createdBy: userId,
      createdByRole: isAdmin ? "admin" : "user",
    });

    await Notice.create({
  team: team.map(id => new mongoose.Types.ObjectId(id)), // ✅ force to ObjectIds
  text,
  task: task._id,
});


    res.status(200).json({ status: true, task, message: "Task created successfully." });
  } catch (error) {
    console.error(error);
    res.status(400).json({ status: false, message: error.message });
  }
};

export const postTaskActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    const { type, activity } = req.body;

    const task = await Task.findById(id);

    const data = {
      type,
      activity,
      by: userId,
    };

    task.activities.push(data);

    await task.save();

    res
      .status(200)
      .json({ status: true, message: "Activity posted successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const dashboardStatistics = async (req, res) => {
  try {
    const { userId, isAdmin } = req.user;

    const allTasks = isAdmin
      ? await Task.find({
          isTrashed: false,
        })
          .populate({
            path: "team",
            select: "name role title email",
          })
          .sort({ _id: -1 })
      : await Task.find({
          isTrashed: false,
          team: { $all: [userId] },
        })
          .populate({
            path: "team",
            select: "name role title email",
          })
          .sort({ _id: -1 });

    const users = await User.find({ isActive: true })
      .select("name title role isAdmin createdAt")
      .limit(10)
      .sort({ _id: -1 });

    //   group task by stage and calculate counts
    const groupTaskks = allTasks.reduce((result, task) => {
      const stage = task.stage;

      if (!result[stage]) {
        result[stage] = 1;
      } else {
        result[stage] += 1;
      }

      return result;
    }, {});

    // Group tasks by priority
    const groupData = Object.entries(
      allTasks.reduce((result, task) => {
        const { priority } = task;

        result[priority] = (result[priority] || 0) + 1;
        return result;
      }, {})
    ).map(([name, total]) => ({ name, total }));

    // calculate total tasks
    const totalTasks = allTasks?.length;
    const last10Task = allTasks?.slice(0, 10);

    const summary = {
      totalTasks,
      last10Task,
      users: isAdmin ? users : [],
      tasks: groupTaskks,
      graphData: groupData,
    };

    res.status(200).json({
      status: true,
      message: "Successfully",
      ...summary,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};
export const getTasks = async (req, res) => {
  try {
    const { stage, isTrashed } = req.query;
    const { userId } = req.user;

    const query = {
      isTrashed: isTrashed ? true : false,
      $or: [
        { team: userId },           // Tasks assigned to the user
        { createdBy: userId },      // Tasks created by the user
      ],
    };

    if (stage) query.stage = stage;

    const tasks = await Task.find(query)
      .populate({
        path: "team",
        select: "name title email",
      })
      .populate({
        path: "createdBy",
        select: "name email",
      })
      .sort({ _id: -1 });

    res.status(200).json({ status: true, tasks });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const getTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, isAdmin } = req.user;

    const task = await Task.findById(id)
      .populate({
        path: "team",
        select: "name title role email",
      })
      .populate({
        path: "activities.by",
        select: "name",
      });

    if (!task) {
      return res.status(404).json({ status: false, message: "Task not found." });
    }

    // Check access
    const isTeamMember = task.team?.some((memberId) => memberId.equals(userId));
    const isOwner = task.createdBy?.toString() === userId;

    if (
      task.createdByRole === "admin" || 
      isTeamMember || 
      isOwner || 
      isAdmin
    ) {
      return res.status(200).json({ status: true, task });
    } else {
      return res.status(403).json({
        status: false,
        message: "You are not authorized to view this task.",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};


export const createSubTask = async (req, res) => {
  try {
    const { title, tag, date } = req.body;
    const { id } = req.params;
    const { userId, isAdmin } = req.user;

    if (!title || !date) {
      return res.status(400).json({
        status: false,
        message: "Subtask title and date are required.",
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        status: false,
        message: "Parent task not found.",
      });
    }

    const isTeamMember = task.team?.some((memberId) => memberId.equals(userId));
    const isOwner = task.createdBy?.toString() === userId;

    if (!isAdmin && !isTeamMember && !isOwner) {
      return res.status(403).json({
        status: false,
        message: "You are not authorized to add subtasks to this task.",
      });
    }

    const newSubTask = { title, tag, date };
    task.subTasks.push(newSubTask);

    task.activities.push({
      type: "subtask",
      activity: `Added a subtask "${title}"`,
      by: userId,
    });

    await task.save();

    res.status(200).json({
      status: true,
      message: "Subtask added successfully.",
      subTask: newSubTask,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};


export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, team, stage, priority, assets } = req.body;
    const { userId, isAdmin } = req.user;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        status: false,
        message: "Task not found.",
      });
    }

    // Prevent regular users from editing admin-created tasks
    if (task.createdByRole === "admin" && !isAdmin) {
      return res.status(403).json({
        status: false,
        message: "You are not authorized to update this admin-created task.",
      });
    }

    task.title = title;
    task.date = date;
    task.priority = priority.toLowerCase();
    task.assets = assets;
    task.stage = stage.toLowerCase();
    task.team = team;

    // Optional: log activity
    task.activities.push({
      type: "update",
      activity: `Task updated by user`,
      by: userId,
    });

    await task.save();

    res.status(200).json({
      status: true,
      message: "Task updated successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};
export const trashTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { isAdmin, userId } = req.user;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ status: false, message: "Task not found." });

    if (task.createdByRole === "admin" && !isAdmin) {
      return res.status(403).json({
        status: false,
        message: "You are not authorized to trash this admin-created task.",
      });
    }

    task.isTrashed = true;
    await task.save();

    res.status(200).json({ status: true, message: "Task trashed successfully." });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, message: error.message });
  }
};

export const deleteRestoreTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { actionType } = req.query;
    const { isAdmin } = req.user;

    if (actionType === "delete") {
      const task = await Task.findById(id);
      if (!task) return res.status(404).json({ status: false, message: "Task not found." });
      if (task.createdByRole === "admin" && !isAdmin) {
        return res.status(403).json({ status: false, message: "You are not authorized to delete this admin-created task." });
      }
      await Task.findByIdAndDelete(id);
    }

    else if (actionType === "deleteAll") {
      if (!isAdmin) {
        return res.status(403).json({
          status: false,
          message: "Only admins can delete all trashed tasks.",
        });
      }
      await Task.deleteMany({ isTrashed: true });
    }

    else if (actionType === "restore") {
      const task = await Task.findById(id);
      if (!task) return res.status(404).json({ status: false, message: "Task not found." });

      task.isTrashed = false;
      await task.save();
    }

    else if (actionType === "restoreAll") {
      await Task.updateMany({ isTrashed: true }, { $set: { isTrashed: false } });
    }

    res.status(200).json({ status: true, message: `Operation '${actionType}' performed successfully.` });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, message: error.message });
  }
};
