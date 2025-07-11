// components/task/AddSubTask.jsx
import { useForm } from "react-hook-form";
import ModalWrapper from "../ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import Button from "../Button";
import { toast } from "sonner";
import API from "../../assets/axios";

const AddSubTask = ({ open, setOpen, id, onSubTaskAdded }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleOnSubmit = async (data) => {
    try {
      const res = await API.put(`/task/create-subtask/${id}`, data);
      toast.success(res.data.message);
      onSubTaskAdded(); // refresh task details
      setOpen(false);
      reset();
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Failed to add sub-task.");
    }
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(handleOnSubmit)} className=''>
        <Dialog.Title className='text-base font-bold text-gray-900 mb-4'>
          ADD SUB-TASK
        </Dialog.Title>

        <div className='mt-2 flex flex-col gap-6'>
          <Textbox
            label='Title'
            placeholder='Sub-Task title'
            type='text'
            name='title'
            register={register("title", {
              required: "Title is required!",
            })}
            error={errors.title?.message}
          />

          <div className='flex items-center gap-4'>
            <Textbox
              label='Task Date'
              placeholder='Date'
              type='date'
              name='date'
              register={register("date", {
                required: "Date is required!",
              })}
              error={errors.date?.message}
            />
            <Textbox
              label='Tag'
              placeholder='Tag'
              type='text'
              name='tag'
              register={register("tag", {
                required: "Tag is required!",
              })}
              error={errors.tag?.message}
            />
          </div>
        </div>

        <div className='py-3 mt-4 flex sm:flex-row-reverse gap-4'>
          <Button
            type='submit'
            className='bg-blue-600 text-white text-sm font-semibold'
            label='Add Task'
          />
          <Button
            type='button'
            className='bg-white border text-sm font-semibold text-gray-900'
            onClick={() => setOpen(false)}
            label='Cancel'
          />
        </div>
      </form>
    </ModalWrapper>
  );
};

export default AddSubTask;
