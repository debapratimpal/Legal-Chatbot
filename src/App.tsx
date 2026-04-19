import React, { useState, useEffect, useRef } from "react";
import { 
  LayoutDashboard, 
  Users, 
  Scale, 
  MessageSquare, 
  TrendingUp, 
  ShieldCheck, 
  MapPin, 
  ExternalLink,
  ChevronRight,
  Send,
  Loader2,
  Menu,
  X,
  Settings,
  LogOut,
  Bell,
  CreditCard,
  User as UserIcon,
  Globe,
  Bot,
  Zap,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  Cell
} from "recharts";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import { cn } from "./lib/utils";
import { marketData, marketLeaders, constitutionalHurdles } from "./data/reportData";
import { ai, SYSTEM_PROMPT } from "./lib/gemini";
import LandingPage from "./components/LandingPage";
import AuthPage from "./components/AuthPage";

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <motion.button
    whileHover={{ x: 5, translateZ: 20 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl transition-all duration-200 preserve-3d text-[10px] font-black uppercase tracking-widest",
      active 
        ? "bg-white text-black shadow-lg translate-z-10" 
        : "text-slate-400 hover:bg-white/5 hover:text-white"
    )}
  >
    <Icon size={18} className={active ? "text-indigo-600" : "text-slate-500"} />
    <span>{label}</span>
  </motion.button>
);

const StatCard = ({ label, value, subValue, icon: Icon, color }: { label: string, value: string, subValue: string, icon: any, color: string }) => (
  <motion.div 
    whileHover={{ rotateX: 10, rotateY: -10, translateZ: 40 }}
    className="glass-3d p-8 rounded-[2rem] preserve-3d transition-all border border-white/5"
  >
    <div className="flex items-start justify-between translate-z-20">
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{label}</p>
        <h3 className="text-3xl font-black font-display text-white">{value}</h3>
        <p className={cn("text-[10px] font-black uppercase tracking-widest mt-2", color)}>{subValue}</p>
      </div>
      <div className={cn("p-4 rounded-2xl bg-white/5 border border-white/5", color.replace('text-', 'text-'))}>
        <Icon size={28} className={color} />
      </div>
    </div>
  </motion.div>
);

const MarketChart = () => {
  const data = marketData.map(d => ({
    name: d.segment.replace('India Legal ', ''),
    "Current": d.baseValuation,
    "Planned": d.projectedValuation,
  }));

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800 }} 
          />
          <Tooltip 
            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            contentStyle={{ backgroundColor: '#151619', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
          />
          <Bar dataKey="Current" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={25} />
          <Bar dataKey="Planned" fill="#6366f133" radius={[4, 4, 0, 0]} barSize={25} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const LeaderCard = ({ leader }: { leader: typeof marketLeaders[0] }) => (
  <motion.div 
    whileHover={{ y: -10, rotateY: 5, translateZ: 30 }}
    className="glass-3d p-6 rounded-[2rem] preserve-3d group transition-shadow hover:shadow-indigo-500/10"
  >
    <div className="flex items-start gap-4 translate-z-10">
      <div className="flex-shrink-0 w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-indigo-400 font-black italic border border-white/10 shadow-inner">
        #{leader.rank}
      </div>
      <div className="flex-grow">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-black text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{leader.name}</h4>
          {leader.location && (
            <span className="flex items-center gap-1 text-[9px] font-black text-slate-500 uppercase tracking-widest">
              <MapPin size={10} /> {leader.location}
            </span>
          )}
        </div>
        <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-3">{leader.category}</p>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {leader.funding && (
            <div className="bg-white/5 p-2 rounded-xl border border-white/5">
              <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Funding</p>
              <p className="text-[11px] font-black text-slate-200">{leader.funding}</p>
            </div>
          )}
          {leader.revenue && (
            <div className="bg-white/5 p-2 rounded-xl border border-white/5">
              <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Revenue</p>
              <p className="text-[11px] font-black text-slate-200">{leader.revenue}</p>
            </div>
          )}
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed italic font-medium">
          "{leader.differentiator}"
        </p>
      </div>
    </div>
  </motion.div>
);

