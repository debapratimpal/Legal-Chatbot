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
  Globe
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
    whileHover={{ x: 5, translateZ: 10 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 preserve-3d",
      active 
        ? "bg-indigo-600 text-white shadow-3d translate-z-10" 
        : "text-slate-500 hover:bg-white hover:text-indigo-600 hover:shadow-sm"
    )}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </motion.button>
);

const StatCard = ({ label, value, subValue, icon: Icon, color }: { label: string, value: string, subValue: string, icon: any, color: string }) => (
  <motion.div 
    whileHover={{ rotateX: 5, rotateY: -5, translateZ: 20 }}
    className="bg-white p-6 rounded-2xl border border-slate-100 shadow-3d preserve-3d transition-all"
  >
    <div className="flex items-start justify-between translate-z-10">
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        <p className={cn("text-xs font-semibold mt-1", color)}>{subValue}</p>
      </div>
      <div className={cn("p-3 rounded-xl shadow-inner", color.replace('text-', 'bg-').replace('600', '100'))}>
        <Icon size={24} className={color} />
      </div>
    </div>
  </motion.div>
);

const MarketChart = () => {
  const data = marketData.map(d => ({
    name: d.segment.replace('India Legal ', ''),
    "2024 (Base)": d.baseValuation,
    "2030 (Projected)": d.projectedValuation,
    cagr: d.cagr
  }));

  return (
    <motion.div 
      whileHover={{ rotateX: 2 }}
      className="bg-white p-6 rounded-2xl border border-slate-100 shadow-3d h-[400px] preserve-3d"
    >
      <div className="flex items-center justify-between mb-6 translate-z-10">
        <h3 className="text-lg font-bold text-slate-900">Market Valuation Growth (USD Million)</h3>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-sm" />
            <span className="text-slate-500">2024 Base</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-indigo-200 shadow-sm" />
            <span className="text-slate-500">2030 Projected</span>
          </div>
        </div>
      </div>
      <div className="h-full translate-z-10">
        <ResponsiveContainer width="100%" height="80%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12 }} 
            />
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="2024 (Base)" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={30} />
            <Bar dataKey="2030 (Projected)" fill="#c7d2fe" radius={[4, 4, 0, 0]} barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

const LeaderCard = ({ leader }: { leader: typeof marketLeaders[0] }) => (
  <motion.div 
    whileHover={{ y: -10, rotateY: 5, translateZ: 30 }}
    className="bg-white p-5 rounded-2xl border border-slate-100 shadow-3d preserve-3d group"
  >
    <div className="flex items-start gap-4 translate-z-10">
      <div className="flex-shrink-0 w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-indigo-600 font-bold border border-slate-100 shadow-inner">
        #{leader.rank}
      </div>
      <div className="flex-grow">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{leader.name}</h4>
          {leader.location && (
            <span className="flex items-center gap-1 text-[10px] font-medium text-slate-400 uppercase tracking-wider">
              <MapPin size={10} /> {leader.location}
            </span>
          )}
        </div>
        <p className="text-xs text-indigo-600 font-medium mb-3">{leader.category}</p>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {leader.funding && (
            <div className="bg-slate-50 p-2 rounded-lg shadow-inner">
              <p className="text-[10px] text-slate-400 uppercase font-bold">Funding</p>
              <p className="text-xs font-bold text-slate-700">{leader.funding}</p>
            </div>
          )}
          {leader.revenue && (
            <div className="bg-slate-50 p-2 rounded-lg shadow-inner">
              <p className="text-[10px] text-slate-400 uppercase font-bold">Revenue</p>
              <p className="text-xs font-bold text-slate-700">{leader.revenue}</p>
            </div>
          )}
        </div>
        <p className="text-xs text-slate-500 leading-relaxed italic">
          "{leader.differentiator}"
        </p>
      </div>
    </div>
  </motion.div>
);

const ChatInterface = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([
    { role: 'ai', content: "Hello! I'm your India Legal AI Assistant. Ask me anything about the strategic analysis report, market growth, or constitutional challenges in the Indian legal tech sector." }
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
      setMessages(prev => [...prev, { role: 'ai', content: "Error: Unable to connect to the AI service. Please check your API key." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col h-[600px] overflow-hidden">
      <div className="p-4 border-b border-slate-50 bg-indigo-50 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <h3 className="text-sm font-bold text-indigo-900">Legal AI Assistant</h3>
      </div>
      
      <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4 scroll-smooth">
        {messages.map((msg, i) => (
          <div key={i} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
            <div className={cn(
              "max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed",
              msg.role === 'user' 
                ? "bg-indigo-600 text-white rounded-tr-none" 
                : "bg-slate-100 text-slate-700 rounded-tl-none"
            )}>
              <div className={cn("prose prose-sm max-w-none", msg.role === 'user' ? "prose-invert" : "prose-indigo")}>
                <ReactMarkdown>
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-indigo-600" />
              <span className="text-xs text-slate-500 font-medium">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-50 bg-slate-50/50">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about market CAGR, DPDP Act, or SpotDraft..."
            className="w-full pl-4 pr-12 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg disabled:opacity-50 transition-colors"
          >
            <Send size={18} />
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

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transition-transform duration-300 lg:relative lg:translate-x-0",
        !isSidebarOpen && "-translate-x-full lg:hidden"
      )}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black italic">L</div>
            <h1 className="text-xl font-black tracking-tight text-slate-900">LegalAI <span className="text-indigo-600">India</span></h1>
          </div>
          
          <nav className="space-y-2 flex-grow">
            <SidebarItem 
              icon={LayoutDashboard} 
              label="Dashboard" 
              active={activeTab === 'dashboard'} 
              onClick={() => setActiveTab('dashboard')} 
            />
            <SidebarItem 
              icon={Users} 
              label="Market Leaders" 
              active={activeTab === 'leaders'} 
              onClick={() => setActiveTab('leaders')} 
            />
            <SidebarItem 
              icon={Scale} 
              label="Legal Hurdles" 
              active={activeTab === 'challenges'} 
              onClick={() => setActiveTab('challenges')} 
            />
            <SidebarItem 
              icon={MessageSquare} 
              label="AI Assistant" 
              active={activeTab === 'assistant'} 
              onClick={() => setActiveTab('assistant')} 
            />
            <SidebarItem 
              icon={Settings} 
              label="Settings" 
              active={activeTab === 'settings'} 
              onClick={() => setActiveTab('settings')} 
            />
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-100">
            <div className="flex items-center gap-3 mb-6 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">RS</div>
              <div className="flex-grow">
                <p className="text-xs font-bold text-slate-900">Adv. Rajesh Sharma</p>
                <p className="text-[10px] text-slate-500">Professional Plan</p>
              </div>
            </div>
            <button 
              onClick={() => setView('landing')}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200"
            >
              <LogOut size={20} />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4 lg:p-8 overflow-y-auto">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 capitalize">{activeTab}</h2>
            <p className="text-slate-500 text-sm">Strategic insights into India's legal technology evolution.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 transition-colors relative">
              <Bell size={20} />
              <div className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </button>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600">
              <ShieldCheck size={14} className="text-green-500" />
              DPDP Compliant
            </div>
            <button className="lg:hidden p-2 bg-white border border-slate-200 rounded-xl" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                  label="India Legal AI Market" 
                  value="$106.3M" 
                  subValue="+23% CAGR (2030)" 
                  icon={TrendingUp} 
                  color="text-indigo-600"
                />
                <StatCard 
                  label="Judicial Backlog" 
                  value="50M+" 
                  subValue="Pending Cases" 
                  icon={Scale} 
                  color="text-rose-600"
                />
                <StatCard 
                  label="Market Leaders" 
                  value="10+" 
                  subValue="Top SaaS Providers" 
                  icon={Users} 
                  color="text-amber-600"
                />
                <StatCard 
                  label="Govt Allocation" 
                  value="₹7,210 Cr" 
                  subValue="e-Courts Phase III" 
                  icon={ShieldCheck} 
                  color="text-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <MarketChart />
                </div>
                <div className="bg-indigo-900 p-8 rounded-3xl text-white relative overflow-hidden flex flex-col justify-between">
                  <div className="relative z-10">
                    <h3 className="text-2xl font-black mb-4 leading-tight">The Metamorphosis of Indian Law</h3>
                    <p className="text-indigo-200 text-sm leading-relaxed mb-6">
                      From passive digitisation to autonomous automation. The epicentre of growth is shifting to APAC, with India as the undisputed frontier.
                    </p>
                  </div>
                  <div className="relative z-10">
                    <button 
                      onClick={() => setActiveTab('assistant')}
                      className="flex items-center gap-2 bg-white text-indigo-900 px-6 py-3 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors"
                    >
                      Ask AI Assistant <ChevronRight size={16} />
                    </button>
                  </div>
                  {/* Abstract background shape */}
                  <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-indigo-800 rounded-full blur-3xl opacity-50" />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'leaders' && (
            <motion.div
              key="leaders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {marketLeaders.map((leader, i) => (
                <LeaderCard key={i} leader={leader} />
              ))}
            </motion.div>
          )}

          {activeTab === 'challenges' && (
            <motion.div
              key="challenges"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-xl font-black text-slate-900 mb-6">Constitutional Friction Matrix</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {constitutionalHurdles.map((h, i) => (
                    <div key={i} className="space-y-4">
                      <div className="inline-flex items-center px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                        {h.article}
                      </div>
                      <h4 className="font-bold text-slate-900">{h.title}</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">{h.challenge}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100">
                  <h4 className="font-bold text-rose-900 mb-2">The Hallucination Crisis</h4>
                  <p className="text-sm text-rose-700 leading-relaxed">
                    In early 2026, the Supreme Court expressed alarm over AI-drafted petitions with fabricated precedents like "Mercy vs Mankind". Relying on non-existent judgments is now classified as severe professional misconduct.
                  </p>
                </div>
                <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
                  <h4 className="font-bold text-amber-900 mb-2">DPDP Act 2023 Compliance</h4>
                  <p className="text-sm text-amber-700 leading-relaxed">
                    Data Fiduciaries must ensure explicit consent and purpose limitation. Penalties for severe breaches can run as high as ₹250 crore, forcing SaaS providers to adopt on-device processing.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'assistant' && (
            <motion.div
              key="assistant"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <ChatInterface />
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <SettingsTab />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
