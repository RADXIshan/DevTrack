import { useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import { Link, useNavigate } from "react-router-dom";
import { Sun, Moon, LogOut, Code2, Cpu, GraduationCap, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

const modes = [
  { id: "DSA", label: "DSA", icon: GraduationCap },
  { id: "DEV", label: "Dev", icon: Code2 },
  { id: "AI", label: "AI/ML", icon: Cpu },
];

const Navbar = () => {
  const { mode, setMode, user, logout, theme, setTheme } = useAppStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 max-w-7xl mx-auto items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105 active:scale-95">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
              <Code2 className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:inline-block">AlgoTrack</span>
          </Link>
        </div>

        {/* Desktop Mode Toggle */}
        <div className="hidden md:flex items-center p-1 bg-secondary rounded-xl border border-border shadow-sm">
          {modes.map((m) => {
            const isActive = mode === m.id;
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                onClick={() => setMode(m.id as any)}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors z-10",
                  isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-active-mode"
                    className="absolute inset-0 bg-primary rounded-lg border border-primary z-[-1]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className="h-4 w-4" />
                {m.label}
              </button>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {user ? (
            <div className="hidden md:flex items-center gap-4">
              <span className="text-sm font-medium text-muted-foreground">Hey, {user.name.split(" ")[0]}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden lg:inline">Logout</span>
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-sm font-medium px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90">
              Login
            </Link>
          )}

          {/* Mobile menu button */}
          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t overflow-hidden bg-background"
          >
            <div className="px-4 py-4 space-y-4">
              <div className="flex justify-between items-center p-1 bg-secondary rounded-xl border border-border shadow-sm">
                {modes.map((m) => {
                  const isActive = mode === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => { setMode(m.id as any); setIsOpen(false); }}
                      className={cn(
                        "relative flex flex-1 justify-center items-center py-2 text-sm font-medium rounded-lg z-10",
                        isActive ? "text-primary-foreground bg-primary" : "text-muted-foreground"
                      )}
                    >
                      {m.label}
                    </button>
                  );
                })}
              </div>
              
              {user && (
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-sm font-medium">Logged in as {user.name}</span>
                  <button onClick={handleLogout} className="text-sm text-destructive font-medium border border-destructive/20 bg-destructive/10 px-3 py-1.5 rounded-md">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
