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
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/user/notifications");
      const list = res.data.notifications || [];
      const count = typeof res.data.unreadCount === "number" 
        ? res.data.unreadCount 
        : list.filter((n) => !n.hasRead).length;
      setNotifications(list);
      setUnreadCount(count);
    } catch (err) {
      console.error("Error fetching notifications:", err?.message);
    }
  };

  const markAsRead = async (id) => {
    try {
      await API.patch(`/user/notification/read/${id}`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, hasRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark as read:", err?.message);
    }
  };

  const markAllAsRead = async () => {
    try {
      await API.patch(`/user/notification/read-all`);
      setNotifications((prev) => prev.map((n) => ({ ...n, hasRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all as read:", err?.message);
    }
  };

  const handleNotificationClick = async (item) => {
    if (item._id && !item.hasRead) {
      await markAsRead(item._id);
    }

    if (item.task?._id) {
      navigate(`/task/${item.task._id}`);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 45000); // 45s polling
    return () => clearInterval(interval);
  }, []);

  return (
    <Popover className='relative'>
      <Popover.Button className='relative p-2 rounded-full hover:bg-accent text-muted-foreground transition-all focus:outline-none cursor-pointer'>
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
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
            <div className="flex items-center gap-2">
              <h3 className='text-sm font-bold'>Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-primary/10 text-primary rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className='text-[10px] font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer'
              >
                <CheckCheck size={12} /> Mark all read
              </button>
            )}
          </div>

          <div className='max-h-[400px] overflow-y-auto p-1 divide-y divide-border/40'>
            {notifications.length > 0 ? (
              notifications.slice(0, 10).map((item, index) => (
                <div
                  key={item._id || index}
                  className={clsx(
                    'group relative flex gap-x-3 rounded-xl p-3 transition-colors cursor-pointer',
                    !item.hasRead ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-accent opacity-80'
                  )}
                  onClick={() => handleNotificationClick(item)}
                >
                  <div className='mt-1 h-8 w-8 flex items-center justify-center rounded-lg bg-muted group-hover:bg-background transition-colors shrink-0'>
                    {ICONS[item.notiType] || <Bell className="h-4 w-4 text-primary" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className='flex items-center justify-between'>
                      <p className={clsx('text-xs capitalize', !item.hasRead ? 'font-bold text-foreground' : 'font-medium text-muted-foreground')}>
                        {item.notiType}
                      </p>
                      <span className='text-[10px] text-muted-foreground'>
                        {moment(item.createdAt).fromNow()}
                      </span>
                    </div>
                    <p className={clsx('text-xs mt-0.5 line-clamp-2', !item.hasRead ? 'text-foreground' : 'text-muted-foreground')}>
                      {item.text}
                    </p>
                  </div>
                  {!item.hasRead && (
                    <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                  )}
                </div>
              ))
            ) : (
              <div className='py-12 flex flex-col items-center justify-center text-center'>
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3 text-muted-foreground">
                  <Bell size={20} />
                </div>
                <p className="text-sm font-medium text-foreground">All caught up!</p>
                <p className="text-xs text-muted-foreground mt-1">No notifications yet.</p>
              </div>
            )}
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default NotificationPanel;
