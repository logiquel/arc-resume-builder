import { useEffect, useRef, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import type { Format3Data } from "#/types/resume/resumeTypes";

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

export type ResumePreviewTemplateKey = keyof typeof TEMPLATE_MAP;

interface ResumePreviewClientProps {
  data: Format3Data;
  selectedTemplate: ResumePreviewTemplateKey;
  sessionId: string;
}

export default function ResumePreviewClient({
  data,
  selectedTemplate,
  sessionId,
}: ResumePreviewClientProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [reactPdf, setReactPdf] = useState<ReactPdfModule | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);

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

    const generatePdf = async () => {
      try {
        setIsGenerating(true);

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
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
        }
        if (active) {
          setPdfUrl(null);
        }
      } finally {
        if (active) {
          setIsGenerating(false);
        }
      }
    };

    generatePdf();

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [data, selectedTemplate]);

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
    link.download = `resume-${selectedTemplate}-${sessionId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!reactPdf) {
    return (
      <div className="flex h-full w-full items-center justify-center text-gray-500">
        Loading preview...
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="flex h-full w-full items-center justify-center text-gray-500">
        Generating preview...
      </div>
    );
  }

  if (!pdfUrl) {
    return (
      <div className="flex h-full w-full items-center justify-center text-red-500">
        Failed to generate preview
      </div>
    );
  }

  const { Document, Page } = reactPdf;

  return (
    <div className="flex h-full w-full flex-col">
      <div className="border-b bg-white">
        <div className="flex items-center justify-between px-6 py-3">
          <h1 className="text-lg font-semibold text-text-primary">
            Resume Preview
          </h1>

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
