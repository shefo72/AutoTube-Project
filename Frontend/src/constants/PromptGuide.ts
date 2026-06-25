import {
  Sparkles,
  FileText,
  Clapperboard,
  Image as ImageIcon,
  XCircle,
  Lightbulb,
  Wand2,
  LayoutList,
  Target,
  RefreshCw,
} from "lucide-react";

export const universalRules = [
  {
    title: "Context is the Foundation",
    desc: "The AI doesn't know your brand. Always start by defining who you are, who you're talking to, and what the ultimate goal is.",
    icon: Lightbulb,
    color: "#A855F7",
  },
  {
    title: "Precision Over Volume",
    desc: "More words don't equal better results. Use precise, powerful adjectives and active verbs instead of long, fluffy sentences.",
    icon: Wand2,
    color: "#3B82F6",
  },
  {
    title: "Set Strict Boundaries",
    desc: "Telling the AI what NOT to do is a superpower. Use phrases like 'Do not use emojis', 'Avoid formal language', or 'Under 100 words'.",
    icon: XCircle,
    color: "#EF4444",
  },
  {
    title: "Use Professional Jargon",
    desc: "Speak the industry's language. Use terms like 'High-CTR', 'Pattern Interrupt', 'Cinematic depth of field', or 'Call to Action'.",
    icon: Target,
    color: "#10B981",
  },
  {
    title: "Structure Your Request",
    desc: "Don't write a wall of text. Use bullet points, brackets [ ], and clear section headers in your prompt so the AI can parse it easily.",
    icon: LayoutList,
    color: "#F59E0B",
  },
  {
    title: "The 'One-Shot' Myth",
    desc: "Your first prompt is a draft. If the result is 80% there, don't start over. Reply with 'Make the tone punchier' to refine it.",
    icon: RefreshCw,
    color: "#8B5CF6",
  },
];

