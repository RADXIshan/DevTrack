import { useState, useEffect } from "react";
import { X } from "lucide-react";
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
              <h2 className="text-xl font-semibold">{initialData ? "Edit" : "Log New"} {mode} Problem</h2>
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

                {mode === "DSA" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">LeetCode Link / URL</label>
                    <input
                      type="url"
                      value={formData.leetcodeUrl}
                      onChange={(e) => setFormData({...formData, leetcodeUrl: e.target.value})}
                      className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="https://..."
                    />
                  </div>
                )}
                
                {mode === "DEV" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Tech Stack</label>
                        <input
                          type="text"
                          value={formData.techStack}
                          onChange={(e) => setFormData({...formData, techStack: e.target.value})}
                          className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                          placeholder="e.g. Next.js, Node"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Live URL</label>
                        <input
                          type="url"
                          value={formData.liveUrl}
                          onChange={(e) => setFormData({...formData, liveUrl: e.target.value})}
                          className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">GitHub Repository</label>
                      <input
                        type="url"
                        value={formData.githubUrl}
                        onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
                        className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="https://github.com/..."
                      />
                    </div>
                  </>
                )}

                {mode === "AI" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Framework</label>
                        <input
                          type="text"
                          value={formData.framework}
                          onChange={(e) => setFormData({...formData, framework: e.target.value})}
                          className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                          placeholder="e.g. PyTorch, TensorFlow"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Model Used</label>
                        <input
                          type="text"
                          value={formData.modelUsed}
                          onChange={(e) => setFormData({...formData, modelUsed: e.target.value})}
                          className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                          placeholder="e.g. Llama-3, GPT-4"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Paper/Resource URL</label>
                      <input
                        type="url"
                        value={formData.paperUrl}
                        onChange={(e) => setFormData({...formData, paperUrl: e.target.value})}
                        className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="https://arxiv.org/..."
                      />
                    </div>
                  </>
                )}

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
                {loading ? "Saving..." : initialData ? "Update Problem" : "Save Problem"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
