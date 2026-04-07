"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getTask } from "@/lib/api";

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

type TaskOption = {
  id: number;
  image_url: string | null;
  gateway_url?: string | null;
};

export default function TaskPage() {
  const params = useParams();
  const taskId = Number(params.id);

  const [task, setTask] = useState<Task | null>(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const data = await getTask(taskId);
        setTask(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTask();
  }, [taskId]);

  const handleSubmit = async (optionId: number) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please connect wallet first");
        return;
      }

      const res = await fetch(`${BASE}/submissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          taskId,
          optionId,
        }),
      });

      const data = await res.json();

      console.log("Submission response:", data);

      if (!res.ok) {
        alert(data.message || "Submission failed");
        return;
      }

      alert("Submitted successfully!");
    } catch (err) {
      console.error("Submission error:", err);
      alert("Something went wrong");
    }
  };

  if (!task) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-xl font-bold">{task.title}</h2>

      <p>Budget: {task.budget}</p>
      <p>Status: {task.status}</p>

      <div className="mt-4">
        <h3 className="font-semibold">Options:</h3>

        <div className="flex gap-4 mt-2">
          {task.options.map((opt: TaskOption) => (
            opt.image_url ? (
              <img
                key={opt.id}
                src={opt.image_url}
                alt="option"
                className="w-40 h-40 object-cover border cursor-pointer"
                onClick={() => handleSubmit(opt.id)}
              />
            ) : null
          ))}
        </div>
      </div>
    </div>
  );
}