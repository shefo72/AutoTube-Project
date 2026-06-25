"use client";

import { Modal } from "@/components/ui/Modal";
import { UserDetails } from "@/types/adminDashboard";
import { PLAN_COLORS, TOOLTIP_STYLE } from "@/constants/adminDashboard";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  user: UserDetails | null;
  onChangeStatusClick: (user: UserDetails) => void;
}

export function UserDetailsModal({
  isOpen,
  onClose,
  loading,
  user,
  onChangeStatusClick,
}: UserDetailsModalProps) {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={user?.fullName || user?.name}
      subtitle={user?.email}
      width="max-w-2xl"
    >
      {loading ? (
        <div className="text-muted-foreground p-8 text-center text-sm">
          Loading details...
        </div>
      ) : user ? (
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {[
              { l: "Plan", v: user.plan, c: PLAN_COLORS[user.plan] },
              {
                l: "Status",
                v: user.status,
                c: user.status === "Active" ? "#34D399" : "#EF4444",
              },
              {
                l: "Joined",
                v: user.joined
                  ? new Date(user.joined).toLocaleDateString()
                  : "N/A",
                c: "#7C5CFC",
              },
              { l: "Revenue", v: user.revenue, c: "#FBBF24" },
            ].map((s) => (
              <div
                key={s.l}
                className="border-border rounded-xl border bg-(--surface-1) p-3"
              >
                <div className="mb-1 text-[9px] font-bold tracking-widest text-(--text-dim) uppercase">
                  {s.l}
                </div>
                <div className="text-sm font-bold" style={{ color: s.c }}>
                  {s.v}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="border-border rounded-xl border bg-(--surface-1) p-3">
              <div className="mb-1 text-[9px] font-bold tracking-widest text-(--text-dim) uppercase">
                Total Analyses
              </div>
              <div className="text-foreground font-mono text-lg font-extrabold">
                {user.totalAnalyses || 0}
              </div>
            </div>
            <div className="border-border rounded-xl border bg-(--surface-1) p-3">
              <div className="mb-1 text-[9px] font-bold tracking-widest text-(--text-dim) uppercase">
                Videos Created
              </div>
              <div className="text-foreground font-mono text-lg font-extrabold">
                {user.videosCreated || 0}
              </div>
            </div>
          </div>

          {user.performance && user.performance.length > 0 && (
            <div className="border-border rounded-xl border bg-(--surface-1) p-4">
              <div className="text-foreground mb-3 text-[11px] font-bold">
                Performance (Views)
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={user.performance}>
                  <defs>
                    <linearGradient id="adm-g" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#7C5CFC"
                        stopOpacity={0.15}
                      />
                      <stop offset="95%" stopColor="#7C5CFC" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 10, fill: "var(--text-dim)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "var(--text-dim)" }}
                    axisLine={false}
                    tickLine={false}
                    width={30}
                  />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="#7C5CFC"
                    fill="url(#adm-g)"
                    strokeWidth={2}
                    dot={{
                      r: 3,
                      fill: "#7C5CFC",
                      stroke: "var(--card)",
                      strokeWidth: 2,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => onChangeStatusClick(user)}
              className="h-9 flex-1 cursor-pointer rounded-xl border-none text-[11px] font-bold text-white"
              style={{
                background: "var(--gradient-aurora)",
                backgroundSize: "200% 200%",
                animation: "at-gradient-shift 4s ease infinite",
              }}
            >
              Change Status
            </button>
            <button
              onClick={onClose}
              className="border-border hover:text-foreground h-9 flex-1 cursor-pointer rounded-xl border bg-transparent text-[11px] font-medium text-(--text-dim) transition-all"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
