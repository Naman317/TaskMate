import { Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { FaUser, FaUserLock } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../redux/slices/authSlice";

import ProfileModal from "./ProfileModal";
import ChangePasswordModal from "./ChangePasswordModal";

const getInitials = (name) => {
  if (!name || typeof name !== "string") return "";
  return name
    .trim()
    .split(/\s+/)
    .map((n) => n[0]?.toUpperCase() || "")
    .join("")
    .slice(0, 2);
};

const UserAvatar = () => {
  const [openProfile, setOpenProfile] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(logoutUser());
    navigate("/", { replace: true });
  };

  const initials = getInitials(user?.name);

  return (
    <>
      {/* Avatar and Dropdown */}
      <Menu as='div' className='relative inline-block text-left'>
        <Menu.Button className='w-10 h-10 2xl:w-12 2xl:h-12 flex items-center justify-center rounded-full bg-blue-600'>
          <span className='text-white font-semibold'>
            {initials || "?"}
          </span>
        </Menu.Button>

        <Transition
          as={Fragment}
          enter='transition ease-out duration-100'
          enterFrom='transform opacity-0 scale-95'
          enterTo='transform opacity-100 scale-100'
          leave='transition ease-in duration-75'
          leaveFrom='transform opacity-100 scale-100'
          leaveTo='transform opacity-0 scale-95'
        >
          <Menu.Items className='absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black/5 focus:outline-none z-50'>
            <div className='p-4'>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => setOpenProfile(true)}
                    className='text-gray-700 flex w-full items-center rounded-md px-2 py-2 text-base'
                  >
                    <FaUser className='mr-2' />
                    Profile
                  </button>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => setOpenPassword(true)}
                    className='text-gray-700 flex w-full items-center rounded-md px-2 py-2 text-base'
                  >
                    <FaUserLock className='mr-2' />
                    Change Password
                  </button>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={logoutHandler}
                    className='text-red-600 flex w-full items-center rounded-md px-2 py-2 text-base'
                  >
                    <IoLogOutOutline className='mr-2' />
                    Logout
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>

      {/* Profile Modal */}
      {openProfile && (
        <ProfileModal open={openProfile} setOpen={setOpenProfile} user={user} />
      )}

      {/* Change Password Modal */}
      {openPassword && (
        <ChangePasswordModal open={openPassword} setOpen={setOpenPassword} />
      )}
    </>
  );
};

export default UserAvatar;
