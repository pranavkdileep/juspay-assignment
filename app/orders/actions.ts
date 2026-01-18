"use server";

import { cache } from "react";

export type OrderStatus = "In Progress" | "Complete" | "Pending" | "Approved" | "Rejected";

export type Order = {
  id: string;
  user: string;
  project: string;
  address: string;
  status: OrderStatus;
  avatarSrc: string;
  createdAt: string; // ISO date
  dateLabel: string;
};

export type OrdersQuery = {
  q?: string;
  status?: OrderStatus | "all";
  sort?: "date" | "user" | "project" | "status";
  dir?: "asc" | "desc";
  page?: number;
  pageSize?: number;
};

export type OrdersResult = {
  items: Order[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  query: Required<Pick<OrdersQuery, "q" | "status" | "sort" | "dir" | "page" | "pageSize">>;
};

const STATUSES: OrderStatus[] = [
  "In Progress",
  "Complete",
  "Pending",
  "Approved",
  "Rejected",
];

const USERS = [
  "Natali Craig",
  "Kate Morrison",
  "Drew Cano",
  "Orlando Diggs",
  "Andi Lane",
  "Koray Okumus",
  "Alicia Keys",
  "Robert Fox",
  "Savannah Nguyen",
  "Jerome Bell",
];

const PROJECTS = [
  "Landing Page",
  "CRM Admin pages",
  "Client Project",
  "Admin Dashboard",
  "App Landing Page",
];

const ADDRESSES = [
  "Meadow Lane Oakland",
  "Larry San Francisco",
  "Bagwell Avenue Ocala",
  "Washburn Baton Rouge",
  "Nest Lane Olivette",
];

const AVATARS = [
  "/avatar-1.svg",
  "/avatar-2.svg",
  "/avatar-3.svg",
  "/avatar-4.svg",
  "/avatar-5.svg",
  "/avatar-6.svg",
  "/avatar-7.svg",
  "/avatar-8.svg",
  "/avatar-9.svg",
  "/avatar-10.svg",
  "/avatar-11.svg",
];

function pad2(value: number) {
  return String(value).padStart(2, "0");
}

function clampInt(value: unknown, fallback: number, min: number, max: number) {
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.min(max, Math.max(min, Math.trunc(num)));
}

function normalizeQuery(query?: OrdersQuery): OrdersResult["query"] {
  const q = (query?.q ?? "").toString();
  const status = (query?.status ?? "all") as OrdersResult["query"]["status"];
  const sort = (query?.sort ?? "date") as OrdersResult["query"]["sort"];
  const dir = (query?.dir ?? "desc") as OrdersResult["query"]["dir"];
  const pageSize = clampInt(query?.pageSize, 10, 5, 50);
  const page = clampInt(query?.page, 1, 1, 9999);

  return {
    q,
    status: status === "all" || STATUSES.includes(status as OrderStatus) ? status : "all",
    sort: ["date", "user", "project", "status"].includes(sort) ? sort : "date",
    dir: dir === "asc" || dir === "desc" ? dir : "desc",
    page,
    pageSize,
  };
}

function seededRng(seed: number) {
  // LCG constants
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
}

function formatIsoDate(date: Date) {
  return date.toISOString();
}

function formatDateLabel(date: Date, now: Date, rand: () => number) {
  const ms = now.getTime() - date.getTime();
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  if (days <= 0) {
    const r = rand();
    if (r < 0.34) return "Just now";
    if (r < 0.67) return "A minute ago";
    return "1 hour ago";
  }
  if (days === 1) return "Yesterday";
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const m = monthNames[date.getMonth()] ?? "Jan";
  return `${m} ${date.getDate()}, ${date.getFullYear()}`;
}

function generateOrders(count: number): Order[] {
  const rand = seededRng(42);
  const now = new Date();
  const orders: Order[] = [];

  for (let i = 0; i < count; i += 1) {
    const user = USERS[Math.floor(rand() * USERS.length)]!;
    const status = STATUSES[Math.floor(rand() * STATUSES.length)]!;
    const avatarSrc = AVATARS[Math.floor(rand() * AVATARS.length)]!;
    const project = PROJECTS[Math.floor(rand() * PROJECTS.length)]!;
    const address = ADDRESSES[Math.floor(rand() * ADDRESSES.length)]!;

    // Spread over last 120 days
    const daysAgo = Math.floor(rand() * 120);
    const createdAt = new Date(now);
    createdAt.setDate(now.getDate() - daysAgo);

    // Keep screenshot-like format but guarantee uniqueness across the dataset.
    // Example: #CM9801, #CM9802, ...
    const id = `#CM${9801 + i}`;
    const dateLabel = formatDateLabel(createdAt, now, rand);

    orders.push({
      id,
      user,
      project,
      address,
      status,
      avatarSrc,
      createdAt: formatIsoDate(createdAt),
      dateLabel,
    });
  }

  return orders;
}

const getAllOrders = cache(() => generateOrders(137));

export async function getOrders(rawQuery?: OrdersQuery): Promise<OrdersResult> {
  const query = normalizeQuery(rawQuery);

  const qLower = query.q.trim().toLowerCase();

  let filtered = getAllOrders();

  if (query.status !== "all") {
    filtered = filtered.filter((o) => o.status === query.status);
  }

  if (qLower) {
    filtered = filtered.filter((o) => {
      return (
        o.id.toLowerCase().includes(qLower) ||
        o.user.toLowerCase().includes(qLower) ||
        o.project.toLowerCase().includes(qLower) ||
        o.address.toLowerCase().includes(qLower) ||
        o.status.toLowerCase().includes(qLower)
      );
    });
  }

  const dirMul = query.dir === "asc" ? 1 : -1;

  filtered = [...filtered].sort((a, b) => {
    switch (query.sort) {
      case "user":
        return a.user.localeCompare(b.user) * dirMul;
      case "project":
        return a.project.localeCompare(b.project) * dirMul;
      case "status":
        return a.status.localeCompare(b.status) * dirMul;
      case "date":
      default:
        return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * dirMul;
    }
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / query.pageSize));
  const page = Math.min(query.page, totalPages);

  const start = (page - 1) * query.pageSize;
  const end = start + query.pageSize;
  const items = filtered.slice(start, end);

  return {
    items,
    total,
    page,
    pageSize: query.pageSize,
    totalPages,
    query: {
      ...query,
      page,
    },
  };
}

export async function getOrderStatuses(): Promise<OrderStatus[]> {
  return STATUSES;
}
