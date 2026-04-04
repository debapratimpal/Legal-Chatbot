import React, { useState } from "react";
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Github, 
  Chrome, 
  Loader2,
  CheckCircle2,
  ShieldCheck
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
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6 perspective-1000">
      <motion.div 
        initial={{ rotateX: 20, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[2.5rem] shadow-3d overflow-hidden border border-slate-100 preserve-3d"
      >
        {/* Left Side: Form */}
        <div className="p-8 lg:p-16 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-12">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black italic">L</div>
            <h1 className="text-xl font-black tracking-tight text-slate-900">LegalAI <span className="text-indigo-600">India</span></h1>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-black text-slate-900 mb-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-slate-500 text-sm">
              {isLogin 
                ? "Access your legal intelligence dashboard." 
                : "Join the future of Indian legal technology."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@firm.com"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <button type="button" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Forgot Password?</button>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? "Sign In" : "Create Account")}
              {!isLoading && <ArrowRight size={20} />}
            </button>
          </form>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 text-slate-400 font-bold">Or continue with</span></div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-bold text-sm text-slate-600">
              <Chrome size={18} /> Google
            </button>
            <button className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-bold text-sm text-slate-600">
              <Github size={18} /> GitHub
            </button>
          </div>

          <p className="mt-10 text-center text-sm text-slate-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 font-bold text-indigo-600 hover:text-indigo-700"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>

        {/* Right Side: Info/Social Proof */}
        <div className="hidden lg:flex bg-indigo-900 p-16 flex-col justify-between text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-800 text-indigo-300 rounded-full text-xs font-black uppercase tracking-widest mb-12">
              <ShieldCheck size={14} /> Trusted by 500+ Firms
            </div>
            <h3 className="text-4xl font-black leading-tight mb-8">
              Empowering the next generation of <span className="text-indigo-400">Indian Advocates</span>
            </h3>
            <div className="space-y-6">
              {[
                "Strategic Market Intelligence",
                "DPDP Act Compliance Monitoring",
                "RAG-Powered Legal Assistant",
                "Judicial Backlog Analytics"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-6 h-6 bg-indigo-800 rounded-full flex items-center justify-center">
                    <CheckCircle2 size={14} className="text-indigo-400" />
                  </div>
                  <span className="text-indigo-100 font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10">
            <div className="bg-indigo-800/50 p-6 rounded-3xl border border-indigo-700">
              <p className="text-sm italic text-indigo-200 leading-relaxed">
                "LegalAI India has completely transformed how our firm approaches market research and regulatory compliance. It's an indispensable tool for the modern practitioner."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-700 rounded-full border border-indigo-600" />
                <div>
                  <p className="text-sm font-bold">Adv. Rajesh Sharma</p>
                  <p className="text-xs text-indigo-400">Senior Partner, Sharma & Associates</p>
                </div>
              </div>
            </div>
          </div>

          {/* Abstract background shape */}
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-indigo-800 rounded-full blur-3xl opacity-50" />
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-800 rounded-full blur-3xl opacity-30" />
        </div>
      </motion.div>
    </div>
  );
}
