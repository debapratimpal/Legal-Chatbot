import React from "react";
import { 
  ChevronRight, 
  ShieldCheck, 
  Zap, 
  Users, 
  Scale, 
  Globe, 
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { motion } from "motion/react";

const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <motion.div 
    whileHover={{ y: -10, rotateX: 5, rotateY: 5, translateZ: 20 }}
    className="bg-white p-8 rounded-3xl border border-slate-100 shadow-3d hover:shadow-2xl transition-all duration-300 group preserve-3d"
  >
    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-inner translate-z-10">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3 translate-z-10">{title}</h3>
    <p className="text-slate-500 leading-relaxed text-sm translate-z-10">{description}</p>
  </motion.div>
);

const PricingCard = ({ plan, price, features, highlighted, onSelect }: { plan: string, price: string, features: string[], highlighted?: boolean, onSelect: () => void }) => (
  <motion.div 
    whileHover={{ scale: highlighted ? 1.08 : 1.05, rotateY: highlighted ? 0 : 5, translateZ: 50 }}
    className={cn(
      "p-8 rounded-3xl border transition-all duration-300 flex flex-col shadow-3d preserve-3d",
      highlighted 
        ? "bg-indigo-900 text-white border-indigo-900 scale-105 z-10" 
        : "bg-white text-slate-900 border-slate-100"
    )}
  >
    <div className="translate-z-10">
      <h3 className="text-lg font-bold mb-2">{plan}</h3>
      <div className="flex items-baseline gap-1 mb-6">
        <span className="text-4xl font-black">{price}</span>
        <span className={highlighted ? "text-indigo-300" : "text-slate-400"}>/month</span>
      </div>
      <ul className="space-y-4 mb-8 flex-grow">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-3 text-sm">
            <CheckCircle2 size={18} className={highlighted ? "text-indigo-400" : "text-emerald-500"} />
            <span className={highlighted ? "text-indigo-100" : "text-slate-600"}>{f}</span>
          </li>
        ))}
      </ul>
      <button 
        onClick={onSelect}
        className={cn(
          "w-full py-4 rounded-xl font-bold transition-all shadow-lg",
          highlighted 
            ? "bg-white text-indigo-900 hover:bg-indigo-50" 
            : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100"
        )}
      >
        Get Started
      </button>
    </div>
  </motion.div>
);

import { cn } from "../lib/utils";

export default function LandingPage({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black italic">L</div>
            <h1 className="text-xl font-black tracking-tight text-slate-900">LegalAI <span className="text-indigo-600">India</span></h1>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a>
            <a href="#about" className="hover:text-indigo-600 transition-colors">About</a>
          </div>
          <button 
            onClick={onGetStarted}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest mb-6">
              <Zap size={14} /> The Future of Indian Law
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8 max-w-4xl mx-auto">
              Strategic Intelligence for the <span className="text-indigo-600">Modern Advocate</span>
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
              Navigate India's legal metamorphosis with AI-driven insights, real-time market dynamics, and constitutional compliance monitoring.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={onGetStarted}
                className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2"
              >
                Start Free Trial <ArrowRight size={20} />
              </button>
              <button className="w-full sm:w-auto bg-white text-slate-600 border border-slate-200 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all">
                View Demo
              </button>
            </div>
          </motion.div>

          {/* Hero Image / Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20 relative max-w-5xl mx-auto"
          >
            <div className="bg-white p-4 rounded-[2.5rem] shadow-2xl border border-slate-100">
              <div className="bg-slate-50 rounded-[2rem] aspect-video overflow-hidden border border-slate-100 flex items-center justify-center">
                <div className="text-slate-300 flex flex-col items-center gap-4">
                  <LayoutDashboard size={64} />
                  <span className="font-bold uppercase tracking-widest text-sm">Dashboard Preview</span>
                </div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-100 rounded-full blur-3xl opacity-50 -z-10" />
            <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-indigo-200 rounded-full blur-3xl opacity-50 -z-10" />
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">Engineered for Precision</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Our platform bridges the gap between technological potential and legal reality in the Indian jurisdiction.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={ShieldCheck}
              title="DPDP Compliant"
              description="Baked-in compliance with the Digital Personal Data Protection Act 2023, featuring on-device processing."
            />
            <FeatureCard 
              icon={Globe}
              title="Vernacular Support"
              description="NLP models trained on Indian dialects to capture nuances of local legal terminology across the subcontinent."
            />
            <FeatureCard 
              icon={Scale}
              title="RAG Architecture"
              description="Retrieval-Augmented Generation anchored to verified Indian databases to eliminate AI hallucinations."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">Simple, Transparent Pricing</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Choose the plan that fits your practice, from independent advocates to tier-one law firms.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <PricingCard 
              plan="Advocate"
              price="$0"
              features={[
                "Basic Market Insights",
                "Public Case Tracking",
                "Standard AI Assistant",
                "Community Support"
              ]}
              onSelect={onGetStarted}
            />
            <PricingCard 
              plan="Professional"
              price="$49"
              highlighted
              features={[
                "Advanced Market Analytics",
                "Unlimited AI Assistant",
                "DPDP Compliance Tools",
                "Priority Support",
                "Custom Report Exports"
              ]}
              onSelect={onGetStarted}
            />
            <PricingCard 
              plan="Enterprise"
              price="$199"
              features={[
                "Multi-user Workspaces",
                "On-device Processing",
                "API Access",
                "Dedicated Account Manager",
                "Custom RAG Integration"
              ]}
              onSelect={onGetStarted}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black italic">L</div>
              <h1 className="text-xl font-black tracking-tight">LegalAI <span className="text-indigo-600">India</span></h1>
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed">
              Empowering the next generation of Indian legal professionals with strategic AI intelligence and market insights.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6">Product</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Legal</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">DPDP Compliance</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-800 text-center text-slate-500 text-xs">
          © 2026 LegalAI India. All rights reserved. Strategic Analysis Report v1.0
        </div>
      </footer>
    </div>
  );
}

import { LayoutDashboard } from "lucide-react";
