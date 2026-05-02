import React, { useState } from "react";
import ModalWrapper from "./ModalWrapper";
import API from "../assets/axios";
import useToast from "../hooks/useToast";
import Input from "./ui/Input";
import Button from "./ui/Button";
import { Lock } from "lucide-react";

const ChangePasswordModal = ({ open, setOpen }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const toast = useToast();

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match", "Please make sure your new passwords are the same.");
      return;
    }

    const changePromise = API.put("/user/change-password", {
      oldPassword,
      password: newPassword,
    });

    toast.promise(changePromise, {
      loading: "Updating password...",
      success: () => {
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setOpen(false);
        return "Password changed successfully!";
      },
      error: (err) => err.response?.data?.message || "Failed to change password.",
    });
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b pb-4">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Lock size={20} />
          </div>
          <h2 className="text-xl font-bold text-foreground">Security Settings</h2>
        </div>

        <div className="space-y-4">
          <Input
            type="password"
            label="Current Password"
            placeholder="Enter current password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <Input
            type="password"
            label="New Password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Input
            type="password"
            label="Confirm New Password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button 
            variant="outline" 
            label="Cancel" 
            onClick={() => setOpen(false)} 
          />
          <Button 
            variant="primary" 
            label="Change Password" 
            onClick={handleChangePassword}
          />
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ChangePasswordModal;
