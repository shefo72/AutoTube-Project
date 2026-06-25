"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  disabled?: boolean;
  placeholder?: string;
}

export function CustomSelect({
  value,
  onChange,
  options,
  disabled = false,
  placeholder = "Select an option...",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`border-border text-foreground focus:border-primary flex h-10 w-full items-center justify-between rounded-xl border bg-(--surface-1) px-3 text-sm transition-all outline-none hover:border-(--surface-4) focus:ring-2 focus:ring-(--ring) focus:ring-offset-2 focus:ring-offset-(--background) disabled:cursor-not-allowed disabled:opacity-50 ${
          isOpen
            ? "border-(--surface-4) ring-2 ring-(--ring) ring-offset-2 ring-offset-(--background)"
            : ""
        }`}
      >
        <span className="truncate font-medium">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`text-muted-foreground transition-transform duration-200 ease-out ${
            isOpen ? "text-foreground rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -4, scaleY: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{ transformOrigin: "top" }}
            className="border-border shadow-elevation-md absolute right-0 left-0 z-50 mt-1.5 overflow-hidden rounded-xl border bg-(--card)/95 backdrop-blur-xl"
          >
            <div
              className="scrollbar-thin max-h-60 overflow-y-auto p-1.5"
              role="listbox"
            >
              {options.map((option) => {
                const isSelected = value === option.value;
                return (
                  <button
                    key={option.value}
                    role="option"
                    aria-selected={isSelected}
                    onClick={(e) => {
                      e.preventDefault();
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`group flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-all ${
                      isSelected
                        ? "text-primary bg-primary/10 font-bold"
                        : "text-foreground hover:bg-(--surface-2)"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {option.icon && (
                        <span
                          className={`${isSelected ? "text-primary" : "text-muted-foreground group-hover:text-foreground"} transition-colors`}
                        >
                          {option.icon}
                        </span>
                      )}
                      <span>{option.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
