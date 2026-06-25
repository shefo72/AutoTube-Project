"use client";

import { motion } from "framer-motion";
import { Search, Eye, Edit3, Trash2 } from "lucide-react";
import { UserData } from "@/types/adminDashboard";
import { PLAN_COLORS, TABLE_HEADERS } from "@/constants/adminDashboard";
import { fadeIn } from "@/lib/animations";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const D = motion.create("div");

interface UserManagementTableProps {
  users: UserData[];
  search: string;
  onSearchChange: (val: string) => void;
  onViewUser: (id: number) => void;
  onChangeStatus: (user: UserData) => void;
  onDeleteUserClick: (user: UserData) => void;
}

export function UserManagementTable({
  users,
  search,
  onSearchChange,
  onViewUser,
  onChangeStatus,
  onDeleteUserClick,
}: UserManagementTableProps) {
  const filteredUsers = users.filter((u) => {
    const query = search.toLowerCase().trim();
    return (
      (u.name || "").toLowerCase().includes(query) ||
      (u.email || "").toLowerCase().includes(query)
    );
  });

  const getColumnResponsiveClass = (header: string) => {
    const h = header.toLowerCase();
    if (h === "user" || h === "actions") return "";
    if (h === "status") return "hidden sm:table-cell";
    if (h === "plan") return "hidden md:table-cell";
    if (h === "analyses" || h === "videos" || h === "revenue")
      return "hidden lg:table-cell";
    return "";
  };

  return (
    <D {...fadeIn(0.25)}>
      <div className="bg-card border-border overflow-hidden rounded-2xl border">
        <div className="border-border flex flex-col items-start justify-between gap-4 border-b px-5 py-4 sm:flex-row sm:items-center">
          <div className="text-foreground text-sm font-bold">
            User Management
          </div>
          <div className="relative w-full sm:w-auto">
            <Search
              size={13}
              className="absolute top-1/2 left-3 -translate-y-1/2 text-(--text-dim)"
            />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search users..."
              className="border-border text-foreground placeholder:text-muted-foreground focus:border-primary h-9 w-full rounded-xl border bg-(--surface-1) pr-3 pl-9 text-sm outline-none focus:ring-2 focus:ring-(--ring) sm:w-64"
            />
          </div>
        </div>

        <div className="w-full overflow-x-scroll">
          <table className="w-full">
            <thead>
              <tr className="border-border border-b bg-(--surface-1)">
                {TABLE_HEADERS.map((h) => (
                  <th
                    key={h}
                    className={cn(
                      "px-5 py-3 text-left text-[10px] font-bold tracking-widest whitespace-nowrap text-(--text-dim) uppercase",
                      getColumnResponsiveClass(h)
                    )}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={TABLE_HEADERS.length}
                    className="py-12 text-center text-sm text-(--text-dim)"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u, i) => (
                  <tr
                    key={`${u.id} - ${u.plan} - ${i}`}
                    className="border-border cursor-pointer border-b transition-colors last:border-0 hover:bg-(--hover-overlay)"
                    onClick={() => onViewUser(u.id)}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-[#7C5CFC] to-[#A855F7]">
                          <span className="text-[10px] font-bold text-white">
                            {(u.name || "")
                              .split(" ")
                              .filter(Boolean)
                              .map((n: string) => n[0]?.toUpperCase())
                              .join("")}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-foreground truncate text-[12px] font-medium">
                            {u.name}
                          </div>
                          <div className="truncate text-[10px] text-(--text-dim)">
                            {u.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="hidden px-5 py-3 md:table-cell">
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-bold whitespace-nowrap"
                        style={{
                          background: `${PLAN_COLORS[u.plan]}15`,
                          border: `1px solid ${PLAN_COLORS[u.plan]}30`,
                          color: PLAN_COLORS[u.plan],
                        }}
                      >
                        {u.plan}
                      </span>
                    </td>

                    <td className="hidden px-5 py-3 sm:table-cell">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold whitespace-nowrap ${
                          u.status.toLowerCase() === "active"
                            ? "border border-[rgba(52,211,153,0.2)] bg-[rgba(52,211,153,0.1)] text-[#34D399]"
                            : "border border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.1)] text-[#EF4444]"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>

                    <td className="text-foreground hidden px-5 py-3 font-mono text-[12px] lg:table-cell">
                      {u.analyses}
                    </td>

                    <td className="text-foreground hidden px-5 py-3 font-mono text-[12px] lg:table-cell">
                      {u.videos}
                    </td>

                    <td className="text-foreground hidden px-5 py-3 font-mono text-[12px] font-bold lg:table-cell">
                      {u.revenue}
                    </td>

                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1 sm:justify-start">
                        <Tooltip content="View details">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewUser(u.id);
                            }}
                            className="border-border hover:text-foreground flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border bg-transparent text-(--text-dim) transition-all hover:bg-(--hover-overlay)"
                          >
                            <Eye size={12} />
                          </button>
                        </Tooltip>
                        <Tooltip content="Edit status">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onChangeStatus(u);
                            }}
                            className="border-border hover:text-foreground flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border bg-transparent text-(--text-dim) transition-all hover:bg-(--hover-overlay)"
                          >
                            <Edit3 size={12} />
                          </button>
                        </Tooltip>
                        <Tooltip content="Delete user">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteUserClick(u);
                            }}
                            className="border-border/60 flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border bg-transparent text-(--text-dim) transition-all hover:border-red-500/30 hover:bg-red-500/10 hover:text-[#EF4444]"
                          >
                            <Trash2 size={12} />
                          </button>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </D>
  );
}
