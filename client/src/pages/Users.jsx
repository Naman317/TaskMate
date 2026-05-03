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
import { Card, CardContent } from "../components/ui/Card";
import Skeleton from "../components/ui/Skeleton";

const Users = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = useSelector((state) => state.auth.user);
  const isSuperAdmin = currentUser?.email?.toLowerCase() === "admin@gmail.com";

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/user/get-team");
      setUsers(res.data || []);
    } catch (err) {
      console.error("Failed to fetch users", err);
      toast.error("Failed to fetch team members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await API.put(`/user/update-role/${userId}`, { role: newRole });
      toast.success("Role updated successfully");
      fetchUsers();
    } catch (err) {
      console.error("Role update failed", err);
      toast.error(err?.response?.data?.message || "Role update failed");
    }
  };

  const deleteHandler = async () => {
    try {
      await API.delete(`/user/${selected}`);
      toast.success("User deleted successfully");
      setOpenDialog(false);
      fetchUsers();
    } catch (err) {
      console.error("Failed to delete user", err);
      toast.error(err?.response?.data?.message || "Failed to delete user");
    }
  };

  const deleteClick = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  const editClick = (user) => {
    setSelected(user);
    setOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-in">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-40" />
        </div>
        <Card>
          <CardContent className="p-0">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full border-b" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Members</h1>
          <p className="text-muted-foreground">Manage your team and their access levels.</p>
        </div>
        <Button
          label="Add New User"
          icon={<UserPlus size={18} />}
          onClick={() => {
            setSelected(null);
            setOpen(true);
          }}
        />
      </div>

      <Card className="overflow-hidden border-border/50 shadow-premium">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="px-6 py-4">Full Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  {isSuperAdmin && <th className="px-6 py-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {users.length > 0 ? (
                  users.map((user, idx) => (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      key={user._id}
                      className="group hover:bg-accent/30 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20 shrink-0">
                            {getInitials(user?.name)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground leading-none">{user.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">Active now</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail size={14} />
                          {user.email}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {isSuperAdmin ? (
                          <div className="relative inline-flex items-center gap-2">
                            <Shield size={14} className="text-indigo-600" />
                            <select
                              value={user.email === "admin@gmail.com" ? "superadmin" : user.role}
                              onChange={(e) => handleRoleChange(user._id, e.target.value)}
                              disabled={user.email === "admin@gmail.com"}
                              className="bg-transparent border-none text-sm font-bold focus:ring-0 cursor-pointer hover:text-primary transition-colors outline-none disabled:cursor-not-allowed disabled:text-indigo-600 uppercase"
                            >
                              {user.email === "admin@gmail.com" ? (
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
                            user.email === "admin@gmail.com" ? "bg-indigo-100 text-indigo-700 border-indigo-200" :
                            user.role === "admin" ? "bg-amber-100 text-amber-700 border-amber-200" : "bg-blue-100 text-blue-700 border-blue-200"
                          )}>
                            <Shield size={10} />
                            {user.email === "admin@gmail.com" ? "Super Admin" : user.role}
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
                              onClick={() => editClick(user)}
                              title="Edit User"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-600 hover:bg-red-50 disabled:opacity-30"
                              icon={<Trash2 size={16} />}
                              onClick={() => deleteClick(user._id)}
                              title={user.email === "admin@gmail.com" ? "Cannot delete Super Admin" : "Delete User"}
                              disabled={user.email === "admin@gmail.com"}
                            />
                          </div>
                        </td>
                      )}
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={isSuperAdmin ? 4 : 3} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Users size={40} strokeWidth={1} />
                        <p>No team members found.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <AddUser
        open={open}
        setOpen={setOpen}
        userData={selected}
        key={selected?._id || "new-user"}
        refresh={fetchUsers}
      />

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />
    </div>
  );
};

export default Users;
