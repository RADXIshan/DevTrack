import { useState, useEffect } from "react";
import { useAppStore } from "../store/useAppStore";
import { Code, Database, Brain, Plus } from "lucide-react";
import axios from "axios";
import ProblemTable from "../components/problems/ProblemTable";
import ProblemModal from "../components/problems/ProblemModal";
import { API_BASE_URL } from "../config/api";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { mode, user } = useAppStore();
  const [problems, setProblems] = useState([]);
  const [stats, setStats] = useState({ totalSolved: 0, difficultyCounts: {} as any, techStackCounts: {} as any, frameworkCounts: {} as any });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState<any>(null);

  const fetchData = async () => {
    if (!user) return;
    try {
      const [probRes, statRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/problems?mode=${mode}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        }),
        axios.get(`${API_BASE_URL}/api/stats?mode=${mode}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        })
      ]);
      setProblems(probRes.data);
      setStats(statRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [mode, user]);

  const getModeContent = () => {
    switch(mode) {
      case "DSA":
        return {
          title: "Problems",
          desc: "Track your coding problems and algorithmic challenges",
          icon: <Database className="w-5 h-5" />,
          color: "text-green-400"
        };
      case "DEV":
        return {
          title: "Projects",
          desc: "Track development projects and technical implementations",
          icon: <Code className="w-5 h-5" />,
          color: "text-blue-400"
        };
      case "AI":
        return {
          title: "AI/ML",
          desc: "Track machine learning models and research",
          icon: <Brain className="w-5 h-5" />,
          color: "text-purple-400"
        };
    }
  };

  const content = getModeContent();

  const getDifficultyStats = () => {
    if (mode === "DSA") {
      return [
        { label: "Easy", count: stats.difficultyCounts?.Easy || 0, color: "text-green-400" },
        { label: "Medium", count: stats.difficultyCounts?.Medium || 0, color: "text-yellow-400" },
        { label: "Hard", count: stats.difficultyCounts?.Hard || 0, color: "text-red-400" },
      ];
    }
    return [];
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">{content.title}</h1>
            <p className="text-muted-foreground">{content.desc}</p>
          </div>
          <motion.button
            onClick={() => setIsModalOpen(true)}
            className="btn-leetcode flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-4 h-4" />
            Add {mode === "DSA" ? "Problem" : mode === "DEV" ? "Project" : "Research"}
          </motion.button>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Solved */}
          <motion.div 
            className="leetcode-card rounded-lg p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Solved</p>
                <motion.p 
                  className="text-2xl font-bold text-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {stats.totalSolved}
                </motion.p>
              </div>
              <motion.div 
                className={`p-2 rounded-lg bg-primary/10 ${content.color}`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                {content.icon}
              </motion.div>
            </div>
          </motion.div>

          {/* Difficulty breakdown for DSA */}
          {mode === "DSA" && getDifficultyStats().map((stat, index) => (
            <motion.div 
              key={stat.label} 
              className="leetcode-card rounded-lg p-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 + (index + 1) * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                  <motion.p 
                    className={`text-2xl font-bold ${stat.color}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + (index + 1) * 0.1 }}
                  >
                    {stat.count}
                  </motion.p>
                </div>
                <motion.div 
                  className={`w-3 h-3 rounded-full ${stat.color.replace('text-', 'bg-')}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 + (index + 1) * 0.1, type: "spring" }}
                />
              </div>
            </motion.div>
          ))}

          {/* Tech Stack for DEV */}
          {mode === "DEV" && Object.entries(stats.techStackCounts || {}).slice(0, 3).map(([tech, count], index) => (
            <motion.div 
              key={tech} 
              className="leetcode-card rounded-lg p-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 + (index + 1) * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">{tech}</p>
                  <p className="text-2xl font-bold text-blue-400">{count as number}</p>
                </div>
                <Code className="w-5 h-5 text-blue-400" />
              </div>
            </motion.div>
          ))}

          {/* Framework for AI */}
          {mode === "AI" && Object.entries(stats.frameworkCounts || {}).slice(0, 3).map(([framework, count], index) => (
            <motion.div 
              key={framework} 
              className="leetcode-card rounded-lg p-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 + (index + 1) * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">{framework}</p>
                  <p className="text-2xl font-bold text-purple-400">{count as number}</p>
                </div>
                <Brain className="w-5 h-5 text-purple-400" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity */}
        <motion.div 
          className="leetcode-card rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
          </div>
          <ProblemTable 
            problems={problems} 
            onRefresh={fetchData}
            onEdit={(problem) => {
              setEditingProblem(problem);
              setIsModalOpen(true);
            }}
          />
        </motion.div>

        {/* Modal */}
        <ProblemModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProblem(null);
          }}
          onAdd={fetchData}
          initialData={editingProblem}
        />
      </div>
    </div>
  );
}