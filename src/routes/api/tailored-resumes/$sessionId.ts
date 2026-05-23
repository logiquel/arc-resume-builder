// src/routes/api/tailored-resumes/$sessionId.tsx
import { tailoringSessionSampleData } from "#/types/resume/tailoringSessionSampleData";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/tailored-resumes/$sessionId")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const data = {
          ...tailoringSessionSampleData,
          id: params.sessionId,
        };

        return new Response(JSON.stringify(data), {
          headers: {
            "Content-Type": "application/json",
          },
        });
      },
    },
  },
});
