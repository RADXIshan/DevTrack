import { format } from "date-fns";
import { ExternalLink, Trash2, Edit, CheckCircle2 } from "lucide-react";
import axios from "axios";
import { useAppStore } from "../../store/useAppStore";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from "../../config/api";

export default function ProblemTable({ problems, onRefresh, onEdit }: { problems: any[], onRefresh: () => void, onEdit?: (problem: any) => void }) {
  const { user, mode } = useAppStore();
  const [problemToDelete, setProblemToDelete] = useState<string | null>(null);

  const handleDeleteConfirm = async () => {
    if (!problemToDelete) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/problems/${problemToDelete}`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setProblemToDelete(null);
      onRefresh();
    } catch (err) {
      console.error(err);
      alert("Failed to delete.");
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    const classes = {
      Easy: "difficulty-easy",
      Medium: "difficulty-medium", 
      Hard: "difficulty-hard"
    };
    return classes[difficulty as keyof typeof classes] || "difficulty-easy";
  };

  if (!problems.length) {
    return (
      <div className="p-8 text-center">
        <div className="text-muted-foreground mb-4">
          <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
        </div>
        <h3 className="text-lg font-medium mb-2">No {mode.toLowerCase()} entries yet</h3>
        <p className="text-muted-foreground">Start tracking your progress by adding your first entry.</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="leetcode-table">
          <thead>
            <tr>
              <th className="w-8"></th>
              <th>Title</th>
              {mode === "DSA" && <th>Difficulty</th>}
              {mode === "DSA" && <th>Pattern</th>}
              {mode === "DEV" && <th>Tech Stack</th>}
              {mode === "AI" && <th>Framework</th>}
              <th>Date</th>
              <th className="w-20">Actions</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem, index) => (
              <tr key={problem.id} className="leetcode-hover">
                <td>
                  <div className="flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground text-sm">
                      {index + 1}.
                    </span>
                    <div>
                      <div className="font-medium text-foreground hover:text-primary cursor-pointer">
                        {problem.title}
                      </div>
                      {problem.approachThought && (
                        <div className="text-xs text-muted-foreground mt-1 max-w-md truncate">
                          {problem.approachThought}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                
                {mode === "DSA" && (
                  <td>
                    <span className={getDifficultyBadge(problem.difficulty)}>
                      {problem.difficulty}
                    </span>
                  </td>
                )}
                
                {mode === "DSA" && (
                  <td>
                    <span className="text-sm text-muted-foreground">
                      {problem.pattern || "—"}
                    </span>
                  </td>
                )}
                
                {mode === "DEV" && (
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {problem.techStack?.split(',').slice(0, 3).map((tech: string, i: number) => (
                        <span key={i} className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  </td>
                )}
                
                {mode === "AI" && (
                  <td>
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      {problem.framework || "—"}
                    </span>
                  </td>
                )}
                
                <td>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(problem.createdAt), "MMM d, yyyy")}
                  </span>
                </td>
                
                <td>
                  <div className="flex items-center gap-2">
                    {/* External Link */}
                    {(problem.leetcodeUrl || problem.githubUrl || problem.paperUrl) && (
                      <a
                        href={problem.leetcodeUrl || problem.githubUrl || problem.paperUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded hover:bg-muted/50 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                      </a>
                    )}
                    
                    {/* Edit */}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(problem)}
                        className="p-1 rounded hover:bg-muted/50 transition-colors"
                      >
                        <Edit className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                      </button>
                    )}
                    
                    {/* Delete */}
                    <button
                      onClick={() => setProblemToDelete(problem.id)}
                      className="p-1 rounded hover:bg-muted/50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-muted-foreground hover:text-red-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {problemToDelete && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-background border border-border rounded-lg p-6 max-w-md w-full mx-4"
            >
              <h3 className="text-lg font-semibold mb-2">Delete Entry</h3>
              <p className="text-muted-foreground mb-6">
                Are you sure you want to delete this entry? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setProblemToDelete(null)}
                  className="btn-leetcode-outline"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
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