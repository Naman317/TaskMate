import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { Search, FileText, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetTasksQuery } from "../redux/api/taskApiSlice";

const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  
  const { data } = useGetTasksQuery({ stage: "", isTrashed: false });
  const tasks = data?.tasks || [];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredTasks = query === "" 
    ? [] 
    : tasks.filter((task) => 
        task.title.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);

  const handleSelect = (id) => {
    setIsOpen(false);
    navigate(`/task/${id}`);
    setQuery("");
  };

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-[150]">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-start justify-center p-4 pt-[20vh]">
        <Dialog.Panel className="w-full max-w-xl bg-card rounded-xl shadow-2xl overflow-hidden border">
          <div className="flex items-center px-4 py-3 border-b">
            <Search className="text-muted-foreground mr-3" size={20} />
            <input
              type="text"
              className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
              placeholder="Search tasks... (Ctrl + K)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X size={20} />
            </button>
          </div>
          
          {query !== "" && (
            <div className="max-h-96 overflow-y-auto p-2">
              {filteredTasks.length > 0 ? (
                <div className="space-y-1">
                  <div className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tasks</div>
                  {filteredTasks.map((task) => (
                    <button
                      key={task._id}
                      onClick={() => handleSelect(task._id)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors text-left"
                    >
                      <FileText size={16} className="text-primary" />
                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium truncate">{task.title}</p>
                        <p className="text-xs text-muted-foreground capitalize">{task.stage}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No tasks found matching "{query}"
                </div>
              )}
            </div>
          )}
          
          <div className="bg-muted/50 px-4 py-2 text-xs text-muted-foreground border-t flex justify-between">
            <span>Use <kbd className="bg-background px-1.5 py-0.5 rounded border shadow-sm mx-1">↑</kbd> <kbd className="bg-background px-1.5 py-0.5 rounded border shadow-sm mx-1">↓</kbd> to navigate</span>
            <span><kbd className="bg-background px-1.5 py-0.5 rounded border shadow-sm mr-1">Esc</kbd> to close</span>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default CommandPalette;
