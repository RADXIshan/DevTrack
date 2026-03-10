import React, { useState, useEffect } from "react";
import { useAppStore } from "../store/useAppStore";
import { Code, Database, Brain, Plus, Layers, GraduationCap } from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import { motion } from "framer-motion";

// Modals
import DsaModal from "../components/dsa/DsaModal";
import DevModal from "../components/dev/DevModal";
import AimlModal from "../components/aiml/AimlModal";
import DbModal from "../components/db/DbModal";
import SystemDesignModal from "../components/systemdesign/SystemDesignModal";

// Tables
import DsaTable from "../components/dsa/DsaTable";
import DevTable from "../components/dev/DevTable";
import AimlTable from "../components/aiml/AimlTable";
import DbTable from "../components/db/DbTable";
import SystemDesignTable from "../components/systemdesign/SystemDesignTable";

const API_ENDPOINT: Record<string, string> = {
  DSA: "/api/dsa",
  DEV: "/api/dev",
  AI: "/api/aiml",
  DB: "/api/db",
  SYSTEMDESIGN: "/api/systemdesign",
};

const modeConfig: Record<string, { title: string; desc: string; icon: React.ReactNode; color: string; addLabel: string }> = {
  DSA: { title: "Problems", desc: "Track your coding problems and algorithmic challenges", icon: <GraduationCap className="w-5 h-5" />, color: "text-green-400", addLabel: "Add Problem" },
  DEV: { title: "Projects", desc: "Track development projects and implementations", icon: <Code className="w-5 h-5" />, color: "text-blue-400", addLabel: "Add Project" },
  AI: { title: "AI / ML", desc: "Track machine learning research, algorithms and papers", icon: <Brain className="w-5 h-5" />, color: "text-cyan-400", addLabel: "Add Research" },
  DB: { title: "Databases", desc: "Track SQL, NoSQL, Vector and database concepts you've learned", icon: <Database className="w-5 h-5" />, color: "text-amber-400", addLabel: "Add Topic" },
  SYSTEMDESIGN: { title: "System Design", desc: "Track HLD, LLD and architectural patterns", icon: <Layers className="w-5 h-5" />, color: "text-orange-400", addLabel: "Add Design" },
};

export default function Dashboard() {
  const { mode, user } = useAppStore();
  const [entries, setEntries] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ totalSolved: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any>(null);

  const fetchData = async () => {
    if (!user) return;
    const endpoint = API_ENDPOINT[mode];
    try {
      const [entriesRes, statsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}${endpoint}`, { headers: { Authorization: `Bearer ${user.token}` } }),
        axios.get(`${API_BASE_URL}/api/stats?mode=${mode}`, { headers: { Authorization: `Bearer ${user.token}` } }),
      ]);
      setEntries(entriesRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchData(); }, [mode, user]);

  const content = modeConfig[mode];

  // --- Stats cards per mode ---
  const renderStatCards = () => {
    if (mode === "DSA") {
      const dc = stats.difficultyCounts || {};
      return [
        { label: "Easy", count: dc.Easy || 0, color: "text-green-400" },
        { label: "Medium", count: dc.Medium || 0, color: "text-amber-400" },
        { label: "Hard", count: dc.Hard || 0, color: "text-red-400" },
      ].map((s, i) => (
        <motion.div key={s.label} className="leetcode-card rounded-lg p-4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + (i + 1) * 0.1 }} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
          <p className="text-muted-foreground text-sm">{s.label}</p>
          <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
        </motion.div>
      ));
    }
    if (mode === "DEV") {
      return Object.entries(stats.projectTypeCounts || {}).slice(0, 3).map(([pt, cnt], i) => (
        <motion.div key={pt} className="leetcode-card rounded-lg p-4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + (i + 1) * 0.1 }} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
          <p className="text-muted-foreground text-sm">{pt}</p>
          <p className="text-2xl font-bold text-blue-400">{cnt as number}</p>
        </motion.div>
      ));
    }
    if (mode === "AI") {
      return Object.entries(stats.frameworkCounts || {}).slice(0, 3).map(([fw, cnt], i) => (
        <motion.div key={fw} className="leetcode-card rounded-lg p-4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + (i + 1) * 0.1 }} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
          <p className="text-muted-foreground text-sm">{fw}</p>
          <p className="text-2xl font-bold text-cyan-400">{cnt as number}</p>
        </motion.div>
      ));
    }
    if (mode === "DB") {
      const dc = stats.dbTypeCounts || {};
      return [
        { label: "SQL", count: dc.SQL || 0, color: "text-blue-400" },
        { label: "NoSQL", count: dc.NoSQL || 0, color: "text-green-400" },
        { label: "VectorDB", count: dc.VectorDB || 0, color: "text-purple-400" },
      ].map((s, i) => (
        <motion.div key={s.label} className="leetcode-card rounded-lg p-4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + (i + 1) * 0.1 }} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
          <p className="text-muted-foreground text-sm">{s.label}</p>
          <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
        </motion.div>
      ));
    }
    if (mode === "SYSTEMDESIGN") {
      const dc = stats.designTypeCounts || {};
      return [
        { label: "HLD", count: dc.HLD || 0, color: "text-orange-400" },
        { label: "LLD", count: dc.LLD || 0, color: "text-teal-400" },
        { label: "Both", count: dc.Both || 0, color: "text-violet-400" },
      ].map((s, i) => (
        <motion.div key={s.label} className="leetcode-card rounded-lg p-4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + (i + 1) * 0.1 }} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
          <p className="text-muted-foreground text-sm">{s.label}</p>
          <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
        </motion.div>
      ));
    }
    return null;
  };

  const renderTable = () => {
    const commonProps = { onRefresh: fetchData, onEdit: (e: any) => { setEditingEntry(e); setIsModalOpen(true); } };
    switch (mode) {
      case "DSA": return <DsaTable entries={entries} {...commonProps} />;
      case "DEV": return <DevTable entries={entries} {...commonProps} />;
      case "AI": return <AimlTable entries={entries} {...commonProps} />;
      case "DB": return <DbTable entries={entries} {...commonProps} />;
      case "SYSTEMDESIGN": return <SystemDesignTable entries={entries} {...commonProps} />;
    }
  };

  const renderModal = () => {
    const commonProps = {
      isOpen: isModalOpen,
      onClose: () => { setIsModalOpen(false); setEditingEntry(null); },
      onAdd: fetchData,
      initialData: editingEntry,
    };
    switch (mode) {
      case "DSA": return <DsaModal {...commonProps} />;
      case "DEV": return <DevModal {...commonProps} />;
      case "AI": return <AimlModal {...commonProps} />;
      case "DB": return <DbModal {...commonProps} />;
      case "SYSTEMDESIGN": return <SystemDesignModal {...commonProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div className="flex items-center justify-between mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
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
            {content.addLabel}
          </motion.button>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {/* Total */}
          <motion.div className="leetcode-card rounded-lg p-4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.1 }} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalSolved}</p>
              </div>
              <motion.div className={`p-2 rounded-lg bg-primary/10 ${content.color}`} whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                {content.icon}
              </motion.div>
            </div>
          </motion.div>
          {renderStatCards()}
        </div>

        {/* Table */}
        <motion.div className="leetcode-card rounded-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
          </div>
          {renderTable()}
        </motion.div>

        {/* Modal */}
        {renderModal()}
      </div>
    </div>
  );
}