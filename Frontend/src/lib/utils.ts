import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAvatarName(name: string) {
  const trimmedName = name.trim();
  if (!trimmedName) return "AT";

  const parts = trimmedName.split(/\s+/);
  if (parts.length > 1) {
    const firstInitial = parts[0].charAt(0);
    const secondInitial = parts[1].charAt(0);
    return `${firstInitial}${secondInitial}`.toUpperCase();
  }
  return trimmedName.slice(0, 2).toUpperCase();
}

export const getValidImageUrl = (url?: string) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${process.env.NEXT_PUBLIC_AUTOTUBE_API_URL?.replace("/api", "")}${url}`;
};
