import clsx from "clsx";
import React, { useEffect, useState } from "react";
import {
  MdDelete,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdOutlineRestore,
} from "react-icons/md";
import Title from "../components/Title";
import Button from "../components/Button";
import { PRIOTITYSTYELS, TASK_TYPE } from "../utils";
import ConfirmatioDialog from "../components/Dialogs";
import API from "../assets/axios"; // <-- your axios instance

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const Trash = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [msg, setMsg] = useState(null);
  const [type, setType] = useState("delete");
  const [selected, setSelected] = useState("");
  const [trashedTasks, setTrashedTasks] = useState([]);

  // 🔃 Load trashed tasks
  const fetchTrashedTasks = async () => {
    try {
      const res = await API.get("/task?isTrashed=true", {
        withCredentials: true,
      });
      setTrashedTasks(res.data.tasks || []);
    } catch (err) {
      console.error("Failed to load trashed tasks:", err.message);
    }
  };

  useEffect(() => {
    fetchTrashedTasks();
  }, []);

  // 🧠 Handle confirmation actions
  const deleteRestoreHandler = async () => {
    try {
      let endpoint = "/task/delete-restore";
      let query = "";

      if (type === "delete" || type === "restore") {
        query = `/${selected}?actionType=${type}`;
      } else if (type === "deleteAll" || type === "restoreAll") {
        query = `?actionType=${type}`;
      }

      const res = await API.delete(`${endpoint}${query}`, {
        withCredentials: true,
      });

      alert(res.data.message);
      setOpenDialog(false);
      setSelected("");
      fetchTrashedTasks(); // 🔃 Refresh
    } catch (error) {
      console.error("Action failed:", error.response?.data || error.message);
      alert("Operation failed.");
    }
  };

  const deleteClick = (id) => {
    setType("delete");
    setSelected(id);
    setMsg("Do you want to permanently delete this task?");
    setOpenDialog(true);
  };

  const restoreClick = (id) => {
    setType("restore");
    setSelected(id);
    setMsg("Do you want to restore this task?");
    setOpenDialog(true);
  };

  const deleteAllClick = () => {
    setType("deleteAll");
    setMsg("Do you want to permanently delete all trashed tasks?");
    setOpenDialog(true);
  };

  const restoreAllClick = () => {
    setType("restoreAll");
    setMsg("Do you want to restore all trashed tasks?");
    setOpenDialog(true);
  };

  const TableHeader = () => (
    <thead className='border-b border-gray-300'>
      <tr className='text-black text-left'>
        <th className='py-2'>Task Title</th>
        <th className='py-2'>Priority</th>
        <th className='py-2'>Stage</th>
        <th className='py-2'>Modified On</th>
        <th className='py-2 text-right'>Actions</th>
      </tr>
    </thead>
  );

  const TableRow = ({ item }) => (
    <tr className='border-b border-gray-200 text-gray-600 hover:bg-gray-400/10'>
      <td className='py-2'>
        <div className='flex items-center gap-2'>
          <div className={clsx("w-4 h-4 rounded-full", TASK_TYPE[item.stage])} />
          <p className='line-clamp-2 text-base text-black'>{item.title}</p>
        </div>
      </td>

      <td className='py-2 capitalize'>
        <div className='flex gap-1 items-center'>
          <span className={clsx("text-lg", PRIOTITYSTYELS[item?.priority])}>
            {ICONS[item?.priority]}
          </span>
          <span>{item.priority}</span>
        </div>
      </td>

      <td className='py-2 capitalize'>{item.stage}</td>
      <td className='py-2 text-sm'>{new Date(item?.updatedAt).toDateString()}</td>

      <td className='py-2 flex gap-2 justify-end'>
        <Button
          icon={<MdOutlineRestore className='text-xl text-gray-500' />}
          onClick={() => restoreClick(item._id)}
        />
        <Button
          icon={<MdDelete className='text-xl text-red-600' />}
          onClick={() => deleteClick(item._id)}
        />
      </td>
    </tr>
  );

  return (
    <>
      <div className='w-full px-0 mb-6'>
        <div className='flex items-center justify-between mb-8'>
          <Title title='Trashed Tasks' />
          <div className='flex gap-3'>
            <Button
              label='Restore All'
              icon={<MdOutlineRestore />}
              className='text-sm text-black'
              onClick={restoreAllClick}
            />
            <Button
              label='Delete All'
              icon={<MdDelete />}
              className='text-sm text-red-600'
              onClick={deleteAllClick}
            />
          </div>
        </div>

        <div className='bg-white px-2 md:px-6 py-4 shadow-md rounded'>
          {trashedTasks.length === 0 ? (
            <p className='text-gray-500'>No trashed tasks.</p>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full mb-5'>
                <TableHeader />
                <tbody>
                  {trashedTasks.map((tk, idx) => (
                    <TableRow key={idx} item={tk} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        msg={msg}
        setMsg={setMsg}
        type={type}
        setType={setType}
        onClick={deleteRestoreHandler}
      />
    </>
  );
};

export default Trash;
