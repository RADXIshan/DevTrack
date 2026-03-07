import { useState, useEffect } from "react";
import { useAppStore } from "../store/useAppStore";
import { motion } from "framer-motion";
import { Activity, Code, Database, Brain, Plus } from "lucide-react";
import axios from "axios";
import ProblemTable from "../components/problems/ProblemTable";
import ProblemModal from "../components/problems/ProblemModal";

export default function Dashboard() {
  const { mode, user } = useAppStore();
  const [problems, setProblems] = useState([]);
  const [stats, setStats] = useState({ totalSolved: 0, difficultyCounts: {} as any });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    if (!user) return;
    try {
      const [probRes, statRes] = await Promise.all([
        axios.get(`http://localhost:3000/api/problems?mode=${mode}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        }),
        axios.get(`http://localhost:3000/api/stats?mode=${mode}`, {
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
          title: "Data Structures & Algorithms",
          desc: "Track your LeetCode, NeetCode 150, and Striver's A2Z progress.",
          icon: <Database className="w-10 h-10 text-primary" />,
          color: "bg-blue-500/10 text-blue-500"
        };
      case "DEV":
        return {
          title: "Development Projects",
          desc: "Track full-stack apps, libraries, and practical dev milestones.",
          icon: <Code className="w-10 h-10 text-primary" />,
          color: "bg-emerald-500/10 text-emerald-500"
        };
      case "AI":
        return {
          title: "AI / Machine Learning",
          desc: "Track research papers, models, architectures, and ML concepts.",
          icon: <Brain className="w-10 h-10 text-primary" />,
          color: "bg-purple-500/10 text-purple-500"
        };
    }
  };

  const content = getModeContent();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex items-start justify-between bg-card border border-border rounded-3xl p-8 shadow-sm relative overflow-hidden">
        {/* Subtle background glow */}
        <div className={`absolute -right-20 -top-20 w-64 h-64 rounded-full blur-[100px] opacity-50 ${content.color.split(' ')[0]}`} />
        
        <div className="relative z-10 space-y-4">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${content.color} bg-background border border-border shadow-sm`}>
            {content.icon}
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{content.title}</h1>
            <p className="text-muted-foreground mt-2 max-w-xl text-lg">
              {content.desc}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 text-muted-foreground mb-2">
            <Activity className="w-5 h-5" />
            <h3 className="font-medium">Total Solved</h3>
          </div>
          <p className="text-4xl font-bold">{stats.totalSolved}</p>
        </div>
        
        {mode === "DSA" && (
          <>
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 text-emerald-500 mb-2">
                <Activity className="w-5 h-5" />
                <h3 className="font-medium text-muted-foreground">Easy</h3>
              </div>
              <p className="text-4xl font-bold">{stats.difficultyCounts.Easy || 0}</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 text-amber-500 mb-2">
                <Activity className="w-5 h-5" />
                <h3 className="font-medium text-muted-foreground">Medium</h3>
              </div>
              <p className="text-4xl font-bold">{stats.difficultyCounts.Medium || 0}</p>
            </div>
          </>
        )}
      </div>

      <div className="flex justify-between items-center mt-8">
        <h2 className="text-2xl font-bold tracking-tight">Recent Logs</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Log Problem
        </button>
      </div>

      <ProblemTable problems={problems} onRefresh={fetchData} />
      <ProblemModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={fetchData} />

    </motion.div>
  );
}
