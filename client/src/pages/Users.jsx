import React, { useState, useEffect } from "react";
import Title from "../components/Title";
import Button from "../components/Button";
import { IoMdAdd } from "react-icons/io";
import { getInitials } from "../utils";
import ConfirmatioDialog, { UserAction } from "../components/Dialogs";
import AddUser from "../components/AddUser";
import API from "../assets/axios";
import { useSelector } from "react-redux";

const Users = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [openAction, setOpenAction] = useState(false);
  const [selected, setSelected] = useState(null);
  const [users, setUsers] = useState([]);

  const currentUser = useSelector((state) => state.auth.user);
  const isSuperAdmin = currentUser?.email === "admin@gmail.com";

  const fetchUsers = async () => {
    try {
      const res = await API.get("/user/get-team");
      setUsers(res.data || []);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await API.put(`/user/update-role/${userId}`, { role: newRole });
      fetchUsers();
    } catch (err) {
      alert("Role update failed");
    }
  };

  const deleteHandler = async () => {
    // You can implement the delete user API here
  };

  const deleteClick = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  const editClick = (user) => {
    setSelected(user);
    setOpen(true);
  };

  const TableHeader = () => (
    <thead className='border-b border-gray-300'>
      <tr className='text-black text-left'>
        <th className='py-2'>Full Name</th>
        <th className='py-2'>Email</th>
        <th className='py-2'>Role</th>
        {isSuperAdmin && <th className='py-2 text-right'>Actions</th>}
      </tr>
    </thead>
  );

  const TableRow = ({ user }) => {
    if (!user || typeof user !== "object") return null;

    const {
      _id,
      name = "No Name",
      email = "No Email",
      role = "user",
    } = user;

    return (
      <tr className='border-b border-gray-200 text-gray-600 hover:bg-gray-400/10'>
        <td className='p-2'>
          <div className='flex items-center gap-3'>
            <div className='w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-blue-700'>
              <span className='text-xs md:text-sm text-center'>
                {getInitials(name)}
              </span>
            </div>
            {name}
          </div>
        </td>

        <td className='p-2'>{email}</td>

        <td className='p-2'>
          {isSuperAdmin ? (
            <select
              value={role}
              onChange={(e) => handleRoleChange(_id, e.target.value)}
              className='border rounded px-2 py-1'
            >
              <option value='user'>User</option>
              <option value='admin'>Admin</option>
            </select>
          ) : (
            role
          )}
        </td>

        {isSuperAdmin && (
          <td className='p-2 flex gap-4 justify-end'>
            <Button
              className='text-blue-600 hover:text-blue-500 font-semibold sm:px-0'
              label='Edit'
              type='button'
              onClick={() => editClick(user)}
            />
            <Button
              className='text-red-700 hover:text-red-500 font-semibold sm:px-0'
              label='Delete'
              type='button'
              onClick={() => deleteClick(_id)}
            />
          </td>
        )}
      </tr>
    );
  };

  return (
    <>
      <div className='w-full md:px-1 px-0 mb-6'>
        <div className='flex items-center justify-between mb-8'>
          <Title title='Team Members' />
          <Button
            label='Add New User'
            icon={<IoMdAdd className='text-lg' />}
            className='flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md 2xl:py-2.5'
            onClick={() => setOpen(true)}
          />
        </div>

        <div className='bg-white px-2 md:px-4 py-4 shadow-md rounded'>
          <div className='overflow-x-auto'>
            <table className='w-full mb-5'>
              <TableHeader />
              <tbody>
                {Array.isArray(users) && users.length > 0 ? (
                  users.map((user, index) => (
                    <TableRow key={user._id || index} user={user} />
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={isSuperAdmin ? 4 : 3}
                      className='p-4 text-center text-gray-500'
                    >
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddUser
        open={open}
        setOpen={setOpen}
        userData={selected}
        key={new Date().getTime().toString()}
      />

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />

      <UserAction
        open={openAction}
        setOpen={setOpenAction}
        onClick={() => {}}
      />
    </>
  );
};

export default Users;
