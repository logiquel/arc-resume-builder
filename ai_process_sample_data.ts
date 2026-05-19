// TypeScript Interface Defs & Fully Populated Sample Data for Workspace UI Layout Design
// File Path: src/ai_process_sample_data.ts

export interface ScoreImpactItem {
  id: string;
  category: string;
  description: string;
  points: number;
  status: "pending" | "accepted" | "rejected";
}

export interface InlineAIField {
  id: string;
  type: "inline";
  scoreImpactId: string;
  originalText: string;
  currentText: string;
}

export interface BlockAIField {
  id: string;
  type: "block";
  scoreImpactId: string;
  originalText: string;
  currentText: string;
}

export interface BulletAIField {
  id: string;
  type: "bullet";
  scoreImpactId: string;
  originalText: string;
  currentText: string;
}

export interface ProfileLink {
  id: string;
  name: string;
  value: string;
  icon: string;
}

export interface PostAIProfile {
  profile_picture: string;
  first_name: string;
  last_name: string;
  professional_title: InlineAIField;
  email: string;
  phone: string;
  location: string;
  links: ProfileLink[];
  summary: BlockAIField;
}

export interface PostAIEducation {
  id: string;
  degree: InlineAIField;
  institution: string;
  score: string;
  location: string;
  start_date: string | null;
  end_date: string | null;
  link: string;
  highlights: BulletAIField[];
}

export interface PostAIWorkExperience {
  id: string;
  company: string;
  role: string;
  location: string;
  start_date: string | null;
  end_date: string | null;
  highlights: BulletAIField[];
}

export interface PostAIProject {
  id: string;
  title: string;
  subtitle: InlineAIField;
  link: string;
  start_date: string | null;
  end_date: string | null;
  highlights: BulletAIField[];
}

export interface PostAICertificate {
  id: string;
  name: InlineAIField;
  issuer: string;
  issue_date: string | null;
  expiry_date: string | null;
  link: string;
  highlights: BulletAIField[];
}

export interface PostAISkill {
  id: string;
  name: string;
  level: "beginner" | "amateur" | "competent" | "proficient" | "expert";
}

export interface PostAILanguage {
  id: string;
  name: string;
  level: "beginner" | "intermediate" | "advanced" | "fluent" | "native";
}

export interface PostAIInterest {
  id: string;
  name: string;
}

export interface PostAIAward {
  id: string;
  title: string;
  awarder: string;
  date: string | null;
  description: BlockAIField;
}

export interface PostAIPublication {
  id: string;
  title: string;
  publisher: string;
  date: string | null;
  link: string;
  description: BlockAIField;
}

export interface PostAIReference {
  id: string;
  name: string;
  position: string;
  organization: string;
  email: string;
  phone: string;
}

export interface EnhancedResumePayload {
  scoreBreakdown: ScoreImpactItem[];
  profile: PostAIProfile;
  education: PostAIEducation[];
  workExperience: PostAIWorkExperience[];
  projects: PostAIProject[];
  certificates: PostAICertificate[];
  skills: PostAISkill[];
  languages: PostAILanguage[];
  interests: PostAIInterest[];
  awards: PostAIAward[];
  publications: PostAIPublication[];
  references: PostAIReference[];
}

