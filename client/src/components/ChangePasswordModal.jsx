import { useState } from "react";
import API from "../assets/axios";
import { toast } from "react-toastify";
const ChangePasswordModal = ({ open, setOpen }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
const handleChangePassword = async () => {
  try {
    const res = await API.put("/user/change-password", {
      oldPassword,
      password: newPassword, // backend expects 'password'
    });

    if (res.data.status) {
      toast.success("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setOpen(false);
    } else {
      toast.error(res.data.message || "Failed to change password.");
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Something went wrong.");
    console.log("Password change error:", error);
  }
};


  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-md">
        <h2 className="text-xl font-bold mb-4">Change Password</h2>
        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="w-full border px-3 py-2 mb-3 rounded"
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border px-3 py-2 mb-4 rounded"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleChangePassword}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
