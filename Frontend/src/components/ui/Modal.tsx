"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  width?: string;
}

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  width = "max-w-lg",
}: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={`bg-card border-border relative w-full rounded-2xl border shadow-2xl ${width} max-h-[90vh] overflow-y-auto`}
          >
            {(title || subtitle) && (
              <div className="flex items-start justify-between p-6 pb-0">
                <div>
                  {title && (
                    <div className="text-foreground text-base font-bold">
                      {title}
                    </div>
                  )}
                  {subtitle && (
                    <div className="mt-0.5 text-[11px] text-(--text-dim)">
                      {subtitle}
                    </div>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="hover:text-foreground flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border-none bg-transparent text-(--text-dim) transition-colors hover:bg-(--hover-overlay)"
                >
                  <X size={15} />
                </button>
              </div>
            )}
            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function ModalField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  disabled,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <div>
      <div className="mb-1.5 text-[10px] font-bold tracking-widest text-(--text-dim) uppercase">
        {label}
      </div>
      <input
        type={type}
        placeholder={placeholder}
        defaultValue={value}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className="border-border text-foreground placeholder:text-muted-foreground focus:border-primary h-10 w-full rounded-xl border bg-(--surface-1) px-3 text-sm outline-none hover:border-(--surface-4) focus:ring-2 focus:ring-(--ring) disabled:opacity-50"
      />
    </div>
  );
}