export const aiProcessedSampleData: EnhancedResumePayload = {
  scoreBreakdown: [
    {
      id: "sb_profile_title",
      category: "Role Targeting",
      description:
        "Aligned professional title with the target Senior Frontend/Full Stack specification.",
      points: 10,
      status: "pending",
    },
    {
      id: "sb_summary_keywords",
      category: "Keyword Optimization",
      description:
        "Injected target core technical keywords (MERN Stack, Next.js, System Architecture) into executive summary.",
      points: 15,
      status: "pending",
    },
    {
      id: "sb_edu_nomenclature",
      category: "Nomenclature Standardization",
      description:
        "Standardized degree terminology to clear ATS-friendly aliases.",
      points: 5,
      status: "pending",
    },
    {
      id: "sb_edu_coursework",
      category: "Academic Alignment",
      description:
        "Extracted and structured advanced academic core competencies matching requested qualifications.",
      points: 10,
      status: "pending",
    },
    {
      id: "sb_exp_action_verbs",
      category: "Impact & Action Verbs",
      description:
        "Upgraded passive framing phrases to assertive industry standard action verbs.",
      points: 15,
      status: "pending",
    },
    {
      id: "sb_exp_metrics",
      category: "Quantifiable Achievements",
      description:
        "Injected measurable engineering metrics, scale factors, and percentage benchmarks.",
      points: 20,
      status: "pending",
    },
    {
      id: "sb_proj_xyz",
      category: "Engineering Framework",
      description:
        "Re-engineered description nodes using the comprehensive Problem-Solution-Impact (X-Y-Z) methodology.",
      points: 15,
      status: "pending",
    },
    {
      id: "sb_cert_standard",
      category: "Credentials Verification",
      description:
        "Standardized certification credentials to matching verified cloud provider aliases.",
      points: 5,
      status: "pending",
    },
    {
      id: "sb_skill_injection",
      category: "Skill Gap Supplementation",
      description:
        "Injected missing target infrastructure tools and methodology identifiers requested in the Job Description.",
      points: 15,
      status: "pending",
    },
    {
      id: "sb_award_scale",
      category: "Selectivity Metrics",
      description:
        "Quantified selectivity, scope, and competitiveness metrics for excellence awards.",
      points: 5,
      status: "pending",
    },
  ],
  profile: {
    profile_picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=cammabri",
    first_name: "Charlie Alfa",
    last_name: "Mike Mike",
    professional_title: {
      id: "prof_title_01",
      type: "inline",
      scoreImpactId: "sb_profile_title",
      originalText: "Full Stack Developer & Tech Enthusiast",
      currentText: "Full Stack Developer (MERN & Next.js)",
    },
    email: "cammabri@logiquel.io",
    phone: "+91 98765 43210",
    location: "Jaipur, Rajasthan, India",
    links: [
      {
        id: "pl_01",
        name: "LinkedIn",
        value: "https://linkedin.com/in/cammabri",
        icon: "tabler:brand-linkedin",
      },
      {
        id: "pl_02",
        name: "GitHub",
        value: "https://github.com/cammabri",
        icon: "tabler:brand-github",
      },
      {
        id: "pl_03",
        name: "Portfolio",
        value: "https://logiquel.io/cammabri",
        icon: "tabler:world",
      },
    ],
    summary: {
      id: "prof_sum_01",
      type: "block",
      scoreImpactId: "sb_summary_keywords",
      originalText:
        "I am a full stack developer doing a job and also managing a 3-person agency called Logiquel. I love coding in React and Node.js. I have worked on school enterprise applications and software systems. Trying to build good products that scale up nicely.",
      currentText:
        "Detail-oriented Full Stack Developer with specialized expertise across the MERN stack and Next.js. Proven track record executing microservices architecture and managing multi-tenant enterprise solutions for the educational market. Adept at transforming high-level system designs into highly optimized, performant web applications supporting thousands of concurrent active users.",
    },
  },
  education: [
    {
      id: "edu_entry_01",
      degree: {
        id: "edu_deg_01",
        type: "inline",
        scoreImpactId: "sb_edu_nomenclature",
        originalText: "BTech CSE",
        currentText:
          "Bachelor of Technology in Computer Science and Engineering",
      },
      institution: "Rajasthan Technical University",
      score: "8.4 CGPA",
      location: "Kota, Rajasthan, India",
      start_date: "2021-08",
      end_date: "2025-06",
      link: "https://rtu.ac.in",
      highlights: [
        {
          id: "hl_edu_01",
          type: "bullet",
          scoreImpactId: "sb_edu_coursework",
          originalText:
            "I took classes on database systems, coding, and software engineering principles.",
          currentText:
            "Advanced coursework completed in Database Management Systems, Advanced Data Structures & Algorithms, Object-Oriented Programming, and Software Engineering Methodologies.",
        },
        {
          id: "hl_edu_02",
          type: "bullet",
          scoreImpactId: "sb_edu_coursework",
          originalText: "Did a mini project on system management.",
          currentText:
            "Engineered a relational academic record tracking subsystem as part of a distributed system design evaluation, achieving optimal database normalization configurations.",
        },
      ],
    },
  ],
  workExperience: [
    {
      id: "exp_entry_01",
      company: "Logiquel",
      role: "Full Stack Developer",
      location: "Remote, India",
      start_date: "2025-11",
      end_date: null,
      highlights: [
        {
          id: "hl_exp_11",
          type: "bullet",
          scoreImpactId: "sb_exp_action_verbs",
          originalText:
            "I spent time writing frontend dashboards using React and set up backend APIs with Express and Node.",
          currentText:
            "Architected secure, scalable backend RESTful microservices using Node.js and Express while building reusable modular user interfaces in React.",
        },
        {
          id: "hl_exp_12",
          type: "bullet",
          scoreImpactId: "sb_exp_metrics",
          originalText:
            "I set up MongoDB for a multi-tenant app we are making for schools in India.",
          currentText:
            "Designed and deployed a complex multi-tenant database partitioning strategy within MongoDB for 'Osmos' ERP, isolating enterprise school tenancy and accelerating query execution by 35%.",
        },
        {
          id: "hl_exp_13",
          type: "bullet",
          scoreImpactId: "sb_exp_metrics",
          originalText:
            "I did some performance optimization because things were slow.",
          currentText:
            "Implemented frontend bundle splitting strategies and asset caching, lowering application initial page rendering paint latencies by 40% across administrative views.",
        },
      ],
    },
    {
      id: "exp_entry_02",
      company: "Freelance",
      role: "Web Developer",
      location: "Jaipur, India",
      start_date: "2025-01",
      end_date: "2025-10",
      highlights: [
        {
          id: "hl_exp_21",
          type: "bullet",
          scoreImpactId: "sb_exp_action_verbs",
          originalText:
            "I made full stack websites for local small clients using JavaScript.",
          currentText:
            "Spearheaded end-to-end full stack web engineering contracts for domestic enterprises, deploying robust dynamic applications leveraging modern ECMAScript standards.",
        },
        {
          id: "hl_exp_22",
          type: "bullet",
          scoreImpactId: "sb_exp_metrics",
          originalText: "",
          currentText:
            "Successfully scaled database connectivity configurations to handle spike traffic variations, serving up to 5,000 active client sessions seamlessly.",
        },
      ],
    },
  ],
  projects: [
    {
      id: "proj_entry_01",
      title: "Osmos School ERP",
      subtitle: {
        id: "proj_sub_01",
        type: "inline",
        scoreImpactId: "sb_skill_injection",
        originalText: "A web app system for schools.",
        currentText:
          "Multi-Tenant Enterprise Platform built using React, Node.js, MongoDB, Express, and Redux Toolkit",
      },
      link: "https://osmos-erp.in",
      start_date: "2025-12",
      end_date: null,
      highlights: [
        {
          id: "hl_proj_11",
          type: "bullet",
          scoreImpactId: "sb_proj_xyz",
          originalText:
            "I wrote the feature for handling fees, track student attendance, and handle admissions.",
          currentText:
            "Engineered standalone modular accounting, transactional fee management, high-volume attendance indexing trackers, and automated admissions routing flows.",
        },
        {
          id: "hl_proj_12",
          type: "bullet",
          scoreImpactId: "sb_proj_xyz",
          originalText:
            "Made a system configuration where data doesn't mix up between different schools.",
          currentText:
            "Engineered rigid logical multi-tenancy access layers, restricting inter-tenant data leaks and resolving concurrent record updates safely under peak traffic periods.",
        },
      ],
    },
    {
      id: "proj_entry_02",
      title: "AI Resume Scorer & Enhancer",
      subtitle: {
        id: "proj_sub_02",
        type: "inline",
        scoreImpactId: "sb_skill_injection",
        originalText: "An AI platform for resumes.",
        currentText:
          "AI SaaS Architecture leveraging Next.js, TypeScript, TailwindCSS, and LangChain",
      },
      link: "https://github.com/cammabri/ai-resume-optimizer",
      start_date: "2026-04",
      end_date: "2026-05",
      highlights: [
        {
          id: "hl_proj_21",
          type: "bullet",
          scoreImpactId: "sb_proj_xyz",
          originalText:
            "It parses uploaded document files and looks for errors and scores them. It can fix paragraphs with AI.",
          currentText:
            "Architected ingestion layers that extract document abstract lines, mapping structural validation states to compute real-time ATS optimization scoring vectors.",
        },
        {
          id: "hl_proj_22",
          type: "bullet",
          scoreImpactId: "sb_proj_xyz",
          originalText:
            "It calculates difference text highlights in the frontend UI.",
          currentText:
            "Constructed asynchronous background state execution workflows, seamlessly passing structural text changes down to tokenized inline diff highlights containers.",
        },
      ],
    },
  ],
  certificates: [
    {
      id: "cert_entry_01",
      name: {
        id: "cert_name_01",
        type: "inline",
        scoreImpactId: "sb_cert_standard",
        originalText: "AWS Cloud Course",
        currentText: "AWS Certified Solutions Architect \u2013 Associate",
      },
      issuer: "Amazon Web Services (AWS)",
      issue_date: "2025-08",
      expiry_date: "2028-08",
      link: "https://aws.amazon.com/verification/sample",
      highlights: [
        {
          id: "hl_cert_01",
          type: "bullet",
          scoreImpactId: "sb_skill_injection",
          originalText:
            "Learnt about EC2 nodes, database instances, and secure bucket setups.",
          currentText:
            "Validated architectural competencies across secure deployment frameworks, scalable computing infrastructure nodes, VPC networking routing, and IAM permission matrices.",
        },
      ],
    },
  ],
  skills: [
    {
      id: "sk_01",
      name: "React",
      level: "expert",
    },
    {
      id: "sk_02",
      name: "Node.js",
      level: "proficient",
    },
    {
      id: "sk_03",
      name: "Express.js",
      level: "proficient",
    },
    {
      id: "sk_04",
      name: "MongoDB",
      level: "proficient",
    },
    {
      id: "sk_05",
      name: "TypeScript",
      level: "proficient",
    },
    {
      id: "sk_06",
      name: "Next.js",
      level: "proficient",
    },
    {
      id: "sk_07",
      name: "System Architecture (HLD/LLD)",
      level: "competent",
    },
    {
      id: "sk_08",
      name: "Multi-Tenant Design",
      level: "proficient",
    },
  ],
  languages: [
    {
      id: "lang_01",
      name: "English",
      level: "fluent",
    },
    {
      id: "lang_02",
      name: "Hindi",
      level: "native",
    },
  ],
  interests: [
    {
      id: "int_01",
      name: "High-Level Architectural System Design",
    },
    {
      id: "int_02",
      name: "A Song of Ice and Fire Lore Analysis",
    },
    {
      id: "int_03",
      name: "Home Gym System Layout Logistics",
    },
  ],
  awards: [
    {
      id: "aw_entry_01",
      title: "Smart India Hackathon Finalist",
      awarder: "Ministry of Education, India",
      date: "2024-12",
      description: {
        id: "aw_desc_01",
        type: "block",
        scoreImpactId: "sb_award_scale",
        originalText:
          "We went to the finals for solving a problem statement with software.",
        currentText:
          "Selected out of 50,000+ national applicant matrices to advance into the active standard physical rapid-prototyping grand finale stage, presenting an integrated resource logistics management framework application directly to evaluation boards.",
      },
    },
  ],
  publications: [
    {
      id: "pub_entry_01",
      title: "An Empirical Review of Real-time Database Tenancy Strategies",
      publisher: "International Journal of Computer Engineering Trends",
      date: "2025-05",
      link: "https://example-journal.org/publications/tenancy-strategies",
      description: {
        id: "pub_desc_01",
        type: "block",
        scoreImpactId: "sb_proj_xyz",
        originalText:
          "I wrote a small research paper comparing performance under database multi-tenant models.",
        currentText:
          "Published a technical research evaluation grading response latency trade-offs between shared-database vs. separate-schema multi-tenancy configurations under severe simulated workloads.",
      },
    },
  ],
  references: [
    {
      id: "ref_entry_01",
      name: "John Doe",
      position: "Engineering Lead",
      organization: "Logiquel Client Services",
      email: "johndoe@example.com",
      phone: "+91 99999 88888",
    },
  ],
};
