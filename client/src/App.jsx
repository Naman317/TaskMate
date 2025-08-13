import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import { markRehydrated } from "./redux/slices/authSlice";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Layout from "./Layout";
import Dashboard from "./pages/dashboard";
import Tasks from "./pages/Tasks";
import TaskDetails from "./pages/TaskDetails";
import Trash from "./pages/Trash";
import Users from "./pages/Users";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(markRehydrated());
  }, []);

  return (
    <main className='w-full min-h-screen bg-[#f3f4f6]'>
      <Routes>
        {/* Public */}
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />

        {/* Protected */}
        <Route element={<Layout />}>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/tasks' element={<Tasks />} />
          <Route path='/completed/:status' element={<Tasks />} />
          <Route path='/in-progress/:status' element={<Tasks />} />
          <Route path='/todo/:status' element={<Tasks />} />
          <Route path='/team' element={<Users />} />
          <Route path='/trashed' element={<Trash />} />
          <Route path='/task/:id' element={<TaskDetails />} />
        </Route>
      </Routes>
      <Toaster richColors />
    </main>
  );
}

export default App;
