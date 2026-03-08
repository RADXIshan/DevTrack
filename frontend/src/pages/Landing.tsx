import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Code2, 
  Database, 
  Brain, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp,
  Target,
  Zap,
  BarChart3,
  Github,
  Twitter,
  Linkedin
} from "lucide-react";

export default function Landing() {
  const features = [
    {
      icon: <Database className="w-6 h-6" />,
      title: "DSA Mastery",
      description: "Track LeetCode, NeetCode 150, and Striver's A2Z problems with detailed progress analytics.",
      color: "bg-blue-500/10 text-blue-500 border-blue-500/20"
    },
    {
      icon: <Code2 className="w-6 h-6" />,
      title: "Dev Projects",
      description: "Log full-stack applications, libraries, and development milestones in one place.",
      color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI & ML",
      description: "Document research papers, model architectures, and machine learning concepts.",
      color: "bg-purple-500/10 text-purple-500 border-purple-500/20"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Visual Analytics",
      description: "Beautiful charts and insights to visualize your learning journey over time.",
      color: "bg-amber-500/10 text-amber-500 border-amber-500/20"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Goal Tracking",
      description: "Set targets, track streaks, and stay motivated with personalized milestones.",
      color: "bg-rose-500/10 text-rose-500 border-rose-500/20"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Fast & Intuitive",
      description: "Clean interface designed for developers who value speed and simplicity.",
      color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20"
    }
  ];

  const benefits = [
    "Track problems across multiple platforms",
    "Organize by difficulty, topic, and tags",
    "Monitor your progress with detailed stats",
    "Switch between DSA, Dev, and AI modes",
    "Export your data anytime",
    "Clean, distraction-free interface"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center">
                <Code2 size={18} />
              </div>
              <span className="text-xl font-bold">CodeTracker</span>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                to="/login" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign in
              </Link>
              <Link 
                to="/signup" 
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 z-[-1] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(0,0,0,0))]" />
        
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary mb-6">
              <TrendingUp size={16} />
              Track your coding journey
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              Master DSA, Dev & AI
              <span className="block text-primary mt-2">All in One Place</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              The ultimate progress tracker for developers. Log problems, track projects, 
              and visualize your growth across Data Structures, Development, and AI.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/signup"
                className="group flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl text-lg font-semibold hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
              >
                Start Tracking Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/login"
                className="flex items-center gap-2 px-8 py-4 bg-card border border-border text-foreground rounded-xl text-lg font-semibold hover:bg-accent transition-colors"
              >
                Sign In
              </Link>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Free forever
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                No credit card
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Export anytime
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-accent/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              Everything you need to track progress
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed specifically for developers who want to level up
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border ${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold tracking-tight mb-6">
                Why developers choose CodeTracker
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Built by developers, for developers. We understand the importance of 
                tracking your learning journey and staying consistent.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                    <span className="text-lg">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="bg-card border border-border rounded-3xl p-8 shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-lg flex items-center justify-center">
                        <Database size={20} />
                      </div>
                      <div>
                        <div className="font-semibold">DSA Progress</div>
                        <div className="text-sm text-muted-foreground">Last 30 days</div>
                      </div>
                    </div>
                    <div className="text-3xl font-bold">127</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-emerald-500 font-medium">Easy</span>
                      <span className="font-semibold">45</span>
                    </div>
                    <div className="w-full bg-accent rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '65%' }} />
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-amber-500 font-medium">Medium</span>
                      <span className="font-semibold">62</span>
                    </div>
                    <div className="w-full bg-accent rounded-full h-2">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: '80%' }} />
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-red-500 font-medium">Hard</span>
                      <span className="font-semibold">20</span>
                    </div>
                    <div className="w-full bg-accent rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '40%' }} />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-accent/30">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
              Ready to level up your coding journey?
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join developers who are tracking their progress and staying consistent
            </p>
            <Link 
              to="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl text-lg font-semibold hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
            >
              Get Started for Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center">
                  <Code2 size={18} />
                </div>
                <span className="text-xl font-bold">CodeTracker</span>
              </div>
              <p className="text-muted-foreground max-w-md">
                The ultimate progress tracker for developers mastering DSA, Development, and AI.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/signup" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link to="/signup" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link to="/login" className="hover:text-foreground transition-colors">Sign In</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Github size={20} />
                </a>
                <a href="#" className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Twitter size={20} />
                </a>
                <a href="#" className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} CodeTracker. Built with ❤️ for developers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
