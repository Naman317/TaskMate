import { Listbox, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { BsChevronExpand } from "react-icons/bs";
import clsx from "clsx";
import { getInitials } from "../../utils";
import { MdCheck } from "react-icons/md";
import API from "../../assets/axios";

const UserList = ({ setTeam, team = [], disabled = false }) => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await API.get("/user/get-team", { withCredentials: true });
        const users = res.data || [];
        setUsers(users);

        // For edit mode: sync with provided team
        const selectedFromTeam = users.filter((u) =>
          team.some((t) => typeof t === "object" ? t._id === u._id : t === u._id)
        );
        setSelectedUsers(selectedFromTeam);
      } catch (err) {
        console.error("Error fetching team:", err.message);
      }
    };

    fetchTeam();
  }, []);

  const handleChange = (selected) => {
    setSelectedUsers(selected);
    setTeam(selected.map((u) => u._id)); // Send only IDs
  };

  return (
    <div>
      <p className="text-gray-700 mb-1">Assign Task To:</p>
      <Listbox value={selectedUsers} onChange={handleChange} multiple disabled={disabled}>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-default rounded bg-white border border-gray-300 pl-3 pr-10 py-2 text-left sm:text-sm disabled:opacity-60">
            <span className="block truncate">
              {selectedUsers.length > 0
                ? selectedUsers.map((user) => user.name).join(", ")
                : "Select team members"}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <BsChevronExpand className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </span>
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {users.map((user, index) => (
                <Listbox.Option
                  key={user._id || index}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-amber-100 text-amber-900" : "text-gray-900"
                    }`
                  }
                  value={user}
                >
                  {({ selected }) => (
                    <>
                      <div className={clsx("flex items-center gap-2 truncate", selected ? "font-medium" : "font-normal")}>
                        <div className="w-6 h-6 rounded-full text-white flex items-center justify-center bg-violet-600">
                          <span className="text-center text-[10px]">
                            {getInitials(user.name)}
                          </span>
                        </div>
                        <span>{user.name}</span>
                      </div>
                      {selected && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                          <MdCheck className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default UserList;
