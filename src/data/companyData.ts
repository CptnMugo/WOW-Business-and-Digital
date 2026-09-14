import { ServiceItem, AssistantProduct, AcademyProgram, ToolkitProduct, CaseStudy, InsightArticle } from '../types';

export const BRAND_INFO = {
  name: "WOW Business & Digital Limited",
  shortName: "WOW",
  email: "wowdigital@wowbusinessanddigital.com",
  phone: "+44 121 296 9549",
  tagline: "Transforming Organisations. Empowering People. Building Intelligent Solutions.",
  positioning: "Transforming Organisations. Empowering People. Building Intelligent Solutions.",
  subtext: "A business built on real consultancy, coaching and growth experience, combining business transformation, staffing, training and specialised AI solutions across business sectors.",
  vision: "To empower people and organisations to achieve sustainable growth through business transformation, digital innovation, artificial intelligence and professional development.",
  purpose: "WOW Business & Digital helps organisations improve performance through practical consulting, digital innovation and intelligent solutions. We work alongside clients to strengthen delivery, develop people and support sustainable growth.",
  personality: [
    "Professional",
    "Practical",
    "Trusted",
    "Evidence-based",
    "Innovative",
    "Approachable"
  ],
  sectors: [
    "Healthcare",
    "Public Sector",
    "Private Sector",
    "Education",
    "Not-for-profit / Charities",
    "Small & Growing Businesses (SMEs)",
    "International Organisations",
    "Agriculture & Agribusiness"
  ]
};

export const CONSULTING_SERVICES: ServiceItem[] = [
  {
    id: "programme-management",
    title: "Programme Management",
    description: "Aligning complex multi-project portfolios with strategic business objectives, ensuring seamless cross-functional delivery and stakeholder alignment.",
    iconName: "Briefcase",
    category: "core",
    tags: ["Strategy", "Governance", "Cross-Functional"]
  },
  {
    id: "project-management",
    title: "Project Management",
    description: "End-to-end execution of critical digital and organisational initiatives using Agile, Waterfall, and hybrid methodologies.",
    iconName: "CheckSquare",
    category: "core",
    tags: ["Delivery", "Agile", "Risk Control"]
  },
  {
    id: "pmo",
    title: "PMO Setup & Governance",
    description: "Establishing robust Project Management Offices (PMOs) that standardize reporting, RAID logs, resource management, and executive assurance.",
    iconName: "Sliders",
    category: "core",
    tags: ["PMO", "Frameworks", "KPI Tracking"]
  },
  {
    id: "digital-transformation",
    title: "Digital Transformation",
    description: "Re-architecting legacy operational models with modern digital infrastructure, workflow automation, and cloud adoption.",
    iconName: "Cpu",
    category: "core",
    tags: ["Cloud", "Automation", "Innovation"]
  },
  {
    id: "operational-readiness",
    title: "Operational Readiness",
    description: "Ensuring teams, processes, and infrastructure are 100% prepared to adopt new technology deployments without business disruption.",
    iconName: "ShieldCheck",
    category: "core",
    tags: ["Adoption", "Go-Live", "Risk Mitigation"]
  },
  {
    id: "change-management",
    title: "Change Management",
    description: "Structured change frameworks (Prosci / ADKAR aligned) to drive stakeholder engagement, cultural transition, and user adoption.",
    iconName: "Users",
    category: "core",
    tags: ["People", "Culture", "Adoption"]
  },
  {
    id: "business-analysis",
    title: "Business Analysis",
    description: "Rigorous requirement gathering, process mapping, gap analysis, and target operating model design.",
    iconName: "FileSearch",
    category: "core",
    tags: ["Requirements", "Process Mapping", "Optimization"]
  },
  {
    id: "benefits-realisation",
    title: "Benefits Realisation",
    description: "Tracking, measuring, and optimizing ROI on digital investments to ensure tangible value delivery past go-live.",
    iconName: "TrendingUp",
    category: "core",
    tags: ["ROI", "Value", "Metrics"]
  },
  {
    id: "governance",
    title: "Governance & Assurance",
    description: "Designing audit-proof governance frameworks, steering group structures, and compliance checkpoints for enterprise programmes.",
    iconName: "Award",
    category: "core",
    tags: ["Compliance", "Steering", "Assurance"]
  },
  {
    id: "portfolio-management",
    title: "Portfolio Management",
    description: "Prioritizing capital and operational investments across project pipelines to maximize strategic impact and mitigate capacity bottlenecks.",
    iconName: "PieChart",
    category: "core",
    tags: ["Prioritization", "Resource Allocation", "Pipeline"]
  },
  {
    id: "process-improvement",
    title: "Business Process Improvement",
    description: "Eliminating operational friction points through Lean Six Sigma principles and automated digital workflows.",
    iconName: "RefreshCw",
    category: "additional",
    tags: ["Lean", "Workflow", "Efficiency"]
  },
  {
    id: "digital-readiness",
    title: "Digital & AI Readiness Assessments",
    description: "Evaluating organisational maturity, data pipelines, and workforce skills prior to embarking on AI integration.",
    iconName: "BarChart2",
    category: "additional",
    tags: ["AI Audit", "Maturity", "Strategy"]
  },
  {
    id: "project-recovery",
    title: "Project Recovery",
    description: "Rapid diagnostic and turnaround for troubled or delayed high-stakes projects to get them back on budget and schedule.",
    iconName: "Zap",
    category: "additional",
    tags: ["Turnaround", "Rescue", "Assurance"]
  },
  {
    id: "executive-dashboards",
    title: "Executive Dashboards",
    description: "Creating real-time PowerBI/Tableau executive command centers for immediate visibility into project health and financial variance.",
    iconName: "Layout",
    category: "additional",
    tags: ["PowerBI", "Analytics", "Executive"]
  }
];

