import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import {
  MoreVertical,
  MessageSquare,
  ListChecks,
  Plus,
  Eye,
  Edit,
  Trash2,
  Calendar,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { toast } from "sonner";

import API from "../assets/axios";
import { BGS, PRIOTITYSTYELS, TASK_TYPE, formatDate } from "../utils";
import AddSubTask from "./task/AddSubTask";
import AddTask from "./task/AddTask";
import ConfirmatioDialog from "./Dialogs";
import UserInfo from "./UserInfo";
import { Card, CardContent, CardFooter } from "./ui/Card";

const TaskCard = ({ task, onSubTaskAdded }) => {
  const { user } = useSelector((state) => state.auth);
  const [openSubtask, setOpenSubtask] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const isOverdue = new Date(task?.date) < new Date() && task?.stage !== "completed";


  const handleView = () => navigate(`/task/${task._id}`);
  const handleEdit = () => setOpenEdit(true);
  const handleDeleteClick = () => setOpenDialog(true);

  const deleteHandler = async () => {
    try {
      await API.put(`task/${task._id}`);
      toast.success("Task moved to trash");
      if (onSubTaskAdded) onSubTaskAdded();
      else window.location.reload();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete task");
    }
  };

  const priorityColors = {
    high: "bg-rose-100 text-rose-700 border-rose-200",
    medium: "bg-amber-100 text-amber-700 border-amber-200",
    low: "bg-blue-100 text-blue-700 border-blue-200",
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="w-full"
    >
      <Card className={clsx(
        "group border-border/50 hover:border-primary/30 hover:shadow-premium transition-all overflow-visible",
        isOverdue && "border-red-200 bg-red-50/30"
      )}>
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-4">
            <span className={clsx(
              "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
              priorityColors[task?.priority]
            )}>
              {task?.priority} Priority
            </span>

            <Menu as="div" className="relative">
              <Menu.Button className="p-1.5 rounded-md hover:bg-accent text-muted-foreground transition-colors">
                <MoreVertical size={16} />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-1 w-36 origin-top-right rounded-lg border bg-card p-1 shadow-lg z-50 outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleView}
                        className={clsx(
                          "flex w-full items-center gap-2 px-3 py-1.5 text-xs rounded-md",
                          active ? "bg-accent" : ""
                        )}
                      >
                        <Eye size={14} /> View
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleEdit}
                        className={clsx(
                          "flex w-full items-center gap-2 px-3 py-1.5 text-xs rounded-md",
                          active ? "bg-accent" : ""
                        )}
                      >
                        <Edit size={14} /> Edit
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleDeleteClick}
                        className={clsx(
                          "flex w-full items-center gap-2 px-3 py-1.5 text-xs rounded-md text-red-500",
                          active ? "bg-red-500/10" : ""
                        )}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className={clsx("w-2 h-2 rounded-full mt-2 shrink-0", 
                task.stage === "todo" ? "bg-rose-500" : 
                task.stage === "in progress" ? "bg-amber-500" : "bg-emerald-500"
              )} />
              <h4 className="font-bold text-foreground leading-tight group-hover:text-primary transition-colors cursor-pointer" onClick={handleView}>
                {task?.title}
              </h4>
              {isOverdue && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded uppercase tracking-wider animate-pulse">
                  <AlertCircle size={10} /> Overdue
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium">
              <Calendar size={12} />
              {formatDate(new Date(task?.date))}
            </div>

            {task.createdByRole === "admin" && (
              <div className="flex items-center gap-1.5 px-2 py-1 bg-primary/5 rounded border border-primary/10 w-fit">
                <TrendingUp size={10} className="text-primary" />
                <span className="text-[10px] font-semibold text-primary/80">
                  Assigned by {task?.createdBy?.name}
                </span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="px-5 py-4 bg-accent/50 border-t flex flex-col gap-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex gap-4 text-muted-foreground">
              <div className="flex gap-1 items-center hover:text-foreground transition-colors cursor-help" title="Comments">
                <MessageSquare size={14} />
                <span className="text-xs font-medium">{task?.activities?.length}</span>
              </div>
              <div className="flex gap-1 items-center hover:text-foreground transition-colors cursor-help" title="Subtasks">
                <ListChecks size={14} />
                <span className="text-xs font-medium">
                  {task?.subTasks?.filter(s => s.isCompleted).length}/{task?.subTasks?.length}
                </span>
              </div>
            </div>

            <div className="flex -space-x-2">
              {task?.team?.slice(0, 3).map((m, i) => (
                <div key={i} title={m.name}>
                  <UserInfo user={m} />
                </div>
              ))}
              {task?.team?.length > 3 && (
                <div className="w-7 h-7 rounded-full bg-background border-2 border-accent flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                  +{task?.team?.length - 3}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setOpenSubtask(true)}
            disabled={!user.isAdmin}
            className="flex items-center gap-2 text-[10px] font-bold text-primary hover:text-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors uppercase tracking-widest"
          >
            <Plus size={14} />
            Add Subtask
          </button>
        </CardFooter>
      </Card>

      <AddSubTask
        open={openSubtask}
        setOpen={setOpenSubtask}
        id={task._id}
        onSubTaskAdded={onSubTaskAdded || (() => window.location.reload())}
      />

      <AddTask open={openEdit} setOpen={setOpenEdit} task={task} />

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />
    </motion.div>
  );
};

export default TaskCard;
