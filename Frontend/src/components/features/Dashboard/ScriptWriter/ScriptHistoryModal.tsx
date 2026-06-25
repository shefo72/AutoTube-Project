/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Search,
  FileText,
  Clock,
  BookOpen,
  FileType2,
  FileIcon,
  Loader2,
} from "lucide-react";

import HistoryLoadingState from "@/components/ui/HistoryModel/HistoryLoadingState";
import EmptyState from "@/components/ui/HistoryModel/HistoryEmptyState";
import { Modal } from "@/components/ui/Modal";
import { useGetScriptHistoryQuery } from "@/services/scriptApi";
import type { ScriptHistoryItem } from "@/types/script";
import { toast } from "sonner";

interface ScriptHistoryModalProps {
  open: boolean;
  onClose: () => void;
  onSelectScript?: (scriptData: Record<string, unknown>) => void;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function extractScriptContent(parsedData: any) {
  const sections: { title: string; content: string }[] = [];

  if (parsedData.description_data?.video_description) {
    sections.push({
      title: "DESCRIPTION",
      content: parsedData.description_data.video_description,
    });
  }

  const formatBlock = (block: any) => {
    let text = "";
    if (block.presenter_speech)
      text += `Voiceover / Speech:\n${block.presenter_speech}\n\n`;
    if (block.voiceover) text += `Voiceover:\n${block.voiceover}\n\n`;
    if (block.actions_and_visuals)
      text += `Visuals & Actions:\n${block.actions_and_visuals}\n\n`;
    if (block.visual_prompt) text += `Visuals:\n${block.visual_prompt}\n\n`;
    if (block.on_screen_text)
      text += `On-Screen Text:\n${block.on_screen_text}\n\n`;
    return text.trim();
  };

  const standardKeys = [
    "hook_and_intro",
    "hook",
    "introduction",
    "main_content",
    "cta_outro",
  ];

  standardKeys.forEach((key) => {
    const data = parsedData[key];
    if (!data) return;

    if (Array.isArray(data)) {
      data.forEach((subItem, index) => {
        const title = (subItem.title || `${key} Part ${index + 1}`)
          .toUpperCase()
          .replace(/_/g, " ");
        const content = formatBlock(subItem);
        if (content) sections.push({ title, content });
      });
    } else if (data.time_slots && Array.isArray(data.time_slots)) {
      const title = (data.section_name || key).toUpperCase().replace(/_/g, " ");
      const content = data.time_slots
        .map((slot: any) => {
          const timing = slot.duration_range
            ? `[ Time: ${slot.duration_range} ]\n`
            : "";
          return timing + formatBlock(slot);
        })
        .join("\n\n---\n\n");
      if (content) sections.push({ title, content });
    } else {
      const title = (data.title || data.section_name || key)
        .toUpperCase()
        .replace(/_/g, " ");
      const content = formatBlock(data);
      if (content) sections.push({ title, content });
    }
  });

  return sections;
}

export function ScriptHistoryModal({
  open,
  onClose,
  onSelectScript,
}: ScriptHistoryModalProps) {
  const { data: historyData, isLoading: isFetchingHistory } =
    useGetScriptHistoryQuery(undefined, { skip: !open });

  const [searchQuery, setSearchQuery] = useState("");

  const filteredHistory = useMemo(() => {
    if (!historyData) return [];
    if (!searchQuery.trim()) return historyData;
    const query = searchQuery.toLowerCase();
    return historyData.filter((item) =>
      item.topic.toLowerCase().includes(query)
    );
  }, [historyData, searchQuery]);

  // Export : Word

  const handleExportWord = useCallback(async (item: ScriptHistoryItem) => {
    try {
      const parsedData = JSON.parse(item.rawJson);
      const extractedSections = extractScriptContent(parsedData);

      const { Document, Packer, Paragraph, HeadingLevel } =
        await import("docx");
      const { saveAs } = await import("file-saver");

      const docChildren: any[] = [
        new Paragraph({
          text: `Script: ${item.topic}`,
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 300 },
        }),
      ];

      extractedSections.forEach((sec) => {
        docChildren.push(
          new Paragraph({
            text: sec.title,
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          })
        );

        sec.content.split("\n").forEach((line) => {
          if (line.trim()) {
            docChildren.push(
              new Paragraph({ text: line, spacing: { after: 120 } })
            );
          }
        });
      });

      const doc = new Document({
        sections: [{ properties: {}, children: docChildren }],
      });
      const blob = await Packer.toBlob(doc);

      const safeName = item.topic.replace(/[^a-z0-9]/gi, "_").substring(0, 30);
      saveAs(blob, `${safeName}_Script.docx`);
      toast.success("Word Document exported successfully!");
    } catch (err) {
      console.error("Word Export failed:", err);
      toast.error("Failed to export Word file.");
      throw err;
    }
  }, []);

  // Export PDF

