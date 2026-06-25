"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Download, Image as ImageIcon, ImagePlus, Loader2  } from "lucide-react";
import Image from "next/image";

import type { UIThumbnail } from "@/types/thumbnail";
import { useThumbnailImage } from "@/hooks/useThumbnailImage";

interface ThumbnailResultsProps {
  results: UIThumbnail[];
  activeStyle: string;
  isGenerating: boolean;
  isDownloading: boolean;
}



export function ThumbnailResults({
  results,
  activeStyle,
  isGenerating,
  isDownloading,
}: ThumbnailResultsProps) {
  const showEmpty = !isGenerating && results.length === 0;

  if (showEmpty) {
    return (
      <div className="pt-2">
        <EmptyState />
      </div>
    );
  }

  
  if (isGenerating) {
    return (
      <div className="pt-2">
        <AnimatePresence>
          <GeneratingSkeleton activeStyle={activeStyle} />
        </AnimatePresence>
      </div>
    );
  }


  return (
    <div className="pt-2">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <AnimatePresence>
          {results.map((thumb, i) => {
            if (!thumb) return null;

            return (
              <ThumbnailCard
                key={
                  thumb.id ? `${thumb.id}-${thumb.type ?? i}` : `fallback-${i}`
                }
                thumb={thumb}
                index={i}
                activeStyle={activeStyle}
                isDownloading={isDownloading}
              />
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative flex flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-border/60 bg-surface-1/30 py-28 text-center sm:py-32"
    >
      <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[80px]" />
      <div className="bg-surface-2 text-muted-foreground/50 mb-5 rounded-full p-5 shadow-inner">
        <ImagePlus size={40} strokeWidth={1.5} />
      </div>

      <h3 className="relative z-10 font-heading text-2xl font-extrabold tracking-tight text-foreground">
        Awaiting Your <span className="bg-linear-to-r from-primary to-purple-500 bg-clip-text text-transparent">Vision</span>
      </h3>
      <p className="relative z-10 mt-3 max-w-sm text-sm font-medium leading-relaxed text-muted-foreground/80">
        Type your prompt above to unleash the AI. We&apos;ll craft a high-converting, 
        click-magnet thumbnail for your next video.
      </p>
    </motion.div>
  );
}

function GeneratingSkeleton({ activeStyle }: { activeStyle: string }) {
  return (
    <motion.div
      key="skeleton-gen"
      initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-surface-1/60 border-border/50 relative col-span-full flex w-full flex-col items-center justify-center gap-6 overflow-hidden rounded-3xl border py-24 md:py-32"
    >
      <div className="bg-primary/10 absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px]" />

      <div className="absolute inset-0 z-0 opacity-20">
        <motion.div
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="via-primary/30 h-full w-1/2 -skew-x-12 bg-linear-to-r from-transparent to-transparent blur-2xl"
        />
      </div>

      <motion.div
        animate={{
          scale: [1, 1.03, 1],
          opacity: [0.85, 1, 0.85],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="border-primary/20 bg-primary/10 relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border shadow-[0_0_20px_rgba(var(--primary-rgb),0.15)]"
      >
        <ImagePlus size={28} className="text-primary" />
      </motion.div>

      <div className="relative z-10 flex flex-col items-center gap-2 px-4 text-center">
        <h3 className="font-heading text-foreground/90 flex items-center text-xl font-semibold tracking-tight md:text-2xl">
          Crafting your masterpiece
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-4 text-left"
          >
            ...
          </motion.span>
        </h3>
        <p className="text-muted-foreground text-sm font-medium">
          Applying <span className="text-primary font-semibold">{activeStyle}</span> aesthetics
        </p>
      </div>

      <div className="bg-surface-2 border-border/40 relative z-10 mt-4 h-1.5 w-64 overflow-hidden rounded-full border shadow-inner md:w-80">
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "95%" }}
          transition={{ duration: 15, ease: "circOut" }}
          className="bg-primary relative h-full overflow-hidden"
          style={{ boxShadow: "0 0 15px var(--primary)" }}
        >
          <motion.div
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 w-full bg-linear-to-r from-transparent via-white/40 to-transparent"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

function ThumbnailCard({
  thumb,
  index,
  activeStyle,
  isDownloading,
}: {
  thumb: UIThumbnail;
  index: number;
  activeStyle: string;
  isDownloading: boolean;
}) {
  const imagePath = getImagePath(thumb);
  const { blobUrl, isLoading: isImgLoading } = useThumbnailImage(
    thumb.id ? imagePath : null
  );

  const displayUrl = blobUrl || thumb.imagePath;

  const uniqueKey = thumb.id
    ? `${thumb.id}-${thumb.type ?? index}`
    : `fallback-${index}`;

  return (
    <motion.div
      key={uniqueKey}
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
        damping: 20,
      }}
      className="group border-border col-span-full aspect-video bg-card hover:border-primary/50 hover:shadow-glow-primary-sm relative overflow-hidden rounded-2xl border transition-all duration-500"
    >
      <div className="relative h-full w-full">
        {isImgLoading && thumb.id ? (
          <div className="bg-surface-2 flex h-full w-full items-center justify-center">
            <Loader2 className="text-primary animate-spin" size={24} />
          </div>
        ) : (
          <Image
            src={displayUrl}
            alt="Thumbnail"
            fill
            unoptimized
            sizes="100vw" 
            className="bg-surface-2 object-cover transition-transform duration-1000 group-hover:scale-105"
          />
        )}
      </div>

      <div className="absolute inset-0 flex flex-col justify-between bg-linear-to-t from-black/95 via-black/20 to-black/60 p-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="flex -translate-y-2.5 transform items-start justify-between opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="bg-background/40 rounded-full border border-white/10 px-4 py-1.5 text-xs font-bold text-white shadow-lg backdrop-blur-md">
            {getBadgeLabel(thumb)}
          </span>
          <span className="bg-primary/80 border-primary/50 shadow-glow-primary-sm flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-bold text-white backdrop-blur-md">
            <ImageIcon size={12} /> {thumb.style || activeStyle}
          </span>
        </div>

        <div className="flex translate-y-2.5 transform flex-col gap-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <p
            className="font-medium text-white/90 drop-shadow-lg line-clamp-2 text-lg "
          >
            &ldquo;{thumb.prompt}&rdquo;
          </p>

          <button
            disabled={isDownloading || isImgLoading}
            onClick={() => displayUrl && triggerDownload(displayUrl, thumb.id || index)}
            className="hover:bg-primary hover:border-primary hover:shadow-glow-primary-sm flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 py-3.5 text-sm font-bold text-white backdrop-blur-md transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDownloading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Processing Download...
              </>
            ) : (
              <>
                <Download size={18} />
                Download Thumbnail
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}


function getImagePath(thumb: UIThumbnail): string {
  if (!thumb.id) return thumb.imagePath;
  const folder = thumb.isUploaded ? "uploaded-thumbnails" : "thumbnails";
  return `/${folder}/download/${thumb.id}`;
}

function triggerDownload(url: string, id: number) {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `thumbnail-${id}.png`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}

function getBadgeLabel(thumb: UIThumbnail): string {
  if (thumb.type === "uploaded") return "From Image";
  return thumb.isCached ? "Cached" : "Fresh Render";
}