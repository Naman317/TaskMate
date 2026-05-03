import React from "react";
import clsx from "clsx";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import { useUpdateTaskMutation } from "../redux/api/taskApiSlice";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const COLUMNS = ["todo", "in progress", "completed"];

const BoardView = ({ tasks }) => {
  const [updateTask] = useUpdateTaskMutation();
  const { user } = useSelector((state) => state.auth);
  
  // Robust Admin check: handle casing and Super Admin email
  const isAdmin = 
    user?.role?.toLowerCase() === "admin" || 
    user?.email?.toLowerCase() === "admin@gmail.com";

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    if (!isAdmin) {
      toast.error("You don't have permission to change task stages.");
      return;
    }

    try {
      const task = tasks.find((t) => t._id === draggableId);
      if (!task) return;

      await updateTask({
        id: draggableId,
        data: { 
          ...task, 
          team: task.team?.map(t => t._id || t),
          stage: destination.droppableId 
        },
      }).unwrap();

      toast.success(`Moved to ${destination.droppableId}`);

    } catch (err) {
      toast.error("Failed to move task");
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full min-h-[500px]">
        {COLUMNS.map((column) => (
          <div key={column} className="flex flex-col gap-3">
            {/* Column Header */}
            <div className="flex items-center gap-2 px-1">
              <div className={`w-2.5 h-2.5 rounded-full ${
                column === "todo" ? "bg-rose-500" :
                column === "in progress" ? "bg-amber-500" : "bg-emerald-500"
              }`} />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {column}
              </span>
              <span className="ml-auto text-xs font-semibold px-2 py-0.5 bg-muted rounded-full">
                {tasks.filter((t) => t.stage?.toLowerCase() === column.toLowerCase()).length}
              </span>
            </div>


            <Droppable droppableId={column}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`flex-1 flex flex-col gap-4 p-2 rounded-xl transition-colors ${
                    snapshot.isDraggingOver ? "bg-primary/5 ring-2 ring-primary/10" : "bg-transparent"
                  }`}
                >
                  {tasks
                    .filter((task) => task.stage?.toLowerCase() === column.toLowerCase())
                    .map((task, index) => (
                      <Draggable 
                        key={task._id} 
                        draggableId={task._id} 
                        index={index}
                        isDragDisabled={!isAdmin}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={clsx(
                              snapshot.isDragging ? "shadow-2xl z-50 scale-105" : "",
                              !isAdmin ? "cursor-default" : "cursor-grab"
                            )}
                          >
                            <TaskCard task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default BoardView;
