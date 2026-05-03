import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
  {
    title: { type: String, required: true },
    date: { type: Date, default: new Date() },
    priority: {
      type: String,
      default: "normal",
      enum: ["high", "medium", "normal", "low"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdByRole: {
      type: String,
      enum: ["admin", "user"],
      required: true,
    },
    stage: {
      type: String,
      default: "todo",
      enum: ["todo", "in progress", "completed"],
    },
    activities: [
      {
        type: {
          type: String,
          default: "assigned",
          enum: [
            "assigned",
            "started",
            "in progress",
            "bug",
            "completed",
            "commented",
            "subtask",
            "update",
          ],

        },
        activity: String,
        date: { type: Date, default: new Date() },
        by: { type: Schema.Types.ObjectId, ref: "User" },
      },
    ],
    subTasks: [
      {
        title: { type: String, required: true },
        date: { type: Date },
        tag: { type: String },
        isCompleted: { type: Boolean, default: false },
      },
    ],
    team: [{ type: Schema.Types.ObjectId, ref: "User" }],
    isTrashed: { type: Boolean, default: false },
    trashedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);
taskSchema.index(
  { trashedAt: 1 },
  { expireAfterSeconds: 30 * 24 * 60 * 60 } // 30 days
);
const Task = mongoose.model("Task", taskSchema);

export default Task;
