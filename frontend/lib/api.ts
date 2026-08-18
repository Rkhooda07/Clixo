import axios from "axios";
import { Task, TaskStats, TaskStatus, WorkerVoteRecord, PlatformStats } from "@/types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api",
  // A free-tier backend cold-starting takes 30-60s. Unbounded, that hangs the
  // server render of /browse with no ceiling; better to fail fast and let the
  // page say the API is unreachable.
  timeout: 15000,
});

// Attach Authorization Bearer token header from localStorage to every request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});

export const authApi = {
  getChallenge: (walletAddress: string) =>
    api.post<{ message: string; nonce: string }>("/auth/challenge", { walletAddress }).then((r) => r.data),
  verify: (walletAddress: string, signature: string, nonce: string) =>
    api.post<{
      message: string;
      token: string;
      user: { id: number; address: string };
      worker: { id: number; address: string };
    }>("/auth/verify", { walletAddress, signature, nonce }).then((r) => r.data),
};

export const taskApi = {
  getAll: (status?: TaskStatus) =>
    api.get<{ tasks: Task[] }>("/tasks", { params: { status } }).then((r) => r.data),
  getById: (id: number) =>
    api.get<Task>(`/tasks/${id}`).then((r) => r.data),
  create: (payload: {
    title: string;
    description?: string;
    budget: number;
    deadline: string;
    options: { ipfs_cid: string; gateway_url: string; ipfs_uri?: string }[];
    user_id?: number;
  }) => api.post<{ success: boolean; message: string; task: Task }>("/tasks", payload).then((r) => r.data),
  fund: (id: number, txHash: string) =>
    api.post(`/tasks/${id}/fund`, { txHash }).then((r) => r.data),
  getStats: (id: number) =>
    api
      .get<TaskStats>(`/tasks/${id}/stats`)
      .then((r) => r.data),
};

export const uploadApi = {
  uploadFile: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post<{
      ok: boolean;
      cid: string;
      ipfs_uri: string;
      gatewayUrl: string;
      file_name: string;
    }>("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then((r) => r.data);
  },
};

export const submissionApi = {
  submit: (taskId: number, optionId: number) =>
    api.post("/submissions", { taskId, optionId }).then((r) => r.data),
  getByTask: (taskId: number) =>
    api.get(`/submissions/task/${taskId}`).then((r) => r.data),
  getByWorker: (workerId: number) =>
    api.get(`/submissions/worker/${workerId}`).then((r) => r.data),
};

export const aggregationApi = {
  aggregate: (taskId: number) =>
    api.post<{
      taskId: number;
      winningOptionId: number | null;
      votes: Record<number, number>;
      totalSubmissions: number;
    }>(`/task/${taskId}/aggregate`).then((r) => r.data),
};

export const rewardApi = {
  preview: (taskId: number) =>
    api.post<{
      taskId: number;
      totalReward: string;
      winningOptionId: number;
      eligibleWorkers: number;
      rewardPerWorker: string;
      rewards: { workerId: number; reward: string }[];
    }>(`/task/${taskId}/rewards/preview`).then((r) => r.data),
  settle: (taskId: number) =>
    api.post<{
      taskId: number;
      winners: number;
      rewardPerWorker: number;
      totalReward: number;
      status: string;
    }>(`/task/${taskId}/rewards/settle`).then((r) => r.data),
};

export const payoutApi = {
  getPreview: () =>
    api.get<{
      grossAmount: number;
      gasFee: number;
      netAmount: number;
      ethToReceive: number;
    }>("/me/payout-preview").then((r) => r.data),
  withdraw: () =>
    api.post<{
      status: string;
      payoutId: number;
      grossAmount: number;
      gasFee: number;
      netAmount: number;
      walletAddress: string;
      txRef: string;
      message: string;
    }>("/me/withdraw").then((r) => r.data),
  getHistory: () =>
    api.get<{
      payouts: {
        id: number;
        amount: number;
        gasFee: number;
        netAmount: number;
        status: string;
        txRef: string;
        createdAt: string;
      }[];
    }>("/me/payouts").then((r) => r.data),
};

export const meApi = {
  getTasks: () =>
    api.get<{ tasks: Task[] }>("/me/tasks").then((r) => r.data),
  getSubmissions: () =>
    api.get<{ submissions: WorkerVoteRecord[] }>("/me/submissions").then((r) => r.data),
  getEarnings: () =>
    api.get<{ pending: number; locked: number; totalEarned: number }>("/me/earnings").then((r) => r.data),
  getFundingHistory: () =>
    api.get<{ fundings: { credits: number; source: string; txHash: string | null; createdAt: string }[] }>("/me/funding-history").then((r) => r.data),
};

// Platform-wide stats derived from the public task list.
// ponytail: client-side aggregation; move to a backend /stats endpoint if the task list grows.
export const statsApi = {
  get: async (): Promise<PlatformStats> => {
    const data = await taskApi.getAll();
    const completedTasks = data.tasks.filter(
      (t) => t.status === "COMPLETED" || t.status === "CLOSED" || t.status === "SETTLED"
    );
    const totalEth = completedTasks.reduce((acc, t) => acc + t.budget * 0.001, 0);

    // Get recent tasks (last 3 open/active tasks for home page showcase)
    const recentTasks = data.tasks
      .filter((t) => t.status === "ACTIVE" || t.status === "CREATED")
      .slice(0, 3)
      .map((t) => ({
        id: t.id,
        title: t.title,
        budget: t.budget,
        status: t.status,
        optionsCount: t.optionsCount ?? t.options?.length ?? 0,
        totalSubmissions: t.totalSubmissions ?? 0,
        options: t.options?.map((opt) => ({
          label: opt.ipfs_cid ? `Option ${opt.option_id ?? "?"}` : `Option ${opt.option_id ?? "?"}`,
          thumbnailCid: opt.ipfs_cid,
        })) ?? [],
        createdAt: t.createdAt,
      }));

    return {
      totalTasks: data.tasks.length,
      totalEthDistributed: totalEth.toFixed(3),
      totalOpinions: data.tasks.reduce((acc, t) => acc + (t.totalSubmissions ?? 0), 0),
      recentTasks,
    };
  },
};
