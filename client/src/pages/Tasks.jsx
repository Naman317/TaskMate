import React, { useState, useEffect } from "react";
import { LayoutGrid, List, Plus, Mic, MicOff, Search, Filter } from "lucide-react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

import API from "../assets/axios";
import Loading from "../components/Loader";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Skeleton from "../components/ui/Skeleton";
import BoardView from "../components/BoardView";
import Table from "../components/task/Table";
import AddTask from "../components/task/AddTask";
import useToast from "../hooks/useToast";

const Tasks = () => {
  const params = useParams();
  const toast = useToast();
  const [listening, setListening] = useState(false);
  const [view, setView] = useState("board"); // "board" or "list"
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [newTaskData, setNewTaskData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const status = params?.status || "";

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await API.get("/task");
      setTasks(res.data.tasks);
    } catch (err) {
      console.error(err);
      setError("Failed to load tasks");
      toast.error("Failed to load tasks", "Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };


  const Todaydate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const parseVoiceCommand = (command) => {
    const lowerCommand = command.toLowerCase();
    toast.info(`Voice command: "${command}"`);

    if (lowerCommand.startsWith('create task') || lowerCommand.startsWith('add task')) {
      const content = lowerCommand.replace(/create task|add task/, '').trim();
      if (content) {
        setNewTaskData({
          title: content.charAt(0).toUpperCase() + content.slice(1),
          description: '',
          priority: 'medium',
          date: Todaydate(),
        });
        setOpen(true);
      }
    } else if (lowerCommand.startsWith('delete task')) {
      const title = lowerCommand.replace('delete task', '').trim();
      const taskToDelete = tasks.find(t => t.title.toLowerCase().includes(title));
      if (taskToDelete) {
        handleDelete(taskToDelete._id);
      } else {
        toast.error(`Task "${title}" not found.`);
      }
    } else {
      toast.error('Command not recognized. Try "Create task [name]"');
    }
  };

  const startVoiceRecognition = () => {
    if (!("webkitSpeechRecognition" in window)) {
      toast.error("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      parseVoiceCommand(transcript);
    };
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
    };
    recognition.onend = () => setListening(false);
    recognition.start();
  };

  const handleDelete = async (taskId) => {
    try {
      await API.put(`task/${taskId}`); // Soft delete
      toast.success("Task deleted successfully");
      fetchTasks();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete task");
    }
  };

  const filteredTasks = tasks.filter((task) => {
    let matchesStatus = true;
    if (status === "overdue") {
      matchesStatus = new Date(task.date) < new Date() && task.stage !== "completed";
    } else if (status) {
      matchesStatus = task.stage.toLowerCase() === status.toLowerCase();
    }
    
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });


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
            {status ? `${status} Tasks` : "All Tasks"}
          </h1>
          <p className="text-muted-foreground">Manage and track your team's progress.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={listening ? "danger" : "secondary"}
            onClick={startVoiceRecognition}
            icon={listening ? <MicOff size={18} /> : <Mic size={18} />}
            label={listening ? "Listening..." : "Voice"}
          />
          <Button
            onClick={() => setOpen(true)}
            label="Create Task"
            icon={<Plus size={18} />}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-card p-4 rounded-xl border shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full pl-10 pr-4 py-2 bg-background border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex bg-muted p-1 rounded-lg">
            <button
              onClick={() => setView("board")}
              className={clsx(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                view === "board" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <LayoutGrid size={16} /> Board
            </button>
            <button
              onClick={() => setView("list")}
              className={clsx(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                view === "list" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <List size={16} /> List
            </button>
          </div>
          <Button variant="outline" size="sm" icon={<Filter size={16} />} label="Filter" />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {view === "board" ? (
            <BoardView tasks={filteredTasks} />
          ) : (
            <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
              <Table tasks={filteredTasks} />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <AddTask 
        open={open} 
        setOpen={setOpen} 
        prefillData={newTaskData} 
        clearPrefill={() => setNewTaskData(null)} 
        refresh={fetchTasks}
      />
    </div>
  );
};

export default Tasks;
