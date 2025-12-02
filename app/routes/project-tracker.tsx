import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  ChevronDown,
  ChevronUp,
  Database,
  Layout,
  ShoppingCart,
  BarChart,
  Server,
  Rocket,
  Code,
  Sparkles,
  Bot,
  Loader2,
  X
} from 'lucide-react';

const EkoeProjectTracker = () => {
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null);

  // AI State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiContent, setAiContent] = useState("");
  const [aiTitle, setAiTitle] = useState("");

  const apiKey = ""; // API Key will be injected by the environment

  const togglePhase = (id: number) => {
    if (expandedPhase === id) {
      setExpandedPhase(null);
    } else {
      setExpandedPhase(id);
    }
  };

  // Data structure extracted from the PDF and Codebase Analysis
  const projectPhases = [
    {
      id: 1,
      title: "Phase 1: Initialization & Foundation",
      thTitle: "การเริ่มต้นและวางรากฐาน",
      icon: <Code className="w-6 h-6" />,
      progress: 100,
      status: "completed",
      goal: "Set up the development environment and design system.",
      categories: [
        {
          name: "Project Setup",
          tasks: [
            { name: "Initialize React Router v7 app", progress: 100 },
            { name: "Configure tsconfig.json", progress: 100 },
            { name: "Setup ESLint and Prettier", progress: 100 }
          ]
        },
        {
          name: "Design System",
          tasks: [
            { name: "Tailwind config & Fonts", progress: 100 },
            { name: "Color palette", progress: 100 },
            { name: "Components (Button, Input, Modal)", progress: 100 },
            { name: "Integrate Icons", progress: 100 }
          ]
        },
        {
          name: "Database",
          tasks: [
            { name: "Initialize PostgreSQL", progress: 100 },
            { name: "Drizzle ORM & Schema", progress: 100 },
            { name: "Connect React Router V7", progress: 100 }
          ]
        }
      ]
    },
    {
      id: 2,
      title: "Phase 2: Backend & Admin Portal",
      thTitle: "ระบบหลังบ้านและผู้ดูแล",
      icon: <Server className="w-6 h-6" />,
      progress: 95,
      status: "in-progress",
      goal: "Build the internal tools first to populate Reliable Data.",
      categories: [
        {
          name: "Auth & Schema (Completed)",
          tasks: [
            { name: "Admin Login & Auth", progress: 100 },
            { name: "Protected Routes", progress: 100 },
            { name: "Database Models (User, Product, Blog, etc.)", progress: 100 }
          ]
        },
        {
          name: "Dashboard Development",
          tasks: [
            { name: "Product List View", progress: 100 },
            { name: "Product Create/Edit Form", progress: 100 },
            { name: "Blog Post Editor", progress: 100 },
            { name: "Image Upload Integration", progress: 100 },
            { name: "Order Status Management", progress: 90 },
            { name: "Discount Code UI", progress: 90 }
          ]
        }
      ]
    },
    {
      id: 3,
      title: "Phase 3: Public Storefront (SSR & UI)",
      thTitle: "หน้าร้านค้า (Frontend)",
      icon: <Layout className="w-6 h-6" />,
      progress: 90,
      status: "in-progress",
      goal: "Build the high-performance, SEO-friendly client app.",
      categories: [
        {
          name: "Layout & Navigation",
          tasks: [
            { name: "Header & Footer", progress: 100 },
            { name: "Newsletter Popup", progress: 100 }
          ]
        },
        {
          name: "Home Page",
          tasks: [
            { name: "Hero Slider", progress: 100 },
            { name: "Best Sellers Data Fetching", progress: 100 },
            { name: "UI Grids & Blog Preview", progress: 100 }
          ]
        },
        {
          name: "Shop & Products",
          tasks: [
            { name: "Shop Grid & Filters", progress: 90 },
            { name: "Product Details (Gallery, Tabs)", progress: 90 },
            { name: "Related Products", progress: 80 }
          ]
        }
      ]
    },
    {
      id: 4,
      title: "Phase 4: Cart & Checkout Logic",
      thTitle: "ตะกร้าสินค้าและการชำระเงิน",
      icon: <ShoppingCart className="w-6 h-6" />,
      progress: 80,
      status: "in-progress",
      goal: "Secure and smooth transaction flow.",
      categories: [
        {
          name: "Cart System",
          tasks: [
            { name: "Zustand Store Setup", progress: 100 },
            { name: "Cart Drawer UI", progress: 100 },
            { name: "Free Gift Logic", progress: 80 },
            { name: "Coupon Code API", progress: 80 }
          ]
        },
        {
          name: "Checkout Flow",
          tasks: [
            { name: "Step 1: Contact & Delivery", progress: 90 },
            { name: "Step 2: Shipping Method", progress: 80 },
            { name: "Step 3: Payments (Credit Card/PromptPay)", progress: 50 },
            { name: "Order Creation API", progress: 60 }
          ]
        }
      ]
    },
    {
      id: 5,
      title: "Phase 5: SEO, Analytics & Optimization",
      thTitle: "SEO และการวัดผล",
      icon: <BarChart className="w-6 h-6" />,
      progress: 10,
      status: "todo",
      goal: "Maximize visibility and performance.",
      categories: [
        {
          name: "SEO & Analytics",
          tasks: [
            { name: "Metadata & JSON-LD", progress: 20 },
            { name: "Sitemap & Robots.txt", progress: 0 },
            { name: "Google Analytics / GTM", progress: 0 },
            { name: "Core Web Vitals & Image Opt.", progress: 20 }
          ]
        }
      ]
    },
    {
      id: 6,
      title: "Phase 6: Testing & Deployment",
      thTitle: "การทดสอบและนำขึ้นระบบ",
      icon: <Rocket className="w-6 h-6" />,
      progress: 10,
      status: "todo",
      goal: "Ensuring stability and production readiness.",
      categories: [
        {
          name: "QA & Deploy",
          tasks: [
            { name: "Cross-browser Testing", progress: 0 },
            { name: "End-to-End Testing", progress: 0 },
            { name: "Database Migrations", progress: 100 },
            { name: "Vercel Deployment", progress: 0 }
          ]
        }
      ]
    }
  ];

  // Helper to call Gemini API
  const callGeminiAPI = async (prompt: string, title: string) => {
    setAiLoading(true);
    setAiTitle(title);
    setAiModalOpen(true);
    setAiContent("");

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message);
      }
      const text = data.candidates[0].content.parts[0].text;
      setAiContent(text);
    } catch (error: any) {
      setAiContent("เกิดข้อผิดพลาดในการเชื่อมต่อกับ Gemini: " + error.message);
    } finally {
      setAiLoading(false);
    }
  };

  // Feature 1: Generate Executive Summary
  const handleGenerateReport = () => {
    // Construct a simplified text version of the project status
    const summaryData = projectPhases.map(p => `${p.title}: ${p.progress}% completed. Status: ${p.status}.`).join('\n');
    const prompt = `
      Act as a Senior Technical Project Manager. 
      Analyze the following project status data for the "Ekoe E-Commerce" project.
      
      Project Data:
      ${summaryData}
      
      Write a concise Executive Summary in Thai (ภาษาไทย).
      Structure the response as:
      1. Overall Progress Assessment (Satisfactory/Risk)
      2. Key Achievements (What is 100% done)
      3. Critical Bottlenecks (Focus on Phases that are started but not finished)
      4. Next Week's Priorities (Focus on things near 0% in active phases)
      
      Keep the tone professional and encouraging.
    `;
    callGeminiAPI(prompt, "✨ AI Executive Report");
  };

  // Feature 2: Generate Phase Specific Advice
  const handlePhaseInsight = (e: React.MouseEvent, phase: any) => {
    e.stopPropagation(); // Prevent accordion toggle
    const unfinishedTasks = phase.categories.flatMap((c: any) => c.tasks).filter((t: any) => t.progress < 100);
    const taskList = unfinishedTasks.map((t: any) => `- ${t.name} (${t.progress}%)`).join('\n');

    const prompt = `
      Act as a Lead Developer.
      I need technical advice for "${phase.title}".
      Goal: "${phase.goal}"
      Current Progress: ${phase.progress}%
      
      These tasks are incomplete:
      ${taskList}
      
      Please suggest 3 specific, technical "Next Action Steps" in Thai (ภาษาไทย) to help move these specific tasks to completion. 
      Keep it short and bulleted.
    `;
    callGeminiAPI(prompt, `✨ Smart Advisor: ${phase.thTitle}`);
  };

  // Calculate overall total progress
  const totalPhases = projectPhases.length;
  const totalProgressSum = projectPhases.reduce((acc, curr) => acc + curr.progress, 0);
  const overallProgress = Math.round(totalProgressSum / totalPhases);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-500 text-white';
      case 'in-progress': return 'bg-amber-500 text-white';
      default: return 'bg-slate-300 text-slate-600';
    }
  };

  const getProgressBarColor = (progress: number) => {
    if (progress === 100) return 'bg-emerald-500';
    if (progress > 50) return 'bg-blue-500';
    if (progress > 0) return 'bg-amber-500';
    return 'bg-slate-200';
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-4 md:p-8 relative">

      {/* AI Modal */}
      {aiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 animate-pulse" />
                <h3 className="font-bold text-lg">{aiTitle}</h3>
              </div>
              <button onClick={() => setAiModalOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 text-slate-700 leading-relaxed space-y-4">
              {aiLoading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <Loader2 className="w-10 h-10 text-violet-600 animate-spin" />
                  <p className="text-sm text-slate-500 animate-pulse">Gemini กำลังวิเคราะห์ข้อมูลโปรเจกต์...</p>
                </div>
              ) : (
                <div className="whitespace-pre-line prose prose-slate max-w-none">
                  {aiContent}
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setAiModalOpen(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-colors"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header Section */}
        <header className="text-center space-y-4 mb-6">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold tracking-wide uppercase">
            Project Dashboard
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Ekoe E-Commerce <span className="text-blue-600">Tracker</span>
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto">
            สรุปความคืบหน้าการพัฒนาเว็บไซต์ E-Commerce พร้อมระบบวิเคราะห์ AI
          </p>

          {/* AI Report Button */}
          <div className="pt-4 flex justify-center">
            <button
              onClick={handleGenerateReport}
              className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white transition-all duration-200 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
            >
              <Sparkles className="w-4 h-4 text-yellow-200 group-hover:rotate-12 transition-transform" />
              <span>Generate AI Executive Report</span>
              <div className="absolute inset-0 rounded-full bg-white/20 group-hover:animate-ping opacity-0 group-hover:opacity-100 duration-1000"></div>
            </button>
          </div>
        </header>

        {/* Overall Progress Card */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-emerald-500"></div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-slate-800 mb-2">ภาพรวมความสำเร็จ (Overall Progress)</h2>
              <p className="text-slate-500 text-sm mb-4">
                คำนวณจากความคืบหน้าเฉลี่ยของทั้ง 6 เฟส
              </p>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-1000 ease-out rounded-full"
                    style={{ width: `${overallProgress}%` }}
                  ></div>
                </div>
                <span className="text-2xl font-bold text-slate-800">{overallProgress}%</span>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-4 md:w-auto w-full">
              <div className="text-center p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <div className="text-emerald-600 font-bold text-xl">1</div>
                <div className="text-xs text-emerald-700 font-medium">Completed</div>
              </div>
              <div className="text-center p-3 bg-amber-50 rounded-xl border border-amber-100">
                <div className="text-amber-600 font-bold text-xl">3</div>
                <div className="text-xs text-amber-700 font-medium">In Progress</div>
              </div>
              <div className="text-center p-3 bg-slate-100 rounded-xl border border-slate-200">
                <div className="text-slate-600 font-bold text-xl">2</div>
                <div className="text-xs text-slate-600 font-medium">Pending</div>
              </div>
            </div>
          </div>
        </div>

        {/* Phases Timeline */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-400" /> Timeline Breakdown
            </h3>
            <span className="text-xs text-slate-400 font-medium">Last Updated: Dec 02, 2025</span>
          </div>

          {projectPhases.map((phase) => (
            <div
              key={phase.id}
              className={`bg-white rounded-xl shadow-sm border border-slate-200 transition-all duration-300 overflow-hidden ${expandedPhase === phase.id ? 'ring-2 ring-blue-500 shadow-md' : 'hover:shadow-md'}`}
            >
              {/* Card Header (Clickable) */}
              <div
                onClick={() => togglePhase(phase.id)}
                className="p-5 cursor-pointer flex flex-col md:flex-row gap-4 md:items-center justify-between group"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className={`p-3 rounded-lg ${phase.progress === 100 ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                    {phase.progress === 100 ? <CheckCircle2 className="w-6 h-6" /> : phase.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${getStatusColor(phase.status)}`}>
                        {phase.status === 'completed' ? 'DONE' : phase.status === 'in-progress' ? 'WIP' : 'TODO'}
                      </span>
                      <h4 className="font-bold text-slate-800 text-lg leading-tight">{phase.title}</h4>

                      {/* AI Phase Insight Button - Only show if not complete and started */}
                      {phase.progress < 100 && (
                        <button
                          onClick={(e) => handlePhaseInsight(e, phase)}
                          className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 bg-violet-50 text-violet-600 text-xs font-bold rounded-full border border-violet-100 hover:bg-violet-100 transition-colors"
                          title="Ask Gemini for advice on this phase"
                        >
                          <Sparkles className="w-3 h-3" />
                          Advisor
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 font-medium mb-1">{phase.thTitle}</p>
                    <p className="text-xs text-slate-400 hidden md:block">"{phase.goal}"</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 min-w-[140px] justify-end">
                  <div className="text-right flex-1">
                    <span className={`text-2xl font-bold ${phase.progress === 100 ? 'text-emerald-600' : phase.progress > 0 ? 'text-blue-600' : 'text-slate-300'}`}>
                      {phase.progress}%
                    </span>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full mt-1 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${getProgressBarColor(phase.progress)}`}
                        style={{ width: `${phase.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  {expandedPhase === phase.id ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </div>
              </div>

              {/* Expandable Content */}
              {expandedPhase === phase.id && (
                <div className="bg-slate-50 border-t border-slate-100 p-5 animate-fadeIn">
                  <div className="grid gap-6 md:grid-cols-2">
                    {phase.categories.map((cat, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                        <h5 className="font-semibold text-slate-700 mb-3 text-sm flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                          {cat.name}
                        </h5>
                        <ul className="space-y-3">
                          {cat.tasks.map((task, tIdx) => (
                            <li key={tIdx} className="space-y-1">
                              <div className="flex justify-between text-xs font-medium text-slate-600">
                                <span>{task.name}</span>
                                <span className={task.progress === 100 ? 'text-emerald-600' : 'text-slate-400'}>
                                  {task.progress}%
                                </span>
                              </div>
                              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${task.progress === 100 ? 'bg-emerald-400' : 'bg-blue-400'}`}
                                  style={{ width: `${task.progress}%` }}
                                ></div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EkoeProjectTracker;
