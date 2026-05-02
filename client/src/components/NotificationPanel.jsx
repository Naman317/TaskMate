import { Popover, Transition } from "@headlessui/react";
import moment from "moment";
import { Fragment, useEffect, useState } from "react";
import { Bell, BellRing, MessageSquare, CheckCheck, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import API from "../assets/axios";
import clsx from "clsx";

const ICONS = {
  alert: (
    <BellRing className='h-4 w-4 text-rose-600' />
  ),
  message: (
    <MessageSquare className='h-4 w-4 text-blue-600' />
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

  return (
    <Popover className='relative'>
      <Popover.Button className='relative p-2 rounded-full hover:bg-accent text-muted-foreground transition-all focus:outline-none'>
        <Bell size={20} />
        {notifications.length > 0 && (
          <span className="absolute top-2 right-2 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
        )}
      </Popover.Button>

      <Transition
        as={Fragment}
        enter='transition ease-out duration-200'
        enterFrom='opacity-0 translate-y-1 scale-95'
        enterTo='opacity-100 translate-y-0 scale-100'
        leave='transition ease-in duration-150'
        leaveFrom='opacity-100 translate-y-0 scale-100'
        leaveTo='opacity-0 translate-y-1 scale-95'
      >
        <Popover.Panel className='absolute right-0 z-50 mt-3 w-80 md:w-96 origin-top-right rounded-2xl border bg-card p-1 shadow-premium outline-none'>
          <div className='flex items-center justify-between px-4 py-3 border-b'>
            <h3 className='text-sm font-bold'>Notifications</h3>
            {notifications.length > 0 && (
              <button 
                onClick={markAllAsRead}
                className='text-[10px] font-semibold text-primary hover:underline flex items-center gap-1'
              >
                <CheckCheck size={12} /> Mark all as read
              </button>
            )}
          </div>

          <div className='max-h-[400px] overflow-y-auto p-1'>
            {notifications.length > 0 ? (
              notifications.slice(0, 8).map((item, index) => (
                <div
                  key={item._id || index}
                  className='group relative flex gap-x-3 rounded-xl p-3 hover:bg-accent transition-colors cursor-pointer'
                  onClick={() => handleNotificationClick(item)}
                >
                  <div className='mt-1 h-8 w-8 flex items-center justify-center rounded-lg bg-muted group-hover:bg-background transition-colors'>
                    {ICONS[item.notiType] || <Bell className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <div className='flex items-center justify-between'>
                      <p className='text-xs font-bold capitalize text-foreground'>{item.notiType}</p>
                      <span className='text-[10px] text-muted-foreground'>
                        {moment(item.createdAt).fromNow()}
                      </span>
                    </div>
                    <p className='text-xs text-muted-foreground mt-0.5 line-clamp-2'>
                      {item.text}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className='py-12 flex flex-col items-center justify-center text-center'>
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3 text-muted-foreground">
                  <Bell size={20} />
                </div>
                <p className="text-sm font-medium text-foreground">All caught up!</p>
                <p className="text-xs text-muted-foreground mt-1">No new notifications for you.</p>
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className='p-2 border-t mt-1'>
              <button className='w-full py-2 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors'>
                View all notifications
              </button>
            </div>
          )}
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default NotificationPanel;
