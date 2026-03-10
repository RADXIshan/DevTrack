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

export default function DbModal({ isOpen, onClose, onAdd, initialData }: Props) {
  const { user } = useAppStore();
  const { toasts, dismiss, toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "", dbType: "SQL", dbTechnology: "", conceptsCovered: "", useCase: "", notes: "",
  });

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData ? {
        title: initialData.title || "",
        dbType: initialData.dbType || "SQL",
        dbTechnology: initialData.dbTechnology || "",
        conceptsCovered: initialData.conceptsCovered || "",
        useCase: initialData.useCase || "",
        notes: initialData.notes || "",
      } : { title: "", dbType: "SQL", dbTechnology: "", conceptsCovered: "", useCase: "", notes: "" });
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
        await axios.put(`${API_BASE_URL}/api/db/${initialData.id}`, formData, { headers: { Authorization: `Bearer ${user?.token}` } });
        toast("success", "Database entry updated successfully!");
      } else {
        await axios.post(`${API_BASE_URL}/api/db`, formData, { headers: { Authorization: `Bearer ${user?.token}` } });
        toast("success", "Database entry added successfully!");
      }
      onAdd(); onClose();
    } catch (err) { console.error(err); toast("error", "Failed to save entry. Please try again."); }
    finally { setLoading(false); }
  };

  const dbTechOptions: Record<string, string[]> = {
    SQL: ["PostgreSQL", "MySQL", "SQLite", "MariaDB", "Oracle", "Microsoft SQL Server", "CockroachDB"],
    NoSQL: ["MongoDB", "Redis", "Cassandra", "DynamoDB", "Couchbase", "Neo4j", "Firestore", "Elasticsearch"],
    VectorDB: ["Pinecone", "Weaviate", "Qdrant", "Milvus", "Chroma", "PGVector", "Redis Vector", "MongoDB Atlas Vector", "Faiss", "LanceDB", "Zilliz", "OpenSearch"],
  };

  return (
    <>
    <Toast toasts={toasts} onDismiss={dismiss} />
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="bg-background border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">{initialData ? "Edit" : "Add"} Database Entry</h2>
              <motion.button onClick={onClose} disabled={loading} className="p-2 rounded-md hover:bg-muted/50 transition-colors" whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}><X className="w-5 h-5" /></motion.button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-140px)] custom-scrollbar">
              <div>
                <label className={labelClass}>Topic / Title *</label>
                <input type="text" required value={formData.title} onChange={e => set("title", e.target.value)} className={inputClass} placeholder="Indexing in PostgreSQL, Redis Caching Patterns..." />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Database Type</label>
                  <select value={formData.dbType} onChange={e => { set("dbType", e.target.value); set("dbTechnology", ""); }} className={inputClass}>
                    <option value="SQL">SQL (Relational)</option>
                    <option value="NoSQL">NoSQL</option>
                    <option value="VectorDB">Vector Databases</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Technology</label>
                  <select value={formData.dbTechnology} onChange={e => set("dbTechnology", e.target.value)} className={inputClass}>
                    <option value="">Select technology...</option>
                    {dbTechOptions[formData.dbType]?.map(tech => (
                      <option key={tech} value={tech}>{tech}</option>
                    ))}
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {formData.dbTechnology === "Other" && (
                <div>
                  <label className={labelClass}>Specify Technology</label>
                  <input type="text" value={formData.dbTechnology === "Other" ? "" : formData.dbTechnology} onChange={e => set("dbTechnology", e.target.value)} className={inputClass} placeholder="Enter technology name..." />
                </div>
              )}

              <div>
                <label className={labelClass}>Concepts Covered</label>
                <input type="text" value={formData.conceptsCovered} onChange={e => set("conceptsCovered", e.target.value)} className={inputClass} placeholder="Indexing, Sharding, ACID, Replication, Transactions..." />
              </div>

              <div>
                <label className={labelClass}>Use Case</label>
                <input type="text" value={formData.useCase} onChange={e => set("useCase", e.target.value)} className={inputClass} placeholder="Session storage, Analytics, Real-time chat, E-commerce..." />
              </div>

              <div>
                <label className={labelClass}>Notes & Insights</label>
                <textarea value={formData.notes} onChange={e => set("notes", e.target.value)} rows={4} className={`${inputClass} resize-none`} placeholder="Key insights, performance characteristics, when to use/avoid..." />
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
