import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../../store/useAppStore";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

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
          `${API_BASE_URL}/api/problems/${initialData.id}`,
          { ...formData, mode },
          { headers: { Authorization: `Bearer ${user?.token}` } }
        );
      } else {
        await axios.post(
          `${API_BASE_URL}/api/problems`,
          { ...formData, mode },
          { headers: { Authorization: `Bearer ${user?.token}` } }
        );
      }
      onAdd();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save problem.");
    } finally {
      setLoading(false);
    }
  };

  const getModalTitle = () => {
    const action = initialData ? "Edit" : "Add";
    switch(mode) {
      case "DSA": return `${action} Problem`;
      case "DEV": return `${action} Project`;
      case "AI": return `${action} Research`;
      default: return `${action} Entry`;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-background border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">{getModalTitle()}</h2>
              <button
                onClick={onClose}
                disabled={loading}
                className="p-2 rounded-md hover:bg-muted/50 transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)] custom-scrollbar">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder={mode === "DSA" ? "Two Sum" : mode === "DEV" ? "E-commerce Platform" : "GPT-4 Architecture Analysis"}
                />
              </div>

              {/* DSA Fields */}
              {mode === "DSA" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Difficulty
                      </label>
                      <select
                        value={formData.difficulty}
                        onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                        className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        LeetCode URL
                      </label>
                      <input
                        type="url"
                        value={formData.leetcodeUrl}
                        onChange={(e) => setFormData({ ...formData, leetcodeUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="https://leetcode.com/problems/..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Data Structure
                      </label>
                      <input
                        type="text"
                        value={formData.dataStructure}
                        onChange={(e) => setFormData({ ...formData, dataStructure: e.target.value })}
                        className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Array, Hash Table, Tree..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Algorithm/Pattern
                      </label>
                      <input
                        type="text"
                        value={formData.pattern}
                        onChange={(e) => setFormData({ ...formData, pattern: e.target.value })}
                        className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Two Pointers, Sliding Window..."
                      />
                    </div>
                  </div>
                </>
              )}

              {/* DEV Fields */}
              {mode === "DEV" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        GitHub URL
                      </label>
                      <input
                        type="url"
                        value={formData.githubUrl}
                        onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="https://github.com/..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Live URL
                      </label>
                      <input
                        type="url"
                        value={formData.liveUrl}
                        onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="https://myproject.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Tech Stack
                    </label>
                    <input
                      type="text"
                      value={formData.techStack}
                      onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                      className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="React, Node.js, PostgreSQL, Docker..."
                    />
                  </div>
                </>
              )}

              {/* AI Fields */}
              {mode === "AI" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Paper/Resource URL
                      </label>
                      <input
                        type="url"
                        value={formData.paperUrl}
                        onChange={(e) => setFormData({ ...formData, paperUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="https://arxiv.org/..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Framework
                      </label>
                      <input
                        type="text"
                        value={formData.framework}
                        onChange={(e) => setFormData({ ...formData, framework: e.target.value })}
                        className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="TensorFlow, PyTorch, Hugging Face..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Model Used
                    </label>
                    <input
                      type="text"
                      value={formData.modelUsed}
                      onChange={(e) => setFormData({ ...formData, modelUsed: e.target.value })}
                      className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="GPT-4, BERT, ResNet-50..."
                    />
                  </div>
                </>
              )}

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.approachThought}
                  onChange={(e) => setFormData({ ...formData, approachThought: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder={mode === "DSA" ? "Approach, time/space complexity, key insights..." : mode === "DEV" ? "Architecture decisions, challenges faced, lessons learned..." : "Key findings, methodology, results..."}
                />
              </div>
            </form>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="btn-leetcode-outline disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="btn-leetcode disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {initialData ? "Update" : "Save"}
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