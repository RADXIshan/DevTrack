import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Code2, 
  Database, 
  Brain, 
  ArrowRight, 
  Target,
  Zap,
  BarChart3,
  Play
} from "lucide-react";

export default function Landing() {
  const features = [
    {
      icon: <Database className="w-6 h-6" />,
      title: "Problem Tracking",
      description: "Track LeetCode problems, coding challenges, and algorithmic solutions with detailed progress analytics.",
      color: "text-green-400"
    },
    {
      icon: <Code2 className="w-6 h-6" />,
      title: "Project Management",
      description: "Log development projects, tech stacks, and implementation details in one organized place.",
      color: "text-blue-400"
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI/ML Research",
      description: "Document research papers, model architectures, and machine learning experiments.",
      color: "text-cyan-400"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Progress Analytics",
      description: "Visualize your learning journey with detailed statistics and progress tracking.",
      color: "text-indigo-400"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Goal Setting",
      description: "Set targets, track streaks, and stay motivated with personalized milestones.",
      color: "text-violet-400"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Quick Logging",
      description: "Rapidly log your progress with intuitive forms and smart categorization.",
      color: "text-primary"
    }
  ];

  const stats = [
    { label: "Problems Solved", value: "10K+", color: "text-green-400" },
    { label: "Active Users", value: "5K+", color: "text-blue-400" },
    { label: "Projects Tracked", value: "2K+", color: "text-cyan-400" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50"
      >
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <img src="/logo.png" alt="DevTracker" className="w-8 h-8" />
              <div className="text-primary font-bold text-xl">
                DevTracker
              </div>
            </motion.div>
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign In
              </Link>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/signup"
                  className="btn-leetcode"
                >
                  Get Started
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl lg:text-6xl font-bold text-foreground mb-6"
            >
              Track Your Coding
              <span className="text-primary"> Journey</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              The ultimate platform for tracking coding problems, development projects, and AI/ML research. 
              Stay organized and motivated on your programming journey.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/signup"
                  className="btn-leetcode flex items-center gap-2 text-lg px-8 py-3"
                >
                  <Play className="w-5 h-5" />
                  Start Tracking
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/login"
                  className="btn-leetcode-outline flex items-center gap-2 text-lg px-8 py-3"
                >
                  View Demo
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`text-3xl font-bold ${stat.color} mb-1`}>
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 border-t border-border">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Track Progress
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools designed for developers, competitive programmers, and AI researchers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="leetcode-card rounded-lg p-6 cursor-pointer"
              >
                <motion.div 
                  className={`inline-flex p-3 rounded-lg bg-muted/50 ${feature.color} mb-4`}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-border">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Ready to Level Up Your Coding?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of developers who are already tracking their progress and achieving their goals.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/signup"
                className="btn-leetcode text-lg px-8 py-3 inline-flex items-center gap-2"
              >
                Get Started for Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <img src="/logo.png" alt="DevTracker" className="w-6 h-6" />
              <div className="text-primary font-bold text-xl">
                DevTracker
              </div>
              <span className="text-muted-foreground">© {new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}