import { Popover, Transition } from "@headlessui/react";
import moment from "moment";
import { Fragment, useEffect, useState } from "react";
import { BiSolidMessageRounded } from "react-icons/bi";
import { HiBellAlert } from "react-icons/hi2";
import { IoIosNotificationsOutline } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import API from "../assets/axios" // <-- your Axios instance

const ICONS = {
  alert: (
    <HiBellAlert className='h-5 w-5 text-gray-600 group-hover:text-indigo-600' />
  ),
  message: (
    <BiSolidMessageRounded className='h-5 w-5 text-gray-600 group-hover:text-indigo-600' />
  ),
};

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const res = await API.get("user/notifications", { withCredentials: true });
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.error("Error fetching notifications:", err.message);
    }
  };

  const markAsRead = async (id) => {
    try {
      await API.patch(`user/notification/read/${id}`, {}, { withCredentials: true });
      // Optionally remove from local list for instant feedback
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Failed to mark as read:", err.message);
    }
  };

  const markAllAsRead = async () => {
    try {
      await API.patch(`user/notification/read-all`, {}, { withCredentials: true });
      setNotifications([]);
    } catch (err) {
      console.error("Failed to mark all as read:", err.message);
    }
  };

  const handleNotificationClick = async (item) => {
    if (item._id) {
      await markAsRead(item._id);
    }

    if (item.task?._id) {
      navigate(`/task/${item.task._id}`);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const callsToAction = [
    { name: "Cancel", href: "#" },
    {
      name: "Mark All Read",
      
      onClick: markAllAsRead,
    },
  ];

  return (
    <Popover className='relative'>
      <Popover.Button className='inline-flex items-center outline-none'>
        <div className='w-8 h-8 flex items-center justify-center text-gray-800 relative'>
          <IoIosNotificationsOutline className='text-2xl' />
          {notifications.length > 0 && (
            <span className='absolute text-center top-0 right-1 text-xs text-white font-semibold w-4 h-4 rounded-full bg-red-600'>
              {notifications.length}
            </span>
          )}
        </div>
      </Popover.Button>

      <Transition
        as={Fragment}
        enter='transition ease-out duration-200'
        enterFrom='opacity-0 translate-y-1'
        enterTo='opacity-100 translate-y-0'
        leave='transition ease-in duration-150'
        leaveFrom='opacity-100 translate-y-0'
        leaveTo='opacity-0 translate-y-1'
      >
        <Popover.Panel className='absolute -right-16 md:-right-2 z-10 mt-5 flex w-screen max-w-max px-4'>
          {({ close }) =>
            notifications.length > 0 ? (
              <div className='w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5'>
                <div className='p-4'>
                  {notifications.slice(0, 5).map((item, index) => (
                    <div
                      key={item._id + index}
                      className='group relative flex gap-x-4 rounded-lg p-4 hover:bg-gray-50 cursor-pointer'
                      onClick={() => {
                        handleNotificationClick(item);
                        close(); // close popover
                      }}
                    >
                      <div className='mt-1 h-8 w-8 flex items-center justify-center rounded-lg bg-gray-200 group-hover:bg-white'>
                        {ICONS[item.notiType]}
                      </div>
                      <div>
                        <div className='flex items-center gap-3 font-semibold text-gray-900 capitalize'>
                          <p>{item.notiType}</p>
                          <span className='text-xs font-normal lowercase'>
                            {moment(item.createdAt).fromNow()}
                          </span>
                        </div>
                        <p className='line-clamp-2 mt-1 text-gray-600'>
                          {item.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className='grid grid-cols-2 divide-x bg-gray-50'>
                  {callsToAction.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={item.onClick || close}
                      className='flex items-center justify-center gap-x-2.5 p-3 font-semibold text-blue-600 hover:bg-gray-100'
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className='bg-white p-4 rounded-lg shadow-xl w-80 text-sm text-gray-700'>
                <p>No new notifications.</p>
              </div>
            )
          }
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default NotificationPanel;
