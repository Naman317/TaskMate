import React, { useEffect, useState } from "react";
import {
  MdAdminPanelSettings,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdEditNote,
} from "react-icons/md";
import { FaNewspaper } from "react-icons/fa";
import { FaArrowsToDot } from "react-icons/fa6";
import moment from "moment";
import clsx from "clsx";

import API from "../assets/axios";
import { PRIOTITYSTYELS, TASK_TYPE, getInitials, BGS } from "../utils";
import UserInfo from "../components/UserInfo";

const Dashboard = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get("task/dashboard", { withCredentials: true });
        setSummary(res.data);
      } catch (err) {
        console.error("Dashboard fetch failed:", err.message);
      }
    };

    fetchDashboard();
  }, []);

  if (!summary) {
    return <p className='text-center py-10 text-gray-600'>Loading dashboard...</p>;
  }

  const stats = [
    {
      label: "TOTAL TASK",
      total: summary.totalTasks || 0,
      icon: <FaNewspaper />,
      bg: "bg-[#1d4ed8]",
    },
    {
      label: "COMPLETED TASK",
      total: summary.tasks["completed"] || 0,
      icon: <MdAdminPanelSettings />,
      bg: "bg-[#0f766e]",
    },
    {
      label: "TASK IN PROGRESS",
      total: summary.tasks["in progress"] || 0,
      icon: <MdEditNote />,
      bg: "bg-[#f59e0b]",
    },
    {
      label: "TODOS",
      total: summary.tasks["todo"] || 0,
      icon: <FaArrowsToDot />,
      bg: "bg-[#be185d]",
    },
  ];

  const ICONS = {
    high: <MdKeyboardDoubleArrowUp />,
    medium: <MdKeyboardArrowUp />,
    low: <MdKeyboardArrowDown />,
  };

  const StatCard = ({ label, total, bg, icon }) => (
    <div className='w-full h-32 bg-white p-5 shadow-md rounded-md flex items-center justify-between'>
      <div className='flex flex-col justify-between h-full'>
        <p className='text-base text-gray-600'>{label}</p>
        <span className='text-2xl font-semibold'>{total}</span>
        <span className='text-sm text-gray-400'>{"110 last month"}</span>
      </div>
      <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center text-white", bg)}>
        {icon}
      </div>
    </div>
  );

  const TaskTable = () => (
    <div className='w-full md:w-2/3 bg-white px-2 md:px-4 pt-4 pb-4 shadow-md rounded'>
      <table className='w-full'>
        <thead className='border-b border-gray-300'>
          <tr className='text-black text-left'>
            <th className='py-2'>Task Title</th>
            <th className='py-2'>Priority</th>
            <th className='py-2'>Team</th>
            <th className='py-2 hidden md:block'>Task Date</th>
          </tr>
        </thead>
        <tbody>
          {summary.last10Task?.map((task, idx) => (
            <tr
              key={idx}
              className='border-b border-gray-300 text-gray-600 hover:bg-gray-300/10'
            >
              <td className='py-2'>
                <div className='flex items-center gap-2'>
                  <div className={clsx("w-4 h-4 rounded-full", TASK_TYPE[task.stage])} />
                  <p className='text-base text-black'>{task.title}</p>
                </div>
              </td>
              <td className='py-2'>
                <div className='flex gap-1 items-center'>
                  <span className={clsx("text-lg", PRIOTITYSTYELS[task.priority])}>
                    {ICONS[task.priority]}
                  </span>
                  <span className='capitalize'>{task.priority}</span>
                </div>
              </td>
              <td className='py-2'>
                <div className='flex'>
                  {task.team.map((user, index) => (
                    <div
                      key={index}
                      className={clsx(
                        "w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1",
                        BGS[index % BGS.length]
                      )}
                    >
                      <UserInfo user={user} />
                    </div>
                  ))}
                </div>
              </td>
              <td className='py-2 hidden md:block'>
                <span className='text-base text-gray-600'>
                  {moment(task?.date).fromNow()}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const UserTable = () => (
    <div className='w-full md:w-1/3 bg-white h-fit px-2 md:px-6 py-4 shadow-md rounded'>
      <table className='w-full mb-5'>
        <thead className='border-b border-gray-300'>
          <tr className='text-black text-left'>
            <th className='py-2'>Full Name</th>
            <th className='py-2'>Created At</th>
          </tr>
        </thead>
        <tbody>
          {summary.users?.map((user, index) => (
            <tr
              key={user._id}
              className='border-b border-gray-200 text-gray-600 hover:bg-gray-400/10'
            >
              <td className='py-2'>
                <div className='flex items-center gap-3'>
                  <div className='w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-violet-700'>
                    <span>{getInitials(user?.name)}</span>
                  </div>
                  <div>
                    <p>{user.name}</p>
                    <span className='text-xs text-black'>{user.role}</span>
                  </div>
                </div>
              </td>
             
              <td className='py-2 text-sm'>
                {moment(user?.createdAt).fromNow()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className='h-full py-4'>
      {/* Stat Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-5'>
        {stats.map((item, idx) => (
          <StatCard key={idx} {...item} />
        ))}
      </div>

    
      {/* Tables */}
      <div className='w-full flex flex-col md:flex-row gap-4 2xl:gap-10 py-8'>
        <TaskTable />
        {summary.users?.length > 0 && <UserTable />}
      </div>
    </div>
  );
};

export default Dashboard;
