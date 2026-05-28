import { useEffect, useRef, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import type { ResumeData } from "#/types/resume/resume.types";

import { ATSTemplate } from "#/components/templates/ATSTemplate";
import { ModernTemplate } from "#/components/templates/ModernTemplate";
import { ClassicTemplate } from "#/components/templates/ClassicTemplate";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Icon } from "@iconify/react";
import TwoColumnTemplate from "#/components/templates/TwoColumnTemplate";
import { ATSAesthetic } from "#/components/templates/ATSAestheticTemplate";

type ReactPdfModule = typeof import("react-pdf");

const TEMPLATE_MAP = {
  ats: ATSTemplate,
  atsAesthetic: ATSAesthetic,
  modern: ModernTemplate,
  classic: ClassicTemplate, //OG
  twoColumn: TwoColumnTemplate,
} as const;

export type ResumePreviewTemplateKey = keyof typeof TEMPLATE_MAP;

interface ResumePreviewClientProps {
  data: ResumeData;
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
  // const [zoom, setZoom] = useState(0.6);
  const [zoom, setZoom] = useState(0.8);
  const [reactPdf, setReactPdf] = useState<ReactPdfModule | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);

  const PDF_BASE_WIDTH = 794;
  const PDF_BASE_HEIGHT = 1123;
  const CANVAS_PADDING_X = 32 * 2;
  const CANVAS_PADDING_Y = 32 * 2;
  const PAGE_GAP = 32;
  const TOOLBAR_HEIGHT = 0;

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
        if (objectUrl) URL.revokeObjectURL(objectUrl);
        if (active) setPdfUrl(null);
      } finally {
        if (active) setIsGenerating(false);
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

  const getFitWidthZoom = () => {
    const el = containerRef.current;
    if (!el) return 0.65;

    const availableWidth = el.clientWidth - CANVAS_PADDING_X;
    const nextZoom = availableWidth / PDF_BASE_WIDTH;

    return Math.min(3, Math.max(0.5, Math.round(nextZoom * 100) / 100));
  };

  const getFitPageZoom = () => {
    const el = containerRef.current;
    if (!el) return 0.65;

    const availableWidth = el.clientWidth - CANVAS_PADDING_X;
    const availableHeight =
      el.clientHeight - CANVAS_PADDING_Y - PAGE_GAP - TOOLBAR_HEIGHT;

    const widthZoom = availableWidth / PDF_BASE_WIDTH;
    const heightZoom = availableHeight / PDF_BASE_HEIGHT;
    const nextZoom = Math.min(widthZoom, heightZoom);

    return Math.min(3, Math.max(0.5, Math.round(nextZoom * 100) / 100));
  };

  const handleFitWidth = () => {
    setZoom(getFitWidthZoom());
  };

  const handleReset = () => {
    setZoom(getFitPageZoom());
  };

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
    <div className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden">
      <header className="relative w-full shrink-0 py-1 flex items-center justify-center ">
        <div className="h-auto flex items-center">
          <div className="h-full flex items-center gap-2 px-3">
            <button
              onClick={() => setZoom((z) => Math.max(0.5, z - 0.05))}
              disabled={zoom <= 0.5}
              className="rounded h-full flex items-center justify-center aspect-square border-black/10 group cursor-pointer disabled:cursor-not-allowed disabled:opacity-20"
            >
              <Icon
                icon="tabler:minus"
                className="text-xs text-text-primary group-hover:text-brand"
              />
            </button>

            <span className="w-12 text-center text-xxs text-brand font-medium  py-1 rounded-sm border border-black/5 bg-white">
              {Math.round(zoom * 100)}%
            </span>

            <button
              onClick={() => setZoom((z) => Math.min(3, z + 0.05))}
              disabled={zoom >= 3}
              className="rounded h-full flex items-center justify-center aspect-square border-black/10 cursor-pointer group disabled:cursor-not-allowed"
            >
              <Icon
                icon="tabler:plus"
                className="text-xs text-text-primary group-hover:text-brand"
              />
            </button>
          </div>

          <button
            onClick={handleFitWidth}
            className="h-full flex items-center px-3 py-1 border-x group border-black/20 gap-1 cursor-pointer"
          >
            <Icon
              icon="material-symbols:fit-width-rounded"
              className="text-xs text-text-primary group-hover:text-brand"
            />
          </button>

          <button
            onClick={handleReset}
            className="h-full flex items-center px-3 py-1 rounded-sm gap-1 group border-black/10 cursor-pointer"
          >
            <Icon
              icon="radix-icons:reset"
              className="text-xs text-text-primary group-hover:text-brand"
            />
            <span className="text-text-primary text-xs group-hover:text-brand">
              Reset
            </span>
          </button>
        </div>
        <button
          onClick={handleDownload}
          className="absolute right-0 h-[80%] bg-brand flex items-center px-2 mr-2 py-1 rounded-sm gap-1 group border border-black/5 cursor-pointer"
        >
          <Icon
            icon="mdi:download-outline"
            className="text-xs text-white group-hover:text-brand"
          />
          <span className="text-white text-xxs group-hover:text-brand">
            Download
          </span>
        </button>
      </header>

      <div
        ref={containerRef}
        className="flex-1 min-w-0 min-h-0 overflow-auto select-none custom-scrollbar p-8"
      >
        <div className="w-max min-w-full flex justify-center">
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
                className="mb-8 overflow-hidden last:mb-0 border rounded-none"
                style={{
                  boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                }}
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
//OG
