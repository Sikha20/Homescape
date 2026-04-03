"use client";
import React, { useState } from "react";
import { FaFilePdf } from "react-icons/fa";
import toast from "react-hot-toast";

export function PrintPropertyButton() {
  const [loading, setLoading] = useState(false);

  const handlePrint = async () => {
    const element = document.getElementById("property-details-container");
    if (!element) {
      window.print();
      return;
    }

    try {
      setLoading(true);
      toast.loading("Generating PDF... this might take a moment", { id: "pdf-toast" });

      if (typeof window !== "undefined") {
        // Load html2canvas-pro (fixes oklch/Tailwind v4 color crash)
        if (!(window as any).html2canvas) {
           await new Promise((resolve) => {
              const script = document.createElement("script");
              script.src = "https://cdn.jsdelivr.net/npm/html2canvas-pro@1.5.0/dist/html2canvas-pro.min.js";
              script.onload = resolve;
              document.body.appendChild(script);
           });
        }
        
        // Load jsPDF
        if (!(window as any).jspdf) {
           await new Promise((resolve) => {
              const script = document.createElement("script");
              script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
              script.onload = resolve;
              document.body.appendChild(script);
           });
        }

        const html2canvas = (window as any).html2canvas;
        const { jsPDF } = (window as any).jspdf;

        const canvas = await html2canvas(element, { scale: 2, useCORS: true, allowTaint: true });
        const imgData = canvas.toDataURL('image/jpeg', 0.98);
        
        // A4 page dimensions in mm
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('Homescape-Property-Details.pdf');
        
        toast.success("PDF saved perfectly to your Downloads folder!", { id: "pdf-toast", duration: 5000 });
      }
    } catch (e: any) {
      console.error("Error generating PDF", e);
      toast.error(`PDF Error: ${e.message || "Renderer failed. Try refreshing."}`, { id: "pdf-toast", duration: 6000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePrint}
      disabled={loading}
      className={`print:hidden flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-900 border border-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl text-sm transition-all shadow-md active:scale-95 w-full sm:w-auto ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      title="Download Property Details"
    >
      <FaFilePdf size={16} className={loading ? "text-gray-400 animate-pulse" : "text-[#e2a8a8]"} />
      <span>{loading ? 'Exporting...' : 'Export PDF'}</span>
    </button>
  );
}