export const AI_PRODUCTS: AssistantProduct[] = [
  {
    id: "wow-business-assistant",
    name: "WOW Business Assistant",
    tagline: "Intelligent Corporate PMO & Operations AI",
    description: "Automates RAID logs, project status summaries, change management plans, and executive governance reporting for enterprise teams.",
    targetSector: "Private Sector, SMEs, Corporate PMOs",
    type: "current",
    features: [
      "Automated RAID Log generation & risk scoring",
      "Executive status report drafting from raw notes",
      "Change impact assessment generator",
      "Governance committee agenda & minutes summarizer"
    ],
    iconName: "Briefcase"
  },
  {
    id: "wow-farm-assistant",
    name: "WOW Farm Assistant",
    tagline: "Agribusiness & Farm Management AI",
    description: "Empowers farm managers and agricultural enterprises with yield projections, supply chain monitoring, climate advice, and inventory tracking.",
    targetSector: "Agribusiness, Commercial Farms, Smallholders",
    type: "current",
    features: [
      "Yield prediction & weather advisory integration",
      "Farm input & fertilizer usage optimization",
      "Produce market pricing & buyer matching logs",
      "Farm task schedule & equipment maintenance tracker"
    ],
    iconName: "Wheat"
  },
  {
    id: "wow-ngo-assistant",
    name: "WOW NGO Assistant",
    tagline: "Donor Compliance & Grant Impact AI",
    description: "Simplifies grant reporting, donor compliance tracking, Monitoring & Evaluation (M&E) framework generation, and field impact narratives.",
    targetSector: "Charities, NGOs, International Development",
    type: "current",
    features: [
      "Grant proposal & donor report drafting",
      "M&E Indicator log & logframe matrix builder",
      "Beneficiary feedback summarizer",
      "Compliance checklist & audit readiness verification"
    ],
    iconName: "HeartHandshake"
  },
  {
    id: "wow-school-assistant",
    name: "WOW School Assistant",
    tagline: "Academic Governance & Admin AI",
    description: "Assists educational institutions with staff scheduling, student performance analytics, curriculum project plans, and parent communications.",
    targetSector: "Schools, Colleges, Educational Authorities",
    type: "current",
    features: [
      "Curriculum delivery tracker & milestone planning",
      "Administrative letter & newsletter generator",
      "Staff CPD & performance log organizer",
      "School board governance report helper"
    ],
    iconName: "GraduationCap"
  },
  {
    id: "wow-church-assistant",
    name: "WOW Church Assistant",
    tagline: "Ministry Administration & Community AI",
    description: "Supports faith-based organisations with stewardship governance, volunteer coordination, event planning, and community outreach tracking.",
    targetSector: "Churches, Ministries, Faith-based Orgs",
    type: "current",
    features: [
      "Volunteer roster & duty cycle planning",
      "Stewardship & financial governance record helper",
      "Community project management templates",
      "Event planning & attendee communication builder"
    ],
    iconName: "Church"
  },
  {
    id: "zimbabwean-language-ai",
    name: "Zimbabwean Language AI",
    tagline: "Multilingual Local Natural Language Processing",
    description: "Tailored AI translation and voice processing for Shona and Ndebele business contexts.",
    targetSector: "Southern Africa, Regional Enterprises",
    type: "future",
    features: ["Shona & Ndebele domain translation", "Local business term recognition", "Voice-to-text for rural field agents"],
    iconName: "Globe"
  },
  {
    id: "business-reporting-ai",
    name: "Business Reporting AI",
    tagline: "Automated Financial & Performance Synthesis",
    description: "Connects directly to ERPs and accounting tools to auto-generate weekly variance reports.",
    targetSector: "Finance & Operations Teams",
    type: "future",
    features: ["Real-time P&L insights", "Automated executive summary slides", "Anomaly detection in operational cost"],
    iconName: "PieChart"
  },
  {
    id: "whatsapp-ai-assistants",
    name: "WhatsApp AI Assistants",
    tagline: "Conversational AI on WhatsApp",
    description: "Allows field agents, farmers, and community leaders to query AI assistants via WhatsApp chat.",
    targetSector: "Field Workers, Remote Teams",
    type: "future",
    features: ["Low-bandwidth voice & text notes", "Offline message queueing", "Direct CRM/Database sync"],
    iconName: "MessageSquare"
  },
  {
    id: "impact-reporting-ai",
    name: "Impact Reporting AI",
    tagline: "ESG & UN SDG Alignment Engine",
    description: "Automatically maps project outcomes to UN Sustainable Development Goals (SDGs) and ESG standards.",
    targetSector: "Governments, Development Banks, ESG Investors",
    type: "future",
    features: ["Automated ESG scorecard generation", "SDG goal mapping", "Investor-ready PDF exports"],
    iconName: "Sparkles"
  }
];

