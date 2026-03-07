import { format } from "date-fns";
import { ExternalLink, Trash2 } from "lucide-react";
import axios from "axios";
import { useAppStore } from "../../store/useAppStore";

export default function ProblemTable({ problems, onRefresh }: { problems: any[], onRefresh: () => void }) {
  const { user, mode } = useAppStore();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this problem?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/problems/${id}`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
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
    <div className="mt-8 bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="p-4 font-semibold text-sm text-foreground">Title</th>
              {mode === "DSA" && <th className="p-4 font-semibold text-sm text-foreground">Difficulty</th>}
              {mode === "DSA" && <th className="p-4 font-semibold text-sm text-foreground">Pattern</th>}
              <th className="p-4 font-semibold text-sm text-foreground">Date</th>
              <th className="p-4 font-semibold text-sm text-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {problems.map((p) => (
              <tr key={p.id} className="hover:bg-muted/30 transition-colors group">
                <td className="p-4">
                  <span className="font-medium">{p.title}</span>
                  {p.leetcodeUrl && (
                    <a href={p.leetcodeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center ml-2 text-muted-foreground hover:text-primary transition-colors">
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
                <td className="p-4 text-sm text-muted-foreground">
                  {format(new Date(p.completedAt), "MMM d, yyyy")}
                </td>
                <td className="p-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleDelete(p.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
