"use client"

import { useState, useEffect } from "react";
import { getTasks } from "@/lib/api";
import { useRouter } from "next/navigation";

type Task = {
  id: number;
  title: string;
  status: string;
  budget: number;
  fundedAmount: number;
  deadline: string | null;
  optionsCount: number;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks();
        setTasks(data.tasks);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">All tasks</h2>

      <div>
        {tasks.map((task) => (
          <div 
            key={task.id}
            onClick={() => router.push(`/task/${task.id}`)}
            className="border p-4 rounded hover:bg-gray-100 cursor-pointer select-none"
          >
            <h3>{task.title}</h3>
            <p>Budget: {task.budget}</p>
            <p>Status: {task.status}</p>
          </div>
        ))}
      </div>
    </div>
  )
}