export const ACADEMY_PROGRAMS: AcademyProgram[] = [
  {
    id: "pm-pmo-mastery",
    title: "Project & Programme Management Masterclass",
    type: "training",
    description: "Comprehensive practical training equipping professionals with end-to-end delivery skills, RAID management, stakeholder navigation, and PMO methodologies.",
    duration: "6 Weeks (Live Virtual + Workshops)",
    targetAudience: "Project Managers, Delivery Leads, PMO Officers, Career Switchers",
    keyModules: [
      "Agile & Waterfall Delivery Frameworks",
      "RAID Log Mastery & Risk Quantification",
      "Stakeholder Communication & Steering Committees",
      "Budgeting, Forecasting & Earned Value"
    ]
  },
  {
    id: "ai-for-business",
    title: "AI for Business & Leadership",
    type: "training",
    description: "Practical immersion for executives and managers to understand, evaluate, and deploy AI solutions safely to drive competitive advantage.",
    duration: "4 Weeks (Executive Evening Sessions)",
    targetAudience: "Directors, Senior Managers, Business Analysts, Department Heads",
    keyModules: [
      "AI Ecosystem Overview (LLMs, GenAI, RAG)",
      "Prompt Engineering for Business Workflows",
      "AI Ethics, Governance & Data Security",
      "Building a Company AI Roadmap"
    ]
  },
  {
    id: "graduate-work-experience",
    title: "Graduate PM & AI Work Experience Programme",
    type: "experience",
    description: "Hands-on project placement providing real-world consulting practice, portfolio deliverables, mentorship, and industry reference opportunities.",
    duration: "12 Weeks (Practical Immersion)",
    targetAudience: "Recent Graduates, Career Changers, Junior Analysts",
    keyModules: [
      "Live Project Case Study Delivery",
      "Executive Presentation Skills",
      "Mentorship from Senior Portfolio Directors",
      "Verified Work Experience Portfolio"
    ]
  },
  {
    id: "career-coaching",
    title: "CV & Interview Executive Coaching",
    type: "coaching",
    description: "One-on-one tailored coaching sessions to position your experience for high-impact consulting, project management, and digital leadership roles.",
    duration: "Personalized 1-on-1 Sessions",
    targetAudience: "Mid to Senior Professionals seeking career advancement",
    keyModules: [
      "CV & LinkedIn Brand Optimization",
      "Competency-Based & STAR Method Interview Prep",
      "Salary Negotiation Strategy",
      "Executive Career Positioning"
    ]
  }
];

