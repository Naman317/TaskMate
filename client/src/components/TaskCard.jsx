import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import {
  MdAttachFile,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { BiMessageAltDetail } from "react-icons/bi";
import { FaList } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { FiMoreHorizontal } from "react-icons/fi";
import { useSelector } from "react-redux";
import API from "../assets/axios";

import { BGS, PRIOTITYSTYELS, TASK_TYPE, formatDate } from "../utils";
import AddSubTask from "./task/AddSubTask";
import AddTask from "./task/AddTask";
import ConfirmatioDialog from "./Dialogs";
import UserInfo from "./UserInfo";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const TaskCard = ({ task, onSubTaskAdded }) => {
  const { user } = useSelector((state) => state.auth);
  const [openSubtask, setOpenSubtask] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleView = () => {
    navigate(`/task/${task._id}`);
  };

  const handleEdit = () => {
    setOpenEdit(true);
    setShowMenu(false);
  };

  const handleDeleteClick = () => {
    setOpenDialog(true);
    setShowMenu(false);
  };

  const deleteHandler = async () => {
    try {
      await API.put(`task/${task._id}`);
      window.location.reload();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <>
      <div className='w-full h-fit bg-white shadow-md p-4 rounded relative'>
        <div className='w-full flex justify-between items-start'>
          <div
            className={clsx(
              "flex gap-1 items-center text-sm font-medium",
              PRIOTITYSTYELS[task?.priority]
            )}
          >
            <span className='text-lg'>{ICONS[task?.priority]}</span>
            <span className='uppercase'>{task?.priority} Priority</span>
          </div>

          <div className='relative' ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className='p-1 hover:bg-gray-200 rounded-full'
            >
              <FiMoreHorizontal size={18} />
            </button>
            {showMenu && (
              <div className='absolute right-0 mt-2 bg-white border rounded shadow-md w-36 z-50'>
                <button
                  onClick={handleView}
                  className='block w-full text-left px-4 py-2 text-sm hover:bg-gray-100'
                >
                  View
                </button>
                <button
                  onClick={handleEdit}
                  className='block w-full text-left px-4 py-2 text-sm hover:bg-gray-100'
                >
                  Edit
                </button>
                <button
                  onClick={handleDeleteClick}
                  className='block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100'
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <div className='mt-2 flex items-center gap-2'>
          <div className={clsx("w-4 h-4 rounded-full", TASK_TYPE[task.stage])} />
          <h4 className='line-clamp-1 text-black'>{task?.title}</h4>
        </div>

        {task.createdByRole === "admin" && (
          <span className='text-[11px] font-medium bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded mt-1 inline-block'>
    Assigned by {task?.createdBy?.name}
          </span>
        )}

        <span className='text-sm text-gray-600'>
          {formatDate(new Date(task?.date))}
        </span>

        <div className='border-t my-2 border-gray-200' />

        <div className='flex items-center justify-between mb-2'>
          <div className='flex gap-3 text-sm text-gray-600'>
            <div className='flex gap-1 items-center'>
              <BiMessageAltDetail />
              <span>{task?.activities?.length}</span>
            </div>
            <div className='flex gap-1 items-center'>
              <FaList />
              <span>0/{task?.subTasks?.length}</span>
            </div>
          </div>

          <div className='flex -space-x-1'>
            {task?.team?.map((m, i) => (
              <div
                key={i}
                className={clsx(
                  "w-7 h-7 rounded-full text-white flex items-center justify-center text-sm",
                  BGS[i % BGS.length]
                )}
              >
                <UserInfo user={m} />
              </div>
            ))}
          </div>
        </div>

        {task?.subTasks?.length > 0 ? (
          <div className='py-4 border-t border-gray-200'>
            <h5 className='text-base line-clamp-1 text-black'>
              {task?.subTasks[0].title}
            </h5>
            <div className='p-4 space-x-8'>
              <span className='text-sm text-gray-600'>
                {formatDate(new Date(task?.subTasks[0]?.date))}
              </span>
              <span className='bg-blue-600/10 px-3 py-1 rounded-full text-blue-700 font-medium'>
                {task?.subTasks[0].tag}
              </span>
            </div>
          </div>
        ) : (
          <div className='py-4 border-t border-gray-200 text-gray-500'>
            No Sub Task
          </div>
        )}

        <div className='w-full pb-2'>
          <button
            onClick={() => setOpenSubtask(true)}
            disabled={!user.isAdmin}
            className='w-full flex gap-4 items-center text-sm text-gray-500 font-semibold disabled:cursor-not-allowed'
          >
            <IoMdAdd className='text-lg' />
            <span>ADD SUBTASK</span>
          </button>
        </div>
      </div>

      <AddSubTask
        open={openSubtask}
        setOpen={setOpenSubtask}
        id={task._id}
        onSubTaskAdded={onSubTaskAdded || (() => window.location.reload())}
      />

      <AddTask open={openEdit} setOpen={setOpenEdit} task={task} />

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />
    </>
  );
};

export default TaskCard;
