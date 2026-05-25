// src/routes/api/resumes/$reportId.ts
import { createFileRoute } from "@tanstack/react-router";
import type { Format3Data } from "#/types/resume/resume.types";

export const Route = createFileRoute("/api/resumes/$reportId")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const resume = await getMockResumeById(params.reportId);

        if (!resume) {
          return new Response("Resume not found", { status: 404 });
        }

        return Response.json(resume satisfies Format3Data);
      },
    },
  },
});
