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
      <motion.div 
        className="p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="text-muted-foreground mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
        </motion.div>
        <h3 className="text-lg font-medium mb-2">No {mode.toLowerCase()} entries yet</h3>
        <p className="text-muted-foreground">Start tracking your progress by adding your first entry.</p>
      </motion.div>
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
              <motion.tr 
                key={problem.id} 
                className="leetcode-hover"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.03)" }}
              >
                <td>
                  <div className="flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.05 + 0.2, type: "spring" }}
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    </motion.div>
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
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
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
                      <motion.a
                        href={problem.leetcodeUrl || problem.githubUrl || problem.paperUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded hover:bg-muted/50 transition-colors"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ExternalLink className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                      </motion.a>
                    )}
                    
                    {/* Edit */}
                    {onEdit && (
                      <motion.button
                        onClick={() => onEdit(problem)}
                        className="p-1 rounded hover:bg-muted/50 transition-colors"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Edit className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                      </motion.button>
                    )}
                    
                    {/* Delete */}
                    <motion.button
                      onClick={() => setProblemToDelete(problem.id)}
                      className="p-1 rounded hover:bg-muted/50 transition-colors"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 className="w-4 h-4 text-muted-foreground hover:text-red-400" />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {problemToDelete && (
          <motion.div 
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-background border border-border rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl"
            >
              <h3 className="text-lg font-semibold mb-2">Delete Entry</h3>
              <p className="text-muted-foreground mb-6">
                Are you sure you want to delete this entry? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <motion.button
                  onClick={() => setProblemToDelete(null)}
                  className="btn-leetcode-outline"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleDeleteConfirm}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}