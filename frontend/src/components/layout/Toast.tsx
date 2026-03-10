import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, AlertTriangle, X } from "lucide-react";

export interface ToastItem {
  id: string;
  type: "success" | "error" | "warning";
  message: string;
}

interface ToastProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

const icons = {
  success: <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />,
  error: <XCircle className="w-5 h-5 text-red-400 shrink-0" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
};

const borderColors = {
  success: "border-green-500/40",
  error: "border-red-500/40",
  warning: "border-amber-500/40",
};

const bgColors = {
  success: "bg-green-500/10",
  error: "bg-red-500/10",
  warning: "bg-amber-500/10",
};

function ToastEntry({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 3500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.95 }}
      transition={{ type: "spring", damping: 22, stiffness: 300 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-sm ${bgColors[toast.type]} ${borderColors[toast.type]} bg-[#111] min-w-[280px] max-w-[360px]`}
    >
      {icons[toast.type]}
      <span className="flex-1 text-sm font-medium text-foreground">
        {toast.message}
      </span>
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-0.5 rounded-md hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

export default function Toast({ toasts, onDismiss }: ToastProps) {
  return (
    <div className="fixed bottom-5 right-5 z-200 flex flex-col gap-2 items-end pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastEntry toast={t} onDismiss={onDismiss} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
