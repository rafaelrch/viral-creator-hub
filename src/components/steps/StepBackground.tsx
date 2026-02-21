import { motion } from "framer-motion";
import gameplayMinecraft from "@/assets/gameplay-minecraft.jpg";
import gameplayGta from "@/assets/gameplay-gta.jpg";
import gameplaySubway from "@/assets/gameplay-subway.jpg";
import gameplayTemple from "@/assets/gameplay-temple.jpg";
import gameplaySatisfying from "@/assets/gameplay-satisfying.jpg";

const backgrounds = [
  { id: "minecraft", label: "Minecraft Parkour", image: gameplayMinecraft },
  { id: "gta", label: "GTA V Freeroam", image: gameplayGta },
  { id: "subway", label: "Subway Surfers", image: gameplaySubway },
  { id: "temple", label: "Temple Run", image: gameplayTemple },
  { id: "satisfying", label: "Satisfying Gameplay", image: gameplaySatisfying },
];

interface StepBackgroundProps {
  selected: string;
  onSelect: (id: string) => void;
}

const StepBackground = ({ selected, onSelect }: StepBackgroundProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Escolha o Background</h2>
        <p className="text-muted-foreground">Selecione o gameplay que vai rodar no fundo do vídeo</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {backgrounds.map((bg) => (
          <motion.button
            key={bg.id}
            onClick={() => onSelect(bg.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className={`group relative rounded-xl overflow-hidden aspect-[9/16] border-2 transition-all ${
              selected === bg.id
                ? "border-primary neon-glow"
                : "border-border hover:border-primary/50"
            }`}
          >
            <img
              src={bg.image}
              alt={bg.label}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="text-sm font-bold text-foreground">{bg.label}</p>
            </div>
            {selected === bg.id && (
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
  );
};

export default StepBackground;
