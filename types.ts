
export type Role = 'user' | 'admin';
export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';

export interface UserProfile {
  id: string;
  email: string;
  role: Role;
  created_at: string;
}

export enum Category {
  NETWORK = 'Network Security',
  APPLICATION = 'Application Security',
  INFORMATION = 'Information Security',
  ENDPOINT = 'Endpoint Security',
  CLOUD = 'Cloud Security',
  IAM = 'Identity and Access Management (IAM)',
  OPSEC = 'Operational Security (OpSec)',
  MOBILE = 'Mobile Security',
  IOT = 'Internet of Things (IoT) Security',
  INFRASTRUCTURE = 'Critical Infrastructure Security',
  DISASTER = 'Disaster Recovery & Business Continuity',
  CTI = 'Cyber Threat Intelligence (CTI)',
  DFIR = 'Digital Forensics & Incident Response (DFIR)',
  GRC = 'Governance, Risk & Compliance (GRC)',
  PHISHING = 'Email Phishing',
  THREATS = 'Threats & Vulnerabilities',
  MALWARE = 'Malware & Viruses',
  ANTIVIRUS = 'Antivirus & Defense',
  FRAUD = 'Cyber Fraud'
}

export interface SecurityUpdate {
  id: string;
  title: string;
  summary: string;
  type: string;
  severity: Severity;
  created_by: string;
  created_at: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface HotTopic {
  query: string;
  count: number;
}
