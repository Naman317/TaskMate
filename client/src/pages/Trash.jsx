import React, { useEffect, useState } from "react";
import { 
  Trash2, 
  RefreshCcw, 
  Trash, 
  History, 
  AlertTriangle,
  Calendar,
  MoreHorizontal
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import clsx from "clsx";

import API from "../assets/axios";
import { PRIOTITYSTYELS, TASK_TYPE } from "../utils";
import ConfirmatioDialog from "../components/Dialogs";
import Button from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import Skeleton from "../components/ui/Skeleton";

const TrashPage = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [msg, setMsg] = useState(null);
  const [type, setType] = useState("delete");
  const [selected, setSelected] = useState("");
  const [trashedTasks, setTrashedTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrashedTasks = async () => {
    try {
      setLoading(true);
      const res = await API.get("/task?isTrashed=true", {
        withCredentials: true,
      });
      setTrashedTasks(res.data.tasks || []);
    } catch (err) {
      console.error("Failed to load trashed tasks:", err.message);
      toast.error("Failed to load trashed tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrashedTasks();
  }, []);

  const deleteRestoreHandler = async () => {
    try {
      let endpoint = "/task/delete-restore";
      let query = "";

      if (type === "delete" || type === "restore") {
        query = `/${selected}?actionType=${type}`;
      } else if (type === "deleteAll" || type === "restoreAll") {
        query = `?actionType=${type}`;
      }

      const res = await API.delete(`${endpoint}${query}`, {
        withCredentials: true,
      });

      toast.success(res.data.message);
      setOpenDialog(false);
      setSelected("");
      fetchTrashedTasks();
    } catch (error) {
      console.error("Action failed:", error);
      toast.error("Operation failed.");
    }
  };

  const deleteClick = (id) => {
    setType("delete");
    setSelected(id);
    setMsg("Do you want to permanently delete this task?");
    setOpenDialog(true);
  };

  const restoreClick = (id) => {
    setType("restore");
    setSelected(id);
    setMsg("Do you want to restore this task?");
    setOpenDialog(true);
  };

  const deleteAllClick = () => {
    setType("deleteAll");
    setMsg("Do you want to permanently delete all trashed tasks? This action cannot be undone.");
    setOpenDialog(true);
  };

  const restoreAllClick = () => {
    setType("restoreAll");
    setMsg("Do you want to restore all trashed tasks?");
    setOpenDialog(true);
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-in">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <Card>
          <CardContent className="p-0">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full border-b" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trash</h1>
          <p className="text-muted-foreground">Items in trash will be permanently deleted after 30 days.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={restoreAllClick}
            icon={<RefreshCcw size={18} />}
            label="Restore All"
            disabled={trashedTasks.length === 0}
          />
          <Button
            variant="danger"
            onClick={deleteAllClick}
            icon={<Trash2 size={18} />}
            label="Empty Trash"
            disabled={trashedTasks.length === 0}
          />
        </div>
      </div>

      <Card className="overflow-hidden border-border/50 shadow-premium">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="px-6 py-4">Task Title</th>
                  <th className="px-6 py-4">Priority</th>
                  <th className="px-6 py-4">Stage</th>
                  <th className="px-6 py-4">Deleted On</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {trashedTasks.length > 0 ? (
                  trashedTasks.map((tk, idx) => (
                    <motion.tr
                      key={tk._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group hover:bg-accent/30 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={clsx("w-2 h-2 rounded-full", TASK_TYPE[tk.stage])} />
                          <span className="text-sm font-medium text-foreground max-w-xs truncate">{tk.title}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={clsx(
                          "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border",
                          tk.priority === "high" ? "bg-rose-100 text-rose-700 border-rose-200" :
                          tk.priority === "medium" ? "bg-amber-100 text-amber-700 border-amber-200" : "bg-blue-100 text-blue-700 border-blue-200"
                        )}>
                          {tk.priority}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs font-medium text-muted-foreground capitalize">{tk.stage}</span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar size={12} />
                          {new Date(tk?.updatedAt).toLocaleDateString()}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<RefreshCcw size={16} />}
                            onClick={() => restoreClick(tk._id)}
                            title="Restore Task"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            icon={<Trash2 size={16} />}
                            onClick={() => deleteClick(tk._id)}
                            title="Delete Permanently"
                          />
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <History size={48} strokeWidth={1} className="text-muted-foreground/30" />
                        <p className="text-lg font-medium">Trash is empty</p>
                        <p className="text-sm">Tasks you delete will appear here.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        msg={msg}
        setMsg={setMsg}
        type={type}
        setType={setType}
        onClick={deleteRestoreHandler}
      />
    </div>
  );
};

export default TrashPage;
