"use client";

import { useState, forwardRef, InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

export interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    { placeholder = "Min. 8 characters", className = "", disabled, ...props },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => {
      if (!disabled) {
        setShowPassword(!showPassword);
      }
    };

    return (
      <div className="relative flex items-center">
        <input
          {...props}
          ref={ref}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          disabled={disabled}
          className={`border-border text-foreground rounded-button focus:border-primary focus:ring-primary h-10.5 w-full border bg-(--surface-1) px-3.5 pr-10 text-sm transition-all outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        />

        <button
          type="button"
          onClick={togglePassword}
          disabled={disabled}
          className="hover:text-foreground absolute right-3 cursor-pointer p-1 text-(--text-dim) transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
