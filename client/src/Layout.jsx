import { Transition } from "@headlessui/react";
import clsx from "clsx";
import { Fragment, useRef } from "react";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";
import { setOpenSidebar } from "./redux/slices/authSlice";

function Layout() {
  const { user, rehydrationComplete } = useSelector((state) => state.auth);

  if (!rehydrationComplete) {
    return (
      <div className='w-full h-screen flex items-center justify-center bg-background'>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground animate-pulse">Initializing Tasky...</p>
        </div>
      </div>
    );
  }

  return user ? (
    <div className='w-full h-screen flex bg-background'>
      {/* Desktop Sidebar */}
      <div className='sticky top-0 hidden md:block h-screen'>
        <Sidebar />
      </div>

      <MobileSidebar />

      <div className='flex-1 flex flex-col h-screen overflow-hidden'>
        <Navbar />
        <main className='flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 animate-in'>
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  ) : (
    <Navigate to='/' replace />
  );
}

const MobileSidebar = () => {

  const { isSidebarOpen } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
  };

  return (
    <Transition show={isSidebarOpen} as={Fragment}>
      <div className="relative z-50 md:hidden">
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={closeSidebar} />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="transition ease-in-out duration-300 transform"
          enterFrom="-translate-x-full"
          enterTo="translate-x-0"
          leave="transition ease-in-out duration-300 transform"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-full"
        >
          <div className="fixed inset-0 flex">
            <div className="relative flex w-full max-w-xs flex-1 flex-col bg-card shadow-xl">
              <div className="absolute right-0 top-0 -mr-12 pt-4">
                <button
                  type="button"
                  className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={closeSidebar}
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>
              <div className="h-full overflow-y-auto">
                <Sidebar />
              </div>
            </div>
          </div>
        </Transition.Child>
      </div>
    </Transition>
  );
};

export default Layout;

