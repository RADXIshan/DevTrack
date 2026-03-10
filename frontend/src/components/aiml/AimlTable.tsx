import { format } from "date-fns";
import { ExternalLink, Trash2, Edit, CheckCircle2 } from "lucide-react";
import axios from "axios";
import { useAppStore } from "../../store/useAppStore";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from "../../config/api";

interface Props { entries: any[]; onRefresh: () => void; onEdit?: (entry: any) => void; }

export default function AimlTable({ entries, onRefresh, onEdit }: Props) {
  const { user } = useAppStore();
  const [toDelete, setToDelete] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/aiml/${toDelete}`, { headers: { Authorization: `Bearer ${user?.token}` } });
      setToDelete(null); onRefresh();
    } catch { alert("Failed to delete."); }
  };

  if (!entries.length) return (
    <motion.div className="p-8 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
      <h3 className="text-lg font-medium mb-2">No AI/ML entries yet</h3>
      <p className="text-muted-foreground">Start tracking your ML research and implementations.</p>
    </motion.div>
  );

  return (
    <>
      <div className="overflow-x-auto">
        <table className="leetcode-table">
          <thead>
            <tr>
              <th className="w-8"></th>
              <th>Title</th>
              <th>Algorithm</th>
              <th>Library / Framework</th>
              <th>Model</th>
              <th>Date</th>
              <th className="w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, i) => (
              <motion.tr key={entry.id} className="leetcode-hover" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }}>
                <td><div className="flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-cyan-400" /></div></td>
                <td>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground text-sm">{i + 1}.</span>
                    <div>
                      <div className="font-medium text-foreground">{entry.title}</div>
                      {entry.keyFindings && <div className="text-xs text-muted-foreground mt-0.5 max-w-xs truncate">{entry.keyFindings}</div>}
                    </div>
                  </div>
                </td>
                <td><span className="text-sm text-muted-foreground">{entry.algorithm || "—"}</span></td>
                <td>
                  <div className="flex flex-wrap gap-1">
                    {entry.library && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">{entry.library}</span>}
                    {entry.framework && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-violet-500/10 text-violet-400 border border-violet-500/20">{entry.framework}</span>}
                  </div>
                </td>
                <td><span className="text-sm text-muted-foreground">{entry.modelUsed || "—"}</span></td>
                <td><span className="text-sm text-muted-foreground">{format(new Date(entry.completedAt), "MMM d, yyyy")}</span></td>
                <td>
                  <div className="flex items-center gap-2">
                    {entry.paperUrl && (
                      <motion.a href={entry.paperUrl} target="_blank" rel="noopener noreferrer" className="p-1 rounded hover:bg-muted/50" whileHover={{ scale: 1.2 }}>
                        <ExternalLink className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                      </motion.a>
                    )}
                    {onEdit && <motion.button onClick={() => onEdit(entry)} className="p-1 rounded hover:bg-muted/50" whileHover={{ scale: 1.2 }}><Edit className="w-4 h-4 text-muted-foreground" /></motion.button>}
                    <motion.button onClick={() => setToDelete(entry.id)} className="p-1 rounded hover:bg-muted/50" whileHover={{ scale: 1.2 }}><Trash2 className="w-4 h-4 text-muted-foreground hover:text-red-400" /></motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      <AnimatePresence>
        {toDelete && (
          <motion.div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-background border border-border rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
              <h3 className="text-lg font-semibold mb-2">Delete Entry</h3>
              <p className="text-muted-foreground mb-6">Are you sure? This action cannot be undone.</p>
              <div className="flex gap-3 justify-end">
                <motion.button onClick={() => setToDelete(null)} className="btn-leetcode-outline" whileHover={{ scale: 1.05 }}>Cancel</motion.button>
                <motion.button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium" whileHover={{ scale: 1.05 }}>Delete</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
