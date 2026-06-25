"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, FileIcon, FileType2, Loader2 } from "lucide-react";
import type { GapAnalysisReport } from "@/types/gap-analyzer";

interface ExportReportBtnProps {
  report: GapAnalysisReport;
}

export function ExportReportBtn({ report }: ExportReportBtnProps) {
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

    if (report.strengths?.length)
      sections.push({
        label: "Core Strengths",
        items: report.strengths,
        hex: "10B981",
      }); // Emerald
    if (report.weaknesses?.length)
      sections.push({
        label: "Critical Weaknesses",
        items: report.weaknesses,
        hex: "F43F5E",
      }); // Rose
    if (report.contentGaps?.length)
      sections.push({
        label: "Content Gaps",
        items: report.contentGaps,
        hex: "8B5CF6",
      }); // Purple
    if (report.audiencePainPoints?.length)
      sections.push({
        label: "Audience Pain Points",
        items: report.audiencePainPoints,
        hex: "F59E0B",
      }); // Amber
    if (report.missedOpportunities?.length)
      sections.push({
        label: "Missed Opportunities",
        items: report.missedOpportunities,
        hex: "3B82F6",
      }); // Blue

    if (report.seoRecommendations?.length)
      sections.push({
        label: "SEO Enhancements",
        items: report.seoRecommendations,
        hex: "6366F1",
      }); // Indigo
    if (report.ctrOptimizationSuggestions?.length)
      sections.push({
        label: "CTR Optimization",
        items: report.ctrOptimizationSuggestions,
        hex: "6366F1",
      });
    if (report.hookImprovements?.length)
      sections.push({
        label: "Hook Improvements",
        items: report.hookImprovements,
        hex: "6366F1",
      });
    if (report.retentionImprovements?.length)
      sections.push({
        label: "Retention Strategies",
        items: report.retentionImprovements,
        hex: "6366F1",
      });

    if (report.viralPotentialAnalysis)
      sections.push({
        label: "Viral Potential Analysis",
        items: [report.viralPotentialAnalysis],
        hex: "F97316",
      }); // Orange

    return sections;
  };

  // 1. PDF Export
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

      const sanitizeText = (text: string): string => {
        if (!text) return "";
        return text
          .replace(/[^\x20-\x7E]/g, "")
          .replace(/\s+/g, " ")
          .trim();
      };

      // Title
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 30, 30);
      const cleanTitle = sanitizeText(`Analysis: ${report.videoTitle}`);
      const titleLines = doc.splitTextToSize(cleanTitle, maxTextWidth);
      doc.text(titleLines, margin, yOffset);
      yOffset += titleLines.length * 8 + 5;

      // Scores Section
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Opportunity Score: ${(report.opportunityScore * 10).toFixed(1)}/10   |   Difficulty: ${(report.competitionDifficulty * 10).toFixed(1)}/10`,
        margin,
        yOffset
      );
      yOffset += 10;

      // Divider
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.5);
      doc.line(margin, yOffset, pageWidth - margin, yOffset);
      yOffset += 12;

      const allSections = getPreparedSections();

      allSections.forEach((sec) => {
        const r = parseInt(sec.hex.substring(0, 2), 16) || 0;
        const g = parseInt(sec.hex.substring(2, 4), 16) || 0;
        const b = parseInt(sec.hex.substring(4, 6), 16) || 0;

        // Check page break for Header
        if (yOffset > pageHeight - margin - 20) {
          doc.addPage();
          yOffset = margin + 10;
        }

        // Section Title
        doc.setDrawColor(r, g, b);
        doc.setLineWidth(1.5);
        doc.line(margin, yOffset - 4, margin, yOffset + 1);

        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(r, g, b);
        doc.text(sanitizeText(sec.label).toUpperCase(), margin + 4, yOffset);
        yOffset += 8;

        // Section Items (Bullets)
        doc.setFontSize(11);
        doc.setTextColor(60, 60, 60);
        doc.setFont("helvetica", "normal");

        sec.items.forEach((item) => {
          const cleanItem = sanitizeText(item);

          if (cleanItem) {
            const lines = doc.splitTextToSize(
              `• ${cleanItem}`,
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
            yOffset += 3; // Space between items
          }
        });

        yOffset += 6; // Space between sections
      });

      const safeFileName = sanitizeText(report.videoTitle).replace(
        /[^a-zA-Z0-9]/g,
        "_"
      );
      doc.save(`Analysis_${safeFileName}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF", error);
    } finally {
      setIsExporting(false);
      setIsOpen(false);
    }
  };

  // 2. Word Export
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
          text: `Analysis: ${report.videoTitle}`,
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
              text: `Opportunity Score: ${(report.opportunityScore * 10).toFixed(1)}/10    |    `,
              color: "666666",
              size: 24,
            }),
            new TextRun({
              text: `Difficulty: ${(report.competitionDifficulty * 10).toFixed(1)}/10`,
              color: "666666",
              size: 24,
            }),
          ],
          spacing: { after: 400 },
        }),
      ];

      const allSections = getPreparedSections();

      allSections.forEach((sec) => {
        // Section Header
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

        // Section Bullets
        sec.items.forEach((item) => {
          docChildren.push(
            new Paragraph({
              text: item,
              bullet: { level: 0 },
              spacing: { after: 150, line: 360 },
              style: "Normal",
            })
          );
        });
      });

      const doc = new Document({
        sections: [{ properties: {}, children: docChildren }],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `Analysis_${report.videoTitle}.docx`);
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
        {isExporting ? "Exporting..." : "Export Report"}
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
