import { TaskCard } from "@/components/tasks/TaskCard";
import { Reveal } from "@/components/ui/Reveal";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Task } from "@/types";

interface LiveTasksProps {
  tasks: Array<{
    id: number;
    title: string;
    budget: number;
    status: Task["status"];
    optionsCount: number;
    totalSubmissions: number;
    options: Array<{ label: string; thumbnailCid: string | null }>;
    createdAt: string;
  }>;
}

export function LiveTasks({ tasks }: LiveTasksProps) {
  const displayTasks = tasks.slice(0, 3);

  if (displayTasks.length === 0) {
    return (
      <section id="live-tasks" className="py-24 bg-ink">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10">
          <Reveal>
            <div className="eyebrow tracking-[0.15em] mb-12">Live Tasks</div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Reveal key={i} delay={i * 0.1} className="h-full">
                <Card className="p-6 h-full flex flex-col">
                  <Skeleton className="aspect-[4/3] w-full rounded-md mb-4" />
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <div className="flex items-center gap-3 mb-4">
                    <Skeleton className="h-6 w-20 rounded-md" />
                    <Skeleton className="h-4 w-16 rounded-md" />
                  </div>
                  <Skeleton className="h-8 w-full mt-auto rounded-md" />
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const taskCards: Task[] = displayTasks.map((t) => ({
    id: t.id,
    title: t.title,
    description: null,
    user_id: 0,
    signature: null,
    amount: null,
    createdAt: t.createdAt,
    updatedAt: t.createdAt,
    status: t.status,
    deadline: null,
    budget: t.budget,
    fundedAmount: t.budget,
    optionsCount: t.optionsCount,
    totalSubmissions: t.totalSubmissions,
    options: t.options.map((opt, idx) => ({
      id: idx + 1,
      ipfs_cid: opt.thumbnailCid,
      ipfs_uri: null,
      gateway_url: opt.thumbnailCid ? `https://gateway.pinata.cloud/ipfs/${opt.thumbnailCid}` : null,
      image_url: null,
      option_id: idx + 1,
      task_id: t.id,
      votes: 0,
    })),
  }));

  return (
    <section id="live-tasks" className="py-24 bg-ink">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <Reveal>
          <div className="eyebrow tracking-[0.15em] mb-12">Live Tasks</div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {taskCards.map((task, i) => (
            <Reveal key={task.id} delay={i * 0.1}>
              <TaskCard
                task={task}
                mode="browse"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}