"use client";

import { useState, useRef } from "react";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

interface ChangePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  avatarInitials: string;
  onUpload: (file: File) => Promise<string | null>;
  isUploading: boolean;
}

export function ChangePhotoModal({
  isOpen,
  onClose,
  avatarInitials,
  onUpload,
  isUploading,
}: ChangePhotoModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const MAX_SIZE_MB = 5;

  function handleFileChange(file: File) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Only JPG, PNG, and WEBP files are allowed.");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`File must be smaller than ${MAX_SIZE_MB}MB.`);
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange(file);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFileChange(file);
  }

  async function handleUpload() {
    if (!selectedFile) return;
    const url = await onUpload(selectedFile);
    if (url) {
      toast.success("Profile photo updated!");
      handleClose();
    } else {
      toast.error("Failed to upload photo. Please try again.");
    }
  }

  function handleClose() {
    setSelectedFile(null);
    setPreviewUrl(null);
    onClose();
  }

  return (
    <Modal open={isOpen} onClose={handleClose} title="Change Profile Photo">
      <div className="flex flex-col items-center gap-4 pt-2">
        {previewUrl && (
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br from-[#7C5CFC] to-[#A855F7] shadow-[0_0_0_4px_rgba(124,92,252,0.15)]">
            <Image
              src={previewUrl}
              alt={avatarInitials}
              width={64}
              height={64}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div
          className="border-border hover:border-primary/40 hover:bg-primary/5 w-full cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition-all"
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            className="hidden"
            onChange={handleInputChange}
          />
          <Upload size={20} className="mx-auto mb-2 text-(--text-dim)" />
          <div className="text-foreground text-[12px] font-medium">
            {selectedFile
              ? selectedFile.name
              : "Click to upload or drag and drop"}
          </div>
          <div className="mt-1 text-[10px] text-(--text-dim)">
            PNG, JPG, WEBP up to 5MB
          </div>
        </div>

        <div className="flex w-full gap-2">
          <button
            onClick={handleClose}
            disabled={isUploading}
            className="border-border hover:text-foreground h-10 flex-1 cursor-pointer rounded-xl border bg-transparent text-sm font-medium text-(--text-dim) transition-all disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <Button
            variant="primary"
            size="md"
            className="flex-1"
            disabled={!selectedFile || isUploading}
            onClick={handleUpload}
            iconLeft={
              isUploading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : undefined
            }
          >
            {isUploading ? "Uploading…" : "Upload"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
