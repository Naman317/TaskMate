import React from "react";
import { Bell, Search, Menu, User, LogOut, Settings } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenSidebar, logoutUser } from "../../redux/slices/authSlice";
import { Menu as HeadlessMenu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import NotificationPanel from "../NotificationPanel";
import useToast from "../../hooks/useToast";
import ProfileModal from "../ProfileModal";
import ChangePasswordModal from "../ChangePasswordModal";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  
  const [openProfile, setOpenProfile] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success("Logged out successfully", "See you back soon!");
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md md:px-8">
      {/* ... existing code ... */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => dispatch(setOpenSidebar(true))}
          className="p-2 rounded-md hover:bg-accent text-muted-foreground md:hidden"
        >
          <Menu size={20} />
        </button>


      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <NotificationPanel />

        <HeadlessMenu as="div" className="relative ml-3">
          <HeadlessMenu.Button className="flex items-center gap-2 p-1 rounded-full hover:bg-accent transition-all">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="hidden md:flex flex-col items-start mr-2">
              <span className="text-xs font-semibold text-foreground leading-none">{user?.name}</span>
              <span className="text-[10px] text-muted-foreground font-medium">
                {user?.email === "admin@gmail.com" ? "Super Admin" : (user?.role || "Team Member")}
              </span>
            </div>
          </HeadlessMenu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <HeadlessMenu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl border bg-card p-1 shadow-premium outline-none">
              <div className="px-3 py-2 border-b mb-1">
                <p className="text-xs font-medium text-muted-foreground">Signed in as</p>
                <p className="text-sm font-semibold truncate">{user?.email}</p>
              </div>
              <HeadlessMenu.Item>
                {({ active }) => (
                  <button
                    onClick={() => setOpenProfile(true)}
                    className={clsx(
                      "flex w-full items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors",
                      active ? "bg-accent text-accent-foreground" : "text-foreground"
                    )}
                  >
                    <User size={16} /> Profile
                  </button>
                )}
              </HeadlessMenu.Item>
              <HeadlessMenu.Item>
                {({ active }) => (
                  <button
                    onClick={() => setOpenPassword(true)}
                    className={clsx(
                      "flex w-full items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors",
                      active ? "bg-accent text-accent-foreground" : "text-foreground"
                    )}
                  >
                    <Settings size={16} /> Settings
                  </button>
                )}
              </HeadlessMenu.Item>
              <HeadlessMenu.Item>
                {({ active }) => (
                  <button
                    onClick={handleLogout}
                    className={clsx(
                      "flex w-full items-center gap-2 px-3 py-2 text-sm rounded-lg text-red-500 transition-colors",
                      active ? "bg-red-500/10" : ""
                    )}
                  >
                    <LogOut size={16} /> Logout
                  </button>
                )}
              </HeadlessMenu.Item>
            </HeadlessMenu.Items>
          </Transition>
        </HeadlessMenu>
      </div>

      {/* Modals */}
      <ProfileModal 
        open={openProfile} 
        setOpen={setOpenProfile} 
        user={user} 
      />
      <ChangePasswordModal 
        open={openPassword} 
        setOpen={setOpenPassword} 
      />
    </nav>
  );
};


export default Navbar;

