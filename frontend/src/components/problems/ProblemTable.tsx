import { format } from "date-fns";
import { ExternalLink, Trash2 } from "lucide-react";
import axios from "axios";
import { useAppStore } from "../../store/useAppStore";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProblemTable({ problems, onRefresh, onEdit }: { problems: any[], onRefresh: () => void, onEdit?: (problem: any) => void }) {
  const { user, mode } = useAppStore();
  const [problemToDelete, setProblemToDelete] = useState<string | null>(null);

  const handleDeleteConfirm = async () => {
    if (!problemToDelete) return;
    try {
      await axios.delete(`http://localhost:3000/api/problems/${problemToDelete}`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setProblemToDelete(null);
      onRefresh();
    } catch (err) {
      console.error(err);
      alert("Failed to delete.");
    }
  };

  if (!problems.length) {
    return (
      <div className="mt-8 bg-card border border-border rounded-2xl p-6 shadow-sm min-h-[300px] flex items-center justify-center flex-col text-center">
        <h3 className="text-xl font-medium mb-2">No {mode} problems tracked yet.</h3>
        <p className="text-muted-foreground">Log your first problem to see it here.</p>
      </div>
    );
  }

  return (
    <>
    <div className="mt-8 bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="p-4 font-semibold text-sm text-foreground">Title</th>
              {mode === "DSA" && <th className="p-4 font-semibold text-sm text-foreground">Difficulty</th>}
              {mode === "DSA" && <th className="p-4 font-semibold text-sm text-foreground">Pattern</th>}
              {mode === "DEV" && <th className="p-4 font-semibold text-sm text-foreground">Tech Stack</th>}
              {mode === "DEV" && <th className="p-4 font-semibold text-sm text-foreground">Links</th>}
              {mode === "AI" && <th className="p-4 font-semibold text-sm text-foreground">Framework</th>}
              {mode === "AI" && <th className="p-4 font-semibold text-sm text-foreground">Model</th>}
              <th className="p-4 font-semibold text-sm text-foreground">Date</th>
              <th className="p-4 font-semibold text-sm text-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {problems.map((p) => (
              <tr key={p.id} className="hover:bg-muted/30 transition-colors group">
                <td className="p-4">
                  <span className="font-medium">{p.title}</span>
                  {p.leetcodeUrl && mode === "DSA" && (
                    <a href={p.leetcodeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center ml-2 text-muted-foreground hover:text-primary transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  {p.paperUrl && mode === "AI" && (
                    <a href={p.paperUrl} target="_blank" rel="noreferrer" className="inline-flex items-center ml-2 text-muted-foreground hover:text-primary transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </td>
                {mode === "DSA" && (
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      p.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                      p.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                      'bg-red-500/10 text-red-500 border-red-500/20'
                    }`}>
                      {p.difficulty || 'Unknown'}
                    </span>
                  </td>
                )}
                {mode === "DSA" && <td className="p-4 text-sm text-muted-foreground">{p.pattern || '-'}</td>}
                
                {mode === "DEV" && <td className="p-4 text-sm text-muted-foreground">{p.techStack || '-'}</td>}
                {mode === "DEV" && (
                  <td className="p-4 flex gap-2">
                    {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title="GitHub"><ExternalLink className="w-4 h-4" /></a>}
                    {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-emerald-500 transition-colors" title="Live Site"><ExternalLink className="w-4 h-4" /></a>}
                    {!p.githubUrl && !p.liveUrl && <span className="text-sm text-muted-foreground">-</span>}
                  </td>
                )}

                {mode === "AI" && <td className="p-4 text-sm text-muted-foreground">{p.framework || '-'}</td>}
                {mode === "AI" && <td className="p-4 text-sm text-muted-foreground">{p.modelUsed || '-'}</td>}
                <td className="p-4 text-sm text-muted-foreground">
                  {format(new Date(p.completedAt), "MMM d, yyyy")}
                </td>
                <td className="p-4 text-right opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-2">
                  <button onClick={() => onEdit && onEdit(p)} className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-primary/10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-edit-2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                  </button>
                  <button onClick={() => setProblemToDelete(p.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <AnimatePresence>
      {problemToDelete && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-linear-to-br from-indigo-500/30 via-purple-500/20 to-pink-500/30 dark:from-indigo-950/60 dark:via-purple-950/50 dark:to-pink-950/60 backdrop-blur-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl p-6"
          >
            <h3 className="text-xl font-semibold mb-2">Delete Problem?</h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to permanently delete this problem? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setProblemToDelete(null)}
                className="px-4 py-2 rounded-lg font-medium text-muted-foreground hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </>
  );
}
