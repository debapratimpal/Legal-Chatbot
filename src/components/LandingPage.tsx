import React, { useState, useEffect, useRef } from "react";
import { 
  ChevronRight, 
  ShieldCheck, 
  Zap, 
  Scale, 
  Globe, 
  CheckCircle2,
  ArrowRight,
  MessageSquare,
  Sparkles,
  Bot,
  Send,
  Loader2
} from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import ReactMarkdown from "react-markdown";
import { cn } from "../lib/utils";
import { ai, SYSTEM_PROMPT } from "../lib/gemini";

// --- Sub-components ---

const FloatingCard = ({ children, className, style }: { children: React.ReactNode, className?: string, style?: any }) => (
  <motion.div
    style={style}
    className={cn(
      "glass-3d p-6 rounded-[2rem] preserve-3d transition-shadow hover:shadow-indigo-500/10",
      className
    )}
  >
    <div className="translate-z-10">{children}</div>
  </motion.div>
);

const ChatPreview = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([
    { role: 'ai', content: "Welcome to the vanguard of Indian Legal Tech. How can I assist you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !ai) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: 'user', parts: [{ text: SYSTEM_PROMPT + "\n\nUser: " + userMsg }] }],
      });
      setMessages(prev => [...prev, { role: 'ai', content: response.text || "Unexpected void response." }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', content: "System connection error. Please verify API configuration." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[450px] w-full max-w-md glass-3d rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
      <div className="p-4 bg-white/5 border-b border-white/10 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center animate-pulse">
          <Bot size={16} className="text-white" />
        </div>
        <div>
          <h4 className="text-sm font-black text-white leading-none">Amicus AI</h4>
          <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Active • RAG Powered</span>
        </div>
      </div>
      
      <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4 scroll-smooth mask-fade-y">
        {messages.map((msg, i) => (
          <motion.div 
            initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            key={i} 
            className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}
          >
            <div className={cn(
              "max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed",
              msg.role === 'user' 
                ? "bg-indigo-600 text-white rounded-tr-none" 
                : "bg-white/10 text-slate-200 rounded-tl-none border border-white/5"
            )}>
              <div className="prose prose-invert prose-xs max-w-none">
                <ReactMarkdown>
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-4 bg-black/20 border-t border-white/10">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about Article 14..."
            className="w-full pl-4 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-indigo-400 hover:text-white transition-colors"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function LandingPage({ onGetStarted }: { onGetStarted: () => void }) {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, -100]);
  const heroRotate = useTransform(scrollY, [0, 500], [0, -5]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="min-h-screen bg-[#0a0502] text-white selection:bg-indigo-500/30">
      <div className="atmosphere-bg" />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 py-6 px-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg shadow-indigo-500/20">L</div>
            <h1 className="text-xl font-black tracking-tight font-display">LegalAI <span className="text-indigo-500">India</span></h1>
          </div>
          <div className="hidden lg:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            <a href="#vision" className="hover:text-white transition-colors">Vision</a>
            <a href="#intelligence" className="hover:text-white transition-colors">Intelligence</a>
            <a href="#ecosystem" className="hover:text-white transition-colors">Ecosystem</a>
          </div>
          <button 
            onClick={onGetStarted}
            className="px-6 py-2.5 glass-3d rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
          >
            Engage
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center px-10 pt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          <motion.div style={{ y: heroY, rotateX: heroRotate, opacity }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8">
              <Sparkles size={12} /> Strategic Analysis 2026
            </div>
            <h1 className="text-6xl md:text-8xl font-black font-display leading-[0.9] mb-8">
              THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-rose-400">METAMORPHOSIS</span> OF LAW.
            </h1>
            <p className="text-lg text-slate-400 max-w-lg mb-10 leading-relaxed font-medium">
              From passive digitisation to autonomous automation. India emerges as the undisputed frontier for scaling legal technologies.
            </p>
            <div className="flex items-center gap-6">
              <button 
                onClick={onGetStarted}
                className="px-10 py-5 bg-white text-black font-black uppercase text-xs tracking-[0.2em] rounded-full hover:scale-105 transition-transform"
              >
                Access Intelligence
              </button>
              <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Live Beta
              </div>
            </div>
          </motion.div>

          <div className="relative flex justify-center lg:justify-end">
            <motion.div 
              style={{ y: useTransform(scrollY, [0, 500], [0, 50]) }}
              className="relative z-10 animate-float"
            >
              <ChatPreview />
            </motion.div>
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] -z-10" />
            <motion.div 
              style={{ rotate: 15, y: useTransform(scrollY, [0, 500], [0, 150]) }}
              className="absolute -right-20 -bottom-20 w-80 h-48 glass-3d rounded-[2rem] p-6 hidden lg:block opacity-60"
            >
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck size={20} className="text-indigo-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">DPDP Compliance</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full mb-2 overflow-hidden">
                <div className="w-full h-full bg-indigo-500" />
              </div>
              <p className="text-[10px] text-slate-400">Strict jurisdictional data isolation active.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision Grid */}
      <section id="vision" className="py-40 px-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-end justify-between mb-24 gap-10">
            <h2 className="text-5xl font-black font-display max-w-xl">
              SYSTEMIC GOALS & CONSTITUTIONAL IDEALS
            </h2>
            <p className="text-slate-400 max-w-xs text-sm italic font-medium">
              "Artificial Intelligence is no longer viewed as a novelty but as an essential instrument of systemic reform."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 h-full">
            <FloatingCard className="md:col-span-2 lg:col-span-1 h-80 flex flex-col justify-end">
              <Zap size={40} className="text-indigo-400 mb-6" />
              <h3 className="text-2xl font-black mb-3">Expedited Resolution</h3>
              <p className="text-sm text-slate-400">Compressing manual research from days to seconds.</p>
            </FloatingCard>

            <FloatingCard className="h-80 flex flex-col justify-end">
              <Globe size={40} className="text-rose-400 mb-6" />
              <h3 className="text-2xl font-black mb-3">Vernacular Diversity</h3>
              <p className="text-sm text-slate-400">Ensuring language no longer obstructs civic participation.</p>
            </FloatingCard>

            <FloatingCard className="h-80 flex flex-col justify-end">
              <Scale size={40} className="text-amber-400 mb-6" />
              <h3 className="text-2xl font-black mb-3">Equal Access</h3>
              <p className="text-sm text-slate-400">Actualizing Article 14 and Case Management for all.</p>
            </FloatingCard>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black italic">L</div>
             <p className="text-sm font-black uppercase tracking-widest font-display">LegalAI India</p>
          </div>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
            © 2026 RESEARCH & DEVELOPMENT UNIT • AIR:23.0
          </p>
        </div>
      </footer>
    </div>
  );
}
