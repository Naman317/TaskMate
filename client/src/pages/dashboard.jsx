import React, { useEffect, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  ListTodo,
  Users as UsersIcon,
  Plus,
  ArrowUpRight,
  MoreVertical,
  AlertCircle,
} from "lucide-react";

import moment from "moment";
import clsx from "clsx";
import { motion } from "framer-motion";

import API from "../assets/axios";
import { PRIOTITYSTYELS, TASK_TYPE, getInitials, BGS } from "../utils";
import UserInfo from "../components/UserInfo";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Skeleton from "../components/ui/Skeleton";
import Chart from "../components/Chart";
import useToast from "../hooks/useToast";

import AddTask from "../components/task/AddTask";

const Dashboard = () => {
  const toast = useToast();
  const [summary, setSummary] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await API.get("task/dashboard", { withCredentials: true });
      setSummary(res.data);
    } catch (err) {
      console.error("Dashboard fetch failed:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const stats = summary ? [
    {
      label: "Total Tasks",
      total: summary.totalTasks || 0,
      icon: <ListTodo size={20} />,
      color: "text-blue-600",
      bg: "bg-blue-100",
      trend: "+12%",
      trendUp: true,
    },
    {
      label: "Completed",
      total: summary.tasks["completed"] || 0,
      icon: <CheckCircle2 size={20} />,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
      trend: "+5%",
      trendUp: true,
    },
    {
      label: "In Progress",
      total: summary.tasks["in progress"] || 0,
      icon: <Clock size={20} />,
      color: "text-amber-600",
      bg: "bg-amber-100",
      trend: "-2%",
      trendUp: false,
    },
    {
      label: "To Do",
      total: summary.tasks["todo"] || 0,
      icon: <ListTodo size={20} />,
      color: "text-rose-600",
      bg: "bg-rose-100",
      trend: "+8%",
      trendUp: true,
    },
    {
      label: "Overdue",
      total: summary.overdueTasks || 0,
      icon: <AlertCircle size={20} />,
      color: "text-red-700",
      bg: "bg-red-100",
      trend: "Critical",
      trendUp: false,
    },
  ] : [];


  if (loading) {
    return (
      <div className="space-y-8 animate-in">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">

          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}

        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-[400px] lg:col-span-2" />
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Failed to load dashboard</h2>
        <p className="text-muted-foreground mt-2 max-w-md">
          We couldn't retrieve your dashboard data. This might be due to an expired session or a connection issue.
        </p>
        <Button 
          label="Try Again" 
          variant="outline" 
          className="mt-6" 
          onClick={() => window.location.reload()} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your tasks.</p>
        </div>
        <Button label="New Task" icon={<Plus size={18} />} onClick={() => setOpen(true)} />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">

        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="hover:shadow-premium transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={clsx("p-2 rounded-lg", stat.bg, stat.color)}>
                    {stat.icon}
                  </div>
                  <div className={clsx(
                    "flex items-center text-xs font-medium px-2 py-1 rounded-full",
                    stat.trendUp ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                  )}>
                    {stat.trendUp ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
                    {stat.trend}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <h3 className="text-3xl font-bold mt-1">{stat.total}</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <div className="lg:col-span-2">
          <Chart data={summary?.graphData} />
        </div>


        {/* Team Members */}
        <Card className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold">Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {summary?.users?.slice(0, 5).map((user, index) => (
                <div key={user._id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
                      {getInitials(user?.name)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold leading-none">{user.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{user.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-6" 
              label="Invite Member" 
              icon={<Plus size={16} />} 
              onClick={() => toast.info("Coming Soon", "The team invitation feature is currently under development.")}
            />

          </CardContent>
        </Card>
      </div>

      {/* Recent Tasks */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-bold">Recent Tasks</CardTitle>
          <Button variant="ghost" size="sm" label="View All" />
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b">
                  <th className="pb-3 px-2">Task</th>
                  <th className="pb-3 px-2">Priority</th>
                  <th className="pb-3 px-2">Team</th>
                  <th className="pb-3 px-2 hidden md:table-cell">Due</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {summary?.last10Task?.map((task, idx) => (
                  <tr key={idx} className="group hover:bg-accent/50 transition-colors">
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <div className={clsx("w-2 h-2 rounded-full shrink-0", 
                          task.stage === "todo" ? "bg-rose-500" : 
                          task.stage === "in progress" ? "bg-amber-500" : "bg-emerald-500"
                        )} />
                        <span className="font-medium text-sm line-clamp-1">{task.title}</span>
                        {new Date(task.date) < new Date() && task.stage !== "completed" && (
                          <span className="text-[9px] font-bold text-red-600 bg-red-100 px-1 py-0.5 rounded uppercase">Overdue</span>
                        )}
                      </div>

                    </td>
                    <td className="py-4 px-2">
                      <span className={clsx(
                        "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                        task.priority === "high" ? "bg-rose-100 text-rose-700" :
                        task.priority === "medium" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                      )}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex -space-x-2 overflow-hidden">
                        {task.team?.slice(0, 3).map((user, index) => (
                          <div key={index} title={user.name}>
                            <UserInfo user={user} />
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-2 hidden md:table-cell">
                      <span className="text-xs text-muted-foreground">
                        {moment(task?.date).format("MMM D, YYYY")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <AddTask
        open={open}
        setOpen={setOpen}
        refresh={fetchDashboard}
      />
    </div>
        </CardContent>
      </Card>

      <AddTask
        open={open}
        setOpen={setOpen}
        refresh={fetchDashboard}
      />
    </div>
  );
};


export default Dashboard;
