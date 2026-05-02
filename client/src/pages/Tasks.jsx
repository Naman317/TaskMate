import React, { useState } from "react";
import { LayoutGrid, List, Plus, Mic, MicOff, Search, Filter, Download } from "lucide-react";

import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

import Loading from "../components/Loader";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Skeleton from "../components/ui/Skeleton";
import BoardView from "../components/BoardView";
import Table from "../components/task/Table";
import AddTask from "../components/task/AddTask";
import useToast from "../hooks/useToast";
import { useGetTasksQuery, useDeleteRestoreTaskMutation } from "../redux/api/taskApiSlice";

const Tasks = () => {
  const params = useParams();
  const toast = useToast();
  const [listening, setListening] = useState(false);
  const [view, setView] = useState("board"); // "board" or "list"
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const status = params?.status || "";
  const isTrashed = status === "trashed";
  const isOverdueTab = status === "overdue";

  // SDE 2 move: Using RTK Query for data fetching
  const { data, isLoading, error, refetch } = useGetTasksQuery({
    stage: (status !== "trashed" && status !== "overdue") ? status : "",
    isTrashed,
  });


  const [deleteRestoreTask] = useDeleteRestoreTaskMutation();

  const handleVoiceCommand = (command) => {
    const lowerCommand = command.toLowerCase();
    if (lowerCommand.includes("create task") || lowerCommand.includes("add task")) {
      setOpen(true);
    }
  };

  const startVoiceRecognition = () => {
    if (!("webkitSpeechRecognition" in window)) {
      toast.error("Voice recognition not supported");
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.onstart = () => setListening(true);
    recognition.onresult = (e) => handleVoiceCommand(e.results[0][0].transcript);
    recognition.onend = () => setListening(false);
    recognition.start();
  };

  const handleDelete = async (taskId) => {
    try {
      await deleteRestoreTask({ id: taskId, actionType: "delete" }).unwrap();
      toast.success("Task deleted");
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  const exportToCSV = () => {
    if (!data?.tasks?.length) return toast.error("No tasks to export");
    const headers = ["Title", "Stage", "Priority", "Due Date", "Created At"];
    const csvContent = [
      headers.join(","),
      ...data.tasks.map(t => [
        `"${t.title.replace(/"/g, '""')}"`,
        t.stage,
        t.priority,
        new Date(t.date).toLocaleDateString(),
        new Date(t.createdAt).toLocaleDateString()
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `tasks_export_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Tasks exported successfully!");
  };

  const filteredTasks = data?.tasks?.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (isOverdueTab) {
      const taskIsOverdue = new Date(task.date) < new Date() && task.stage !== "completed";
      return matchesSearch && taskIsOverdue;
    }
    return matchesSearch;
  }) || [];


  if (isLoading) {
    return (
      <div className="space-y-6 animate-in">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-[600px]" />
          <Skeleton className="h-[600px]" />
          <Skeleton className="h-[600px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight capitalize">
            {status || "All"} Tasks
          </h1>
          <p className="text-muted-foreground">Manage and track your project tasks.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>

          <div className="flex items-center bg-muted p-1 rounded-lg">
            <button
              onClick={() => setView("board")}
              className={clsx(
                "p-2 rounded-md transition-all",
                view === "board" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setView("list")}
              className={clsx(
                "p-2 rounded-md transition-all",
                view === "list" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <List size={18} />
            </button>
          </div>

          <Button
            variant="outline"
            icon={<Download size={18} />}
            onClick={exportToCSV}
            className="hidden md:flex"
            label="Export"
          />

          <Button
            variant={listening ? "secondary" : "outline"}
            icon={listening ? <Mic className="animate-pulse text-red-500" size={18} /> : <Mic size={18} />}
            onClick={startVoiceRecognition}
            className="hidden lg:flex"
          />

          <Button
            label="Create Task"
            icon={<Plus size={18} />}
            onClick={() => setOpen(true)}
          />

        </div>
      </div>

      {filteredTasks.length > 0 ? (
        view === "board" ? (
          <BoardView tasks={filteredTasks} />
        ) : (
          <div className="bg-card border rounded-xl overflow-hidden shadow-premium">
            <Table tasks={filteredTasks} />
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-muted/30 rounded-3xl border-2 border-dashed border-border/50">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Search size={32} className="text-muted-foreground/50" />
          </div>
          <h3 className="text-xl font-bold">No tasks found</h3>
          <p className="text-muted-foreground mt-2 max-w-sm">
            {searchQuery ? `We couldn't find any tasks matching "${searchQuery}"` : "You haven't created any tasks yet."}
          </p>
          {!searchQuery && (
            <Button
              label="Create your first task"
              variant="outline"
              className="mt-6"
              onClick={() => setOpen(true)}
            />
          )}
        </div>
      )}

      <AddTask
        open={open}
        setOpen={setOpen}
        refresh={refetch}
      />
    </div>
  );
};

export default Tasks;
