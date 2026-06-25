"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, FileType2, Loader2, FileIcon } from "lucide-react";
import type { GapAnalysisReport } from "@/types/gap-analyzer";

interface ExportBtnProps {
  report: GapAnalysisReport;
}

export function ExportReportBtn({ report }: ExportBtnProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getPreparedSections = () => {
    const sections = [];

    if (report.viralPotentialAnalysis) {
      sections.push({
        label: "Viral Potential Analysis",
        text: report.viralPotentialAnalysis,
        isText: true,
        hex: "F97316",
      });
    }
    if (report.strengths?.length) {
      sections.push({
        label: "Core Strengths",
        items: report.strengths,
        hex: "10B981",
      });
    }
    if (report.weaknesses?.length) {
      sections.push({
        label: "Critical Weaknesses",
        items: report.weaknesses,
        hex: "F43F5E",
      });
    }
    if (report.contentGaps?.length) {
      sections.push({
        label: "Content Gaps",
        items: report.contentGaps,
        hex: "A855F7",
      });
    }
    if (report.audiencePainPoints?.length) {
      sections.push({
        label: "Audience Pain Points",
        items: report.audiencePainPoints,
        hex: "F59E0B",
      });
    }
    if (report.missedOpportunities?.length) {
      sections.push({
        label: "Missed Opportunities",
        items: report.missedOpportunities,
        hex: "3B82F6",
      });
    }
    if (report.seoRecommendations?.length) {
      sections.push({
        label: "SEO Enhancements",
        items: report.seoRecommendations,
        hex: "6366F1",
      });
    }
    if (report.ctrOptimizationSuggestions?.length) {
      sections.push({
        label: "CTR Optimization",
        items: report.ctrOptimizationSuggestions,
        hex: "06B6D4",
      });
    }
    if (report.hookImprovements?.length) {
      sections.push({
        label: "Hook Improvements",
        items: report.hookImprovements,
        hex: "EC4899",
      });
    }
    if (report.retentionImprovements?.length) {
      sections.push({
        label: "Retention Strategies",
        items: report.retentionImprovements,
        hex: "14B8A6",
      });
    }

    return sections;
  };

  const sanitizeText = (text: string): string => {
    if (!text) return "";
    return text
      .replace(/[^\x20-\x7E]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  // PDF Export
  const exportPDF = async () => {
    setIsExporting(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ format: "a4", unit: "mm" });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const maxTextWidth = pageWidth - margin * 2;

      let yOffset = margin;

      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(20, 20, 20);

      const titleLines = doc.splitTextToSize(
        `Analysis: ${report.videoTitle}`,
        maxTextWidth
      );
      doc.text(titleLines, margin, yOffset);
      yOffset += titleLines.length * 8 + 4;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Generated on: ${new Date().toLocaleDateString()}   |   Opportunity: ${(report.opportunityScore * 10).toFixed(1)}/10   |   Difficulty: ${(report.competitionDifficulty * 10).toFixed(1)}/10`,
        margin,
        yOffset
      );
      yOffset += 12;

      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.5);
      doc.line(margin, yOffset, pageWidth - margin, yOffset);
      yOffset += 12;

      const allSections = getPreparedSections();

      allSections.forEach((sec) => {
        const r = parseInt(sec.hex.substring(0, 2), 16) || 0;
        const g = parseInt(sec.hex.substring(2, 4), 16) || 0;
        const b = parseInt(sec.hex.substring(4, 6), 16) || 0;

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
        doc.text(sanitizeText(sec.label).toUpperCase(), margin + 4, yOffset);
        yOffset += 8;

        doc.setFontSize(11);
        doc.setTextColor(60, 60, 60);
        doc.setFont("helvetica", "normal");

        if (sec.isText && sec.text) {
          const lines = doc.splitTextToSize(
            sanitizeText(sec.text),
            maxTextWidth
          );
          lines.forEach((line: string) => {
            if (yOffset > pageHeight - margin) {
              doc.addPage();
              yOffset = margin + 10;
            }
            doc.text(line, margin, yOffset);
            yOffset += 6;
          });
          yOffset += 4;
        } else if (sec.items) {
          sec.items.forEach((item) => {
            const cleanItem = sanitizeText(item);
            if (cleanItem) {
              const lines = doc.splitTextToSize(
                `•  ${cleanItem}`,
                maxTextWidth - 4
              );
              lines.forEach((line: string, index: number) => {
                if (yOffset > pageHeight - margin) {
                  doc.addPage();
                  yOffset = margin + 10;
                }
                doc.text(line, margin + (index === 0 ? 4 : 8), yOffset);
                yOffset += 6.5;
              });
              yOffset += 3;
            }
          });
        }
        yOffset += 8;
      });

      const safeFileName = sanitizeText(report.videoTitle)
        .replace(/[^a-zA-Z0-9]/g, "_")
        .substring(0, 30);
      doc.save(`Analysis_${safeFileName}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF", error);
    } finally {
      setIsExporting(false);
      setIsOpen(false);
    }
  };

  // Word Export
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

      const docChildren: (import("docx").Paragraph | import("docx").Table)[] = [
        new Paragraph({
          text: `Analysis: ${sanitizeText(report.videoTitle)}`,
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 200 },
          border: {
            bottom: {
              color: "CCCCCC",
              space: 10,
              style: BorderStyle.SINGLE,
              size: 6,
            },
          },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Generated on: ${new Date().toLocaleDateString()}   |   Opportunity: ${(report.opportunityScore * 10).toFixed(1)}/10   |   Difficulty: ${(report.competitionDifficulty * 10).toFixed(1)}/10`,
              color: "888888",
              italics: true,
            }),
          ],
          spacing: { after: 400 },
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
                color: sec.hex,
              }),
            ],
          })
        );

        if (sec.isText && sec.text) {
          docChildren.push(
            new Paragraph({
              text: sanitizeText(sec.text),
              spacing: { after: 200, line: 360 },
              style: "Normal",
            })
          );
        } else if (sec.items) {
          sec.items.forEach((item) => {
            docChildren.push(
              new Paragraph({
                text: sanitizeText(item),
                bullet: { level: 0 },
                spacing: { after: 150, line: 360 },
                style: "Normal",
              })
            );
          });
        }
      });

      const doc = new Document({
        sections: [{ properties: {}, children: docChildren }],
      });

      const blob = await Packer.toBlob(doc);
      const safeFileName = sanitizeText(report.videoTitle)
        .replace(/[^a-zA-Z0-9]/g, "_")
        .substring(0, 30);
      saveAs(blob, `Analysis_${safeFileName}.docx`);
    } catch (error) {
      console.error("Failed to generate Word doc", error);
    } finally {
      setIsExporting(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className="border-border text-foreground flex h-11 cursor-pointer items-center gap-2 rounded-3xl border bg-transparent px-4 text-sm font-bold transition-all hover:bg-(--surface-2) disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isExporting ? (
          <Loader2 size={16} className="text-primary animate-spin" />
        ) : (
          <Download size={16} />
        )}
        {isExporting ? "Exporting..." : "Export Analysis"}
      </button>

      <AnimatePresence>
        {isOpen && !isExporting && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="border-border bg-card/90 absolute top-13 right-0 z-50 w-48 overflow-hidden rounded-xl border shadow-lg backdrop-blur-lg"
          >
            <div className="flex flex-col p-1.5">
              <button
                onClick={exportPDF}
                className="text-foreground flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors hover:bg-(--surface-2)"
              >
                <FileIcon size={16} className="text-red-500" />
                Download PDF
              </button>
              <button
                onClick={exportWord}
                className="text-foreground flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors hover:bg-(--surface-2)"
              >
                <FileType2 size={16} className="text-blue-500" />
                Download Word
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