export const guideModules = [
  {
    id: "all-in-one",
    title: "All-In-One",
    icon: Sparkles,
    color: "#A855F7",
    textColor: "text-[#A855F7]",
    description:
      "Generate your entire YouTube pipeline—Thumbnail, Script, SEO, and Video—in one masterful prompt.",
    formula:
      "[Video Concept] + [Target Audience] + [Global Vibe] + [Specifics for Script/Thumb/SEO]",
    dos: [
      "Define a unified theme so the thumbnail, script, and video all share the same mood",
      "Give brief, specific instructions for each asset (e.g., 'Make the SEO target long-tail keywords')",
      "Mention your channel's overarching goal (e.g., 'To sell a coding bootcamp')",
    ],
    donts: [
      "Write a vague prompt—this engine generates 4 different assets, it needs details!",
      "Give conflicting vibes (e.g., 'Make the script funny but the video dark and scary')",
    ],
    badPrompt:
      "Make a full youtube package about learning python. I want it to be good and get views.",
    goodPrompt:
      "Generate a complete YouTube package for 'How to learn Python in 30 days'. Audience: Absolute beginners feeling overwhelmed. Global vibe: Encouraging but realistic. For the Script: 8-mins, fast-paced, MrBeast style intro. For the Thumbnail: High contrast, frustrated face turning into a relieved face. For SEO: Target low-competition, long-tail search terms. For Video: Clean, minimalist tech B-roll.",
    whyItWorks:
      "It acts as a 'Creative Brief'. By giving the AI explicit directions for every single piece of the package, you guarantee that the Script, SEO, and Visuals will be perfectly synchronized to tell one cohesive story.",
    proTip:
      "Think of this prompt as hiring a full production agency. Tell the 'Agency' exactly what the final product should look, sound, and feel like before they start working.",
  },
  {
    id: "script",
    title: "Script",
    icon: FileText,
    color: "#3B82F6",
    textColor: "text-[#3B82F6]",
    description:
      "Engineer retention-heavy scripts that hook viewers instantly and maximize watch time.",
    formula:
      "[Hook Framework] + [Pacing/Tone] + [Core Narrative/Data] + [Call to Action]",
    dos: [
      "Demand a 'Curiosity Gap' or 'Pattern Interrupt' for the intro",
      "Dictate the reading level (e.g., 'Write at an 8th-grade reading level for maximum clarity')",
      "Ask the AI to include timestamp estimates (e.g., [0:00-0:30 Intro])",
    ],
    donts: [
      "Let the AI start with 'Hey guys, welcome back to my channel'",
      "Ask for a script without defining the estimated duration or word count",
    ],
    badPrompt:
      "Write a 10 minute script about how the James Webb Telescope works.",
    goodPrompt:
      "Write a highly engaging 8-minute YouTube script about the James Webb Telescope finding a potential alien signature. Start with a controversial, mind-bending hook. Use short, punchy sentences. Tone: Awe-inspiring and slightly mysterious. Include placeholders for [B-ROLL CUES]. End with a subtle CTA to subscribe.",
    whyItWorks:
      "It sets strict structural constraints ('short, punchy sentences') and dictates the exact emotional tone. The [B-ROLL CUES] addition also speeds up your editing process massively.",
    proTip:
      "If the AI writes a script that sounds too robotic, reply with: 'Rewrite this to sound like a passionate friend explaining it to me at a coffee shop.'",
  },
  {
    id: "video",
    title: "Video",
    icon: Clapperboard,
    color: "#10B981",
    textColor: "text-[#10B981]",
    description:
      "Direct the AI like a master cinematographer for stunning, highly realistic footage.",
    formula:
      "[Main Subject] + [Specific Action] + [Lighting/Environment] + [Camera Move] + [Format/Style]",
    dos: [
      "Use real photography terms (e.g., 'Depth of field', 'Macro lens', 'Volumetric lighting')",
      "Describe the camera movement exactly (e.g., 'Slow push-in', 'Drone tracking shot')",
      "Mention the weather or atmosphere to add realism (e.g., 'Foggy morning', 'Heavy rain')",
    ],
    donts: [
      "Ask for complex multi-character dialogue or precise hand movements (AI struggles here)",
      "Include text or typography in the prompt (add your text in Premiere/CapCut later)",
    ],
    badPrompt: "A cool video of a sports car driving really fast.",
    goodPrompt:
      "Low angle tracking shot of a matte black Porsche 911 drifting around a tight corner on a wet mountain road. Cinematic moody lighting, heavy rain, glowing red taillights reflecting on the asphalt, 8k resolution, highly detailed.",
    whyItWorks:
      "Replacing subjective words ('cool') with literal visual directions ('low angle tracking shot', 'matte black') gives the AI an exact physical blueprint to render without guessing.",
    proTip:
      "Always append technical keywords like 'Shot on 35mm lens, Unreal Engine 5, photorealistic, cinematic grading' to instantly upgrade the visual quality.",
  },
  {
    id: "thumbnail",
    title: "Thumbnail",
    icon: ImageIcon,
    color: "#F97316",
    textColor: "text-[#F97316]",
    description:
      "Design high-CTR art that sparks curiosity and practically forces the viewer to click.",
    formula:
      "[Main Subject] + [Exaggerated Emotion] + [Background Context] + [Lighting] + [Style]",
    dos: [
      "Focus intensely on extreme, exaggerated facial expressions",
      "Use contrasting color palettes (e.g., Teal and Orange, Purple and Yellow)",
      "Keep the composition incredibly simple (Rule of thirds) for mobile readability",
    ],
    donts: [
      "Clutter the image with more than 3 main visual elements",
      "Ask the AI to generate the thumbnail text (it will misspell it, do it yourself)",
    ],
    badPrompt: "A thumbnail for a gaming video about Minecraft being scary.",
    goodPrompt:
      "Extreme close-up portrait of a terrified gamer looking up, glowing green zombie eyes reflecting in his glasses. Dark misty forest background, dramatic purple rim lighting on his face, vibrant high contrast, 3D render style.",
    whyItWorks:
      "It combines stark visual contrast (green vs purple) and high emotion (terrified). These are proven psychological triggers that YouTube viewers instinctively click on.",
    proTip:
      "Instruct the AI to 'leave empty negative space on the right side' so you have a perfectly clean canvas to drop your bold text overlays in Photoshop.",
  },
];
