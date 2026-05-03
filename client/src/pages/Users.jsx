import React, { useState, useEffect } from "react";
import { UserPlus, Mail, Shield, MoreVertical, Edit, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { toast } from "sonner";
import clsx from "clsx";

import API from "../assets/axios";
import { getInitials } from "../utils";
import ConfirmatioDialog from "../components/Dialogs";
import AddUser from "../components/AddUser";
import Button from "../components/ui/Button";

const Users = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user: currentUser } = useSelector((state) => state.auth);
  const isSuperAdmin = currentUser?.email?.toLowerCase() === "admin@gmail.com";

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/user/get-team");
      setUsers(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async () => {
    try {
      await API.delete(`/user/${selected}`);
      toast.success("User deleted successfully");
      setUsers(users.filter((u) => u._id !== selected));
      setOpenDialog(false);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to delete user");
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await API.put(`/user/update-role/${userId}`, { role: newRole });
      toast.success("Role updated successfully");
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to update role");
    }
  };

  const deleteClick = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  const editClick = (u) => {
    setSelected(u);
    setOpen(true);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Team Members</h1>
          <p className="text-muted-foreground text-sm">Manage your team and their roles.</p>
        </div>

        {isSuperAdmin && (
          <Button
            label="Add New User"
            icon={<UserPlus size={18} />}
            onClick={() => {
              setSelected(null);
              setOpen(true);
            }}
          />
        )}
      </div>

      <div className="bg-card border rounded-xl overflow-hidden shadow-premium">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b">
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              {isSuperAdmin && <th className="px-6 py-4 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {users.map((u, index) => (
              <motion.tr
                key={u._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group hover:bg-muted/30 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
                      {getInitials(u.name)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground leading-none">{u.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">Active</p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail size={14} />
                    {u.email}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {isSuperAdmin ? (
                    <div className="relative inline-flex items-center gap-2">
                      <Shield size={14} className="text-indigo-600" />
                      <select
                        value={u.email?.toLowerCase() === "admin@gmail.com" ? "superadmin" : u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        disabled={u.email?.toLowerCase() === "admin@gmail.com"}
                        className="bg-transparent border-none text-sm font-bold focus:ring-0 cursor-pointer hover:text-primary transition-colors outline-none disabled:cursor-not-allowed disabled:text-indigo-600 uppercase"
                      >
                        {u.email?.toLowerCase() === "admin@gmail.com" ? (
                          <option value="superadmin">Super Admin</option>
                        ) : (
                          <>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </>
                        )}
                      </select>
                    </div>
                  ) : (
                    <span className={clsx(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border",
                      u.email?.toLowerCase() === "admin@gmail.com" ? "bg-indigo-100 text-indigo-700 border-indigo-200" :
                      u.role === "admin" ? "bg-amber-100 text-amber-700 border-amber-200" : "bg-blue-100 text-blue-700 border-blue-200"
                    )}>
                      <Shield size={10} />
                      {u.email?.toLowerCase() === "admin@gmail.com" ? "Super Admin" : u.role}
                    </span>
                  )}
                </td>

                {isSuperAdmin && (
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Edit size={16} />}
                        onClick={() => editClick(u)}
                        title="Edit User"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 disabled:opacity-30"
                        icon={<Trash2 size={16} />}
                        onClick={() => deleteClick(u._id)}
                        title={u.email?.toLowerCase() === "admin@gmail.com" ? "Cannot delete Super Admin" : "Delete User"}
                        disabled={u.email?.toLowerCase() === "admin@gmail.com"}
                      />
                    </div>
                  </td>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddUser
        open={open}
        setOpen={setOpen}
        userData={selected}
        refresh={fetchUsers}
      />

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={handleDelete}
      />
    </div>
  );
};

export default Users;
