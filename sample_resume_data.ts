// sample-resume-data.ts

import type { AwardData, CertificateData, EducationData, ExperienceData, InterestData, LanguageData, ProfileData, ProjectData, PublicationData, ReferenceData, SkillData } from "#/types/resume/resumeTypes";



export const sampleProfile: ProfileData & { id: string } = {
  id: "profile-001",
  profile_picture: "",
  first_name: "Arjun",
  last_name: "Mehta",
  professional_title: "Full Stack Software Engineer",
  email: "arjun.mehta@email.com",
  phone: "+91 98765 43210",
  location: "Bengaluru, Karnataka, India",
  summary:
    "Passionate full stack engineer with 4+ years of experience building scalable web applications. Skilled in React, TypeScript, and Node.js with a strong focus on clean architecture, performance, and developer experience.",
  links: [
    { id: "link-001", name: "LinkedIn", value: "linkedin.com/in/arjunmehta", icon: "" },
    { id: "link-002", name: "GitHub",   value: "github.com/arjunmehta",     icon: "" },
    { id: "link-003", name: "Portfolio", value: "arjunmehta.dev",           icon: "" },
  ],
};

export const sampleEducation: Array<EducationData & { id: string }> = [
  {
    id: "edu-001",
    degree: "Bachelor of Engineering in Computer Science",
    institution: "Visvesvaraya Technological University",
    score: "8.6 CGPA",
    location: "Bengaluru, Karnataka",
    start_date: "2016-08-01",
    end_date: "2020-06-30",
    link: "",
    description:
      "Focused on data structures, algorithms, operating systems, and web technologies. Final year project on real-time collaborative document editing using WebSockets.",
  },
  {
    id: "edu-002",
    degree: "Higher Secondary Certificate (Science — PCM)",
    institution: "Delhi Public School",
    score: "92.4%",
    location: "Bengaluru, Karnataka",
    start_date: "2014-06-01",
    end_date: "2016-05-31",
    link: "",
    description: "",
  },
];

export const sampleExperience: Array<ExperienceData & { id: string }> = [
  {
    id: "exp-001",
    position: "Senior Frontend Engineer",
    company: "Razorpay",
    location: "Bengaluru, Karnataka",
    start_date: "2022-03-01",
    end_date: null,
    description:
      "Led the migration of the merchant dashboard from AngularJS to React + TypeScript, reducing load time by 40%. Architected a shared component library adopted across 6 product teams. Mentored 3 junior engineers and conducted bi-weekly design reviews.",
  },
  {
    id: "exp-002",
    position: "Full Stack Developer",
    company: "Freshworks",
    location: "Chennai, Tamil Nadu",
    start_date: "2020-07-15",
    end_date: "2022-02-28",
    description:
      "Built and maintained customer support features for Freshdesk using React and Ruby on Rails. Integrated third-party APIs including Twilio and Stripe. Improved API response times by 30% through query optimization and Redis caching.",
  },
  {
    id: "exp-003",
    position: "Software Engineer Intern",
    company: "Zoho Corporation",
    location: "Chennai, Tamil Nadu",
    start_date: "2020-01-06",
    end_date: "2020-06-30",
    description:
      "Developed internal tooling for the HR portal using Java and JavaScript. Wrote unit tests achieving 85% code coverage and participated in agile sprint planning.",
  },
];

export const sampleProjects: Array<ProjectData & { id: string }> = [
  {
    id: "proj-001",
    title: "OpenBoard",
    subtitle: "Real-time Collaborative Whiteboard",
    link: "github.com/arjunmehta/openboard",
    start_date: "2023-01-01",
    end_date: "2023-04-30",
    description:
      "Built a multiplayer whiteboard app using React, Canvas API, and WebSockets. Supports concurrent drawing, sticky notes, and shape tools for up to 50 users. Deployed on Railway with a Node.js signaling server.",
  },
  {
    id: "proj-002",
    title: "ResumeAI",
    subtitle: "AI-Powered Resume Builder & Analyzer",
    link: "resumeai.arjunmehta.dev",
    start_date: "2023-08-01",
    end_date: null,
    description:
      "SaaS platform that generates ATS-optimized resumes using OpenAI GPT-4. Features git-like version history, PDF export, and job description matching score. Built with Next.js, Supabase, and TailwindCSS.",
  },
  {
    id: "proj-003",
    title: "DevMetrics",
    subtitle: "GitHub Activity Dashboard",
    link: "github.com/arjunmehta/devmetrics",
    start_date: "2022-09-01",
    end_date: "2022-11-30",
    description:
      "Personal analytics dashboard that visualizes GitHub contributions, pull request trends, and code review activity. Uses GitHub GraphQL API and Recharts for data visualization.",
  },
];

