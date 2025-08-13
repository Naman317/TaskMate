import clsx from "clsx";
import moment from "moment";
import React, { useState, useEffect } from "react";
import { FaBug, FaTasks, FaThumbsUp, FaUser } from "react-icons/fa";
import { GrInProgress } from "react-icons/gr";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdOutlineDoneAll,
  MdOutlineMessage,
  MdTaskAlt,
} from "react-icons/md";
import { RxActivityLog } from "react-icons/rx";
import { useParams } from "react-router-dom";
import API from "../assets/axios";
import { toast } from "sonner";
import Tabs from "../components/Tabs";
import { PRIOTITYSTYELS, TASK_TYPE, getInitials } from "../utils";
import Loading from "../components/Loader";
import Button from "../components/Button";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const bgColor = {
  high: "bg-red-200",
  medium: "bg-yellow-200",
  low: "bg-blue-200",
};

const TABS = [
  { title: "Task Detail", icon: <FaTasks /> },
  { title: "Activities/Timeline", icon: <RxActivityLog /> },
];

const TASKTYPEICON = {
  commented: (
    <div className='w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white'>
      <MdOutlineMessage />
    </div>
  ),
  started: (
    <div className='w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white'>
      <FaThumbsUp size={20} />
    </div>
  ),
  assigned: (
    <div className='w-6 h-6 flex items-center justify-center rounded-full bg-gray-500 text-white'>
      <FaUser size={14} />
    </div>
  ),
  bug: (
    <div className='text-red-600'>
      <FaBug size={24} />
    </div>
  ),
  completed: (
    <div className='w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white'>
      <MdOutlineDoneAll size={24} />
    </div>
  ),
  "in progress": (
    <div className='w-8 h-8 flex items-center justify-center rounded-full bg-violet-600 text-white'>
      <GrInProgress size={16} />
    </div>
  ),
};

const act_types = [
  "Started",
  "Completed",
  "In Progress",
  "Commented",
  "Bug",
  "Assigned",
];

