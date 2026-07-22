// I Loved IMG - Created By Uniqrs Studio
"use client";

import React, { useState, useEffect, use, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import JSZip from "jszip";
import { motion } from "framer-motion";
import BarcodeComponent from "react-barcode";
import QRCode from "qrcode";
import { BLOG_ARTICLES } from "@/lib/blogArticles";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  FileText,
  FileSpreadsheet,
  FileImage,
  Image as ImageIcon,
  Trash2,
  ChevronUp,
  ChevronDown,
  Settings,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Plus,
  ExternalLink,
  Download,
  HelpCircle,
  BookOpen,
  Lock,
  Square,
  Circle,
  Triangle,
  Star,
  Maximize2,
  Printer,
  Layers,
  MapPin,
  Phone,
  Mail,
  Link as LinkIcon,
  AlignLeft,
  User,
  Wifi,
  MessageSquare,
  Globe,
  QrCode,
  Barcode,
  Paintbrush,
  Eraser,
  Brush,
  RotateCcw,
  Undo,
  Redo,
} from "lucide-react";

// Tool data map for titles/descriptions
const TOOL_INFO: { [key: string]: { name: string; description: string; accept: string; isMulti: boolean; noUpload?: boolean } } = {
  // PDF
  "merge-pdf": { name: "Merge PDF", description: "Combine multiple PDF files into one seamless document in any order.", accept: ".pdf", isMulti: true },
  "split-pdf": { name: "Split PDF", description: "Extract page ranges or separate all pages into individual files.", accept: ".pdf", isMulti: false },
  "compress-pdf": { name: "Compress PDF", description: "Reduce PDF file size while maintaining maximum quality.", accept: ".pdf", isMulti: false },
  "pdf-to-word": { name: "PDF to Word", description: "Convert PDF documents to editable Word (.docx) files locally.", accept: ".pdf", isMulti: false },
  "pdf-to-ppt": { name: "PDF to PowerPoint", description: "Transform PDF pages into editable PowerPoint (.pptx) presentation slides.", accept: ".pdf", isMulti: false },
  "pdf-to-excel": { name: "PDF to Excel", description: "Extract tables and tabular data from PDF into Excel (.xlsx) spreadsheets.", accept: ".pdf", isMulti: false },
  "word-to-pdf": { name: "Word to PDF", description: "Convert Word documents (.docx) to professional PDF format instantly.", accept: ".docx,.doc", isMulti: false },
  "ppt-to-pdf": { name: "PowerPoint to PDF", description: "Convert PowerPoint presentations (.pptx) to PDF with one click.", accept: ".pptx,.ppt", isMulti: false },
  "excel-to-pdf": { name: "Excel to PDF", description: "Export Excel spreadsheets (.xlsx) directly to PDF documents.", accept: ".xlsx,.xls", isMulti: false },
  "pdf-to-jpg": { name: "PDF to JPG", description: "Convert PDF pages into high-quality JPG images.", accept: ".pdf", isMulti: false },
  "jpg-to-pdf": { name: "JPG to PDF", description: "Convert and combine JPG/PNG images into a single PDF document.", accept: "image/*", isMulti: true },
  "unlock-pdf": { name: "Unlock PDF", description: "Remove password protection and restriction locks from PDF files.", accept: ".pdf", isMulti: false },
  "protect-pdf": { name: "Protect PDF", description: "Encrypt and secure your PDF documents with a strong password.", accept: ".pdf", isMulti: false },
  "organise-pdf": { name: "Organize PDF", description: "Reorder, delete, and rearrange PDF pages in one place.", accept: ".pdf", isMulti: false },

  // Image
  "compress-image": { name: "Compress Image", description: "Reduce image file size of JPG/PNG/WEBP without losing visible quality.", accept: "image/*", isMulti: true },
  "resize-image": { name: "Resize Image", description: "Resize images to custom width/height dimensions with aspect ratio lock.", accept: "image/*", isMulti: false },
  "crop-image": { name: "Crop Image", description: "Crop images to any width, height, and starting coordinates.", accept: "image/*", isMulti: false },
  "convert-to-jpg": { name: "Convert to JPG", description: "Convert PNG, WEBP, BMP, or GIF images to standard JPG format.", accept: "image/*", isMulti: true },
  "convert-from-jpg": { name: "Convert From JPG", description: "Convert JPG images to PNG, WEBP, BMP, or GIF format.", accept: "image/*", isMulti: true },
  "upscale-image": { name: "Upscale Image", description: "Upscale images by 2x or 4x size using high-quality local interpolation.", accept: "image/*", isMulti: true },
  "remove-bg": { name: "Remove Background", description: "Remove image background clean cutout using AI model.", accept: "image/*", isMulti: true },
  "watermark-image": { name: "Watermark Image", description: "Overlay custom text or an image watermark onto your photo.", accept: "image/*", isMulti: true },
  "rotate-image": { name: "Rotate Image", description: "Rotate images clockwise/counter-clockwise or flip them.", accept: "image/*", isMulti: false },
  "html-to-image": { name: "HTML to Image", description: "Upload your HTML file (.html, .htm) and convert it into a high-quality PNG image.", accept: ".html,.htm,text/html", isMulti: false, noUpload: false },
  "blur-face": { name: "Blur Face Tool", description: "Detect and blur faces in images locally and securely.", accept: "image/*", isMulti: true },
  "batch-barcode": { name: "Batch Barcode Generator", description: "Generate and print barcode labels in a grid with advanced customization.", accept: "", isMulti: false, noUpload: true },
  "custom-barcode": { name: "Barcode Layout Creator", description: "Wizard to initialize and design custom templates for labels & barcodes.", accept: "", isMulti: false, noUpload: true },
  "custom-invoice": { name: "Invoice Layout Creator", description: "Wizard to initialize and design custom print invoice templates.", accept: "", isMulti: false, noUpload: true },
  "barcode-creator": { name: "Barcode Creator", description: "Design custom barcodes in Code 128, QR, UPC, and more.", accept: "", isMulti: false, noUpload: true },
  "ean-generator": { name: "EAN Generator", description: "Create valid EAN-8 and EAN-13 barcodes for retail products.", accept: "", isMulti: false, noUpload: true },
  "qr-creator": { name: "QR Code Creator", description: "Generate scannable QR codes for URLs, text, or contact cards.", accept: "", isMulti: false, noUpload: true },
};

// Helper to extract page count from PDF binary buffer
const getPdfPageCount = async (file: File): Promise<number> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const arr = new Uint8Array(e.target?.result as ArrayBuffer);
        const maxSearchLen = Math.min(arr.length, 120000);
        const decoder = new TextDecoder("ascii");
        
        // Decode slice from start and end of file where metadata usually resides
        const startSample = decoder.decode(arr.slice(0, maxSearchLen));
        const endSample = decoder.decode(arr.slice(Math.max(0, arr.length - 30000)));
        const sample = startSample + "\n" + endSample;
        
        // Try matching /Count N
        const countMatches = sample.match(/\/Count\s+(\d+)/g);
        if (countMatches && countMatches.length > 0) {
          // Get the last count or the largest count digit
          let maxCount = 1;
          for (const match of countMatches) {
            const val = parseInt(match.replace(/\/Count\s+/, ""), 10);
            if (!isNaN(val) && val > maxCount) {
              maxCount = val;
            }
          }
          resolve(maxCount);
          return;
        }
        
        // Fallback count /Type /Page
        const pageMatches = sample.match(/\/Type\s*\/Page\b/g);
        if (pageMatches) {
          resolve(pageMatches.length);
        } else {
          resolve(1);
        }
      } catch (err) {
        console.error("Error reading PDF pages binary:", err);
        resolve(1);
      }
    };
    reader.onerror = () => resolve(1);
    reader.readAsArrayBuffer(file);
  });
};

// Helper to check if a page index falls in comma/dash ranges string
const isPageInRange = (pageNum: number, rangeStr: string): boolean => {
  if (!rangeStr.trim()) return false;
  try {
    const parts = rangeStr.split(",");
    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      if (trimmed.includes("-")) {
        const [startStr, endStr] = trimmed.split("-");
        const start = parseInt(startStr.trim(), 10);
        const end = parseInt(endStr.trim(), 10);
        if (!isNaN(start) && !isNaN(end) && pageNum >= start && pageNum <= end) {
          return true;
        }
      } else {
        const singleVal = parseInt(trimmed, 10);
        if (!isNaN(singleVal) && pageNum === singleVal) {
          return true;
        }
      }
    }
  } catch (e) {}
  return false;
};

// Client-side PDF Thumbnail renderer component using window.pdfjsLib
function PdfThumbnail({ file }: { file: File }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    let active = true;
    const render = async () => {
      // Poll dynamically up to 10 seconds for window.pdfjsLib to load
      for (let i = 0; i < 50; i++) {
        if ((window as any).pdfjsLib) break;
        await new Promise((r) => setTimeout(r, 200));
      }
      const pdfjsLib = (window as any).pdfjsLib;
      if (!pdfjsLib || !canvasRef.current || !active) return;

      try {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        
        if (pdf.numPages < 1) {
          if (active) {
            setLoading(false);
            setIsLocked(true);
          }
          return;
        }

        const page = await pdf.getPage(1);
        
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        if (!context || !active) return;
        
        const unscaledViewport = page.getViewport({ scale: 1.0 });
        const scale = Math.min(180 / unscaledViewport.width, 240 / unscaledViewport.height);
        const viewport = page.getViewport({ scale });
        
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };
        await page.render(renderContext).promise;
        if (active) setLoading(false);
      } catch (e: any) {
        console.warn("Expected encryption or loading status warning for PDF thumbnail:", e.message || e);
        if (active) {
          setLoading(false);
          if (e.name === "PasswordException" || e.message?.includes("password") || e.message?.includes("Password")) {
            setIsLocked(true);
          }
        }
      }
    };
    render();
    return () => {
      active = false;
    };
  }, [file]);

  return (
    <div className="w-full h-full flex items-center justify-center relative overflow-hidden bg-slate-50 rounded-xl min-h-[140px]">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100/50">
          <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
        </div>
      )}
      {isLocked ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 text-slate-400 gap-1.5 p-3 text-center">
          <div className="w-9 h-9 rounded-2xl bg-orange-50 border border-orange-100/30 flex items-center justify-center">
            <Lock className="w-4 h-4 text-orange-500 animate-pulse" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600">Protected PDF</span>
          <span className="text-[8px] text-slate-400 font-semibold">Decryption Required</span>
        </div>
      ) : (
        <canvas ref={canvasRef} className="max-w-full max-h-full object-contain rounded-lg shadow-sm" />
      )}
    </div>
  );
}

// Client-side PDF page specific renderer
function PdfPageThumbnail({ file, pageNum }: { file: File; pageNum: number }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [isInvalidPage, setIsInvalidPage] = useState(false);

  useEffect(() => {
    let active = true;
    const render = async () => {
      for (let i = 0; i < 50; i++) {
        if ((window as any).pdfjsLib) break;
        await new Promise((r) => setTimeout(r, 200));
      }
      const pdfjsLib = (window as any).pdfjsLib;
      if (!pdfjsLib || !canvasRef.current || !active) return;

      try {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        
        if (pageNum < 1 || pageNum > pdf.numPages) {
          if (active) {
            setLoading(false);
            setIsInvalidPage(true);
          }
          return;
        }

        const page = await pdf.getPage(pageNum);
        
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        if (!context || !active) return;
        
        const unscaledViewport = page.getViewport({ scale: 1.0 });
        const scale = Math.min(100 / unscaledViewport.width, 130 / unscaledViewport.height);
        const viewport = page.getViewport({ scale });
        
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };
        await page.render(renderContext).promise;
        if (active) setLoading(false);
      } catch (e: any) {
        console.warn("Expected encryption or page range warning for PDF page thumbnail:", e.message || e);
        if (active) {
          setLoading(false);
          if (e.name === "PasswordException" || e.message?.includes("password") || e.message?.includes("Password")) {
            setIsLocked(true);
          }
        }
      }
    };
    render();
    return () => {
      active = false;
    };
  }, [file, pageNum]);

  return (
    <div className="w-full h-full flex items-center justify-center relative overflow-hidden bg-slate-50 rounded-xl min-h-[90px]">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100/50">
          <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
        </div>
      )}
      {isLocked ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 text-slate-400 gap-1 p-2 text-center">
          <Lock className="w-4.5 h-4.5 text-slate-400 animate-pulse" />
          <span className="text-[8px] font-black uppercase tracking-wider text-slate-500 leading-tight">Locked Page</span>
        </div>
      ) : isInvalidPage ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 text-slate-400 gap-1.5 p-2 text-center">
          <FileText className="w-4.5 h-4.5 text-slate-300" />
          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wide">Empty Page</span>
        </div>
      ) : (
        <canvas ref={canvasRef} className="max-w-full max-h-full object-contain rounded-md shadow-sm" />
      )}
    </div>
  );
}

class BarcodeErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: (error: string) => React.ReactNode },
  { hasError: boolean; errorMessage: string }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("Caught barcode render error:", error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback(this.state.errorMessage);
    }
    return this.props.children;
  }
}

