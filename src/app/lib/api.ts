const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export interface AuthUser {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: "client" | "worker" | "admin";
}

export interface TaskDto {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  address: string;
  scheduled_date: string;
  time_slot: string;
  duration: string;
  budget: string;
  status: string;
  bids_count: number;
  created_at: string;
  bids?: BidDto[];
}

export interface BidDto {
  id: number;
  task: number;
  worker: number;
  worker_name: string;
  amount: string;
  message: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
}

export interface PaymentDto {
  id: number;
  task: number;
  client: number;
  worker: number;
  task_amount: string;
  platform_fee: string;
  total_amount: string;
  method: "card" | "paypal" | "bank";
  status: "pending" | "completed" | "failed";
  created_at: string;
}

interface ApiErrorPayload {
  detail?: string;
  [key: string]: unknown;
}

async function request<T>(path: string, method: HttpMethod, body?: unknown, token?: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as ApiErrorPayload;
    throw new Error(payload.detail || "Request failed");
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json().catch(() => ({})) as Promise<T>;
}

export async function signUp(payload: {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: "client" | "worker" | "admin";
  preferred_language: string;
  tin_number?: string;
  password: string;
  confirm_password: string;
}) {
  return request<AuthUser>("/auth/signup/", "POST", payload);
}

export async function login(payload: { username: string; password: string }) {
  return request<{ access: string; refresh: string; user: AuthUser }>("/auth/login/", "POST", payload);
}

export async function me(token: string) {
  return request<AuthUser>("/auth/me/", "GET", undefined, token);
}

export async function getTasks(token: string) {
  return request<{ results: TaskDto[] }>("/tasks/", "GET", undefined, token);
}

export async function createTask(
  token: string,
  payload: {
    title: string;
    description: string;
    category: string;
    location: string;
    address: string;
    scheduled_date: string;
    time_slot: string;
    duration: string;
    budget: number;
  },
) {
  return request<TaskDto>("/tasks/", "POST", payload, token);
}

export async function createBid(token: string, payload: { task: number; amount: number; message: string }) {
  return request("/bids/", "POST", payload, token);
}

export async function getBids(token: string) {
  return request<{ results: BidDto[] }>("/bids/", "GET", undefined, token);
}

export async function assignTask(token: string, taskId: number, bidId: number) {
  return request<TaskDto>(`/tasks/${taskId}/assign/`, "POST", { bid_id: bidId }, token);
}

export async function completeTask(token: string, taskId: number) {
  return request<TaskDto>(`/tasks/${taskId}/complete/`, "POST", {}, token);
}

export async function getPayments(token: string) {
  return request<{ results: PaymentDto[] }>("/payments/", "GET", undefined, token);
}

export async function createPayment(
  token: string,
  payload: { task: number; worker: number; task_amount: number; method: "card" | "paypal" | "bank" },
) {
  return request<PaymentDto>("/payments/", "POST", payload, token);
}

export async function completePayment(token: string, paymentId: number) {
  return request<PaymentDto>(`/payments/${paymentId}/complete/`, "POST", {}, token);
}

export async function updateTask(token: string, taskId: number, payload: Partial<TaskDto>) {
  return request<TaskDto>(`/tasks/${taskId}/`, "PATCH", payload, token);
}

export async function deleteTask(token: string, taskId: number) {
  return request(`/tasks/${taskId}/`, "DELETE", undefined, token);
}

export async function getConversations(token: string) {
  return request<{ results: any[] }>("/conversations/", "GET", undefined, token);
}

export async function createConversation(token: string, payload: { task: number, participants: number[] }) {
  return request<any>("/conversations/", "POST", payload, token);
}

export async function getMessages(token: string, conversationId?: number) {
  return request<{ results: any[] }>(`/messages/${conversationId ? `?conversation=${conversationId}` : ''}`, "GET", undefined, token);
}

export async function sendMessage(token: string, payload: { conversation: number, content: string }) {
  return request<any>("/messages/", "POST", payload, token);
}
