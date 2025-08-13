import React, { useState, useEffect } from "react";
import ModalWrapper from "../ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import { useForm } from "react-hook-form";
import UserList from "./UserList";
import SelectList from "../SelectList";
import Button from "../Button";
import API from "../../assets/axios";
import { useSelector } from "react-redux";

const LISTS = ["TODO", "IN PROGRESS", "COMPLETED"];
const PRIORITY = ["HIGH", "MEDIUM", "NORMAL", "LOW"];

const AddTask = ({ open, setOpen, task,prefillData }) => {
  const isEditMode = !!task;
  const user = useSelector((state) => state.auth.user); // { _id, role }

  const isAdminTask = isEditMode && task?.createdByRole === "admin";
  const isUserNotAllowed = isAdminTask && user?.role !== "admin";
  const isAdmin = user?.role === "admin";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [team, setTeam] = useState(task?.team || []);
  const [stage, setStage] = useState(task?.stage?.toUpperCase() || LISTS[0]);
  const [priority, setPriority] = useState(task?.priority?.toUpperCase() || PRIORITY[2]);
  const [uploading, setUploading] = useState(false);

  // For Edit Mode
useEffect(() => {
  if (isEditMode && task) {
    reset({
      title: task.title,
      date: task.date?.slice(0, 10),
    });
    setTeam(task.team || []);
    setStage(task.stage?.toUpperCase() || LISTS[0]);
    setPriority(task.priority?.toUpperCase() || PRIORITY[2]);
  } else if (!prefillData) {
    // If not editing and no prefill, reset normally
    reset();
    if (!isAdmin) {
      setTeam([user]);
    } else {
      setTeam([]);
    }
  }
}, [isEditMode, task, reset, isAdmin, user, prefillData]);


useEffect(() => {
  if (prefillData) {
    reset({
      title: prefillData.title || "",
      date: prefillData.date || "", // Set prefilled date
    });

    setPriority(prefillData.priority?.toUpperCase() || "MEDIUM");

    // Assign to self for voice commands
    setTeam([user]);
  }
}, [prefillData, isAdmin, user, reset]);

  const submitHandler = async (data) => {
    if (isUserNotAllowed) return alert("You can't edit an admin-created task");

    try {
      setUploading(true);

      const payload = {
        title: data.title,
        date: data.date,
        stage: stage?.toLowerCase(),
        priority: priority?.toLowerCase(),
        team: team.map((member) => (typeof member === "string" ? member : member._id)),
      };

      if (isEditMode) {
        await API.put(`/task/update/${task._id}`, payload, {
          withCredentials: true,
        });
      } else {
        await API.post("/task/create", payload, {
          withCredentials: true,
        });
      }

      setUploading(false);
      setOpen(false);
      window.location.reload();
    } catch (err) {
      console.error("Error submitting task:", err.response?.data || err.message);
      alert("Failed to submit task.");
      setUploading(false);
    }
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(submitHandler)}>
        <Dialog.Title className="text-base font-bold text-gray-900 mb-4">
          {isEditMode ? "EDIT TASK" : "ADD TASK"}
        </Dialog.Title>

        {isUserNotAllowed && (
          <p className="text-sm text-red-500 mb-3">
            You can't edit this task — it was created by an admin.
          </p>
        )}

        {!isAdmin && !isEditMode && (
          <p className="text-sm text-gray-500 mb-3">
            This task will be assigned only to you.
          </p>
        )}

        <div className="flex flex-col gap-6">
          <Textbox
            placeholder="Task Title"
            type="text"
            name="title"
            label="Task Title"
            className="w-full rounded"
            register={register("title", { required: "Title is required" })}
            error={errors.title?.message}
            disabled={isUserNotAllowed}
          />

          {/* Show user list only to admins */}
          {isAdmin ? (
            <UserList setTeam={setTeam} team={team} disabled={isUserNotAllowed} />
          ) : (
            <div className="text-sm text-gray-700">
              Assigned to: <strong>{user.name}</strong>
            </div>
          )}

          <div className="flex gap-4">
            <SelectList
              label="Task Stage"
              lists={LISTS}
              selected={stage}
              setSelected={setStage}
              disabled={isUserNotAllowed}
            />

            <Textbox
              placeholder="Date"
              type="date"
              name="date"
              label="Task Date"
              className="w-full rounded"
              register={register("date", { required: "Date is required!" })}
              error={errors.date?.message}
              disabled={isUserNotAllowed}
            />
          </div>

          <SelectList
            label="Priority Level"
            lists={PRIORITY}
            selected={priority}
            setSelected={setPriority}
            disabled={isUserNotAllowed}
          />

          <div className="bg-gray-50 py-6 sm:flex sm:flex-row-reverse gap-4">
            {uploading ? (
              <span className="text-sm py-2 text-red-500">Submitting task...</span>
            ) : (
              <Button
                label={isEditMode ? "Update" : "Submit"}
                type="submit"
                className={`px-8 text-sm font-semibold text-white sm:w-auto ${
                  isUserNotAllowed
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                disabled={isUserNotAllowed}
              />
            )}

            <Button
              type="button"
              className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
              onClick={() => setOpen(false)}
              label="Cancel"
            />
          </div>
        </div>
      </form>
    </ModalWrapper>
  );
};

export default AddTask;
