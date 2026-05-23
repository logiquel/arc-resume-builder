import { useEffect, useRef, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import type { Format3Data } from "#/types/resume/resumeTypes";
import { loadResumeFromDB } from "#/lib/storage";
import { Route } from "#/routes/_app/preview/$reportId";

import { ATSTemplate } from "#/components/templates/ATSTemplate";
import { ModernTemplate } from "#/components/templates/ModernTemplate";
import { ClassicTemplate } from "#/components/templates/ClassicTemplate";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

type ReactPdfModule = typeof import("react-pdf");

const TEMPLATE_MAP = {
  ats: ATSTemplate,
  modern: ModernTemplate,
  classic: ClassicTemplate,
} as const;

type TemplateKey = keyof typeof TEMPLATE_MAP;

const TEMPLATE_OPTIONS: Array<{
  key: TemplateKey;
  label: string;
  description: string;
}> = [
  {
    key: "ats",
    label: "ATS",
    description: "Clean and scanner-friendly layout",
  },
  {
    key: "modern",
    label: "Modern",
    description: "Balanced layout with strong hierarchy",
  },
  {
    key: "classic",
    label: "Classic",
    description: "Traditional professional resume style",
  },
];

export default function ResumePreviewClient() {
  const { reportId } = Route.useParams();

  const [resumeData, setResumeData] = useState<Format3Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [reactPdf, setReactPdf] = useState<ReactPdfModule | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateKey>("ats");

  const containerRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });
  const startScroll = useRef({ left: 0, top: 0 });

  const PDF_BASE_WIDTH = 794;

  useEffect(() => {
    let mounted = true;

    import("react-pdf").then((mod) => {
      mod.pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${mod.pdfjs.version}/build/pdf.worker.min.mjs`;

      if (mounted) setReactPdf(mod);
    });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    let objectUrl: string | null = null;

    const generatePdf = async (data: Format3Data) => {
      try {
        const SelectedTemplate = TEMPLATE_MAP[selectedTemplate];
        const blob = await pdf(<SelectedTemplate data={data} />).toBlob();
        objectUrl = URL.createObjectURL(blob);

        if (!active) {
          URL.revokeObjectURL(objectUrl);
          return;
        }

        setPdfUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return objectUrl;
        });
      } catch (err) {
        console.error("Error generating PDF:", err);
      }
    };

    if (resumeData) generatePdf(resumeData);

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [resumeData, selectedTemplate]);

  useEffect(() => {
    (async () => {
      try {
        const data = await loadResumeFromDB(reportId);
        if (data) setResumeData(data);
      } catch (err) {
        console.error("Error loading resume:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [reportId]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();

      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom((prev) =>
        Math.min(3, Math.max(0.5, Math.round((prev + delta) * 100) / 100)),
      );
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (zoom <= 1 || !containerRef.current) return;

    setIsPanning(true);
    startPos.current = { x: e.clientX, y: e.clientY };
    startScroll.current = {
      left: containerRef.current.scrollLeft,
      top: containerRef.current.scrollTop,
    };

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPanning || !containerRef.current) return;

    containerRef.current.scrollLeft =
      startScroll.current.left - (e.clientX - startPos.current.x);
    containerRef.current.scrollTop =
      startScroll.current.top - (e.clientY - startPos.current.y);
  };

  const stopPan = () => setIsPanning(false);

  const handleDownload = () => {
    if (!pdfUrl) return;

    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `resume-${selectedTemplate}-${reportId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading || !reactPdf) {
    return (
      <div className="flex h-full w-full items-center justify-center text-gray-500">
        Loading preview...
      </div>
    );
  }

  if (!resumeData || !pdfUrl) {
    return (
      <div className="flex h-full w-full items-center justify-center text-red-500">
        No resume data found
      </div>
    );
  }

  const { Document, Page } = reactPdf;

  return (
    <div className="flex h-full w-full flex-col">
      <div className="border-b bg-white">
        <div className="flex items-center justify-between px-6 py-3">
          <h1 className="text-lg font-semibold">Resume Preview</h1>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
                disabled={zoom <= 0.5}
                className="rounded border px-2 py-1 text-sm hover:bg-gray-50 disabled:opacity-50"
              >
                −
              </button>

              <span className="min-w-[52px] text-center text-sm">
                {Math.round(zoom * 100)}%
              </span>

              <button
                onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
                disabled={zoom >= 3}
                className="rounded border px-2 py-1 text-sm hover:bg-gray-50 disabled:opacity-50"
              >
                +
              </button>

              <button
                onClick={() => setZoom(1)}
                className="rounded border px-2 py-1 text-sm hover:bg-gray-50"
              >
                Reset
              </button>
            </div>

            {numPages > 0 && (
              <div className="border-l pl-4 text-sm text-gray-600">
                {numPages} page{numPages > 1 ? "s" : ""}
              </div>
            )}

            <button
              onClick={handleDownload}
              disabled={!pdfUrl}
              className="rounded border px-4 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"
            >
              Download PDF
            </button>
          </div>
        </div>

        <div className="border-t px-6 py-4">
          <div className="mb-3">
            <h2 className="text-sm font-medium text-gray-900">
              Choose template
            </h2>
            <p className="text-xs text-gray-500">
              Select a template to update the preview
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {TEMPLATE_OPTIONS.map((template) => {
              const isSelected = selectedTemplate === template.key;

              return (
                <button
                  key={template.key}
                  type="button"
                  onClick={() => setSelectedTemplate(template.key)}
                  className={[
                    "rounded-lg border p-4 text-left transition-all",
                    "hover:border-gray-400 hover:bg-gray-50",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500",
                    isSelected
                      ? "border-blue-600 bg-blue-50 shadow-sm"
                      : "border-gray-200 bg-white",
                  ].join(" ")}
                >
                  <div className="mb-3 rounded border bg-gray-50 p-2">
                    <div className="mx-auto h-16 w-12 rounded-sm border bg-white shadow-sm">
                      <div className="p-1.5">
                        <div
                          className={`mb-1 h-1 rounded ${
                            template.key === "modern"
                              ? "bg-slate-700"
                              : "bg-gray-500"
                          }`}
                        />
                        <div className="mb-1 h-1 rounded bg-gray-300" />
                        <div className="mb-1 h-1 rounded bg-gray-300" />
                        {template.key === "ats" && (
                          <>
                            <div className="mb-1 h-1 rounded bg-gray-300" />
                            <div className="h-1 rounded bg-gray-300" />
                          </>
                        )}
                        {template.key === "modern" && (
                          <>
                            <div className="mb-1 h-2 w-3 rounded bg-teal-500" />
                            <div className="h-1 rounded bg-gray-300" />
                          </>
                        )}
                        {template.key === "classic" && (
                          <>
                            <div className="mx-auto mb-1 h-1 w-6 rounded bg-gray-500" />
                            <div className="mx-auto h-1 w-5 rounded bg-gray-300" />
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">
                      {template.label}
                    </span>

                    <span
                      className={[
                        "h-3 w-3 rounded-full border",
                        isSelected
                          ? "border-blue-600 bg-blue-600"
                          : "border-gray-300 bg-white",
                      ].join(" ")}
                    />
                  </div>

                  <p className="text-xs text-gray-600">
                    {template.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-auto bg-gray-100 select-none"
        style={{
          cursor: zoom > 1 ? (isPanning ? "grabbing" : "grab") : "default",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={stopPan}
        onPointerLeave={stopPan}
        onPointerCancel={stopPan}
      >
        <div className="flex justify-center p-8">
          <Document
            file={pdfUrl}
            onLoadSuccess={({ numPages }: { numPages: number }) => {
              setNumPages(numPages);
            }}
            loading={<div className="mt-8 text-gray-400">Loading PDF...</div>}
            error={<div className="mt-8 text-red-500">Failed to load PDF</div>}
          >
            {Array.from({ length: numPages }, (_, index) => (
              <div
                key={`page_${index + 1}`}
                className="mb-8 overflow-hidden rounded bg-white shadow-lg last:mb-0"
              >
                <Page
                  pageNumber={index + 1}
                  width={PDF_BASE_WIDTH * zoom}
                  renderTextLayer
                  renderAnnotationLayer
                />
              </div>
            ))}
          </Document>
        </div>
      </div>
    </div>
  );
}
