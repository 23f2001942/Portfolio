import React from "react";
import { SolidworksIcon, RaspberryPiIcon } from "@/components/custom-icons";

type SkillIconProps = {
  name: string;
  className?: string;
};

export default function SkillIcon({ name, className }: SkillIconProps) {
  const skillKey = name.toLowerCase();

  // 1. CUSTOM ENGINEERING ICONS
  if (skillKey.includes("solidworks")) return <SolidworksIcon className={className} />;
  if (skillKey.includes("raspberry")) return <RaspberryPiIcon className={className} />;

  // 2. SKILLICONS IMAGES (Standard Web/Software Stack)
  let iconUrl = "";

  if (skillKey.includes("html")) iconUrl = "https://skillicons.dev/icons?i=html";
  else if (skillKey.includes("css")) iconUrl = "https://skillicons.dev/icons?i=css";
  else if (skillKey.includes("react")) iconUrl = "https://skillicons.dev/icons?i=react";
  else if (skillKey.includes("vue")) iconUrl = "https://skillicons.dev/icons?i=vue";
  else if (skillKey.includes("next")) iconUrl = "https://skillicons.dev/icons?i=nextjs";
  else if (skillKey.includes("node")) iconUrl = "https://skillicons.dev/icons?i=nodejs";
  else if (skillKey.includes("flask")) iconUrl = "https://skillicons.dev/icons?i=flask";
  else if (skillKey.includes("typescript")) iconUrl = "https://skillicons.dev/icons?i=ts";
  else if (skillKey.includes("javascript") || skillKey === "js") iconUrl = "https://skillicons.dev/icons?i=js";
  else if (skillKey.includes("python")) iconUrl = "https://skillicons.dev/icons?i=py";
  else if (skillKey.includes("tensorflow")) iconUrl = "https://skillicons.dev/icons?i=tensorflow";
  else if (skillKey.includes("pytorch")) iconUrl = "https://skillicons.dev/icons?i=pytorch";
  else if (skillKey.includes("opencv")) iconUrl = "https://skillicons.dev/icons?i=opencv";
  else if (skillKey.includes("matlab")) iconUrl = "https://skillicons.dev/icons?i=matlab";
  else if (skillKey.includes("arduino")) iconUrl = "https://skillicons.dev/icons?i=arduino";
  
  // DevIcons for Data Science (looks better)
  else if (skillKey.includes("numpy")) iconUrl = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg";
  else if (skillKey.includes("pandas")) iconUrl = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg";
  else if (skillKey.includes("matplotlib")) iconUrl = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matplotlib/matplotlib-original.svg";

  if (iconUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={iconUrl} alt={name} className={className} style={{ objectFit: "contain" }} />
    );
  }

  // Fallback
  return <div className={`bg-gray-200 rounded-full ${className}`} />;
}
