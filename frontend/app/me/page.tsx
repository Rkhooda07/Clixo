"use client"

import { useEffect, useState } from "react";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

type Task = {
  id: number;
  title: string;
  status: string;
  budget: number;
  fundedAmount: number;
  deadline: string | null;
  options: {
    id: number;
    image_url: string;
  }[];
};

type Submission = {
  optionId: number;
  taskId: number;
  submittedAt: string;
  taskStatus: string;
};

export default function DashboardPage() {
  const [ tasks, setTasks ] = useState<Task[]>([]);
  const [ submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      try {
        // Get my tasks
        const tasksRes = await fetch(`${BASE}/me/tasks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const tasksData = await tasksRes.json();
        setTasks(tasksData?.tasks || []);

        // Get my submissions
        const subRes = await fetch(`${BASE}/me/submissions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const subData = await subRes.json();
        setSubmissions(subData?.submissions || []);

        console.log("TASKS DATA:", tasksData);
        console.log("SUBMISSIONS DATA:", subData);
      } catch (err) {
        console.error(err);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* My Tasks */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">My Tasks</h2>
        {Array.isArray(tasks) && tasks.map((task) => (
          <div key={task.id} className="border p-3 mt-2">
            {task.title}
          </div>
        ))}
      </div>

      {/* My Submissions */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">My Submissions</h2>

        {submissions.map((sub, index) => (
          <div key={`${sub.taskId}-${sub.optionId}-${index}`} className="border p-3 mt-2">
            Task ID: {sub.taskId} | Option: {sub.optionId}
          </div>
        ))}
      </div>
    </div>
  );
}