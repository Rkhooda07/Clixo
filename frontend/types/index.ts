export type TaskStatus = "CREATED" | "ACTIVE" | "COMPLETED" | "CLOSED" | "SETTLED";

export interface Thumbnail {
  id: number;
  ipfs_cid: string | null;
  ipfs_uri: string | null;
  gateway_url: string | null;
  image_url: string | null;
  option_id: number | null;
  task_id: number;
  votes?: number; // UI derived/aggregated field
}

export interface Task {
  id: number;
  title: string;
  description?: string | null;
  user_id: number;
  signature: string | null;
  amount: string | null;
  createdAt: string;
  updatedAt: string;
  status: TaskStatus;
  deadline: string | null;
  budget: number;
  fundedAmount: number;
  options?: Thumbnail[]; // List of options/thumbnails
  optionsCount?: number; // API list summary
  totalSubmissions?: number; // Submissions count
}

export interface WorkerVoteRecord {
  taskId: number;
  optionId: number;
  taskStatus: TaskStatus;
  submittedAt: string;
  taskTitle?: string;
  taskBudget?: number;
  optionPickedImage?: string;
  earnedEth?: string; // UI derived/aggregated value
}

export interface TaskStats {
  taskId: number;
  status: TaskStatus;
  totalSubmissions: number;
  options: { optionId: number; votes: number }[];
  timeSeries: { date: string; votes: number }[];
  winningOption: number | null;
  rewardPerWorker: number;
}

export interface RecentTaskSummary {
  id: number;
  title: string;
  budget: number;
  status: TaskStatus;
  optionsCount: number;
  totalSubmissions: number;
  options: Array<{ label: string; thumbnailCid: string | null }>;
  createdAt: string;
}

export interface PlatformStats {
  totalTasks: number;
  totalEthDistributed: string;
  totalOpinions: number;
  recentTasks: RecentTaskSummary[];
}