const ChatInterface = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([
    { role: 'ai', content: "Hello! I'm your India Legal AI Assistant. Ask me anything about the strategic analysis report, market growth, or constitutional challenges." }
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

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: 'user', parts: [{ text: SYSTEM_PROMPT + "\n\nUser Question: " + userMessage }] }
        ],
      });

      const aiResponse = response.text || "I'm sorry, I couldn't process that request.";
      setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: 'ai', content: "Error: Unable to connect to the AI service." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-3d rounded-[2.5rem] border border-white/5 shadow-2xl flex flex-col h-[600px] overflow-hidden preserve-3d">
      <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Amicus AI • Active Neural Net</h3>
        </div>
        <div className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">v4.2.0-STABLE</div>
      </div>
      
      <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-6 scroll-smooth mask-fade-y">
        {messages.map((msg, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={i} 
            className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}
          >
            <div className={cn(
              "max-w-[80%] p-4 rounded-2xl text-[11px] leading-relaxed",
              msg.role === 'user' 
                ? "bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-500/10" 
                : "glass-3d text-slate-200 rounded-tl-none border border-white/5"
            )}>
              <div className="prose prose-invert prose-xs max-w-none">
                <ReactMarkdown>
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="glass-3d p-4 rounded-2xl rounded-tl-none flex items-center gap-3">
              <Loader2 size={16} className="animate-spin text-indigo-500" />
              <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Processing Latencies...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-white/5 bg-black/20">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Query the legal corpus..."
            className="w-full pl-6 pr-14 py-4 bg-white/5 border border-white/10 rounded-2xl text-[11px] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-indigo-400 hover:text-white transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

const SettingsTab = () => (
  <div className="max-w-4xl space-y-8">
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
      <h3 className="text-xl font-black mb-6 flex items-center gap-2">
        <UserIcon className="text-indigo-600" /> Profile Settings
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
          <input type="text" defaultValue="Adv. Rajesh Sharma" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
          <input type="email" defaultValue="rajesh@sharma-associates.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Firm Name</label>
          <input type="text" defaultValue="Sharma & Associates" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Location</label>
          <input type="text" defaultValue="New Delhi, India" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
      </div>
      <button className="mt-8 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
        Save Changes
      </button>
    </div>

    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
      <h3 className="text-xl font-black mb-6 flex items-center gap-2">
        <CreditCard className="text-indigo-600" /> Subscription Plan
      </h3>
      <div className="flex items-center justify-between p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
        <div>
          <p className="text-xs font-bold text-indigo-600 uppercase mb-1">Current Plan</p>
          <h4 className="text-xl font-black text-indigo-900">Professional Plan</h4>
          <p className="text-sm text-indigo-700 mt-1">$49/month • Next billing on May 04, 2026</p>
        </div>
        <button className="bg-white text-indigo-900 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-all border border-indigo-200">
          Manage Billing
        </button>
      </div>
    </div>

    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
      <h3 className="text-xl font-black mb-6 flex items-center gap-2">
        <ShieldCheck className="text-indigo-600" /> Security & Privacy
      </h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between py-4 border-b border-slate-50">
          <div>
            <h4 className="font-bold text-slate-900">Two-Factor Authentication</h4>
            <p className="text-xs text-slate-500">Add an extra layer of security to your account.</p>
          </div>
          <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Enable</button>
        </div>
        <div className="flex items-center justify-between py-4">
          <div>
            <h4 className="font-bold text-slate-900">DPDP Data Export</h4>
            <p className="text-xs text-slate-500">Request a copy of your personal data as per DPDP Act 2023.</p>
          </div>
          <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Request Export</button>
        </div>
      </div>
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [view, setView] = useState<'landing' | 'auth' | 'dashboard'>('landing');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'leaders' | 'challenges' | 'assistant' | 'settings'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (view === 'landing') {
    return <LandingPage onGetStarted={() => setView('auth')} />;
  }

  if (view === 'auth') {
    return <AuthPage onAuthSuccess={() => setView('dashboard')} />;
  }

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'leaders', label: 'Market Leaders', icon: Users },
    { id: 'challenges', label: 'Legal Hurdles', icon: Scale },
    { id: 'assistant', label: 'AI Assistant', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#0a0502] text-white overflow-hidden font-sans">
      <div className="atmosphere-bg opacity-40 shrink-0" />
      
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -300 }}
        animate={{ x: isSidebarOpen ? 0 : -300 }}
        className={cn(
          "fixed lg:relative inset-y-0 left-0 z-50 w-72 glass-3d border-r border-white/5 flex flex-col p-6 transition-all duration-500",
          !isSidebarOpen && "lg:w-0 lg:p-0 lg:border-none"
        )}
      >
        <div className={cn("flex flex-col h-full", !isSidebarOpen && "opacity-0 invisible")}>
          <div className="flex items-center gap-3 mb-12 px-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg shadow-indigo-500/30">L</div>
            <h1 className="text-xl font-black tracking-tight font-display">LegalAI <span className="text-indigo-500">India</span></h1>
          </div>
          
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <SidebarItem 
                key={item.id}
                icon={item.icon} 
                label={item.label} 
                active={activeTab === item.id} 
                onClick={() => setActiveTab(item.id as any)} 
              />
            ))}
          </nav>

          <div className="mt-auto pt-8 border-t border-white/5">
            <div className="flex items-center gap-4 mb-8 p-3 glass-3d rounded-2xl border border-white/5">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black italic shadow-sm">RS</div>
              <div className="flex-grow overflow-hidden">
                <p className="text-[10px] font-black text-white truncate">Adv. Rajesh Sharma</p>
                <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Professional Plan</p>
              </div>
            </div>
            <button 
              onClick={() => setView('landing')}
              className="flex items-center gap-3 w-full px-5 py-4 rounded-2x text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-500/20"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-10 relative z-10 scroll-smooth">
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-3 glass-3d rounded-xl text-slate-400 hover:text-white transition-all underline-offset-4"
            >
              <Menu size={20} />
            </button>
            <div>
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 mb-2">Systems Status • Nominal</h2>
              <h1 className="text-4xl font-black font-display uppercase tracking-tight">
                {navItems.find(i => i.id === activeTab)?.label}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex flex-col items-end">
               <span className="text-[10px] font-black text-white uppercase tracking-widest">Real-time Pulse</span>
               <span className="text-[9px] text-emerald-400 font-bold uppercase flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
                  Synced with e-Courts
               </span>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <button className="p-3 glass-3d rounded-xl text-slate-400 hover:text-indigo-400 transition-all relative">
              <Bell size={20} />
              <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-black" />
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98, rotateX: 5 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ duration: 0.5, type: "spring", bounce: 0 }}
            className="preserve-3d"
          >
            {activeTab === 'dashboard' && (
              <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard label="Analytic Potential" value="$1.3B" subValue="+12.4% Momentum" icon={TrendingUp} color="text-indigo-400" />
                  <StatCard label="System Backlog" value="4.5M" subValue="Compression active" icon={Scale} color="text-rose-400" />
                  <StatCard label="AI Adoption" value="28%" subValue="+5% per quarter" icon={Bot} color="text-emerald-400" />
                  <StatCard label="E-Courts" value="1.2k" subValue="Native integration" icon={Globe} color="text-sky-400" />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 glass-3d p-10 rounded-[3rem] preserve-3d border border-white/5">
                    <div className="flex items-center justify-between mb-10">
                      <h3 className="text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-3">
                         <Zap size={18} className="text-indigo-400" /> Growth Trajectory
                      </h3>
                    </div>
                    <div className="h-[450px] w-full">
                      <MarketChart />
                    </div>
                  </div>
                  <div className="glass-3d p-10 rounded-[3rem] preserve-3d border border-white/5">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-10 flex items-center gap-3">
                       <ShieldCheck size={18} className="text-indigo-400" /> RAG Extractor Status
                    </h3>
                    <div className="space-y-6">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex items-center gap-5 p-5 glass-3d rounded-2xl border border-white/5 group hover:bg-white/5 transition-all">
                           <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 transition-transform">
                              <Sparkles size={20} className="text-indigo-400" />
                           </div>
                           <div>
                              <p className="text-[11px] font-black text-white">DPDP Module v2.{i}</p>
                              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Optimized for Vernacular</p>
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'leaders' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {marketLeaders.map((leader, i) => (
                  <LeaderCard key={i} leader={leader} />
                ))}
              </div>
            )}

            {activeTab === 'challenges' && (
              <div className="space-y-8">
                {constitutionalHurdles.map((hurdle, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ scale: 1.01, translateZ: 15 }}
                    className="glass-3d p-12 rounded-[3.5rem] border border-white/5 relative overflow-hidden"
                  >
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl" />
                    <div className="flex flex-col lg:flex-row items-start gap-10 relative z-10">
                      <div className="p-6 bg-rose-500/10 rounded-3xl text-rose-400 border border-rose-500/20 shadow-lg shadow-rose-500/10">
                        <Scale size={40} />
                      </div>
                      <div className="flex-1">
                        <div className="inline-flex items-center px-4 py-1.5 bg-rose-500/10 text-rose-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-rose-500/20">
                          {hurdle.article}
                        </div>
                        <h3 className="text-4xl font-black font-display mb-6 tracking-tight uppercase">{hurdle.title}</h3>
                        <p className="text-slate-400 leading-relaxed max-w-3xl text-lg mb-10 italic font-medium">"{hurdle.challenge}"</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'assistant' && (
              <div className="h-[calc(100vh-280px)] flex items-center justify-center">
                <div className="w-full max-w-5xl h-full animate-float">
                   <ChatInterface />
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="max-w-5xl mx-auto">
                <SettingsTab />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
