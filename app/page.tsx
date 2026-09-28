'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { AccountDetails, StatementData, Transaction } from '@/types/statement';
import { DEFAULT_ACCOUNT, generateMockTransactions, calculateSummaryAndBalances, redistributeTransactionDates } from '@/lib/mockData';
import { Navbar } from '@/components/Navbar';
import { FormDashboard } from '@/components/FormDashboard';
import { TruistStatementPreview } from '@/components/TruistStatementPreview';
import { format, subDays } from 'date-fns';

export default function Home() {
  // State Initialization
  const [account, setAccount] = useState<AccountDetails>(DEFAULT_ACCOUNT);
  const [openingBalance, setOpeningBalance] = useState<number>(3450.75);

  const initialDates = useMemo(() => {
    const end = new Date();
    const start = subDays(end, 30);
    return {
      startDate: format(start, 'yyyy-MM-dd'),
      endDate: format(end, 'yyyy-MM-dd'),
    };
  }, []);

  const [startDate, setStartDate] = useState<string>(initialDates.startDate);
  const [endDate, setEndDate] = useState<string>(initialDates.endDate);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [viewMode, setViewMode] = useState<'split' | 'preview' | 'form'>('split');

  // Generate initial mock data on mount with 29 transactions by default
  useEffect(() => {
    const initialTx = generateMockTransactions(initialDates.startDate, initialDates.endDate, 29);
    setTransactions(initialTx);
  }, [initialDates]);

  // Compute calculated statement summary & balances in real-time
  const { summary, transactionsWithBalances } = useMemo(() => {
    return calculateSummaryAndBalances(openingBalance, transactions, startDate, endDate);
  }, [openingBalance, transactions, startDate, endDate]);

  // Full Statement Data Object
  const statementData: StatementData = useMemo(() => {
    return {
      account,
      summary: {
        ...summary,
        startDate,
        endDate,
      },
      transactions: transactionsWithBalances,
    };
  }, [account, summary, startDate, endDate, transactionsWithBalances]);

  // Handler Functions
  const handleUpdateAccount = (updated: AccountDetails) => {
    setAccount(updated);
  };

  const handleUpdateOpeningBalance = (bal: number) => {
    setOpeningBalance(bal);
  };

  const handleUpdateDates = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
    if (start && end) {
      setTransactions((prev) => redistributeTransactionDates(prev, start, end));
    }
  };

  const handleAddTransaction = (newTx: Transaction) => {
    setTransactions((prev) => [...prev, newTx]);
  };

  const handleEditTransaction = (updatedTx: Transaction) => {
    setTransactions((prev) => prev.map((t) => (t.id === updatedTx.id ? updatedTx : t)));
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const handleGenerateMockData = (count?: number) => {
    const newTx = generateMockTransactions(startDate, endDate, count || 29);
    setTransactions(newTx);
  };

  const handleResetAll = () => {
    setAccount(DEFAULT_ACCOUNT);
    setOpeningBalance(3450.75);
    setStartDate(initialDates.startDate);
    setEndDate(initialDates.endDate);
    setTransactions(generateMockTransactions(initialDates.startDate, initialDates.endDate, 29));
  };

  return (
    <div className="min-h-screen max-w-full overflow-x-hidden bg-[#0D0614] text-slate-100 flex flex-col font-sans">
      {/* Navbar Header (Fixed Top) */}
      <Navbar
        data={statementData}
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
        onGenerateMock={handleGenerateMockData}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-[1650px] w-full mx-auto p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start overflow-hidden">
        {/* LEFT COLUMN: Form Controls Dashboard */}
        <div
          className={`lg:col-span-5 xl:col-span-4 h-[calc(100vh-110px)] overflow-y-auto sticky top-20 no-print rounded-xl border border-white/10 bg-[#130824] p-2 sm:p-4 custom-scrollbar ${
            viewMode === 'preview' ? 'hidden lg:block' : 'block'
          }`}
        >
          <FormDashboard
            account={account}
            summary={summary}
            transactions={transactionsWithBalances}
            onUpdateAccount={handleUpdateAccount}
            onUpdateOpeningBalance={handleUpdateOpeningBalance}
            onUpdateDates={handleUpdateDates}
            onAddTransaction={handleAddTransaction}
            onEditTransaction={handleEditTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            onGenerateMockData={handleGenerateMockData}
            onResetAll={handleResetAll}
          />
        </div>

        {/* RIGHT COLUMN: Dedicated Vertically Scrollable Document Preview Container */}
        <div
          className={`w-full flex flex-col h-[calc(100vh-110px)] min-h-[500px] overflow-hidden ${
            viewMode === 'form'
              ? 'hidden lg:flex lg:col-span-7 xl:col-span-8'
              : viewMode === 'preview'
              ? 'lg:col-span-12'
              : 'lg:col-span-7 xl:col-span-8'
          }`}
        >
          {/* Fixed Top Control / Status Bar over Preview */}
          <div className="no-print mb-3 flex flex-wrap justify-between items-center bg-[#1D0933]/90 px-4 py-2.5 rounded-lg border border-white/10 text-xs text-slate-300 gap-2 shrink-0 shadow-md">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-100 font-semibold">Document Preview Engine</span>
              <span className="text-[10px] bg-amber-500/20 border border-amber-500/40 text-amber-300 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                DEMO / SAMPLE
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-slate-400 text-[11px] hidden sm:inline">Scroll document container below to view all pages & records</span>
              <span className="font-mono text-teal-300 font-bold bg-teal-950/80 px-2.5 py-1 rounded border border-teal-500/40 shadow-sm">
                Showing 1–{transactions.length} of {transactions.length} records
              </span>
            </div>
          </div>

          {/* Dedicated Vertically Scrollable Document Container */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden rounded-xl bg-[#090312]/90 border border-white/10 p-2 sm:p-5 touch-pan-y custom-scrollbar shadow-inner">
            <TruistStatementPreview data={statementData} />
          </div>
        </div>
      </main>
    </div>
  );
}
