import React, { useState, useEffect } from "react";
import { FaList } from "react-icons/fa";
import { MdGridView } from "react-icons/md";
import { useParams } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import { BiMicrophone } from "react-icons/bi";
import API from "../assets/axios";

import Loading from "../components/Loader";
import Title from "../components/Title";
import Button from "../components/Button";
import Tabs from "../components/Tabs";
import BoardView from "../components/BoardView";
import Table from "../components/task/Table";
import AddTask from "../components/task/AddTask";

const TABS = [
  { title: "Board View", icon: <MdGridView /> },
  { title: "List View", icon: <FaList /> },
];

const Tasks = () => {
  const params = useParams();
const [listening, setListening] = useState(false);

  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [newTaskData, setNewTaskData] = useState(null);

  const status = params?.status || "";

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await API.get("/task");
        setTasks(res.data.tasks);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load tasks");
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);
const Todaydate = () => {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${year}-${month}-${day}`; // For input[type="date"]
};


  const parseVoiceCommand = (command) => {
    const lowerCommand = command.toLowerCase();

    if (lowerCommand.startsWith('create note')) {
      const content = lowerCommand.replace('create note', '').trim();
      if (content) {
        setNewTaskData({
          title: content,
          description: '',
//           assignedTo: 'self', 
          priority: 'medium',
date: Todaydate(),

        });
        setOpen(true);
      } else {
        alert('No content detected for the note.');
      }
    } else if (lowerCommand.startsWith('delete note')) {
      const noteSnippet = lowerCommand.replace('delete note', '').trim();
      const noteToDelete = tasks.find(note =>
        note.title.toLowerCase().includes(noteSnippet)
      );
      if (noteToDelete) {
        handleDelete(noteToDelete._id);
      } else {
        alert('Note not found for deletion.');
      }
    } else if (lowerCommand.startsWith('search note')) {
      const searchQuery = lowerCommand.replace('search note', '').trim();
      alert(`Searching for "${searchQuery}" not yet implemented.`);
    } else {
      alert('Command not recognized. Try "create note", "delete note", or "search note".');
    }
  };

  const startVoiceRecognition = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
    setListening(true);

      console.log("Voice recognition started");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      parseVoiceCommand(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);

    };

    recognition.onend = () => {
    setListening(false);
      console.log("Voice recognition ended");
    };

    recognition.start();
  };

 const handleDelete = async (taskId) => {
  try {
    await API.put(`task/${taskId}`); // Soft delete assumed
    window.location.reload();
  } catch (err) {
    console.error("Delete error:", err);
  }
};


  const filteredTasks = status
    ? tasks.filter((task) => task.stage.toLowerCase() === status.toLowerCase())
    : tasks;

  if (loading) {
    return (
      <div className='py-10'>
        <Loading />
      </div>
    );
  }

  if (error) {
    return <div className='text-red-600 p-4'>{error}</div>;
  }

  return (
    <div className='w-full'>
      <div className='flex items-center justify-between mb-4'>
        <Title title={status ? `${status} Tasks` : "Tasks"} />
        <div className="flex gap-2">
          {!status && (
            <>
              <Button
                onClick={() => setOpen(true)}
                label='Create Task'
                icon={<IoMdAdd className='text-lg' />}
                className='flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5'
              />
              <Button
  onClick={startVoiceRecognition}
  label="Voice Command"
  icon={<BiMicrophone className="text-lg" />}
  className={`flex flex-row-reverse items-center gap-1 px-3 py-2 rounded-md text-white ${
    listening ? 'bg-red-600' : 'bg-green-600'
  }`}
/>

            </>
          )}
        </div>
      </div>

      <Tabs tabs={TABS} setSelected={setSelected}>
        {selected !== 1 ? (
          <BoardView tasks={filteredTasks} />
        ) : (
          <div className='w-full'>
            <Table tasks={filteredTasks} />
          </div>
        )}
      </Tabs>
 <AddTask open={open} setOpen={setOpen} prefillData={newTaskData} clearPrefill={() => setNewTaskData(null)} />
 
    </div>
  );
};

export default Tasks;
