import { motion } from "framer-motion";
import { Film, Sparkles, FileText, Image as ImageIcon } from "lucide-react";

export function EmptyState() {
  return (
    <div className="relative mb-15 flex min-h-[60vh] flex-1 flex-col items-center justify-center overflow-hidden p-8 text-center">
      <div className="bg-primary/10 absolute top-1/2 left-1/2 -z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px]" />
      <div className="absolute top-1/2 left-1/2 -z-10 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/10 blur-[60px]" />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring", bounce: 0.5 }}
        className="border-primary/20 from-primary/10 relative mb-6 flex h-24 w-24 items-center justify-center rounded-3xl border bg-linear-to-br to-transparent shadow-inner backdrop-blur-sm"
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0], y: [0, -3, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles size={38} className="text-primary drop-shadow-md" />
        </motion.div>

        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="bg-primary absolute top-4 right-4 h-1.5 w-1.5 rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          className="absolute bottom-6 left-5 h-1 w-1 rounded-full bg-purple-400"
        />
      </motion.div>

      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <h3 className="text-foreground text-2xl font-extrabold tracking-tight md:text-3xl">
          The Ultimate Content Pack
        </h3>
        <p className="text-muted-foreground mx-auto mt-3 max-w-sm text-[14px] leading-relaxed">
          Type your video concept and let our AI engine generate a complete
          production-ready package in seconds.
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mt-8 flex flex-wrap items-center justify-center gap-3"
      >
        {[
          {
            icon: FileText,
            label: "Viral Script",
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            border: "border-blue-500/20",
          },
          {
            icon: ImageIcon,
            label: "4K Thumbnail",
            color: "text-purple-500",
            bg: "bg-purple-500/10",
            border: "border-purple-500/20",
          },
          {
            icon: Film,
            label: "Rendered Video",
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/20",
          },
        ].map((feature, i) => (
          <div
            key={i}
            className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 backdrop-blur-md transition-all hover:scale-105 ${feature.bg} ${feature.border}`}
          >
            <feature.icon size={14} className={feature.color} />
            <span className="text-foreground text-xs font-semibold">
              {feature.label}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
