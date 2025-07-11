import React, { useState } from "react";
import ModalWrapper from "../ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import { useForm } from "react-hook-form";
import UserList from "./UserList";
import SelectList from "../SelectList";
import Button from "../Button";
import API from "../../assets/axios";
import { BiImages } from "react-icons/bi";

const LISTS = ["TODO", "IN PROGRESS", "COMPLETED"];
const PRIORITY = ["HIGH", "MEDIUM", "NORMAL", "LOW"];

const AddTask = ({ open, setOpen }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [team, setTeam] = useState([]);
  const [stage, setStage] = useState(LISTS[0]);
  const [priority, setPriority] = useState(PRIORITY[2]);
  const [uploading, setUploading] = useState(false);

  const submitHandler = async (data) => {
    try {
      setUploading(true);

      const payload = {
        title: data.title,
        date: data.date,
        stage: stage?.toLowerCase(),
        priority: priority?.toLowerCase(),
        team: team.map((member) => member._id),
      };

      const res = await API.post("/task/create", payload, {
        withCredentials: true,
      });

      console.log("Task created:", res.data);
      setUploading(false);
      setOpen(false);
    } catch (err) {
      console.error("Error creating task:", err.response?.data || err.message);
      alert("Failed to create task.");
      setUploading(false);
    }
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(submitHandler)}>
        <Dialog.Title className='text-base font-bold text-gray-900 mb-4'>
          ADD TASK
        </Dialog.Title>

        <div className='flex flex-col gap-6'>
          <Textbox
            placeholder='Task Title'
            type='text'
            name='title'
            label='Task Title'
            className='w-full rounded'
            register={register("title", { required: "Title is required" })}
            error={errors.title?.message}
          />

          <UserList setTeam={setTeam} team={team} />

          <div className='flex gap-4'>
            <SelectList
              label='Task Stage'
              lists={LISTS}
              selected={stage}
              setSelected={setStage}
            />

            <Textbox
              placeholder='Date'
              type='date'
              name='date'
              label='Task Date'
              className='w-full rounded'
              register={register("date", {
                required: "Date is required!",
              })}
              error={errors.date?.message}
            />
          </div>

          <SelectList
            label='Priority Level'
            lists={PRIORITY}
            selected={priority}
            setSelected={setPriority}
          />

          <div className='bg-gray-50 py-6 sm:flex sm:flex-row-reverse gap-4'>
            {uploading ? (
              <span className='text-sm py-2 text-red-500'>
                Submitting task...
              </span>
            ) : (
              <Button
                label='Submit'
                type='submit'
                className='bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto'
              />
            )}

            <Button
              type='button'
              className='bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto'
              onClick={() => setOpen(false)}
              label='Cancel'
            />
          </div>
        </div>
      </form>
    </ModalWrapper>
  );
};

export default AddTask;


