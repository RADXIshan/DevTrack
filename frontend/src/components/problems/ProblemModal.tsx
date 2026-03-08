import { useState, useEffect } from "react";
import { X, Save, Edit3, Code2, LayoutDashboard, BrainCircuit, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../../store/useAppStore";
import axios from "axios";

interface ProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: () => void;
  initialData?: any;
}

export default function ProblemModal({ isOpen, onClose, onAdd, initialData }: ProblemModalProps) {
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
    // DEV fields
    githubUrl: "",
    liveUrl: "",
    techStack: "",
    // AI fields
    paperUrl: "",
    modelUsed: "",
    framework: "",
  });

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        title: initialData.title || "",
        leetcodeUrl: initialData.leetcodeUrl || "",
        difficulty: initialData.difficulty || "Easy",
        dataStructure: initialData.dataStructure || "",
        algorithm: initialData.algorithm || "",
        pattern: initialData.pattern || "",
        approachThought: initialData.approachThought || "",
        githubUrl: initialData.githubUrl || "",
        liveUrl: initialData.liveUrl || "",
        techStack: initialData.techStack || "",
        paperUrl: initialData.paperUrl || "",
        modelUsed: initialData.modelUsed || "",
        framework: initialData.framework || "",
      });
    } else if (isOpen) {
      setFormData({
        title: "", leetcodeUrl: "", difficulty: "Easy", dataStructure: "",
        algorithm: "", pattern: "", approachThought: "",
        githubUrl: "", liveUrl: "", techStack: "",
        paperUrl: "", modelUsed: "", framework: ""
      });
    }
  }, [initialData, isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !loading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, loading, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (initialData) {
        await axios.put(
          `http://localhost:3000/api/problems/${initialData.id}`,
          { ...formData, mode },
          { headers: { Authorization: `Bearer ${user?.token}` } }
        );
      } else {
        await axios.post(
          "http://localhost:3000/api/problems",
          { ...formData, mode },
          { headers: { Authorization: `Bearer ${user?.token}` } }
        );
      }
      onAdd();
      onAdd();
      onClose();
    } catch (error) {
      console.error(error);
      alert(initialData ? "Failed to update problem" : "Failed to create problem");
    } finally {
      setLoading(false);
    }
  };

  const ModeIcon = mode === "DSA" ? Code2 : mode === "DEV" ? LayoutDashboard : BrainCircuit;

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 bg-zinc-950/60 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget && !loading) {
              onClose();
            }
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-zinc-900 dark:bg-zinc-100" />

            <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
                  <ModeIcon className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                  {initialData ? "Edit" : "Log New"} {mode}
                </h2>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 rounded-full text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar bg-white dark:bg-zinc-950">
              <form id="problem-form" onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-500/50 text-zinc-900 dark:text-white transition-all shadow-sm"
                    placeholder="e.g. Two Sum"
                  />
                </div>

                {mode === "DSA" && (
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Difficulty</label>
                      <div className="relative">
                        <select 
                          value={formData.difficulty}
                          onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                          className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-500/50 text-zinc-900 dark:text-white transition-all shadow-sm appearance-none pr-10"
                        >
                          <option>Easy</option>
                          <option>Medium</option>
                          <option>Hard</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 dark:text-zinc-400 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Pattern</label>
                      <input
                        type="text"
                        value={formData.pattern}
                        onChange={(e) => setFormData({...formData, pattern: e.target.value})}
                        className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-500/50 text-zinc-900 dark:text-white transition-all shadow-sm"
                        placeholder="e.g. Sliding Window"
                      />
                    </div>
                  </div>
                )}

                {mode === "DSA" && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">LeetCode Link</label>
                    <input
                      type="url"
                      value={formData.leetcodeUrl}
                      onChange={(e) => setFormData({...formData, leetcodeUrl: e.target.value})}
                      className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-500/50 text-zinc-900 dark:text-white transition-all shadow-sm"
                      placeholder="https://leetcode.com/..."
                    />
                  </div>
                )}
                
                {mode === "DEV" && (
                  <>
                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Tech Stack</label>
                        <input
                          type="text"
                          value={formData.techStack}
                          onChange={(e) => setFormData({...formData, techStack: e.target.value})}
                          className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-500/50 text-zinc-900 dark:text-white transition-all shadow-sm"
                          placeholder="e.g. Next.js, Node"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Live URL</label>
                        <input
                          type="url"
                          value={formData.liveUrl}
                          onChange={(e) => setFormData({...formData, liveUrl: e.target.value})}
                          className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-500/50 text-zinc-900 dark:text-white transition-all shadow-sm"
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">GitHub Repository</label>
                      <input
                        type="url"
                        value={formData.githubUrl}
                        onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
                        className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-500/50 text-zinc-900 dark:text-white transition-all shadow-sm"
                        placeholder="https://github.com/..."
                      />
                    </div>
                  </>
                )}

                {mode === "AI" && (
                  <>
                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Framework</label>
                        <input
                          type="text"
                          value={formData.framework}
                          onChange={(e) => setFormData({...formData, framework: e.target.value})}
                          className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-500/50 text-zinc-900 dark:text-white transition-all shadow-sm"
                          placeholder="e.g. PyTorch, TensorFlow"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Model Used</label>
                        <input
                          type="text"
                          value={formData.modelUsed}
                          onChange={(e) => setFormData({...formData, modelUsed: e.target.value})}
                          className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-500/50 text-zinc-900 dark:text-white transition-all shadow-sm"
                          placeholder="e.g. Llama-3, GPT-4"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Paper/Resource URL</label>
                      <input
                        type="url"
                        value={formData.paperUrl}
                        onChange={(e) => setFormData({...formData, paperUrl: e.target.value})}
                        className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-500/50 text-zinc-900 dark:text-white transition-all shadow-sm"
                        placeholder="https://arxiv.org/..."
                      />
                    </div>
                  </>
                )}

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Notes & Approach</label>
                  <textarea
                    rows={4}
                    value={formData.approachThought}
                    onChange={(e) => setFormData({...formData, approachThought: e.target.value})}
                    className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-500/50 text-zinc-900 dark:text-white transition-all shadow-sm resize-none"
                    placeholder="Document your thought process, approach, or key learnings..."
                  />
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 shrink-0 flex justify-end gap-3 w-full">
              <button 
                type="button" 
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl font-semibold text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                form="problem-form"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl font-semibold bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-zinc-500/20"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    {initialData ? <Edit3 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {initialData ? "Save Changes" : "Log Problem"}
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
