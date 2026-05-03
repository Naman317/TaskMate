import React, { useState } from "react";
import { LayoutGrid, List, Plus, Mic, MicOff, Search, Filter, Download } from "lucide-react";

import { useParams, useNavigate } from "react-router-dom";
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
import { toast } from "sonner";
import { useGetTasksQuery, useDeleteRestoreTaskMutation, useUpdateTaskMutation, useTrashTaskMutation } from "../redux/api/taskApiSlice";
import { useSelector } from "react-redux";



const Tasks = () => {
  const params = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useSelector((state) => state.auth);
  const [listening, setListening] = useState(false);
  const [view, setView] = useState("board"); // "board" or "list"
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [prefillData, setPrefillData] = useState(null);

  const status = params?.status || "";
  const isTrashed = status === "trashed";
  const isOverdueTab = status === "overdue";

  const { data, isLoading, error, refetch } = useGetTasksQuery({
    stage: (status !== "trashed" && status !== "overdue") ? status : "",
    isTrashed,
  });

  const [deleteRestoreTask] = useDeleteRestoreTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [trashTask] = useTrashTaskMutation();

  const handleDelete = async (taskId) => {
    try {
      await deleteRestoreTask({ id: taskId, actionType: "delete" }).unwrap();
      toast.success("Task deleted successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete task");
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

  const handleVoiceCommand = async (command) => {
    const lowerCommand = command.toLowerCase().trim();
    
    // View Toggling
    if (lowerCommand.includes("switch to list view") || lowerCommand.includes("list view")) {
      setView("list");
      toast.success("Switched to List View");
      return;
    }
    if (lowerCommand.includes("switch to board view") || lowerCommand.includes("board view")) {
      setView("board");
      toast.success("Switched to Board View");
      return;
    }

    // Navigation
    if (lowerCommand.includes("go to dashboard") || lowerCommand.includes("open dashboard")) {
      navigate("/dashboard");
      return;
    }
    if (lowerCommand.includes("go to trash") || lowerCommand.includes("open trash")) {
      navigate("/trashed");
      return;
    }

    // Searching
    if (lowerCommand.startsWith("search for ")) {
      const q = lowerCommand.replace("search for ", "").trim();
      setSearchQuery(q);
      toast.success(`Searching for "${q}"`);
      return;
    }
    if (lowerCommand === "clear search") {
      setSearchQuery("");
      toast.success("Search cleared");
      return;
    }

    // Export Data
    if (lowerCommand.includes("export tasks") || lowerCommand.includes("download csv") || lowerCommand.includes("export to csv")) {
      exportToCSV();
      return;
    }

    // Stage Movement
    if (lowerCommand.startsWith("move ") && lowerCommand.includes(" to ")) {
      const match = lowerCommand.match(/^move\s+(.+)\s+to\s+(.+)$/);
      if (match) {
        const titleToFind = match[1].trim();
        let targetStage = match[2].trim();
        
        if (targetStage === "to do") targetStage = "todo";
        
        if (!["todo", "in progress", "completed"].includes(targetStage)) {
          toast.error(`Unknown stage "${targetStage}". Try "todo", "in progress", or "completed".`);
          return;
        }

        const taskToMove = data?.tasks?.find(t => t.title.toLowerCase() === titleToFind);
        if (taskToMove) {
          try {
            await updateTask({
              id: taskToMove._id,
              data: { ...taskToMove, stage: targetStage, team: taskToMove.team?.map(t => t._id || t) }
            }).unwrap();
            toast.success(`Moved "${taskToMove.title}" to ${targetStage}`);
          } catch (err) {
             toast.error(err?.data?.message || "Failed to move task");
          }
        } else {
          toast.error(`Could not find task "${titleToFind}"`);
        }
        return;
      }
    }

    if (lowerCommand.startsWith("mark ") && lowerCommand.includes(" as completed")) {
      const titleToFind = lowerCommand.replace("mark ", "").replace(" as completed", "").trim();
      const taskToMove = data?.tasks?.find(t => t.title.toLowerCase() === titleToFind);
      if (taskToMove) {
          try {
            await updateTask({
              id: taskToMove._id,
              data: { ...taskToMove, stage: "completed", team: taskToMove.team?.map(t => t._id || t) }
            }).unwrap();
            toast.success(`Marked "${taskToMove.title}" as completed`);
          } catch (err) {
             toast.error(err?.data?.message || "Failed to mark as completed");
          }
      } else {
        toast.error(`Could not find task "${titleToFind}"`);
      }
      return;
    }

    if (lowerCommand.startsWith("create task ") || lowerCommand.startsWith("add task ")) {
      const title = command.replace(/create task |add task /i, "").trim();
      setPrefillData({ title, priority: "normal" });
      setSelectedTask(null);
      setOpen(true);
      return;
    }

    if (lowerCommand === "create task" || lowerCommand === "add task") {
      setPrefillData(null);
      setSelectedTask(null);
      setOpen(true);
      return;
    }

    if (lowerCommand.startsWith("edit task ")) {
      const titleToFind = lowerCommand.replace("edit task ", "").trim();
      const taskToEdit = data?.tasks?.find(t => t.title.toLowerCase() === titleToFind);
      if (taskToEdit) {
        setSelectedTask(taskToEdit);
        setPrefillData(null);
        setOpen(true);
      } else {
        toast.error(`Could not find task "${titleToFind}" to edit.`);
      }
      return;
    }

    if (lowerCommand.startsWith("delete task ")) {
      const titleToFind = lowerCommand.replace("delete task ", "").trim();
      const taskToDelete = data?.tasks?.find(t => t.title.toLowerCase() === titleToFind);
      
      if (taskToDelete) {
        if (taskToDelete.createdByRole === "admin" && !user?.isAdmin) {
          toast.error("You are not authorized to trash this admin-created task.");
          return;
        }
        try {
          await trashTask(taskToDelete._id).unwrap();
          toast.success(`"${taskToDelete.title}" moved to trash.`);
        } catch (err) {
          toast.error(err?.data?.message || "Failed to trash task.");
        }
      } else {
        toast.error(`Could not find task "${titleToFind}".`);
      }
      return;
    }

    
    // ── Bulk: Delete All Tasks ──────────────────────────────────────────
    if (
      lowerCommand.includes("delete all tasks") ||
      lowerCommand.includes("delete all")
    ) {
      const tasks = data?.tasks || [];
      if (!tasks.length) { toast.error("No tasks to delete."); return; }

      if (!user?.isAdmin) {
        toast.error("Only admins can delete all tasks.");
        return;
      }

      toast.promise(
        Promise.all(tasks.map((t) => trashTask(t._id).unwrap())),
        {
          loading: `Moving ${tasks.length} task(s) to trash…`,
          success: `Moved ${tasks.length} task(s) to trash.`,
          error: "Some tasks could not be trashed.",
        }
      );
      return;
    }

    // ── Bulk: Mark All as Completed ─────────────────────────────────────
    if (
      lowerCommand.includes("mark all as completed") ||
      lowerCommand.includes("complete all tasks") ||
      lowerCommand.includes("mark all tasks as completed") ||
      lowerCommand.includes("complete all")
    ) {
      const pending = data?.tasks?.filter((t) => t.stage !== "completed") || [];
      if (!pending.length) { toast.success("All tasks are already completed!"); return; }

      toast.promise(
        Promise.all(
          pending.map((t) =>
            updateTask({
              id: t._id,
              data: { ...t, stage: "completed", team: t.team?.map((m) => m._id || m) },
            }).unwrap()
          )
        ),
        {
          loading: `Completing ${pending.length} task(s)…`,
          success: `Marked ${pending.length} task(s) as completed.`,
          error: "Some tasks could not be updated.",
        }
      );
      return;
    }



    toast.error("Command not recognized.");
  };


  const startVoiceRecognition = () => {
    if (!("webkitSpeechRecognition" in window)) {
      toast.error("Voice recognition not supported");
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.onstart = () => setListening(true);
    recognition.onresult = (e) => {
      const raw = e.results[0][0].transcript;
      // Strip trailing/leading punctuation added by the Speech API
      const clean = raw.replace(/[.,!?;:]+$/g, "").trim();
      handleVoiceCommand(clean);
    };
    recognition.onend = () => setListening(false);
    recognition.start();
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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
          <Search size={32} />
        </div>
        <h3 className="text-xl font-bold">Failed to load tasks</h3>
        <p className="text-muted-foreground mt-2 max-w-sm">
          {error?.data?.message || "There was an error connecting to the server. Please check your connection."}
        </p>
        <Button
          label="Try Again"
          variant="outline"
          className="mt-6"
          onClick={() => refetch()}
        />
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
            onClick={() => {
              setSelectedTask(null);
              setPrefillData(null);
              setOpen(true);
            }}
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
              onClick={() => {
                setSelectedTask(null);
                setPrefillData(null);
                setOpen(true);
              }}
            />
          )}
        </div>
      )}

      <AddTask
        open={open}
        setOpen={(val) => {
          setOpen(val);
          if (!val) {
            setSelectedTask(null);
            setPrefillData(null);
          }
        }}
        task={selectedTask}
        prefillData={prefillData}
        refresh={refetch}
      />
    </div>
  );
};


export default Tasks;
