"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, FileText, FileType2, FileIcon, Loader2 } from "lucide-react";

interface ScriptSection {
  id: string;
  label: string;
  timing?: string;
  content: string;
  color?: string;
}

interface ExportMetadata {
  description: string;
  hooks: string[];
}

interface ExportScriptBtnProps {
  scriptTitle?: string;
  sections: ScriptSection[];
  metadata?: ExportMetadata;
}

export function ExportScriptBtn({
  scriptTitle = "AutoTube_Script",
  sections,
  metadata,
}: ExportScriptBtnProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const getPreparedSections = () => {
    const items: (ScriptSection & { hexColor: string })[] = [];

    if (metadata) {
      items.push({
        id: "seo_desc",
        label: "Smart Description",
        content: metadata.description,
        hexColor: "4F46E5",
      });
      items.push({
        id: "seo_hooks",
        label: "Top Hooks & Titles",
        content: metadata.hooks.map((h, i) => `${i + 1}. ${h}`).join("\n\n"),
        hexColor: "E11D48",
      });
    }

    sections.forEach((sec) => {
      let hexColor = "2563EB";
      if (sec.id === "intro") hexColor = "8B5CF6";
      else if (sec.id === "main") hexColor = "2563EB";
      else if (sec.id === "cta") hexColor = "059669";

      items.push({
        ...sec,
        hexColor,
      });
    });

    return items;
  };

  // 1. TXT Export
  const exportTXT = () => {
    const allSections = getPreparedSections();
    let plainText = `========== ${scriptTitle.toUpperCase()} ==========\n\n`;

    allSections.forEach((sec) => {
      plainText += `[ ${sec.label.toUpperCase()} ] ${sec.timing ? `(${sec.timing})` : ""}\n`;
      plainText += `${sec.content}\n\n`;
      plainText += `--------------------------------------------------\n\n`;
    });

    const blob = new Blob([plainText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${scriptTitle}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    setIsOpen(false);
  };

  // 2. PDF Export
  const exportPDF = async () => {
    setIsExporting(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ format: "a4", unit: "mm" });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const maxTextWidth = pageWidth - margin * 2 - 5;

      let yOffset = margin;

      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text(scriptTitle, margin, yOffset);

      yOffset += 8;
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.line(margin, yOffset, pageWidth - margin, yOffset);
      yOffset += 12;

      const allSections = getPreparedSections();

      allSections.forEach((sec) => {
        const r = parseInt(sec.hexColor.substring(0, 2), 16) || 0;
        const g = parseInt(sec.hexColor.substring(2, 4), 16) || 0;
        const b = parseInt(sec.hexColor.substring(4, 6), 16) || 0;

        if (yOffset > pageHeight - margin - 20) {
          doc.addPage();
          yOffset = margin + 10;
        }

        doc.setDrawColor(r, g, b);
        doc.setLineWidth(1.5);
        doc.line(margin, yOffset - 4, margin, yOffset + 1);

        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(r, g, b);
        doc.text(sec.label.toUpperCase(), margin + 4, yOffset);

        if (sec.timing) {
          const labelWidth = doc.getTextWidth(sec.label.toUpperCase());
          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(150, 150, 150);
          doc.text(`— ${sec.timing}`, margin + 6 + labelWidth, yOffset);
        }

        yOffset += 8;

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "normal");

        const lines = doc.splitTextToSize(sec.content, maxTextWidth);
        const lineHeight = 6.5;

        lines.forEach((line: string) => {
          if (yOffset > pageHeight - margin) {
            doc.addPage();
            yOffset = margin + 10;
          }
          doc.text(line, margin + 4, yOffset);
          yOffset += lineHeight;
        });

        yOffset += 8;
      });

      doc.save(`${scriptTitle}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF", error);
    } finally {
      setIsExporting(false);
      setIsOpen(false);
    }
  };

  // 3. Word Export
  const exportWord = async () => {
    setIsExporting(true);
    try {
      const {
        Document,
        Packer,
        Paragraph,
        TextRun,
        HeadingLevel,
        BorderStyle,
      } = await import("docx");
      const { saveAs } = await import("file-saver");

      const docChildren: InstanceType<typeof Paragraph>[] = [
        new Paragraph({
          text: scriptTitle,
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 300 },
          border: {
            bottom: {
              color: "CCCCCC",
              space: 10,
              style: BorderStyle.SINGLE,
              size: 6,
            },
          },
        }),
      ];

      const allSections = getPreparedSections();

      allSections.forEach((sec) => {
        docChildren.push(
          new Paragraph({
            spacing: { before: 400, after: 200 },
            children: [
              new TextRun({
                text: sec.label.toUpperCase(),
                bold: true,
                size: 28,
                color: sec.hexColor,
              }),
              new TextRun({
                text: sec.timing ? `   •   ${sec.timing}` : "",
                size: 20,
                color: "888888",
              }),
            ],
          })
        );

        sec.content.split("\n").forEach((line) => {
          if (line.trim() === "") return;
          docChildren.push(
            new Paragraph({
              children: [
                new TextRun({ text: line, size: 24, color: "000000" }),
              ],
              spacing: { after: 150, line: 360 },
              indent: { left: 360 },
            })
          );
        });
      });

      const doc = new Document({
        sections: [{ properties: {}, children: docChildren }],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${scriptTitle}.docx`);
    } catch (error) {
      console.error("Failed to generate Word doc", error);
    } finally {
      setIsExporting(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className="bg-primary hover:bg-primary/90 flex h-10 cursor-pointer items-center gap-2 rounded-lg px-3 text-[10px] font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-70 md:px-4 md:text-sm"
      >
        {isExporting ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Download size={16} />
        )}
        {isExporting ? "Exporting..." : "Export Script"}
      </button>

      <AnimatePresence>
        {isOpen && !isExporting && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="border-border bg-card absolute top-12 right-0 z-50 w-48 overflow-hidden rounded-xl border shadow-lg"
          >
            <div className="flex flex-col p-1.5">
              <button
                onClick={exportPDF}
                className="text-foreground flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-(--surface-2)"
              >
                <FileIcon size={14} className="text-red-500" />
                Export as PDF
              </button>
              <button
                onClick={exportWord}
                className="text-foreground flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-(--surface-2)"
              >
                <FileType2 size={14} className="text-blue-500" />
                Export as Word
              </button>
              <button
                onClick={exportTXT}
                className="text-foreground flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-(--surface-2)"
              >
                <FileText size={14} className="text-gray-400" />
                Teleprompter (TXT)
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
