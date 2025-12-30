
export interface SocialLink {
  name: string;
  url: string;
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
  logoUrl?: string;
  socials?: SocialLink[];
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
  description: string;
  logoUrl?: string;
  universityUrl?: string;
  studentProfileUrl?: string;
}

export interface Qualification {
  skill: string;
  type: 'top' | 'other';
}

export interface License {
  name: string;
  issuer: string;
  date: string;
  type: 'iitm' | 'mooc';
  credentialUrl?: string;
  credentialId?: string;
}

export interface Project {
  name: string;
  description: string;
  image: string;
  tags: string[];
  type: 'software' | 'hardware';
  liveUrl?: string;
  repoUrl?: string;
  detailsUrl?: string;
}

export interface Award {
  name:string;
  issuer: string;
  date: string;
  description: string;
  logoUrl?: string;
  awardUrl?: string;
}

export interface LeadershipRole {
  role: string;
  organization: string;
  logo: string;
  date: string;
  location: string;
  description: string;
}

export interface PortfolioData {
  name: string;
  title: string;
  summary: string;
  intro: string;
  headshot: string;
  location: string;
  about_summary: string;
  socials: SocialLink[];
  experience: Experience[];
  education: Education[];
  qualifications: Qualification[];
  licenses: License[];
  projects: Project[];
  awards: Award[];
  leadership: LeadershipRole[];
}
