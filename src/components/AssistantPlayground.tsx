import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { Sparkles, Send, RefreshCw, Copy, Check, Briefcase, Wheat, HeartHandshake, GraduationCap, Church, Cpu, Bot, User, FileText, Download, CheckCircle2, AlertTriangle, FolderKanban, ShieldCheck, ListChecks, ArrowRight, Lock, Upload, MessageSquare } from 'lucide-react';

export const AssistantPlayground: React.FC = () => {
  const [activeTabMode, setActiveTabMode] = useState<'guided' | 'chat'>('guided');
  const [assistantType, setAssistantType] = useState<'business' | 'farm' | 'ngo' | 'school' | 'church' | 'general'>('business');

  // Guided Multi-Step State (WA-001 to WA-007)
  const [step, setStep] = useState<number>(1);
  const [projectAccount, setProjectAccount] = useState<string>('PRJ-2026-DEFAULT');
  const [customProjectName, setCustomProjectName] = useState<string>('My Organisation Transformation Project');
  const [selectedActivity, setSelectedActivity] = useState<string>('raid-log');
  const [targetOutputFormat, setTargetOutputFormat] = useState<'markdown' | 'report' | 'table' | 'brief'>('table');
  
  // Guided inputs
  const [inputTitle, setInputTitle] = useState<string>('PMO Governance & RAID Review');
  const [inputContext, setInputContext] = useState<string>('Implementing digital healthcare systems across 3 regional sites with tight budget constraints.');
  const [inputKeyMetrics, setInputKeyMetrics] = useState<string>('Budget: £250,000, Timeline: 6 months, Staffing: 8 team members');
  const [inputDate, setInputDate] = useState<string>('2026-09-01');
  const [inputNotes, setInputNotes] = useState<string>('Ensure compliance with national data privacy standards.');
  
  // Validation state (WA-005)
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [isGeneratingOutput, setIsGeneratingOutput] = useState<boolean>(false);
  const [generatedOutput, setGeneratedOutput] = useState<string | null>(null);

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: 'Welcome to WOW Business Assistant. I am ready to assist with Programme Management, RAID Logs, Change Management, Governance Reviews, or Benefits Realisation. How can I help your organisation today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      assistantType: 'business'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeTabMode === 'chat') {
      scrollToBottom();
    }
  }, [messages, loading, activeTabMode]);

  // Handle Assistant Type Switch
  const handleAssistantTypeChange = (type: typeof assistantType) => {
    setAssistantType(type);
    
    // Set sensible activity defaults for guided workflow
    const defaultActivities: Record<string, string> = {
      business: 'raid-log',
      farm: 'yield-optimization',
      ngo: 'grant-me-framework',
      school: 'academic-curriculum',
      church: 'stewardship-report',
      general: 'digital-readiness'
    };
    setSelectedActivity(defaultActivities[type] || 'raid-log');

    const welcomePrompts: Record<string, string> = {
      business: 'Switched to WOW Business Assistant. Ready for PMO, RAID logs, Change Management, and Governance Reviews.',
      farm: 'Switched to WOW Farm Assistant. Ready for agribusiness yield optimization, supply chain tracking, and farm management advice.',
      ngo: 'Switched to WOW NGO Assistant. Ready for donor grant reporting, Monitoring & Evaluation (M&E) frameworks, and impact briefs.',
      school: 'Switched to WOW School Assistant. Ready for academic administrative workflows, curriculum delivery planning, and governance.',
      church: 'Switched to WOW Church Assistant. Ready for ministry administration, volunteer coordination, and stewardship governance.',
      general: 'Switched to General WOW Assistant. Ready for overall Business Transformation, Digital Innovation, and Academy inquiry guidance.'
    };

    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'assistant',
        text: welcomePrompts[type] || 'WOW Assistant is ready.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        assistantType: type
      }
    ]);
  };

  // Run WA-005 Data Validation before generation
  const handleRunValidation = () => {
    setIsValidating(true);
    setValidationErrors([]);

    setTimeout(() => {
      const errors: string[] = [];
      if (!inputTitle.trim()) {
        errors.push('Title or Focus Area is required.');
      }
      if (!inputContext.trim() || inputContext.length < 15) {
        errors.push('Please provide a brief background context (at least 15 characters).');
      }
      if (!projectAccount.trim()) {
        errors.push('An isolated Project/Account identifier is required for data isolation compliance.');
      }

      setValidationErrors(errors);
      setIsValidating(false);

      if (errors.length === 0) {
        setStep(4); // Advance to Review & Generate
      }
    }, 400);
  };

  // Handle Guided Output Generation (WA-001..WA-006)
  const handleGenerateGuidedOutput = async () => {
    setIsGeneratingOutput(true);
    setGeneratedOutput(null);

    const guidedPrompt = `
Generate a structured, professional ${targetOutputFormat.toUpperCase()} output using WOW Business & Digital approved template formats.

[ISOLATED PROJECT ACCOUNT]: ${projectAccount} (${customProjectName})
[ASSISTANT PERSONA]: WOW ${assistantType.toUpperCase()} Assistant
[ACTIVITY / TASK]: ${selectedActivity}
[TITLE]: ${inputTitle}
[CONTEXT & BACKGROUND]: ${inputContext}
[KEY METRICS / PARAMETERS]: ${inputKeyMetrics}
[TARGET DATE]: ${inputDate}
[ADDITIONAL NOTES]: ${inputNotes}

REQUIREMENTS:
1. Provide a comprehensive, high-value, structured document layout using UK English.
2. Structure output cleanly with Executive Summary, Structured Data Table/Matrix, Actionable Recommendations, and Governance Controls.
3. Ensure private project data remains strictly contextualized to project account ${projectAccount}.
    `.trim();

    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assistantType,
          prompt: guidedPrompt,
          history: []
        })
      });

      const data = await res.json();
      setGeneratedOutput(data.text || 'Output generated successfully.');
      setStep(5); // Output complete screen
    } catch (err) {
      console.error('Error generating guided output:', err);
      setGeneratedOutput('Apologies, we encountered an issue generating your structured report. Please try again.');
      setStep(5);
    } finally {
      setIsGeneratingOutput(false);
    }
  };

  // Chat Submission handler
  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputText;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      assistantType
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setInputText('');
    setLoading(true);

    try {
      const historyPayload = messages.slice(-6).map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text
      }));

      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assistantType,
          prompt: textToSend,
          history: historyPayload
        })
      });

      const data = await res.json();
      const assistantResponseText = data.text || 'Unable to generate response.';

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: assistantResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        assistantType
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Error fetching AI assistant response:', err);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: 'Apologies, we encountered an error processing your query. Please check your connection and try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        assistantType
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadOutput = (content: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `WOW_Assistant_Report_${selectedActivity}_${projectAccount}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const activitiesByAssistant: Record<string, { id: string; name: string; desc: string }[]> = {
    business: [
      { id: 'raid-log', name: 'RAID Log Matrix & Risk Heatmap', desc: 'Identify Risks, Assumptions, Issues, and Dependencies with impact scoring' },
      { id: 'pmo-setup', name: '6-Week PMO Setup & Governance Blueprint', desc: 'Design steering committees, gate reviews, and reporting templates' },
      { id: 'change-mgmt', name: 'Change Management Stakeholder Plan', desc: 'Assess impact, readiness, training needs, and communication roadmap' }
    ],
    farm: [
      { id: 'yield-optimization', name: 'Crop Yield & Soil Optimization Brief', desc: 'Tailored agronomy advice, fertilizer application, and irrigation schedule' },
      { id: 'farm-cashflow', name: 'Agribusiness Operational Cashflow Log', desc: 'Track harvest cycles, seed purchases, labor costs, and market prices' },
      { id: 'equipment-maint', name: 'Machinery & Equipment Service Schedule', desc: 'Preventative maintenance, supplier registers, and downtime logs' }
    ],
    ngo: [
      { id: 'grant-me-framework', name: 'Donor M&E Results Framework', desc: 'Logical framework matrix, indicators, baselines, and verifications' },
      { id: 'impact-report', name: 'Grant Impact Executive Summary', desc: 'Professional progress briefs for European, US, and regional donors' },
      { id: 'audit-readiness', name: 'NGO Compliance & Financial Audit Checklist', desc: 'Internal control verifications for international funding agencies' }
    ],
    school: [
      { id: 'academic-curriculum', name: 'Staff Digital Skills & Curriculum Plan', desc: 'Upskilling teachers on digital platforms and classroom technology' },
      { id: 'school-governance', name: 'School Board Quarterly Report', desc: 'Academic performance, enrollment, budget tracking, and facility updates' },
      { id: 'student-tracking', name: 'Student Academic Intervention Model', desc: 'Targeted support frameworks for learners needing academic assistance' }
    ],
    church: [
      { id: 'stewardship-report', name: 'Ministry Stewardship & Financial Brief', desc: 'Accountability summaries, tithe tracking, and facility stewardship' },
      { id: 'volunteer-roster', name: 'Volunteer Coordination & Event Roster', desc: 'Service roles, team leaders, background checks, and schedule planning' },
      { id: 'community-outreach', name: 'Community Outreach & Welfare Plan', desc: 'Food bank, youth programs, and community assistance tracking' }
    ],
    general: [
      { id: 'digital-readiness', name: 'Digital & AI Readiness Assessment', desc: 'Assess strategy, workforce skills, data pipelines, and technology' },
      { id: 'transformation-brief', name: 'Business Transformation Roadmap', desc: 'Phased implementation plan with milestones, KPIs, and governance' },
      { id: 'academy-learning', name: 'WOW Academy Custom Upskilling Syllabus', desc: 'Tailored course plan for executive, graduate, or team learning' }
    ]
  };

  const samplePrompts: Record<string, string[]> = {
    business: [
      "Draft a RAID log table for a Healthcare EHR software rollout",
      "Explain the key steps for a 6-week PMO setup",
      "Create a Change Management stakeholder communication plan"
    ],
    farm: [
      "Provide a maize yield optimization plan for a 50-hectare farm",
      "How to reduce post-harvest grain losses in Southern Africa",
      "Draft an equipment maintenance schedule for agricultural machinery"
    ],
    ngo: [
      "Draft an M&E framework matrix for a rural health community grant",
      "Write a 3-paragraph executive summary for an EU grant impact report",
      "List donor compliance checkpoints for NGO financial audits"
    ],
    school: [
      "Design a staff digital readiness upskilling schedule for a secondary school",
      "Draft a school board governance quarterly status report template",
      "Create a student academic tracking framework"
    ],
    church: [
      "Draft a stewardship & financial accountability report template",
      "Create a volunteer roster coordination plan for community outreach",
      "List governance steps for church building project management"
    ],
    general: [
      "Summarize the services provided by WOW Business and Digital Ltd",
      "What training courses are offered at WOW Academy?",
      "How does WOW Consulting conduct Digital Readiness Assessments?"
    ]
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      
      {/* TOP HEADER BAR */}
      <div className="bg-gradient-to-br from-navy-50 via-navy-50 to-navy-50 text-slate-900 rounded-3xl p-6 sm:p-8 border border-navy-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-navy-200 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-navy-600 text-white flex items-center justify-center font-black shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                WOW AI Assistant
              </h1>
              <p className="text-xs text-slate-600">
                Explore practical ways to support business decisions and workflows
              </p>
            </div>
          </div>

          {/* WORKFLOW vs CHAT MODE TOGGLE */}
          <div className="flex items-center bg-white border border-navy-200 p-1 rounded-2xl text-xs font-bold shadow-xs">
            <button
              onClick={() => setActiveTabMode('guided')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                activeTabMode === 'guided'
                  ? 'bg-navy-600 text-white shadow-md font-black'
                  : 'text-slate-700 hover:text-navy-600'
              }`}
            >
              <ListChecks className="w-4 h-4" />
              <span>Guided Multi-Step Workflow</span>
              <span className="bg-navy-100 text-navy-700 border border-navy-200 text-[9px] px-1.5 py-0.5 rounded font-mono">WA-001</span>
            </button>
            <button
              onClick={() => setActiveTabMode('chat')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                activeTabMode === 'chat'
                  ? 'bg-navy-600 text-white shadow-md font-black'
                  : 'text-slate-700 hover:text-navy-600'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Interactive Chat</span>
            </button>
          </div>
        </div>

        {/* ASSISTANT SELECTION PILLS */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-navy-700 block">
            Select Specialised Assistant Persona:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            <button
              onClick={() => handleAssistantTypeChange('business')}
              className={`p-3 rounded-2xl text-xs font-bold transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                assistantType === 'business'
                  ? 'bg-navy-600 text-white shadow-md scale-105'
                  : 'bg-white text-slate-700 hover:bg-navy-50 border border-navy-200 shadow-xs'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Business</span>
            </button>

            <button
              onClick={() => handleAssistantTypeChange('farm')}
              className={`p-3 rounded-2xl text-xs font-bold transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                assistantType === 'farm'
                  ? 'bg-navy-600 text-white shadow-md scale-105'
                  : 'bg-white text-slate-700 hover:bg-navy-50 border border-navy-200 shadow-xs'
              }`}
            >
              <Wheat className="w-4 h-4" />
              <span>Farm</span>
            </button>

            <button
              onClick={() => handleAssistantTypeChange('ngo')}
              className={`p-3 rounded-2xl text-xs font-bold transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                assistantType === 'ngo'
                  ? 'bg-navy-600 text-white shadow-md scale-105'
                  : 'bg-white text-slate-700 hover:bg-navy-50 border border-navy-200 shadow-xs'
              }`}
            >
              <HeartHandshake className="w-4 h-4" />
              <span>NGO</span>
            </button>

            <button
              onClick={() => handleAssistantTypeChange('school')}
              className={`p-3 rounded-2xl text-xs font-bold transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                assistantType === 'school'
                  ? 'bg-navy-600 text-white shadow-md scale-105'
                  : 'bg-white text-slate-700 hover:bg-navy-50 border border-navy-200 shadow-xs'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>School</span>
            </button>

            <button
              onClick={() => handleAssistantTypeChange('church')}
              className={`p-3 rounded-2xl text-xs font-bold transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                assistantType === 'church'
                  ? 'bg-navy-600 text-white shadow-md scale-105'
                  : 'bg-white text-slate-700 hover:bg-navy-50 border border-navy-200 shadow-xs'
              }`}
            >
              <Church className="w-4 h-4" />
              <span>Church</span>
            </button>

            <button
              onClick={() => handleAssistantTypeChange('general')}
              className={`p-3 rounded-2xl text-xs font-bold transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                assistantType === 'general'
                  ? 'bg-navy-600 text-white shadow-md scale-105'
                  : 'bg-white text-slate-700 hover:bg-navy-50 border border-navy-200 shadow-xs'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>General</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODE 1: GUIDED MULTI-STEP WORKFLOW (WB-002 v3.0 WA-001..WA-007) */}
      {activeTabMode === 'guided' && (
        <div className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden p-6 sm:p-8 space-y-8">
          
          {/* STEP PROGRESS INDICATOR */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pb-6 border-b border-slate-200 text-xs font-bold">
            <button 
              onClick={() => setStep(1)}
              className={`p-3 rounded-xl border text-left transition-all ${
                step === 1 ? 'bg-navy-600 text-white border-navy-700 font-extrabold shadow-sm' : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              <div className="text-[10px] opacity-75">STEP 1</div>
              <div>Account & Persona</div>
            </button>

            <button 
              onClick={() => setStep(2)}
              className={`p-3 rounded-xl border text-left transition-all ${
                step === 2 ? 'bg-navy-600 text-white border-navy-700 font-extrabold shadow-sm' : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              <div className="text-[10px] opacity-75">STEP 2</div>
              <div>Activity & Format</div>
            </button>

            <button 
              onClick={() => setStep(3)}
              className={`p-3 rounded-xl border text-left transition-all ${
                step === 3 ? 'bg-navy-600 text-white border-navy-700 font-extrabold shadow-sm' : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              <div className="text-[10px] opacity-75">STEP 3</div>
              <div>Guided Inputs</div>
            </button>

            <button 
              onClick={() => setStep(4)}
              className={`p-3 rounded-xl border text-left transition-all ${
                step === 4 ? 'bg-navy-600 text-white border-navy-700 font-extrabold shadow-sm' : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              <div className="text-[10px] opacity-75">STEP 4</div>
              <div>Validation Check</div>
            </button>

            <button 
              disabled={!generatedOutput}
              onClick={() => setStep(5)}
              className={`p-3 rounded-xl border text-left transition-all ${
                step === 5 ? 'bg-navy-600 text-white border-navy-700 font-extrabold shadow-sm' : 'bg-slate-50 text-slate-400 border-slate-200 disabled:opacity-50'
              }`}
            >
              <div className="text-[10px] opacity-75">STEP 5</div>
              <div>Output & Export</div>
            </button>
          </div>

          {/* STEP 1: ISOLATED PROJECT ACCOUNT & PERSONA (WA-003, WA-007) */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center gap-3 bg-navy-50 border border-navy-200 p-4 rounded-2xl">
                <ShieldCheck className="w-6 h-6 text-navy-600 shrink-0" />
                <div className="text-xs text-navy-900 leading-relaxed">
                  <strong>Use this demonstration thoughtfully:</strong> Please do not enter confidential, personal or sensitive information. Contact us to discuss how a tailored assistant would handle your organisation’s data.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                    <FolderKanban className="w-4 h-4 text-navy-500" />
                    <span>Project / Account Identifier (WA-003):</span>
                  </label>
                  <input
                    type="text"
                    value={projectAccount}
                    onChange={(e) => setProjectAccount(e.target.value)}
                    placeholder="e.g. PRJ-2026-HEALTHCARE-01"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-500"
                  />
                  <p className="text-[11px] text-slate-500">Unique account code isolating your records.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-900 block">
                    Project / Organisation Name:
                  </label>
                  <input
                    type="text"
                    value={customProjectName}
                    onChange={(e) => setCustomProjectName(e.target.value)}
                    placeholder="e.g. Regional Digital Health Transition"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-500"
                  />
                  <p className="text-[11px] text-slate-500">Human-readable project title.</p>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  className="bg-navy-600 hover:bg-navy-500 text-white font-black text-xs px-6 py-3 rounded-xl flex items-center gap-2 shadow-md transition-colors"
                >
                  <span>Continue to Activity Selection</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: ACTIVITY & OUTPUT FORMAT SELECTION (WA-002) */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-wider text-slate-900 block">
                  Select Activity / Workflow Task for {assistantType.toUpperCase()} Assistant:
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {activitiesByAssistant[assistantType]?.map((act) => (
                    <button
                      key={act.id}
                      onClick={() => setSelectedActivity(act.id)}
                      className={`p-4 rounded-2xl border text-left transition-all space-y-1.5 cursor-pointer ${
                        selectedActivity === act.id
                          ? 'bg-navy-600 text-white border-navy-600 ring-2 ring-navy-300 shadow-md'
                          : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="font-extrabold text-xs flex items-center justify-between">
                        <span>{act.name}</span>
                        {selectedActivity === act.id && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>
                      <p className={`text-[11px] leading-relaxed ${selectedActivity === act.id ? 'text-navy-100' : 'text-slate-500'}`}>
                        {act.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-200">
                <label className="text-xs font-black uppercase tracking-wider text-slate-900 block">
                  Select Target Output Format (WA-006):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    onClick={() => setTargetOutputFormat('table')}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                      targetOutputFormat === 'table' ? 'bg-navy-600 text-white border-navy-700 shadow-sm' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Structured Matrix / Table
                  </button>
                  <button
                    onClick={() => setTargetOutputFormat('report')}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                      targetOutputFormat === 'report' ? 'bg-navy-600 text-white border-navy-700 shadow-sm' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Executive Brief & Report
                  </button>
                  <button
                    onClick={() => setTargetOutputFormat('brief')}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                      targetOutputFormat === 'brief' ? 'bg-navy-600 text-white border-navy-700 shadow-sm' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Action Checklist / SOP
                  </button>
                  <button
                    onClick={() => setTargetOutputFormat('markdown')}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                      targetOutputFormat === 'markdown' ? 'bg-navy-600 text-white border-navy-700 shadow-sm' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Markdown Document
                  </button>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs px-5 py-3 rounded-xl"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="bg-navy-600 hover:bg-navy-500 text-white font-black text-xs px-6 py-3 rounded-xl flex items-center gap-2 shadow-md transition-colors"
                >
                  <span>Continue to Guided Inputs</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: GUIDED INPUT FIELDS (WA-004) */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-1">
                <h3 className="font-black text-slate-900 text-base">Guided Data Capture (WA-004)</h3>
                <p className="text-xs text-slate-500">Provide specific facts, numbers, dates, and requirements to generate structured outputs.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-900 block">
                    Document Title / Focus Area:
                  </label>
                  <input
                    type="text"
                    value={inputTitle}
                    onChange={(e) => setInputTitle(e.target.value)}
                    placeholder="e.g. Digital Healthcare EHR Rollout RAID Matrix"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-900 block">
                    Target Completion Date / Horizon:
                  </label>
                  <input
                    type="date"
                    value={inputDate}
                    onChange={(e) => setInputDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-500"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-slate-900 block">
                    Background Context & Key Operational Constraints:
                  </label>
                  <textarea
                    rows={3}
                    value={inputContext}
                    onChange={(e) => setInputContext(e.target.value)}
                    placeholder="Describe the operational environment, core challenges, stakeholder expectations, and constraints..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-900 block">
                    Key Numbers & Metrics (Budget, Staffing, Scope):
                  </label>
                  <input
                    type="text"
                    value={inputKeyMetrics}
                    onChange={(e) => setInputKeyMetrics(e.target.value)}
                    placeholder="e.g. Budget: £150k, Team size: 6, Duration: 12 weeks"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-900 block">
                    Special Governance / Compliance Requirements:
                  </label>
                  <input
                    type="text"
                    value={inputNotes}
                    onChange={(e) => setInputNotes(e.target.value)}
                    placeholder="e.g. EU GDPR, ISO 27001, Ministry Audit Gate"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs px-5 py-3 rounded-xl"
                >
                  Back
                </button>
                <button
                  onClick={handleRunValidation}
                  disabled={isValidating}
                  className="bg-navy-600 hover:bg-navy-500 text-white font-black text-xs px-6 py-3 rounded-xl flex items-center gap-2 shadow-md transition-colors"
                >
                  {isValidating ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                      <span>Validating Inputs...</span>
                    </>
                  ) : (
                    <>
                      <span>Run Data Validation Check (WA-005)</span>
                      <ShieldCheck className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: DATA VALIDATION & GENERATION TRIGGER (WA-005) */}
          {step === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-2">
                <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Validation & Conflict Pre-Check Passed (WA-005)</span>
                </h3>
                <p className="text-xs text-slate-600">
                  Review the structured configuration before initiating AI output generation.
                </p>
              </div>

              {validationErrors.length > 0 && (
                <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl text-xs text-rose-800 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Please resolve the following inputs:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 pl-2">
                    {validationErrors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-navy-50 text-slate-900 rounded-2xl p-6 space-y-4 font-mono text-xs border border-navy-200">
                <div className="flex items-center justify-between border-b border-navy-200 pb-3 text-navy-700 font-bold">
                  <span>SPECIFICATION SUMMARY</span>
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">ISOLATED ACCESS</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-slate-700">
                  <div><strong className="text-slate-900">Project ID:</strong> {projectAccount}</div>
                  <div><strong className="text-slate-900">Organisation:</strong> {customProjectName}</div>
                  <div><strong className="text-slate-900">Assistant Persona:</strong> WOW {assistantType.toUpperCase()}</div>
                  <div><strong className="text-slate-900">Selected Task:</strong> {selectedActivity}</div>
                  <div><strong className="text-slate-900">Output Format:</strong> {targetOutputFormat.toUpperCase()}</div>
                  <div><strong className="text-slate-900">Target Date:</strong> {inputDate}</div>
                </div>

                <div className="pt-2 border-t border-navy-200 text-[11px] text-slate-600">
                  <strong className="text-slate-900">Title:</strong> {inputTitle}
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  onClick={() => setStep(3)}
                  className="bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs px-5 py-3 rounded-xl"
                >
                  Edit Inputs
                </button>
                <button
                  onClick={handleGenerateGuidedOutput}
                  disabled={isGeneratingOutput}
                  className="bg-navy-600 hover:bg-navy-500 text-white font-black text-xs px-8 py-3.5 rounded-xl flex items-center gap-2 shadow-lg transition-all disabled:opacity-50"
                >
                  {isGeneratingOutput ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                      <span>Generating Structured Output (WA-006)...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Approved Document Output</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: GENERATED OUTPUT & DOWNLOADABLE FORMATS (WA-006) */}
          {step === 5 && generatedOutput && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-emerald-50 border border-emerald-200 p-4 rounded-2xl">
                <div className="flex items-center gap-2 text-emerald-900 text-xs font-bold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Output Generated Successfully using Approved WOW Templates (WA-006)</span>
                </div>
                <button
                  onClick={() => handleDownloadOutput(generatedOutput)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors shrink-0 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Document (.MD)</span>
                </button>
              </div>

              <div className="bg-white text-slate-900 rounded-2xl p-6 border border-navy-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3 text-xs">
                  <span className="font-mono text-navy-700 font-bold">DOCUMENT REVIEW PREVIEW</span>
                  <button
                    onClick={() => handleCopyText(generatedOutput, 'output-doc')}
                    className="text-slate-500 hover:text-navy-600 flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    {copiedId === 'output-doc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'output-doc' ? 'Copied' : 'Copy All'}</span>
                  </button>
                </div>

                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-xs font-sans leading-relaxed text-slate-800 whitespace-pre-wrap max-h-[500px] overflow-y-auto">
                  {generatedOutput}
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button
                  onClick={() => setStep(1)}
                  className="bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs px-5 py-3 rounded-xl"
                >
                  Start New Workflow
                </button>
                <div className="text-[11px] text-slate-500 italic">
                  Note: Review outputs before external distribution per governance rule BR-007.
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* MODE 2: INTERACTIVE CHAT MODE */}
      {activeTabMode === 'chat' && (
        <div className="space-y-6">
          {/* SAMPLE QUICK PROMPTS */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Suggested Prompts for {assistantType.toUpperCase()} ASSISTANT:
            </span>
            <div className="flex flex-wrap gap-2">
              {samplePrompts[assistantType]?.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="bg-white hover:bg-navy-50 text-slate-800 text-xs px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm transition-colors text-left flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-navy-500 shrink-0" />
                  <span>"{prompt}"</span>
                </button>
              ))}
            </div>
          </div>

          {/* CHAT CONTAINER */}
          <div className="bg-white border border-slate-200 rounded-3xl shadow-lg overflow-hidden flex flex-col h-[520px]">
            
            {/* Chat top bar */}
            <div className="bg-navy-100 text-slate-900 p-4 flex items-center justify-between border-b border-navy-200">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-navy-600" />
                <span className="font-bold text-sm capitalize">WOW {assistantType} Assistant Session</span>
              </div>
              <button
                onClick={() => setMessages([])}
                className="text-xs text-slate-600 hover:text-navy-600 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Clear History
              </button>
            </div>

            {/* Chat Messages Stream */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-2">
                  <Bot className="w-10 h-10 text-slate-300" />
                  <p className="text-xs">No messages yet. Type a question or pick a prompt above.</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 max-w-3xl ${
                      msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                        msg.sender === 'user'
                          ? 'bg-navy-600 text-white'
                          : 'bg-navy-600 text-white'
                      }`}
                    >
                      {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>

                    <div
                      className={`rounded-2xl p-4 text-xs leading-relaxed space-y-2 shadow-sm ${
                        msg.sender === 'user'
                          ? 'bg-navy-600 text-white rounded-tr-none'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] opacity-70 gap-4">
                        <span className="font-bold uppercase tracking-wider">
                          {msg.sender === 'user' ? 'You' : `WOW ${msg.assistantType.toUpperCase()} ASSISTANT`}
                        </span>
                        <span className="font-mono">{msg.timestamp}</span>
                      </div>

                      <div className="whitespace-pre-wrap font-sans text-xs leading-relaxed">
                        {msg.text}
                      </div>

                      {msg.sender === 'assistant' && (
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          <button
                            onClick={() => handleCopyText(msg.text, msg.id)}
                            className="text-[10px] text-slate-400 hover:text-slate-700 flex items-center gap-1 font-semibold"
                          >
                            {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedId === msg.id ? 'Copied' : 'Copy Response'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}

              {loading && (
                <div className="flex gap-3 max-w-xl mr-auto">
                  <div className="w-8 h-8 rounded-full bg-navy-600 text-white flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none text-xs text-slate-500 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-navy-600 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-navy-600 animate-bounce delay-100"></div>
                    <div className="w-2 h-2 rounded-full bg-navy-600 animate-bounce delay-200"></div>
                    <span className="ml-2 font-medium">WOW Assistant is analyzing...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Bar */}
            <div className="p-4 bg-white border-t border-slate-200">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Ask WOW ${assistantType.toUpperCase()} Assistant anything...`}
                  disabled={loading}
                  className="flex-1 bg-slate-100 text-slate-900 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-navy-500 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={loading || !inputText.trim()}
                  className="bg-navy-600 hover:bg-navy-500 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all disabled:opacity-50 flex items-center gap-1.5 shrink-0"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
