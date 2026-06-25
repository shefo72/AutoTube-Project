"use client";

import React from "react";
import { Video, Mic, Type, Music } from "lucide-react";
import type { ScriptSectionData } from "@/types/script";

const RichField = ({
  icon: Icon,
  label,
  text,
  iconColor,
  iconBg,
}: {
  icon: React.ElementType;
  label: string;
  text?: string;
  iconColor: string;
  iconBg: string;
}) => {
  if (!text) return null;
  return (
    <div className="group border-border/40 hover:border-border relative flex flex-col gap-3 rounded-2xl border bg-(--surface-1)/40 p-5 transition-all duration-300 hover:bg-(--surface-1)/80 hover:shadow-sm">
      <div className="border-border/40 flex items-center gap-3 border-b pb-3">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconBg} ${iconColor}`}
        >
          <Icon size={16} strokeWidth={2.5} />
        </div>
        <h5 className="text-foreground text-sm font-bold tracking-wide uppercase">
          {label}
        </h5>
      </div>
      <p className="text-[15px] leading-[1.8] whitespace-pre-wrap text-(--text-dim) transition-colors duration-300 group-hover:text-(--secondary-foreground)">
        {text}
      </p>
    </div>
  );
};

export interface SectionRendererProps {
  data: ScriptSectionData | ScriptSectionData[] | undefined;
  videoType?: string;
}

export default function SectionRenderer({
  data,
  videoType,
}: SectionRendererProps) {
  if (!data) return null;

  if (Array.isArray(data)) {
    return (
      <div className="space-y-10 pt-2">
        {data.map((chapter, idx) => (
          <div key={idx} className="relative">
            <div className="mb-6 flex items-center gap-4">
              <div className="border-border text-muted-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-(--surface-2) text-xs font-bold shadow-sm">
                {idx + 1}
              </div>
              <h4 className="text-foreground text-sm font-bold md:text-base">
                {chapter.title || `Chapter ${idx + 1}`}
              </h4>
              <div className="from-border/60 h-px flex-1 bg-linear-to-r to-transparent"></div>
            </div>
            <div className="flex flex-col gap-6 pl-2 md:pl-12">
              <RichField
                icon={Video}
                label="Actions & Visuals"
                text={chapter.actions_and_visuals}
                iconColor="text-blue-500"
                iconBg="bg-blue-500/10"
              />
              <RichField
                icon={Mic}
                label="Presenter Speech"
                text={chapter.presenter_speech}
                iconColor="text-purple-500"
                iconBg="bg-purple-500/10"
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const isShort = videoType === "shorts" || videoType === "youtube_short";

  if (isShort) {
    return (
      <div className="flex flex-col gap-6 pt-2">
        <RichField
          icon={Video}
          label="Visual Prompt"
          text={data.visual_prompt}
          iconColor="text-blue-500"
          iconBg="bg-blue-500/10"
        />
        <RichField
          icon={Type}
          label="On-Screen Text"
          text={data.on_screen_text}
          iconColor="text-emerald-500"
          iconBg="bg-emerald-500/10"
        />
        <RichField
          icon={Mic}
          label="Voiceover"
          text={data.voiceover}
          iconColor="text-purple-500"
          iconBg="bg-purple-500/10"
        />
        <RichField
          icon={Music}
          label="Sound Effects"
          text={data.sound_effects}
          iconColor="text-amber-500"
          iconBg="bg-amber-500/10"
        />
      </div>
    );
  }

  const combinedVisuals = [
    data.actions_and_visuals,
    data.on_screen_text ? `[ON-SCREEN TEXT]:\n${data.on_screen_text}` : null,
  ]
    .filter(Boolean)
    .join("\n\n");

  const combinedSpeech = [
    data.presenter_speech,
    data.sound_effects ? `[SOUND EFFECTS]:\n${data.sound_effects}` : null,
  ]
    .filter(Boolean)
    .join("\n\n");

  return (
    <div className="flex flex-col gap-6 pt-2">
      <RichField
        icon={Video}
        label="Actions & Visuals"
        text={combinedVisuals}
        iconColor="text-blue-500"
        iconBg="bg-blue-500/10"
      />
      <RichField
        icon={Mic}
        label="Presenter Speech"
        text={combinedSpeech}
        iconColor="text-purple-500"
        iconBg="bg-purple-500/10"
      />
    </div>
  );
}
