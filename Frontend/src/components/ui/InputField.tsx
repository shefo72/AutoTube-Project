"use client";

import React, { forwardRef } from "react";

export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, type = "text", className = "", ...props }, ref) => {
    return (
      <div>
        <div className="mb-1.5 text-[10px] font-bold tracking-widest text-(--text-dim) uppercase">
          {label}
        </div>
        <input
          ref={ref}
          type={type}
          className={`border-border text-foreground placeholder:text-muted-foreground focus:border-primary h-10 w-full rounded-xl border bg-(--surface-1) px-3 text-sm outline-none hover:border-(--surface-4) focus:ring-2 focus:ring-(--ring) disabled:opacity-50 ${className}`}
          {...props}
        />
      </div>
    );
  }
);

InputField.displayName = "InputField";
