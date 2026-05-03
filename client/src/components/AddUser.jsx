import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import ModalWrapper from "./ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "./Textbox";
import Loading from "./Loader";
import Button from "./ui/Button";
import API from "../assets/axios";
import { toast } from "sonner";

const AddUser = ({ open, setOpen, userData, refresh }) => {
  let defaultValues = userData ?? {};
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const handleOnSubmit = async (data) => {
    try {
      setIsLoading(true);
      if (userData) {
        // Update User
        await API.put("/user/profile", { ...data, _id: userData._id });
        toast.success("User updated successfully");
      } else {
        // Add New User (Register)
        await API.post("/user/register", { ...data, password: "password123" });
        toast.success("User added successfully");
      }
      setOpen(false);
      refresh && refresh();
    } catch (err) {
      console.error("Operation failed", err);
      toast.error(err?.response?.data?.message || "Operation failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(handleOnSubmit)} className='space-y-6'>
          <Dialog.Title
            as='h2'
            className='text-xl font-bold leading-6 text-gray-900 mb-4 pb-4 border-b'
          >
            {userData ? "Update User Profile" : "Add New Team Member"}
          </Dialog.Title>
          <div className='flex flex-col gap-6'>
            <Textbox
              placeholder='Full name'
              type='text'
              name='name'
              label='Full Name'
              className='w-full rounded-lg'
              register={register("name", {
                required: "Full name is required!",
              })}
              error={errors.name ? errors.name.message : ""}
            />
            <Textbox
              placeholder='Title (e.g. Senior Developer)'
              type='text'
              name='title'
              label='Title'
              className='w-full rounded-lg'
              register={register("title", {
                required: "Title is required!",
              })}
              error={errors.title ? errors.title.message : ""}
            />
            <Textbox
              placeholder='Email Address'
              type='email'
              name='email'
              label='Email Address'
              className='w-full rounded-lg'
              register={register("email", {
                required: "Email Address is required!",
              })}
              error={errors.email ? errors.email.message : ""}
            />

            <Textbox
              placeholder='Role (user or admin)'
              type='text'
              name='role'
              label='Role'
              className='w-full rounded-lg'
              register={register("role", {
                required: "User role is required!",
              })}
              error={errors.role ? errors.role.message : ""}
            />
          </div>

          <div className='py-3 mt-4 flex flex-row-reverse gap-3 border-t pt-6'>
            <Button
              type='submit'
              label='Submit'
              isLoading={isLoading}
              variant='primary'
              className='px-8'
            />

            <Button
              type='button'
              variant='outline'
              onClick={() => setOpen(false)}
              label='Cancel'
              className='px-6'
            />
          </div>
        </form>
      </ModalWrapper>
    </>
  );
};

export default AddUser;