export const TOOLKITS: ToolkitProduct[] = [
  {
    id: "raid-toolkit",
    name: "RAID Toolkit Pro",
    category: "Project Controls",
    description: "Practical Excel & Notion framework for tracking Risks, Assumptions, Issues, and Dependencies with automated risk scoring and heatmaps.",
    includes: ["Interactive RAID Matrix", "Automated Risk Scoring Engine", "Steering Group Dashboard Tab", "User Guide & Standard Operating Procedure"],
    format: "Excel / Google Sheets / Notion",
    badge: "Popular"
  },
  {
    id: "benefits-tracker",
    name: "Benefits Realisation Tracker",
    category: "Financials & ROI",
    description: "Structured tool for defining financial and non-financial benefit profiles, baseline values, target milestones, and owner accountability.",
    includes: ["Benefit Profile Templates", "Monthly Burn-Up & Value Realisation Chart", "Cost-Benefit Ratio Calculator", "Executive Summary View"],
    format: "Excel / PowerBI Template"
  },
  {
    id: "readiness-toolkit",
    name: "Operational Readiness & Go-Live Pack",
    category: "Change & Adoption",
    description: "Checklist and scoring model for evaluating team training, system cutover readiness, rollback plans, and hypercare support.",
    includes: ["Go-No-Go Gate Checklist", "Cutover Runbook Template", "Hypercare Incident Log", "User Adoption Survey Sheet"],
    format: "Excel / MS Word / PDF"
  },
  {
    id: "governance-pack",
    name: "Governance & Steering Committee Pack",
    category: "Assurance",
    description: "Complete template set for organizing project boards, drafting terms of reference (ToR), logging decisions, and publishing monthly progress decks.",
    includes: ["Steering Committee Slide Deck (PPTX)", "Terms of Reference (ToR) Template", "Decision Log & Escalation Matrix", "Monthly Status One-Pager"],
    format: "PowerPoint / Word / Excel",
    badge: "Essential"
  },
  {
    id: "pmo-toolkit",
    name: "Complete PMO Setup Toolkit",
    category: "PMO Setup",
    description: "All-in-one resource pack for launching or upgrading a PMO in under 30 days, including governance charters, standards, and reporting cadences.",
    includes: ["PMO Charter Template", "Resource Capacity Planner", "Project Prioritization Matrix", "Stage Gate Review Framework"],
    format: "Full Suite (Excel, PPT, Word)",
    badge: "Best Value"
  },
  {
    id: "business-farm-templates",
    name: "Business & Farm Management Templates",
    category: "Operations",
    description: "Specialised templates for agribusinesses and SMEs covering cashflow forecasting, crop cycle logs, equipment maintenance, and supplier records.",
    includes: ["Farm Cashflow & P&L Log", "Crop & Harvest Cycle Sheet", "Equipment Maintenance Schedule", "Supplier & Buyer Contact Register"],
    format: "Excel / Google Sheets"
  }
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "healthcare-pmo-recovery",
    title: "Healthcare Digital Transformation & PMO Setup",
    clientSector: "Healthcare & Health Social Care",
    challenge: "A regional health trust faced severe delays in deploying a new electronic patient record system due to fragmented governance and lack of standardized PMO controls.",
    solution: "WOW Consulting established an agile PMO framework, instituted weekly RAID reviews, and led change management across 1,200 clinical staff members.",
    impactMetrics: [
      "Project brought back on schedule in 6 weeks",
      "99.4% user adoption rate at go-live",
      "Zero critical hypercare incidents"
    ],
    division: "Consulting"
  },
  {
    id: "ngo-ai-grant-reporting",
    title: "Automated Grant Impact Reporting for International NGO",
    clientSector: "Charities & International Organisations",
    challenge: "Field teams in 4 countries spent over 30 hours per month compiling manual donor reports, reducing time spent on direct community aid.",
    solution: "Deployed custom WOW NGO Assistant trained on donor reporting guidelines, enabling field workers to generate compliant impact briefs from raw field notes.",
    impactMetrics: [
      "80% reduction in donor reporting overhead",
      "100% compliance score across 12 donor audits",
      "Real-time impact dashboard for board members"
    ],
    division: "AI Solutions"
  },
  {
    id: "government-digital-readiness",
    title: "Government Agency Digital & AI Readiness Strategy",
    clientSector: "Government",
    challenge: "A public sector department required a comprehensive digital transformation roadmap to modernize citizen services while satisfying strict data governance regulations.",
    solution: "Conducted a department-wide Digital Readiness Assessment, designed a target operating model, and facilitated leadership AI training via WOW Academy.",
    impactMetrics: [
      "Clear 3-year Digital & AI Roadmap approved by Board",
      "120 senior civil servants upskilled in AI governance",
      "Estimated £1.4M operational savings identified"
    ],
    division: "Consulting"
  }
];

