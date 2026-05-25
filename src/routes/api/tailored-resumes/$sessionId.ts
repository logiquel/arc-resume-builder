// src/routes/api/tailored-resumes/$sessionId.tsx
import { tailor_session_sample_data } from "#/data/tailor_resume_data";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/tailored-resumes/$sessionId")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const data = {
          ...tailor_session_sample_data,
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
