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
      { id: "minecraft-1", label: "Parkour Clássico" },
      { id: "minecraft-2", label: "Speed Bridge" },
      { id: "minecraft-3", label: "Skyblock Run" },
      { id: "minecraft-4", label: "Lava Escape" },
      { id: "minecraft-5", label: "Nether Parkour" },
    ],
  },
  {
    id: "gta",
    label: "GTA V Freeroam",
    image: gameplayGta,
    videos: [
      { id: "gta-1", label: "Freeroam Noturno" },
      { id: "gta-2", label: "Corrida de Carros" },
      { id: "gta-3", label: "Stunts de Moto" },
      { id: "gta-4", label: "Perseguição Policial" },
      { id: "gta-5", label: "Voo Livre" },
    ],
  },
  {
    id: "subway",
    label: "Subway Surfers",
    image: gameplaySubway,
    videos: [
      { id: "subway-1", label: "Nova York" },
      { id: "subway-2", label: "Tóquio" },
      { id: "subway-3", label: "Paris" },
      { id: "subway-4", label: "Mumbai" },
      { id: "subway-5", label: "Cairo" },
    ],
  },
  {
    id: "temple",
    label: "Temple Run",
    image: gameplayTemple,
    note: "⚠️ Primeiros 12s cortados automaticamente",
    videos: [
      { id: "temple-1", label: "Templo Original" },
      { id: "temple-2", label: "Floresta Sombria" },
      { id: "temple-3", label: "Ruínas Antigas" },
      { id: "temple-4", label: "Vulcão" },
      { id: "temple-5", label: "Gelo Infinito" },
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
