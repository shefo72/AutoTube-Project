import { Check, Shield } from "lucide-react";
import { Plan } from "@/types/adminDashboard";

export const PLAN_COLORS: Record<Plan, string> = {
  None: "#34D399",
  Pro: "#7C5CFC",
  Agency: "#FBBF24",
};

export const TOOLTIP_STYLE = {
  backgroundColor: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  fontSize: 11,
  padding: "8px 12px",
  color: "var(--foreground)",
  boxShadow: "var(--elevation-md)",
};

export const STATUS_OPTIONS = [
  { label: "Active", value: "Active", color: "#34D399", icon: Check },
  { label: "Inactive", value: "Inactive", color: "#F59E0B", icon: Shield },
] as const;

export const TABLE_HEADERS = [
  "User",
  "Plan",
  "Status",
  "Analyses",
  "Videos",
  "Revenue",
  "Actions",
];
