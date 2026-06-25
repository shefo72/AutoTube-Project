"use client";
import Group from "./Group";

interface LogoMarkProps {
  size?: number;
}

export function LogoMark({ size = 30 }: LogoMarkProps) {
  return (
    <div
      className="flex items-center justify-center transition-colors duration-300"
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        position: "relative",
      }}
    >
      <Group />
    </div>
  );
}
