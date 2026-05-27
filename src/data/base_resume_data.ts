export const base_data = {
  profile: {
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    links: [
      {
        name: "github",
        url: "https://github.com/johndoe",
      },
      {
        name: "linkedin",
        value: "https://linkedin.com/in/johndoe",
      },
      {
        name: "portfolio",
        value: "https://johndoe.dev",
      },
    ],
    professional_title: "Developer",
    summary:
      "I am a developer with 5 years of experience. I have worked on many projects using React and Node.js. I am passionate about building web applications and looking for new opportunities.",
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
        degree: "BS Computer Science",
        score: "3.8 GPA",
        description:
          "Studied data structures, algorithms, and web development. Worked on a capstone project building a social media analytics tool. Was part of the robotics club.",
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
        position: "Frontend Developer",
        description:
          "I built user interfaces using React and worked with the design team. I also optimized website performance and fixed bugs. I collaborated with backend engineers to integrate APIs.",
      },
      {
        entry_id: "exp_002",
        company: "Amazon",
        location: "Seattle, WA",
        start_date: "2019-07",
        end_date: "2021-02",
        position: "Backend Developer",
        description: [
          "Developed REST APIs using Node.js",
          "Managed AWS infrastructure",
          "Wrote unit tests for backend services",
        ],
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
        subtitle: "Online shopping website",
        description:
          "Built an e-commerce website where users can browse products, add to cart, and checkout. Implemented payment integration and admin dashboard.",
      },
      {
        entry_id: "proj_002",
        title: "Task Management App",
        link: "https://github.com/johndoe/taskapp",
        start_date: "2022-04",
        end_date: "2022-08",
        subtitle: "Task manager",
        description: [
          "Users can create and manage tasks",
          "Real-time updates using WebSockets",
          "Drag-drop interface for task organization",
        ],
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
        name: "aws solutions arch",
        description:
          "Learned about designing distributed systems on AWS. Covered EC2, S3, VPC, and Lambda.",
      },
      {
        entry_id: "cert_002",
        issuer: "Meta",
        issue_date: "2022-06",
        expiry_date: null,
        link: "https://meta.com/certifications",
        name: "react cert",
        description:
          "Completed coursework on React, Redux, and frontend testing.",
      },
    ],
  },
  skills: {
    entries: [
      {
        entry_id: "skill_001",
        name: "reactjs",
        level: "Advanced",
      },
      {
        entry_id: "skill_002",
        name: "node",
        level: "Advanced",
      },
      {
        entry_id: "skill_003",
        name: "py",
        level: "Intermediate",
      },
      {
        entry_id: "skill_004",
        name: "aws",
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
        title: "best dev",
        description:
          "Won an award for building a sustainability app at the internal hackathon.",
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
        title: "web app perf paper",
        description:
          "Research paper about web performance optimization techniques including code splitting and lazy loading.",
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
};
