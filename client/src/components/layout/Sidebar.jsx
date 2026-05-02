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
  Menu as MenuIcon,
  X
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { setOpenSidebar } from "../../redux/slices/authSlice";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import useToast from "../../hooks/useToast";

const linkData = [
  { label: "Dashboard", link: "dashboard", icon: <LayoutDashboard size={20} /> },
  { label: "Tasks", link: "tasks", icon: <ListTodo size={20} /> },
  { label: "Completed", link: "completed/completed", icon: <CheckCircle2 size={20} /> },
  { label: "In Progress", link: "in-progress/in progress", icon: <Clock size={20} /> },
  { label: "To Do", link: "todo/todo", icon: <ListTodo size={20} /> },
  { label: "Overdue", link: "overdue/overdue", icon: <AlertCircle size={20} /> },
  { label: "Team", link: "team", icon: <Users size={20} /> },
  { label: "Trash", link: "trashed", icon: <Trash2 size={20} /> },
];

const Sidebar = () => {
  const { user, isSidebarOpen } = useSelector((state) => state.auth);
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
          "group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300",
          isActive
            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        )}
      >
        <span className={clsx("shrink-0 transition-transform duration-300 group-hover:scale-110", isActive ? "text-white" : "text-primary")}>
          {el.icon}
        </span>
        {!isCollapsed && (
          <span className="font-medium text-sm tracking-tight">{el.label}</span>
        )}
      </Link>
    );
  };

  const sidebarContent = (
    <div className={clsx(
      "h-full flex flex-col border-r bg-card transition-all duration-300",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <div className="p-6 flex items-center justify-between">
        {!isCollapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-primary/30">T</div>
            <span className="text-xl font-bold tracking-tighter">Tasky</span>
          </motion.div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-accent text-muted-foreground hidden lg:block"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
        <button onClick={closeSidebar} className="lg:hidden p-2 text-muted-foreground"><X size={24} /></button>
      </div>

      <div className="flex-1 px-4 space-y-1.5 mt-4 overflow-y-auto scrollbar-hide">
        {sidebarLinks.map((link) => (
          <NavLink el={link} key={link.label} />
        ))}
      </div>

      <div className="p-4 border-t">
        {!isCollapsed && (
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-4 border border-primary/10">
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Status</p>
            <p className="text-xs font-semibold mb-3">
              {user?.email === "admin@gmail.com" ? "Super Admin" : 
               user?.isAdmin ? "Administrator" : "Team Member"}
            </p>

            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
               <div className="h-full bg-primary w-full opacity-60"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex h-screen sticky top-0 shrink-0">
        {sidebarContent}
      </aside>

      {/* Sidebar Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-screen w-64 z-[101] lg:hidden"
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
