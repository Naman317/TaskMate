import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import { useUpdateTaskMutation } from "../redux/api/taskApiSlice";
import { toast } from "sonner";

const COLUMNS = ["todo", "in progress", "completed"];

const BoardView = ({ tasks }) => {
  const [updateTask] = useUpdateTaskMutation();

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // SDE 2 move: Optimistic UI or handle status update
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
          <div key={column} className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  column === "todo" ? "bg-rose-500" : 
                  column === "in progress" ? "bg-amber-500" : "bg-emerald-500"
                }`} />
                {column}
                <span className="ml-2 px-2 py-0.5 text-[10px] bg-muted rounded-full text-foreground">
                  {tasks.filter((t) => t.stage === column).length}
                </span>
              </h3>
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
                    .filter((task) => task.stage === column)
                    .map((task, index) => (
                      <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`${snapshot.isDragging ? "shadow-2xl z-50 scale-105" : ""}`}
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
