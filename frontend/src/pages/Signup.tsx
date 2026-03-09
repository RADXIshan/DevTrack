import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { API_BASE_URL } from "../config/api";
import { motion } from "framer-motion";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setUser = useAppStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/register`, { name, email, password });
      setUser(res.data);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link to="/" className="fixed top-6 left-6 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <img src="/logo.png" alt="DevTracker" className="w-8 h-8" />
          <div className="text-primary font-bold text-xl">
            DevTracker
          </div>
        </Link>
      </motion.div>

      <motion.div 
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="leetcode-card rounded-lg p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">Create Account</h1>
            <p className="text-muted-foreground">
              Start your coding journey with DevTracker
            </p>
          </div>

          {error && (
            <motion.div 
              className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Enter your name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-10 transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full btn-leetcode py-3 mt-6 disabled:opacity-50"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? "Creating account..." : "Create Account"}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-muted-foreground text-sm">
              Already have an account?{" "}
            </span>
            <Link to="/login" className="text-primary hover:text-primary/80 text-sm font-medium transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