export const sampleCertificates: Array<CertificateData & { id: string }> = [
  {
    id: "cert-001",
    name: "AWS Certified Solutions Architect – Associate",
    issuer: "Amazon Web Services",
    issue_date: "2023-05-20",
    expiry_date: "2026-05-20",
    link: "credly.com/badges/arjunmehta-aws-saa",
    description:
      "Validates expertise in designing distributed systems on AWS including EC2, S3, RDS, Lambda, and VPC networking.",
  },
  {
    id: "cert-002",
    name: "Meta Front-End Developer Professional Certificate",
    issuer: "Meta / Coursera",
    issue_date: "2022-11-10",
    expiry_date: null,
    link: "coursera.org/verify/arjunmehta-meta-fe",
    description:
      "9-course program covering React, UI/UX principles, responsive design, and capstone project development.",
  },
];

export const sampleSkills: Array<SkillData & { id: string }> = [
  { id: "skill-001", name: "TypeScript",    level: "expert"      },
  { id: "skill-002", name: "React",         level: "expert"      },
  { id: "skill-003", name: "Node.js",       level: "proficient"  },
  { id: "skill-004", name: "PostgreSQL",    level: "proficient"  },
  { id: "skill-005", name: "Docker",        level: "competent"   },
  { id: "skill-006", name: "AWS",           level: "competent"   },
  { id: "skill-007", name: "GraphQL",       level: "proficient"  },
  { id: "skill-008", name: "Figma",         level: "amateur"     },
];

export const sampleLanguages: Array<LanguageData & { id: string }> = [
  { id: "lang-001", name: "English", level: "fluent"       },
  { id: "lang-002", name: "Hindi",   level: "native"       },
  { id: "lang-003", name: "Kannada", level: "intermediate" },
];

export const sampleInterests: Array<InterestData & { id: string }> = [
  { id: "int-001", name: "Open Source Contributing" },
  { id: "int-002", name: "Technical Blogging"       },
  { id: "int-003", name: "Rock Climbing"            },
];

export const sampleAwards: Array<AwardData & { id: string }> = [
  {
    id: "award-001",
    title: "Best Innovator Award",
    awarder: "Razorpay",
    date: "2023-12-01",
    description:
      "Recognized for architecting the shared component library that reduced cross-team UI inconsistencies by 60%.",
  },
  {
    id: "award-002",
    title: "Smart India Hackathon — Finalist",
    awarder: "Government of India",
    date: "2019-08-15",
    description:
      "Reached national finals with a team of 6 building an AI-driven crop disease detection system using computer vision.",
  },
];

export const samplePublications: Array<PublicationData & { id: string }> = [
  {
    id: "pub-001",
    title: "Building Scalable Design Systems with React and TypeScript",
    publisher: "Medium — JavaScript in Plain English",
    date: "2023-07-12",
    link: "medium.com/@arjunmehta/design-systems-react-ts",
    description:
      "A deep dive into structuring component libraries with compound components, polymorphic props, and Storybook documentation.",
  },
  {
    id: "pub-002",
    title: "Understanding React Server Components — A Practical Guide",
    publisher: "Dev.to",
    date: "2024-02-05",
    link: "dev.to/arjunmehta/react-server-components-guide",
    description:
      "Explains RSC architecture, streaming, and the boundary between server and client components with real-world examples.",
  },
];

export const sampleReferences: Array<ReferenceData & { id: string }> = [
  {
    id: "ref-001",
    name: "Priya Nair",
    position: "Engineering Manager",
    organization: "Razorpay",
    email: "priya.nair@razorpay.com",
    phone: "+91 98001 11234",
  },
  {
    id: "ref-002",
    name: "Karthik Subramanian",
    position: "Tech Lead",
    organization: "Freshworks",
    email: "karthik.s@freshworks.com",
    phone: "+91 97002 55678",
  },
];

// ---- Composed full resume (as it would come from DB) ----
export const sampleResume = {
  profile:      sampleProfile,
  education:    sampleEducation,
  experience:   sampleExperience,
  projects:     sampleProjects,
  certificates: sampleCertificates,
  skills:       sampleSkills,
  languages:    sampleLanguages,
  interests:    sampleInterests,
  awards:       sampleAwards,
  publications: samplePublications,
  references:   sampleReferences,
};