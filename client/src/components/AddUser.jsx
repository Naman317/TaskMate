import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import ModalWrapper from "./ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "./Textbox";
import Button from "./ui/Button";
import API from "../assets/axios";
import { toast } from "sonner";
import { Copy, Check, Link as LinkIcon, UserPlus, Sparkles } from "lucide-react";

const AddUser = ({ open, setOpen, userData, refresh }) => {
  const isEditing = !!userData;
  const [inviteMode, setInviteMode] = useState("link"); // 'link' | 'instant'
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: userData ?? { role: "user" } });

  const handleOnSubmit = async (data) => {
    try {
      setIsLoading(true);
      if (isEditing) {
        // Update User
        await API.put("/user/profile", { ...data, _id: userData._id });
        toast.success("User updated successfully");
        setOpen(false);
        refresh && refresh();
      } else if (inviteMode === "link") {
        // Generate Tokenized Invite Link
        const res = await API.post("/user/invite-member", {
          email: data.email,
          title: data.title,
          role: data.role || "user",
        });

        const token = res.data.token;
        const origin = window.location.origin;
        const fullLink = `${origin}/accept-invite?token=${token}`;
        setGeneratedLink(fullLink);
        toast.success("Invitation generated!", "Copy the link below to share with your team member.");
        refresh && refresh();
      } else {
        // Instant Direct Add
        await API.post("/user/register", {
          name: data.name,
          email: data.email,
          title: data.title,
          role: data.role || "user",
          password: data.password || "password123",
          isAdmin: data.role === "admin",
        });
        toast.success("Team member added successfully");
        setOpen(false);
        reset();
        refresh && refresh();
      }
    } catch (err) {
      console.error("Operation failed", err);
      toast.error(err?.response?.data?.message || "Operation failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setGeneratedLink("");
    setCopied(false);
    reset();
  };

  return (
    <ModalWrapper open={open} setOpen={handleClose}>
      <div className="space-y-6">
        <Dialog.Title
          as="h2"
          className="text-xl font-bold leading-6 text-foreground pb-4 border-b flex items-center justify-between"
        >
          <span>{isEditing ? "Update User Profile" : "Invite Team Member"}</span>
          {!isEditing && (
            <span className="text-xs font-normal text-muted-foreground bg-primary/10 text-primary px-2.5 py-1 rounded-full flex items-center gap-1">
              <Sparkles size={12} /> Team Hub
            </span>
          )}
        </Dialog.Title>

        {!isEditing && (
          <div className="flex border rounded-lg p-1 bg-muted">
            <button
              type="button"
              onClick={() => { setInviteMode("link"); setGeneratedLink(""); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-all ${
                inviteMode === "link"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LinkIcon size={14} /> Shareable Invite Link
            </button>
            <button
              type="button"
              onClick={() => { setInviteMode("instant"); setGeneratedLink(""); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-all ${
                inviteMode === "instant"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <UserPlus size={14} /> Instant Add with Password
            </button>
          </div>
        )}

        {generatedLink ? (
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl space-y-4 animate-in">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm">
              <Check size={18} /> Invitation Ready!
            </div>
            <p className="text-xs text-muted-foreground">
              Share this secure activation link with the member. They can join using Google or by setting a password:
            </p>
            <div className="flex items-center gap-2 bg-background p-2 border rounded-lg">
              <input
                type="text"
                readOnly
                value={generatedLink}
                className="w-full text-xs bg-transparent outline-none text-foreground select-all"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-md hover:bg-primary/90 flex items-center gap-1 shrink-0 transition-all"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>
            </div>
            <div className="flex justify-end pt-2">
              <Button
                variant="outline"
                size="sm"
                label="Done"
                onClick={handleClose}
              />
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(handleOnSubmit)} className="space-y-4">
            <div className="flex flex-col gap-4">
              {(isEditing || inviteMode === "instant") && (
                <Textbox
                  placeholder="Full name (e.g. Alex Rivera)"
                  type="text"
                  name="name"
                  label="Full Name"
                  className="w-full rounded-lg"
                  register={register("name", {
                    required: "Full name is required!",
                  })}
                  error={errors.name ? errors.name.message : ""}
                />
              )}

              <Textbox
                placeholder="Email Address (e.g. aab@gmail.com or real@gmail.com)"
                type="email"
                name="email"
                label="Email Address"
                className="w-full rounded-lg"
                register={register("email", {
                  required: "Email Address is required!",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Invalid email format",
                  },
                })}
                error={errors.email ? errors.email.message : ""}
              />

              <Textbox
                placeholder="Title (e.g. Senior Frontend Engineer)"
                type="text"
                name="title"
                label="Job Title"
                className="w-full rounded-lg"
                register={register("title", {
                  required: "Title is required!",
                })}
                error={errors.title ? errors.title.message : ""}
              />

              <div>
                <label className="text-sm font-medium leading-none text-muted-foreground block mb-2">
                  System Role
                </label>
                <select
                  {...register("role")}
                  className="w-full h-10 px-3 border border-input rounded-lg bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="user">Team Member (Task Management Only)</option>
                  <option value="admin">Administrator (Full Task & User Assignment)</option>
                </select>
              </div>

              {!isEditing && inviteMode === "instant" && (
                <Textbox
                  placeholder="Initial Password (e.g. password123)"
                  type="password"
                  name="password"
                  label="Initial Password"
                  className="w-full rounded-lg"
                  register={register("password", {
                    required: "Initial password is required",
                    minLength: { value: 6, message: "Minimum 6 characters" },
                  })}
                  error={errors.password ? errors.password.message : ""}
                />
              )}
            </div>

            <div className="py-3 mt-4 flex flex-row-reverse gap-3 border-t pt-4">
              <Button
                type="submit"
                label={
                  isEditing
                    ? "Update User"
                    : inviteMode === "link"
                    ? "Create Invite Link"
                    : "Add User"
                }
                isLoading={isLoading}
                variant="primary"
                className="px-6"
              />

              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                label="Cancel"
                className="px-6"
              />
            </div>
          </form>
        )}
      </div>
    </ModalWrapper>
  );
};

export default AddUser;
