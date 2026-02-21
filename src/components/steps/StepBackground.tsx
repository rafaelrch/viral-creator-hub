import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
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
      { id: "minecraft-1", label: "Parkour Clássico", image: gameplayMinecraft },
      { id: "minecraft-2", label: "Speed Bridge", image: gameplayMinecraft },
      { id: "minecraft-3", label: "Skyblock Run", image: gameplayMinecraft },
      { id: "minecraft-4", label: "Lava Escape", image: gameplayMinecraft },
      { id: "minecraft-5", label: "Nether Parkour", image: gameplayMinecraft },
    ],
  },
  {
    id: "gta",
    label: "GTA V Freeroam",
    image: gameplayGta,
    videos: [
      { id: "gta-1", label: "Freeroam Noturno", image: gameplayGta },
      { id: "gta-2", label: "Corrida de Carros", image: gameplayGta },
      { id: "gta-3", label: "Stunts de Moto", image: gameplayGta },
      { id: "gta-4", label: "Perseguição Policial", image: gameplayGta },
      { id: "gta-5", label: "Voo Livre", image: gameplayGta },
    ],
  },
  {
    id: "subway",
    label: "Subway Surfers",
    image: gameplaySubway,
    videos: [
      { id: "subway-1", label: "Nova York", image: gameplaySubway },
      { id: "subway-2", label: "Tóquio", image: gameplaySubway },
      { id: "subway-3", label: "Paris", image: gameplaySubway },
      { id: "subway-4", label: "Mumbai", image: gameplaySubway },
      { id: "subway-5", label: "Cairo", image: gameplaySubway },
    ],
  },
  {
    id: "temple",
    label: "Temple Run",
    image: gameplayTemple,
    videos: [
      { id: "temple-1", label: "Templo Original", image: gameplayTemple },
      { id: "temple-2", label: "Floresta Sombria", image: gameplayTemple },
      { id: "temple-3", label: "Ruínas Antigas", image: gameplayTemple },
      { id: "temple-4", label: "Vulcão", image: gameplayTemple },
      { id: "temple-5", label: "Gelo Infinito", image: gameplayTemple },
    ],
  },
  {
    id: "satisfying",
    label: "Satisfying Gameplay",
    image: gameplaySatisfying,
    videos: [
      { id: "satisfying-1", label: "Slicing ASMR", image: gameplaySatisfying },
      { id: "satisfying-2", label: "Sand Cutting", image: gameplaySatisfying },
      { id: "satisfying-3", label: "Soap Crush", image: gameplaySatisfying },
      { id: "satisfying-4", label: "Color Sort", image: gameplaySatisfying },
      { id: "satisfying-5", label: "Ball Run", image: gameplaySatisfying },
    ],
  },
];

interface StepBackgroundProps {
  selected: string;
  onSelect: (id: string) => void;
}

const StepBackground = ({ selected, onSelect }: StepBackgroundProps) => {
  // Find if selected is a sub-video
  const selectedCategory = categories.find(
    (c) => c.id === selected || c.videos.some((v) => v.id === selected)
  );
  const isInSubView = selectedCategory && categories.some((c) => c.videos.some((v) => v.id === selected));

  // Track which category is expanded
  const [expandedCategory, setExpandedCategory] = useState<string | null>(
    isInSubView ? selectedCategory?.id || null : null
  );

  // Need useState import
  const handleCategoryClick = (catId: string) => {
    setExpandedCategory(catId);
  };

  const handleBack = () => {
    setExpandedCategory(null);
  };

  const expandedCat = categories.find((c) => c.id === expandedCategory);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Escolha o Background</h2>
        <p className="text-muted-foreground">
          {expandedCat
            ? `Selecione um vídeo de ${expandedCat.label}`
            : "Selecione a categoria de gameplay"}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!expandedCat ? (
          <motion.div
            key="categories"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
          >
            {categories.map((cat) => {
              const isSelected = cat.id === selected || cat.videos.some((v) => v.id === selected);
              return (
                <motion.button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className={`group relative rounded-xl overflow-hidden aspect-[9/16] border-2 transition-all ${
                    isSelected
                      ? "border-primary neon-glow"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-sm font-bold text-foreground">{cat.label}</p>
                    <p className="text-xs text-muted-foreground">{cat.videos.length} vídeos</p>
                  </div>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                    >
                      <span className="text-xs">✓</span>
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key="videos"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Voltar às categorias
            </button>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {expandedCat.videos.map((video) => (
                <motion.button
                  key={video.id}
                  onClick={() => onSelect(video.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className={`group relative rounded-xl overflow-hidden aspect-[9/16] border-2 transition-all ${
                    selected === video.id
                      ? "border-primary neon-glow"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <img
                    src={video.image}
                    alt={video.label}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-sm font-bold text-foreground">{video.label}</p>
                  </div>
                  {selected === video.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                    >
                      <span className="text-xs">✓</span>
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Need to add useState import
import { useState } from "react";

export default StepBackground;