const TaskDetails = () => {
  const { id } = useParams();
  const [selected, setSelected] = useState(0);
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await API.get(`/task/${id}`);
        setTask(res.data.task);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setError("Failed to load task");
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  if (loading) return <Loading />;
  if (error || !task)
    return <div className='text-red-600'>{error || "Task not found"}</div>;

  return (
    <div className='w-full flex flex-col gap-3 mb-4 overflow-y-hidden'>
      <h1 className='text-2xl text-gray-600 font-bold'>{task?.title}</h1>

      <Tabs tabs={TABS} setSelected={setSelected}>
        {selected === 0 ? (
          <div className='w-full flex flex-col md:flex-row gap-5 2xl:gap-8 bg-white shadow-md p-8 overflow-y-auto'>
            <div className='w-full md:w-1/2 space-y-8'>
              <div className='flex items-center gap-5'>
                <div
                  className={clsx(
                    "flex gap-1 items-center text-base font-semibold px-3 py-1 rounded-full",
                    PRIOTITYSTYELS[task?.priority],
                    bgColor[task?.priority]
                  )}
                >
                  <span className='text-lg'>{ICONS[task?.priority]}</span>
                  <span className='uppercase'>{task?.priority} Priority</span>
                </div>

                <div className='flex items-center gap-2'>
                  <div
                    className={clsx("w-4 h-4 rounded-full", TASK_TYPE[task?.stage])}
                  />
                  <span className='text-black uppercase'>{task?.stage}</span>
                </div>
              </div>

              <p className='text-gray-500'>
                Created {moment(task?.createdAt).fromNow()}
              </p>

              <div className='flex items-center gap-8 p-4 border-y border-gray-200'>
                <span className='text-gray-400'>|</span>
                <div className='space-x-2'>
                  <span className='font-semibold'>Sub-Tasks:</span>
                  <span>{task?.subTasks?.length}</span>
                </div>
              </div>

              <div className='space-y-4 py-6'>
                <p className='text-gray-600 font-semibold text-sm'>TASK TEAM</p>
                <div className='space-y-3'>
                  {task?.team?.map((m, index) => (
                    <div
                      key={index}
                      className='flex gap-4 py-2 items-center border-t border-gray-200'
                    >
                      <div className='w-10 h-10 rounded-full text-white flex items-center justify-center text-sm bg-blue-600'>
                        <span>{getInitials(m?.name)}</span>
                      </div>
                      <div>
                        <p className='text-lg font-semibold'>{m?.name}</p>
                        <span className='text-gray-500'>{m?.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className='space-y-4 py-6'>
                <p className='text-gray-500 font-semibold text-sm'>SUB-TASKS</p>
                <div className='space-y-8'>
                  {task?.subTasks?.map((el, index) => (
                    <div key={index} className='flex gap-3'>
                      <div className='w-10 h-10 flex items-center justify-center rounded-full bg-violet-100'>
                        <MdTaskAlt className='text-violet-600' size={26} />
                      </div>
                      <div className='space-y-1'>
                        <div className='flex gap-2 items-center'>
                          <span className='text-sm text-gray-500'>
                            {moment(el?.date).fromNow()}
                          </span>
                          <span className='px-2 py-0.5 rounded-full bg-violet-200 text-violet-800 font-semibold'>
                            {el?.tag}
                          </span>
                        </div>
                        <p className='text-gray-700'>{el?.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Activities activity={task?.activities} id={id} />
        )}
      </Tabs>
    </div>
  );
};

const Activities = ({ activity, id }) => {
  const [selected, setSelected] = useState(act_types[0]);
  const [text, setText] = useState("");
  const isLoading = false;

  const handleSubmit = async () => {
    if (!text.trim()) {
      toast.error("Please enter activity content.");
      return;
    }

    try {
      const res = await API.post(`/task/activity/${id}`, {
        type: selected.toLowerCase(),
        activity: text,
      });

      toast.success(res.data.message);
      setText("");
      setSelected(act_types[0]);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to submit activity.");
    }
  };

  const Card = ({ item }) => (
    <div className='flex space-x-4'>
      <div className='flex flex-col items-center flex-shrink-0'>
        <div className='w-10 h-10 flex items-center justify-center'>
          {TASKTYPEICON[item?.type]}
        </div>
        <div className='w-full flex items-center'>
          <div className='w-0.5 bg-gray-300 h-full' />
        </div>
      </div>

      <div className='flex flex-col gap-y-1 mb-8'>
        <p className='font-semibold'>{item?.by?.name}</p>
        <div className='text-gray-500 space-y-2'>
          <span className='capitalize'>{item?.type}</span>
          <span className='text-sm'>{moment(item?.date).fromNow()}</span>
        </div>
        <div className='text-gray-700'>{item?.activity}</div>
      </div>
    </div>
  );

  return (
    <div className='w-full flex gap-10 2xl:gap-20 min-h-screen px-10 py-8 bg-white shadow rounded-md justify-between overflow-y-auto'>
      <div className='w-full md:w-1/2'>
        <h4 className='text-gray-600 font-semibold text-lg mb-5'>Activities</h4>
        <div className='w-full'>
          {activity?.map((el, index) => (
            <Card key={index} item={el} />
          ))}
        </div>
      </div>

      <div className='w-full md:w-1/3'>
        <h4 className='text-gray-600 font-semibold text-lg mb-5'>Add Activity</h4>
        <div className='w-full flex flex-wrap gap-5'>
          {act_types.map((item) => (
            <div key={item} className='flex gap-2 items-center'>
              <input
                type='checkbox'
                className='w-4 h-4'
                checked={selected === item}
                onChange={() => setSelected(item)}
              />
              <p>{item}</p>
            </div>
          ))}
          <textarea
            rows={6}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder='Type activity...'
            className='bg-white w-full mt-6 border border-gray-300 outline-none p-4 rounded-md focus:ring-2 ring-blue-500'
          />
          {isLoading ? (
            <Loading />
          ) : (
            <Button
              type='button'
              label='Submit'
              onClick={handleSubmit}
              className='bg-blue-600 text-white rounded'
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
