import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import ModalWrapper from "./ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "./Textbox";
import Button from "./ui/Button";
import API from "../assets/axios";
import { toast } from "sonner";
import { Copy, Check, Link as LinkIcon, UserPlus, Sparkles, Mail, ExternalLink, RefreshCw } from "lucide-react";

const AddUser = ({ open, setOpen, userData, refresh }) => {
  const isEditing = !!userData;
  const [inviteMode, setInviteMode] = useState("link"); // 'link' | 'gmail' | 'instant'
  const [generalLink, setGeneralLink] = useState("");
  const [gmailLink, setGmailLink] = useState("");
  const [invitedEmail, setInvitedEmail] = useState("");
  const [invitedTitle, setInvitedTitle] = useState("");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingGeneral, setIsGeneratingGeneral] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: userData ?? { role: "user" } });

  // Auto-generate or fetch general link when modal opens in 'link' mode
  const fetchGeneralLink = async () => {
    try {
      setIsGeneratingGeneral(true);
      const res = await API.post("/user/invite-member", {
        isGeneral: true,
        role: "user",
      });
      const token = res.data.token;
      const origin = window.location.origin;
      setGeneralLink(`${origin}/accept-invite?token=${token}`);
    } catch (err) {
      console.error("Failed to generate general link", err);
    } finally {
      setIsGeneratingGeneral(false);
    }
  };

  useEffect(() => {
    if (open && !isEditing && inviteMode === "link" && !generalLink) {
      fetchGeneralLink();
    }
  }, [open, inviteMode, isEditing]);

  const handleOnSubmit = async (data) => {
    try {
      setIsLoading(true);
      if (isEditing) {
        // Update User Profile
        await API.put("/user/profile", { ...data, _id: userData._id });
        toast.success("User updated successfully");
        setOpen(false);
        refresh && refresh();
      } else if (inviteMode === "gmail") {
        // Generate Tokenized Invite Link for specific email
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
        setGmailLink(fullLink);

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

  const handleCopyLink = (linkToCopy) => {
    const link = linkToCopy || generalLink || gmailLink;
    if (link) {
      navigator.clipboard.writeText(link);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setGmailLink("");
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
          <div className="grid grid-cols-3 gap-1.5 border rounded-xl p-1 bg-muted/60">
            <button
              type="button"
              onClick={() => {
                setInviteMode("link");
                setGmailLink("");
              }}
              className={`py-2 px-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                inviteMode === "link"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LinkIcon size={14} /> Copy Link
            </button>
            <button
              type="button"
              onClick={() => {
                setInviteMode("gmail");
                setGmailLink("");
              }}
              className={`py-2 px-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                inviteMode === "gmail"
                  ? "bg-red-500 text-white shadow-sm font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Mail size={14} /> Gmail Compose
            </button>
            <button
              type="button"
              onClick={() => {
                setInviteMode("instant");
                setGmailLink("");
              }}
              className={`py-2 px-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                inviteMode === "instant"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <UserPlus size={14} /> Instant Add
            </button>
          </div>
        )}

        {/* 1. COPY LINK MODE (Instant Workspace Link - NO EMAIL/ROLE FORM NEEDED) */}
        {!isEditing && inviteMode === "link" && (
          <div className="space-y-4 animate-in">
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <LinkIcon size={14} className="text-primary" /> Workspace Invite Link
                </span>
                <button
                  type="button"
                  onClick={fetchGeneralLink}
                  disabled={isGeneratingGeneral}
                  className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-all cursor-pointer"
                  title="Generate new link"
                >
                  <RefreshCw size={12} className={isGeneratingGeneral ? "animate-spin" : ""} />
                  <span>Refresh</span>
                </button>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Anyone with this link can join your workspace. They can sign up with <strong>Google</strong> or create a password.
              </p>

              <div className="flex items-center gap-2 bg-background p-2 border rounded-xl">
                <input
                  type="text"
                  readOnly
                  value={generalLink || "Generating invite link..."}
                  className="w-full text-xs bg-transparent outline-none text-foreground select-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => handleCopyLink(generalLink)}
                  disabled={!generalLink || isGeneratingGeneral}
                  className="px-3.5 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90 flex items-center gap-1.5 shrink-0 transition-all cursor-pointer disabled:opacity-50"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? "Copied!" : "Copy Link"}</span>
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                variant="outline"
                size="sm"
                label="Close"
                onClick={handleClose}
              />
            </div>
          </div>
        )}

        {/* 2. GMAIL INVITE MODE - RESULT */}
        {!isEditing && inviteMode === "gmail" && gmailLink ? (
          <div className="p-5 bg-card border rounded-2xl space-y-4 shadow-sm animate-in">
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <Check size={18} className="text-emerald-500" />
              <span>Invitation Created for {invitedEmail}</span>
            </div>

            <div className="space-y-3 bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 p-4 rounded-xl">
              <p className="text-xs text-foreground/80 leading-relaxed">
                Click below to open <strong>Gmail Web</strong> with the invite message & activation link pre-filled:
              </p>
              <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                  invitedEmail
                )}&su=${encodeURIComponent("You're invited to join Tasky")}&body=${encodeURIComponent(
                  `Hello,\n\nYou have been invited to join the Tasky workspace as ${
                    invitedTitle || "Team Member"
                  }.\n\nClick the secure link below to accept your invitation and activate your account:\n${gmailLink}\n\nWelcome aboard!\n- Tasky Team`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Mail size={16} />
                <span>Open & Send in Gmail</span>
                <ExternalLink size={14} className="opacity-80" />
              </a>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                Shareable Activation Link
              </label>
              <div className="flex items-center gap-2 bg-muted/50 p-2 border rounded-xl">
                <input
                  type="text"
                  readOnly
                  value={gmailLink}
                  className="w-full text-xs bg-transparent outline-none text-foreground select-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => handleCopyLink(gmailLink)}
                  className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90 flex items-center gap-1.5 shrink-0 transition-all cursor-pointer"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? "Copied!" : "Copy Link"}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <a
                href={`mailto:${encodeURIComponent(invitedEmail)}?subject=${encodeURIComponent(
                  "You're invited to join Tasky"
                )}&body=${encodeURIComponent(
                  `Hello,\n\nYou have been invited to join the Tasky workspace as ${
                    invitedTitle || "Team Member"
                  }.\n\nClick the link below to accept your invitation:\n${gmailLink}\n\nWelcome aboard!\n- Tasky Team`
                )}`}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 hover:underline"
              >
                <span>Or use Default Email App</span>
              </a>

              <Button
                variant="outline"
                size="sm"
                label="Done"
                onClick={handleClose}
              />
            </div>
          </div>
        ) : null}

        {/* 3. GMAIL & INSTANT ADD & EDIT USER FORM */}
        {(isEditing || (inviteMode === "gmail" && !gmailLink) || inviteMode === "instant") && (
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
                    : inviteMode === "gmail"
                    ? "Send with Gmail"
                    : "Add Team Member"
                }
                isLoading={isLoading}
                variant="primary"
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


