import React from "react";
import {
  LayoutDashboard,
  CheckCircle2,
  Clock,
  ListTodo,
  Users,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Plus,
  AlertCircle,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { setOpenSidebar } from "../../redux/slices/authSlice";
import clsx from "clsx";
import { motion } from "framer-motion";
import useToast from "../../hooks/useToast";

const linkData = [

  {
    label: "Dashboard",
    link: "dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  {
    label: "Tasks",
    link: "tasks",
    icon: <ListTodo size={20} />,
  },
  {
    label: "Completed",
    link: "completed/completed",
    icon: <CheckCircle2 size={20} />,
  },
  {
    label: "In Progress",
    link: "in-progress/in progress",
    icon: <Clock size={20} />,
  },
  {
    label: "To Do",
    link: "todo/todo",
    icon: <ListTodo size={20} />,
  },
  {
    label: "Overdue",
    link: "overdue/overdue",
    icon: <AlertCircle size={20} />,
  },
  {
    label: "Team",
    link: "team",
    icon: <Users size={20} />,
  },

  {
    label: "Trash",
    link: "trashed",
    icon: <Trash2 size={20} />,
  },
];

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const toast = useToast();
  const [isCollapsed, setIsCollapsed] = React.useState(false);


  const path = location.pathname.split("/")[1];
  const sidebarLinks = user?.isAdmin ? linkData : linkData.slice(0, 5);

  const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
  };

  const NavLink = ({ el }) => {
    const isActive = path === el.link.split("/")[0];
    return (
      <Link
        to={el.link}
        onClick={closeSidebar}
        className={clsx(
          "group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ease-in-out",
          isActive
            ? "bg-primary text-primary-foreground shadow-md"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        )}
      >
        <span className={clsx("transition-transform duration-200 group-hover:scale-110", isActive ? "text-white" : "text-primary")}>
          {el.icon}
        </span>
        {!isCollapsed && (
          <span className="font-medium text-sm tracking-wide">{el.label}</span>
        )}
      </Link>
    );
  };

  return (
    <div
      className={clsx(
        "h-screen flex flex-col border-r bg-card transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="p-6 flex items-center justify-between">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
              T
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">Tasky</span>
          </motion.div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hidden md:block"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <div className="flex-1 px-4 space-y-1 mt-4">
        {sidebarLinks.map((link) => (
          <NavLink el={link} key={link.label} />
        ))}
      </div>

      <div className="p-4 border-t">
        {!isCollapsed ? (
          <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Pro Plan</p>
            <p className="text-[11px] text-muted-foreground mb-3">Get unlimited tasks and team members.</p>
            <button 
              onClick={() => toast.info("Premium Feature", "The Pro Plan is launching soon. Get ready for advanced team collaboration!")}
              className="w-full py-2 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              Upgrade Now
            </button>
          </div>
        ) : (
          <button 
            onClick={() => toast.info("Premium Feature", "The Pro Plan is launching soon.")}
            className="w-full flex justify-center p-2 bg-primary text-white rounded-lg"
          >
            <Plus size={18} />
          </button>

        )}
      </div>
    </div>
  );
};

export default Sidebar;
