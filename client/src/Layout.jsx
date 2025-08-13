import { Transition } from "@headlessui/react";
import clsx from "clsx";
import { Fragment, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { setOpenSidebar } from "./redux/slices/authSlice";

function Layout() {
  const { user, rehydrationComplete } = useSelector((state) => state.auth);

  if (!rehydrationComplete) {
    return (
      <div className='w-full h-screen flex items-center justify-center'>
        Loading...
      </div>
    );
  }

  return user ? (
    <div className='w-full h-screen flex flex-col md:flex-row'>
      <div className='w-1/5 h-screen bg-white sticky top-0 hidden md:block'>
        <Sidebar />
      </div>

      <MobileSidebar />

      <div className='flex-1 overflow-y-auto'>
        <Navbar />
        <div className='p-4 2xl:px-10'>
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <Navigate to='/' replace />
  );
}

// ✅ MobileSidebar is defined right here
const MobileSidebar = () => {
  const { isSidebarOpen } = useSelector((state) => state.auth);
  const mobileMenuRef = useRef(null);
  const dispatch = useDispatch();

  const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
  };

  return (
    <Transition
      show={isSidebarOpen}
      as={Fragment}
      enter='transition-opacity duration-700'
      enterFrom='opacity-0'
      enterTo='opacity-100'
      leave='transition-opacity duration-700'
      leaveFrom='opacity-100'
      leaveTo='opacity-0'
    >
      <div
        ref={(node) => (mobileMenuRef.current = node)}
        className={clsx(
          "md:hidden w-full h-full bg-black/40 fixed inset-0 z-50 transition-all duration-700 transform",
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        )}
        onClick={closeSidebar}
      >
        <div className='bg-white w-3/4 h-full'>
          <div className='w-full flex justify-end px-5 mt-5'>
            <button
              onClick={closeSidebar}
              className='flex justify-end items-end'
            >
              <IoClose size={25} />
            </button>
          </div>
          <div className='-mt-10'>
            <Sidebar />
          </div>
        </div>
      </div>
    </Transition>
  );
};

export default Layout;