export const INSIGHTS_ARTICLES: InsightArticle[] = [
  {
    id: "pmo-governance-2026",
    title: "Setting Up an Audit-Proof PMO in 6 Weeks: A Practical Blueprint",
    category: "Project Management",
    date: "July 18, 2026",
    readTime: "5 min read",
    summary: "Why most traditional PMOs fail by introducing bureaucracy instead of clarity, and how to build a lean, value-driven Project Management Office.",
    content: `Many organisations view a Project Management Office (PMO) as an administrative bottleneck. However, when established with a lean, value-first philosophy, a PMO acts as the central command engine of business transformation.

Key Steps for Lean PMO Success:
1. Standardise RAID Controls: Focus on high-impact risks rather than filling out endless spreadsheets.
2. Establish Clear Governance Gates: Define explicit Go/No-Go criteria for project phases.
3. Executive Transparency: Use single-page visual dashboards rather than 40-page decks.
4. Continuous Mentorship: Train project managers through structured practical frameworks like those offered in WOW Academy.`,
    author: "WOW Consulting Practice"
  },
  {
    id: "ai-for-african-enterprises",
    title: "AI Solutions in Africa: Moving Beyond the Hype to Practical Value",
    category: "AI & Innovation",
    date: "July 10, 2026",
    readTime: "6 min read",
    summary: "How tailored vertical AI solutions like WOW Farm Assistant and WOW NGO Assistant are solving ground-level operational challenges across African businesses.",
    content: `Artificial Intelligence is transforming business operations globally, but in emerging markets across Africa, AI adoption must address real-world infrastructural, agricultural, and community development needs.

At WOW Business and Digital Ltd, our focus is on domain-specific AI Assistants that operate seamlessly across web, mobile, and WhatsApp channels. Whether assisting smallholder farmers with yield optimisation or empowering NGOs with automated grant reporting, practical AI builds tangible economic value.`,
    author: "WOW AI Solutions Team"
  },
  {
    id: "digital-readiness-framework",
    title: "Are You Ready for Digital Transformation? The 5 Essential Pillars",
    category: "Digital Transformation",
    date: "June 28, 2026",
    readTime: "4 min read",
    summary: "Before investing in expensive software, assess your organisation's operational readiness across Strategy, People, Process, Technology, and Governance.",
    content: `Digital transformation is 80% about people and processes, and only 20% about technology. A successful digital transition requires measuring organisational maturity across five core dimensions: Strategy Alignment, Leadership Capability, Process Standardisation, Data Quality, and Cultural Readiness.`,
    author: "Transformation Strategy Group"
  }
];

