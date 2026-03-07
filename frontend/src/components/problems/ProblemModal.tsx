import { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../../store/useAppStore";
import axios from "axios";

interface ProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: () => void;
}

export default function ProblemModal({ isOpen, onClose, onAdd }: ProblemModalProps) {
  const { mode, user } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    leetcodeUrl: "",
    difficulty: "Easy",
    dataStructure: "",
    algorithm: "",
    pattern: "",
    approachThought: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        "http://localhost:3000/api/problems",
        { ...formData, mode },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      onAdd();
      onClose();
      // Reset form
      setFormData({
        title: "", leetcodeUrl: "", difficulty: "Easy", dataStructure: "",
        algorithm: "", pattern: "", approachThought: ""
      });
    } catch (error) {
      console.error(error);
      alert("Failed to create problem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30">
              <h2 className="text-xl font-semibold">Log New {mode} Problem</h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-secondary transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form id="problem-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="e.g. Two Sum"
                  />
                </div>

                {mode === "DSA" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Difficulty</label>
                      <select 
                        value={formData.difficulty}
                        onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                        className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        <option>Easy</option>
                        <option>Medium</option>
                        <option>Hard</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Pattern</label>
                      <input
                        type="text"
                        value={formData.pattern}
                        onChange={(e) => setFormData({...formData, pattern: e.target.value})}
                        className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="e.g. Sliding Window"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium">Link / URL</label>
                  <input
                    type="url"
                    value={formData.leetcodeUrl}
                    onChange={(e) => setFormData({...formData, leetcodeUrl: e.target.value})}
                    className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Notes & Approach</label>
                  <textarea
                    rows={4}
                    value={formData.approachThought}
                    onChange={(e) => setFormData({...formData, approachThought: e.target.value})}
                    className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    placeholder="How did you solve this?"
                  />
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-border bg-muted/30 flex justify-end gap-3">
              <button 
                type="button" 
                onClick={onClose}
                className="px-4 py-2 rounded-lg font-medium text-muted-foreground hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                form="problem-form"
                disabled={loading}
                className="px-6 py-2 rounded-lg font-medium bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {loading ? "Saving..." : "Save Problem"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
