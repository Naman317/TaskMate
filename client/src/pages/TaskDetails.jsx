import clsx from "clsx";
import moment from "moment";
import React, { useState, useEffect } from "react";
import { 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  User, 
  Bug, 
  Send,
  Calendar,
  History,
  Subtitles,
  MoreVertical,
  ChevronLeft
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import API from "../assets/axios";
import { PRIOTITYSTYELS, TASK_TYPE, getInitials } from "../utils";
import Loading from "../components/Loader";
import Button from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import Skeleton from "../components/ui/Skeleton";

const TASKTYPEICON = {
  commented: <MessageSquare size={16} className="text-blue-500" />,
  started: <Clock size={16} className="text-amber-500" />,
  assigned: <User size={16} className="text-slate-500" />,
  bug: <Bug size={16} className="text-rose-500" />,
  completed: <CheckCircle2 size={16} className="text-emerald-500" />,
  "in progress": <Clock size={16} className="text-violet-500" />,
};

const act_types = [
  "Started",
  "Completed",
  "In Progress",
  "Commented",
  "Bug",
  "Assigned",
];

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/task/${id}`);
      setTask(res.data.task);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load task details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-in">
        <Skeleton className="h-10 w-2/3" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-[500px] lg:col-span-2" />
          <Skeleton className="h-[500px]" />
        </div>
      </div>
    );
  }

  if (!task) return <div className="text-center py-20 text-muted-foreground">Task not found</div>;

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" icon={<ChevronLeft size={20} />} onClick={() => navigate(-1)} />
        <h1 className="text-3xl font-bold tracking-tight">{task?.title}</h1>
      </div>

      <div className="flex bg-muted p-1 rounded-xl w-fit">
        {["Overview", "Activity Log"].map((tab, idx) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(idx)}
            className={clsx(
              "px-6 py-2 rounded-lg text-sm font-medium transition-all",
              selectedTab === idx ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {selectedTab === 0 ? (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Task Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {task?.description || "No description provided for this task."}
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Priority</p>
                      <span className={clsx(
                        "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                        task.priority === "high" ? "bg-rose-100 text-rose-700" :
                        task.priority === "medium" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                      )}>
                        {task.priority}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Status</p>
                      <span className="text-sm font-medium capitalize">{task.stage}</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Due Date</p>
                      <p className="text-sm font-medium">{moment(task.date).format("MMM D, YYYY")}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Created</p>
                      <p className="text-sm font-medium">{moment(task.createdAt).format("MMM D, YYYY")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Sub-Tasks</CardTitle>
                  <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {task?.subTasks?.length || 0} Total
                  </span>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {task?.subTasks?.length > 0 ? task.subTasks.map((sub, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-3 rounded-lg border bg-accent/30 hover:bg-accent/50 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <CheckCircle2 size={16} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold">{sub.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-muted-foreground">{moment(sub.date).fromNow()}</span>
                            <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold uppercase">{sub.tag}</span>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <p className="text-sm text-muted-foreground text-center py-4">No sub-tasks yet.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Project Team</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {task?.team?.map((member, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
                          {getInitials(member.name)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold leading-none">{member.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">{member.title || "Team Member"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-primary text-primary-foreground">
                <CardContent className="p-6">
                  <h4 className="font-bold mb-2">Need Help?</h4>
                  <p className="text-xs text-primary-foreground/80 mb-4 leading-relaxed">
                    If you're having trouble with this task, you can contact the project manager or reach out to support.
                  </p>
                  <Button variant="secondary" size="sm" className="w-full" label="Get Support" />
                </CardContent>
              </Card>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="activity"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
          >
            <Activities activity={task?.activities} id={id} refresh={fetchTask} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Activities = ({ activity, id, refresh }) => {
  const [selectedType, setSelectedType] = useState(act_types[0]);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) {
      toast.error("Please enter activity content.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await API.post(`/task/activity/${id}`, {
        type: selectedType.toLowerCase(),
        activity: text,
      });

      toast.success("Activity added successfully");
      setText("");
      refresh();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to submit activity.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <History size={18} /> Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
              {activity?.map((el, index) => (
                <div key={index} className="relative flex items-start gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-background border shadow-sm shrink-0 z-10">
                    {TASKTYPEICON[el.type] || <MessageSquare size={16} />}
                  </div>
                  <div className="flex-1 pt-1 pb-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-bold">{el?.by?.name}</p>
                      <span className="text-[10px] text-muted-foreground">{moment(el?.date).fromNow()}</span>
                    </div>
                    <div className="text-xs font-medium text-primary uppercase tracking-wider mb-2">{el.type}</div>
                    <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg border border-border/50">
                      {el?.activity}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle className="text-lg">Add Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-2">
              {act_types.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={clsx(
                    "px-3 py-2 text-xs font-medium rounded-lg border transition-all text-left",
                    selectedType === type ? "bg-primary border-primary text-primary-foreground" : "bg-background border-border text-muted-foreground hover:border-primary/50"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
            
            <textarea
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What's the latest update?"
              className="w-full bg-background border border-border rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
            />
            
            <Button
              className="w-full"
              label="Submit Update"
              icon={<Send size={16} />}
              onClick={handleSubmit}
              isLoading={submitting}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TaskDetails;
