import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Check } from "lucide-react";
import gameplayMinecraft from "@/assets/gameplay-minecraft.jpg";
import gameplayGta from "@/assets/gameplay-gta.jpg";
import gameplaySubway from "@/assets/gameplay-subway.jpg";
import gameplayTemple from "@/assets/gameplay-temple.jpg";
import gameplaySatisfying from "@/assets/gameplay-satisfying.jpg";

const categories = [
  {
    id: "minecraft",
    label: "Minecraft Parkour",
    image: gameplayMinecraft,
    videos: [
      { id: "minecraft-1", label: "Minecraft 1" },
      { id: "minecraft-2", label: "Minecraft 2" },
      { id: "minecraft-3", label: "Minecraft 3" },
      { id: "minecraft-4", label: "Minecraft 4" },
      { id: "minecraft-5", label: "Minecraft 5" },
      { id: "minecraft-6", label: "Minecraft 6" },
      { id: "minecraft-7", label: "Minecraft 7" },
      { id: "minecraft-8", label: "Minecraft 8" },
      { id: "minecraft-9", label: "Minecraft 9" },
      { id: "minecraft-10", label: "Minecraft 10" },
      { id: "minecraft-11", label: "Minecraft 11" },
      { id: "minecraft-12", label: "Minecraft 12" },
      { id: "minecraft-13", label: "Minecraft 13" },
    ],
  },
  {
    id: "gta",
    label: "GTA V Freeroam",
    image: gameplayGta,
    videos: [
      { id: "gta-1", label: "GTA V 1" },
      { id: "gta-2", label: "GTA V 2" },
      { id: "gta-3", label: "GTA V 3" },
      { id: "gta-4", label: "GTA V 4" },
      { id: "gta-5", label: "GTA V 5" },
      { id: "gta-6", label: "GTA V 6" },
      { id: "gta-7", label: "GTA V 7" },
      { id: "gta-8", label: "GTA V 8" },
      { id: "gta-9", label: "GTA V 9" },
    ],
  },
  {
    id: "subway",
    label: "Subway Surfers",
    image: gameplaySubway,
    videos: [
      { id: "subway-1", label: "Subway Surfers 1" },
      { id: "subway-2", label: "Subway Surfers 2" },
      { id: "subway-3", label: "Subway Surfers 3" },
    ],
  },
  {
    id: "temple",
    label: "Temple Run",
    image: gameplayTemple,
    note: "⚠️ Primeiros 12s cortados automaticamente",
    videos: [
      { id: "temple-1", label: "Temple Run" },
    ],
  },
  {
    id: "satisfying",
    label: "Satisfying",
    image: gameplaySatisfying,
    videos: [
      { id: "satisfying-1", label: "Slicing ASMR" },
      { id: "satisfying-2", label: "Sand Cutting" },
      { id: "satisfying-3", label: "Soap Crush" },
      { id: "satisfying-4", label: "Color Sort" },
      { id: "satisfying-5", label: "Ball Run" },
    ],
  },
];

interface Props {
  selected: string;
  onSelect: (id: string) => void;
}

const SectionBackground = ({ selected, onSelect }: Props) => {
  const selectedCatFromVideo = categories.find((c) => c.videos.some((v) => v.id === selected));
  const [expandedCat, setExpandedCat] = useState<string | null>(selectedCatFromVideo?.id || null);

  const expanded = categories.find((c) => c.id === expandedCat);

  if (expanded) {
    return (
      <div className="space-y-2">
        <button
          onClick={() => setExpandedCat(null)}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-3 h-3" />
          Voltar
        </button>
        <p className="text-xs font-medium">{expanded.label}</p>
        {expanded.note && <p className="text-xs text-primary">{expanded.note}</p>}
        <div className="grid grid-cols-2 gap-2">
          {expanded.videos.map((v) => (
            <button
              key={v.id}
              onClick={() => onSelect(v.id)}
              className={`relative rounded-lg overflow-hidden aspect-video border-2 transition-all text-xs font-medium ${
                selected === v.id ? "border-primary" : "border-border hover:border-primary/40"
              }`}
            >
              <img src={expanded.image} alt={v.label} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <span className="absolute bottom-1 left-1.5 text-white">{v.label}</span>
              {selected === v.id && (
                <div className="absolute top-1 right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {categories.map((cat) => {
        const isSelected = cat.id === selected || cat.videos.some((v) => v.id === selected);
        return (
          <button
            key={cat.id}
            onClick={() => setExpandedCat(cat.id)}
            className={`relative rounded-lg overflow-hidden aspect-[3/4] border-2 transition-all group ${
              isSelected ? "border-primary" : "border-border hover:border-primary/40"
            }`}
          >
            <img
              src={cat.image}
              alt={cat.label}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <span className="absolute bottom-1 left-1 text-[10px] font-bold text-white leading-tight">
              {cat.label}
            </span>
            {isSelected && (
              <div className="absolute top-1 right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-primary-foreground" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default SectionBackground;
