import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../../store/useAppStore";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";
import Toast from "../layout/Toast";
import { useToast } from "../../lib/useToast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: () => void;
  initialData?: any;
}

const inputClass = "w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent";
const labelClass = "block text-sm font-medium text-foreground mb-2";

export default function DsaModal({ isOpen, onClose, onAdd, initialData }: Props) {
  const { user } = useAppStore();
  const { toasts, dismiss, toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "", difficulty: "Easy", dataStructure: "", algorithm: "",
    timeComplexity: "", spaceComplexity: "", leetcodeUrl: "", approachThought: "",
  });

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData ? {
        title: initialData.title || "",
        difficulty: initialData.difficulty || "Easy",
        dataStructure: initialData.dataStructure || "",
        algorithm: initialData.algorithm || "",
        timeComplexity: initialData.timeComplexity || "",
        spaceComplexity: initialData.spaceComplexity || "",
        leetcodeUrl: initialData.leetcodeUrl || "",
        approachThought: initialData.approachThought || "",
      } : { title: "", difficulty: "Easy", dataStructure: "", algorithm: "", timeComplexity: "", spaceComplexity: "", leetcodeUrl: "", approachThought: "" });
    }
  }, [initialData, isOpen]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen && !loading) onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [isOpen, loading, onClose]);

  const set = (k: string, v: string) => setFormData(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (initialData) {
        await axios.put(`${API_BASE_URL}/api/dsa/${initialData.id}`, formData, { headers: { Authorization: `Bearer ${user?.token}` } });
        toast("success", "DSA problem updated successfully!");
      } else {
        await axios.post(`${API_BASE_URL}/api/dsa`, formData, { headers: { Authorization: `Bearer ${user?.token}` } });
        toast("success", "DSA problem added successfully!");
      }
      onAdd(); onClose();
    } catch (err) { console.error(err); toast("error", "Failed to save entry. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <>
    <Toast toasts={toasts} onDismiss={dismiss} />
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="bg-background border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">{initialData ? "Edit" : "Add"} DSA Problem</h2>
              <motion.button onClick={onClose} disabled={loading} className="p-2 rounded-md hover:bg-muted/50 transition-colors" whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}>
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-140px)] custom-scrollbar">
              {/* Title */}
              <div>
                <label className={labelClass}>Title *</label>
                <input type="text" required value={formData.title} onChange={e => set("title", e.target.value)} className={inputClass} placeholder="Two Sum, Binary Search..." />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Difficulty</label>
                  <select value={formData.difficulty} onChange={e => set("difficulty", e.target.value)} className={inputClass}>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>LeetCode URL</label>
                  <input type="url" value={formData.leetcodeUrl} onChange={e => set("leetcodeUrl", e.target.value)} className={inputClass} placeholder="https://leetcode.com/problems/..." />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Data Structure</label>
                  <input type="text" value={formData.dataStructure} onChange={e => set("dataStructure", e.target.value)} className={inputClass} placeholder="Array, Hash Map, Tree, Graph..." />
                </div>
                <div>
                  <label className={labelClass}>Algorithm / Pattern</label>
                  <input type="text" value={formData.algorithm} onChange={e => set("algorithm", e.target.value)} className={inputClass} placeholder="Two Pointers, BFS, Dynamic Programming..." />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Time Complexity</label>
                  <input type="text" value={formData.timeComplexity} onChange={e => set("timeComplexity", e.target.value)} className={inputClass} placeholder="O(n), O(n log n), O(1)..." />
                </div>
                <div>
                  <label className={labelClass}>Space Complexity</label>
                  <input type="text" value={formData.spaceComplexity} onChange={e => set("spaceComplexity", e.target.value)} className={inputClass} placeholder="O(n), O(log n), O(1)..." />
                </div>
              </div>

              <div>
                <label className={labelClass}>Approach & Notes</label>
                <textarea value={formData.approachThought} onChange={e => set("approachThought", e.target.value)} rows={4} className={`${inputClass} resize-none`} placeholder="Explain your approach, key insights, edge cases..." />
              </div>
            </form>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
              <motion.button type="button" onClick={onClose} disabled={loading} className="btn-leetcode-outline disabled:opacity-50" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Cancel</motion.button>
              <motion.button type="submit" onClick={handleSubmit} disabled={loading} className="btn-leetcode disabled:opacity-50 flex items-center gap-2" whileHover={{ scale: loading ? 1 : 1.05 }} whileTap={{ scale: loading ? 1 : 0.95 }}>
                {loading ? <><div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />Saving...</> : <><Save className="w-4 h-4" />{initialData ? "Update" : "Save"}</>}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
