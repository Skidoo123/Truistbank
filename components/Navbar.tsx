'use client';

import React from 'react';
import { Download, FileSpreadsheet, Printer, Shield, Sparkles, LayoutGrid, Eye } from 'lucide-react';
import { StatementData } from '@/types/statement';
import { downloadStatementPDF, exportStatementCSV } from '@/lib/pdfUtils';

interface NavbarProps {
  data: StatementData;
  viewMode: 'split' | 'preview' | 'form';
  onToggleViewMode: (mode: 'split' | 'preview' | 'form') => void;
  onGenerateMock: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  data,
  viewMode,
  onToggleViewMode,
  onGenerateMock,
}) => {
  const [isExporting, setIsExporting] = React.useState(false);

  const handleDownloadPDF = async () => {
    setIsExporting(true);
    await downloadStatementPDF('truist-statement-document', `Truist_Statement_${data.account.accountNumber.slice(-4)}.pdf`);
    setIsExporting(false);
  };

  const handleExportCSV = () => {
    exportStatementCSV(data);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="w-full bg-[#180033]/90 backdrop-blur-md border-b border-white/10 sticky top-0 z-50 px-4 py-3 text-white no-print shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
        {/* Brand Header */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <img
              src="/truist-logo.png"
              alt="Truist Logo"
              className="w-9 h-9 object-contain rounded bg-white p-0.5 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight text-white font-sans">
                  TRUIST <span className="text-[#00A3A6] font-semibold text-sm">HH</span>
                </span>
                <span className="px-2 py-0.5 bg-[#00A3A6]/20 border border-[#00A3A6]/40 text-[#33C2C5] text-[10px] font-bold rounded-full uppercase tracking-widest">
                  Official Statement Generator
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                High-fidelity, printable bank statements formatted for Truist Financial
              </p>
            </div>
          </div>

          {/* Mobile view switch buttons */}
          <div className="flex md:hidden bg-white/5 p-1 rounded-lg border border-white/10">
            <button
              onClick={() => onToggleViewMode('form')}
              className={`px-2.5 py-1 text-xs font-semibold rounded ${
                viewMode === 'form' ? 'bg-[#00A3A6] text-white' : 'text-slate-400'
              }`}
            >
              Form
            </button>
            <button
              onClick={() => onToggleViewMode('preview')}
              className={`px-2.5 py-1 text-xs font-semibold rounded ${
                viewMode === 'preview' ? 'bg-[#00A3A6] text-white' : 'text-slate-400'
              }`}
            >
              Preview
            </button>
          </div>
        </div>

        {/* View Layout Selector (Desktop) */}
        <div className="hidden md:flex items-center bg-white/5 p-1 rounded-lg border border-white/10 text-xs font-medium">
          <button
            onClick={() => onToggleViewMode('split')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${
              viewMode === 'split' ? 'bg-[#240046] text-white border border-[#00A3A6]/50 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5 text-[#00A3A6]" />
            <span>Split Screen</span>
          </button>
          <button
            onClick={() => onToggleViewMode('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${
              viewMode === 'preview' ? 'bg-[#240046] text-white border border-[#00A3A6]/50 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-[#00A3A6]" />
            <span>Statement Preview</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 hover:text-white text-xs font-semibold rounded-lg transition"
            title="Export transactions to CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">CSV Export</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 hover:text-white text-xs font-semibold rounded-lg transition"
            title="Print directly"
          >
            <Printer className="w-4 h-4 text-sky-400" />
            <span className="hidden sm:inline">Print</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00A3A6] to-[#007A7C] hover:from-[#007A7C] hover:to-[#005B5D] text-white text-xs font-bold rounded-lg shadow-lg shadow-teal-900/30 transition transform hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Generating PDF...' : 'Download PDF'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Fixed Bottom Dock (1-tap PDF & CSV Download on Mobile Phones) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#180033]/95 backdrop-blur-lg border-t border-white/15 p-2.5 flex items-center justify-between gap-2 md:hidden no-print shadow-2xl">
        <div className="flex items-center gap-1 bg-white/10 p-1 rounded-lg">
          <button
            onClick={() => onToggleViewMode('form')}
            className={`px-3 py-1.5 text-xs font-bold rounded transition ${
              viewMode === 'form' ? 'bg-[#00A3A6] text-white' : 'text-slate-300'
            }`}
          >
            Controls
          </button>
          <button
            onClick={() => onToggleViewMode('preview')}
            className={`px-3 py-1.5 text-xs font-bold rounded transition ${
              viewMode === 'preview' ? 'bg-[#00A3A6] text-white' : 'text-slate-300'
            }`}
          >
            Preview
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleExportCSV}
            className="p-2 bg-white/10 hover:bg-white/20 text-emerald-400 rounded-lg border border-white/15 text-xs font-bold flex items-center gap-1"
            title="CSV Export"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span className="text-[11px]">CSV</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-[#00A3A6] to-[#007A7C] text-white text-xs font-extrabold rounded-lg shadow-lg active:scale-95 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Exporting...' : 'Download PDF'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
