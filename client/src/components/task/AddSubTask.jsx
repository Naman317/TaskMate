import React from "react";
import { useForm } from "react-hook-form";
import ModalWrapper from "../ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import Button from "../Button";
import { useCreateSubTaskMutation } from "../../redux/api/taskApiSlice";
import { toast } from "sonner";

const AddSubTask = ({ open, setOpen, id, refresh }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [createSubTask, { isLoading }] = useCreateSubTaskMutation();

  const onSubmit = async (data) => {
    try {
      await createSubTask({ id, data }).unwrap();
      toast.success("Subtask added successfully");
      reset();
      setOpen(false);
      if (refresh) refresh();
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || err?.message || "Failed to add subtask");
    }
  };

  return (

    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Dialog.Title className="text-xl font-bold text-gray-900">
          ADD SUBTASK
        </Dialog.Title>

        <div className="space-y-4">
          <Textbox
            placeholder="Subtask title"
            type="text"
            name="title"
            label="Title"
            className="w-full rounded"
            register={register("title", { required: "Title is required" })}
            error={errors.title?.message}
          />

          <div className="flex items-center gap-4">
            <Textbox
              placeholder="Date"
              type="date"
              name="date"
              label="Task Date"
              className="w-full rounded"
              register={register("date", { required: "Date is required!" })}
              error={errors.date?.message}
            />
            <Textbox
              placeholder="Tag (e.g. Design, Dev)"
              type="text"
              name="tag"
              label="Tag"
              className="w-full rounded"
              register={register("tag", { required: "Tag is required" })}
              error={errors.tag?.message}
            />
          </div>
        </div>

        <div className="py-3 flex flex-row-reverse gap-3">
          <Button
            type="submit"
            className="bg-primary text-white"
            label="Add Subtask"
            isLoading={isLoading}
          />
          <Button

            type="button"
            className="bg-white text-gray-900 border"
            onClick={() => setOpen(false)}
            label="Cancel"
          />
        </div>
      </form>
    </ModalWrapper>
  );
};

export default AddSubTask;