export interface CoreServiceInfo {
  id: string;
  tabId: 'business-consultancy' | 'staffing' | 'training' | 'ai-solutions' | 'career-coaching';
  title: string;
  shortNavTitle: string;
  tagline: string;
  description: string;
  iconName: string;
  subOfferings: string[];
  audience: string;
  href: string;
}

export const CORE_FIVE_SERVICES: CoreServiceInfo[] = [
  {
    id: "training",
    tabId: "training",
    title: "Training",
    shortNavTitle: "Training",
    tagline: "Practical training, work experience and professional development.",
    description: "Practical training, work experience and professional development.",
    iconName: "GraduationCap",
    subOfferings: [
      "Project & Programme Management",
      "Change Management",
      "AI for Business",
      "PMO & Project Support",
      "Work Experience"
    ],
    audience: "Teams, career switchers, managers, graduates, and organisations upskilling workforce",
    href: "#training"
  },
  {
    id: "staffing",
    tabId: "staffing",
    title: "Staffing",
    shortNavTitle: "Staffing",
    tagline: "Experienced professionals supplied flexibly, from one to five days a week.",
    description: "Experienced professionals supplied flexibly, from one to five days a week.",
    iconName: "Users",
    subOfferings: [
      "Project Managers",
      "Programme Managers",
      "PMO Support",
      "Business Analysts",
      "Coordinators"
    ],
    audience: "Organisations seeking specialised delivery talent or capacity scaling",
    href: "#staffing"
  },
  {
    id: "business-consultancy",
    tabId: "business-consultancy",
    title: "Business Consultancy & Growth",
    shortNavTitle: "Business Consultancy & Growth",
    tagline: "Practical consultancy and coaching to grow and strengthen your organisation.",
    description: "Practical consultancy and coaching to grow and strengthen your organisation.",
    iconName: "TrendingUp",
    subOfferings: [
      "Business Consultancy",
      "Business Coaching",
      "Growth Strategy",
      "Operational Improvement",
      "Governance & Delivery Support"
    ],
    audience: "Enterprise leaders, SMEs, Healthcare trusts, Public Sector & Not-for-profits",
    href: "#business-consultancy"
  },
  {
    id: "ai-solutions",
    tabId: "ai-solutions",
    title: "AI Solutions",
    shortNavTitle: "AI Solutions",
    tagline: "Practical, guided AI tools grounded in real business knowledge.",
    description: "Practical, guided AI tools grounded in real business knowledge.",
    iconName: "Sparkles",
    subOfferings: [
      "WOW Assistant",
      "Business Assistant",
      "Farm Assistant",
      "Reporting Automation",
      "Guided AI Tools"
    ],
    audience: "SMEs, Agribusinesses, Not-for-profits, Schools, Healthcare & Field Operations",
    href: "#ai-solutions"
  },
  {
    id: "career-coaching",
    tabId: "career-coaching",
    title: "Career Coaching & Development",
    shortNavTitle: "Career Coaching & Development",
    tagline: "Support to plan and progress your career.",
    description: "Support to plan and progress your career.",
    iconName: "Briefcase",
    subOfferings: [
      "Career Coaching",
      "CV Support",
      "Interview Preparation",
      "Career Development"
    ],
    audience: "Ambitious professionals, delivery leads, career switchers and senior executives",
    href: "#career-coaching"
  }
];
