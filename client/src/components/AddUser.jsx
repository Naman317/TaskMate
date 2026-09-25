import React, { useState } from "react";
import { useForm } from "react-hook-form";
import ModalWrapper from "./ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "./Textbox";
import Button from "./ui/Button";
import API from "../assets/axios";
import { toast } from "sonner";
import { Copy, Check, Link as LinkIcon, UserPlus, Sparkles, Mail, ExternalLink } from "lucide-react";

const AddUser = ({ open, setOpen, userData, refresh }) => {
  const isEditing = !!userData;
  const [inviteMode, setInviteMode] = useState("link"); // 'link' | 'gmail' | 'instant'
  const [generatedLink, setGeneratedLink] = useState("");
  const [invitedEmail, setInvitedEmail] = useState("");
  const [invitedTitle, setInvitedTitle] = useState("");
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
        // Update User Profile
        await API.put("/user/profile", { ...data, _id: userData._id });
        toast.success("User updated successfully");
        setOpen(false);
        refresh && refresh();
      } else if (inviteMode === "link" || inviteMode === "gmail") {
        // Generate Tokenized Invite Link
        const res = await API.post("/user/invite-member", {
          email: data.email,
          title: data.title,
          role: data.role || "user",
        });

        const token = res.data.token;
        const origin = window.location.origin;
        const fullLink = `${origin}/accept-invite?token=${token}`;
        setInvitedEmail(data.email);
        setInvitedTitle(data.title);
        setGeneratedLink(fullLink);

        if (inviteMode === "gmail") {
          // Open Gmail Compose automatically in a new window/tab
          const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
            data.email
          )}&su=${encodeURIComponent("You're invited to join Tasky")}&body=${encodeURIComponent(
            `Hello,\n\nYou have been invited to join the Tasky workspace as ${
              data.title || "Team Member"
            }.\n\nClick the secure link below to accept your invitation and activate your account:\n${fullLink}\n\nWelcome aboard!\n- Tasky Team`
          )}`;
          window.open(gmailUrl, "_blank", "noopener,noreferrer");
          toast.success("Invitation generated & Gmail composer opened!");
        } else {
          toast.success("Invitation link generated successfully!");
        }
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
          <span>{isEditing ? "Update User Profile" : "Invite & Add Members"}</span>
          {!isEditing && (
            <span className="text-xs font-normal text-muted-foreground bg-primary/10 text-primary px-2.5 py-1 rounded-full flex items-center gap-1">
              <Sparkles size={12} /> Team Hub
            </span>
          )}
        </Dialog.Title>

        {!isEditing && (
          <div className="grid grid-cols-3 gap-1 border rounded-xl p-1 bg-muted">
            <button
              type="button"
              onClick={() => {
                setInviteMode("link");
                setGeneratedLink("");
              }}
              className={`py-2 px-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                inviteMode === "link"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LinkIcon size={14} /> Invite Link
            </button>
            <button
              type="button"
              onClick={() => {
                setInviteMode("gmail");
                setGeneratedLink("");
              }}
              className={`py-2 px-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                inviteMode === "gmail"
                  ? "bg-background text-red-600 shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Mail size={14} /> Gmail Invite
            </button>
            <button
              type="button"
              onClick={() => {
                setInviteMode("instant");
                setGeneratedLink("");
              }}
              className={`py-2 px-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                inviteMode === "instant"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <UserPlus size={14} /> Instant Add
            </button>
          </div>
        )}

        {generatedLink ? (
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl space-y-4 animate-in">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm">
              <Check size={18} /> Invitation Ready!
            </div>
            <p className="text-xs text-muted-foreground">
              Share this secure activation link with <strong>{invitedEmail}</strong>. They can join using Google or by setting a password:
            </p>
            <div className="flex items-center gap-2 bg-background p-2 border rounded-lg">
              <input
                type="text"
                readOnly
                value={generatedLink}
                className="w-full text-xs bg-transparent outline-none text-foreground select-all font-mono"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-md hover:bg-primary/90 flex items-center gap-1 shrink-0 transition-all cursor-pointer"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? "Copied!" : "Copy Link"}</span>
              </button>
            </div>

            {/* Gmail & Mail Options */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-primary/10">
              <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                  invitedEmail
                )}&su=${encodeURIComponent("You're invited to join Tasky")}&body=${encodeURIComponent(
                  `Hello,\n\nYou have been invited to join the Tasky workspace as ${
                    invitedTitle || "Team Member"
                  }.\n\nClick the secure link below to accept your invitation and activate your account:\n${generatedLink}\n\nWelcome aboard!\n- Tasky Team`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-lg transition-all shadow-sm"
              >
                <Mail size={14} />
                <span>Send with Gmail</span>
                <ExternalLink size={12} className="opacity-80" />
              </a>

              <a
                href={`mailto:${encodeURIComponent(invitedEmail)}?subject=${encodeURIComponent(
                  "You're invited to join Tasky"
                )}&body=${encodeURIComponent(
                  `Hello,\n\nYou have been invited to join the Tasky workspace as ${
                    invitedTitle || "Team Member"
                  }.\n\nClick the link below to accept your invitation:\n${generatedLink}\n\nWelcome aboard!\n- Tasky Team`
                )}`}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 border border-input bg-background hover:bg-accent text-foreground text-xs font-medium rounded-lg transition-all"
              >
                <span>Email App</span>
              </a>
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
                placeholder="Email Address (e.g. teammate@gmail.com)"
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
                    ? "Generate Invite Link"
                    : inviteMode === "gmail"
                    ? "Send with Gmail"
                    : "Add Team Member"
                }
                isLoading={isLoading}
                variant={inviteMode === "gmail" ? "primary" : "primary"}
                className={inviteMode === "gmail" ? "px-6 bg-red-600 hover:bg-red-700 text-white" : "px-6"}
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

