import { motion } from "framer-motion";
import { Check } from "lucide-react";

const steps = [
  "Background",
  "Tema",
  "Descrição",
  "Narração",
  "Legendas",
  "Preview",
  "Download",
];

interface StepProgressProps {
  currentStep: number;
}

const StepProgress = ({ currentStep }: StepProgressProps) => {
  return (
    <div className="flex items-center justify-center gap-1 py-6">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === currentStep;
        const isDone = stepNum < currentStep;

        return (
          <div key={i} className="flex items-center gap-1">
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                  isDone
                    ? "bg-primary border-primary text-primary-foreground"
                    : isActive
                    ? "border-primary text-primary neon-glow"
                    : "border-border text-muted-foreground"
                }`}
                animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {isDone ? <Check className="w-4 h-4" /> : stepNum}
              </motion.div>
              <span
                className={`text-[10px] font-medium hidden sm:block ${
                  isActive ? "text-primary" : isDone ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-8 h-0.5 mb-5 ${
                  isDone ? "bg-primary" : "bg-border"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepProgress;