export default function ToolDetailPage({ params }: { params: Promise<{ category: string; tool: string }> }) {
  const router = useRouter();
  const { category, tool } = use(params);

  useEffect(() => {
    if (tool === "remove-bg") {
      window.location.replace("https://www.removebg.co.in/");
    }
  }, [tool]);

  const info = TOOL_INFO[tool];

  if (!info) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Tool Not Found</h2>
        <p className="text-slate-500 font-medium text-sm">The requested tool standard does not exist or has been moved.</p>
        <Button onClick={() => router.push("/")} className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl">
          Return to Homepage
        </Button>
      </div>
    );
  }

  const isMergePdf = tool === "merge-pdf";
  const isCleanFlow = category === "pdf" || tool === "resize-image";

  const calculateExpDate = (mfg: string, period: string): string => {
    if (!mfg) return "";
    const parts = mfg.split("-");
    let month = 0;
    let year = 0;
    if (parts.length === 2) {
      if (parts[0].length === 2) {
        month = parseInt(parts[0], 10) - 1;
        year = parseInt(parts[1], 10);
      } else {
        year = parseInt(parts[0], 10);
        month = parseInt(parts[1], 10) - 1;
      }
    } else {
      const d = new Date(mfg);
      if (isNaN(d.getTime())) return "";
      month = d.getMonth();
      year = d.getFullYear();
    }
    const date = new Date(year, month, 1);
    if (period.includes("6 Month")) {
      date.setMonth(date.getMonth() + 6);
    } else if (period.includes("1 Year") || period.includes("12 Month")) {
      date.setFullYear(date.getFullYear() + 1);
    } else if (period.includes("2 Year") || period.includes("24 Month")) {
      date.setFullYear(date.getFullYear() + 2);
    } else if (period.includes("3 Year")) {
      date.setFullYear(date.getFullYear() + 3);
    } else if (period.includes("5 Year")) {
      date.setFullYear(date.getFullYear() + 5);
    } else {
      return period;
    }
    const mStr = String(date.getMonth() + 1).padStart(2, '0');
    return `${mStr}-${date.getFullYear()}`;
  };

  const renderBatchElement = (el: any, elements: any[]) => {
    if (!el.visible) return null;
    const children = elements.filter(child => child.parentId === el.id);

    const getDynamicText = (content: string = "") => {
      const calculatedExp = mfgDate && expPeriod !== "No Expiry" ? calculateExpDate(mfgDate, expPeriod) : (expPeriod || "");
      const activeName = productName.trim() || `${skuId} ${variant}`.trim() || "BATCH PRODUCT NAME";
      return content
        .replace("{name}", activeName)
        .replace("{brand}", businessProfile.brandName || "UPANISHAD")
        .replace("{brandName}", businessProfile.brandName || "UPANISHAD")
        .replace("{mrp}", price ? `RS ${price}` : "RS 0.00")
        .replace("{qty}", variant || "")
        .replace("{mfgDate}", mfgDate || "")
        .replace("{expDate}", calculatedExp)
        .replace("{origin}", origin || "India")
        .replace("{roNumber}", batchNo || "")
        .replace("{quantity}", variant || "");
    };

    const style: React.CSSProperties = {
      boxSizing: "border-box",
      width: el.width || "auto",
      height: el.height || "auto",
      transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
      paddingTop: `${el.paddingTop || 0}px`,
      paddingRight: `${el.paddingRight || 0}px`,
      paddingBottom: `${el.paddingBottom || 0}px`,
      paddingLeft: `${el.paddingLeft || 0}px`,
      marginTop: `${el.marginTop || 0}px`,
      marginRight: `${el.marginRight || 0}px`,
      marginBottom: `${el.marginBottom || 0}px`,
      marginLeft: `${el.marginLeft || 0}px`,
      position: "relative"
    };

    if (el.borderWidth) {
      style.borderWidth = `${el.borderWidth}px`;
      style.borderStyle = el.borderStyle || "solid";
      style.borderRadius = `${el.borderRadius || 0}px`;
      style.borderColor = "black";
    }

    if (el.type === "linear-h" || el.type === "linear-v") {
      const isRow = el.type === "linear-h";
      return (
        <div
          key={el.id}
          className={`flex ${isRow ? "flex-row" : "flex-col"} leading-none`}
          style={{
            ...style,
            alignItems: el.alignItems === "start" ? "flex-start" : el.alignItems === "end" ? "flex-end" : el.alignItems === "stretch" ? "stretch" : "center",
            justifyContent: el.justifyContent === "start" ? "flex-start" : el.justifyContent === "end" ? "flex-end" : el.justifyContent === "between" ? "space-between" : el.justifyContent === "around" ? "space-around" : "center"
          }}
        >
          {children.map(child => renderBatchElement(child, elements))}
        </div>
      );
    }

    if (el.type === "text") {
      return (
        <div
          key={el.id}
          className="flex items-center min-w-0"
          style={{
            ...style,
            fontFamily: el.fontFamily === "mono" ? "'Courier New', Courier, monospace" : el.fontFamily === "serif" ? "Georgia, serif" : "inherit",
            fontWeight: el.bold ? "bold" : "normal",
            fontStyle: el.italic ? "italic" : "normal",
            fontSize: `${el.fontSize || 12}px`,
            textAlign: el.textAlign || "left",
            justifyContent: el.textAlign === "center" ? "center" : el.textAlign === "right" ? "flex-end" : "flex-start",
            lineHeight: "tight"
          }}
        >
          <span className="uppercase truncate max-w-full font-bold">
            {getDynamicText(el.content)}
          </span>
        </div>
      );
    }

    if (el.type === "logo") {
      const logoSrc = businessProfile.brandLogoWide || businessProfile.brandLogo || barcodeSettings.logo;
      return (
        <div
          key={el.id}
          className="flex items-center justify-center overflow-hidden"
          style={style}
        >
          {logoSrc ? (
            <img src={logoSrc} className="w-full h-full object-contain pointer-events-none" alt="Brand Logo" />
          ) : (
            <span className="text-[8px] text-slate-400 uppercase font-black text-center p-1 border border-dashed border-slate-350 bg-slate-50 w-full select-none pointer-events-none">
              {businessProfile.brandName || "Logo"}
            </span>
          )}
        </div>
      );
    }

    if (el.type === "barcode") {
      const barWidth = el.barcodeBarWidth || 1.1;
      const barHeight = el.barcodeHeight || 25;
      const codeVal = eanCode || "12345678";
      
      const fontOptions = [
        el.bold ? "bold" : "",
        el.italic ? "italic" : ""
      ].filter(Boolean).join(" ");

      const barcodeFont = el.fontFamily === "mono" 
        ? "monospace" 
        : el.fontFamily === "serif" 
          ? "Georgia" 
          : "sans-serif";

      return (
        <div
          key={el.id}
          className="flex items-center justify-center overflow-hidden shrink-0"
          style={style}
        >
          <div className="scale-95 flex items-center justify-center select-none pointer-events-none">
            <BarcodeErrorBoundary
              key={`${codeVal}_${barcodeFormat}_${barWidth}_${barHeight}`}
              fallback={(errorMsg) => (
                <div className="text-[6px] text-rose-500 font-bold p-1 text-center border border-rose-100 rounded-sm">
                  {errorMsg}
                </div>
              )}
            >
              <BarcodeComponent
                value={codeVal}
                format={(barcodeFormat as any) || "CODE128"}
                width={barWidth}
                height={barHeight}
                fontSize={el.fontSize || 8}
                font={barcodeFont}
                fontOptions={fontOptions}
                margin={0}
                displayValue={true}
              />
            </BarcodeErrorBoundary>
          </div>
        </div>
      );
    }

    if (el.type === "line-h") {
      return (
        <div
          key={el.id}
          className="flex items-center w-full shrink-0"
          style={{ ...style, height: `${el.borderWidth || 1}px` }}
        >
          <div
            className="w-full"
            style={{
              borderTopWidth: `${el.borderWidth || 1}px`,
              borderTopStyle: el.borderStyle || "solid",
              borderTopColor: "black"
            }}
          />
        </div>
      );
    }

    if (el.type === "line-v") {
      return (
        <div
          key={el.id}
          className="flex justify-center h-full shrink-0"
          style={{ ...style, width: `${el.borderWidth || 1}px` }}
        >
          <div
            className="h-full"
            style={{
              borderLeftWidth: `${el.borderWidth || 1}px`,
              borderLeftStyle: el.borderStyle || "solid",
              borderLeftColor: "black"
            }}
          />
        </div>
      );
    }

    return null;
  };

  const renderUpanishadLayout = () => {
    const calculatedExp = mfgDate && expPeriod !== "No Expiry" ? calculateExpDate(mfgDate, expPeriod) : (expPeriod || "");
    const activeName = productName.trim() || `${skuId} ${variant}`.trim() || "BATCH PRODUCT NAME";
    const logoSrc = businessProfile.brandLogoWide || businessProfile.brandLogo || barcodeSettings.logo;
    
    return (
      <div className="h-full flex flex-col justify-between text-black leading-none select-none">
        {/* Logo & Barcode */}
        <div className="h-[33.33%] flex justify-between items-center overflow-hidden pb-1">
          <div className="h-full flex items-center pr-2 max-w-[45%]">
            {logoSrc ? (
              <img src={logoSrc} className="max-h-full w-auto object-contain" alt="Logo" />
            ) : (
              <div className="font-black text-lg tracking-tighter uppercase">{businessProfile.brandName || "UPANISHAD"}</div>
            )}
          </div>
          <div className="h-full flex flex-col justify-center items-end scale-90 origin-right">
            <BarcodeErrorBoundary
              key={`${eanCode}_${barcodeFormat}_${barcodeWidth}_${barcodeHeight}`}
              fallback={(errorMsg) => (
                <div className="text-[6px] text-rose-500 font-bold p-1 text-center">
                  Invalid code
                </div>
              )}
            >
              <BarcodeComponent 
                value={eanCode || "12345678"} 
                format={(barcodeFormat as any) || "CODE128"} 
                width={barcodeWidth} 
                height={barcodeHeight} 
                displayValue={true} 
                fontSize={11} 
                margin={0} 
                font="monospace" 
              />
            </BarcodeErrorBoundary>
          </div>
        </div>
        <div className="border-t-[1.5px] border-black" />
        {/* Name, MRP, MFG */}
        <div className="h-[33.33%] flex flex-col justify-center py-1 overflow-hidden px-1">
          <div className="flex gap-2 items-start">
            <div className="w-1.5 h-1.5 rounded-full bg-black mt-1 shrink-0" />
            <h3 className="text-[10px] font-black uppercase leading-tight line-clamp-2 tracking-tight">{activeName}</h3>
          </div>
          <div className="flex gap-2 items-center mt-1">
            <div className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
            <div className="flex items-center gap-1.5 overflow-hidden">
              <p className="text-[10px] font-black whitespace-nowrap">M.R.P.: {price || "0.00"}/-</p>
              <span className="text-[7px] font-medium opacity-70">(Incl. Taxes)</span>
              {mfgDate && (
                <>
                  <div className="h-3 w-[1.5px] bg-black mx-1" />
                  <p className="text-[10px] font-black whitespace-nowrap">Mfg: {mfgDate}</p>
                </>
              )}
              {calculatedExp && (
                <>
                  <div className="h-3 w-[1.5px] bg-black mx-1" />
                  <p className="text-[10px] font-black whitespace-nowrap">Exp: {calculatedExp}</p>
                </>
              )}
              {batchNo && (
                <>
                  <div className="h-3 w-[1.5px] bg-black mx-1" />
                  <p className="text-[10px] font-black whitespace-nowrap">Batch: {batchNo}</p>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="border-t-[1.5px] border-black" />
        {/* Footer */}
        <div className="h-[33.33%] grid grid-cols-2 pt-1 overflow-hidden font-sans">
          {barcodeSettings.marketedBy || businessProfile.businessAddress ? (
            <div className="border-r-[1.5px] border-black pr-2 flex flex-col w-full">
              <p className="text-[7px] font-black uppercase text-center border-b border-dashed border-black mb-0.5 leading-none pb-0.5">Marketed / Mfg By</p>
              <div className="flex gap-1 items-start mt-0.5">
                <MapPin className="w-2 h-2 shrink-0 mt-0.5" />
                <p className="text-[7px] font-bold leading-[1] line-clamp-3">{barcodeSettings.marketedBy || businessProfile.businessAddress}</p>
              </div>
            </div>
          ) : (
            <div className="border-r-[1.5px] border-black pr-2 flex flex-col w-full justify-center">
              <p className="text-[7px] font-bold text-center italic text-slate-400">No Address</p>
            </div>
          )}
          {((businessProfile.customerCareMobile || barcodeSettings.customerCareMobile) || (businessProfile.customerCareEmail || barcodeSettings.customerCareEmail)) ? (
            <div className="pl-2 flex flex-col w-full">
              <p className="text-[7px] font-black uppercase text-center border-b border-dashed border-black mb-0.5 leading-none pb-0.5">Customer Care</p>
              <div className="space-y-0.5 mt-0.5">
                {(businessProfile.customerCareMobile || barcodeSettings.customerCareMobile) && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-2 h-2 shrink-0 text-green-650" />
                    <p className="text-[7px] font-bold truncate">Mob: {businessProfile.customerCareMobile || barcodeSettings.customerCareMobile}</p>
                  </div>
                )}
                {(businessProfile.customerCareEmail || barcodeSettings.customerCareEmail) && (
                  <div className="flex items-center gap-1">
                    <Mail className="w-2 h-2 shrink-0" />
                    <p className="text-[7px] font-bold truncate">Email: {businessProfile.customerCareEmail || barcodeSettings.customerCareEmail}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="pl-2 flex flex-col w-full justify-center">
              <p className="text-[7px] font-bold text-center italic text-slate-400">No Contact</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderBlinkitLayout = () => {
    const calculatedExp = mfgDate && expPeriod !== "No Expiry" ? calculateExpDate(mfgDate, expPeriod) : (expPeriod || "");
    const activeName = productName.trim() || `${skuId} ${variant}`.trim() || "BATCH PRODUCT NAME";
    const logoSrc = businessProfile.brandLogoWide || businessProfile.brandLogo || barcodeSettings.logo;

    return (
      <div className="h-full flex flex-col justify-between text-black font-sans leading-none select-none">
        {/* Header */}
        <div className="flex flex-col items-center justify-center py-1">
          {logoSrc ? (
            <img src={logoSrc} className="max-h-12 w-auto object-contain" alt="Brand Logo" />
          ) : (
            <div className="text-2xl font-black tracking-widest uppercase">{businessProfile.brandName || "UPANISHAD"}</div>
          )}
          <div className="text-[10px] tracking-[0.3em] font-extrabold text-slate-800 uppercase mt-1">— BRAND —</div>
        </div>
        <div className="border-t-[1.5px] border-black my-1" />
        {/* Product Name */}
        <div className="text-xs leading-normal py-1 px-1">
          <span className="font-extrabold uppercase text-slate-900">Product Name:</span> <span className="font-black uppercase text-slate-900 text-sm tracking-tight">{activeName}</span>
        </div>
        <div className="border-t-[1.5px] border-black my-1" />
        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-x-6 text-[10px] py-1 px-1 font-medium leading-normal text-slate-850">
          <div className="space-y-1">
            <div><span className="font-extrabold">Brand:</span> {businessProfile.brandName || "Upanishad"}</div>
            {variant && <div><span className="font-extrabold">Qty:</span> {variant}</div>}
            {mfgDate && <div><span className="font-extrabold">Mfg Date:</span> {mfgDate}</div>}
            {calculatedExp && <div><span className="font-extrabold">Exp Date:</span> {calculatedExp}</div>}
          </div>
          <div className="space-y-1">
            {variant && <div><span className="font-extrabold">Variant:</span> {variant}</div>}
            <div><span className="font-extrabold">Country of Origin:</span> {origin || "India"}</div>
            {batchNo && <div><span className="font-extrabold">Batch:</span> {batchNo}</div>}
            <div className="whitespace-nowrap">
              <span className="font-extrabold">MRP:</span> <span className="font-black text-xs">{price || "0.00"}</span> <span className="text-[7.5px] font-normal tracking-tighter">(Incl. of all taxes)</span>
            </div>
          </div>
        </div>
        <div className="border-t-[1.5px] border-black my-1" />
        {/* Manufactured By */}
        {businessProfile.marketedManufacturedBy && (
          <>
            <div className="text-[10px] leading-tight px-1 text-slate-850">
              <span className="font-extrabold">Manufactured by:</span> {businessProfile.marketedManufacturedBy}
            </div>
            <div className="border-t-[1.5px] border-black my-1" />
          </>
        )}
        {/* Marketed By */}
        {(barcodeSettings.marketedBy || businessProfile.businessAddress) && (
          <>
            <div className="text-[10px] leading-tight px-1 text-slate-850">
              <span className="font-extrabold">Marketed by:</span> {barcodeSettings.marketedBy || businessProfile.businessAddress}
            </div>
            <div className="border-t-[1.5px] border-black my-1" />
          </>
        )}
        {/* Footer */}
        <div className="flex justify-between items-center py-1 px-1">
          <div className="space-y-1 text-[8.5px] text-slate-850 leading-none">
            {(businessProfile.customerCareMobile || barcodeSettings.customerCareMobile) && (
              <div><span className="font-extrabold">Customer Care:</span> {businessProfile.customerCareMobile || barcodeSettings.customerCareMobile}</div>
            )}
            {(businessProfile.customerCareEmail || barcodeSettings.customerCareEmail) && (
              <div><span className="font-extrabold">Email:</span> {businessProfile.customerCareEmail || barcodeSettings.customerCareEmail}</div>
            )}
          </div>
          <div className="flex flex-col items-end scale-[1.05] origin-right shrink-0 mr-1">
            <BarcodeErrorBoundary
              key={`${eanCode}_${barcodeFormat}_${barcodeWidth}_${barcodeHeight}`}
              fallback={(errorMsg) => (
                <div className="text-[6px] text-rose-500 font-bold p-1 text-center">
                  Invalid code
                </div>
              )}
            >
              <BarcodeComponent 
                value={eanCode || "12345678"} 
                format={(barcodeFormat as any) || "CODE128"} 
                width={barcodeWidth} 
                height={barcodeHeight} 
                displayValue={true} 
                fontSize={9} 
                margin={0} 
                font="monospace" 
              />
            </BarcodeErrorBoundary>
          </div>
        </div>
      </div>
    );
  };

  const renderSelectedLayout = () => {
    const customFmt = customFormats.find(f => f.id === labelFormat);
    if (customFmt) {
      return (
        <div className="relative w-full h-full text-black select-none leading-none">
          {customFmt.elements.filter((el: any) => el.parentId === null).map((rootEl: any) => (
            renderBatchElement(rootEl, customFmt.elements)
          ))}
        </div>
      );
    }
    if (labelFormat === 'blinkit') {
      return renderBlinkitLayout();
    }
    return renderUpanishadLayout();
  };

  // Split PDF state variables
  const [splitTab, setSplitTab] = useState<"range" | "page">("range");
  const [pageOption, setPageOption] = useState<"all" | "select">("all");
  const [processedSize, setProcessedSize] = useState<number | null>(null);

  // File states
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [pdfPageCount, setPdfPageCount] = useState<number>(1);

  const [pdfjsLoaded, setPdfjsLoaded] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [fileMetadata, setFileMetadata] = useState<{ [key: string]: { pages?: number; width?: number; height?: number } }>({});
  const [mergedFile, setMergedFile] = useState<File | null>(null);

  // Right panel resizable states
  const [rightPanelWidth, setRightPanelWidth] = useState(380);
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = React.useRef({ startWidth: 380, startX: 0 });

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    resizeRef.current = {
      startWidth: rightPanelWidth,
      startX: e.clientX,
    };
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const deltaX = e.clientX - resizeRef.current.startX;
      const newWidth = resizeRef.current.startWidth - deltaX;
      if (newWidth >= 280 && newWidth <= 650) {
        setRightPanelWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  // Load PDF.js dynamically
  useEffect(() => {
    if (typeof window === "undefined") return;
    if ((window as any).pdfjsLib) {
      setPdfjsLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.onload = () => {
      (window as any).pdfjsLib = (window as any)["pdfjs-dist/build/pdf"];
      (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      setPdfjsLoaded(true);
    };
    document.head.appendChild(script);
  }, []);

  // Sync selections when uploadedFiles size changes
  useEffect(() => {
    setSelectedIndices(uploadedFiles.map((_, i) => i));
  }, [uploadedFiles]);

  // Load file metadata helper
  const loadFileMetadata = async (file: File) => {
    const key = `${file.name}-${file.size}-${file.lastModified}`;
    if (fileMetadata[key]) return;

    const meta: { pages?: number; width?: number; height?: number } = {};
    const nameLower = file.name.toLowerCase();

    if (nameLower.endsWith(".pdf")) {
      const pages = await getPdfPageCount(file);
      meta.pages = pages;
    } else if (file.type.startsWith("image/") || /\.(jpe?g|png|webp|gif|bmp|svg)$/i.test(file.name)) {
      try {
        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = () => {
            meta.width = img.naturalWidth;
            meta.height = img.naturalHeight;
            resolve(null);
          };
          img.onerror = () => reject();
          img.src = URL.createObjectURL(file);
        });
      } catch (e) {}
    }

    setFileMetadata((prev) => ({
      ...prev,
      [key]: meta,
    }));
  };

  useEffect(() => {
    uploadedFiles.forEach((file) => {
      loadFileMetadata(file);
    });
  }, [uploadedFiles]);

  const toggleSelect = (idx: number) => {
    setSelectedIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedIndices.length === uploadedFiles.length) {
      setSelectedIndices([]);
    } else {
      setSelectedIndices(uploadedFiles.map((_, i) => i));
    }
  };

  const swapFiles = (fromIdx: number | null, toIdx: number) => {
    if (fromIdx === null || fromIdx === toIdx) return;
    
    // Save current file order
    const filesCopy = [...uploadedFiles];
    
    setUploadedFiles((prev) => {
      const updated = [...prev];
      const [movedItem] = updated.splice(fromIdx, 1);
      updated.splice(toIdx, 0, movedItem);
      return updated;
    });

    setBulkResults((prev) => {
      const newResults: { [key: number]: any } = {};
      const indexArr = Array.from({ length: filesCopy.length }, (_, i) => i);
      const [movedIdx] = indexArr.splice(fromIdx, 1);
      indexArr.splice(toIdx, 0, movedIdx);
      
      indexArr.forEach((oldIdx, newIdx) => {
        if (prev[oldIdx]) {
          newResults[newIdx] = prev[oldIdx];
        }
      });
      return newResults;
    });

    setSelectedIndices((prev) => {
      const indexArr = Array.from({ length: filesCopy.length }, (_, i) => i);
      const [movedIdx] = indexArr.splice(fromIdx, 1);
      indexArr.splice(toIdx, 0, movedIdx);
      
      const newSelected: number[] = [];
      indexArr.forEach((oldIdx, newIdx) => {
        if (prev.includes(oldIdx)) {
          newSelected.push(newIdx);
        }
      });
      return newSelected;
    });
  };

  useEffect(() => {
    const urls = uploadedFiles.map((file) => {
      const isImg = file.type.startsWith("image/") || 
                    file.type === "image/jpeg" || 
                    file.type === "image/png" || 
                    file.type === "image/webp" ||
                    /\.(jpe?g|png|webp|gif|bmp|svg)$/i.test(file.name);
      const isHtml = file.type === "text/html" ||
                     /\.(html?)$/i.test(file.name);
      if (isImg || isHtml) {
        try {
          return URL.createObjectURL(file);
        } catch (e) {
          return "";
        }
      }
      return "";
    });
    setPreviewUrls(urls);

    return () => {
      urls.forEach((url) => {
        if (url) {
          try {
            URL.revokeObjectURL(url);
          } catch (e) {}
        }
      });
    };
  }, [uploadedFiles]);

  // Settings states
  const [splitMode, setSplitMode] = useState("extract_range");
  const [ranges, setRanges] = useState("1");
  const [compressionLevel, setCompressionLevel] = useState("medium");
  const [password, setPassword] = useState("");
  const [orderStr, setOrderStr] = useState("");
  
  // Custom functions to move/delete/append pages in sequence for Organize PDF
  const swapPages = (fromIdx: number, toIdx: number) => {
    const seq = orderStr.trim() 
      ? orderStr.split(",").map(x => x.trim()).filter(Boolean)
      : Array.from({ length: pdfPageCount }, (_, i) => `${i + 1}`);

    if (fromIdx < 0 || fromIdx >= seq.length || toIdx < 0 || toIdx >= seq.length) return;

    const newSeq = [...seq];
    const [movedItem] = newSeq.splice(fromIdx, 1);
    newSeq.splice(toIdx, 0, movedItem);

    setOrderStr(newSeq.join(", "));
  };

  const movePageInSequence = (index: number, direction: "left" | "right") => {
    const seq = orderStr.trim() 
      ? orderStr.split(",").map(x => x.trim()).filter(Boolean)
      : Array.from({ length: pdfPageCount }, (_, i) => `${i + 1}`);

    if (direction === "left" && index === 0) return;
    if (direction === "right" && index === seq.length - 1) return;

    const targetIndex = direction === "left" ? index - 1 : index + 1;
    const newSeq = [...seq];
    const temp = newSeq[index];
    newSeq[index] = newSeq[targetIndex];
    newSeq[targetIndex] = temp;

    setOrderStr(newSeq.join(", "));
  };

  const removePageFromSequence = (index: number) => {
    const seq = orderStr.trim() 
      ? orderStr.split(",").map(x => x.trim()).filter(Boolean)
      : Array.from({ length: pdfPageCount }, (_, i) => `${i + 1}`);

    const newSeq = seq.filter((_, i) => i !== index);
    setOrderStr(newSeq.join(", "));
  };

  const addPageToSequence = (pageNum: number) => {
    const seq = orderStr.trim() 
      ? orderStr.split(",").map(x => x.trim()).filter(Boolean)
      : Array.from({ length: pdfPageCount }, (_, i) => `${i + 1}`);

    if (!seq.includes(`${pageNum}`)) {
      const newSeq = [...seq, `${pageNum}`];
      setOrderStr(newSeq.join(", "));
    }
  };

  // Click to toggle pages in Split ranges
  const togglePageInRange = (pageNum: number) => {
    let currentPages: number[] = [];
    try {
      for (let p = 1; p <= pdfPageCount; p++) {
        if (isPageInRange(p, ranges)) {
          currentPages.push(p);
        }
      }
    } catch (e) {}

    if (currentPages.includes(pageNum)) {
      currentPages = currentPages.filter((p) => p !== pageNum);
    } else {
      currentPages.push(pageNum);
    }
    currentPages.sort((a, b) => a - b);

    if (currentPages.length === 0) {
      setRanges("");
      return;
    }

    const rangeParts: string[] = [];
    let start = currentPages[0];
    let end = currentPages[0];

    for (let i = 1; i < currentPages.length; i++) {
      if (currentPages[i] === end + 1) {
        end = currentPages[i];
      } else {
        if (start === end) {
          rangeParts.push(`${start}`);
        } else {
          rangeParts.push(`${start}-${end}`);
        }
        start = currentPages[i];
        end = currentPages[i];
      }
    }
    if (start === end) {
      rangeParts.push(`${start}`);
    } else {
      rangeParts.push(`${start}-${end}`);
    }

    setRanges(rangeParts.join(", "));
  };

  const [isMounted, setIsMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [quality, setQuality] = useState(80);
  const [compressTab, setCompressTab] = useState<"quality" | "size">("quality");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [origWidth, setOrigWidth] = useState<number | null>(null);
  const [origHeight, setOrigHeight] = useState<number | null>(null);
  
  const [targetSizeKb, setTargetSizeKb] = useState("");
  const [cropShape, setCropShape] = useState("rectangle");
  const [borderRadiusPercent, setBorderRadiusPercent] = useState(15);
  const [roundTL, setRoundTL] = useState(true);
  const [roundTR, setRoundTR] = useState(true);
  const [roundBL, setRoundBL] = useState(true);
  const [roundBR, setRoundBR] = useState(true);
  const [sliderPosition, setSliderPosition] = useState(50);

  const getRoundedRectPath = (x: number, y: number, w: number, h: number) => {
    const factor = borderRadiusPercent / 100;
    const maxRadius = Math.min(w, h) * factor;
    const rTL = roundTL ? maxRadius : 0;
    const rTR = roundTR ? maxRadius : 0;
    const rBL = roundBL ? maxRadius : 0;
    const rBR = roundBR ? maxRadius : 0;
    
    return `M ${x + rTL} ${y}
            L ${x + w - rTR} ${y}
            A ${rTR} ${rTR} 0 0 1 ${x + w} ${y + rTR}
            L ${x + w} ${y + h - rBR}
            A ${rBR} ${rBR} 0 0 1 ${x + w - rBR} ${y + h}
            L ${x + rBL} ${y + h}
            A ${rBL} ${rBL} 0 0 1 ${x} ${y + h - rBL}
            L ${x} ${y + rTL}
            A ${rTL} ${rTL} 0 0 1 ${x + rTL} ${y} Z`.replace(/\s+/g, " ");
  };

  const [sharpenFactor, setSharpenFactor] = useState(1.0);
  const [resampleFilter, setResampleFilter] = useState("lanczos");
  const [wmRotation, setWmRotation] = useState("0");
  const [bgInspectColor, setBgInspectColor] = useState<"checkered" | "white" | "black">("checkered");
  const [removeBgModel, setRemoveBgModel] = useState<"u2net" | "u2net_human_seg">("u2net_human_seg");
  const [bgSmoothRadius, setBgSmoothRadius] = useState(1);
  const [brushModeActive, setBrushModeActive] = useState(false);
  const [brushType, setBgBrushType] = useState<"erase" | "restore">("erase");
  const [brushSize, setBgBrushSize] = useState(30);
  const [cleanBgResultUrl, setCleanBgResultUrl] = useState<string>("");
  const [bgHistory, setBgHistory] = useState<string[]>([]);
  const [bgHistoryIndex, setBgHistoryIndex] = useState<number>(-1);
  const [blurStrength, setBlurStrength] = useState(50);

  // Draggable / Resizable Visual Crop Editor States
  const [cropPercent, setCropPercent] = useState({ x: 25, y: 25, w: 50, h: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragStartBox, setDragStartBox] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Bulk processing results state
  interface BulkItemResult {
    originalFile: File;
    status: "idle" | "processing" | "success" | "error";
    progress: number;
    error?: string;
    downloadUrl?: string;
    resultFileName?: string;
    processedSize?: number;
  }
  const [bulkResults, setBulkResults] = useState<{ [key: number]: BulkItemResult }>({});

  const handleContainerMouseDown = (e: React.MouseEvent, dir: string | null) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setResizeDirection(dir);
    setDragStart({ x: e.clientX, y: e.clientY });
    setDragStartBox({ ...cropPercent });
  };

  useEffect(() => {
    if (tool === "remove-bg" && bulkResults[0]?.status === "success") {
      setSliderPosition(0);
      let start: number | null = null;
      const duration = 1500; // 1.5 seconds sweep
      const animate = (timestamp: number) => {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);
        
        // Custom easing (ease-in-out)
        const ease = progress < 0.5 
          ? 2 * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
          
        setSliderPosition(ease * 100);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Settle at 50%
          let settleStart: number | null = null;
          const settleDuration = 600;
          const settleAnimate = (settleTimestamp: number) => {
            if (!settleStart) settleStart = settleTimestamp;
            const settleElapsed = settleTimestamp - settleStart;
            const settleProgress = Math.min(settleElapsed / settleDuration, 1);
            // Ease from 100 to 50
            setSliderPosition(100 - settleProgress * 50);
            if (settleProgress < 1) {
              requestAnimationFrame(settleAnimate);
            }
          };
          requestAnimationFrame(settleAnimate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [bulkResults[0]?.status, tool]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const deltaX = ((e.clientX - dragStart.x) / containerRect.width) * 100;
      const deltaY = ((e.clientY - dragStart.y) / containerRect.height) * 100;
      
      setCropPercent((prev) => {
        const newBox = { ...prev };
        
        if (resizeDirection === null) {
          // Move crop box
          newBox.x = Math.max(0, Math.min(100 - prev.w, dragStartBox.x + deltaX));
          newBox.y = Math.max(0, Math.min(100 - prev.h, dragStartBox.y + deltaY));
        } else {
          // Resize crop box
          if (resizeDirection.includes("t")) {
            const potentialHeight = dragStartBox.h - deltaY;
            if (potentialHeight >= 10) {
              newBox.y = Math.max(0, Math.min(dragStartBox.y + dragStartBox.h - 10, dragStartBox.y + deltaY));
              newBox.h = dragStartBox.y + dragStartBox.h - newBox.y;
            }
          }
          if (resizeDirection.includes("b")) {
            newBox.h = Math.max(10, Math.min(100 - prev.y, dragStartBox.h + deltaY));
          }
          if (resizeDirection.includes("l")) {
            const potentialWidth = dragStartBox.w - deltaX;
            if (potentialWidth >= 10) {
              newBox.x = Math.max(0, Math.min(dragStartBox.x + dragStartBox.w - 10, dragStartBox.x + deltaX));
              newBox.w = dragStartBox.x + dragStartBox.w - newBox.x;
            }
          }
          if (resizeDirection.includes("r")) {
            newBox.w = Math.max(10, Math.min(100 - prev.x, dragStartBox.w + deltaX));
          }
        }
        
        if (origWidth && origHeight) {
          setCropX(Math.round((newBox.x / 100) * origWidth).toString());
          setCropY(Math.round((newBox.y / 100) * origHeight).toString());
          setCropW(Math.round((newBox.w / 100) * origWidth).toString());
          setCropH(Math.round((newBox.h / 100) * origHeight).toString());
        }
        
        return newBox;
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setResizeDirection(null);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragStart, dragStartBox, resizeDirection, origWidth, origHeight]);

  const handleWidthChange = (val: string) => {
    setWidth(val);
    if (maintainAspect && origWidth && origHeight && val) {
      const w = parseFloat(val);
      if (!isNaN(w)) {
        const calculatedHeight = Math.round((w / origWidth) * origHeight);
        setHeight(calculatedHeight.toString());
      }
    }
  };

  const handleHeightChange = (val: string) => {
    setHeight(val);
    if (maintainAspect && origWidth && origHeight && val) {
      const h = parseFloat(val);
      if (!isNaN(h)) {
        const calculatedWidth = Math.round((h / origHeight) * origWidth);
        setWidth(calculatedWidth.toString());
      }
    }
  };

  const handleMaintainAspectToggle = (checked: boolean) => {
    setMaintainAspect(checked);
    if (checked && origWidth && origHeight && width) {
      const w = parseFloat(width);
      if (!isNaN(w)) {
        const calculatedHeight = Math.round((w / origWidth) * origHeight);
        setHeight(calculatedHeight.toString());
      }
    }
  };
  
  const [cropX, setCropX] = useState("0");
  const [cropY, setCropY] = useState("0");
  const [cropW, setCropW] = useState("300");
  const [cropH, setCropH] = useState("300");
  
  const [targetFormat, setTargetFormat] = useState("PNG");
  const [scaleFactor, setScaleFactor] = useState("2");
  
  const [wmType, setWmType] = useState("text");
  const [wmText, setWmText] = useState("CONFIDENTIAL");
  const [wmFontSize, setWmFontSize] = useState("36");
  const [wmColor, setWmColor] = useState("#ffffff");
  const [wmOpacity, setWmOpacity] = useState(0.5);
  const [wmPosition, setWmPosition] = useState("center");
  const [watermarkFile, setWatermarkFile] = useState<File | null>(null);
  const [watermarkPreviewUrl, setWatermarkPreviewUrl] = useState<string>("");
  
  useEffect(() => {
    if (watermarkFile) {
      const url = URL.createObjectURL(watermarkFile);
      setWatermarkPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setWatermarkPreviewUrl("");
    }
  }, [watermarkFile]);
  
  const [rotateAngle, setRotateAngle] = useState("90");
  const [flipMode, setFlipMode] = useState("none");
  
  const [htmlUrl, setHtmlUrl] = useState("https://google.com");
  const [htmlContent, setHtmlContent] = useState("<div style='padding:40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color:white; font-family:sans-serif; text-align:center;'>\n  <h1>Upanishad Layout Engine</h1>\n  <p>HTML to Image Converter</p>\n</div>");
  const [htmlWidth, setHtmlWidth] = useState("1280");
  const [htmlHeight, setHtmlHeight] = useState("720");
  const [htmlFileText, setHtmlFileText] = useState<string>("");

  useEffect(() => {
    const first = uploadedFiles[0];
    if (first && (first.name.toLowerCase().endsWith(".html") || first.name.toLowerCase().endsWith(".htm") || first.type === "text/html")) {
      first.text().then((text) => setHtmlFileText(text)).catch(() => setHtmlFileText(""));
    } else {
      setHtmlFileText("");
    }
  }, [uploadedFiles]);



  // Batch Barcode states
  const [skuId, setSkuId] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [variant, setVariant] = useState("");
  const [mfgDate, setMfgDate] = useState("");
  const [expPeriod, setExpPeriod] = useState("1 Year");
  const [batchNo, setBatchNo] = useState("");
  const [eanCode, setEanCode] = useState("");
  const [barcodeFormat, setBarcodeFormat] = useState("CODE128");
  const [barcodeWidth, setBarcodeWidth] = useState(1.5);
  const [barcodeHeight, setBarcodeHeight] = useState(32);
  const [labelFormat, setLabelFormat] = useState("upanishad");
  const [colsPerRow, setColsPerRow] = useState(3);
  const [totalLabels, setTotalLabels] = useState(24);
  const [pageSize, setPageSize] = useState("A4");
  const [pageOrientation, setPageOrientation] = useState<"portrait" | "landscape">("portrait");
  const [origin, setOrigin] = useState("India");
  const [labelWidth, setLabelWidth] = useState(100);
  const [labelHeight, setLabelHeight] = useState(50);
  
  const [customFormats, setCustomFormats] = useState<any[]>([]);
  const [businessProfile, setBusinessProfile] = useState<any>({
    storeName: "Upanishad Systems",
    sellerName: "Aakash Vavadiya",
    brandName: "Upanishad",
    brandLogo: "",
    brandLogoWide: "",
    gstin: "",
    pan: "",
    businessAddress: "Upanishad, 3 Floor, 329 - City Heart Complex, Sayan Road, Kosad, Amroli, Surat - 394107",
    customerCareMobile: "+91 96019 28049",
    customerCareEmail: "upanishadofficial@gmail.com",
    marketedManufacturedBy: "Upanishad Systems",
  });
  const [barcodeSettings, setBarcodeSettings] = useState<any>({
    logo: "",
    marketedBy: "Upanishad, 3 Floor, 329 - City Heart Complex,\nSayan Road, Kosad, Amroli, Surat - 394107",
    customerCareMobile: "+91 96019 28049",
    customerCareEmail: "upanishadofficial@gmail.com",
    labelWidth: "100",
    labelHeight: "50",
    barcodeWidth: "1.5",
    barcodeHeight: "32",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedProfile = localStorage.getItem("business_profile");
      if (savedProfile) {
        try { setBusinessProfile(JSON.parse(savedProfile)); } catch (e) {}
      }
      const savedSettings = localStorage.getItem("barcode_settings");
      if (savedSettings) {
        try { setBarcodeSettings(JSON.parse(savedSettings)); } catch (e) {}
      }
      const savedFormats = localStorage.getItem("custom_label_formats");
      if (savedFormats) {
        try { setCustomFormats(JSON.parse(savedFormats)); } catch (e) {}
      }
    }
  }, []);

  // Custom Barcode wizard states
  const [customBarcodeName, setCustomBarcodeName] = useState("Blinkit Barcode Layout");
  const [customBarcodeType, setCustomBarcodeType] = useState<"product" | "ro" | "quantity">("product");
  const [customBarcodePurpose, setCustomBarcodePurpose] = useState<"blinkit" | "ro" | "quantity" | "batch">("blinkit");
  const [customBarcodeWidth, setCustomBarcodeWidth] = useState(101.6);
  const [customBarcodeHeight, setCustomBarcodeHeight] = useState(50.8);
  const [customBarcodeViewMode, setCustomBarcodeViewMode] = useState<"create" | "saved">("create");

  // Barcode Creator states
  const [barcodeVal, setBarcodeVal] = useState("12345678");
  const [barcodeFormatOption, setBarcodeFormatOption] = useState("CODE128");
  const [barcodeBarWidthPx, setBarcodeBarWidthPx] = useState(2);
  const [barcodeHeightPx, setBarcodeHeightPx] = useState(100);
  const [barcodeMarginPx, setBarcodeMarginPx] = useState(10);
  const [barcodeShowText, setBarcodeShowText] = useState(true);

  // QR Code Creator states
  const [qrText, setQrText] = useState("https://example.com");
  const [qrType, setQrType] = useState<"url" | "text" | "vcard" | "wifi" | "email" | "phone" | "sms">("url");
  const [qrSizePx, setQrSizePx] = useState(300);
  const [qrMarginModules, setQrMarginModules] = useState(4);
  const [qrErrorLevel, setQrErrorLevel] = useState<"L" | "M" | "Q" | "H">("M");
  const [qrFgColor, setQrFgColor] = useState("#000000");
  const [qrBgColor, setQrBgColor] = useState("#ffffff");

  // Premium QR Customizations
  const [qrPattern, setQrPattern] = useState<"squares" | "dots" | "stars" | "sparkles" | "rounded">("squares");
  const [qrEyeStyle, setQrEyeStyle] = useState<"square" | "rounded">("square");
  const [qrLogo, setQrLogo] = useState<string | null>(null);
  const [qrLogoPreset, setQrLogoPreset] = useState<string | null>(null);
  const [qrInnerEyeColor, setQrInnerEyeColor] = useState("#000000");
  const [qrOuterRingColor, setQrOuterRingColor] = useState("#000000");
  const [useQrGradient, setUseQrGradient] = useState(false);
  const [qrGradientType, setQrGradientType] = useState<"linear" | "radial">("linear");
  const [qrGradientStart, setQrGradientStart] = useState("#4f46e5");
  const [qrGradientEnd, setQrGradientEnd] = useState("#06b6d4");
  const [qrBadgePos, setQrBadgePos] = useState<"none" | "top" | "bottom" | "left" | "right">("none");
  const [qrBadgeText, setQrBadgeText] = useState("SCAN ME");
  const [qrBadgeBg, setQrBadgeBg] = useState("#4f46e5");
  const [qrBadgeTextColor, setQrBadgeTextColor] = useState("#ffffff");

  // EAN Generator states
  const [eanType, setEanType] = useState<"EAN13" | "EAN8">("EAN13");
  const [eanCodesText, setEanCodesText] = useState("123456789012\n987654321098\n400638133393");
  const [eanIncludeMarginIndicator, setEanIncludeMarginIndicator] = useState(true);
  const [eanHeightPercent, setEanHeightPercent] = useState(100);
  const [eanScalePercent, setEanScalePercent] = useState(100);
  const [eanBwr, setEanBwr] = useState(0); // Bar width reduction in micrometers
  const [eanFgColor, setEanFgColor] = useState("#000000");
  const [eanBgColor, setEanBgColor] = useState("#ffffff");
  const [eanBgTransparent, setEanBgTransparent] = useState(false);
  const [eanMarginLeft, setEanMarginLeft] = useState(15);
  const [eanMarginRight, setEanMarginRight] = useState(15);
  const [eanMarginTop, setEanMarginTop] = useState(15);
  const [eanMarginBottom, setEanMarginBottom] = useState(15);


  const PRESET_LOGO_PATHS = {
    globe: "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18c-2.3 0-4-3.5-4-8s1.7-8 4-8 4 3.5 4 8-1.7 8-4 8z M2.5 12h19",
    wifi: "M12 18a2 2 0 1 1-2-2 2 2 0 0 1 2 2zm-6.4-6.4a9 9 0 0 1 12.8 0M2.8 7.8a15 15 0 0 1 18.4 0M1 4.8a20 20 0 0 1 22 0",
    mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 4l8 5 8-5",
    phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
    sms: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
    star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
  };

  const applyQrPreset = (presetId: string) => {
    switch (presetId) {
      case "midnight":
        setQrPattern("rounded");
        setQrEyeStyle("rounded");
        setUseQrGradient(true);
        setQrGradientType("radial");
        setQrGradientStart("#06b6d4");
        setQrGradientEnd("#4f46e5");
        setQrOuterRingColor("#312e81");
        setQrInnerEyeColor("#4f46e5");
        setQrLogoPreset("globe");
        setQrBgColor("#ffffff");
        setQrBadgePos("none");
        break;
      case "corporate":
        setQrPattern("squares");
        setQrEyeStyle("square");
        setUseQrGradient(false);
        setQrFgColor("#1e293b");
        setQrOuterRingColor("#1e293b");
        setQrInnerEyeColor("#1e293b");
        setQrLogoPreset(null);
        setQrLogo(null);
        setQrBgColor("#ffffff");
        setQrBadgePos("bottom");
        setQrBadgeText("SCAN ME");
        setQrBadgeBg("#1e293b");
        setQrBadgeTextColor("#ffffff");
        break;
      case "golden":
        setQrPattern("stars");
        setQrEyeStyle("rounded");
        setUseQrGradient(true);
        setQrGradientType("linear");
        setQrGradientStart("#fbbf24");
        setQrGradientEnd("#d97706");
        setQrOuterRingColor("#78350f");
        setQrInnerEyeColor("#d97706");
        setQrLogoPreset("star");
        setQrBgColor("#ffffff");
        setQrBadgePos("none");
        break;
      case "emerald":
        setQrPattern("sparkles");
        setQrEyeStyle("rounded");
        setUseQrGradient(true);
        setQrGradientType("linear");
        setQrGradientStart("#34d399");
        setQrGradientEnd("#047857");
        setQrOuterRingColor("#064e3b");
        setQrInnerEyeColor("#047857");
        setQrLogoPreset("mail");
        setQrBgColor("#ffffff");
        setQrBadgePos("bottom");
        setQrBadgeText("CONNECT");
        setQrBadgeBg("#047857");
        setQrBadgeTextColor("#ffffff");
        break;
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setQrLogo(reader.result as string);
      setQrLogoPreset("custom");
    };
    reader.readAsDataURL(file);
  };

  // vCard details
  const [vcardFirstName, setVcardFirstName] = useState("");
  const [vcardLastName, setVcardLastName] = useState("");
  const [vcardOrg, setVcardOrg] = useState("");
  const [vcardPhone, setVcardPhone] = useState("");
  const [vcardMobile, setVcardMobile] = useState("");
  const [vcardEmail, setVcardEmail] = useState("");
  const [vcardAddress, setVcardAddress] = useState("");
  const [vcardWebsite, setVcardWebsite] = useState("");
  const [vcardNote, setVcardNote] = useState("");

  // WiFi details
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiType, setWifiType] = useState("WPA"); // WPA, WEP, nopass
  const [wifiHidden, setWifiHidden] = useState(false);

  // Email details
  const [emailAddr, setEmailAddr] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

  // Phone details
  const [phoneNum, setPhoneNum] = useState("");

  // SMS details
  const [smsPhone, setSmsPhone] = useState("");
  const [smsMessage, setSmsMessage] = useState("");

  const [qrSvgString, setQrSvgString] = useState("");
  const [qrPngDataUrl, setQrPngDataUrl] = useState("");

  const barcodeRef = useRef<HTMLDivElement>(null);

  const getBarcodeValidationError = (value: string, format: string): string | null => {
    if (!value) return "Barcode value cannot be empty.";
    const isNumeric = /^\d+$/.test(value);
    
    switch (format) {
      case "EAN13":
        if (!isNumeric) return "EAN-13 must contain only digits.";
        if (value.length !== 12 && value.length !== 13) return "EAN-13 must be exactly 12 or 13 digits.";
        if (value.length === 13) {
          let sum = 0;
          for (let i = 0; i < 12; i++) {
            sum += parseInt(value[i], 10) * (i % 2 === 0 ? 1 : 3);
          }
          const checkDigit = (10 - (sum % 10)) % 10;
          if (parseInt(value[12], 10) !== checkDigit) {
            return `EAN-13 check digit mismatch. Expected ${checkDigit} as the 13th digit (got ${value[12]}).`;
          }
        }
        break;
      case "EAN8":
        if (!isNumeric) return "EAN-8 must contain only digits.";
        if (value.length !== 7 && value.length !== 8) return "EAN-8 must be exactly 7 or 8 digits.";
        if (value.length === 8) {
          let sum = 0;
          for (let i = 0; i < 7; i++) {
            sum += parseInt(value[i], 10) * (i % 2 === 0 ? 3 : 1);
          }
          const checkDigit = (10 - (sum % 10)) % 10;
          if (parseInt(value[7], 10) !== checkDigit) {
            return `EAN-8 check digit mismatch. Expected ${checkDigit} as the 8th digit (got ${value[7]}).`;
          }
        }
        break;
      case "EAN5":
        if (!isNumeric) return "EAN-5 must contain only digits.";
        if (value.length !== 5) return "EAN-5 must be exactly 5 digits.";
        break;
      case "EAN2":
        if (!isNumeric) return "EAN-2 must contain only digits.";
        if (value.length !== 2) return "EAN-2 must be exactly 2 digits.";
        break;
      case "UPC":
        if (!isNumeric) return "UPC-A must contain only digits.";
        if (value.length !== 11 && value.length !== 12) return "UPC-A must be exactly 11 or 12 digits.";
        if (value.length === 12) {
          let sum = 0;
          for (let i = 0; i < 11; i++) {
            sum += parseInt(value[i], 10) * (i % 2 === 0 ? 3 : 1);
          }
          const checkDigit = (10 - (sum % 10)) % 10;
          if (parseInt(value[11], 10) !== checkDigit) {
            return `UPC-A check digit mismatch. Expected ${checkDigit} as the 12th digit (got ${value[11]}).`;
          }
        }
        break;
      case "UPCE":
        if (!isNumeric) return "UPC-E must contain only digits.";
        if (value.length !== 6 && value.length !== 8) return "UPC-E must be exactly 6 or 8 digits.";
        if (value.length === 8) {
          if (value[0] !== '0' && value[0] !== '1') return "UPC-E number system digit must be 0 or 1.";
          // Convert UPC-E to UPC-A
          const upce = value.substring(1, 7);
          let upca = "";
          const last = upce[5];
          if (last === '0' || last === '1' || last === '2') {
            upca = upce.substring(0, 2) + last + "0000" + upce.substring(2, 5);
          } else if (last === '3') {
            upca = upce.substring(0, 3) + "00000" + upce.substring(3, 5);
          } else if (last === '4') {
            upca = upce.substring(0, 4) + "00000" + upce[4];
          } else {
            upca = upce.substring(0, 5) + "0000" + last;
          }
          upca = value[0] + upca;
          // Calculate UPC-A checksum
          let sum = 0;
          for (let i = 0; i < 11; i++) {
            sum += parseInt(upca[i], 10) * (i % 2 === 0 ? 3 : 1);
          }
          const checkDigit = (10 - (sum % 10)) % 10;
          if (parseInt(value[7], 10) !== checkDigit) {
            return `UPC-E check digit mismatch. Expected ${checkDigit} as the 8th digit (got ${value[7]}).`;
          }
        }
        break;
      case "ITF14":
        if (!isNumeric) return "ITF-14 must contain only digits.";
        if (value.length !== 13 && value.length !== 14) return "ITF-14 must be exactly 13 or 14 digits.";
        if (value.length === 14) {
          let sum = 0;
          for (let i = 0; i < 13; i++) {
            sum += parseInt(value[i], 10) * (i % 2 === 0 ? 3 : 1);
          }
          const checkDigit = (10 - (sum % 10)) % 10;
          if (parseInt(value[13], 10) !== checkDigit) {
            return `ITF-14 check digit mismatch. Expected ${checkDigit} as the 14th digit (got ${value[13]}).`;
          }
        }
        break;
      case "itf":
        if (!isNumeric) return "ITF must contain only digits.";
        if (value.length % 2 !== 0) return "ITF must have an even number of digits.";
        break;
      case "msi":
        if (!isNumeric) return "MSI must contain only digits.";
        break;
      case "pharmacode":
        if (!isNumeric) return "Pharmacode must contain only digits.";
        const num = parseInt(value, 10);
        if (num < 3 || num > 131070) return "Pharmacode value must be between 3 and 131070.";
        break;
      case "CODE39":
        const code39Regex = /^[0-9A-Z\-.\s$/+%=]+$/;
        if (!code39Regex.test(value.toUpperCase())) {
          return "Code-39 contains invalid characters. (Allowed: A-Z, 0-9, space, and - . $ / + %)";
        }
        break;
      case "codabar":
        const codabarRegex = /^[A-D]?[0-9\-$:/.+]+[A-D]?$/i;
        if (!codabarRegex.test(value)) {
          return "Codabar contains invalid characters. (Allowed: 0-9, -, $, :, /, ., + and start/end with A-D)";
        }
        break;
      default:
        break;
    }
    return null;
  };

  const getValidEanValue = (rawVal: string, type: "EAN13" | "EAN8") => {
    const digits = rawVal.replace(/\D/g, "");
    if (!digits) {
      return { 
        value: type === "EAN13" ? "0000000000000" : "00000000",
        displayValue: type === "EAN13" ? "0 000000 000000 >" : "0000 0000",
        error: "Value must contain only numeric digits." 
      };
    }
    
    if (type === "EAN13") {
      const base = digits.slice(0, 12).padEnd(12, "0");
      let sum = 0;
      for (let i = 0; i < 12; i++) {
        sum += parseInt(base[i], 10) * (i % 2 === 0 ? 1 : 3);
      }
      const checkDigit = (10 - (sum % 10)) % 10;
      const finalVal = base + checkDigit;
      const formatted = eanIncludeMarginIndicator 
        ? `${finalVal[0]} ${finalVal.slice(1, 7)} ${finalVal.slice(7, 13)} >`
        : `${finalVal[0]} ${finalVal.slice(1, 7)} ${finalVal.slice(7, 13)}`;
      
      let warning = null;
      if (digits.length < 12) {
        warning = "Value too short. Padded with trailing zeros.";
      } else if (digits.length >= 13 && digits[12] !== String(checkDigit)) {
        warning = `Checksum digit corrected from ${digits[12]} to ${checkDigit}.`;
      }
      
      return { value: finalVal, displayValue: formatted, error: warning };
    } else {
      const base = digits.slice(0, 7).padEnd(7, "0");
      let sum = 0;
      for (let i = 0; i < 7; i++) {
        sum += parseInt(base[i], 10) * (i % 2 === 0 ? 3 : 1);
      }
      const checkDigit = (10 - (sum % 10)) % 10;
      const finalVal = base + checkDigit;
      const formatted = `${finalVal.slice(0, 4)} ${finalVal.slice(4, 8)}`;
      
      let warning = null;
      if (digits.length < 7) {
        warning = "Value too short. Padded with trailing zeros.";
      } else if (digits.length >= 8 && digits[7] !== String(checkDigit)) {
        warning = `Checksum digit corrected from ${digits[7]} to ${checkDigit}.`;
      }
      
      return { value: finalVal, displayValue: formatted, error: warning };
    }
  };

  const handleDownloadSingleEan = (index: number, codeVal: string, format: "svg" | "png" | "jpg") => {
    const svgEl = document.getElementById(`ean-svg-${index}`)?.querySelector("svg");
    if (!svgEl) return;
    
    const clonedSvg = svgEl.cloneNode(true) as SVGElement;
    clonedSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    const svgString = new XMLSerializer().serializeToString(clonedSvg);
    
    if (format === "svg") {
      const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ean_${codeVal}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) return;
          
          const scale = 4;
          const w = (svgEl.clientWidth || 300) * scale;
          const h = (svgEl.clientHeight || 150) * scale;
          
          canvas.width = w;
          canvas.height = h;
          
          if (format === "jpg") {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, w, h);
          }
          
          ctx.drawImage(img, 0, 0, w, h);
          const mime = format === "jpg" ? "image/jpeg" : "image/png";
          const dataUrl = canvas.toDataURL(mime, 1.0);
          
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = `ean_${codeVal}.${format}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(svgBlob);
    }
  };

  const handleDownloadEan = async (format: "svg" | "png" | "jpg" | "zip") => {
    const rawCodes = eanCodesText.split("\n").map(c => c.trim()).filter(Boolean);
    if (rawCodes.length === 0) return;

    if (format !== "zip") {
      // If user selected global SVG/PNG/JPG button but wants to download all in sequence
      rawCodes.forEach((code, index) => {
        const validated = getValidEanValue(code, eanType);
        handleDownloadSingleEan(index, validated.value, format as any);
      });
      return;
    }

    // Zip export
    const zip = new JSZip();
    const promises = rawCodes.map(async (code, index) => {
      const svgEl = document.getElementById(`ean-svg-${index}`)?.querySelector("svg");
      if (!svgEl) return;
      
      const clonedSvg = svgEl.cloneNode(true) as SVGElement;
      clonedSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      const svgString = new XMLSerializer().serializeToString(clonedSvg);
      
      const validated = getValidEanValue(code, eanType);
      const filename = `ean_${validated.value}`;

      // Default format in zip can be SVG or PNG (let's export SVG inside ZIP, and optionally PNG/JPG if we want, but let's package SVGs for vectors and PNGs for images)
      zip.file(`${filename}.svg`, svgString);
      
      // Let's also add PNG to ZIP for maximum helpfulness!
      const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const pngDataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx) { resolve(""); return; }
            const scale = 4;
            const w = (svgEl.clientWidth || 300) * scale;
            const h = (svgEl.clientHeight || 150) * scale;
            canvas.width = w;
            canvas.height = h;
            ctx.drawImage(img, 0, 0, w, h);
            resolve(canvas.toDataURL("image/png"));
          };
          img.src = reader.result as string;
        };
        reader.readAsDataURL(blob);
      });

      if (pngDataUrl) {
        const base64Data = pngDataUrl.split(",")[1];
        zip.file(`${filename}.png`, base64Data, { base64: true });
      }
    });

    await Promise.all(promises);
    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ean_barcodes.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };



  const handleDownloadBarcode = (format: "svg" | "png" | "jpg") => {
    const svgEl = barcodeRef.current?.querySelector("svg");
    if (!svgEl) return;
    
    const clonedSvg = svgEl.cloneNode(true) as SVGElement;
    clonedSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    const svgString = new XMLSerializer().serializeToString(clonedSvg);
    
    if (format === "svg") {
      const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `barcode_${barcodeVal || "value"}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) return;
          
          const scale = 4;
          const rect = clonedSvg.getBoundingClientRect();
          const w = (rect.width || svgEl.clientWidth || 300) * scale;
          const h = (rect.height || svgEl.clientHeight || 150) * scale;
          
          canvas.width = w;
          canvas.height = h;
          
          if (format === "jpg") {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, w, h);
          }
          
          ctx.drawImage(img, 0, 0, w, h);
          const mime = format === "jpg" ? "image/jpeg" : "image/png";
          const dataUrl = canvas.toDataURL(mime, 1.0);
          
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = `barcode_${barcodeVal || "value"}.${format}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(svgBlob);
    }
  };

  const getQrPayload = () => {
    switch (qrType) {
      case "url":
        return qrText;
      case "text":
        return qrText;
      case "vcard":
        return [
          "BEGIN:VCARD",
          "VERSION:3.0",
          `N:${vcardLastName};${vcardFirstName};;;`,
          `FN:${vcardFirstName} ${vcardLastName}`,
          vcardOrg ? `ORG:${vcardOrg}` : "",
          vcardPhone ? `TEL;TYPE=WORK,VOICE:${vcardPhone}` : "",
          vcardMobile ? `TEL;TYPE=CELL,VOICE:${vcardMobile}` : "",
          vcardEmail ? `EMAIL;TYPE=PREF,INTERNET:${vcardEmail}` : "",
          vcardAddress ? `ADR;TYPE=WORK:;;${vcardAddress};;;;` : "",
          vcardWebsite ? `URL:${vcardWebsite}` : "",
          vcardNote ? `NOTE:${vcardNote}` : "",
          "END:VCARD"
        ].filter(Boolean).join("\n");
      case "wifi":
        return `WIFI:S:${wifiSsid};T:${wifiType};P:${wifiPassword};H:${wifiHidden ? 'true' : 'false'};;`;
      case "email":
        return `MATMSG:TO:${emailAddr};SUB:${emailSubject};BODY:${emailBody};;`;
      case "phone":
        return `tel:${phoneNum}`;
      case "sms":
        return `SMSTO:${smsPhone}:${smsMessage}`;
      default:
        return qrText;
    }
  };

  const generateCustomQrSvg = () => {
    if (tool !== "qr-creator") return "";
    const payload = getQrPayload();
    if (!payload || !payload.trim()) return "";

    try {
      const qr = QRCode.create(payload, { errorCorrectionLevel: qrErrorLevel });
      const size = qr.modules.size;
      const mainFill = useQrGradient ? "url(#qr-data-gradient)" : qrFgColor;

      const hasCenterLogo = !!qrLogo || !!qrLogoPreset;
      const logoSize = size >= 33 ? 7 : 5;
      const logoStart = Math.floor((size - logoSize) / 2);
      const logoEnd = logoStart + logoSize - 1;

      const isLogoCell = (r: number, c: number) => {
        return hasCenterLogo && r >= logoStart && r <= logoEnd && c >= logoStart && c <= logoEnd;
      };

      const getFinderInfo = (r: number, c: number) => {
        if (r >= 0 && r <= 6 && c >= 0 && c <= 6) {
          const isOuter = r === 0 || r === 6 || c === 0 || c === 6;
          const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
          return { isFinder: true, isOuter, isInner };
        }
        if (r >= 0 && r <= 6 && c >= size - 7 && c <= size - 1) {
          const lc = c - (size - 7);
          const isOuter = r === 0 || r === 6 || lc === 0 || lc === 6;
          const isInner = r >= 2 && r <= 4 && lc >= 2 && lc <= 4;
          return { isFinder: true, isOuter, isInner };
        }
        if (r >= size - 7 && r <= size - 1 && c >= 0 && c <= 6) {
          const lr = r - (size - 7);
          const isOuter = lr === 0 || lr === 6 || c === 0 || c === 6;
          const isInner = lr >= 2 && lr <= 4 && c >= 2 && c <= 4;
          return { isFinder: true, isOuter, isInner };
        }
        return { isFinder: false, isOuter: false, isInner: false };
      };

      const elements: string[] = [];

      const renderFinderPattern = (offsetX: number, offsetY: number) => {
        if (qrEyeStyle === "rounded") {
          elements.push(
            `<rect x="${offsetX + 0.5}" y="${offsetY + 0.5}" width="6" height="6" rx="1.8" ry="1.8" fill="none" stroke="${qrOuterRingColor}" stroke-width="1" />`
          );
          elements.push(
            `<rect x="${offsetX + 2}" y="${offsetY + 2}" width="3" height="3" rx="0.9" ry="0.9" fill="${qrInnerEyeColor}" />`
          );
        } else {
          elements.push(
            `<path d="M ${offsetX},${offsetY} h 7 v 7 h -7 z M ${offsetX + 1},${offsetY + 1} v 5 h 5 v -5 z" fill="${qrOuterRingColor}" fill-rule="evenodd" />`
          );
          elements.push(
            `<rect x="${offsetX + 2}" y="${offsetY + 2}" width="3" height="3" fill="${qrInnerEyeColor}" />`
          );
        }
      };

      renderFinderPattern(0, 0);
      renderFinderPattern(size - 7, 0);
      renderFinderPattern(0, size - 7);

      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (!qr.modules.get(r, c)) continue;

          const { isFinder } = getFinderInfo(r, c);
          if (isFinder) continue;
          if (isLogoCell(r, c)) continue;

          if (qrPattern === "dots") {
            elements.push(`<circle cx="${c + 0.5}" cy="${r + 0.5}" r="0.4" fill="${mainFill}" />`);
          } else if (qrPattern === "stars") {
            elements.push(
              `<path d="M 0,-0.4 L 0.1,-0.12 L 0.4,-0.1 L 0.18,0.1 L 0.22,0.4 L 0,0.22 L -0.22,0.4 L -0.18,0.1 L -0.4,-0.1 L -0.1,-0.12 Z" transform="translate(${c + 0.5}, ${r + 0.5}) scale(1.1)" fill="${mainFill}" />`
            );
          } else if (qrPattern === "sparkles") {
            elements.push(
              `<path d="M 0,-0.45 Q 0,0 0.45,0 Q 0,0 0,0.45 Q 0,0 -0.45,0 Q 0,0 0,-0.45 Z" transform="translate(${c + 0.5}, ${r + 0.5}) scale(1.1)" fill="${mainFill}" />`
            );
          } else if (qrPattern === "rounded") {
            elements.push(
              `<rect x="${c + 0.08}" y="${r + 0.08}" width="0.84" height="0.84" rx="0.25" ry="0.25" fill="${mainFill}" />`
            );
          } else {
            elements.push(`<rect x="${c}" y="${r}" width="1.02" height="1.02" fill="${mainFill}" />`);
          }
        }
      }

      if (hasCenterLogo) {
        elements.push(
          `<rect x="${logoStart}" y="${logoStart}" width="${logoSize}" height="${logoSize}" fill="${qrBgColor}" rx="1" />`
        );
        
        if (qrLogoPreset && qrLogoPreset !== "custom") {
          const path = PRESET_LOGO_PATHS[qrLogoPreset as keyof typeof PRESET_LOGO_PATHS];
          if (path) {
            const targetLogoSize = logoSize - 1.6;
            const scale = targetLogoSize / 24;
            const offset = logoStart + 0.8;
            elements.push(
              `<g transform="translate(${offset}, ${offset}) scale(${scale})" fill="${qrInnerEyeColor}">
                <path d="${path}" />
              </g>`
            );
          }
        } else if (qrLogo) {
          const offset = logoStart + 0.5;
          const targetLogoSize = logoSize - 1;
          elements.push(
            `<image href="${qrLogo}" x="${offset}" y="${offset}" width="${targetLogoSize}" height="${targetLogoSize}" />`
          );
        }
      }

      let defs = "";
      if (useQrGradient) {
        if (qrGradientType === "linear") {
          defs = `
            <defs>
              <linearGradient id="qr-data-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="${qrGradientStart}" />
                <stop offset="100%" stop-color="${qrGradientEnd}" />
              </linearGradient>
            </defs>
          `;
        } else {
          defs = `
            <defs>
              <radialGradient id="qr-data-gradient" cx="50%" cy="50%" r="70%">
                <stop offset="0%" stop-color="${qrGradientStart}" />
                <stop offset="100%" stop-color="${qrGradientEnd}" />
              </radialGradient>
            </defs>
          `;
        }
      }

      let viewboxWidth = size + qrMarginModules * 2;
      let viewboxHeight = size + qrMarginModules * 2;
      let qrShiftX = qrMarginModules;
      let qrShiftY = qrMarginModules;
      let badgeMarkup = "";

      if (qrBadgePos !== "none" && qrBadgeText.trim() !== "") {
        const bannerThickness = 3.5;
        if (qrBadgePos === "bottom") {
          viewboxHeight += bannerThickness + 1;
          const badgeX = viewboxWidth / 2;
          badgeMarkup = `
            <g>
              <rect x="${qrMarginModules + 1}" y="${size + qrMarginModules * 0.8}" width="${size - 2}" height="${bannerThickness}" rx="${bannerThickness / 2}" fill="${qrBadgeBg}" />
              <text x="${badgeX}" y="${size + qrMarginModules * 0.8 + bannerThickness / 2 + 0.6}" fill="${qrBadgeTextColor}" text-anchor="middle" font-size="2" font-weight="900" font-family="system-ui, sans-serif" letter-spacing="0.08em">${qrBadgeText.toUpperCase()}</text>
            </g>
          `;
        } else if (qrBadgePos === "top") {
          viewboxHeight += bannerThickness + 1;
          qrShiftY += bannerThickness + 1;
          const badgeX = viewboxWidth / 2;
          badgeMarkup = `
            <g>
              <rect x="${qrMarginModules + 1}" y="${qrMarginModules - 3}" width="${size - 2}" height="${bannerThickness}" rx="${bannerThickness / 2}" fill="${qrBadgeBg}" />
              <text x="${badgeX}" y="${qrMarginModules - 3 + bannerThickness / 2 + 0.6}" fill="${qrBadgeTextColor}" text-anchor="middle" font-size="2" font-weight="900" font-family="system-ui, sans-serif" letter-spacing="0.08em">${qrBadgeText.toUpperCase()}</text>
            </g>
          `;
        } else if (qrBadgePos === "left") {
          viewboxWidth += bannerThickness + 1;
          qrShiftX += bannerThickness + 1;
          const badgeX = qrMarginModules - 1.25;
          const badgeY = viewboxHeight / 2;
          badgeMarkup = `
            <g>
              <rect x="${qrMarginModules - 3}" y="${qrMarginModules + 1}" width="${bannerThickness}" height="${size - 2}" rx="${bannerThickness / 2}" fill="${qrBadgeBg}" />
              <text x="${badgeX}" y="${badgeY + 0.6}" transform="rotate(-90, ${badgeX}, ${badgeY})" fill="${qrBadgeTextColor}" text-anchor="middle" font-size="2" font-weight="900" font-family="system-ui, sans-serif" letter-spacing="0.08em">${qrBadgeText.toUpperCase()}</text>
            </g>
          `;
        } else if (qrBadgePos === "right") {
          viewboxWidth += bannerThickness + 1;
          const badgeX = size + qrMarginModules * 1.5;
          const badgeY = viewboxHeight / 2;
          badgeMarkup = `
            <g>
              <rect x="${size + qrMarginModules * 0.8}" y="${qrMarginModules + 1}" width="${bannerThickness}" height="${size - 2}" rx="${bannerThickness / 2}" fill="${qrBadgeBg}" />
              <text x="${badgeX}" y="${badgeY + 0.6}" transform="rotate(90, ${badgeX}, ${badgeY})" fill="${qrBadgeTextColor}" text-anchor="middle" font-size="2" font-weight="900" font-family="system-ui, sans-serif" letter-spacing="0.08em">${qrBadgeText.toUpperCase()}</text>
            </g>
          `;
        }
      }

      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewboxWidth} ${viewboxHeight}" width="100%" height="100%" style="background-color: ${qrBgColor};">
          ${defs}
          <g transform="translate(${qrShiftX}, ${qrShiftY})">
            ${elements.join("\n")}
          </g>
          ${badgeMarkup}
        </svg>
      `;
    } catch (e) {
      console.error("Custom QR generation error:", e);
      return "";
    }
  };

  useEffect(() => {
    if (tool !== "qr-creator") return;
    const svg = generateCustomQrSvg();
    if (!svg) {
      setQrSvgString("");
      setQrPngDataUrl("");
      return;
    }

    setQrSvgString(svg);

    const img = new Image();
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    
    img.onload = () => {
      try {
        const qr = QRCode.create(getQrPayload() || "temp", { errorCorrectionLevel: qrErrorLevel });
        const size = qr.modules.size;
        const bannerThickness = 3.5;
        let vw = size + qrMarginModules * 2;
        let vh = size + qrMarginModules * 2;
        if (qrBadgePos === "bottom" || qrBadgePos === "top") {
          vh += bannerThickness + 1;
        } else if (qrBadgePos === "left" || qrBadgePos === "right") {
          vw += bannerThickness + 1;
        }

        const scaleFactor = (qrSizePx * 4) / size;
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (ctx) {
          canvas.width = vw * scaleFactor;
          canvas.height = vh * scaleFactor;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const pngUrl = canvas.toDataURL("image/png");
          setQrPngDataUrl(pngUrl);
        }
      } catch (e) {
        console.error("Canvas export failed:", e);
      }
      URL.revokeObjectURL(url);
    };
    
    img.onerror = (e) => {
      console.error("Failed to load SVG for PNG conversion", e);
      URL.revokeObjectURL(url);
    };

    img.src = url;
  }, [
    tool,
    qrType,
    qrText,
    qrSizePx,
    qrMarginModules,
    qrErrorLevel,
    qrFgColor,
    qrBgColor,
    vcardFirstName,
    vcardLastName,
    vcardOrg,
    vcardPhone,
    vcardMobile,
    vcardEmail,
    vcardAddress,
    vcardWebsite,
    vcardNote,
    wifiSsid,
    wifiPassword,
    wifiType,
    wifiHidden,
    emailAddr,
    emailSubject,
    emailBody,
    phoneNum,
    smsPhone,
    smsMessage,
    qrPattern,
    qrEyeStyle,
    qrLogo,
    qrLogoPreset,
    qrInnerEyeColor,
    qrOuterRingColor,
    useQrGradient,
    qrGradientType,
    qrGradientStart,
    qrGradientEnd,
    qrBadgePos,
    qrBadgeText,
    qrBadgeBg,
    qrBadgeTextColor
  ]);

  const handleDownloadQr = (format: "svg" | "png" | "jpg") => {
    if (format === "svg") {
      if (!qrSvgString) return;
      const blob = new Blob([qrSvgString], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `qrcode_${qrType}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else if (format === "png") {
      if (!qrPngDataUrl) return;
      const link = document.createElement("a");
      link.href = qrPngDataUrl;
      link.download = `qrcode_${qrType}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      if (!qrPngDataUrl) return;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.fillStyle = qrBgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/jpeg", 1.0);
        link.download = `qrcode_${qrType}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
      img.src = qrPngDataUrl;
    }
  };
  const [nameError, setNameError] = useState("");
  const [selectedSizePreset, setSelectedSizePreset] = useState<"4x2" | "4x4" | "4x6" | "3x4" | "custom">("custom");
  const [sizeUnit, setSizeUnit] = useState<"mm" | "inch">("mm");

  const defaultLayouts = useMemo(() => [
    {
      id: "upanishad",
      name: "Upanishad Standard",
      type: "product" as const,
      width: 101.6,
      height: 50.8,
      isDefault: true,
      elements: []
    },
    {
      id: "blinkit",
      name: "Blinkit Standard",
      type: "product" as const,
      width: 152.4,
      height: 101.6,
      isDefault: true,
      elements: []
    }
  ], []);

  const allLayouts = useMemo(() => [...defaultLayouts, ...customFormats], [defaultLayouts, customFormats]);

  const downloadLayout = (fmt: any) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fmt, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${fmt.name.toLowerCase().replace(/[^a-z0-9]+/g, "_")}.unibar`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportLayout = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (!imported.name || !imported.width || !imported.height || !Array.isArray(imported.elements)) {
          alert("Invalid .unibar file format: Missing required layout properties.");
          return;
        }
        const nameTrimmed = imported.name.trim();
        const isDuplicate = customFormats.some(f => f.name.toLowerCase() === nameTrimmed.toLowerCase()) || 
                            ["upanishad standard", "blinkit standard"].includes(nameTrimmed.toLowerCase());
        
        let finalName = nameTrimmed;
        if (isDuplicate) {
          finalName = `${nameTrimmed} (Imported ${Date.now().toString().slice(-4)})`;
        }

        const newLayout = {
          ...imported,
          id: `custom_${Date.now()}`,
          name: finalName,
        };

        const updated = [...customFormats, newLayout];
        setCustomFormats(updated);
        localStorage.setItem("custom_label_formats", JSON.stringify(updated));
      } catch (err) {
        alert("Failed to parse file. Make sure it is a valid .unibar JSON file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleUnitToggle = (newUnit: "mm" | "inch") => {
    if (newUnit === sizeUnit) return;
    setSizeUnit(newUnit);
    if (newUnit === "inch") {
      setCustomBarcodeWidth(prev => Math.round((prev / 25.4) * 100) / 100);
      setCustomBarcodeHeight(prev => Math.round((prev / 25.4) * 100) / 100);
    } else {
      setCustomBarcodeWidth(prev => Math.round(prev * 25.4 * 10) / 10);
      setCustomBarcodeHeight(prev => Math.round(prev * 25.4 * 10) / 10);
    }
  };

  const handlePresetSelect = (preset: "4x2" | "4x4" | "4x6" | "3x4" | "custom") => {
    setSelectedSizePreset(preset);
    if (preset === "custom") return;

    const [wIn, hIn] = preset.split("x").map(Number);
    if (sizeUnit === "inch") {
      setCustomBarcodeWidth(wIn);
      setCustomBarcodeHeight(hIn);
    } else {
      setCustomBarcodeWidth(wIn * 25.4);
      setCustomBarcodeHeight(hIn * 25.4);
    }
  };

  const handleCreateLayout = () => {
    const nameTrimmed = customBarcodeName.trim();
    if (!nameTrimmed) {
      setNameError("Label name cannot be empty.");
      return;
    }
    const isDuplicate = customFormats.some(f => f.name.toLowerCase() === nameTrimmed.toLowerCase()) || 
                        ["upanishad standard", "blinkit standard"].includes(nameTrimmed.toLowerCase());
    if (isDuplicate) {
      setNameError("Label name must be unique. A layout with this name already exists.");
      return;
    }
    setNameError("");
    const finalWidth = sizeUnit === "inch" ? customBarcodeWidth * 25.4 : customBarcodeWidth;
    const finalHeight = sizeUnit === "inch" ? customBarcodeHeight * 25.4 : customBarcodeHeight;
    router.push(`/settings/label-designer?init=blank&type=${customBarcodeType}&width=${finalWidth}&height=${finalHeight}&name=${encodeURIComponent(nameTrimmed)}&from=tools`);
  };

  // Custom Invoice wizard states
  const [customInvoiceName, setCustomInvoiceName] = useState("Bespoke Invoice Layout");
  const [customInvoiceOrientation, setCustomInvoiceOrientation] = useState<"Portrait" | "Landscape">("Portrait");
  const [customInvoiceBorderWidth, setCustomInvoiceBorderWidth] = useState(1);
  const [customInvoiceBorderStyle, setCustomInvoiceBorderStyle] = useState<"solid" | "dashed" | "dotted" | "none">("solid");
  const [customInvoiceBorderRadius, setCustomInvoiceBorderRadius] = useState(0);

  // List of saved invoice templates
  const [savedInvoices, setSavedInvoices] = useState<any[]>([]);
  const [customInvoiceViewMode, setCustomInvoiceViewMode] = useState<"create" | "saved">("create");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedInvs = localStorage.getItem("custom_invoice_formats");
      if (savedInvs) {
        try {
          setSavedInvoices(JSON.parse(savedInvs));
        } catch (e) {}
      }
    }
  }, []);

  // Processing states
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "success" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [downloadBlobUrl, setDownloadBlobUrl] = useState<string | null>(null);
  const [resultFileName, setResultFileName] = useState("");

  useEffect(() => {
    return () => {
      if (downloadBlobUrl) URL.revokeObjectURL(downloadBlobUrl);
    };
  }, [downloadBlobUrl]);

  if (!info) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-red-500">Tool Not Found</h2>
        <Button onClick={() => router.push("/")} className="mt-4">Back to Tools</Button>
      </div>
    );
  }

  // Drag and Drop helpers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const filesArray = Array.from(e.dataTransfer.files);
      addFiles(filesArray);
    }
  };

  const fileInputChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      addFiles(filesArray);
    }
  };

  const addFiles = (files: File[]) => {
    // Reset any previous bulk results
    Object.values(bulkResults).forEach((res) => {
      if (res.downloadUrl) {
        try {
          URL.revokeObjectURL(res.downloadUrl);
        } catch (e) {}
      }
    });
    setBulkResults({});

    if (info.isMulti) {
      setUploadedFiles((prev) => [...prev, ...files]);
    } else {
      setUploadedFiles([files[0]]);
      if (files[0]) {
        const nameLower = files[0].name.toLowerCase();
        if (nameLower.endsWith(".pdf")) {
          getPdfPageCount(files[0]).then((count) => {
            setPdfPageCount(count);
            // Set default ranges to 1 or default order string to full range sequence
            setRanges("1");
            setOrderStr(Array.from({ length: count }, (_, i) => i + 1).join(","));
          });
        } else {
          setPdfPageCount(1);
        }
        
        const isImg = files[0].type.startsWith("image/") || /\.(jpe?g|png|webp|gif|bmp|svg)$/i.test(files[0].name);
        if (isImg) {
          const img = new Image();
          img.onload = () => {
            const w = img.naturalWidth;
            const h = img.naturalHeight;
            setOrigWidth(w);
            setOrigHeight(h);
            
            if (tool === "resize-image") {
              setWidth(w.toString());
              setHeight(h.toString());
            } else if (tool === "crop-image") {
              setCropX(Math.round(w * 0.25).toString());
              setCropY(Math.round(h * 0.25).toString());
              setCropW(Math.round(w * 0.5).toString());
              setCropH(Math.round(h * 0.5).toString());
              setCropPercent({ x: 25, y: 25, w: 50, h: 50 });
            }
          };
          img.src = URL.createObjectURL(files[0]);
        }
      }
    }
    if (tool === "merge-pdf" && files.length > 0) {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("collapseSidebar"));
      }
    }
    setStatus("idle");
    setErrorMessage("");
  };

  const removeFile = (idx: number) => {
    setUploadedFiles((prev) => {
      const updated = prev.filter((_, i) => i !== idx);
      if (updated.length === 0) {
        setWidth("");
        setHeight("");
        setOrigWidth(null);
        setOrigHeight(null);
      }
      return updated;
    });
    setBulkResults((prev) => {
      const updated = { ...prev };
      if (updated[idx] && updated[idx].downloadUrl) {
        try {
          URL.revokeObjectURL(updated[idx].downloadUrl!);
        } catch (e) {}
      }
      // Shift keys down for subsequent items
      const newResults: { [key: number]: any } = {};
      Object.keys(updated).forEach((keyStr) => {
        const k = parseInt(keyStr, 10);
        if (k > idx) {
          newResults[k - 1] = updated[k];
        } else if (k < idx) {
          newResults[k] = updated[k];
        }
      });
      return newResults;
    });
    setSelectedIndices((prev) => {
      return prev
        .filter((i) => i !== idx)
        .map((i) => (i > idx ? i - 1 : i));
    });
  };

  // BACKGROUND ERASER/RESTORE CANVAS MANUAL MARKING BRUSH LOGIC
  const bgCanvasRef = React.useRef<HTMLCanvasElement>(null);
  const [drawingState, setDrawingState] = useState({ isDrawing: false, lastX: 0, lastY: 0 });
  const [bgOrigImage, setBgOrigImage] = useState<HTMLImageElement | null>(null);
  const [bgPattern, setBgPattern] = useState<CanvasPattern | null>(null);

  const initBgCanvas = () => {
    const canvas = bgCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const idx = 0;
    const processedUrl = bulkResults[idx]?.downloadUrl;
    const originalUrl = previewUrls[idx];
    if (!processedUrl || !originalUrl) return;

    // Load original image to create pattern for restoring pixels
    const origImg = new Image();
    origImg.crossOrigin = "anonymous";
    origImg.src = originalUrl;
    origImg.onload = () => {
      setBgOrigImage(origImg);
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = origImg.naturalWidth;
      tempCanvas.height = origImg.naturalHeight;
      const tempCtx = tempCanvas.getContext("2d");
      if (tempCtx) {
        tempCtx.drawImage(origImg, 0, 0);
        const pattern = ctx.createPattern(tempCanvas, "no-repeat");
        setBgPattern(pattern);
      }
    };

    // Load processed cutout image onto canvas
    const procImg = new Image();
    procImg.crossOrigin = "anonymous";
    procImg.src = processedUrl;
    procImg.onload = () => {
      canvas.width = procImg.naturalWidth;
      canvas.height = procImg.naturalHeight;
      ctx.drawImage(procImg, 0, 0);
    };
  };

  React.useEffect(() => {
    if (brushModeActive) {
      const timer = setTimeout(() => {
        initBgCanvas();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [brushModeActive]);

  const getCanvasCoords = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ("touches" in e) {
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);
    return { x, y };
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    const canvas = bgCanvasRef.current;
    if (!canvas) return;
    const coords = getCanvasCoords(e, canvas);
    if (!coords) return;
    setDrawingState({ isDrawing: true, lastX: coords.x, lastY: coords.y });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!drawingState.isDrawing) return;
    const canvas = bgCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const coords = getCanvasCoords(e, canvas);
    if (!coords) return;

    ctx.beginPath();
    ctx.moveTo(drawingState.lastX, drawingState.lastY);
    ctx.lineTo(coords.x, coords.y);

    if (brushType === "erase") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
    } else {
      ctx.globalCompositeOperation = "source-over";
      if (bgPattern) {
        ctx.strokeStyle = bgPattern;
      } else {
        ctx.strokeStyle = "rgba(255,255,255,1)";
      }
    }

    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    setDrawingState(prev => ({ ...prev, lastX: coords.x, lastY: coords.y }));
  };

  const handleCanvasMouseUp = () => {
    if (drawingState.isDrawing) {
      setDrawingState(prev => ({ ...prev, isDrawing: false }));
      const canvas = bgCanvasRef.current;
      if (canvas) {
        canvas.toBlob((blob) => {
          if (blob) {
            const newUrl = URL.createObjectURL(blob);
            
            const newHistory = bgHistory.slice(0, bgHistoryIndex + 1);
            newHistory.push(newUrl);
            setBgHistory(newHistory);
            setBgHistoryIndex(newHistory.length - 1);

            setBulkResults(prev => ({
              ...prev,
              [0]: {
                ...prev[0],
                downloadUrl: newUrl
              }
            }));
          }
        }, "image/png");
      }
    }
  };

  const handleCanvasTouchStart = (e: React.TouchEvent) => {
    const canvas = bgCanvasRef.current;
    if (!canvas) return;
    const coords = getCanvasCoords(e, canvas);
    if (!coords) return;
    setDrawingState({ isDrawing: true, lastX: coords.x, lastY: coords.y });
  };

  const handleCanvasTouchMove = (e: React.TouchEvent) => {
    if (!drawingState.isDrawing) return;
    const canvas = bgCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const coords = getCanvasCoords(e, canvas);
    if (!coords) return;

    ctx.beginPath();
    ctx.moveTo(drawingState.lastX, drawingState.lastY);
    ctx.lineTo(coords.x, coords.y);

    if (brushType === "erase") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
    } else {
      ctx.globalCompositeOperation = "source-over";
      if (bgPattern) {
        ctx.strokeStyle = bgPattern;
      } else {
        ctx.strokeStyle = "rgba(255,255,255,1)";
      }
    }

    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    setDrawingState(prev => ({ ...prev, lastX: coords.x, lastY: coords.y }));
  };

  const handleCanvasTouchEnd = () => {
    handleCanvasMouseUp();
  };

  const resetBgCanvas = () => {
    if (!cleanBgResultUrl) return;

    setBgHistory([cleanBgResultUrl]);
    setBgHistoryIndex(0);

    setBulkResults(prev => ({
      ...prev,
      [0]: {
        ...prev[0],
        downloadUrl: cleanBgResultUrl
      }
    }));

    const canvas = bgCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const procImg = new Image();
        procImg.crossOrigin = "anonymous";
        procImg.src = cleanBgResultUrl;
        procImg.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(procImg, 0, 0);
        };
      }
    }
  };

  const handleUndo = React.useCallback(() => {
    if (bgHistoryIndex > 0) {
      const newIndex = bgHistoryIndex - 1;
      setBgHistoryIndex(newIndex);
      const url = bgHistory[newIndex];

      const canvas = bgCanvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = url;
          img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
          };
        }
      }

      setBulkResults(prev => ({
        ...prev,
        [0]: {
          ...prev[0],
          downloadUrl: url
        }
      }));
    }
  }, [bgHistory, bgHistoryIndex]);

  const handleRedo = React.useCallback(() => {
    if (bgHistoryIndex < bgHistory.length - 1) {
      const newIndex = bgHistoryIndex + 1;
      setBgHistoryIndex(newIndex);
      const url = bgHistory[newIndex];

      const canvas = bgCanvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = url;
          img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
          };
        }
      }

      setBulkResults(prev => ({
        ...prev,
        [0]: {
          ...prev[0],
          downloadUrl: url
        }
      }));
    }
  }, [bgHistory, bgHistoryIndex]);

  React.useEffect(() => {
    if (!brushModeActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        handleRedo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        handleUndo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [brushModeActive, handleUndo, handleRedo]);

  // Submission handler
  const handleProcess = async () => {
    if (tool === "batch-barcode") {
      window.print();
      return;
    }

    if (!info.noUpload && uploadedFiles.length === 0) {
      setErrorMessage("Please upload at least one file to process.");
      return;
    }

    if (tool === "merge-pdf" && uploadedFiles.length < 2) {
      setErrorMessage("Please select at least 2 PDF files to merge.");
      setStatus("error");
      return;
    }

    if ((tool === "unlock-pdf" || tool === "protect-pdf") && !password.trim()) {
      setErrorMessage("Please enter a password to proceed.");
      setStatus("error");
      return;
    }
    if (tool === "split-pdf" && splitMode === "extract_range" && !ranges.trim()) {
      setErrorMessage("Please specify the page ranges to extract (e.g. 1-3).");
      setStatus("error");
      return;
    }
    if (tool === "organise-pdf" && !orderStr.trim()) {
      setErrorMessage("Please specify the new page order sequence (e.g. 3,1,2).");
      setStatus("error");
      return;
    }
    if (tool === "watermark-image" && wmType === "image" && !watermarkFile) {
      setErrorMessage("Please upload a logo image to use as a watermark.");
      setStatus("error");
      return;
    }
    if (tool === "html-to-image" && !htmlUrl.trim() && !htmlContent.trim()) {
      setErrorMessage("Please enter a webpage URL or raw HTML code content.");
      setStatus("error");
      return;
    }
    setStatus("processing");
    setProgress(0);
    setErrorMessage("");

    // Revoke old urls
    Object.values(bulkResults).forEach((res) => {
      if (res.downloadUrl) {
        try {
          URL.revokeObjectURL(res.downloadUrl);
        } catch (e) {}
      }
    });
    setBulkResults({});

    const isBatchIndividual = ["compress-image", "watermark-image", "upscale-image", "convert-to-jpg", "convert-from-jpg", "remove-bg", "blur-face"].includes(tool);

    if (isBatchIndividual) {
      const total = uploadedFiles.length;
      let completedCount = 0;
      let errorCount = 0;

      for (let i = 0; i < total; i++) {
        const file = uploadedFiles[i];
        setBulkResults((prev) => ({
          ...prev,
          [i]: {
            originalFile: file,
            status: "processing",
            progress: 50,
          }
        }));

        try {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("category", category);
          formData.append("tool", tool);

          if (tool === "compress-image") {
            if (compressTab === "quality") {
              formData.append("quality", quality.toString());
            } else if (compressTab === "size" && targetSizeKb) {
              formData.append("target_size_kb", targetSizeKb);
            }
          } else if (tool === "convert-from-jpg") {
            formData.append("format", targetFormat);
          } else if (tool === "convert-to-jpg") {
            formData.append("format", "JPG");
          } else if (tool === "upscale-image") {
            formData.append("scale", scaleFactor);
            formData.append("filter", resampleFilter);
            formData.append("sharpen", sharpenFactor.toString());
          } else if (tool === "watermark-image") {
            formData.append("type", wmType);
            formData.append("opacity", wmOpacity.toString());
            formData.append("position", wmPosition);
            formData.append("rotation", wmRotation);
            if (wmType === "text") {
              formData.append("text", wmText);
              formData.append("font_size", wmFontSize);
              formData.append("color", wmColor);
            } else if (wmType === "image" && watermarkFile) {
              formData.append("watermark_file", watermarkFile);
            }
          } else if (tool === "crop-image") {
            formData.append("x", cropX);
            formData.append("y", cropY);
            formData.append("width", cropW);
            formData.append("height", cropH);
            formData.append("shape", cropShape);
            if (cropShape === "rounded_rect") {
              formData.append("radius_percent", borderRadiusPercent.toString());
              formData.append("round_tl", roundTL.toString());
              formData.append("round_tr", roundTR.toString());
              formData.append("round_bl", roundBL.toString());
              formData.append("round_br", roundBR.toString());
            }
          } else if (tool === "rotate-image") {
            formData.append("angle", rotateAngle);
            formData.append("flip", flipMode);
          } else if (tool === "remove-bg") {
            formData.append("format", "PNG");
            formData.append("model", removeBgModel);
            formData.append("smooth_edge", bgSmoothRadius.toString());
          } else if (tool === "blur-face") {
            formData.append("blur_strength", blurStrength.toString());
          }

          const response = await fetch(`/api/tools/${category}/${tool}`, {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            const errJson = await response.json().catch(() => ({}));
            throw new Error(errJson.error || `Process failed with status code ${response.status}`);
          }

          let blob: Blob;
          let filename = "processed_file";

          const contentType = response.headers.get("content-type") || "";
          if (contentType.includes("application/json")) {
            const resJson = await response.json();
            if (!resJson.success || !resJson.downloadUrl) {
              throw new Error(resJson.error || "Failed to retrieve secure download path.");
            }
            const dlResponse = await fetch(resJson.downloadUrl);
            if (!dlResponse.ok) {
              throw new Error("Secure download retrieval failed.");
            }
            blob = await dlResponse.blob();
            filename = resJson.filename || "processed_file";
          } else {
            blob = await response.blob();
            const contentDisposition = response.headers.get("Content-Disposition");
            if (contentDisposition) {
              const matches = /filename\*?=(?:UTF-8'')?([^;]+)/.exec(contentDisposition);
              if (matches && matches[1]) {
                filename = decodeURIComponent(matches[1].replace(/['"]/g, ""));
              }
            } else {
              const baseName = file.name.split(".")[0];
              const ext = file.name.split('.').pop() || 'png';
              filename = `${baseName}_finished.${ext}`;
            }
          }

           const downloadUrl = URL.createObjectURL(blob);
          if (tool === "remove-bg" && i === 0) {
            setCleanBgResultUrl(downloadUrl);
            setBgHistory([downloadUrl]);
            setBgHistoryIndex(0);
          }
          completedCount++;

          setBulkResults((prev) => ({
            ...prev,
            [i]: {
              originalFile: file,
              status: "success",
              progress: 100,
              downloadUrl,
              resultFileName: filename,
              processedSize: blob.size,
            }
          }));
        } catch (err: any) {
          console.error(`Error processing file ${file.name}:`, err);
          errorCount++;
          setBulkResults((prev) => ({
            ...prev,
            [i]: {
              originalFile: file,
              status: "error",
              progress: 100,
              error: err.message || "Failed processing",
            }
          }));
        }

        setProgress(Math.round(((i + 1) / total) * 100));
      }

      if (errorCount === total) {
        setStatus("error");
        setErrorMessage("All files failed to process. Check individual logs.");
      } else {
        setStatus("success");
      }
    } else {
      // Single/combined processing flow
      try {
        const formData = new FormData();
        formData.append("category", category);
        formData.append("tool", tool);

        const isCombined = ["merge-pdf", "jpg-to-pdf"].includes(tool);
        if (isCombined) {
          uploadedFiles.forEach((file) => {
            formData.append("files", file);
          });
        } else {
          if (uploadedFiles[0]) {
            formData.append("file", uploadedFiles[0]);
          }
        }

        if (tool === "split-pdf") {
          const finalSplitMode = splitTab === "range" ? "extract_range" : "separate_files";
          const finalRanges = (splitTab === "page" && pageOption === "all") ? "" : ranges;
          formData.append("split_mode", finalSplitMode);
          formData.append("ranges", finalRanges);
        } else if (tool === "compress-pdf") {
          formData.append("compression_level", compressionLevel);
          if (targetSizeKb) formData.append("target_size_kb", targetSizeKb);
        } else if (tool === "unlock-pdf" || tool === "protect-pdf") {
          formData.append("password", password);
        } else if (tool === "organise-pdf") {
          formData.append("order", orderStr);
        } else if (tool === "resize-image") {
          formData.append("width", width);
          formData.append("height", height);
          formData.append("maintain_aspect", maintainAspect.toString());
        } else if (tool === "crop-image") {
          formData.append("x", cropX);
          formData.append("y", cropY);
          formData.append("width", cropW);
          formData.append("height", cropH);
          formData.append("shape", cropShape);
          if (cropShape === "rounded_rect") {
            formData.append("radius_percent", borderRadiusPercent.toString());
            formData.append("round_tl", roundTL.toString());
            formData.append("round_tr", roundTR.toString());
            formData.append("round_bl", roundBL.toString());
            formData.append("round_br", roundBR.toString());
          }
        } else if (tool === "rotate-image") {
          formData.append("angle", rotateAngle);
          formData.append("flip", flipMode);
        } else if (tool === "html-to-image") {
          if (!uploadedFiles[0]) {
            formData.append("url", htmlUrl);
            formData.append("html_content", htmlContent);
          }
          formData.append("width", htmlWidth);
          formData.append("height", htmlHeight);
        }

        setProgress(30);

        const response = await fetch(`/api/tools/${category}/${tool}`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errJson = await response.json().catch(() => ({}));
          throw new Error(errJson.error || `Process failed with status code ${response.status}`);
        }

        setProgress(75);

        let blob: Blob;
        let filename = "processed_file";

        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          const resJson = await response.json();
          if (!resJson.success || !resJson.downloadUrl) {
            throw new Error(resJson.error || "Failed to retrieve secure download path.");
          }
          const dlResponse = await fetch(resJson.downloadUrl);
          if (!dlResponse.ok) {
            throw new Error("Secure download retrieval failed.");
          }
          blob = await dlResponse.blob();
          filename = resJson.filename || "processed_file";
        } else {
          blob = await response.blob();
          const contentDisposition = response.headers.get("Content-Disposition");
          if (contentDisposition) {
            const matches = /filename\*?=(?:UTF-8'')?([^;]+)/.exec(contentDisposition);
            if (matches && matches[1]) {
              filename = decodeURIComponent(matches[1].replace(/['"]/g, ""));
            }
          } else {
            const baseName = uploadedFiles[0]?.name.split(".")[0] || "processed";
            const ext = blob.type.includes("pdf") ? ".pdf" : ".png";
            filename = `${baseName}_finished${ext}`;
          }
        }
        setProcessedSize(blob.size);

        const downloadUrl = URL.createObjectURL(blob);
        setDownloadBlobUrl(downloadUrl);
        setResultFileName(filename);
        if (uploadedFiles[0]) {
          setBulkResults({
            0: {
              originalFile: uploadedFiles[0],
              status: "success",
              progress: 100,
              downloadUrl,
              resultFileName: filename,
              processedSize: blob.size,
            }
          });
        }
        if (filename.toLowerCase().endsWith(".pdf")) {
          const processedPdf = new File([blob], filename, { type: blob.type });
          setMergedFile(processedPdf);
          // Pre-load metadata for the processed file
          loadFileMetadata(processedPdf);
        }
        setProgress(100);
        setStatus("success");
      } catch (err: any) {
        console.error("Error processing file:", err);
        setStatus("error");
        setErrorMessage(err.message || "Failed processing");
      }
    }
  };

  const triggerDownload = () => {
    const isBatchIndividual = ["compress-image", "watermark-image", "upscale-image", "convert-to-jpg", "convert-from-jpg", "remove-bg", "blur-face"].includes(tool);
    if (isBatchIndividual) {
      const firstSuccess = Object.values(bulkResults).find(r => r.status === "success");
      if (firstSuccess && firstSuccess.downloadUrl) {
        const a = document.createElement("a");
        a.href = firstSuccess.downloadUrl;
        a.download = firstSuccess.resultFileName || `${uploadedFiles[0].name}_processed`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } else {
      if (downloadBlobUrl) {
        const a = document.createElement("a");
        a.href = downloadBlobUrl;
        a.download = resultFileName || `${uploadedFiles[0]?.name || "processed"}_processed`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    }
  };

  const handleDownloadZip = async () => {
    try {
      const zip = new JSZip();
      const promises = uploadedFiles.map(async (file, idx) => {
        const res = bulkResults[idx];
        if (res && res.status === "success" && res.downloadUrl) {
          const response = await fetch(res.downloadUrl);
          const blob = await response.blob();
          const ext = file.name.split('.').pop() || 'png';
          zip.file(res.resultFileName || `${file.name.replace(/\.[^/.]+$/, "")}_processed.${ext}`, blob);
        }
      });
      await Promise.all(promises);
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${info.name.replace(/\s+/g, "_")}_bulk_files.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error packaging zip file:", err);
    }
  };

  const handleDownloadSelected = async () => {
    const isBatchIndividual = ["compress-image", "watermark-image", "upscale-image", "convert-to-jpg", "convert-from-jpg", "remove-bg", "blur-face"].includes(tool);
    if (!isBatchIndividual) {
      triggerDownload();
      return;
    }

    const selectedResults = Object.entries(bulkResults)
      .filter(([idx]) => selectedIndices.includes(parseInt(idx, 10)))
      .map(([_, res]) => res)
      .filter((res) => res.status === "success" && res.downloadUrl);

    if (selectedResults.length === 0) return;

    if (selectedResults.length === 1) {
      const res = selectedResults[0];
      const a = document.createElement("a");
      a.href = res.downloadUrl!;
      a.download = res.resultFileName || "processed_file";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      try {
        const zip = new JSZip();
        const promises = selectedResults.map(async (res, idx) => {
          const response = await fetch(res.downloadUrl!);
          const blob = await response.blob();
          const origIdx = Object.keys(bulkResults).find(k => bulkResults[parseInt(k, 10)] === res);
          const origFile = origIdx !== undefined ? uploadedFiles[parseInt(origIdx, 10)] : null;
          const name = origFile ? origFile.name : `file_${idx}`;
          const ext = name.split('.').pop() || 'png';
          zip.file(res.resultFileName || `${name.replace(/\.[^/.]+$/, "")}_processed.${ext}`, blob);
        });
        await Promise.all(promises);
        const content = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(content);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${info.name.replace(/\s+/g, "_")}_selected_files.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Error packaging zip file:", err);
      }
    }
  };



  // Parse ranges or reorder sequence for PDF previews
  const activeSeq = orderStr.trim()
    ? orderStr.split(",").map(x => parseInt(x.trim(), 10)).filter(x => !isNaN(x) && x >= 1 && x <= pdfPageCount)
    : Array.from({ length: pdfPageCount }, (_, i) => i + 1);

  // Identify omitted pages for Organize PDF
  const omittedPages = Array.from({ length: pdfPageCount }, (_, i) => i + 1)
    .filter(p => !activeSeq.includes(p));

  return (
    <div className="space-y-6 pb-12 w-full">
      {/* Header breadcrumb */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/")}
          className="h-9 px-3 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-100 gap-1.5 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Back to Tools
        </Button>
        <span className="text-sm font-black text-slate-800 tracking-tight">{info.name}</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>



      {isCleanFlow && uploadedFiles.length === 0 ? (
        <div className="max-w-5xl mx-auto w-full py-8 animate-fade-in">
          <Card className="p-6 sm:p-12 border border-slate-200/80 bg-white/70 backdrop-blur-md rounded-3xl min-h-[350px] sm:min-h-[480px] flex flex-col items-center justify-center space-y-8 shadow-sm">
            <div className="w-20 h-20 rounded-[28px] bg-orange-50 flex items-center justify-center shadow-inner">
              <Upload className="w-9 h-9 text-orange-500 animate-bounce" />
            </div>
            <div className="space-y-2.5 text-center">
              <h3 className="text-xl font-black text-slate-800 tracking-tight">
                Upload Your {info.isMulti ? "Files" : "File"}
              </h3>
              <p className="text-xs md:text-sm text-slate-400 font-medium max-w-md mx-auto leading-relaxed">
                Choose a file from your device to begin editing and processing.
              </p>
            </div>
            <Button
              onClick={() => document.getElementById("file-upload")?.click()}
              className="h-13 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl text-xs font-black gap-2.5 px-8 shadow-md hover:shadow-lg transition-all"
            >
              <Upload className="w-4.5 h-4.5" />
              Choose {info.isMulti ? "Files" : "File"}
            </Button>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              multiple={info.isMulti}
              accept={info.accept}
              onChange={fileInputChanged}
            />
            <Badge variant="outline" className="text-[10px] font-black text-slate-400 tracking-wider px-3.5 py-1 rounded-full">
              Accepts {info.accept.replace(/\*/g, "")}
            </Badge>
            {errorMessage && (
              <div className="w-full flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-700 text-xs font-semibold text-left">
                <AlertCircle className="w-4.5 h-4.5 text-red-500 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </Card>
        </div>
      ) : isCleanFlow && status === "processing" ? (
        <div className="w-full animate-fade-in">
          <Card className="p-6 sm:p-12 border border-slate-200 bg-white rounded-3xl min-h-[350px] sm:min-h-[450px] flex flex-col items-center justify-center text-center space-y-8 shadow-sm">
            <div className="relative w-full h-48 overflow-hidden mb-6 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center justify-center">
              <div className="loader">
                <span><span></span><span></span><span></span><span></span></span>
                <div className="base">
                  <span></span>
                  <div className="face"></div>
                </div>
              </div>
              <div className="longfazers">
                <span></span><span></span><span></span><span></span>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-black text-slate-700">
                {tool === "split-pdf" 
                  ? "Splitting your PDF..." 
                  : tool === "merge-pdf" 
                  ? "Merging your PDFs..." 
                  : `${info.name} in progress...`}
              </h3>
              <p className="text-sm text-slate-400 max-w-md font-medium">
                {tool === "split-pdf" 
                  ? "Please wait while we split your document." 
                  : tool === "merge-pdf" 
                  ? "Please wait while we combine your documents into a single PDF." 
                  : `Please wait while we process your file with ${info.name}.`}
              </p>
            </div>
            <div className="w-full max-w-3xl space-y-3">
              <div className="flex justify-between text-xs font-black text-slate-500 uppercase tracking-wider">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 rounded-full bg-slate-100" />
            </div>
          </Card>
        </div>
      ) : isCleanFlow && status === "success" && (mergedFile || downloadBlobUrl) ? (
        <div className="w-full animate-fade-in">
          <Card className="p-6 sm:p-12 border border-slate-200 bg-white rounded-3xl min-h-[350px] sm:min-h-[450px] flex flex-col items-center justify-center space-y-8 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
                {tool === "split-pdf" 
                  ? "Split PDF Output Ready" 
                  : tool === "merge-pdf" 
                  ? "Merged PDF Output Preview" 
                  : `${info.name} Output Ready`}
              </h3>
            </div>
            
            {resultFileName.toLowerCase().endsWith(".pdf") && (mergedFile || (uploadedFiles[0] && uploadedFiles[0].name.toLowerCase().endsWith(".pdf"))) ? (
              <div className="w-48 h-64 border border-slate-200 rounded-2xl overflow-hidden shadow-md flex items-center justify-center bg-slate-50">
                <PdfThumbnail file={mergedFile || uploadedFiles[0]} />
              </div>
            ) : (/\.(jpe?g|png|webp|gif|bmp|svg)$/i.test(resultFileName) && downloadBlobUrl) ? (
              <div className="w-64 h-48 border border-slate-200 rounded-2xl overflow-hidden shadow-md flex items-center justify-center bg-slate-50 p-2 animate-fade-in">
                <img src={downloadBlobUrl} className="w-full h-full object-contain rounded-xl" alt="Resized output" />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-3xl bg-orange-50 flex items-center justify-center">
                <FileText className="w-10 h-10 text-orange-500" />
              </div>
            )}

            <div className="text-center space-y-2">
              <h4 className="text-base font-black text-slate-700 truncate max-w-3xl" title={resultFileName}>
                {resultFileName}
              </h4>
              <Badge variant="outline" className="text-[10px] font-black text-slate-455 bg-slate-50 border-slate-200 px-3 py-1 rounded-full">
                {processedSize ? `${(processedSize / 1024 / 1024).toFixed(2)} MB` : "Finished"}
              </Badge>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <Button
                onClick={triggerDownload}
                className="flex-1 h-12 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-xs font-black gap-2 shadow-lg hover:shadow-xl transition-all"
              >
                <Download className="w-4 h-4" /> Download Result
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setUploadedFiles([]);
                  setMergedFile(null);
                  setDownloadBlobUrl(null);
                  setProcessedSize(null);
                  setStatus("idle");
                }}
                className="h-12 border-slate-200 hover:bg-slate-50 text-slate-700 rounded-2xl text-xs font-black shadow-sm"
              >
                {tool === "split-pdf" ? "Split More" : tool === "merge-pdf" ? "Merge More" : "Process More"}
              </Button>
            </div>
          </Card>
        </div>
      ) : (
      <div className="flex flex-col lg:flex-row gap-6 relative items-start">
        <div className="flex-1 min-w-0 space-y-6">
          {info.isMulti ? (
            uploadedFiles.length === 0 ? (
              <div className="max-w-5xl mx-auto w-full py-8 animate-fade-in">
                <Card className="p-6 sm:p-12 border border-slate-200/80 bg-white/70 backdrop-blur-md rounded-3xl min-h-[350px] sm:min-h-[480px] flex flex-col items-center justify-center space-y-8 shadow-sm">
                  <div className="w-20 h-20 rounded-[28px] bg-orange-50 flex items-center justify-center shadow-inner">
                    <Upload className="w-9 h-9 text-orange-500 animate-bounce" />
                  </div>
                  <div className="space-y-2.5 text-center">
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">
                      Upload Your Files
                    </h3>
                    <p className="text-xs md:text-sm text-slate-400 font-medium max-w-md mx-auto leading-relaxed">
                      Choose files from your device to begin editing and processing.
                    </p>
                  </div>
                  <Button
                    onClick={() => document.getElementById("file-upload")?.click()}
                    className="h-13 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl text-xs font-black gap-2.5 px-8 shadow-md hover:shadow-lg transition-all"
                  >
                    <Upload className="w-4.5 h-4.5" />
                    Choose Files
                  </Button>
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    multiple={true}
                    accept={info.accept}
                    onChange={fileInputChanged}
                  />
                  <Badge variant="outline" className="text-[10px] font-black text-slate-400 tracking-wider px-3.5 py-1 rounded-full">
                    Accepts {info.accept.replace(/\*/g, "")}
                  </Badge>

                  {(() => {
                    const article = BLOG_ARTICLES.find((a) => a.toolSlug === tool);
                    if (!article) return null;
                    return (
                      <Link
                        href={`/blog/${article.slug}`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-orange-50 hover:bg-orange-100 border border-orange-200/80 text-orange-700 text-xs font-black tracking-wide transition-all group shadow-xs mt-3"
                      >
                        <BookOpen className="w-4 h-4 text-orange-500" />
                        <span>Read Detailed Guide: {article.title}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-orange-500 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    );
                  })()}
                </Card>
              </div>
            ) : (
              <Card className="p-6 border border-slate-200 bg-white rounded-3xl space-y-4 shadow-sm relative overflow-hidden">
                <input
                  type="file"
                  id="add-more-upload"
                  className="hidden"
                  multiple={true}
                  accept={info.accept}
                  onChange={fileInputChanged}
                />
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      Workspace / Previews ({uploadedFiles.length} file{uploadedFiles.length !== 1 ? "s" : ""})
                    </h3>
                  </div>
                  <div className="flex items-center gap-3">
                    {info.isMulti && status === "idle" && (
                      <Button
                        onClick={() => document.getElementById("add-more-upload")?.click()}
                        size="sm"
                        className="h-8 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-black gap-1.5 px-3 shadow-md"
                      >
                        <Upload className="w-3.5 h-3.5" /> Add Images
                      </Button>
                    )}
                    {tool !== "merge-pdf" && tool !== "compress-image" && status === "success" && (
                      <>
                        <button
                          onClick={handleToggleSelectAll}
                          className="text-xs font-black text-orange-600 hover:text-orange-700 transition-colors"
                        >
                          {selectedIndices.length === uploadedFiles.length ? "Deselect All" : "Select All"}
                        </button>
                        {selectedIndices.length > 0 && (
                          <Button
                            onClick={handleDownloadSelected}
                            size="sm"
                            className="h-8 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-black gap-1.5 px-3 shadow-md"
                          >
                            <Download className="w-3.5 h-3.5" /> Download Selected ({selectedIndices.length})
                          </Button>
                        )}
                      </>
                    )}
                    {status === "idle" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setUploadedFiles([]);
                          setBulkResults({});
                          setSelectedIndices([]);
                        }}
                        className="text-xs font-black text-red-500 hover:bg-red-50 hover:text-red-650 rounded-xl px-2 h-7"
                      >
                        Clear All
                      </Button>
                    )}
                  </div>
                </div>

                {tool === "compress-image" && status === "processing" && (
                  <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center justify-center text-center space-y-4 animate-fade-in">
                    <div className="relative w-full h-24 overflow-hidden bg-white rounded-xl border border-slate-100/50 flex items-center justify-center">
                      <div className="loader">
                        <span><span></span><span></span><span></span><span></span></span>
                        <div className="base">
                          <span></span>
                          <div className="face"></div>
                        </div>
                      </div>
                      <div className="longfazers">
                        <span></span><span></span><span></span><span></span>
                      </div>
                    </div>
                    <div className="w-full max-w-md space-y-2">
                      <div className="flex justify-between text-xs font-black text-slate-500 uppercase tracking-wider">
                        <span>Compressing Images...</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2 rounded-full bg-slate-200" />
                    </div>
                  </div>
                )}

                {tool === "compress-image" && status === "success" && (
                  <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Compression Finished!</h4>
                        <p className="text-[10px] text-slate-400 font-bold">Select individual images below or download the entire batch.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
                      <Button
                        onClick={handleToggleSelectAll}
                        variant="outline"
                        size="sm"
                        className="flex-1 sm:flex-none h-9 border-slate-200 rounded-xl text-xs font-black"
                      >
                        {selectedIndices.length === uploadedFiles.length ? "Deselect All" : "Select All"}
                      </Button>
                      {selectedIndices.length > 0 && (
                        <Button
                          onClick={handleDownloadSelected}
                          size="sm"
                          className="flex-1 sm:flex-none h-9 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black gap-1.5 shadow-md px-3"
                        >
                          <Download className="w-3.5 h-3.5" /> Download Selected ({selectedIndices.length})
                        </Button>
                      )}
                      <Button
                        onClick={handleDownloadZip}
                        size="sm"
                        className="flex-1 sm:flex-none h-9 bg-slate-900 hover:bg-slate-850 text-white rounded-xl text-xs font-black gap-1.5 shadow-md px-3"
                      >
                        <Download className="w-3.5 h-3.5" /> Download All (ZIP)
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setUploadedFiles([]);
                          setBulkResults({});
                          setSelectedIndices([]);
                          setStatus("idle");
                        }}
                        className="flex-1 sm:flex-none h-9 text-red-500 hover:text-red-750 hover:bg-red-50 rounded-xl text-xs font-black px-3"
                      >
                        Start Over
                      </Button>
                    </div>
                  </div>
                )}
                {uploadedFiles.length === 1 && !uploadedFiles[0].name.toLowerCase().endsWith(".pdf") ? (
                  (() => {
                    const file = uploadedFiles[0];
                    const idx = 0;
                    const result = bulkResults[idx];
                    const hasPreview = !!previewUrls[idx];
                    const isSuccess = result?.status === "success";
                    const isProcessing = result?.status === "processing";
                    const isError = result?.status === "error";
                    
                      return (
                       <div className="flex flex-col items-center justify-center max-w-5xl mx-auto w-full border border-slate-200/80 bg-slate-55/30 rounded-3xl p-4 shadow-sm relative min-h-[500px]">
                        {isSuccess && tool === "remove-bg" && brushModeActive && (
                          <div className="w-full mb-3 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-3 text-slate-700">
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => setBrushModeActive(false)}
                                className="h-8 rounded-xl text-[10px] font-black uppercase tracking-wider gap-1.5 shadow-sm"
                              >
                                <Paintbrush className="w-3.5 h-3.5" />
                                Done Painting
                              </Button>
                              
                              <span className="w-px h-5 bg-slate-200 mx-1" />
                              <Button
                                size="sm"
                                variant={brushType === "erase" ? "default" : "outline"}
                                onClick={() => setBgBrushType("erase")}
                                className="h-8 w-8 p-0 rounded-xl"
                                title="Erase (Remove Object)"
                              >
                                <Eraser className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                size="sm"
                                variant={brushType === "restore" ? "default" : "outline"}
                                onClick={() => setBgBrushType("restore")}
                                className="h-8 w-8 p-0 rounded-xl"
                                title="Restore (Add Object)"
                              >
                                <Brush className="w-3.5 h-3.5" />
                              </Button>
                            </div>

                            {/* Undo / Redo Controls */}
                            <div className="flex items-center gap-1.5">
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={bgHistoryIndex <= 0}
                                onClick={handleUndo}
                                className="h-8 w-8 p-0 rounded-xl"
                                title="Undo (Ctrl+Z)"
                              >
                                <Undo className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={bgHistoryIndex >= bgHistory.length - 1}
                                onClick={handleRedo}
                                className="h-8 w-8 p-0 rounded-xl"
                                title="Redo (Ctrl+Shift+Z)"
                              >
                                <Redo className="w-3.5 h-3.5" />
                              </Button>
                            </div>

                            <div className="flex items-center gap-4 flex-1 sm:flex-none justify-end">
                              <div className="flex items-center gap-2 text-xs font-black text-slate-400">
                                <span>Brush Size</span>
                                <span className="text-slate-800 w-8 text-right">{brushSize}px</span>
                                <Slider
                                  defaultValue={[brushSize]}
                                  max={80}
                                  min={5}
                                  step={1}
                                  onValueChange={(val) => setBgBrushSize(val[0])}
                                  className="w-24 sm:w-32 py-1"
                                />
                              </div>
                              <span className="w-px h-5 bg-slate-200" />
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={resetBgCanvas}
                                className="h-8 rounded-xl text-[10px] font-black uppercase text-red-500 hover:text-red-650 hover:bg-red-50 gap-1.5"
                              >
                                <RotateCcw className="w-3.5 h-3.5" /> Reset Edits
                              </Button>
                            </div>
                          </div>
                        )}
                        <div className={`relative w-full h-[300px] md:h-[420px] border border-slate-200/60 rounded-2xl overflow-hidden flex items-center justify-center ${
                          tool === "remove-bg"
                            ? bgInspectColor === "white" ? "bg-white" : bgInspectColor === "black" ? "bg-slate-900" : "bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:12px_12px] bg-slate-100/90"
                            : "bg-slate-100/70"
                        }`}>
                          {isSuccess && tool === "remove-bg" && !brushModeActive && (
                            <Button
                              size="sm"
                              onClick={() => setBrushModeActive(true)}
                              className="absolute top-3 right-12 z-20 h-8 rounded-xl bg-white hover:bg-slate-50 text-slate-705 border border-slate-200 shadow-sm text-[10px] font-black uppercase tracking-wider gap-1.5 transition-all duration-200 px-3"
                              title="Edit Cutout (Marking Brush)"
                            >
                              <Paintbrush className="w-3.5 h-3.5 text-orange-500" />
                              Edit
                            </Button>
                          )}
                          {isSuccess && result.downloadUrl ? (
                            tool === "remove-bg" ? (
                              brushModeActive ? (
                                <div className="relative max-h-full max-w-full flex items-center justify-center overflow-hidden rounded-xl select-none">
                                  {/* Layout driver image */}
                                  <img 
                                    src={previewUrls[idx]} 
                                    className="max-h-[280px] md:max-h-[400px] w-auto object-contain rounded-xl opacity-0 pointer-events-none" 
                                    alt="Layout driver" 
                                  />
                                  <canvas
                                    ref={bgCanvasRef}
                                    onMouseDown={handleCanvasMouseDown}
                                    onMouseMove={handleCanvasMouseMove}
                                    onMouseUp={handleCanvasMouseUp}
                                    onMouseLeave={handleCanvasMouseUp}
                                    onTouchStart={handleCanvasTouchStart}
                                    onTouchMove={handleCanvasTouchMove}
                                    onTouchEnd={handleCanvasTouchEnd}
                                    className="absolute inset-0 w-full h-full cursor-crosshair rounded-xl bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:12px_12px] bg-slate-100/90 shadow-inner"
                                  />
                                </div>
                              ) : (
                                <div className="relative max-h-full max-w-full flex items-center justify-center overflow-hidden rounded-xl select-none">
                                  {/* Before: Original Preview */}
                                  <img 
                                    src={previewUrls[idx]} 
                                    className="max-h-[280px] md:max-h-[400px] w-auto object-contain rounded-xl pointer-events-none" 
                                    style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
                                    alt="Original preview" 
                                  />
                                  
                                  {/* After: Processed transparent preview */}
                                  <img 
                                    src={result.downloadUrl} 
                                    className="absolute inset-0 w-full h-full object-contain rounded-xl pointer-events-none" 
                                    style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                                    alt="Processed preview"
                                  />

                                  {/* Glowing separator line */}
                                  <div 
                                    className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-500 via-amber-400 to-orange-500 shadow-[0_0_15px_#f97316] z-20 pointer-events-none"
                                    style={{ left: `${sliderPosition}%` }}
                                  >
                                    {/* Scanning glow flare */}
                                    <div className="absolute top-0 bottom-0 -left-4 w-8 bg-gradient-to-r from-orange-500/0 via-orange-500/20 to-orange-500/0 animate-pulse pointer-events-none" />
                                    {/* Slider Handle */}
                                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center cursor-ew-resize">
                                      <svg className="w-4 h-4 text-slate-650 rotate-90" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                                      </svg>
                                    </div>
                                  </div>

                                  {/* Drag controller range input overlay */}
                                  <input 
                                    type="range" 
                                    min="0" 
                                    max="100" 
                                    value={sliderPosition} 
                                    onChange={(e) => setSliderPosition(Number(e.target.value))}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30" 
                                  />
                                </div>
                              )
                            ) : (
                              <img src={result.downloadUrl} className="max-h-full max-w-full object-contain rounded-xl" alt="Processed preview" />
                            )
                          ) : hasPreview && !(tool === "compress-image" && status === "processing") ? (
                            <div className="relative max-h-[280px] md:max-h-[400px] max-w-full inline-block rounded-xl overflow-hidden shadow-sm">
                              <img src={previewUrls[idx]} className="max-h-[280px] md:max-h-[400px] max-w-full object-contain rounded-xl" alt="Original preview" />
                              {/* Live Watermark Overlay when idle */}
                              {tool === "watermark-image" && status === "idle" && (
                                <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-10">
                                  <div className={`absolute flex items-center justify-center ${
                                    wmPosition === "top_left" ? "top-4 left-4" :
                                    wmPosition === "top_right" ? "top-4 right-4" :
                                    wmPosition === "bottom_left" ? "bottom-4 left-4" :
                                    wmPosition === "bottom_right" ? "bottom-4 right-4" : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                                  }`}
                                  style={{
                                    transform: wmPosition === "center" ? `translate(-50%, -50%) rotate(${wmRotation}deg)` : `rotate(${wmRotation}deg)`,
                                    opacity: wmOpacity,
                                  }}>
                                    {wmType === "text" ? (
                                      <span style={{
                                        fontSize: `${Math.max(12, Math.min(54, parseInt(wmFontSize || "36", 10)))}px`,
                                        color: wmColor,
                                        fontWeight: "bold",
                                        textShadow: "0 1px 3px rgba(0,0,0,0.6)",
                                        whiteSpace: "nowrap"
                                      }}>
                                        {wmText || "Watermark"}
                                      </span>
                                    ) : watermarkPreviewUrl ? (
                                      <img src={watermarkPreviewUrl} className="max-w-[140px] max-h-[140px] object-contain" alt="Watermark preview" />
                                    ) : null}
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : null}

                          {status === "idle" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFile(idx);
                              }}
                              className="absolute top-3 right-3 z-20 w-8 h-8 rounded-xl bg-white hover:bg-red-50 hover:text-red-650 text-slate-500 border border-slate-200 flex items-center justify-center shadow-sm transition-colors duration-200"
                              title="Delete File"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}

                          {isProcessing && (
                            <div className="absolute inset-0 z-10 bg-slate-950/40 backdrop-blur-[1px] flex flex-col items-center justify-center gap-2">
                              <Loader2 className="w-8 h-8 animate-spin text-white" />
                              <span className="text-[10px] font-black text-white uppercase tracking-widest">Processing Image</span>
                            </div>
                          )}

                          {isSuccess && result.downloadUrl && tool !== "remove-bg" && (
                            <div className="absolute inset-0 z-10 bg-slate-950/20 opacity-0 hover:opacity-100 transition-opacity duration-250 flex items-center justify-center">
                              <Button
                                size="default"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const a = document.createElement("a");
                                  a.href = result.downloadUrl!;
                                  a.download = result.resultFileName || `${file.name}_processed`;
                                  document.body.appendChild(a);
                                  a.click();
                                  document.body.removeChild(a);
                                }}
                                className="h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black gap-2 shadow-md px-4 border border-emerald-500/20"
                              >
                                <Download className="w-4 h-4" /> Download Image
                              </Button>
                            </div>
                          )}

                          {isError && (
                            <div className="absolute inset-0 z-10 bg-rose-950/75 backdrop-blur-[1px] flex flex-col items-center justify-center p-4 text-center text-white">
                              <AlertCircle className="w-8 h-8 text-rose-400 mb-2 animate-bounce" />
                              <span className="text-xs font-black uppercase tracking-wider">Failed to Process</span>
                              <span className="text-[10px] font-medium leading-relaxed max-w-md mt-1" title={result.error}>
                                {result.error}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="w-full flex items-center justify-between mt-3 px-1 text-slate-700">
                          <div className="flex flex-col text-left">
                            <span className="text-xs font-black tracking-tight max-w-[280px] sm:max-w-[400px] truncate" title={file.name}>
                              {file.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold mt-0.5">
                              Size: {(file.size / 1024).toFixed(1)} KB
                            </span>
                          </div>
                          {isSuccess && (
                            <div className="flex items-center gap-3">
                              {tool === "remove-bg" && (
                                <Button
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const a = document.createElement("a");
                                    a.href = result.downloadUrl!;
                                    a.download = result.resultFileName || `${file.name}_processed`;
                                    document.body.appendChild(a);
                                    a.click();
                                    document.body.removeChild(a);
                                  }}
                                  className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black gap-1.5 shadow-md px-3 border border-emerald-500/20"
                                >
                                  <Download className="w-3.5 h-3.5" /> Download
                                </Button>
                              )}
                              <div className="flex flex-col items-end">
                                <span className="text-emerald-600 flex items-center gap-1 text-[10px] font-black uppercase tracking-wider">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Complete
                                </span>
                                {result.processedSize && (
                                  <span className="text-orange-600 text-[10px] font-black mt-0.5">
                                    {(result.processedSize / 1024).toFixed(1)} KB ({Math.round((result.processedSize / file.size - 1) * 100)}%)
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {category !== "image-tools" && info?.accept !== "image/*" && tool !== "merge-pdf" && tool !== "compress-image" && status === "idle" && (
                      <div
                        onClick={() => document.getElementById("add-more-upload")?.click()}
                        className="relative flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-orange-500 bg-slate-50/50 hover:bg-orange-50/10 rounded-3xl cursor-pointer transition-all duration-300 aspect-[3/4] p-4 text-center group animate-fade-in"
                      >
                        <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                          <Upload className="w-5 h-5 text-orange-500" />
                        </div>
                        <h4 className="text-xs font-black text-slate-700">Add More</h4>
                        <p className="text-[10px] text-slate-400 font-medium mt-1">Browse files</p>
                      </div>
                    )}
                    {uploadedFiles.map((file, idx) => {
                      const result = bulkResults[idx];
                      const isPdf = file.name.toLowerCase().endsWith(".pdf");
                      const hasPreview = !!previewUrls[idx];
                      const isSuccess = result?.status === "success";
                      const isProcessing = result?.status === "processing";
                      const isError = result?.status === "error";
                      const isChecked = selectedIndices.includes(idx);
                      return (
                         <div
                          key={`${file.name}_${idx}`}
                          draggable={status === "idle"}
                          onDragStart={(e) => {
                            if (status !== "idle") {
                              e.preventDefault();
                              return;
                            }
                            setDraggedIdx(idx);
                            e.dataTransfer.effectAllowed = "move";
                          }}
                          onDragOver={(e) => {
                            e.preventDefault();
                            if (status === "idle" && draggedIdx !== null && draggedIdx !== idx) {
                              setDragOverIdx(idx);
                            }
                          }}
                          onDragLeave={() => {
                            if (dragOverIdx === idx) {
                              setDragOverIdx(null);
                            }
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (status === "idle" && draggedIdx !== null && draggedIdx !== idx) {
                              swapFiles(draggedIdx, idx);
                            }
                            setDraggedIdx(null);
                            setDragOverIdx(null);
                          }}
                          onDragEnd={() => {
                            setDraggedIdx(null);
                            setDragOverIdx(null);
                          }}
                          onClick={() => {
                            if (status === "success") {
                              toggleSelect(idx);
                            }
                          }}
                          className={`relative group border rounded-3xl overflow-hidden aspect-[3/4] flex flex-col justify-between p-3 transition-all duration-300 ${
                            status === "success"
                              ? isChecked
                                ? "border-orange-500 bg-orange-50/10 ring-2 ring-orange-500/10 shadow-md cursor-pointer scale-[1.01]"
                                : "border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-slate-350 shadow-sm cursor-pointer"
                              : dragOverIdx === idx
                              ? "border-orange-500 bg-orange-50/20 scale-[1.03] ring-2 ring-orange-500/20 cursor-grab active:cursor-grabbing"
                              : "border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-slate-350 shadow-sm cursor-grab active:cursor-grabbing"
                          }`}
                        >
                          <div className={`relative w-full h-[78%] border border-slate-100 rounded-2xl overflow-hidden flex items-center justify-center ${
                            tool === "remove-bg"
                              ? bgInspectColor === "white" ? "bg-white" : bgInspectColor === "black" ? "bg-slate-900" : "bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:12px_12px] bg-slate-100/90"
                              : "bg-slate-100/70"
                          }`}>
                            {isPdf ? (
                              <PdfThumbnail file={file} />
                            ) : isSuccess && result.downloadUrl ? (
                              <img src={result.downloadUrl} className="w-full h-full object-contain rounded-2xl" alt="Processed preview" />
                            ) : (file.name.toLowerCase().endsWith(".html") || file.name.toLowerCase().endsWith(".htm") || file.type === "text/html") && hasPreview ? (
                              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-white flex items-center justify-center p-1">
                                <iframe
                                  src={previewUrls[idx]}
                                  srcDoc={htmlFileText || undefined}
                                  className="w-full h-full border-0 pointer-events-none rounded-2xl bg-white select-none overflow-hidden scale-90 origin-top"
                                  title="HTML File Preview"
                                />
                              </div>
                            ) : hasPreview && !(tool === "compress-image" && status === "processing") ? (
                              <div className="relative max-h-[140px] sm:max-h-[160px] md:max-h-[200px] max-w-full inline-block rounded-2xl overflow-hidden">
                                <img src={previewUrls[idx]} className="max-h-[140px] sm:max-h-[160px] md:max-h-[200px] max-w-full object-contain rounded-2xl" alt="Original preview" />
                                {/* Live Watermark Overlay when idle */}
                                {tool === "watermark-image" && status === "idle" && (
                                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-10">
                                    <div className={`absolute flex items-center justify-center ${
                                      wmPosition === "top_left" ? "top-3 left-3" :
                                      wmPosition === "top_right" ? "top-3 right-3" :
                                      wmPosition === "bottom_left" ? "bottom-3 left-3" :
                                      wmPosition === "bottom_right" ? "bottom-3 right-3" : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                                    }`}
                                    style={{
                                      transform: wmPosition === "center" ? `translate(-50%, -50%) rotate(${wmRotation}deg)` : `rotate(${wmRotation}deg)`,
                                      opacity: wmOpacity,
                                    }}>
                                      {wmType === "text" ? (
                                        <span style={{
                                          fontSize: `${Math.max(10, Math.min(28, parseInt(wmFontSize || "36", 10) * 0.45))}px`,
                                          color: wmColor,
                                          fontWeight: "bold",
                                          textShadow: "0 1px 3px rgba(0,0,0,0.6)",
                                          whiteSpace: "nowrap"
                                        }}>
                                          {wmText || "Watermark"}
                                        </span>
                                      ) : watermarkPreviewUrl ? (
                                        <img src={watermarkPreviewUrl} className="max-w-[70px] max-h-[70px] object-contain" alt="Watermark preview" />
                                      ) : null}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <ImageIcon className="w-8 h-8 text-slate-300" />
                            )}
                            {tool !== "merge-pdf" && status === "success" && (
                              <div 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSelect(idx);
                                }}
                                className={`absolute top-2.5 left-2.5 z-20 w-6 h-6 rounded-lg flex items-center justify-center border cursor-pointer transition-all duration-200 shadow-sm ${
                                  isChecked 
                                    ? "bg-orange-600 border-orange-600 text-white scale-110" 
                                    : "bg-white/95 hover:bg-white border-slate-300 text-transparent hover:border-slate-450"
                                }`}
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              </div>
                            )}
                            {status === "idle" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeFile(idx);
                                }}
                                className="absolute top-2.5 right-2.5 z-20 w-6.5 h-6.5 rounded-xl bg-white hover:bg-red-55 hover:text-red-600 text-slate-500 border border-slate-200 flex items-center justify-center shadow-sm transition-colors duration-200"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {isProcessing && (
                              <div className="absolute inset-0 z-10 bg-slate-950/40 backdrop-blur-[1px] flex flex-col items-center justify-center gap-1.5">
                                <Loader2 className="w-5 h-5 animate-spin text-white" />
                                <span className="text-[9px] font-black text-white uppercase tracking-wider">Processing</span>
                              </div>
                            )}
                            {isSuccess && result.downloadUrl && tool !== "remove-bg" && (
                              <div className="absolute inset-0 z-10 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                <Button
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const a = document.createElement("a");
                                    a.href = result.downloadUrl!;
                                    a.download = result.resultFileName || `${file.name}_processed`;
                                    document.body.appendChild(a);
                                    a.click();
                                    document.body.removeChild(a);
                                  }}
                                  className="h-8 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-black gap-1.5 shadow-md px-3 border border-emerald-400/20"
                                >
                                  <Download className="w-3.5 h-3.5" /> Download
                                </Button>
                              </div>
                            )}
                            {isError && (
                              <div className="absolute inset-0 z-10 bg-rose-950/65 backdrop-blur-[1px] flex flex-col items-center justify-center p-2 text-center text-white">
                                <AlertCircle className="w-5 h-5 text-rose-350 mb-1 animate-bounce" />
                                <span className="text-[8px] font-black uppercase tracking-wider">Failed</span>
                                <span className="text-[7px] font-medium leading-tight truncate max-w-full mt-0.5" title={result.error}>
                                  {result.error}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-0.5 mt-2.5">
                            <div className="flex items-center justify-between text-[10px] font-black text-slate-700 tracking-tight">
                              <span className="truncate max-w-[65%]" title={file.name}>{file.name}</span>
                              {isSuccess && (
                                <span className="text-emerald-600 flex items-center gap-0.5 text-[8px] font-extrabold uppercase">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Done
                                </span>
                              )}
                            </div>
                            <div className="flex items-center justify-between text-[9px] text-slate-450 font-semibold">
                              <span>{(file.size / 1024).toFixed(1)} KB</span>
                              {isSuccess && result.processedSize && (
                                <span className="text-orange-600 font-black">
                                  {(result.processedSize / 1024).toFixed(1)} KB ({Math.round((result.processedSize / file.size - 1) * 100)}%)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            )
          ) : (
            <>
              {!info.noUpload && uploadedFiles.length === 0 && (
                <div className="max-w-5xl mx-auto w-full py-8 animate-fade-in">
                  <Card className="p-6 sm:p-12 border border-slate-200/80 bg-white/70 backdrop-blur-md rounded-3xl min-h-[350px] sm:min-h-[480px] flex flex-col items-center justify-center space-y-8 shadow-sm">
                    <div className="w-20 h-20 rounded-[28px] bg-orange-50 flex items-center justify-center shadow-inner">
                      <Upload className="w-9 h-9 text-orange-500 animate-bounce" />
                    </div>
                    <div className="space-y-2.5 text-center">
                      <h3 className="text-xl font-black text-slate-800 tracking-tight">
                        Upload Your File
                      </h3>
                      <p className="text-xs md:text-sm text-slate-400 font-medium max-w-md mx-auto leading-relaxed">
                        Choose a file from your device to begin editing and processing.
                      </p>
                    </div>
                    <Button
                      onClick={() => document.getElementById("file-upload")?.click()}
                      className="h-13 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl text-xs font-black gap-2.5 px-8 shadow-md hover:shadow-lg transition-all"
                    >
                      <Upload className="w-4.5 h-4.5" />
                      Choose File
                    </Button>
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      multiple={false}
                      accept={info.accept}
                      onChange={fileInputChanged}
                    />
                    <Badge variant="outline" className="text-[10px] font-black text-slate-400 tracking-wider px-3.5 py-1 rounded-full">
                      Accepts {info.accept.replace(/\*/g, "")}
                    </Badge>
                  </Card>
                </div>
              )}
              {info.noUpload && tool !== "barcode-creator" && tool !== "qr-creator" && tool !== "ean-generator" && (
                <Card className="p-6 border border-slate-200/80 bg-white/70 backdrop-blur-md rounded-3xl space-y-4">
                  {tool === "html-to-image" && (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <Label className="text-xs font-black uppercase text-slate-400 tracking-wider">Target Option</Label>
                        <Select defaultValue="url" onValueChange={(val) => {
                          if (val === "url") setHtmlContent("");
                          else setHtmlUrl("");
                        }}>
                          <SelectTrigger className="rounded-xl border-slate-200">
                            <SelectValue placeholder="Select Input Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="url">Webpage URL</SelectItem>
                            <SelectItem value="html">Raw HTML Code Block</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {htmlUrl !== "" ? (
                        <div className="space-y-2">
                          <Label className="text-xs font-black text-slate-600">Webpage URL</Label>
                          <Input
                            type="url"
                            placeholder="https://example.com"
                            value={htmlUrl}
                            onChange={(e) => setHtmlUrl(e.target.value)}
                            className="rounded-xl border-slate-200"
                          />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Label className="text-xs font-black text-slate-600">Raw HTML Code</Label>
                          <textarea
                            rows={8}
                            value={htmlContent}
                            onChange={(e) => setHtmlContent(e.target.value)}
                            className="w-full p-3 text-xs font-mono bg-slate-50 border rounded-xl focus:outline-none focus:border-slate-400"
                            placeholder="<html><body>...</body></html>"
                          />
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs font-black text-slate-600">Width (px)</Label>
                          <Input
                            type="number"
                            value={htmlWidth}
                            onChange={(e) => setHtmlWidth(e.target.value)}
                            className="rounded-xl border-slate-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-black text-slate-600">Height (px)</Label>
                          <Input
                            type="number"
                            value={htmlHeight}
                            onChange={(e) => setHtmlHeight(e.target.value)}
                            className="rounded-xl border-slate-200"
                          />
                        </div>
                      </div>
                    </div>
                    )}

                  {tool === "batch-barcode" && (
                    <div className="space-y-4">
                      {/* Section 1: Product Specifications */}
                      <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 space-y-3">
                        <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Product Info</h4>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-[10px] font-black uppercase text-slate-500">EAN/UPC Code *</Label>
                            <Input
                              placeholder="Barcode number"
                              value={eanCode}
                              onChange={(e) => setEanCode(e.target.value)}
                              className="h-9 rounded-xl border-slate-200 text-xs font-semibold"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] font-black uppercase text-slate-500">SKU ID</Label>
                            <Input
                              placeholder="SKU-XXXX"
                              value={skuId}
                              onChange={(e) => setSkuId(e.target.value)}
                              className="h-9 rounded-xl border-slate-200 text-xs font-semibold"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-[10px] font-black uppercase text-slate-500">Product Name</Label>
                          <Input
                            placeholder="Cookies, Chocolate chips..."
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            className="h-9 rounded-xl border-slate-200 text-xs font-semibold"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-[10px] font-black uppercase text-slate-500">Price (MRP)</Label>
                            <Input
                              placeholder="99.00"
                              value={price}
                              onChange={(e) => setPrice(e.target.value)}
                              className="h-9 rounded-xl border-slate-200 text-xs font-semibold"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] font-black uppercase text-slate-500">Variant</Label>
                            <Input
                              placeholder="Size: L, Color: White"
                              value={variant}
                              onChange={(e) => setVariant(e.target.value)}
                              className="h-9 rounded-xl border-slate-200 text-xs font-semibold"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Section 2: Dates & Batching */}
                      <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 space-y-3">
                        <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Dates & Batch No</h4>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-[10px] font-black uppercase text-slate-500">MFG Date (MM-YYYY)</Label>
                            <Input
                              placeholder="06-2026"
                              value={mfgDate}
                              onChange={(e) => setMfgDate(e.target.value)}
                              className="h-9 rounded-xl border-slate-200 text-xs font-semibold"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] font-black uppercase text-slate-500">EXP Period</Label>
                            <Select value={expPeriod} onValueChange={setExpPeriod}>
                              <SelectTrigger className="h-9 rounded-xl border-slate-200 text-xs font-semibold">
                                <SelectValue placeholder="Select Expiry" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="6 Months">6 Months</SelectItem>
                                <SelectItem value="1 Year">1 Year</SelectItem>
                                <SelectItem value="2 Years">2 Years</SelectItem>
                                <SelectItem value="3 Years">3 Years</SelectItem>
                                <SelectItem value="5 Years">5 Years</SelectItem>
                                <SelectItem value="No Expiry">No Expiry</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-[10px] font-black uppercase text-slate-500">Batch No</Label>
                            <Input
                              placeholder="BAT-2026-01"
                              value={batchNo}
                              onChange={(e) => setBatchNo(e.target.value)}
                              className="h-9 rounded-xl border-slate-200 text-xs font-semibold"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] font-black uppercase text-slate-500">Origin Country</Label>
                            <Input
                              placeholder="India"
                              value={origin}
                              onChange={(e) => setOrigin(e.target.value)}
                              className="h-9 rounded-xl border-slate-200 text-xs font-semibold"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Section 3: Template Format & Symbology */}
                      <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 space-y-3">
                        <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Format & Symbology</h4>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <Label className="text-[10px] font-black uppercase text-slate-500">Label Template</Label>
                              <button
                                onClick={() => router.push("/tools/barcode/custom-barcode")}
                                className="text-[9px] font-black text-orange-600 hover:text-orange-800 hover:underline flex items-center gap-0.5 bg-transparent border-0 p-0 cursor-pointer"
                              >
                                <Plus className="w-2.5 h-2.5" /> Create
                              </button>
                            </div>
                            <Select value={labelFormat} onValueChange={(val) => {
                              setLabelFormat(val);
                              // Auto set dimensions if custom layout loaded
                              const found = customFormats.find(f => f.id === val);
                              if (found) {
                                setLabelWidth(found.width);
                                setLabelHeight(found.height);
                              } else {
                                if (val === 'blinkit') {
                                  setLabelWidth(152.4); // 6 inches in mm
                                  setLabelHeight(101.6); // 4 inches in mm
                                } else {
                                  setLabelWidth(101.6); // 4 inches in mm
                                  setLabelHeight(50.8); // 2 inches in mm
                                }
                              }
                            }}>
                              <SelectTrigger className="h-9 rounded-xl border-slate-200 text-xs font-semibold">
                                <SelectValue placeholder="Select Template" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="upanishad">Upanishad Standard</SelectItem>
                                <SelectItem value="blinkit">Blinkit Standard</SelectItem>
                                {customFormats.map(fmt => (
                                  <SelectItem key={fmt.id} value={fmt.id}>Custom: {fmt.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-1">
                            <Label className="text-[10px] font-black uppercase text-slate-500">Barcode Symbology</Label>
                            <Select value={barcodeFormat} onValueChange={setBarcodeFormat}>
                              <SelectTrigger className="h-9 rounded-xl border-slate-200 text-xs font-semibold">
                                <SelectValue placeholder="Select Format" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="CODE128">Code-128 (Standard)</SelectItem>
                                <SelectItem value="code93">Code-93</SelectItem>
                                <SelectItem value="EAN13">EAN-13</SelectItem>
                                <SelectItem value="EAN8">EAN-8</SelectItem>
                                <SelectItem value="EAN5">EAN-5</SelectItem>
                                <SelectItem value="EAN2">EAN-2</SelectItem>
                                <SelectItem value="UPC">UPC-A</SelectItem>
                                <SelectItem value="UPCE">UPC-E</SelectItem>
                                <SelectItem value="CODE39">Code-39</SelectItem>
                                <SelectItem value="codabar">Codabar</SelectItem>
                                <SelectItem value="ITF14">ITF-14</SelectItem>
                                <SelectItem value="ITF">ITF</SelectItem>
                                <SelectItem value="MSI">MSI</SelectItem>
                                <SelectItem value="pharmacode">Pharmacode</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Custom label dimensions */}
                        <div className="grid grid-cols-2 gap-3 pt-1">
                          <div className="space-y-1">
                            <Label className="text-[10px] font-black uppercase text-slate-500">Label Width (mm)</Label>
                            <Input
                              type="number"
                              value={labelWidth}
                              onChange={(e) => setLabelWidth(Number(e.target.value))}
                              className="h-9 rounded-xl border-slate-200 text-xs font-semibold"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] font-black uppercase text-slate-500">Label Height (mm)</Label>
                            <Input
                              type="number"
                              value={labelHeight}
                              onChange={(e) => setLabelHeight(Number(e.target.value))}
                              className="h-9 rounded-xl border-slate-200 text-xs font-semibold"
                            />
                          </div>
                        </div>

                        {/* Barcode sizing inputs */}
                        <div className="grid grid-cols-2 gap-3 pt-1">
                          <div className="space-y-1">
                            <Label className="text-[10px] font-black uppercase text-slate-500">Barcode Bar Width</Label>
                            <Input
                              type="number"
                              step="0.1"
                              value={barcodeWidth}
                              onChange={(e) => setBarcodeWidth(Number(e.target.value))}
                              className="h-9 rounded-xl border-slate-200 text-xs font-semibold"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] font-black uppercase text-slate-500">Barcode Height</Label>
                            <Input
                              type="number"
                              value={barcodeHeight}
                              onChange={(e) => setBarcodeHeight(Number(e.target.value))}
                              className="h-9 rounded-xl border-slate-200 text-xs font-semibold"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Section 4: Grid & Print settings */}
                      <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 space-y-3">
                        <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Sheet & Grid Layout</h4>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-[10px] font-black uppercase text-slate-500">Page Size</Label>
                            <Select value={pageSize} onValueChange={setPageSize}>
                              <SelectTrigger className="h-9 rounded-xl border-slate-200 text-xs font-semibold">
                                <SelectValue placeholder="Page Size" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="A4">A4 Sheet (210 x 297 mm)</SelectItem>
                                <SelectItem value="A3">A3 Sheet (297 x 420 mm)</SelectItem>
                                <SelectItem value="Letter">Letter Sheet (8.5" x 11")</SelectItem>
                                <SelectItem value="roll">Continuous Roll (Label Printer)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-1">
                            <Label className="text-[10px] font-black uppercase text-slate-500">Orientation</Label>
                            <div className="relative w-full h-9 bg-slate-100 rounded-xl p-1 flex items-center cursor-pointer select-none">
                              {/* Wobbly sliding background */}
                              <motion.div
                                className="absolute top-1 bottom-1 left-1 bg-white rounded-lg shadow-sm border border-slate-200/50"
                                style={{ width: "calc(50% - 4px)" }}
                                animate={{
                                  x: pageOrientation === "portrait" ? 0 : "100%",
                                }}
                                transition={{
                                  type: "spring",
                                  stiffness: 280,
                                  damping: 18,
                                }}
                              />
                              {/* Option 1: Portrait */}
                              <div
                                onClick={() => setPageOrientation("portrait")}
                                className={`flex-1 text-center py-1.5 text-[10px] font-black relative z-10 transition-colors ${
                                  pageOrientation === "portrait" ? "text-slate-800" : "text-slate-450 hover:text-slate-700"
                                }`}
                              >
                                Portrait
                              </div>
                              {/* Option 2: Landscape */}
                              <div
                                onClick={() => setPageOrientation("landscape")}
                                className={`flex-1 text-center py-1.5 text-[10px] font-black relative z-10 transition-colors ${
                                  pageOrientation === "landscape" ? "text-slate-800" : "text-slate-450 hover:text-slate-700"
                                }`}
                              >
                                Landscape
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-[10px] font-black uppercase text-slate-500">Horizontal Columns</Label>
                            <Input
                              type="number"
                              min="1"
                              max="8"
                              value={colsPerRow}
                              onChange={(e) => setColsPerRow(Number(e.target.value))}
                              className="h-9 rounded-xl border-slate-200 text-xs font-semibold"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] font-black uppercase text-slate-500">Total Labels</Label>
                            <Input
                              type="number"
                              min="1"
                              max="1000"
                              value={totalLabels}
                              onChange={(e) => setTotalLabels(Number(e.target.value))}
                              className="h-9 rounded-xl border-slate-200 text-xs font-semibold"
                            />
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={() => window.print()}
                        disabled={!eanCode.trim()}
                        className="w-full h-11 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-black gap-1.5 shadow-md disabled:opacity-40"
                      >
                        <Printer className="w-4 h-4" /> Print Barcode Batch ({totalLabels})
                      </Button>
                    </div>
                  )}

                  {tool === "custom-barcode" && (
                    <div className="space-y-6">
                      {/* Premium Wobbly Switch */}
                      <div className="relative w-full max-w-[380px] mx-auto h-9 bg-slate-100/80 rounded-xl p-1 flex items-center cursor-pointer select-none border border-slate-200/50">
                        <motion.div
                          className="absolute top-1 bottom-1 left-1 bg-white rounded-lg shadow-xs border border-slate-200/40"
                          style={{ width: "calc(50% - 4px)" }}
                          animate={{
                            x: customBarcodeViewMode === "create" ? 0 : "100%",
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                          }}
                        />
                        <div
                          onClick={() => setCustomBarcodeViewMode("create")}
                          className={`flex-1 text-center py-1.5 text-[10px] font-black uppercase tracking-wider relative z-10 transition-colors ${
                            customBarcodeViewMode === "create" ? "text-slate-800" : "text-slate-400 hover:text-slate-650"
                          }`}
                        >
                          Barcode Layout Creator
                        </div>
                        <div
                          onClick={() => setCustomBarcodeViewMode("saved")}
                          className={`flex-1 text-center py-1.5 text-[10px] font-black uppercase tracking-wider relative z-10 transition-colors ${
                            customBarcodeViewMode === "saved" ? "text-slate-800" : "text-slate-400 hover:text-slate-650"
                          }`}
                        >
                          Saved Layouts
                        </div>
                      </div>

                      {customBarcodeViewMode === "create" ? (
                        <div className="space-y-4 animate-fade-in max-w-5xl mx-auto w-full">
                          <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 space-y-4">
                            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Format Metadata</h4>
                            
                            <div className="space-y-1">
                              <Label className="text-[10px] font-black uppercase text-slate-500">Label Format Name</Label>
                              <Input
                                placeholder="My Bespoke Label"
                                value={customBarcodeName}
                                onChange={(e) => {
                                  setCustomBarcodeName(e.target.value);
                                  setNameError("");
                                }}
                                className="h-9 rounded-xl border-slate-200 text-xs font-semibold"
                              />
                              {nameError && (
                                <span className="text-[10px] text-rose-500 font-bold block mt-1">{nameError}</span>
                              )}
                            </div>

                            {/* Label Type Purpose Wobbly Switch */}
                            <div className="space-y-2">
                              <Label className="text-[10px] font-black uppercase text-slate-500">Label Type Purpose</Label>
                              <div className="relative w-full h-11 bg-slate-100 rounded-2xl p-1 flex items-center cursor-pointer select-none border border-slate-200/50">
                                <motion.div
                                  className="absolute top-1 bottom-1 left-1 bg-white rounded-xl shadow-md border border-slate-200/50"
                                  style={{ width: "calc(25% - 2px)" }}
                                  animate={{
                                    x: customBarcodePurpose === "blinkit" ? "0%" :
                                       customBarcodePurpose === "ro" ? "100%" :
                                       customBarcodePurpose === "quantity" ? "200%" : "300%",
                                  }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 280,
                                    damping: 18,
                                  }}
                                />
                                {(["blinkit", "ro", "quantity", "batch"] as const).map((purpose) => (
                                  <div
                                    key={purpose}
                                    onClick={() => {
                                      setCustomBarcodePurpose(purpose);
                                      let finalType: "product" | "ro" | "quantity" = "product";
                                      let defaultName = "";
                                      if (purpose === "blinkit") {
                                        finalType = "product";
                                        defaultName = "Blinkit Barcode Layout";
                                      } else if (purpose === "batch") {
                                        finalType = "product";
                                        defaultName = "Batch Barcode Layout";
                                      } else if (purpose === "ro") {
                                        finalType = "ro";
                                        defaultName = "RO Barcode Layout";
                                      } else if (purpose === "quantity") {
                                        finalType = "quantity";
                                        defaultName = "Quantity Barcode Layout";
                                      }
                                      setCustomBarcodeType(finalType);
                                      setCustomBarcodeName(defaultName);
                                    }}
                                    className={`flex-1 text-center py-2 text-[10px] font-black uppercase tracking-wider relative z-10 transition-colors ${
                                      customBarcodePurpose === purpose ? "text-slate-800" : "text-slate-450 hover:text-slate-700"
                                    }`}
                                  >
                                    {purpose === "blinkit" ? "Blinkit" :
                                     purpose === "ro" ? "RO" :
                                     purpose === "quantity" ? "Quantity" : "Batch"}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Measurement Unit Switch */}
                            <div className="space-y-2">
                              <Label className="text-[10px] font-black uppercase text-slate-500">Measurement Unit</Label>
                              <div className="relative w-full max-w-[200px] h-9 bg-slate-100 rounded-xl p-1 flex items-center cursor-pointer select-none border border-slate-200/50">
                                <motion.div
                                  className="absolute top-1 bottom-1 left-1 bg-white rounded-lg shadow-xs border border-slate-200/40"
                                  style={{ width: "calc(50% - 4px)" }}
                                  animate={{
                                    x: sizeUnit === "mm" ? 0 : "100%",
                                  }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 280,
                                    damping: 18,
                                  }}
                                />
                                <div
                                  onClick={() => handleUnitToggle("mm")}
                                  className={`flex-1 text-center py-1.5 text-[10px] font-black uppercase tracking-wider relative z-10 transition-colors ${
                                    sizeUnit === "mm" ? "text-slate-800" : "text-slate-450 hover:text-slate-700"
                                  }`}
                                >
                                  mm
                                </div>
                                <div
                                  onClick={() => handleUnitToggle("inch")}
                                  className={`flex-1 text-center py-1.5 text-[10px] font-black uppercase tracking-wider relative z-10 transition-colors ${
                                    sizeUnit === "inch" ? "text-slate-800" : "text-slate-450 hover:text-slate-700"
                                  }`}
                                >
                                  Inch
                                </div>
                              </div>
                            </div>

                            {/* Size Preset Switch */}
                            <div className="space-y-2">
                              <Label className="text-[10px] font-black uppercase text-slate-500">Label Size Preset</Label>
                              <div className="relative w-full h-11 bg-slate-100 rounded-2xl p-1 flex items-center cursor-pointer select-none border border-slate-200/50">
                                <motion.div
                                  className="absolute top-1 bottom-1 left-1 bg-white rounded-xl shadow-md border border-slate-200/50"
                                  style={{ width: "calc(20% - 2.4px)" }}
                                  animate={{
                                    x: selectedSizePreset === "4x2" ? "0%" :
                                       selectedSizePreset === "4x4" ? "100%" :
                                       selectedSizePreset === "4x6" ? "200%" :
                                       selectedSizePreset === "3x4" ? "300%" : "400%",
                                  }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 280,
                                    damping: 18,
                                  }}
                                />
                                {(["4x2", "4x4", "4x6", "3x4", "custom"] as const).map((preset) => (
                                  <div
                                    key={preset}
                                    onClick={() => handlePresetSelect(preset)}
                                    className={`flex-1 text-center py-2 text-[10px] font-black uppercase tracking-wider relative z-10 transition-colors ${
                                      selectedSizePreset === preset ? "text-slate-800" : "text-slate-450 hover:text-slate-700"
                                    }`}
                                  >
                                    {preset === "custom" ? "Custom" : `${preset.replace("x", "×")} in`}
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-1">
                              <div className="space-y-1">
                                <Label className="text-[10px] font-black uppercase text-slate-500">
                                  Width ({sizeUnit}) {selectedSizePreset !== "custom" && "(Preset)"}
                                </Label>
                                <Input
                                  type="number"
                                  step="0.1"
                                  disabled={selectedSizePreset !== "custom"}
                                  value={customBarcodeWidth}
                                  onChange={(e) => setCustomBarcodeWidth(Number(e.target.value))}
                                  className="h-9 rounded-xl border-slate-200 text-xs font-semibold disabled:bg-slate-50 disabled:text-slate-450"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-[10px] font-black uppercase text-slate-500">
                                  Height ({sizeUnit}) {selectedSizePreset !== "custom" && "(Preset)"}
                                </Label>
                                <Input
                                  type="number"
                                  step="0.1"
                                  disabled={selectedSizePreset !== "custom"}
                                  value={customBarcodeHeight}
                                  onChange={(e) => setCustomBarcodeHeight(Number(e.target.value))}
                                  className="h-9 rounded-xl border-slate-200 text-xs font-semibold disabled:bg-slate-50 disabled:text-slate-450"
                                />
                              </div>
                            </div>
                          </div>

                          <Button
                            onClick={handleCreateLayout}
                            className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black gap-1.5 shadow-md"
                          >
                            <Plus className="w-4 h-4" /> Create & Launch Label Designer
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-5 animate-fade-in">
                          {/* Group 1: Blinkit & Batch Product Layouts */}
                          <div className="space-y-3">
                            <h4 className="text-[10px] font-black uppercase text-emerald-600 tracking-wider flex items-center gap-1.5 pb-1 border-b border-emerald-100/80">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Blinkit & Batch Product Layouts ({allLayouts.filter(f => f.type === "product" || !f.type).length})
                            </h4>
                            {allLayouts.filter(f => f.type === "product" || !f.type).length === 0 ? (
                              <p className="text-[9px] text-slate-400 italic pl-3">No product layouts configured.</p>
                            ) : (
                              <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
                                {allLayouts.filter(f => f.type === "product" || !f.type).map(fmt => (
                                  <div key={fmt.id} className="p-3 border border-slate-150 rounded-2xl bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between">
                                    <div>
                                      <h5 className="text-[11px] font-bold text-slate-800 truncate">{fmt.name}</h5>
                                      <p className="text-[9px] text-slate-450 font-semibold mt-0.5">Size: {fmt.width} x {fmt.height} mm</p>
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-slate-100">
                                      {fmt.isDefault ? (
                                        <div className="text-[8px] text-center font-black py-1.5 bg-slate-100 text-slate-400 rounded-lg w-full">
                                          Default Layout
                                        </div>
                                      ) : (
                                        <>
                                          <Button
                                            onClick={() => router.push(`/settings/label-designer?id=${fmt.id}&from=tools`)}
                                            className="h-7 bg-orange-50 hover:bg-orange-600 text-orange-600 hover:text-white border border-orange-100/50 rounded-lg text-[9px] font-black flex-1 gap-1"
                                          >
                                            <ExternalLink className="w-2.5 h-2.5" /> Edit
                                          </Button>
                                          <Button
                                            onClick={() => downloadLayout(fmt)}
                                            variant="outline"
                                            className="h-7 w-7 border-slate-200 hover:bg-orange-50 text-orange-600 rounded-lg p-0 flex items-center justify-center shrink-0"
                                            title="Download (.unibar)"
                                          >
                                            <Download className="w-3 h-3" />
                                          </Button>
                                          <Button
                                            onClick={() => {
                                              const updated = customFormats.filter(f => f.id !== fmt.id);
                                              setCustomFormats(updated);
                                              localStorage.setItem("custom_label_formats", JSON.stringify(updated));
                                            }}
                                            variant="outline"
                                            className="h-7 w-7 border-slate-200 hover:bg-red-50 hover:text-red-600 rounded-lg p-0 flex items-center justify-center shrink-0"
                                            title="Delete"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </Button>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Group 2: RO Layouts */}
                          <div className="space-y-3">
                            <h4 className="text-[10px] font-black uppercase text-orange-600 tracking-wider flex items-center gap-1.5 pb-1 border-b border-orange-100/80">
                              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                              RO Layouts ({allLayouts.filter(f => f.type === "ro").length})
                            </h4>
                            {allLayouts.filter(f => f.type === "ro").length === 0 ? (
                              <p className="text-[9px] text-slate-400 italic pl-3">No RO layouts configured.</p>
                            ) : (
                              <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
                                {allLayouts.filter(f => f.type === "ro").map(fmt => (
                                  <div key={fmt.id} className="p-3 border border-slate-150 rounded-2xl bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between">
                                    <div>
                                      <h5 className="text-[11px] font-bold text-slate-800 truncate">{fmt.name}</h5>
                                      <p className="text-[9px] text-slate-450 font-semibold mt-0.5">Size: {fmt.width} x {fmt.height} mm</p>
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-slate-100">
                                      {fmt.isDefault ? (
                                        <div className="text-[8px] text-center font-black py-1.5 bg-slate-100 text-slate-400 rounded-lg w-full">
                                          Default Layout
                                        </div>
                                      ) : (
                                        <>
                                          <Button
                                            onClick={() => router.push(`/settings/label-designer?id=${fmt.id}&from=tools`)}
                                            className="h-7 bg-orange-50 hover:bg-orange-600 text-orange-600 hover:text-white border border-orange-100/50 rounded-lg text-[9px] font-black flex-1 gap-1"
                                          >
                                            <ExternalLink className="w-2.5 h-2.5" /> Edit
                                          </Button>
                                          <Button
                                            onClick={() => downloadLayout(fmt)}
                                            variant="outline"
                                            className="h-7 w-7 border-slate-200 hover:bg-orange-50 text-orange-600 rounded-lg p-0 flex items-center justify-center shrink-0"
                                            title="Download (.unibar)"
                                          >
                                            <Download className="w-3 h-3" />
                                          </Button>
                                          <Button
                                            onClick={() => {
                                              const updated = customFormats.filter(f => f.id !== fmt.id);
                                              setCustomFormats(updated);
                                              localStorage.setItem("custom_label_formats", JSON.stringify(updated));
                                            }}
                                            variant="outline"
                                            className="h-7 w-7 border-slate-200 hover:bg-red-50 hover:text-red-650 rounded-lg p-0 flex items-center justify-center shrink-0"
                                            title="Delete"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </Button>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Group 3: Quantity Layouts */}
                          <div className="space-y-3">
                            <h4 className="text-[10px] font-black uppercase text-amber-600 tracking-wider flex items-center gap-1.5 pb-1 border-b border-amber-100/80">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              Quantity Layouts ({allLayouts.filter(f => f.type === "quantity").length})
                            </h4>
                            {allLayouts.filter(f => f.type === "quantity").length === 0 ? (
                              <p className="text-[9px] text-slate-400 italic pl-3">No quantity layouts configured.</p>
                            ) : (
                              <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
                                {allLayouts.filter(f => f.type === "quantity").map(fmt => (
                                  <div key={fmt.id} className="p-3 border border-slate-150 rounded-2xl bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between">
                                    <div>
                                      <h5 className="text-[11px] font-bold text-slate-800 truncate">{fmt.name}</h5>
                                      <p className="text-[9px] text-slate-450 font-semibold mt-0.5">Size: {fmt.width} x {fmt.height} mm</p>
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-slate-100">
                                      {fmt.isDefault ? (
                                        <div className="text-[8px] text-center font-black py-1.5 bg-slate-100 text-slate-400 rounded-lg w-full">
                                          Default Layout
                                        </div>
                                      ) : (
                                        <>
                                          <Button
                                            onClick={() => router.push(`/settings/label-designer?id=${fmt.id}&from=tools`)}
                                            className="h-7 bg-orange-50 hover:bg-orange-600 text-orange-600 hover:text-white border border-orange-100/50 rounded-lg text-[9px] font-black flex-1 gap-1"
                                          >
                                            <ExternalLink className="w-2.5 h-2.5" /> Edit
                                          </Button>
                                          <Button
                                            onClick={() => downloadLayout(fmt)}
                                            variant="outline"
                                            className="h-7 w-7 border-slate-200 hover:bg-orange-50 text-orange-600 rounded-lg p-0 flex items-center justify-center shrink-0"
                                            title="Download (.unibar)"
                                          >
                                            <Download className="w-3 h-3" />
                                          </Button>
                                          <Button
                                            onClick={() => {
                                              const updated = customFormats.filter(f => f.id !== fmt.id);
                                              setCustomFormats(updated);
                                              localStorage.setItem("custom_label_formats", JSON.stringify(updated));
                                            }}
                                            variant="outline"
                                            className="h-7 w-7 border-slate-200 hover:bg-red-50 hover:text-red-650 rounded-lg p-0 flex items-center justify-center shrink-0"
                                            title="Delete"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </Button>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {tool === "custom-invoice" && (
                    <div className="space-y-6">
                      {/* Premium Wobbly Switch */}
                      <div className="relative w-full max-w-[280px] mx-auto h-9 bg-slate-100/80 rounded-xl p-1 flex items-center cursor-pointer select-none border border-slate-200/50">
                        <motion.div
                          className="absolute top-1 bottom-1 left-1 bg-white rounded-lg shadow-xs border border-slate-200/40"
                          style={{ width: "calc(50% - 4px)" }}
                          animate={{
                            x: customInvoiceViewMode === "create" ? 0 : "100%",
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                          }}
                        />
                        <div
                          onClick={() => setCustomInvoiceViewMode("create")}
                          className={`flex-1 text-center py-1.5 text-[10px] font-black uppercase tracking-wider relative z-10 transition-colors ${
                            customInvoiceViewMode === "create" ? "text-slate-800" : "text-slate-400 hover:text-slate-650"
                          }`}
                        >
                          Tool Creator
                        </div>
                        <div
                          onClick={() => setCustomInvoiceViewMode("saved")}
                          className={`flex-1 text-center py-1.5 text-[10px] font-black uppercase tracking-wider relative z-10 transition-colors ${
                            customInvoiceViewMode === "saved" ? "text-slate-800" : "text-slate-400 hover:text-slate-650"
                          }`}
                        >
                          Saved Layouts
                        </div>
                      </div>

                      {customInvoiceViewMode === "create" ? (
                        <div className="space-y-4 animate-fade-in max-w-5xl mx-auto w-full">
                          <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 space-y-3">
                            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Invoice Metadata</h4>
                            
                            <div className="space-y-1">
                              <Label className="text-[10px] font-black uppercase text-slate-500">Format Name</Label>
                              <Input
                                placeholder="My Bespoke Invoice"
                                value={customInvoiceName}
                                onChange={(e) => setCustomInvoiceName(e.target.value)}
                                className="h-9 rounded-xl border-slate-200 text-xs font-semibold"
                              />
                            </div>

                            <div className="space-y-1">
                              <Label className="text-[10px] font-black uppercase text-slate-500">Page Orientation</Label>
                              <div className="relative w-full h-9 bg-slate-100 rounded-xl p-1 flex items-center cursor-pointer select-none">
                                <motion.div
                                  className="absolute top-1 bottom-1 left-1 bg-white rounded-lg shadow-sm border border-slate-200/50"
                                  style={{ width: "calc(50% - 4px)" }}
                                  animate={{
                                    x: customInvoiceOrientation === "Portrait" ? 0 : "100%",
                                  }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 280,
                                    damping: 18,
                                  }}
                                />
                                <div
                                  onClick={() => setCustomInvoiceOrientation("Portrait")}
                                  className={`flex-1 text-center py-1.5 text-[10px] font-black relative z-10 transition-colors ${
                                    customInvoiceOrientation === "Portrait" ? "text-slate-800" : "text-slate-455 hover:text-slate-700"
                                  }`}
                                >
                                  Portrait
                                </div>
                                <div
                                  onClick={() => setCustomInvoiceOrientation("Landscape")}
                                  className={`flex-1 text-center py-1.5 text-[10px] font-black relative z-10 transition-colors ${
                                    customInvoiceOrientation === "Landscape" ? "text-slate-800" : "text-slate-455 hover:text-slate-700"
                                  }`}
                                >
                                  Landscape
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-1">
                              <div className="space-y-1">
                                <Label className="text-[10px] font-black uppercase text-slate-500">Border Width (px)</Label>
                                <Input
                                  type="number"
                                  value={customInvoiceBorderWidth}
                                  onChange={(e) => setCustomInvoiceBorderWidth(Number(e.target.value))}
                                  className="h-9 rounded-xl border-slate-200 text-xs font-semibold"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-[10px] font-black uppercase text-slate-500">Border Radius (px)</Label>
                                <Input
                                  type="number"
                                  value={customInvoiceBorderRadius}
                                  onChange={(e) => setCustomInvoiceBorderRadius(Number(e.target.value))}
                                  className="h-9 rounded-xl border-slate-200 text-xs font-semibold"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <Label className="text-[10px] font-black uppercase text-slate-500">Border Style</Label>
                              <Select value={customInvoiceBorderStyle} onValueChange={(val: any) => setCustomInvoiceBorderStyle(val)}>
                                <SelectTrigger className="h-9 rounded-xl border-slate-200 text-xs font-semibold">
                                  <SelectValue placeholder="Select Style" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="solid">Solid</SelectItem>
                                  <SelectItem value="dashed">Dashed</SelectItem>
                                  <SelectItem value="dotted">Dotted</SelectItem>
                                  <SelectItem value="none">None</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <Button
                            onClick={() => router.push(`/settings/invoice-designer?init=blank&name=${encodeURIComponent(customInvoiceName)}&orientation=${customInvoiceOrientation}&borderWidth=${customInvoiceBorderWidth}&borderStyle=${customInvoiceBorderStyle}&borderRadius=${customInvoiceBorderRadius}&from=tools`)}
                            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black gap-1.5 shadow-md"
                          >
                            <Plus className="w-4 h-4" /> Create & Launch Invoice Designer
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-5 animate-fade-in">
                          {/* Group 1: Portrait Invoices */}
                          <div className="space-y-3">
                            <h4 className="text-[10px] font-black uppercase text-orange-600 tracking-wider flex items-center gap-1.5 pb-1 border-b border-orange-100/80">
                              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                              Portrait Invoices ({savedInvoices.filter(f => f.orientation === "Portrait" || !f.orientation).length})
                            </h4>
                            {savedInvoices.filter(f => f.orientation === "Portrait" || !f.orientation).length === 0 ? (
                              <p className="text-[9px] text-slate-400 italic pl-3">No portrait invoice templates configured.</p>
                            ) : (
                              <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
                                {savedInvoices.filter(f => f.orientation === "Portrait" || !f.orientation).map(fmt => (
                                  <div key={fmt.id} className="p-3 border border-slate-150 rounded-2xl bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between">
                                    <div>
                                      <h5 className="text-[11px] font-bold text-slate-800 truncate">{fmt.name}</h5>
                                      <p className="text-[9px] text-slate-455 font-semibold mt-0.5">Elements: {fmt.elements?.length || 0}</p>
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-slate-100">
                                      <Button
                                        onClick={() => router.push(`/settings/invoice-designer?id=${fmt.id}&from=tools`)}
                                        className="h-7 bg-blue-55 hover:bg-blue-600 text-blue-650 hover:text-white border border-blue-100/50 rounded-lg text-[9px] font-black flex-1 gap-1"
                                      >
                                        <ExternalLink className="w-2.5 h-2.5" /> Edit
                                      </Button>
                                      <Button
                                        onClick={() => {
                                          const updated = savedInvoices.filter(f => f.id !== fmt.id);
                                          setSavedInvoices(updated);
                                          localStorage.setItem("custom_invoice_formats", JSON.stringify(updated));
                                        }}
                                        variant="outline"
                                        className="h-7 w-7 border-slate-200 hover:bg-red-50 hover:text-red-600 rounded-lg p-0 flex items-center justify-center shrink-0"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Group 2: Landscape Invoices */}
                          <div className="space-y-3">
                            <h4 className="text-[10px] font-black uppercase text-amber-600 tracking-wider flex items-center gap-1.5 pb-1 border-b border-amber-100/80">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              Landscape Invoices ({savedInvoices.filter(f => f.orientation === "Landscape").length})
                            </h4>
                            {savedInvoices.filter(f => f.orientation === "Landscape").length === 0 ? (
                              <p className="text-[9px] text-slate-400 italic pl-3">No landscape invoice templates configured.</p>
                            ) : (
                              <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
                                {savedInvoices.filter(f => f.orientation === "Landscape").map(fmt => (
                                  <div key={fmt.id} className="p-3 border border-slate-150 rounded-2xl bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between">
                                    <div>
                                      <h5 className="text-[11px] font-bold text-slate-800 truncate">{fmt.name}</h5>
                                      <p className="text-[9px] text-slate-455 font-semibold mt-0.5">Elements: {fmt.elements?.length || 0}</p>
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-slate-100">
                                      <Button
                                        onClick={() => router.push(`/settings/invoice-designer?id=${fmt.id}&from=tools`)}
                                        className="h-7 bg-blue-55 hover:bg-blue-600 text-blue-650 hover:text-white border border-blue-100/50 rounded-lg text-[9px] font-black flex-1 gap-1"
                                      >
                                        <ExternalLink className="w-2.5 h-2.5" /> Edit
                                      </Button>
                                      <Button
                                        onClick={() => {
                                          const updated = savedInvoices.filter(f => f.id !== fmt.id);
                                          setSavedInvoices(updated);
                                          localStorage.setItem("custom_invoice_formats", JSON.stringify(updated));
                                        }}
                                        variant="outline"
                                        className="h-7 w-7 border-slate-200 hover:bg-red-50 hover:text-red-600 rounded-lg p-0 flex items-center justify-center shrink-0"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              )}
              {((uploadedFiles.length > 0 && !info.noUpload) ||
                (info.noUpload && (
                  tool === "batch-barcode" || 
                  tool === "custom-barcode" || 
                  tool === "custom-invoice" || 
                  (tool !== "custom-barcode" && 
                   tool !== "custom-invoice")
                ))) && (
                <Card className="p-6 border border-slate-200 bg-white rounded-3xl space-y-4 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                      <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                        {tool === "custom-barcode" 
                          ? "Your Saved Barcode Formats" 
                          : tool === "custom-invoice" 
                            ? "Your Saved Invoice Layouts" 
                            : "Live File Preview & Layout"}
                      </h3>
                    </div>
                    <Badge variant="outline" className="border-orange-100 bg-orange-50/50 text-orange-600 font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full">
                      {category.toUpperCase()} Active View
                    </Badge>
                  </div>
                  {(category === "image" || category === "barcode" || category === "invoice") && (
                    <div className="space-y-4">
                      {info.noUpload ? (
                        tool === "html-to-image" ? (
                          <div className="border border-slate-200 bg-slate-50/50 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[300px] text-center">
                            <div className="bg-white border border-slate-200 rounded-2xl shadow-lg w-full max-w-lg overflow-hidden flex flex-col">
                              <div className="bg-slate-100 px-3 py-2 flex items-center justify-between border-b select-none">
                                <div className="flex items-center gap-1.5">
                                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                                  <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                                </div>
                                <div className="bg-white border rounded text-[9px] py-0.5 px-3 text-slate-500 font-mono truncate text-left max-w-xs">
                                  {htmlUrl || "Render Target: Custom Code Block"}
                                </div>
                                <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">Chrome Headless</span>
                              </div>
                              <div className="p-6 font-mono text-[9px] text-slate-650 text-left bg-slate-950/5 overflow-y-auto max-h-[220px] min-h-[160px] custom-scrollbar">
                                {htmlContent ? (
                                  <pre className="text-slate-700 whitespace-pre-wrap">{htmlContent}</pre>
                                ) : (
                                  <div className="text-slate-400 text-center py-10 italic">
                                    Render target website screenshot template
                                  </div>
                                )}
                              </div>
                              <div className="bg-slate-50 px-4 py-2 border-t text-right text-[8px] font-black text-slate-400 uppercase tracking-wider">
                                Screenshot Output: {htmlWidth} x {htmlHeight} px
                              </div>
                            </div>
                          </div>
                        ) : tool === "custom-barcode" ? (
                          <div className="space-y-4 w-full">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                                Barcode Layouts ({allLayouts.length})
                              </h4>
                              
                              <div>
                                <input
                                  type="file"
                                  id="import-unibar-input"
                                  accept=".unibar"
                                  className="hidden"
                                  onChange={handleImportLayout}
                                />
                                <Button
                                  onClick={() => document.getElementById("import-unibar-input")?.click()}
                                  className="h-8 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-xl text-[10px] font-black gap-1"
                                >
                                  <Upload className="w-3.5 h-3.5" /> Import (.unibar)
                                </Button>
                              </div>
                            </div>

                            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 max-h-[600px] overflow-y-auto custom-scrollbar p-1">
                              {allLayouts.map(fmt => (
                                <div key={fmt.id} className="p-4 border border-slate-200 rounded-2xl bg-slate-50 flex flex-col justify-between hover:border-orange-400 hover:shadow-md transition-all relative">
                                  <div>
                                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight truncate" title={fmt.name}>{fmt.name}</h4>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                                      Type: {fmt.type || "product"} | Size: {fmt.width} x {fmt.height} mm
                                    </p>
                                    {fmt.isDefault && (
                                      <span className="absolute top-2 right-2 bg-emerald-50 text-emerald-700 text-[8px] font-extrabold px-1.5 py-0.5 rounded border border-emerald-100 uppercase">
                                        Default
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex gap-1.5 mt-4 pt-3 border-t border-slate-200/50">
                                    {fmt.isDefault ? (
                                      <div className="text-[9px] text-center font-black py-2 bg-slate-100 text-slate-400 rounded-xl w-full select-none">
                                        System Layout
                                      </div>
                                    ) : (
                                      <>
                                        <Button
                                          onClick={() => router.push(`/settings/label-designer?id=${fmt.id}&from=tools`)}
                                          className="h-8 bg-orange-50 border border-orange-200/50 text-orange-600 hover:bg-orange-600 hover:text-white rounded-xl text-[10px] font-black flex-1 gap-1"
                                        >
                                          <ExternalLink className="w-3 h-3" /> Edit
                                        </Button>
                                        <Button
                                          onClick={() => downloadLayout(fmt)}
                                          variant="outline"
                                          className="h-8 border-slate-200 hover:bg-orange-50 text-orange-600 rounded-xl p-0 w-8 flex items-center justify-center shrink-0"
                                          title="Download (.unibar)"
                                        >
                                          <Download className="w-3.5 h-3.5" />
                                        </Button>
                                        <Button
                                          onClick={() => {
                                            const updated = customFormats.filter(f => f.id !== fmt.id);
                                            setCustomFormats(updated);
                                            localStorage.setItem("custom_label_formats", JSON.stringify(updated));
                                          }}
                                          variant="outline"
                                          className="h-8 border-slate-200 hover:bg-rose-50 text-rose-600 rounded-xl p-0 w-8 flex items-center justify-center shrink-0"
                                          title="Delete"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : tool === "custom-invoice" ? (
                          <div className="space-y-4 w-full">
                            <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Your Custom Invoice Layouts</h4>
                            {savedInvoices.length === 0 ? (
                              <div className="text-center py-8 text-slate-400 italic text-xs font-medium">
                                No custom invoices created yet. Use the wizard on the left to design a new layout.
                              </div>
                            ) : (
                              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 max-h-[400px] overflow-y-auto custom-scrollbar p-1">
                                {savedInvoices.map(fmt => (
                                  <div key={fmt.id} className="p-4 border border-slate-200 rounded-2xl bg-slate-50 flex flex-col justify-between hover:border-orange-400 hover:shadow-md transition-all">
                                    <div>
                                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight truncate">{fmt.name}</h4>
                                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                                        Orientation: {fmt.orientation} | Elements: {fmt.elements?.length || 0}
                                      </p>
                                    </div>
                                    <div className="flex gap-2 mt-4 pt-3 border-t border-slate-200/50">
                                      <Button
                                        onClick={() => router.push(`/settings/invoice-designer?id=${fmt.id}&from=tools`)}
                                        className="h-8 bg-orange-50 border border-orange-200/50 text-orange-600 hover:bg-orange-600 hover:text-white rounded-xl text-[10px] font-black flex-1 gap-1"
                                      >
                                        <ExternalLink className="w-3 h-3" /> Edit Layout
                                      </Button>
                                      <Button
                                        onClick={() => {
                                          const updated = savedInvoices.filter(f => f.id !== fmt.id);
                                          setSavedInvoices(updated);
                                          localStorage.setItem("custom_invoice_formats", JSON.stringify(updated));
                                        }}
                                        variant="outline"
                                        className="h-8 border-slate-200 hover:bg-rose-50 text-rose-600 rounded-xl text-[10px] font-black px-3"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : tool === "batch-barcode" ? (
                          <div className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-200 rounded-2xl w-full min-h-[300px]">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 select-none">
                              Single Label Live Preview
                            </span>
                            
                            <div 
                              className={`bg-white border-black relative text-black font-sans shadow-md overflow-hidden ${
                                (labelFormat === 'custom' || labelFormat.startsWith('custom_'))
                                  ? 'p-1'
                                  : (labelFormat === 'blinkit' ? 'p-5 border-[2px] rounded-md' : 'p-3 border-[1.5px] rounded-[15px]')
                              }`}
                              style={{ 
                                width: labelWidth ? `${labelWidth}mm` : (labelFormat === 'blinkit' ? '152.4mm' : '101.6mm'), 
                                height: labelHeight ? `${labelHeight}mm` : (labelFormat === 'blinkit' ? '101.6mm' : '50.8mm'),
                                boxSizing: 'border-box',
                                maxWidth: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                              }}
                            >
                              {renderSelectedLayout()}
                            </div>
                          </div>
                         ) : tool === "ean-generator" ? (
                          <div className="space-y-6 w-full flex flex-col text-slate-800 animate-fade-in">
                            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                              <div>
                                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                                  EAN Barcode Preview
                                </h4>
                                <p className="text-[10px] text-slate-450 font-bold mt-1 uppercase tracking-wider">
                                  {eanCodesText.split("\n").map(c => c.trim()).filter(Boolean).length} codes loaded
                                </p>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <Button
                                  onClick={() => handleDownloadEan("svg")}
                                  className="h-8 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-xl text-[10px] font-black gap-1"
                                >
                                  <Download className="w-3.5 h-3.5" /> SVG (All)
                                </Button>
                                <Button
                                  onClick={() => handleDownloadEan("png")}
                                  className="h-8 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-xl text-[10px] font-black gap-1"
                                >
                                  <Download className="w-3.5 h-3.5" /> PNG (All)
                                </Button>
                                <Button
                                  onClick={() => handleDownloadEan("jpg")}
                                  className="h-8 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-xl text-[10px] font-black gap-1"
                                >
                                  <Download className="w-3.5 h-3.5" /> JPG (All)
                                </Button>
                                <Button
                                  onClick={() => handleDownloadEan("zip")}
                                  className="h-8 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl text-[10px] font-black gap-1"
                                >
                                  <Download className="w-3.5 h-3.5" /> ZIP Archive
                                </Button>
                              </div>
                            </div>

                            {/* Viewport content */}
                            {(() => {
                              const rawCodes = eanCodesText.split("\n").map(c => c.trim()).filter(Boolean);
                              
                              if (rawCodes.length === 0) {
                                return (
                                  <div className="border border-slate-200 bg-slate-50/55 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[250px]">
                                    <Barcode className="w-12 h-12 text-slate-350 animate-pulse mb-3" />
                                    <p className="text-slate-400 italic text-xs font-semibold">
                                      Enter EAN numbers on the right side panel to see barcode previews.
                                    </p>
                                  </div>
                                );
                              }

                              return (
                                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 max-h-[580px] overflow-y-auto custom-scrollbar p-1">
                                  {rawCodes.map((rawCode, index) => {
                                    const { value, displayValue, error } = getValidEanValue(rawCode, eanType);
                                    
                                    // Scale adjustment
                                    const widthMultiplier = 1.6;
                                    const barcodeHeight = 60 * (eanHeightPercent / 100);
                                    
                                    return (
                                      <div 
                                        key={index} 
                                        className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs flex flex-col justify-between hover:border-orange-300 transition-colors"
                                      >
                                        <div className="flex items-center justify-between pb-2 border-b border-slate-50 mb-3">
                                          <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase text-orange-600 tracking-wider">
                                              Barcode #{index + 1}
                                            </span>
                                            {error && (
                                              <span className="text-[8px] font-bold text-rose-500 mt-0.5 max-w-[150px]">
                                                ⚠️ {error}
                                              </span>
                                            )}
                                          </div>
                                          
                                          <div className="flex gap-1">
                                            <Button
                                              onClick={() => handleDownloadSingleEan(index, value, "svg")}
                                              variant="ghost"
                                              className="h-6 w-6 p-0 hover:bg-slate-100 text-slate-550 rounded-lg"
                                              title="Download SVG"
                                            >
                                              <Download className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button
                                              onClick={() => handleDownloadSingleEan(index, value, "png")}
                                              variant="ghost"
                                              className="h-6 w-6 p-0 hover:bg-slate-100 text-slate-550 rounded-lg"
                                              title="Download PNG"
                                            >
                                              <span className="text-[8px] font-black uppercase text-slate-650">PNG</span>
                                            </Button>
                                          </div>
                                        </div>

                                        <div 
                                          id={`ean-svg-${index}`}
                                          className="flex items-center justify-center py-4 border border-dashed border-slate-100 rounded-xl overflow-hidden"
                                          style={{ 
                                            backgroundColor: eanBgTransparent ? "transparent" : eanBgColor,
                                            paddingLeft: `${eanMarginLeft}px`,
                                            paddingRight: `${eanMarginRight}px`,
                                            paddingTop: `${eanMarginTop}px`,
                                            paddingBottom: `${eanMarginBottom}px`,
                                          }}
                                        >
                                          <BarcodeComponent
                                            value={value}
                                            format={eanType}
                                            width={widthMultiplier}
                                            height={barcodeHeight}
                                            displayValue={true}
                                            text={displayValue}
                                            lineColor={eanFgColor}
                                            background="transparent"
                                            fontSize={12}
                                          />
                                        </div>
                                        
                                        <div className="mt-3 text-center">
                                          <span className="text-[10px] font-mono font-extrabold text-slate-600 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">
                                            Value: {value}
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            })()}
                          </div>
                         ) : tool === "barcode-creator" ? (
                          <div className="space-y-6 w-full flex flex-col items-center justify-center text-slate-800">
                            <div className="flex items-center justify-between w-full pb-2 border-b border-slate-100">
                              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                                Barcode Preview
                              </h4>
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => handleDownloadBarcode("svg")}
                                  className="h-8 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-xl text-[10px] font-black gap-1"
                                >
                                  <Download className="w-3.5 h-3.5" /> SVG
                                </Button>
                                <Button
                                  onClick={() => handleDownloadBarcode("png")}
                                  className="h-8 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-xl text-[10px] font-black gap-1"
                                >
                                  <Download className="w-3.5 h-3.5" /> PNG
                                </Button>
                                <Button
                                  onClick={() => handleDownloadBarcode("jpg")}
                                  className="h-8 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-xl text-[10px] font-black gap-1"
                                >
                                  <Download className="w-3.5 h-3.5" /> JPG
                                </Button>
                              </div>
                            </div>

                            <div 
                              ref={barcodeRef}
                              className="bg-white p-8 rounded-3xl border border-slate-150 shadow-xs flex items-center justify-center w-full min-h-[250px]"
                            >
                              {barcodeVal ? (
                                (() => {
                                  const err = getBarcodeValidationError(barcodeVal, barcodeFormatOption);
                                  if (err) {
                                    return (
                                      <div className="text-center p-4 border border-rose-105 rounded-2xl bg-rose-50/50 max-w-sm flex flex-col items-center gap-2">
                                        <AlertCircle className="w-8 h-8 text-rose-505 animate-pulse" />
                                        <span className="text-xs font-black text-rose-600 uppercase tracking-wider">Invalid Symbology Value</span>
                                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{err}</p>
                                      </div>
                                    );
                                  }
                                  return (
                                    <BarcodeErrorBoundary
                                      key={`${barcodeVal}_${barcodeFormatOption}_${barcodeBarWidthPx}_${barcodeHeightPx}_${barcodeMarginPx}_${barcodeShowText}`}
                                      fallback={(errorMsg) => (
                                        <div className="text-center p-4 border border-rose-105 rounded-2xl bg-rose-50/50 max-w-sm flex flex-col items-center gap-2">
                                          <AlertCircle className="w-8 h-8 text-rose-500 animate-pulse" />
                                          <span className="text-xs font-black text-rose-600 uppercase tracking-wider">Rendering Error</span>
                                          <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{errorMsg}</p>
                                        </div>
                                      )}
                                    >
                                      <BarcodeComponent
                                        value={barcodeVal}
                                        format={(barcodeFormatOption as any) || "CODE128"}
                                        width={barcodeBarWidthPx}
                                        height={barcodeHeightPx}
                                        margin={barcodeMarginPx}
                                        displayValue={barcodeShowText}
                                        background="transparent"
                                      />
                                    </BarcodeErrorBoundary>
                                  );
                                })()
                              ) : (
                                <div className="text-slate-400 italic text-xs font-medium">
                                  Enter a value on the left to generate barcode.
                                </div>
                              )}
                            </div>
                          </div>
                        ) : tool === "qr-creator" ? (
                          <div className="space-y-6 w-full flex flex-col items-center justify-center text-slate-800">
                            <div className="flex items-center justify-between w-full pb-2 border-b border-slate-100">
                              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                                QR Code Preview
                              </h4>
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => handleDownloadQr("svg")}
                                  className="h-8 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-xl text-[10px] font-black gap-1"
                                >
                                  <Download className="w-3.5 h-3.5" /> SVG
                                </Button>
                                <Button
                                  onClick={() => handleDownloadQr("png")}
                                  className="h-8 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-xl text-[10px] font-black gap-1"
                                >
                                  <Download className="w-3.5 h-3.5" /> PNG
                                </Button>
                                <Button
                                  onClick={() => handleDownloadQr("jpg")}
                                  className="h-8 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-xl text-[10px] font-black gap-1"
                                >
                                  <Download className="w-3.5 h-3.5" /> JPG
                                </Button>
                              </div>
                            </div>

                            <div 
                              className="bg-white p-8 rounded-3xl border border-slate-150 shadow-xs flex items-center justify-center w-full min-h-[280px]"
                              style={{ backgroundColor: qrBgColor }}
                            >
                              {qrSvgString ? (
                                <div 
                                  className="w-full max-w-[280px] flex items-center justify-center"
                                  dangerouslySetInnerHTML={{ __html: qrSvgString }}
                                />
                              ) : (
                                <div className="text-slate-400 italic text-xs font-medium bg-white p-4 rounded-xl border border-slate-100">
                                  Enter values on the right to generate QR code.
                                </div>
                              )}
                            </div>
                          </div>
                        ) : null
                      ) : (
                        <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center p-4 min-h-[300px] max-h-[450px]">
                          {previewUrls[0] ? (
                            <div className="relative max-h-full max-w-full flex items-center justify-center overflow-hidden">
                              <div className="relative rounded-xl overflow-hidden shadow-md">
                                {(uploadedFiles[0]?.name.toLowerCase().endsWith(".html") || uploadedFiles[0]?.name.toLowerCase().endsWith(".htm") || uploadedFiles[0]?.type === "text/html") ? (
                                  <iframe
                                    src={previewUrls[0]}
                                    srcDoc={htmlFileText || undefined}
                                    className="w-full min-w-[320px] sm:min-w-[550px] md:min-w-[700px] h-[360px] border-0 rounded-xl bg-white shadow-xs"
                                    title="Uploaded HTML Live Preview"
                                  />
                                ) : (
                                  <img
                                    src={previewUrls[0]}
                                    className="max-h-[380px] object-contain"
                                    alt="Uploaded preview"
                                    style={{
                                      transform: tool === "rotate-image" 
                                        ? `rotate(${rotateAngle}deg) scaleX(${flipMode === "horizontal" ? -1 : 1}) scaleY(${flipMode === "vertical" ? -1 : 1})`
                                        : "none",
                                      transition: "transform 0.3s ease-in-out",
                                    }}
                                  />
                                )}
                                {tool === "watermark-image" && wmType === "text" && (
                                  <div
                                    className={`absolute font-black tracking-wider whitespace-nowrap pointer-events-none select-none transition-transform duration-300 ${
                                      wmPosition === "top_left" ? "top-4 left-4 origin-top-left" :
                                      wmPosition === "top_right" ? "top-4 right-4 origin-top-right" :
                                      wmPosition === "bottom_left" ? "bottom-4 left-4 origin-bottom-left" :
                                      wmPosition === "bottom_right" ? "bottom-4 right-4 origin-bottom-right" :
                                      "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                                    }`}
                                    style={{
                                      color: wmColor,
                                      fontSize: `${Math.max(10, Math.min(48, Number(wmFontSize) / 2))}px`,
                                      opacity: wmOpacity,
                                      textShadow: "0 0 4px rgba(0,0,0,0.5)",
                                      transform: wmPosition === "center"
                                        ? `translate(-50%, -50%) rotate(${wmRotation}deg)`
                                        : `rotate(${wmRotation}deg)`,
                                    }}
                                  >
                                    {wmText}
                                  </div>
                                )}
                                {tool === "watermark-image" && wmType === "image" && watermarkFile && (
                                  <div
                                    className={`absolute pointer-events-none select-none max-w-[20%] max-h-[20%] p-1 bg-white/30 backdrop-blur-sm rounded-lg border border-white/20 shadow-sm transition-transform duration-300 ${
                                      wmPosition === "top_left" ? "top-4 left-4 origin-top-left" :
                                      wmPosition === "top_right" ? "top-4 right-4 origin-top-right" :
                                      wmPosition === "bottom_left" ? "bottom-4 left-4 origin-bottom-left" :
                                      wmPosition === "bottom_right" ? "bottom-4 right-4 origin-bottom-right" :
                                      "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                                    }`}
                                    style={{
                                      opacity: wmOpacity,
                                      transform: wmPosition === "center"
                                        ? `translate(-50%, -50%) rotate(${wmRotation}deg)`
                                        : `rotate(${wmRotation}deg)`,
                                    }}
                                  >
                                    <img src={watermarkPreviewUrl} className="object-contain rounded" alt="Watermark logo" />
                                  </div>
                                )}
                                {tool === "crop-image" && (
                                  <div
                                    ref={containerRef}
                                    className="absolute inset-0 select-none cursor-crosshair overflow-hidden"
                                  >
                                    {/* Dynamic SVG Mask for crisp background dimming around selected shape */}
                                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                                      <defs>
                                        <mask id="crop-shape-mask">
                                          <rect x="0" y="0" width="100" height="100" fill="white" />
                                          {cropShape === "circle" && (
                                            <ellipse cx={cropPercent.x + cropPercent.w / 2} cy={cropPercent.y + cropPercent.h / 2} rx={cropPercent.w / 2} ry={cropPercent.h / 2} fill="black" />
                                          )}
                                          {cropShape === "rectangle" && (
                                            <rect x={cropPercent.x} y={cropPercent.y} width={cropPercent.w} height={cropPercent.h} fill="black" />
                                          )}
                                          {cropShape === "rounded_rect" && (
                                            <path d={getRoundedRectPath(cropPercent.x, cropPercent.y, cropPercent.w, cropPercent.h)} fill="black" />
                                          )}
                                          {cropShape === "triangle" && (
                                            <polygon points={`${cropPercent.x + cropPercent.w / 2},${cropPercent.y} ${cropPercent.x + cropPercent.w},${cropPercent.y + cropPercent.h} ${cropPercent.x},${cropPercent.y + cropPercent.h}`} fill="black" />
                                          )}
                                          {cropShape === "star" && (
                                            <polygon points={Array.from({ length: 10 }).map((_, i) => {
                                              const r_ratio = i % 2 === 0 ? 1 : 0.4;
                                              const angle = (i * Math.PI) / 5 - Math.PI / 2;
                                              const cx = cropPercent.x + cropPercent.w / 2;
                                              const cy = cropPercent.y + cropPercent.h / 2;
                                              const rx = cropPercent.w / 2;
                                              const ry = cropPercent.h / 2;
                                              return `${(cx + rx * r_ratio * Math.cos(angle)).toFixed(2)},${(cy + ry * r_ratio * Math.sin(angle)).toFixed(2)}`;
                                            }).join(" ")} fill="black" />
                                          )}
                                        </mask>
                                      </defs>
                                      <rect x="0" y="0" width="100" height="100" fill="rgba(15, 23, 42, 0.65)" mask="url(#crop-shape-mask)" />
                                      {/* Crisp SVG Dashed Outline */}
                                      {cropShape === "circle" && (
                                        <ellipse cx={cropPercent.x + cropPercent.w / 2} cy={cropPercent.y + cropPercent.h / 2} rx={cropPercent.w / 2} ry={cropPercent.h / 2} fill="none" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="2 2" />
                                      )}
                                      {cropShape === "rectangle" && (
                                        <rect x={cropPercent.x} y={cropPercent.y} width={cropPercent.w} height={cropPercent.h} fill="none" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="2 2" />
                                      )}
                                      {cropShape === "rounded_rect" && (
                                        <path d={getRoundedRectPath(cropPercent.x, cropPercent.y, cropPercent.w, cropPercent.h)} fill="none" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="2 2" />
                                      )}
                                      {cropShape === "triangle" && (
                                        <polygon points={`${cropPercent.x + cropPercent.w / 2},${cropPercent.y} ${cropPercent.x + cropPercent.w},${cropPercent.y + cropPercent.h} ${cropPercent.x},${cropPercent.y + cropPercent.h}`} fill="none" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="2 2" />
                                      )}
                                      {cropShape === "star" && (
                                        <polygon points={Array.from({ length: 10 }).map((_, i) => {
                                          const r_ratio = i % 2 === 0 ? 1 : 0.4;
                                          const angle = (i * Math.PI) / 5 - Math.PI / 2;
                                          const cx = cropPercent.x + cropPercent.w / 2;
                                          const cy = cropPercent.y + cropPercent.h / 2;
                                          const rx = cropPercent.w / 2;
                                          const ry = cropPercent.h / 2;
                                          return `${(cx + rx * r_ratio * Math.cos(angle)).toFixed(2)},${(cy + ry * r_ratio * Math.sin(angle)).toFixed(2)}`;
                                        }).join(" ")} fill="none" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="2 2" />
                                      )}
                                    </svg>

                                    {/* Draggable and Resizable Handle Box */}
                                    <div
                                      className="absolute z-20 cursor-move"
                                      onMouseDown={(e) => handleContainerMouseDown(e, null)}
                                      style={{
                                        left: `${cropPercent.x}%`,
                                        top: `${cropPercent.y}%`,
                                        width: `${cropPercent.w}%`,
                                        height: `${cropPercent.h}%`,
                                      }}
                                    >
                                      <div className="absolute top-2 left-2 bg-red-500/90 backdrop-blur-sm text-white text-[8px] font-black px-1.5 py-0.5 rounded pointer-events-none select-none uppercase tracking-wider shadow-sm">
                                        {cropShape.replace("_", " ")}
                                      </div>
                                      <div className="absolute bottom-2 right-2 bg-slate-900/90 backdrop-blur-sm text-white text-[8px] font-black px-1.5 py-0.5 rounded pointer-events-none select-none font-mono shadow-sm">
                                        {cropW} x {cropH} px
                                      </div>
                                      <div
                                        className="absolute w-3.5 h-3.5 bg-white border-2 border-red-500 rounded-full -top-1.5 -left-1.5 cursor-nwse-resize hover:scale-125 transition-transform shadow-md z-30"
                                        onMouseDown={(e) => handleContainerMouseDown(e, "tl")}
                                      />
                                      <div
                                        className="absolute w-3.5 h-3.5 bg-white border-2 border-red-500 rounded-full -top-1.5 -right-1.5 cursor-nesw-resize hover:scale-125 transition-transform shadow-md z-30"
                                        onMouseDown={(e) => handleContainerMouseDown(e, "tr")}
                                      />
                                      <div
                                        className="absolute w-3.5 h-3.5 bg-white border-2 border-red-500 rounded-full -bottom-1.5 -left-1.5 cursor-nesw-resize hover:scale-125 transition-transform shadow-md z-30"
                                        onMouseDown={(e) => handleContainerMouseDown(e, "bl")}
                                      />
                                      <div
                                        className="absolute w-3.5 h-3.5 bg-white border-2 border-red-500 rounded-full -bottom-1.5 -right-1.5 cursor-nwse-resize hover:scale-125 transition-transform shadow-md z-30"
                                        onMouseDown={(e) => handleContainerMouseDown(e, "br")}
                                      />
                                    </div>
                                  </div>
                                )}
                                {tool === "resize-image" && (
                                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-black px-3 py-1.5 rounded-full shadow-lg border border-white/10 uppercase tracking-wider flex items-center gap-1.5 select-none">
                                    Resize Target: {width || "?"} x {height || "?"} px
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                              <ImageIcon className="w-10 h-10 text-slate-350" />
                              <span className="text-xs font-semibold">Generating preview...</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  {category === "pdf" && uploadedFiles.length > 0 && (
                    <div className="space-y-4">
                      {(() => {
                        const file = uploadedFiles[0];
                        const nameLower = file.name.toLowerCase();
                        const isPdf = nameLower.endsWith(".pdf");
                        const isWord = nameLower.endsWith(".docx") || nameLower.endsWith(".doc");
                        const isExcel = nameLower.endsWith(".xlsx") || nameLower.endsWith(".xls");
                        const isPpt = nameLower.endsWith(".pptx") || nameLower.endsWith(".ppt");
                        let fileColor = "#ef4444";
                        let bgColor = "bg-red-50";
                        let borderColor = "border-red-100";
                        let badgeText = `PDF: ${pdfPageCount} ${pdfPageCount === 1 ? "Page" : "Pages"}`;
                        let IconComponent = FileText;
                        if (isWord) {
                          fileColor = "#3b82f6";
                          bgColor = "bg-blue-50";
                          borderColor = "border-blue-100";
                          badgeText = "Word Document";
                        } else if (isExcel) {
                          fileColor = "#10b981";
                          bgColor = "bg-emerald-50";
                          borderColor = "border-emerald-100";
                          badgeText = "Excel Spreadsheet";
                          IconComponent = FileSpreadsheet;
                        } else if (isPpt) {
                          fileColor = "#f97316";
                          bgColor = "bg-orange-50";
                          borderColor = "border-orange-100";
                          badgeText = "PowerPoint Slides";
                          IconComponent = FileImage;
                        }
                        return (
                          <div className="border border-slate-200 bg-slate-50/50 rounded-2xl p-4 space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-200/50">
                              <div className="flex items-center gap-2.5">
                                <div className={`w-8 h-8 rounded-xl ${bgColor} border ${borderColor} flex items-center justify-center`}>
                                  <IconComponent className="w-4.5 h-4.5" style={{ color: fileColor }} />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-black text-slate-800 truncate max-w-[240px]">{file.name}</p>
                                  <p className="text-[9px] text-slate-400 font-bold">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge 
                                  variant="outline" 
                                  className="font-bold text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                                  style={{ color: fileColor, backgroundColor: `${fileColor}10`, borderColor: `${fileColor}20` }}
                                >
                                  {badgeText}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setUploadedFiles([]);
                                    setBulkResults({});
                                    setMergedFile(null);
                                    setDownloadBlobUrl(null);
                                    setProcessedSize(null);
                                    setStatus("idle");
                                  }}
                                  className="w-7 h-7 rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50 border border-slate-200/50 shadow-sm"
                                  title="Remove File"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </div>
                            {isPdf ? (
                              tool === "organise-pdf" ? (
                                <div className="space-y-4">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Arrange Page Sequence:</span>
                                    <span className="text-[9px] text-slate-400 italic font-bold">Drag pages to reorder, or use arrow buttons below</span>
                                  </div>
                                  <div className="flex flex-wrap gap-3 p-2.5 border border-slate-200 bg-white rounded-2xl shadow-sm">
                                    {activeSeq.map((pNum, idx) => (
                                      <div
                                        key={`${pNum}_${idx}`}
                                        draggable
                                        onDragStart={(e) => {
                                          setDraggedIdx(idx);
                                          e.dataTransfer.effectAllowed = "move";
                                        }}
                                        onDragOver={(e) => {
                                          e.preventDefault();
                                          if (draggedIdx !== null && draggedIdx !== idx) {
                                            setDragOverIdx(idx);
                                          }
                                        }}
                                        onDragLeave={() => {
                                          if (dragOverIdx === idx) {
                                            setDragOverIdx(null);
                                          }
                                        }}
                                        onDrop={(e) => {
                                          e.preventDefault();
                                          if (draggedIdx !== null && draggedIdx !== idx) {
                                            swapPages(draggedIdx, idx);
                                          }
                                          setDraggedIdx(null);
                                          setDragOverIdx(null);
                                        }}
                                        onDragEnd={() => {
                                          setDraggedIdx(null);
                                          setDragOverIdx(null);
                                        }}
                                        className={`group relative border-2 rounded-2xl p-2 flex flex-col items-center justify-between aspect-[3/4] w-28 text-center shadow-md cursor-grab active:cursor-grabbing transition-all duration-200 ${
                                          dragOverIdx === idx
                                            ? "border-orange-600 bg-orange-50/20 scale-[1.03]"
                                            : "border-orange-500 bg-orange-50/5 hover:border-orange-600 hover:bg-orange-50/10"
                                        }`}
                                      >
                                        <Badge className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-orange-600 text-white rounded-full flex items-center justify-center p-0 font-black text-[9px] border border-white">
                                          #{idx + 1}
                                        </Badge>
                                        <div className="w-full h-[62%] bg-white rounded-lg overflow-hidden border border-slate-100 flex items-center justify-center">
                                          <PdfPageThumbnail file={file} pageNum={pNum} />
                                        </div>
                                        <span className="text-[10px] font-black text-orange-700 mt-1">Page {pNum}</span>
                                        <div className="flex items-center gap-0.5 bg-slate-900 rounded-md p-0.5 shadow-md">
                                          <button
                                            onClick={() => movePageInSequence(idx, "left")}
                                            disabled={idx === 0}
                                            className="w-4.5 h-4.5 rounded text-white hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent flex items-center justify-center"
                                            title="Move Left"
                                            type="button"
                                          >
                                            <ChevronUp className="w-2.5 h-2.5 -rotate-95" />
                                          </button>
                                          <button
                                            onClick={() => removePageFromSequence(idx)}
                                            className="w-4.5 h-4.5 rounded text-red-400 hover:bg-white/20 flex items-center justify-center"
                                            title="Delete Page"
                                            type="button"
                                          >
                                            <Trash2 className="w-2.5 h-2.5" />
                                          </button>
                                          <button
                                            onClick={() => movePageInSequence(idx, "right")}
                                            disabled={idx === activeSeq.length - 1}
                                            className="w-4.5 h-4.5 rounded text-white hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent flex items-center justify-center"
                                            title="Move Right"
                                            type="button"
                                          >
                                            <ChevronDown className="w-2.5 h-2.5 -rotate-95" />
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  {omittedPages.length > 0 && (
                                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 space-y-2">
                                      <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Omitted Pages (Will be deleted):</h4>
                                      <div className="flex flex-wrap gap-2">
                                        {omittedPages.map(pNum => (
                                          <button
                                            key={pNum}
                                            onClick={() => addPageToSequence(pNum)}
                                            className="px-2 py-0.5 text-[9px] font-black text-red-650 bg-red-50 hover:bg-orange-50 hover:text-orange-600 border border-red-200 hover:border-orange-200 rounded-lg flex items-center gap-1 transition-colors"
                                            title="Click to restore"
                                            type="button"
                                          >
                                            Page {pNum} +
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="space-y-2.5">
                                  {(() => {
                                    const canSelect = tool === "split-pdf" && (splitTab === "range" || (splitTab === "page" && pageOption === "select"));
                                    return (
                                      <>
                                        {canSelect && (
                                          <div className="flex justify-between items-center text-[10px] font-black text-slate-450 uppercase tracking-wider mb-1">
                                            <span>Select Pages to Extract:</span>
                                            <span className="text-slate-400 normal-case font-bold">(Click thumbnails to toggle page selection)</span>
                                          </div>
                                        )}
                                        <div className="flex flex-wrap gap-4 p-3 border border-slate-200 bg-white rounded-2xl shadow-sm">
                                          {Array.from({ length: pdfPageCount }).map((_, i) => {
                                            const pageNum = i + 1;
                                            const isSelected = canSelect ? isPageInRange(pageNum, ranges) : true;
                                            return (
                                              <button
                                                key={pageNum}
                                                onClick={() => {
                                                  if (canSelect) {
                                                    togglePageInRange(pageNum);
                                                  }
                                                }}
                                                className={`relative rounded-2xl p-2 flex flex-col items-center justify-between aspect-[3/4] w-28 text-center border-2 transition-all hover:scale-[1.03] ${
                                                  isSelected
                                                    ? "border-orange-500 bg-orange-50/10 text-orange-700 shadow-sm"
                                                    : "border-slate-200 bg-slate-50/30 text-slate-400 opacity-60 hover:opacity-80 hover:border-slate-350"
                                                }`}
                                                type="button"
                                              >
                                                {canSelect && isSelected && (
                                                  <Badge className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-orange-600 text-white rounded-full flex items-center justify-center p-0 border border-white">
                                                    ✓
                                                  </Badge>
                                                )}
                                                <div className="w-full h-[78%] bg-white rounded-lg overflow-hidden border border-slate-100 flex items-center justify-center">
                                                  <PdfPageThumbnail file={file} pageNum={pageNum} />
                                                </div>
                                                <span className="text-[10px] font-black mt-1.5">Page {pageNum}</span>
                                              </button>
                                            );
                                          })}
                                        </div>
                                      </>
                                    );
                                  })()}
                                </div>
                              )
                            ) : (
                              <div className="border border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-white space-y-3">
                                <IconComponent className="w-12 h-12 stroke-[1.25]" style={{ color: fileColor }} />
                                <div>
                                  <h4 className="text-xs font-black text-slate-800">Document Loaded Successfully</h4>
                                  <p className="text-[10px] text-slate-400 font-bold mt-1 max-w-[280px]">
                                    Ready to convert. Click the <span className="text-slate-800 font-extrabold">{info.name}</span> button on the right options pane.
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </Card>
              )}
            </>
          )}
        </div>

        {/* Placeholder to reserve space in layout flow for the fixed panel */}
        {!(tool === "compress-image" && (status === "processing" || status === "success")) && 
         tool !== "custom-barcode" && 
         tool !== "custom-invoice" && 
         (uploadedFiles.length > 0 || info.noUpload) && (
          <div 
            className="hidden lg:block lg:shrink-0"
            style={{ 
              width: isMounted && isDesktop ? `${rightPanelWidth}px` : "0px",
            }}
          />
        )}

        {/* Right Resizable Options Panel */}
        {!(tool === "compress-image" && (status === "processing" || status === "success")) && 
         tool !== "custom-barcode" && 
         tool !== "custom-invoice" && 
         (uploadedFiles.length > 0 || info.noUpload) && (
          <div 
            className="w-full lg:shrink-0 lg:fixed lg:right-0 lg:top-[70px] lg:bottom-0 relative bg-white border-l border-slate-200/80 rounded-none lg:rounded-l-3xl shadow-sm overflow-hidden flex flex-col z-20"
            style={{ 
              width: isMounted && isDesktop ? `${rightPanelWidth}px` : "100%",
              height: isMounted && isDesktop ? "calc(100vh - 70px)" : "auto",
            }}
          >
          {/* Resize handle bar on the left edge (only visible on desktop) */}
          <div
            onMouseDown={handleResizeStart}
            className="hidden lg:block absolute left-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-orange-500/20 active:bg-orange-655 transition-all z-50 group"
          >
            {/* Subtle line for drag affordance */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-12 bg-slate-350 rounded group-hover:bg-orange-600 transition-colors" />
          </div>

          {/* Inner scrollable wrapper */}
          <div className="p-6 overflow-y-auto flex-1 space-y-5 custom-scrollbar">
            <div className="flex items-center gap-2 pb-3 border-b">
              <Settings className="w-4 h-4 text-slate-500" />
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Tool Options</h3>
            </div>

            {/* Custom inputs per tool */}
            <div className="space-y-4">
              {/* PDF MERGE */}
              {tool === "merge-pdf" && (
                <div className="space-y-3">
                  <div className="text-center text-xs font-semibold text-slate-400 p-4 border border-dashed rounded-xl">
                    <HelpCircle className="w-6 h-6 mx-auto text-slate-300 mb-1" />
                    No extra settings. Rearrange the files in the workspace grid to set the final merge order.
                  </div>
                  {uploadedFiles.length < 2 && (
                    <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200/50 rounded-2xl text-red-800 animate-fade-in">
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <h4 className="text-[10px] font-black uppercase tracking-wider">Merge Requirement</h4>
                        <p className="text-[9px] font-semibold mt-0.5 leading-relaxed">
                          Please select at least 2 PDF files to merge.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* PDF SPLIT */}
              {tool === "split-pdf" && (
                <div className="space-y-5 animate-fade-in">
                  {/* Wobbly Switch for Range vs Page */}
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400">Split Mode</Label>
                    <div className="relative w-full h-11 bg-slate-100 rounded-2xl p-1 flex items-center cursor-pointer select-none">
                      {/* Wobbly sliding background */}
                      <motion.div
                        className="absolute top-1 bottom-1 left-1 bg-white rounded-xl shadow-md border border-slate-200/50"
                        style={{ width: "calc(50% - 4px)" }}
                        animate={{
                          x: splitTab === "range" ? 0 : "100%",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 280,
                          damping: 18,
                        }}
                      />
                      {/* Option 1: Range */}
                      <div
                        onClick={() => setSplitTab("range")}
                        className={`flex-1 text-center py-2 text-xs font-black relative z-10 transition-colors ${
                          splitTab === "range" ? "text-slate-800" : "text-slate-450 hover:text-slate-700"
                        }`}
                      >
                        Range Split
                      </div>
                      {/* Option 2: Page */}
                      <div
                        onClick={() => setSplitTab("page")}
                        className={`flex-1 text-center py-2 text-xs font-black relative z-10 transition-colors ${
                          splitTab === "page" ? "text-slate-800" : "text-slate-450 hover:text-slate-700"
                        }`}
                      >
                        Page Split
                      </div>
                    </div>
                  </div>

                  {/* Range Mode Options */}
                  {splitTab === "range" && (
                    <div className="space-y-3 animate-fade-in">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400">Page Ranges</Label>
                        <Input
                          value={ranges}
                          onChange={(e) => setRanges(e.target.value)}
                          placeholder="e.g. 1-3, 5"
                          className="rounded-xl border-slate-200 h-10 text-xs font-semibold"
                        />
                        <p className="text-[9px] text-slate-400 font-semibold leading-relaxed">
                          Enter comma-separated page ranges (e.g. 1-5, 8, 11-12) to merge into a single PDF.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Page Mode Options */}
                  {splitTab === "page" && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400">Extraction Style</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setPageOption("all");
                              setRanges(""); // Clear ranges so it extracts all pages
                            }}
                            className={`h-10 rounded-xl text-xs font-black border transition-all ${
                              pageOption === "all"
                                ? "bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-950/10"
                                : "bg-white border-slate-200 text-slate-650 hover:bg-slate-50"
                            }`}
                          >
                            All Pages
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setPageOption("select");
                              setRanges("1"); // Default to page 1
                            }}
                            className={`h-10 rounded-xl text-xs font-black border transition-all ${
                              pageOption === "select"
                                ? "bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-950/10"
                                : "bg-white border-slate-200 text-slate-655 hover:bg-slate-50"
                            }`}
                          >
                            Select Pages
                          </button>
                        </div>
                      </div>

                      {pageOption === "select" && (
                        <div className="space-y-2 animate-fade-in">
                          <Label className="text-[10px] font-black uppercase text-slate-400">Selected Pages</Label>
                          <Input
                            value={ranges}
                            onChange={(e) => setRanges(e.target.value)}
                            placeholder="e.g. 1, 3, 5"
                            className="rounded-xl border-slate-200 h-10 text-xs font-semibold"
                          />
                          <p className="text-[9px] text-slate-400 font-semibold leading-relaxed">
                            Click page thumbnails on the workspace grid to toggle selection, or type page numbers directly.
                          </p>
                        </div>
                      )}

                      <p className="text-[9px] text-slate-405 font-bold italic leading-normal">
                        Note: This mode will split the selected/all pages into individual PDF files and pack them into a single ZIP file.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* PDF COMPRESS */}
              {tool === "compress-pdf" && (
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400">Compression Level</Label>
                  <Select value={compressionLevel} onValueChange={setCompressionLevel}>
                    <SelectTrigger className="rounded-xl border-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Compression (High Quality)</SelectItem>
                      <SelectItem value="medium">Medium Compression (Recommended)</SelectItem>
                      <SelectItem value="high">High Compression (Lower Quality)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* PDF UNLOCK / PROTECT */}
              {(tool === "unlock-pdf" || tool === "protect-pdf") && (
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400">
                    {tool === "unlock-pdf" ? "Decryption Password" : "Encryption Password"}
                  </Label>
                  <Input
                    type="password"
                    placeholder="Enter password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-xl border-slate-200"
                  />
                </div>
              )}

              {/* PDF ORGANIZE */}
              {tool === "organise-pdf" && (
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400">New Page Order</Label>
                  <Input
                    value={orderStr}
                    onChange={(e) => setOrderStr(e.target.value)}
                    placeholder="e.g. 3,1,2,5"
                    className="rounded-xl border-slate-200"
                  />
                  <p className="text-[9px] text-slate-400 font-semibold">
                    Enter the page numbers in your preferred order. Omitted page numbers will be deleted.
                  </p>
                </div>
              )}

              {/* IMAGE COMPRESS */}
              {tool === "compress-image" && (
                <div className="space-y-4">
                  {/* Compression Mode Switch (Wobbly style) */}
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400">Compression Mode</Label>
                    <div className="relative w-full h-11 bg-slate-100 rounded-2xl p-1 flex items-center cursor-pointer select-none">
                      {/* Wobbly sliding background */}
                      <motion.div
                        className="absolute top-1 bottom-1 left-1 bg-white rounded-xl shadow-md border border-slate-200/50"
                        style={{ width: "calc(50% - 4px)" }}
                        animate={{
                          x: compressTab === "quality" ? 0 : "100%",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 280,
                          damping: 18,
                        }}
                      />
                      {/* Option 1: Quality */}
                      <div
                        onClick={() => setCompressTab("quality")}
                        className={`flex-1 text-center py-2 text-xs font-black relative z-10 transition-colors ${
                          compressTab === "quality" ? "text-slate-800" : "text-slate-450 hover:text-slate-700"
                        }`}
                      >
                        Quality Mode
                      </div>
                      {/* Option 2: Size */}
                      <div
                        onClick={() => setCompressTab("size")}
                        className={`flex-1 text-center py-2 text-xs font-black relative z-10 transition-colors ${
                          compressTab === "size" ? "text-slate-800" : "text-slate-450 hover:text-slate-700"
                        }`}
                      >
                        Size Mode
                      </div>
                    </div>
                  </div>

                  {/* Quality Mode Option */}
                  {compressTab === "quality" && (
                    <div className="space-y-1.5 animate-fade-in">
                      <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                        <span>Quality Level</span>
                        <span className="text-slate-800">{quality}%</span>
                      </div>
                      <Slider
                        defaultValue={[quality]}
                        max={100}
                        min={5}
                        step={5}
                        onValueChange={(val) => setQuality(val[0])}
                        className="py-2"
                      />
                      <p className="text-[9px] text-slate-400 font-semibold">
                        Lower quality reduces file size further. 80% is recommended.
                      </p>
                    </div>
                  )}

                  {/* Size Mode Option */}
                  {compressTab === "size" && (
                    <div className="space-y-1.5 animate-fade-in">
                      <Label className="text-[10px] font-black uppercase text-slate-400">Target Size Limit</Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="e.g. 100"
                          value={targetSizeKb}
                          onChange={(e) => setTargetSizeKb(e.target.value)}
                          className="rounded-xl border-slate-200 text-xs"
                        />
                        <Badge variant="outline" className="shrink-0 h-10 border-slate-200 flex items-center justify-center font-bold px-3">
                          KB
                        </Badge>
                      </div>
                      <p className="text-[9px] text-slate-400 font-semibold">
                        Automatically reduces quality/resolution to fit under this target size limit.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* IMAGE RESIZE */}
              {tool === "resize-image" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400">Width (px)</Label>
                      <Input
                        type="number"
                        placeholder="Width"
                        value={width}
                        onChange={(e) => handleWidthChange(e.target.value)}
                        className="rounded-xl border-slate-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400">Height (px)</Label>
                      <Input
                        type="number"
                        placeholder="Height"
                        value={height}
                        onChange={(e) => handleHeightChange(e.target.value)}
                        className="rounded-xl border-slate-200"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <Label htmlFor="maintain-aspect" className="text-xs font-semibold text-slate-600">
                      Maintain Aspect Ratio
                    </Label>
                    <Switch
                      id="maintain-aspect"
                      checked={maintainAspect}
                      onCheckedChange={handleMaintainAspectToggle}
                    />
                  </div>
                </div>
              )}

              {/* IMAGE CROP */}
              {tool === "crop-image" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400">Crop Shape Selection</Label>
                    <div className="relative w-full h-11 bg-slate-100/90 rounded-2xl p-1 flex items-center select-none border border-slate-200/60">
                      <div className="relative w-full h-full flex items-center">
                        {/* Wobbly sliding background */}
                        <motion.div
                          className="absolute top-0 bottom-0 bg-slate-900 rounded-xl shadow-md"
                          style={{ width: "20%" }}
                          animate={{
                            left: cropShape === "rectangle" ? "0%" : cropShape === "circle" ? "20%" : cropShape === "triangle" ? "40%" : cropShape === "rounded_rect" ? "60%" : "80%",
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 350,
                            damping: 25,
                          }}
                        />
                        {/* Option 1: Rectangle */}
                        <button
                          type="button"
                          title="Rectangle (Square)"
                          onClick={() => setCropShape("rectangle")}
                          className={`flex-1 h-full flex items-center justify-center relative z-10 transition-colors ${
                            cropShape === "rectangle" ? "text-white" : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          <Square className="w-4.5 h-4.5" />
                        </button>
                        {/* Option 2: Circle */}
                        <button
                          type="button"
                          title="Circle (Round)"
                          onClick={() => setCropShape("circle")}
                          className={`flex-1 h-full flex items-center justify-center relative z-10 transition-colors ${
                            cropShape === "circle" ? "text-white" : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          <Circle className="w-4.5 h-4.5" />
                        </button>
                        {/* Option 3: Triangle */}
                        <button
                          type="button"
                          title="Triangle"
                          onClick={() => setCropShape("triangle")}
                          className={`flex-1 h-full flex items-center justify-center relative z-10 transition-colors ${
                            cropShape === "triangle" ? "text-white" : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          <Triangle className="w-4.5 h-4.5" />
                        </button>
                        {/* Option 4: Rounded Rect */}
                        <button
                          type="button"
                          title="Rounded Rectangle"
                          onClick={() => setCropShape("rounded_rect")}
                          className={`flex-1 h-full flex items-center justify-center relative z-10 transition-colors ${
                            cropShape === "rounded_rect" ? "text-white" : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          <Maximize2 className="w-4.5 h-4.5" />
                        </button>
                        {/* Option 5: Star */}
                        <button
                          type="button"
                          title="Star"
                          onClick={() => setCropShape("star")}
                          className={`flex-1 h-full flex items-center justify-center relative z-10 transition-colors ${
                            cropShape === "star" ? "text-white" : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          <Star className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 space-y-2.5">
                    <div className="text-[10px] font-black uppercase text-slate-400">Selected Crop Area</div>
                    <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-600">
                      <div>Position: <span className="font-mono text-slate-800">{cropX}px, {cropY}px</span></div>
                      <div>Dimensions: <span className="font-mono text-slate-800">{cropW}px x {cropH}px</span></div>
                    </div>
                    <p className="text-[9px] text-slate-400 leading-relaxed font-semibold">
                      Drag the box in the live preview to move, and use the corner handles to resize.
                    </p>
                  </div>

                  {cropShape === "rounded_rect" && (
                    <div className="space-y-4 pt-2 border-t border-slate-100 animate-fade-in bg-slate-50 border border-slate-100 rounded-2xl p-3.5">
                      <div className="space-y-3">
                        <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                          <span>Corner Roundness</span>
                          <span className="text-slate-850 font-black">{borderRadiusPercent}%</span>
                        </div>
                        <Slider
                          value={[borderRadiusPercent]}
                          max={50}
                          min={1}
                          step={1}
                          onValueChange={(val) => setBorderRadiusPercent(val[0])}
                          className="py-1"
                        />
                      </div>
                      <div className="space-y-2.5">
                        <Label className="text-[10px] font-black uppercase text-slate-400">Select Corners to Round</Label>
                        <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-slate-600">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id="round-tl"
                              checked={roundTL}
                              onCheckedChange={(checked) => setRoundTL(!!checked)}
                            />
                            <label htmlFor="round-tl" className="cursor-pointer selection:bg-transparent">Top-Left</label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id="round-tr"
                              checked={roundTR}
                              onCheckedChange={(checked) => setRoundTR(!!checked)}
                            />
                            <label htmlFor="round-tr" className="cursor-pointer selection:bg-transparent">Top-Right</label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id="round-bl"
                              checked={roundBL}
                              onCheckedChange={(checked) => setRoundBL(!!checked)}
                            />
                            <label htmlFor="round-bl" className="cursor-pointer selection:bg-transparent">Bottom-Left</label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id="round-br"
                              checked={roundBR}
                              onCheckedChange={(checked) => setRoundBR(!!checked)}
                            />
                            <label htmlFor="round-br" className="cursor-pointer selection:bg-transparent">Bottom-Right</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* IMAGE CONVERT FROM JPG */}
              {tool === "convert-from-jpg" && (
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400">Target Format</Label>
                  <Select value={targetFormat} onValueChange={setTargetFormat}>
                    <SelectTrigger className="rounded-xl border-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PNG">PNG</SelectItem>
                      <SelectItem value="WEBP">WebP</SelectItem>
                      <SelectItem value="SVG">SVG (Vector wrap)</SelectItem>
                      <SelectItem value="GIF">GIF</SelectItem>
                      <SelectItem value="AVIF">AVIF</SelectItem>
                      <SelectItem value="HEIC/HEIF">HEIC/HEIF</SelectItem>
                      <SelectItem value="TIFF">TIFF</SelectItem>
                      <SelectItem value="BMP">BMP</SelectItem>
                      <SelectItem value="ICO">ICO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* IMAGE UPSCALE */}
              {tool === "upscale-image" && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-slate-400">Upscaling Factor</Label>
                    <Select value={scaleFactor} onValueChange={setScaleFactor}>
                      <SelectTrigger className="rounded-xl border-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1.5">1.5x Scaling</SelectItem>
                        <SelectItem value="2">2x Scaling</SelectItem>
                        <SelectItem value="3">3x Scaling</SelectItem>
                        <SelectItem value="4">4x Scaling (HD)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1 border-t pt-3">
                    <Label className="text-[10px] font-black uppercase text-slate-400">Resampling Method</Label>
                    <Select value={resampleFilter} onValueChange={setResampleFilter}>
                      <SelectTrigger className="rounded-xl border-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lanczos">Lanczos (Highest Quality)</SelectItem>
                        <SelectItem value="bicubic">Bicubic (Sharp/Clean)</SelectItem>
                        <SelectItem value="bilinear">Bilinear (Smooth)</SelectItem>
                        <SelectItem value="nearest">Nearest (Pixel Art / Retro)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3 border-t pt-3">
                    <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                      <span>Sharpen Enhancement</span>
                      <span className="text-slate-800">{sharpenFactor === 1.0 ? "None" : `${Math.round(sharpenFactor * 100)}%`}</span>
                    </div>
                    <Slider
                      defaultValue={[sharpenFactor]}
                      max={3.0}
                      min={0.5}
                      step={0.1}
                      onValueChange={(val) => setSharpenFactor(val[0])}
                      className="py-1"
                    />
                    <p className="text-[9px] text-slate-400 font-semibold">
                      Adjust to increase edge detail sharpness after upscaling.
                    </p>
                  </div>
                </div>
              )}

              {/* IMAGE BLUR FACE */}
              {tool === "blur-face" && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                      <span>Blur Face Strength</span>
                      <span className="text-slate-800">{blurStrength}%</span>
                    </div>
                    <Slider
                      defaultValue={[blurStrength]}
                      max={100}
                      min={10}
                      step={5}
                      onValueChange={(val) => setBlurStrength(val[0])}
                      className="py-1"
                    />
                    <p className="text-[9px] text-slate-400 font-semibold">
                      Adjust the intensity of the blur applied to detected faces.
                    </p>
                  </div>
                </div>
              )}

              {/* IMAGE WATERMARK */}
              {tool === "watermark-image" && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-slate-400">Watermark Type</Label>
                    <Select value={wmType} onValueChange={setWmType}>
                      <SelectTrigger className="rounded-xl border-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text Watermark</SelectItem>
                        <SelectItem value="image">Image Logo overlay</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {wmType === "text" ? (
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <Label className="text-[10px] font-black uppercase text-slate-400">Watermark Text</Label>
                        <Input
                          value={wmText}
                          onChange={(e) => setWmText(e.target.value)}
                          placeholder="CONFIDENTIAL"
                          className="rounded-xl border-slate-200"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-[10px] font-black uppercase text-slate-400">Font Size</Label>
                          <Input
                            type="number"
                            value={wmFontSize}
                            onChange={(e) => setWmFontSize(e.target.value)}
                            className="rounded-xl border-slate-200"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] font-black uppercase text-slate-400">Color</Label>
                          <div className="flex gap-2">
                            <Input
                              type="color"
                              value={wmColor}
                              onChange={(e) => setWmColor(e.target.value)}
                              className="w-10 p-0 h-10 border rounded-xl cursor-pointer"
                            />
                            <Input
                              type="text"
                              value={wmColor}
                              onChange={(e) => setWmColor(e.target.value)}
                              className="rounded-xl border-slate-200 flex-1 text-xs font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400">Logo File Upload</Label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setWatermarkFile(e.target.files[0]);
                          }
                        }}
                        className="rounded-xl border-slate-200 text-xs"
                      />
                      {watermarkFile && (
                        <p className="text-[9px] text-slate-500 font-bold truncate">Logo: {watermarkFile.name}</p>
                      )}
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                      <span>Opacity</span>
                      <span className="text-slate-800">{Math.round(wmOpacity * 100)}%</span>
                    </div>
                    <Slider
                      defaultValue={[wmOpacity]}
                      max={1.0}
                      min={0.1}
                      step={0.1}
                      onValueChange={(val) => setWmOpacity(val[0])}
                      className="py-1"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-slate-400">Position</Label>
                    <Select value={wmPosition} onValueChange={setWmPosition}>
                      <SelectTrigger className="rounded-xl border-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="top_left">Top Left</SelectItem>
                        <SelectItem value="top_right">Top Right</SelectItem>
                        <SelectItem value="bottom_left">Bottom Left</SelectItem>
                        <SelectItem value="bottom_right">Bottom Right</SelectItem>
                        <SelectItem value="center">Center</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3 border-t pt-3">
                    <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                      <span>Watermark Rotation</span>
                      <span className="text-slate-800">{wmRotation}°</span>
                    </div>
                    <Slider
                      defaultValue={[Number(wmRotation)]}
                      max={360}
                      min={0}
                      step={5}
                      onValueChange={(val) => setWmRotation(val[0].toString())}
                      className="py-1"
                    />
                  </div>
                </div>
              )}

              {/* IMAGE ROTATE */}
              {tool === "rotate-image" && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-slate-400">Rotate Angle (Clockwise)</Label>
                    <Select value={rotateAngle} onValueChange={setRotateAngle}>
                      <SelectTrigger className="rounded-xl border-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0° (No rotation)</SelectItem>
                        <SelectItem value="90">90° Clockwise</SelectItem>
                        <SelectItem value="180">180° Flip</SelectItem>
                        <SelectItem value="270">270° (90° Counter-Clockwise)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-slate-400">Flip Mode</Label>
                    <Select value={flipMode} onValueChange={setFlipMode}>
                      <SelectTrigger className="rounded-xl border-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Flip</SelectItem>
                        <SelectItem value="horizontal">Flip Horizontally</SelectItem>
                        <SelectItem value="vertical">Flip Vertically</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* REMOVE BACKGROUND OPTIONS & INSPECTOR */}
              {tool === "remove-bg" && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400">AI Cutout Mode</Label>
                    <Select value={removeBgModel} onValueChange={(val) => setRemoveBgModel(val as any)}>
                      <SelectTrigger className="h-9 border-slate-200 rounded-xl text-xs font-black">
                        <SelectValue placeholder="Select cutout mode" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="u2net_human_seg" className="text-xs font-black">Portrait Mode (Humans & Persons)</SelectItem>
                        <SelectItem value="u2net" className="text-xs font-black">Standard Mode (Objects & Products)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                      <span>Edge Smoothness</span>
                      <span className="text-slate-800">{bgSmoothRadius}px</span>
                    </div>
                    <Slider
                      defaultValue={[bgSmoothRadius]}
                      min={0}
                      max={10}
                      step={1}
                      onValueChange={(val) => setBgSmoothRadius(val[0])}
                      className="py-1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400">Preview Background</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setBgInspectColor("checkered")}
                        className={`h-9 rounded-xl text-[10px] font-black border transition-all ${
                          bgInspectColor === "checkered"
                            ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        Transparent
                      </button>
                      <button
                        type="button"
                        onClick={() => setBgInspectColor("white")}
                        className={`h-9 rounded-xl text-[10px] font-black border transition-all ${
                          bgInspectColor === "white"
                            ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        White
                      </button>
                      <button
                        type="button"
                        onClick={() => setBgInspectColor("black")}
                        className={`h-9 rounded-xl text-[10px] font-black border transition-all ${
                          bgInspectColor === "black"
                            ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        Dark
                      </button>
                    </div>
                  </div>

                  {/* Promotional Redirect Card */}
                  <div className="pt-4 border-t border-slate-100">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50/50 border border-orange-100/70 flex flex-col gap-2.5 shadow-sm">
                      <div className="flex items-center gap-2 text-orange-700">
                        <Star className="w-4 h-4 fill-orange-500 text-orange-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-wider">Need Better Results?</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
                        For extremely precise, high-definition background removal with professional cutouts, try our specialized tool.
                      </p>
                      <a 
                        href="https://www.removebg.co.in" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="h-9 w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
                      >
                        <span>Try RemoveBG.co.in</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                </div>
              )}

              {/* Simple utilities with standard fallback messages */}
              {["pdf-to-word", "pdf-to-ppt", "pdf-to-excel", "word-to-pdf", "ppt-to-pdf", "excel-to-pdf", "convert-to-jpg", "pdf-to-jpg", "jpg-to-pdf"].includes(tool) && (
                <div className="space-y-2 text-center text-xs font-semibold text-slate-400 p-4 border border-dashed rounded-xl">
                  <HelpCircle className="w-6 h-6 mx-auto text-slate-300 mb-1" />
                  No extra options. Ready to process.
                </div>
              )}

              {/* EAN Generator Option Panel */}
              {tool === "ean-generator" && (
                <div className="space-y-6 animate-fade-in text-slate-800">
                  <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">EAN Format Settings</h4>

                    {/* Wobbly animated switch for EAN-13 vs EAN-8 */}
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-500">Symbology Format</Label>
                      <div className="relative w-full h-9 bg-slate-100 rounded-xl p-1 flex items-center cursor-pointer select-none border border-slate-200/50">
                        <motion.div
                          className="absolute top-1 bottom-1 left-1 bg-white rounded-lg shadow-md border border-slate-200/40"
                          style={{ width: "calc(50% - 2px)" }}
                          animate={{
                            x: eanType === "EAN13" ? "0%" : "100%",
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 280,
                            damping: 18,
                          }}
                        />
                        <div
                          onClick={() => setEanType("EAN13")}
                          className={`flex-1 text-center py-1 text-[10px] font-black uppercase tracking-wider relative z-10 transition-colors ${
                            eanType === "EAN13" ? "text-orange-700 font-extrabold" : "text-slate-500 hover:text-slate-700"
                          }`}
                        >
                          EAN-13 (Standard)
                        </div>
                        <div
                          onClick={() => setEanType("EAN8")}
                          className={`flex-1 text-center py-1 text-[10px] font-black uppercase tracking-wider relative z-10 transition-colors ${
                            eanType === "EAN8" ? "text-orange-700 font-extrabold" : "text-slate-500 hover:text-slate-700"
                          }`}
                        >
                          EAN-8 (Short)
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase text-slate-500">
                        EAN Barcode Values (One per line)
                      </Label>
                      <Textarea
                        value={eanCodesText}
                        onChange={(e) => setEanCodesText(e.target.value)}
                        placeholder={eanType === "EAN13" ? "e.g. 123456789012" : "e.g. 1234567"}
                        className="rounded-xl border-slate-200 text-xs font-semibold min-h-[120px] bg-white text-slate-850"
                      />
                      <p className="text-[9px] text-slate-400 font-semibold leading-relaxed">
                        Invalid lengths or wrong check digits will be autocorrected automatically to prevent print errors.
                      </p>
                    </div>

                    {eanType === "EAN13" && (
                      <div className="flex items-center space-x-2 pt-1.5">
                        <Checkbox
                          id="ean-margin-indicator"
                          checked={eanIncludeMarginIndicator}
                          onCheckedChange={(checked) => setEanIncludeMarginIndicator(!!checked)}
                        />
                        <label
                          htmlFor="ean-margin-indicator"
                          className="text-[10px] font-black uppercase text-slate-500 cursor-pointer select-none"
                        >
                          Include Margin Indicator (&gt;)
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Dimensions Sizing */}
                  <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Dimension Parameters</h4>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-black uppercase text-slate-500">Code Height (%)</Label>
                        <Input
                          type="number"
                          min={25}
                          max={500}
                          value={eanHeightPercent}
                          onChange={(e) => setEanHeightPercent(Math.max(25, Math.min(500, Number(e.target.value))))}
                          className="h-9 rounded-xl border-slate-200 text-xs font-semibold text-slate-850 bg-white"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-black uppercase text-slate-500">BWR (Reduction)</Label>
                        <Input
                          type="number"
                          min={0}
                          max={200}
                          value={eanBwr}
                          onChange={(e) => setEanBwr(Math.max(0, Math.min(200, Number(e.target.value))))}
                          className="h-9 rounded-xl border-slate-200 text-xs font-semibold text-slate-850 bg-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Image Scale (PNG/JPG Exports)</Label>
                      <Select 
                        value={String(eanScalePercent)} 
                        onValueChange={(val) => setEanScalePercent(Number(val))}
                      >
                        <SelectTrigger className="h-9 rounded-xl border-slate-200 text-xs font-semibold bg-white text-slate-850">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="100">100% (Standard)</SelectItem>
                          <SelectItem value="200">200%</SelectItem>
                          <SelectItem value="300">300%</SelectItem>
                          <SelectItem value="400">400%</SelectItem>
                          <SelectItem value="500">500%</SelectItem>
                          <SelectItem value="600">600%</SelectItem>
                          <SelectItem value="800">800%</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Additional Quiet Zone Margins */}
                    <div className="space-y-2 border-t pt-3">
                      <Label className="text-[10px] font-black uppercase text-slate-500">Quiet Zone Margins (px)</Label>
                      <div className="grid grid-cols-4 gap-2">
                        <div className="space-y-1">
                          <span className="text-[8px] font-black text-slate-400 uppercase text-center block">Left</span>
                          <Input
                            type="number"
                            min={0}
                            max={99}
                            value={eanMarginLeft}
                            onChange={(e) => setEanMarginLeft(Math.max(0, Math.min(99, Number(e.target.value))))}
                            className="h-8 p-1 rounded-lg border-slate-200 text-xs font-bold text-center bg-white text-slate-850"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[8px] font-black text-slate-400 uppercase text-center block">Top</span>
                          <Input
                            type="number"
                            min={0}
                            max={99}
                            value={eanMarginTop}
                            onChange={(e) => setEanMarginTop(Math.max(0, Math.min(99, Number(e.target.value))))}
                            className="h-8 p-1 rounded-lg border-slate-200 text-xs font-bold text-center bg-white text-slate-850"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[8px] font-black text-slate-400 uppercase text-center block">Right</span>
                          <Input
                            type="number"
                            min={0}
                            max={99}
                            value={eanMarginRight}
                            onChange={(e) => setEanMarginRight(Math.max(0, Math.min(99, Number(e.target.value))))}
                            className="h-8 p-1 rounded-lg border-slate-200 text-xs font-bold text-center bg-white text-slate-850"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[8px] font-black text-slate-400 uppercase text-center block">Bottom</span>
                          <Input
                            type="number"
                            min={0}
                            max={99}
                            value={eanMarginBottom}
                            onChange={(e) => setEanMarginBottom(Math.max(0, Math.min(99, Number(e.target.value))))}
                            className="h-8 p-1 rounded-lg border-slate-200 text-xs font-bold text-center bg-white text-slate-850"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Colors styling */}
                  <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Color Parameters</h4>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-black uppercase text-slate-500">Bars Color</Label>
                        <div className="flex items-center gap-1.5">
                          <Input
                            type="color"
                            value={eanFgColor}
                            onChange={(e) => setEanFgColor(e.target.value)}
                            className="w-8 h-8 p-0 rounded-lg cursor-pointer overflow-hidden border border-slate-200"
                          />
                          <Input
                            value={eanFgColor}
                            onChange={(e) => setEanFgColor(e.target.value)}
                            className="h-8 rounded-lg border-slate-200 text-[10px] font-mono uppercase bg-white text-slate-850"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-black uppercase text-slate-500">Background</Label>
                        <div className="flex items-center gap-1.5">
                          <Input
                            type="color"
                            value={eanBgColor}
                            onChange={(e) => setEanBgColor(e.target.value)}
                            disabled={eanBgTransparent}
                            className="w-8 h-8 p-0 rounded-lg cursor-pointer overflow-hidden border border-slate-200 disabled:opacity-50"
                          />
                          <Input
                            value={eanBgColor}
                            onChange={(e) => setEanBgColor(e.target.value)}
                            disabled={eanBgTransparent}
                            className="h-8 rounded-lg border-slate-200 text-[10px] font-mono uppercase bg-white text-slate-850 disabled:opacity-50"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                      <Label htmlFor="ean-transparent-switch" className="text-[10px] font-black uppercase text-slate-500 cursor-pointer">
                        Transparent Background
                      </Label>
                      <Switch
                        id="ean-transparent-switch"
                        checked={eanBgTransparent}
                        onCheckedChange={setEanBgTransparent}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Barcode Creator Option Panel */}
              {tool === "barcode-creator" && (
                <div className="space-y-6 animate-fade-in text-slate-800">
                  <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Barcode Configuration</h4>
                    
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase text-slate-500">Barcode Value</Label>
                      <Input
                        value={barcodeVal}
                        onChange={(e) => setBarcodeVal(e.target.value)}
                        placeholder="e.g. 12345678"
                        className="h-9 rounded-xl border-slate-200 text-xs font-semibold text-slate-850"
                      />
                      {getBarcodeValidationError(barcodeVal, barcodeFormatOption) && (
                        <span className="text-[10px] text-rose-500 font-bold block mt-1">
                          {getBarcodeValidationError(barcodeVal, barcodeFormatOption)}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase text-slate-500">Symbology Format</Label>
                      <Select 
                        value={barcodeFormatOption} 
                        onValueChange={setBarcodeFormatOption}
                      >
                        <SelectTrigger className="h-9 rounded-xl border-slate-200 text-xs font-semibold text-slate-850">
                          <SelectValue placeholder="Select Format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CODE128">Code-128</SelectItem>
                          <SelectItem value="CODE39">Code-39</SelectItem>
                          <SelectItem value="EAN13">EAN-13</SelectItem>
                          <SelectItem value="EAN8">EAN-8</SelectItem>
                          <SelectItem value="EAN5">EAN-5</SelectItem>
                          <SelectItem value="EAN2">EAN-2</SelectItem>
                          <SelectItem value="UPC">UPC-A</SelectItem>
                          <SelectItem value="UPCE">UPC-E</SelectItem>
                          <SelectItem value="codabar">Codabar</SelectItem>
                          <SelectItem value="itf">ITF</SelectItem>
                          <SelectItem value="ITF14">ITF-14</SelectItem>
                          <SelectItem value="msi">MSI</SelectItem>
                          <SelectItem value="pharmacode">Pharmacode</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase text-slate-500">Bar Width (px)</Label>
                      <Input
                        type="number"
                        min={1}
                        max={4}
                        step={1}
                        value={barcodeBarWidthPx}
                        onChange={(e) => setBarcodeBarWidthPx(Number(e.target.value))}
                        className="h-9 rounded-xl border-slate-200 text-xs font-semibold text-slate-850"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase text-slate-500">Height (px)</Label>
                      <Input
                        type="number"
                        min={10}
                        max={250}
                        step={1}
                        value={barcodeHeightPx}
                        onChange={(e) => setBarcodeHeightPx(Number(e.target.value))}
                        className="h-9 rounded-xl border-slate-200 text-xs font-semibold text-slate-850"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase text-slate-500">Margin (px)</Label>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        step={1}
                        value={barcodeMarginPx}
                        onChange={(e) => setBarcodeMarginPx(Number(e.target.value))}
                        className="h-9 rounded-xl border-slate-200 text-xs font-semibold text-slate-850"
                      />
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                      <Checkbox
                        id="barcode-show-text"
                        checked={barcodeShowText}
                        onCheckedChange={(checked) => setBarcodeShowText(!!checked)}
                      />
                      <label
                        htmlFor="barcode-show-text"
                        className="text-[10px] font-black uppercase text-slate-500 cursor-pointer select-none"
                      >
                        Show human-readable text
                      </label>
                    </div>
                  </div>
                </div>
              )}
                 {/* QR Code Creator Option Panel */}
              {tool === "qr-creator" && (
                <div className="space-y-6 animate-fade-in text-slate-800">
                  {/* Preset Quick Designs */}
                  <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 space-y-3">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Quick Preset Designs</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => applyQrPreset("midnight")}
                        className="py-2 px-2 border border-slate-200 rounded-xl bg-white hover:border-orange-400 text-left transition-all hover:shadow-xs group flex items-center gap-2"
                      >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-orange-500 shrink-0" />
                        <div>
                          <p className="text-[9px] font-black text-slate-700 uppercase leading-none">Midnight</p>
                          <span className="text-[8px] text-slate-400 font-bold leading-none">Neon Orbit</span>
                        </div>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => applyQrPreset("corporate")}
                        className="py-2 px-2 border border-slate-200 rounded-xl bg-white hover:border-orange-400 text-left transition-all hover:shadow-xs group flex items-center gap-2"
                      >
                        <div className="w-6 h-6 rounded-full bg-slate-800 shrink-0" />
                        <div>
                          <p className="text-[9px] font-black text-slate-700 uppercase leading-none">Business</p>
                          <span className="text-[8px] text-slate-400 font-bold leading-none">Classic Slate</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => applyQrPreset("golden")}
                        className="py-2 px-2 border border-slate-200 rounded-xl bg-white hover:border-orange-400 text-left transition-all hover:shadow-xs group flex items-center gap-2"
                      >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 shrink-0" />
                        <div>
                          <p className="text-[9px] font-black text-slate-700 uppercase leading-none">Golden</p>
                          <span className="text-[8px] text-slate-400 font-bold leading-none">Star Glow</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => applyQrPreset("emerald")}
                        className="py-2 px-2 border border-slate-200 rounded-xl bg-white hover:border-orange-400 text-left transition-all hover:shadow-xs group flex items-center gap-2"
                      >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-emerald-450 to-emerald-700 shrink-0" />
                        <div>
                          <p className="text-[9px] font-black text-slate-700 uppercase leading-none">Emerald</p>
                          <span className="text-[8px] text-slate-400 font-bold leading-none">Sparkle Connect</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider font-extrabold flex items-center gap-1">
                      <QrCode className="w-3.5 h-3.5" /> Content Type
                    </h4>

                    {/* Wobbly Tab Switch */}
                    <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100/80 rounded-xl border border-slate-200/50 relative">
                      {([
                        { id: "url", label: "URL", icon: Globe },
                        { id: "text", label: "Text", icon: AlignLeft },
                        { id: "vcard", label: "vCard", icon: User },
                        { id: "wifi", label: "WiFi", icon: Wifi },
                        { id: "email", label: "Email", icon: Mail },
                        { id: "phone", label: "Phone", icon: Phone },
                        { id: "sms", label: "SMS", icon: MessageSquare }
                      ] as const).map(tab => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => {
                            setQrType(tab.id);
                            if (tab.id === "url") setQrText("https://example.com");
                            else if (tab.id === "text") setQrText("");
                          }}
                          className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-lg text-[8px] font-black uppercase tracking-wider transition-all duration-300 ${
                            qrType === tab.id 
                              ? "text-orange-700 font-extrabold" 
                              : "text-slate-450 hover:text-slate-700"
                          }`}
                        >
                          {qrType === tab.id && (
                            <motion.div
                              layoutId="activeQrTab"
                              className="absolute inset-0 bg-white rounded-lg shadow-xs border border-slate-200/40 z-0"
                              transition={{
                                type: "spring",
                                stiffness: 380,
                                damping: 20
                              }}
                            />
                          )}
                          <span className="relative z-10 flex flex-col items-center justify-center">
                            <tab.icon className="w-3.5 h-3.5 mb-1" />
                            <span>{tab.label}</span>
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* QR content input fields */}
                    {qrType === "url" && (
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-black uppercase text-slate-500">Website URL</Label>
                        <Input
                          value={qrText}
                          onChange={(e) => setQrText(e.target.value)}
                          placeholder="https://yourwebsite.com"
                          className="h-9 rounded-xl border-slate-200 text-xs font-semibold"
                        />
                      </div>
                    )}

                    {qrType === "text" && (
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-black uppercase text-slate-500">Free Text</Label>
                        <Textarea
                          value={qrText}
                          onChange={(e) => setQrText(e.target.value)}
                          placeholder="Write anything you want to embed..."
                          className="rounded-xl border-slate-200 text-xs font-semibold min-h-[80px]"
                        />
                      </div>
                    )}

                    {qrType === "vcard" && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <Label className="text-[9px] font-black uppercase text-slate-500">First Name</Label>
                            <Input
                              value={vcardFirstName}
                              onChange={(e) => setVcardFirstName(e.target.value)}
                              className="h-8 rounded-lg border-slate-200 text-xs font-semibold"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[9px] font-black uppercase text-slate-500">Last Name</Label>
                            <Input
                              value={vcardLastName}
                              onChange={(e) => setVcardLastName(e.target.value)}
                              className="h-8 rounded-lg border-slate-200 text-xs font-semibold"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[9px] font-black uppercase text-slate-500">Organization</Label>
                          <Input
                            value={vcardOrg}
                            onChange={(e) => setVcardOrg(e.target.value)}
                            className="h-8 rounded-lg border-slate-200 text-xs font-semibold"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <Label className="text-[9px] font-black uppercase text-slate-500">Phone</Label>
                            <Input
                              value={vcardPhone}
                              onChange={(e) => setVcardPhone(e.target.value)}
                              className="h-8 rounded-lg border-slate-200 text-xs font-semibold"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[9px] font-black uppercase text-slate-500">Mobile</Label>
                            <Input
                              value={vcardMobile}
                              onChange={(e) => setVcardMobile(e.target.value)}
                              className="h-8 rounded-lg border-slate-200 text-xs font-semibold"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[9px] font-black uppercase text-slate-500">Email</Label>
                          <Input
                            value={vcardEmail}
                            onChange={(e) => setVcardEmail(e.target.value)}
                            className="h-8 rounded-lg border-slate-200 text-xs font-semibold"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[9px] font-black uppercase text-slate-500">Website</Label>
                          <Input
                            value={vcardWebsite}
                            onChange={(e) => setVcardWebsite(e.target.value)}
                            className="h-8 rounded-lg border-slate-200 text-xs font-semibold"
                          />
                        </div>
                      </div>
                    )}

                    {qrType === "wifi" && (
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <Label className="text-[9px] font-black uppercase text-slate-500">Network Name (SSID)</Label>
                          <Input
                            value={wifiSsid}
                            onChange={(e) => setWifiSsid(e.target.value)}
                            className="h-8 rounded-lg border-slate-200 text-xs font-semibold"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[9px] font-black uppercase text-slate-500">Password</Label>
                          <Input
                            type="password"
                            value={wifiPassword}
                            onChange={(e) => setWifiPassword(e.target.value)}
                            className="h-8 rounded-lg border-slate-200 text-xs font-semibold"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-[9px] font-black uppercase text-slate-500">Network Type</Label>
                          <Select value={wifiType} onValueChange={setWifiType}>
                            <SelectTrigger className="h-8 rounded-lg border-slate-200 text-xs font-semibold">
                              <SelectValue placeholder="Security Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="WPA">WPA/WPA2</SelectItem>
                              <SelectItem value="WEP">WEP</SelectItem>
                              <SelectItem value="nopass">Unsecured</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center space-x-2 pt-1">
                          <Checkbox
                            id="wifi-hidden"
                            checked={wifiHidden}
                            onCheckedChange={(checked) => setWifiHidden(!!checked)}
                          />
                          <label
                            htmlFor="wifi-hidden"
                            className="text-[9px] font-black uppercase text-slate-500 cursor-pointer select-none"
                          >
                            Hidden Network
                          </label>
                        </div>
                      </div>
                    )}

                    {qrType === "email" && (
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <Label className="text-[9px] font-black uppercase text-slate-500">Recipient Email</Label>
                          <Input
                            value={emailAddr}
                            onChange={(e) => setEmailAddr(e.target.value)}
                            placeholder="hello@example.com"
                            className="h-8 rounded-lg border-slate-200 text-xs font-semibold"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[9px] font-black uppercase text-slate-500">Subject</Label>
                          <Input
                            value={emailSubject}
                            onChange={(e) => setEmailSubject(e.target.value)}
                            className="h-8 rounded-lg border-slate-200 text-xs font-semibold"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[9px] font-black uppercase text-slate-500">Message Body</Label>
                          <Textarea
                            value={emailBody}
                            onChange={(e) => setEmailBody(e.target.value)}
                            className="rounded-lg border-slate-200 text-xs font-semibold min-h-[60px]"
                          />
                        </div>
                      </div>
                    )}

                    {qrType === "phone" && (
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-black uppercase text-slate-500">Phone Number</Label>
                        <Input
                          value={phoneNum}
                          onChange={(e) => setPhoneNum(e.target.value)}
                          placeholder="+15556667777"
                          className="h-9 rounded-xl border-slate-200 text-xs font-semibold"
                        />
                      </div>
                    )}

                    {qrType === "sms" && (
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <Label className="text-[9px] font-black uppercase text-slate-500">Phone Number</Label>
                          <Input
                            value={smsPhone}
                            onChange={(e) => setSmsPhone(e.target.value)}
                            placeholder="+15556667777"
                            className="h-8 rounded-lg border-slate-200 text-xs font-semibold"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[9px] font-black uppercase text-slate-500">SMS Message</Label>
                          <Textarea
                            value={smsMessage}
                            onChange={(e) => setSmsMessage(e.target.value)}
                            className="rounded-lg border-slate-200 text-xs font-semibold min-h-[60px]"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* QR Pattern Styles */}
                  <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Pattern & Design Styles</h4>
                    
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase text-slate-500">Modules Shape Format</Label>
                      <Select 
                        value={qrPattern} 
                        onValueChange={(val: any) => setQrPattern(val)}
                      >
                        <SelectTrigger className="h-9 rounded-xl border-slate-200 text-xs font-semibold text-slate-850">
                          <SelectValue placeholder="Select Pattern" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="squares">Squares (Standard)</SelectItem>
                          <SelectItem value="dots">Dotted (Circular)</SelectItem>
                          <SelectItem value="stars">Star Pattern</SelectItem>
                          <SelectItem value="sparkles">Sparkle Pattern</SelectItem>
                          <SelectItem value="rounded">Rounded Modules</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase text-slate-500">Corner Marker Eyes Style</Label>
                      <Select 
                        value={qrEyeStyle} 
                        onValueChange={(val: any) => setQrEyeStyle(val)}
                      >
                        <SelectTrigger className="h-9 rounded-xl border-slate-200 text-xs font-semibold text-slate-850">
                          <SelectValue placeholder="Select Eye Style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="square">Standard Squares</SelectItem>
                          <SelectItem value="rounded">Smooth Rounded</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Error Correction with Wobbly switch */}
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-500 font-bold">Error Correction Level</Label>
                      <div className="flex flex-col gap-1 bg-slate-100/80 rounded-xl p-1 border border-slate-200/50 relative overflow-hidden">
                        {([
                          { id: "L", label: "Low (7% recovery)" },
                          { id: "M", label: "Medium (15% recovery)" },
                          { id: "Q", label: "Quartile (25% recovery)" },
                          { id: "H", label: "High (30% recovery - Recommended for logos)" }
                        ] as const).map(level => (
                          <button
                            key={level.id}
                            type="button"
                            onClick={() => setQrErrorLevel(level.id)}
                            className={`relative text-left py-2 px-3 text-[10px] font-black uppercase tracking-wider z-10 transition-colors rounded-lg ${
                              qrErrorLevel === level.id ? "text-orange-700 font-extrabold" : "text-slate-500 hover:text-slate-700"
                            }`}
                          >
                            {level.id === qrErrorLevel && (
                              <motion.div
                                layoutId="activeQrErrorLevel"
                                className="absolute inset-0 bg-white rounded-lg shadow-xs border border-slate-200/40 z-0"
                                transition={{
                                  type: "spring",
                                  stiffness: 380,
                                  damping: 20
                                }}
                              />
                            )}
                            <span className="relative z-10">{level.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* QR Color Controls */}
                  <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Color Customization</h4>

                    {/* Gradient Toggle */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <Label htmlFor="use-qr-gradient" className="text-[10px] font-black uppercase text-slate-500 cursor-pointer">
                        Enable Gradient Color
                      </Label>
                      <Switch
                        id="use-qr-gradient"
                        checked={useQrGradient}
                        onCheckedChange={setUseQrGradient}
                      />
                    </div>

                    {useQrGradient ? (
                      <div className="space-y-3 p-2 bg-slate-100/50 rounded-xl border border-slate-200/30">
                        <div className="space-y-1.5">
                          <Label className="text-[10px] font-black uppercase text-slate-500">Gradient Flow Type</Label>
                          <Select 
                            value={qrGradientType} 
                            onValueChange={(val: any) => setQrGradientType(val)}
                          >
                            <SelectTrigger className="h-8 rounded-lg border-slate-200 text-xs font-semibold bg-white">
                              <SelectValue placeholder="Gradient Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="linear">Linear Gradient</SelectItem>
                              <SelectItem value="radial">Radial Gradient</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <Label className="text-[9px] font-black uppercase text-slate-500">Gradient Start</Label>
                            <div className="flex items-center gap-1">
                              <Input
                                type="color"
                                value={qrGradientStart}
                                onChange={(e) => setQrGradientStart(e.target.value)}
                                className="w-8 h-8 p-0 rounded-lg cursor-pointer shrink-0"
                              />
                              <Input
                                value={qrGradientStart}
                                onChange={(e) => setQrGradientStart(e.target.value)}
                                className="h-8 rounded-lg border-slate-200 text-[10px] font-mono bg-white"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <Label className="text-[9px] font-black uppercase text-slate-500">Gradient End</Label>
                            <div className="flex items-center gap-1">
                              <Input
                                type="color"
                                value={qrGradientEnd}
                                onChange={(e) => setQrGradientEnd(e.target.value)}
                                className="w-8 h-8 p-0 rounded-lg cursor-pointer shrink-0"
                              />
                              <Input
                                value={qrGradientEnd}
                                onChange={(e) => setQrGradientEnd(e.target.value)}
                                className="h-8 rounded-lg border-slate-200 text-[10px] font-mono bg-white"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-black uppercase text-slate-500">Foreground Data Color</Label>
                        <div className="flex items-center gap-1.5">
                          <Input
                            type="color"
                            value={qrFgColor}
                            onChange={(e) => setQrFgColor(e.target.value)}
                            className="w-9 h-9 p-0 rounded-lg border border-slate-200 cursor-pointer overflow-hidden"
                          />
                          <Input
                            value={qrFgColor}
                            onChange={(e) => setQrFgColor(e.target.value)}
                            className="h-9 rounded-xl border-slate-200 text-xs font-mono uppercase"
                          />
                        </div>
                      </div>
                    )}

                    {/* Finder Eye & Ring Custom Colors */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-black uppercase text-slate-500">Finder Ring (Outer)</Label>
                        <div className="flex items-center gap-1.5">
                          <Input
                            type="color"
                            value={qrOuterRingColor}
                            onChange={(e) => setQrOuterRingColor(e.target.value)}
                            className="w-7 h-7 p-0 rounded cursor-pointer"
                          />
                          <Input
                            value={qrOuterRingColor}
                            onChange={(e) => setQrOuterRingColor(e.target.value)}
                            className="h-7 rounded-lg border-slate-200 text-[9px] font-mono uppercase"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-black uppercase text-slate-500">Finder Eye (Inner)</Label>
                        <div className="flex items-center gap-1.5">
                          <Input
                            type="color"
                            value={qrInnerEyeColor}
                            onChange={(e) => setQrInnerEyeColor(e.target.value)}
                            className="w-7 h-7 p-0 rounded cursor-pointer"
                          />
                          <Input
                            value={qrInnerEyeColor}
                            onChange={(e) => setQrInnerEyeColor(e.target.value)}
                            className="h-7 rounded-lg border-slate-200 text-[9px] font-mono uppercase"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-black uppercase text-slate-500">Background</Label>
                        <div className="flex items-center gap-1.5">
                          <Input
                            type="color"
                            value={qrBgColor}
                            onChange={(e) => setQrBgColor(e.target.value)}
                            className="w-8 h-8 p-0 rounded-lg border border-slate-200 cursor-pointer"
                          />
                          <Input
                            value={qrBgColor}
                            onChange={(e) => setQrBgColor(e.target.value)}
                            className="h-8 rounded-xl border-slate-200 text-xs font-mono uppercase"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-black uppercase text-slate-500">Quiet Zone (Margin)</Label>
                        <Input
                          type="number"
                          min={0}
                          max={10}
                          step={1}
                          value={qrMarginModules}
                          onChange={(e) => setQrMarginModules(Number(e.target.value))}
                          className="h-8 rounded-lg border-slate-200 text-xs font-semibold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Logo overlays */}
                  <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Logo Overlay Integration</h4>
                    
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-500">Select Preset Logo</Label>
                      <div className="grid grid-cols-4 gap-2">
                        {([
                          { id: null, label: "None" },
                          { id: "globe", label: "Globe" },
                          { id: "wifi", label: "Wifi" },
                          { id: "mail", label: "Mail" },
                          { id: "phone", label: "Phone" },
                          { id: "sms", label: "SMS" },
                          { id: "star", label: "Star" },
                          { id: "custom", label: "Custom" }
                        ] as const).map(logo => (
                          <button
                            key={String(logo.id)}
                            type="button"
                            onClick={() => {
                              setQrLogoPreset(logo.id);
                              if (logo.id !== "custom" && logo.id !== null) {
                                setQrErrorLevel("H");
                              }
                            }}
                            className={`py-1.5 px-1 rounded-lg border text-[9px] font-bold uppercase transition-all ${
                              qrLogoPreset === logo.id 
                                ? "bg-orange-600 text-white border-orange-600 shadow-xs" 
                                : "bg-white text-slate-650 border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            {logo.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {qrLogoPreset === "custom" && (
                      <div className="space-y-2 animate-fade-in">
                        <Label className="text-[10px] font-black uppercase text-slate-500">Upload Custom Image Logo</Label>
                        <div className="flex gap-2 items-center">
                          <Button
                            type="button"
                            onClick={() => document.getElementById("qr-logo-file")?.click()}
                            className="bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-xl text-xs font-black h-9"
                          >
                            Choose Image
                          </Button>
                          <input
                            type="file"
                            id="qr-logo-file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                          />
                          {qrLogo && (
                            <span className="text-[8px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 rounded-lg py-1 px-2">
                              Logo Loaded!
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Custom badges / Tag frames */}
                  <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Badge Tag Frames</h4>

                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase text-slate-500">Badge Position</Label>
                      <Select 
                        value={qrBadgePos} 
                        onValueChange={(val: any) => setQrBadgePos(val)}
                      >
                        <SelectTrigger className="h-9 rounded-xl border-slate-200 text-xs font-semibold text-slate-850">
                          <SelectValue placeholder="Select Position" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Tag Frame</SelectItem>
                          <SelectItem value="top">Top Header Tag</SelectItem>
                          <SelectItem value="bottom">Bottom Footer Tag</SelectItem>
                          <SelectItem value="left">Left Rotated Tag</SelectItem>
                          <SelectItem value="right">Right Rotated Tag</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {qrBadgePos !== "none" && (
                      <div className="space-y-3 animate-fade-in">
                        <div className="space-y-1.5">
                          <Label className="text-[10px] font-black uppercase text-slate-500">Tag Text</Label>
                          <Input
                            value={qrBadgeText}
                            onChange={(e) => setQrBadgeText(e.target.value)}
                            placeholder="e.g. SCAN ME"
                            className="h-8 rounded-lg border-slate-200 text-xs font-semibold"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <Label className="text-[9px] font-black uppercase text-slate-500">Tag Bg Color</Label>
                            <div className="flex items-center gap-1">
                              <Input
                                type="color"
                                value={qrBadgeBg}
                                onChange={(e) => setQrBadgeBg(e.target.value)}
                                className="w-6 h-6 p-0 rounded cursor-pointer shrink-0"
                              />
                              <Input
                                value={qrBadgeBg}
                                onChange={(e) => setQrBadgeBg(e.target.value)}
                                className="h-7 rounded-lg border-slate-200 text-[9px] font-mono"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <Label className="text-[9px] font-black uppercase text-slate-500">Tag Text Color</Label>
                            <div className="flex items-center gap-1">
                              <Input
                                type="color"
                                value={qrBadgeTextColor}
                                onChange={(e) => setQrBadgeTextColor(e.target.value)}
                                className="w-6 h-6 p-0 rounded cursor-pointer shrink-0"
                              />
                              <Input
                                value={qrBadgeTextColor}
                                onChange={(e) => setQrBadgeTextColor(e.target.value)}
                                className="h-7 rounded-lg border-slate-200 text-[9px] font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Progress Bar / Outcome UI */}
            {status !== "idle" && (
              <div className="space-y-3 pt-2">
                {/* Uploading */}
                {status === "uploading" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-500" />
                        Reading Buffers...
                      </span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-1.5 rounded-full animate-pulse" />
                  </div>
                )}

                {/* Processing */}
                {status === "processing" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-500" />
                        Processing...
                      </span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-1.5 rounded-full animate-pulse" />
                  </div>
                )}

                {/* Success (Download Button) */}
                {status === "success" && (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 p-2 bg-emerald-50 border border-emerald-100 rounded-xl">
                      <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-[10px] font-black text-slate-800">
                          {uploadedFiles.length > 1 ? `Batch of ${uploadedFiles.length} Finished!` : "Process Completed!"}
                        </h4>
                        <p className="text-[9px] text-emerald-700 font-bold truncate">
                          {uploadedFiles.length > 1 ? "Bulk output ready for archive" : resultFileName}
                        </p>
                      </div>
                    </div>
                    {uploadedFiles.length > 1 ? (
                      <Button
                        onClick={handleDownloadZip}
                        className="w-full h-11 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black gap-2 shadow-md"
                      >
                        <Download className="w-4 h-4" /> Download All (ZIP)
                      </Button>
                    ) : (
                      <Button
                        onClick={triggerDownload}
                        className="w-full h-11 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black gap-2 shadow-md"
                      >
                        <Download className="w-4 h-4" /> Download File
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setStatus("idle");
                        setBulkResults({});
                      }}
                      className="w-full text-[10px] font-black text-slate-500 hover:bg-slate-100 rounded-lg h-8"
                    >
                      Process Again
                    </Button>
                  </div>
                )}

                {/* Error */}
                {status === "error" && (
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200/50 rounded-xl text-rose-800">
                      <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <h4 className="text-[10px] font-black">Processing Error</h4>
                        <p className="text-[9px] font-semibold mt-0.5 leading-relaxed break-words">{errorMessage}</p>
                      </div>
                    </div>
                    <Button
                      onClick={handleProcess}
                      className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider gap-2 shadow-lg"
                    >
                      Retry {info.name}
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Run Button (visible only when idle) */}
            {status === "idle" && tool !== "batch-barcode" && tool !== "barcode-creator" && tool !== "qr-creator" && tool !== "ean-generator" && (
              <Button
                onClick={handleProcess}
                disabled={(!info.noUpload && uploadedFiles.length === 0) || (tool === "merge-pdf" && uploadedFiles.length < 2)}
                className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider gap-2 shadow-lg"
              >
                {info.name}
              </Button>
            )}
          </div>
        </div>
        )}
      </div>
      )}
      {tool === "batch-barcode" && (
        <>
          <div id="batch-print-wrapper" className="hidden print:block">
            <div 
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${pageSize === "roll" ? 1 : colsPerRow}, 1fr)`,
                gap: "8px",
                width: "100%",
                boxSizing: "border-box"
              }}
            >
              {Array.from({ length: totalLabels }).map((_, idx) => (
                <div 
                  key={idx} 
                  style={{
                    breakInside: "avoid",
                    pageBreakInside: "avoid",
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "4px"
                  }}
                >
                  <div 
                    className={`bg-white border-black relative text-black font-sans overflow-hidden ${
                      (labelFormat === 'custom' || labelFormat.startsWith('custom_'))
                        ? 'p-1'
                        : (labelFormat === 'blinkit' ? 'p-5 border-[2px] rounded-md' : 'p-3 border-[1.5px] rounded-[15px]')
                    }`}
                    style={{ 
                      width: "100%",
                      maxWidth: labelWidth ? `${labelWidth}mm` : (labelFormat === 'blinkit' ? '152.4mm' : '101.6mm'),
                      aspectRatio: `${labelWidth || (labelFormat === 'blinkit' ? 152.4 : 101.6)} / ${labelHeight || (labelFormat === 'blinkit' ? 101.6 : 50.8)}`,
                      boxSizing: 'border-box',
                      margin: "0 auto"
                    }}
                  >
                    {renderSelectedLayout()}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <style jsx global>{`
            @media print {
              html, body {
                visibility: hidden !important;
                height: 100% !important;
                width: 100% !important;
                overflow: hidden !important;
                background: white !important;
                margin: 0 !important;
                padding: 0 !important;
              }
              #batch-print-wrapper {
                visibility: visible !important;
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                z-index: 9999999 !important;
                background: white !important;
                padding: ${pageSize === "roll" ? "0mm" : "8mm"} !important;
                box-sizing: border-box !important;
              }
              #batch-print-wrapper * {
                visibility: visible !important;
              }
              @page {
                size: ${pageSize === "roll" ? `${labelWidth}mm ${labelHeight}mm` : (pageSize === "A4" ? "210mm 297mm" : pageSize === "A3" ? "297mm 420mm" : "8.5in 11in")} ${pageOrientation} !important;
                margin: 0 !important; /* Hides default browser header/footer */
              }
            }
          `}</style>
        </>
      )}
    </div>
  );
}
