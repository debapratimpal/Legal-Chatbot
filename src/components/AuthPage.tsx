import React, { useState } from "react";
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Github, 
  Chrome, 
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Sparkles
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

export default function AuthPage({ onAuthSuccess }: { onAuthSuccess: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mocking auth delay
    setTimeout(() => {
      setIsLoading(false);
      onAuthSuccess();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0a0502] text-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="atmosphere-bg opacity-50" />
      
      <motion.div 
        initial={{ y: 20, rotateX: 10, opacity: 0 }}
        animate={{ y: 0, rotateX: 0, opacity: 1 }}
        transition={{ duration: 1, type: "spring" }}
        className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 glass-3d rounded-[3rem] overflow-hidden border border-white/5 preserve-3d relative z-10 shadow-2xl"
      >
        {/* Left Side: Form */}
        <div className="p-10 lg:p-20 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
          
          <div className="flex items-center gap-3 mb-16 relative z-10">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg shadow-indigo-500/20">L</div>
            <h1 className="text-xl font-black tracking-tight font-display text-white">LegalAI <span className="text-indigo-500">India</span></h1>
          </div>

          <div className="mb-12 relative z-10">
            <h2 className="text-5xl font-black text-white mb-4 font-display uppercase tracking-tight leading-none">
              {isLogin ? "Welcome Back" : "Initiate Access"}
            </h2>
            <p className="text-slate-400 text-sm font-medium tracking-wide">
              {isLogin 
                ? "Enter your credentials to access the legal corpus." 
                : "Create a new profile to start your journey."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Identity Vector</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@firm.com"
                  className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-[13px] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/10 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Access Protocol</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-[13px] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/10 transition-all font-medium"
                />
              </div>
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <button type="button" className="text-[10px] font-black text-indigo-400 hover:text-white uppercase tracking-widest transition-colors">Emergency Reset?</button>
              </div>
            )}

            <motion.button 
              whileHover={{ scale: 1.02, translateZ: 10 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? "Decrypt & Enter" : "Establish Link")}
              {!isLoading && <ArrowRight size={18} />}
            </motion.button>
          </form>

          <div className="mt-12 relative z-10">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <div className="relative flex justify-center text-[9px] uppercase tracking-[0.4em]"><span className="bg-[#0a0502] px-4 text-slate-500 font-black">Neural Auth</span></div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 relative z-10">
            <button className="flex items-center justify-center gap-3 py-4 glass-3d border border-white/5 rounded-2xl hover:bg-white/10 transition-all font-black text-[10px] text-slate-300 uppercase tracking-widest">
              <Chrome size={18} className="text-red-400" /> Google
            </button>
            <button className="flex items-center justify-center gap-3 py-4 glass-3d border border-white/5 rounded-2xl hover:bg-white/10 transition-all font-black text-[10px] text-slate-300 uppercase tracking-widest">
              <Github size={18} /> GitHub
            </button>
          </div>

          <p className="mt-12 text-center text-[10px] font-black uppercase tracking-[0.2em] relative z-10">
            {isLogin ? "New to the network?" : "Protocol already active?"}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="ml-3 text-indigo-400 hover:text-white transition-colors"
            >
              {isLogin ? "Register" : "Sign In"}
            </button>
          </p>
        </div>

        {/* Right Side: Decorative/Social Proof */}
        <div className="hidden lg:flex bg-indigo-600/10 p-20 flex-col justify-between text-white relative overflow-hidden backdrop-blur-3xl border-l border-white/5">
          <div className="absolute inset-0 atmosphere-bg opacity-30" />
          
          <div className="relative z-10">
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-500/20 text-indigo-400 rounded-full text-[9px] font-black uppercase tracking-widest mb-16 border border-indigo-500/30"
            >
              <ShieldCheck size={14} /> Neural-Secured Network
            </motion.div>
            <h3 className="text-6xl font-black leading-[0.9] font-display uppercase tracking-tight mb-12">
              Next-Gen <span className="text-white">Legal</span> Intelligence
            </h3>
            <div className="space-y-8">
              {[
                { text: "Strategic Market Data Hub", icon: Zap },
                { text: "DPDP 2023 Resilience Module", icon: ShieldCheck },
                { text: "Advanced RAG Chat Architecture", icon: Sparkles },
                { text: "Supreme Court Analytics Map", icon: CheckCircle2 }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-6">
                  <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center border border-indigo-500/30">
                    <item.icon size={20} className="text-indigo-400" />
                  </div>
                  <span className="text-slate-300 font-black text-[12px] uppercase tracking-widest">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10">
            <div className="glass-3d p-8 rounded-[2.5rem] border border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className="text-[13px] italic text-slate-300 leading-relaxed relative z-10 font-medium">
                "We haven't just digitized the law; we've given it a nervous system. LegalAI is the singular interface for the modern advocate."
              </p>
              <div className="mt-8 flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl border border-white/20 flex items-center justify-center font-black italic shadow-lg">RS</div>
                <div>
                  <p className="text-[11px] font-black text-white uppercase tracking-widest">Adv. Rajesh Sharma</p>
                  <p className="text-[9px] text-indigo-400 font-black uppercase tracking-[0.2em] mt-1">Senior Partner, Delhi High Court</p>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-[-10%] right-[-10%] w-[120%] h-[120%] pointer-events-none">
             <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px]" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