  const handleExportPDF = useCallback(async (item: ScriptHistoryItem) => {
    try {
      const parsedData = JSON.parse(item.rawJson);
      const extractedSections = extractScriptContent(parsedData);

      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ format: "a4", unit: "mm" });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const maxTextWidth = pageWidth - margin * 2;
      let yOffset = margin;

      // Title
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text("Script:", margin, yOffset);

      doc.setFontSize(16);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 80, 80);
      yOffset += 8;
      const titleLines = doc.splitTextToSize(item.topic, maxTextWidth);
      doc.text(titleLines, margin, yOffset);
      yOffset += titleLines.length * 6 + 4;

      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yOffset, pageWidth - margin, yOffset);
      yOffset += 12;

      // Sections
      extractedSections.forEach((sec) => {
        if (yOffset > pageHeight - margin - 20) {
          doc.addPage();
          yOffset = margin;
        }

        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(37, 99, 235);
        doc.text(sec.title, margin, yOffset);
        yOffset += 8;

        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(40, 40, 40);

        const lines = doc.splitTextToSize(sec.content, maxTextWidth);
        lines.forEach((line: string) => {
          if (yOffset > pageHeight - margin) {
            doc.addPage();
            yOffset = margin + 10;
          }
          doc.text(line, margin, yOffset);
          yOffset += 6;
        });
        yOffset += 8;
      });

      const safeName = item.topic.replace(/[^a-z0-9]/gi, "_").substring(0, 30);
      doc.save(`${safeName}_Script.pdf`);
      toast.success("PDF exported successfully!");
    } catch (error) {
      console.error("PDF Export failed", error);
      toast.error("Failed to generate PDF.");
      throw error;
    }
  }, []);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Script History"
      subtitle="View and export your previously generated scripts."
      width="max-w-3xl"
    >
      <div className="flex flex-col gap-5">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        <div className="scrollbar-thin scrollbar-thumb-(--surface-4) scrollbar-track-transparent flex max-h-[60vh] min-h-75 flex-col gap-4 overflow-y-auto pr-2 pb-2">
          {isFetchingHistory ? (
            <HistoryLoadingState />
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((item, idx) => (
                  <HistoryCard
                    key={`script-${item.id}-${idx}`}
                    item={item}
                    index={idx}
                    onExportWord={() => handleExportWord(item)}
                    onExportPDF={() => handleExportPDF(item)}
                    onClick={() => {
                      if (onSelectScript) {
                        try {
                          onSelectScript(JSON.parse(item.rawJson));
                          onClose();
                        } catch (e) {}
                      }
                    }}
                  />
                ))
              ) : (
                <EmptyState
                  title="No scripts found"
                  description={
                    searchQuery.trim()
                      ? "No results match your search."
                      : "You haven't generated any scripts yet."
                  }
                />
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </Modal>
  );
}

function HistoryCard({
  item,
  index,
  onExportWord,
  onExportPDF,
  onClick,
}: {
  item: ScriptHistoryItem;
  index: number;
  onExportWord: () => Promise<void>;
  onExportPDF: () => Promise<void>;
  onClick: () => void;
}) {
  const [isExportingWord, setIsExportingWord] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  let stats = { duration: "N/A", readability: "N/A" };
  try {
    const parsed = JSON.parse(item.rawJson);
    if (parsed.stats) stats = parsed.stats;
  } catch (e) {}

  const handleWordClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExportingWord(true);
    try {
      await onExportWord();
    } finally {
      setIsExportingWord(false);
    }
  };

  const handlePDFClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExportingPDF(true);
    try {
      await onExportPDF();
    } finally {
      setIsExportingPDF(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.05, 0.5) }}
      onClick={onClick}
      className="group border-border hover:border-primary/30 flex cursor-pointer flex-col gap-4 rounded-2xl border bg-(--surface-1)/40 p-5 transition-all duration-300 hover:bg-(--surface-1)/80 hover:shadow-sm sm:flex-row sm:items-start"
    >
      <div className="bg-primary/10 border-primary/20 relative mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border shadow-inner">
        <FileText size={22} className="text-primary" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <div>
          <motion.p
            layout="position"
            className="text-foreground line-clamp-2 text-[16px] leading-snug font-bold"
            title={item.topic}
          >
            {item.topic}
          </motion.p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-(--text-dim)">
            <div className="flex items-center gap-1.5 rounded-lg bg-(--surface-2) px-2.5 py-1.5 transition-colors">
              <Clock size={14} className="text-blue-500" />
              {stats.duration}
            </div>
            <div className="flex items-center gap-1.5 rounded-lg bg-(--surface-2) px-2.5 py-1.5 transition-colors">
              <BookOpen size={14} className="text-emerald-500" />
              {stats.readability}
            </div>
            <div className="flex items-center gap-1.5 rounded-lg bg-(--surface-2) px-2.5 py-1.5 transition-colors">
              <Calendar size={14} className="text-orange-500" />
              {formatDate(item.createdAt)}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <button
              onClick={handleWordClick}
              disabled={isExportingWord || isExportingPDF}
              className="group text-muted-foreground flex h-8 cursor-pointer items-center gap-1.5 rounded-md px-2.5 text-[11px] font-semibold transition-all hover:bg-blue-500/10 hover:text-blue-600 disabled:pointer-events-none disabled:opacity-50"
            >
              {isExportingWord ? (
                <Loader2 size={13} className="animate-spin text-blue-500" />
              ) : (
                <FileType2
                  size={13}
                  className="text-blue-500 transition-transform group-hover:scale-110"
                />
              )}
              Word
            </button>

            <button
              onClick={handlePDFClick}
              disabled={isExportingWord || isExportingPDF}
              className="group text-muted-foreground flex h-8 cursor-pointer items-center gap-1.5 rounded-md px-2.5 text-[11px] font-semibold transition-all hover:bg-red-500/10 hover:text-red-600 disabled:pointer-events-none disabled:opacity-50"
            >
              {isExportingPDF ? (
                <Loader2 size={13} className="animate-spin text-red-500" />
              ) : (
                <FileIcon
                  size={13}
                  className="text-red-500 transition-transform group-hover:scale-110"
                />
              )}
              PDF
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative flex-1">
      <Search
        className="absolute top-1/2 left-4 -translate-y-1/2 text-(--text-dim)"
        size={18}
      />
      <input
        type="text"
        placeholder="Search scripts by topic..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border-border focus:border-primary text-foreground h-12 w-full rounded-2xl border bg-(--surface-1)/50 pr-4 pl-11 text-[15px] transition-all outline-none placeholder:text-(--text-dim) focus:ring-2 focus:ring-(--ring)"
      />
    </div>
  );
}
