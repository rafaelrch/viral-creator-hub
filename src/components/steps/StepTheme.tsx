import { motion } from "framer-motion";

const themes = [
  { id: "curiosidades", icon: "🌍", label: "Curiosidades do Mundo", desc: "Fatos surpreendentes sobre o planeta" },
  { id: "psicologia", icon: "🧠", label: "Psicologia Sombria", desc: "O lado obscuro da mente humana" },
  { id: "perturbadores", icon: "💀", label: "Fatos Perturbadores", desc: "Verdades que vão te arrepiar" },
  { id: "conspiracoes", icon: "👁️", label: "Conspirações", desc: "Teorias que mudam tudo" },
  { id: "ricos", icon: "💰", label: "Segredos dos Ricos", desc: "O que os milionários escondem" },
  { id: "crimes", icon: "🔪", label: "Crimes Famosos", desc: "Casos reais que chocaram o mundo" },
];

interface StepThemeProps {
  selected: string;
  onSelect: (id: string) => void;
}

const StepTheme = ({ selected, onSelect }: StepThemeProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Escolha o Tema</h2>
        <p className="text-muted-foreground">Qual tipo de conteúdo você quer criar?</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
        {themes.map((theme, i) => (
          <motion.button
            key={theme.id}
            onClick={() => onSelect(theme.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`glass-panel p-5 text-left transition-all ${
              selected === theme.id
                ? "border-primary neon-glow"
                : "hover:border-primary/40"
            }`}
          >
            <span className="text-3xl">{theme.icon}</span>
            <h3 className="font-bold mt-2">{theme.label}</h3>
            <p className="text-sm text-muted-foreground mt-1">{theme.desc}</p>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default StepTheme;
