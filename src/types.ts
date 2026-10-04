export type NavTab = 
  | 'home' 
  | 'services'
  | 'associates'
  | 'business-consultancy'
  | 'staffing'
  | 'training'
  | 'ai-solutions'
  | 'career-coaching'
  | 'about' 
  | 'contact'
  | 'consulting' 
  | 'wow-assistant' 
  | 'academy' 
  | 'products' 
  | 'case-studies' 
  | 'insights'
  | 'payments'
  | 'pm-career-accelerator'
  | 'pm-registration'
  | 'privacy'
  | 'programme-terms' | 'project-simulation' | 'manage-applications' | 'career-explore' | 'corporate-career' | 'health-social-care';

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: 'core' | 'additional';
  tags: string[];
}

export interface AssistantProduct {
  id: string;
  name: string;
  tagline: string;
  description: string;
  targetSector: string;
  type: 'current' | 'future';
  features: string[];
  iconName: string;
}

export interface AcademyProgram {
  id: string;
  title: string;
  type: 'training' | 'coaching' | 'experience';
  description: string;
  duration: string;
  targetAudience: string;
  keyModules: string[];
}

export interface ToolkitProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  includes: string[];
  format: string;
  badge?: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  clientSector: string;
  challenge: string;
  solution: string;
  impactMetrics: string[];
  division: 'Consulting' | 'AI Solutions' | 'Academy';
}

export interface InsightArticle {
  id: string;
  title: string;
  category: 'Project Management' | 'Digital Transformation' | 'AI & Innovation' | 'Leadership' | 'Client Success Stories' | 'Business Tips' | 'WOW Assistant Updates';
  date: string;
  readTime: string;
  summary: string;
  content: string;
  author: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  assistantType: 'business' | 'farm' | 'ngo' | 'school' | 'church' | 'general';
}
