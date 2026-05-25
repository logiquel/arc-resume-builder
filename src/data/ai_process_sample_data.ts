// File Path: src/ai_process_sample_data.ts

export const aiProcessedSampleData = {
  resume_review: [
    {
      id: "profile",
      label: "Profile",
      entries: [
        {
          entry_id: "profile_1",
          profile_picture:
            "https://api.dicebear.com/7.x/avataaars/svg?seed=cammabri",
          first_name: "Aarav",
          last_name: "Sharma",
          professional_title: {
            changed: true,
            old_value: "Frontend Engineer",
            new_value: "Frontend Developer",
          },
          email: "aarav.sharma@example.com",
          phone: "+91 9876543210",
          location: "Jaipur, Rajasthan, India",
          links: [
            {
              id: "link_1",
              name: "LinkedIn",
              value: "linkedin.com/in/aaravsharma",
              icon: "linkedin",
            },
            {
              id: "link_2",
              name: "Portfolio",
              value: "https://aarav.dev",
              icon: "globe",
            },
          ],
          summary: {
            changed: true,
            old_value: {
              format: "paragraph",
              text: "Frontend engineer with experience building internal tools and dashboards.",
            },
            new_value: {
              format: "paragraph",
              text: "Frontend Developer with experience building scalable internal tools, performance-focused dashboards, and user-friendly web applications for cross-functional teams.",
            },
          },
        },
      ],
    },
    {
      id: "education",
      label: "Education",
      entries: [
        {
          entry_id: "edu_1",
          degree: {
            changed: true,
            old_value: "BTech",
            new_value: "Bachelor of Technology",
          },
          institution: "Jaipur Engineering College",
          score: "8.4 CGPA",
          location: "Jaipur, Rajasthan",
          start_date: "2018-08",
          end_date: "2022-05",
          link: "https://jec.example.edu",
          description: {
            changed: true,
            old_value: {
              format: "bullets",
              items: [
                {
                  id: "edu1_old_1",
                  text: "Studied computer science fundamentals and worked on final year project.",
                },
              ],
            },
            new_value: {
              format: "bullets",
              items: [
                {
                  id: "edu1_new_1",
                  text: "Studied core computer science subjects including data structures, DBMS, and operating systems.",
                },
                {
                  id: "edu1_new_2",
                  text: "Completed a final-year engineering project focused on scalable web application development.",
                },
              ],
            },
          },
        },
        {
          entry_id: "edu_2",
          degree: {
            changed: true,
            old_value: "MCA",
            new_value: "Master of Computer Applications",
          },
          institution: "Rajasthan University",
          score: "8.9 CGPA",
          location: "Jaipur, Rajasthan",
          start_date: "2022-07",
          end_date: "2024-06",
          link: "https://uniraj.ac.in",
          description: {
            changed: true,
            old_value: {
              format: "bullets",
              items: [
                {
                  id: "edu2_b1",
                  text: "Focused on software development and database systems.",
                },
                {
                  id: "edu2_b2",
                  text: "Built academic projects in web technologies.",
                },
              ],
            },
            new_value: {
              format: "bullets",
              items: [
                {
                  id: "edu2_b1",
                  text: "Focused on advanced software development, database systems, and application architecture.",
                },
                {
                  id: "edu2_b2",
                  text: "Built academic projects using modern web technologies and backend frameworks.",
                },
              ],
            },
          },
        },
      ],
    },
    {
      id: "experience",
      label: "Experience",
      entries: [
        {
          entry_id: "exp_1",
          position: {
            changed: false,
            old_value: "Frontend Engineer",
            new_value: "Frontend Engineer",
          },
          company: "ABC Tech",
          location: "Jaipur, Rajasthan",
          start_date: "2022-06",
          end_date: "2024-01",
          description: {
            changed: true,
            // Case 1: Paragraph -> Bullets
            old_value: {
              format: "paragraph",
              text: "I worked on our internal admin panel dashboard where I fixed various bugs, cleaned up the messy code base, and made pages load a lot faster for our internal staff users.",
            },
            new_value: {
              format: "bullets",
              items: [
                {
                  id: "exp1_new_b1",
                  text: "Refactored core architecture of the internal admin dashboard, improving maintainability and reducing technical debt.",
                },
                {
                  id: "exp1_new_b2",
                  text: "Optimized bundle sizes and front-end network queries, yielding a 38% improvement in page load performance for staff users.",
                },
              ],
            },
          },
        },
        {
          entry_id: "exp_2",
          position: {
            changed: false,
            old_value: "Full Stack Developer",
            new_value: "Full Stack Developer",
          },
          company: "XYZ Labs",
          location: "Remote",
          start_date: "2024-02",
          end_date: "",
          description: {
            changed: true,
            // Case 2: Bullets -> Bullets
            old_value: {
              format: "bullets",
              items: [
                {
                  id: "exp2_b1",
                  text: "Developed REST APIs for school ERP platform.",
                },
                {
                  id: "exp2_b2",
                  text: "Worked with frontend team to improve features.",
                },
              ],
            },
            new_value: {
              format: "bullets",
              items: [
                {
                  id: "exp2_b1",
                  text: "Developed REST APIs for a multi-tenant school ERP platform serving 15,000+ students.",
                },
                {
                  id: "exp2_b2",
                  text: "Collaborated with frontend team to ship fee management and attendance features, reducing manual admin work by 25%.",
                },
              ],
            },
          },
        },
      ],
    },
    {
      id: "projects",
      label: "Projects",
      entries: [
        {
          entry_id: "proj_1",
          title: "AI Resume Builder",
          subtitle: {
            changed: true,
            old_value: "Resume Builder App",
            new_value:
              "AI Resume Builder | React, TypeScript, Node.js, Supabase",
          },
          link: "https://resume-builder.example.com",
          start_date: "2025-01",
          end_date: "",
          description: {
            changed: true,
            old_value: {
              format: "bullets",
              items: [
                {
                  id: "proj1_b1",
                  text: "Built a resume builder application.",
                },
              ],
            },
            new_value: {
              format: "bullets",
              items: [
                {
                  id: "proj1_b1",
                  text: "Built an AI-powered resume builder using React, TypeScript, Node.js, and Supabase.",
                },
                {
                  id: "proj1_b2",
                  text: "Implemented ATS keyword matching and resume scoring workflows to improve job-description alignment.",
                },
              ],
            },
          },
        },
        {
          entry_id: "proj_2",
          title: "Inventory Management System",
          subtitle: {
            changed: true,
            old_value: "Inventory App",
            new_value:
              "Inventory Management System | Next.js, PostgreSQL, Prisma",
          },
          link: "https://inventory.example.com",
          start_date: "2024-07",
          end_date: "2024-11",
          description: {
            changed: true,
            old_value: {
              format: "bullets",
              items: [
                {
                  id: "proj2_b1",
                  text: "Created an app for inventory tracking.",
                },
              ],
            },
            new_value: {
              format: "bullets",
              items: [
                {
                  id: "proj2_b1",
                  text: "Developed an inventory management system using Next.js, PostgreSQL, and Prisma.",
                },
                {
                  id: "proj2_b2",
                  text: "Automated stock tracking and reporting workflows, reducing manual errors for warehouse operations.",
                },
              ],
            },
          },
        },
      ],
    },
    {
      id: "certificates",
      label: "Certificates",
      entries: [
        {
          entry_id: "cert_1",
          name: {
            changed: true,
            old_value: "AWS Cloud Practitioner",
            new_value: "AWS Certified Cloud Practitioner",
          },
          issuer: "Amazon Web Services",
          issue_date: "2024-03",
          expiry_date: "2027-03",
          link: "https://aws.amazon.com/certification",
          description: {
            changed: true,
            old_value: {
              format: "paragraph",
              text: "Learned cloud fundamentals.",
            },
            new_value: {
              format: "paragraph",
              text: "Built foundational knowledge in cloud infrastructure, AWS core services, pricing models, and security best practices.",
            },
          },
        },
        {
          entry_id: "cert_2",
          name: {
            changed: true,
            old_value: "Google Data Analytics",
            new_value: "Google Data Analytics Professional Certificate",
          },
          issuer: "Google",
          issue_date: "2023-09",
          expiry_date: "",
          link: "https://coursera.org/professional-certificates/google-data-analytics",
          description: {
            changed: true,
            old_value: {
              format: "paragraph",
              text: "Covered data analysis concepts.",
            },
            new_value: {
              format: "paragraph",
              text: "Developed practical skills in data cleaning, analysis, visualization, and reporting using spreadsheets, SQL, and dashboards.",
            },
          },
        },
      ],
    },
    {
      id: "skills",
      label: "Skills",
      entries: [
        {
          entry_id: "skill_1",
          name: {
            changed: true,
            old_value: "reactjs",
            new_value: "React",
          },
          level: "proficient",
        },
        {
          entry_id: "skill_2",
          name: {
            changed: true,
            old_value: "nodejs",
            new_value: "Node.js",
          },
          level: "competent",
        },
      ],
    },
    {
      id: "languages",
      label: "Languages",
      entries: [
        {
          entry_id: "lang_1",
          name: "English",
          level: "fluent",
        },
        {
          entry_id: "lang_2",
          name: "Hindi",
          level: "native",
        },
      ],
    },
    {
      id: "interests",
      label: "Interests",
      entries: [
        {
          entry_id: "interest_1",
          name: "Open Source",
        },
        {
          entry_id: "interest_2",
          name: "System Design",
        },
      ],
    },
    {
      id: "awards",
      label: "Awards",
      entries: [
        {
          entry_id: "award_1",
          title: {
            changed: true,
            old_value: "Best Employee",
            new_value: "Employee of the Quarter",
          },
          awarder: "ABC Tech",
          date: "2023-12",
          description: {
            changed: true,
            old_value: {
              format: "paragraph",
              text: "Received for good work performance.",
            },
            new_value: {
              format: "paragraph",
              text: "Recognized among the top performers in the engineering team for consistently delivering high-impact features and improving release quality.",
            },
          },
        },
        {
          entry_id: "award_2",
          title: {
            changed: true,
            old_value: "Hackathon Prize",
            new_value: "Hackathon Winner",
          },
          awarder: "Rajasthan University",
          date: "2021-09",
          description: {
            changed: true,
            old_value: {
              format: "paragraph",
              text: "Won a college hackathon.",
            },
            new_value: {
              format: "paragraph",
              text: "Won first place in a university hackathon by building a real-time problem-solving platform evaluated on innovation, usability, and technical execution.",
            },
          },
        },
      ],
    },
    {
      id: "publications",
      label: "Publications",
      entries: [
        {
          entry_id: "pub_1",
          title: {
            changed: false,
            old_value: "Optimizing Web App Performance",
            new_value: "Optimizing Web App Performance",
          },
          publisher: "Dev Journal",
          date: "2024-05",
          link: "https://devjournal.example.com/web-performance",
          description: {
            changed: true,
            old_value: {
              format: "paragraph",
              text: "Article about improving web application speed.",
            },
            new_value: {
              format: "paragraph",
              text: "Published an article discussing frontend performance optimization techniques, bundle reduction strategies, and practical methods for improving user experience.",
            },
          },
        },
        {
          entry_id: "pub_2",
          title: {
            changed: false,
            old_value: "Scalable API Design Patterns",
            new_value: "Scalable API Design Patterns",
          },
          publisher: "Tech Monthly",
          date: "2025-02",
          link: "https://techmonthly.example.com/scalable-api-design",
          description: {
            changed: true,
            old_value: {
              format: "paragraph",
              text: "Paper on API design practices.",
            },
            new_value: {
              format: "paragraph",
              text: "Wrote a technical publication covering scalable API design approaches, error handling strategies, versioning methods, and backend maintainability principles.",
            },
          },
        },
      ],
    },
    {
      id: "references",
      label: "References",
      entries: [
        {
          entry_id: "ref_1",
          name: "Rahul Sharma",
          position: "Engineering Manager",
          organization: "ABC Tech",
          email: "rahul.sharma@abctech.com",
          phone: "+91 9988776655",
        },
        {
          entry_id: "ref_2",
          name: "Priya Mehta",
          position: "Senior Product Manager",
          organization: "XYZ Labs",
          email: "priya.mehta@xyzlabs.com",
          phone: "+91 9876501234",
        },
      ],
    },
  ],
};
