import type { TailoringSession } from "#/types/resume/tailorSession.types";

export const tailor_session_sample_data: TailoringSession = {
  id: "sess_8f3kLm29QaX7vP1d",
  user_id: "user_001",
  base_resume_id: "res_123456",
  name: "Senior Full Stack Engineer - Stripe",
  created_at: "2026-05-23T09:00:00.000Z",
  updated_at: "2026-05-24T07:37:48.520Z",
  analysis: {
    score: 87,
    matched_keywords: [
      "React",
      "Node.js",
      "TypeScript",
      "AWS",
      "Scalable Systems",
      "REST APIs",
      "Performance Optimization",
      "Frontend Engineering",
    ],
    missing_keywords: ["GraphQL", "System Design", "CI/CD", "Observability"],
    keyword_coverage: 82,
    summary:
      "Strong match for a senior full stack engineering role with excellent frontend and backend alignment. Resume was enhanced to better reflect business impact, scale, and measurable outcomes while improving keyword alignment for ATS screening.",
  },
  changes: {
    profile: {
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      links: [
        {
          type: "github",
          url: "https://github.com/johndoe",
        },
        {
          type: "linkedin",
          url: "https://linkedin.com/in/johndoe",
        },
        {
          type: "portfolio",
          url: "https://johndoe.dev",
        },
      ],
      professional_title: {
        old_value: "Developer",
        new_value: "Senior Full Stack Engineer",
        old_format: "text",
        new_format: "text",
        diff_mode: "inline",
        status: "pending",
      },
      summary: {
        old_value:
          "I am a developer with 5 years of experience. I have worked on many projects using React and Node.js. I am passionate about building web applications and looking for new opportunities.",
        new_value:
          "Results-driven Full Stack Engineer with 5+ years of experience building scalable web applications. Expert in React and Node.js with proven track record of delivering high-impact features. Passionate about creating intuitive user experiences and optimizing backend performance. Seeking senior engineering role to drive technical excellence.",
        old_format: "para",
        new_format: "para",
        diff_mode: "inline",
        status: "accepted",
        resolved_value:
          "Results-driven Full Stack Engineer with 5+ years of experience building scalable web applications. Expert in React and Node.js with proven track record of delivering high-impact features. Passionate about creating intuitive user experiences and optimizing backend performance. Seeking senior engineering role to drive technical excellence.",
      },
    },
    education: {
      entries: [
        {
          entry_id: "edu_001",
          institution: "Stanford University",
          location: "Stanford, CA",
          start_date: "2015-09",
          end_date: "2019-06",
          link: "https://stanford.edu",
          degree: {
            old_value: "BS Computer Science",
            new_value: "Bachelor of Science in Computer Science",
            old_format: "text",
            new_format: "text",
            diff_mode: "inline",
            status: "pending",
          },
          score: "3.8 GPA",
          description: {
            old_value:
              "Studied data structures, algorithms, and web development. Worked on a capstone project building a social media analytics tool. Was part of the robotics club.",
            new_value: [
              "Graduated with 3.8 GPA, earning Dean's List honors for 6 consecutive semesters",
              "Developed full-stack social media analytics tool using React and Python, processing 10,000+ daily posts",
              "Led robotics club team of 15 members, winning 2nd place in regional competition",
            ],
            old_format: "para",
            new_format: "bullet_points",
            diff_mode: "structural",
            status: "pending",
          },
        },
      ],
    },
    experience: {
      entries: [
        {
          entry_id: "exp_001",
          company: "Google",
          location: "Mountain View, CA",
          start_date: "2021-03",
          end_date: "2024-01",
          position: {
            old_value: "Frontend Developer",
            new_value: "Senior Frontend Engineer",
            old_format: "text",
            new_format: "text",
            diff_mode: "inline",
            status: "accepted",
            resolved_value: "Senior Frontend Engineer",
          },
          description: {
            old_value:
              "I built user interfaces using React and worked with the design team. I also optimized website performance and fixed bugs. I collaborated with backend engineers to integrate APIs.",
            new_value: [
              "Architected and built 25+ responsive UI components using React and TypeScript, serving 1M+ daily active users",
              "Collaborated with design team to implement pixel-perfect interfaces, reducing design-to-development handoff by 40%",
              "Optimized web performance achieving 95+ Lighthouse score and reducing LCP from 3.2s to 1.1s",
              "Integrated 15+ microservices APIs, enabling real-time data synchronization across 5 platforms",
            ],
            old_format: "para",
            new_format: "bullet_points",
            diff_mode: "structural",
            status: "pending",
          },
        },
        {
          entry_id: "exp_002",
          company: "Amazon",
          location: "Seattle, WA",
          start_date: "2019-07",
          end_date: "2021-02",
          position: {
            old_value: "Backend Developer",
            new_value: "Software Development Engineer",
            old_format: "text",
            new_format: "text",
            diff_mode: "inline",
            status: "rejected",
            resolved_value: "Backend Developer",
          },
          description: {
            old_value: [
              "Developed REST APIs using Node.js",
              "Managed AWS infrastructure",
              "Wrote unit tests for backend services",
            ],
            new_value: [
              "Designed and deployed 30+ scalable REST APIs using Node.js and Express, handling 500,000+ daily requests with 99.95% uptime",
              "Managed AWS infrastructure serving 2M+ customers, reducing cloud costs by 25% through EC2 optimization",
              "Implemented comprehensive unit and integration tests achieving 92% code coverage across 50+ microservices",
            ],
            old_format: "bullet_points",
            new_format: "bullet_points",
            diff_mode: "inline",
            status: "accepted",
            resolved_value: [
              "Designed and deployed 30+ scalable REST APIs using Node.js and Express, handling 500,000+ daily requests with 99.95% uptime",
              "Managed AWS infrastructure serving 2M+ customers, reducing cloud costs by 25% through EC2 optimization",
              "Implemented comprehensive unit and integration tests achieving 92% code coverage across 50+ microservices",
            ],
          },
        },
      ],
    },
    projects: {
      entries: [
        {
          entry_id: "proj_001",
          title: "E-Commerce Platform",
          link: "https://github.com/johndoe/ecommerce",
          start_date: "2023-01",
          end_date: "2023-06",
          subtitle: {
            old_value: "Online shopping website",
            new_value:
              "Full-stack e-commerce platform using React, Node.js, MongoDB, and Stripe API",
            old_format: "text",
            new_format: "text",
            diff_mode: "inline",
            status: "accepted",
            resolved_value:
              "Full-stack e-commerce platform using React, Node.js, MongoDB, and Stripe API",
          },
          description: {
            old_value:
              "Built an e-commerce website where users can browse products, add to cart, and checkout. Implemented payment integration and admin dashboard.",
            new_value: [
              "Engineered full-stack e-commerce platform serving 5,000+ monthly users with 15% conversion rate",
              "Integrated Stripe payment API processing $50,000+ in transactions with PCI compliance",
              "Built admin dashboard with real-time inventory tracking, reducing stockouts by 60%",
              "Implemented JWT authentication and Redis caching, improving page load speed by 45%",
            ],
            old_format: "para",
            new_format: "bullet_points",
            diff_mode: "structural",
            status: "accepted",
            resolved_value: [
              "Engineered full-stack e-commerce platform serving 5,000+ monthly users with 15% conversion rate",
              "Integrated Stripe payment API processing $50,000+ in transactions with PCI compliance",
              "Built admin dashboard with real-time inventory tracking, reducing stockouts by 60%",
              "Implemented JWT authentication and Redis caching, improving page load speed by 45%",
            ],
          },
        },
        {
          entry_id: "proj_002",
          title: "Task Management App",
          link: "https://github.com/johndoe/taskapp",
          start_date: "2022-04",
          end_date: "2022-08",
          subtitle: {
            old_value: "Task manager",
            new_value:
              "Real-time task management app with Next.js, TypeScript, Prisma, and PostgreSQL",
            old_format: "text",
            new_format: "text",
            diff_mode: "inline",
            status: "pending",
          },
          description: {
            old_value: [
              "Users can create and manage tasks",
              "Real-time updates using WebSockets",
              "Drag-drop interface for task organization",
            ],
            new_value: [
              "Built real-time task management app with drag-drop interface, serving 2,000+ registered users",
              "Implemented WebSocket connections enabling instant updates for 100+ concurrent users",
              "Optimized database queries reducing API response time from 400ms to 80ms",
            ],
            old_format: "bullet_points",
            new_format: "bullet_points",
            diff_mode: "inline",
            status: "accepted",
            resolved_value: [
              "Built real-time task management app with drag-drop interface, serving 2,000+ registered users",
              "Implemented WebSocket connections enabling instant updates for 100+ concurrent users",
              "Optimized database queries reducing API response time from 400ms to 80ms",
            ],
          },
        },
      ],
    },
    certificates: {
      entries: [
        {
          entry_id: "cert_001",
          issuer: "Amazon Web Services",
          issue_date: "2023-10",
          expiry_date: "2026-10",
          link: "https://aws.amazon.com/certification",
          name: {
            old_value: "aws solutions arch",
            new_value: "AWS Certified Solutions Architect – Associate",
            old_format: "text",
            new_format: "text",
            diff_mode: "inline",
            status: "accepted",
            resolved_value: "AWS Certified Solutions Architect – Associate",
          },
          description: {
            old_value:
              "Learned about designing distributed systems on AWS. Covered EC2, S3, VPC, and Lambda.",
            new_value:
              "Mastered designing cost-optimized, highly available distributed systems on AWS. Gained hands-on expertise in EC2, S3, VPC, Lambda, and CloudFormation for scalable cloud architecture.",
            old_format: "para",
            new_format: "para",
            diff_mode: "inline",
            status: "accepted",
            resolved_value:
              "Mastered designing cost-optimized, highly available distributed systems on AWS. Gained hands-on expertise in EC2, S3, VPC, Lambda, and CloudFormation for scalable cloud architecture.",
          },
        },
        {
          entry_id: "cert_002",
          issuer: "Meta",
          issue_date: "2022-06",
          expiry_date: null,
          link: "https://meta.com/certifications",
          name: {
            old_value: "react cert",
            new_value: "Meta Frontend Developer Professional Certificate",
            old_format: "text",
            new_format: "text",
            diff_mode: "inline",
            status: "accepted",
            resolved_value: "Meta Frontend Developer Professional Certificate",
          },
          description: {
            old_value:
              "Completed coursework on React, Redux, and frontend testing.",
            new_value:
              "Completed comprehensive training in React, Redux, and Jest testing. Built 5 production-ready frontend applications as part of capstone projects.",
            old_format: "para",
            new_format: "para",
            diff_mode: "inline",
            status: "accepted",
            resolved_value:
              "Completed comprehensive training in React, Redux, and Jest testing. Built 5 production-ready frontend applications as part of capstone projects.",
          },
        },
      ],
    },
    skills: {
      entries: [
        {
          entry_id: "skill_001",
          name: {
            old_value: "reactjs",
            new_value: "React",
            old_format: "text",
            new_format: "text",
            diff_mode: "inline",
            status: "accepted",
            resolved_value: "React",
          },
          level: "Advanced",
        },
        {
          entry_id: "skill_002",
          name: {
            old_value: "node",
            new_value: "Node.js",
            old_format: "text",
            new_format: "text",
            diff_mode: "inline",
            status: "accepted",
            resolved_value: "Node.js",
          },
          level: "Advanced",
        },
        {
          entry_id: "skill_003",
          name: {
            old_value: "py",
            new_value: "Python",
            old_format: "text",
            new_format: "text",
            diff_mode: "inline",
            status: "accepted",
            resolved_value: "Python",
          },
          level: "Intermediate",
        },
        {
          entry_id: "skill_004",
          name: {
            old_value: "aws",
            new_value: "AWS (EC2, S3, Lambda)",
            old_format: "text",
            new_format: "text",
            diff_mode: "inline",
            status: "accepted",
            resolved_value: "AWS (EC2, S3, Lambda)",
          },
          level: "Intermediate",
        },
        {
          entry_id: "skill_005",
          name: "PostgreSQL",
          level: "Advanced",
        },
        {
          entry_id: "skill_006",
          name: "Docker",
          level: "Intermediate",
        },
      ],
    },
    languages: {
      entries: [
        {
          entry_id: "lang_001",
          name: "English",
          level: "Native",
        },
        {
          entry_id: "lang_002",
          name: "Spanish",
          level: "Professional Working",
        },
        {
          entry_id: "lang_003",
          name: "French",
          level: "Elementary",
        },
      ],
    },
    interests: {
      entries: [
        {
          entry_id: "int_001",
          name: "Open Source Contribution",
        },
        {
          entry_id: "int_002",
          name: "Tech Blogging",
        },
        {
          entry_id: "int_003",
          name: "Chess",
        },
      ],
    },
    awards: {
      entries: [
        {
          entry_id: "awd_001",
          awarder: "Google",
          date: "2023-05",
          title: {
            old_value: "best dev",
            new_value: "Best Innovation Award – Google Hackathon 2023",
            old_format: "text",
            new_format: "text",
            diff_mode: "inline",
            status: "accepted",
            resolved_value: "Best Innovation Award – Google Hackathon 2023",
          },
          description: {
            old_value:
              "Won an award for building a sustainability app at the internal hackathon.",
            new_value:
              "Recognized among 500+ participants for developing a carbon footprint tracking app. Selected by executive panel for outstanding technical execution and business impact.",
            old_format: "para",
            new_format: "para",
            diff_mode: "inline",
            status: "accepted",
            resolved_value:
              "Recognized among 500+ participants for developing a carbon footprint tracking app. Selected by executive panel for outstanding technical execution and business impact.",
          },
        },
      ],
    },
    publications: {
      entries: [
        {
          entry_id: "pub_001",
          publisher: "IEEE",
          date: "2022-11",
          link: "https://ieeexplore.ieee.org/document/12345",
          title: {
            old_value: "web app perf paper",
            new_value:
              "Optimizing Web Application Performance: A Comprehensive Study of Modern Techniques",
            old_format: "text",
            new_format: "text",
            diff_mode: "inline",
            status: "accepted",
            resolved_value:
              "Optimizing Web Application Performance: A Comprehensive Study of Modern Techniques",
          },
          description: {
            old_value:
              "Research paper about web performance optimization techniques including code splitting and lazy loading.",
            new_value:
              "Published research on web performance optimization analyzing 10+ techniques including code splitting, lazy loading, and CDN strategies. Cited by 25+ researchers and presented at International Conference on Web Engineering.",
            old_format: "para",
            new_format: "para",
            diff_mode: "inline",
            status: "accepted",
            resolved_value:
              "Published research on web performance optimization analyzing 10+ techniques including code splitting, lazy loading, and CDN strategies. Cited by 25+ researchers and presented at International Conference on Web Engineering.",
          },
        },
      ],
    },
    references: {
      entries: [
        {
          entry_id: "ref_001",
          name: "Jane Smith",
          position: "Engineering Manager",
          organization: "Google",
          email: "jane.smith@google.com",
          phone: "+1 (555) 987-6543",
        },
        {
          entry_id: "ref_002",
          name: "Mike Johnson",
          position: "Senior Product Manager",
          organization: "Amazon",
          email: "mike.johnson@amazon.com",
          phone: "+1 (555) 456-7890",
        },
      ],
    },
  },
};
