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

  // Generate initial mock data on mount
  useEffect(() => {
    const initialTx = generateMockTransactions(initialDates.startDate, initialDates.endDate);
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
    const newTx = generateMockTransactions(startDate, endDate, count);
    setTransactions(newTx);
  };

  const handleResetAll = () => {
    setAccount(DEFAULT_ACCOUNT);
    setOpeningBalance(3450.75);
    setStartDate(initialDates.startDate);
    setEndDate(initialDates.endDate);
    setTransactions(generateMockTransactions(initialDates.startDate, initialDates.endDate));
  };

  return (
    <div className="min-h-screen bg-[#0D0614] text-slate-100 flex flex-col font-sans">
      {/* Navbar Header */}
      <Navbar
        data={statementData}
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
        onGenerateMock={handleGenerateMockData}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Form Controls Dashboard */}
        <div
          className={`lg:col-span-5 xl:col-span-4 h-[calc(100vh-100px)] sticky top-20 no-print ${
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

        {/* RIGHT COLUMN: Live Truist Bank Statement Preview */}
        <div
          className={`w-full ${
            viewMode === 'form'
              ? 'hidden lg:block lg:col-span-7 xl:col-span-8'
              : viewMode === 'preview'
              ? 'lg:col-span-12'
              : 'lg:col-span-7 xl:col-span-8'
          }`}
        >
          {/* Header Banner over Statement */}
          <div className="no-print mb-3 flex justify-between items-center bg-white/5 px-4 py-2.5 rounded-lg border border-white/10 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-slate-200 font-medium">Live Render Engine:</span>
              <span>Official Truist Statement Document Format</span>
            </div>
            <div className="text-[11px] font-mono text-teal-400">
              {transactions.length} Transactions Loaded
            </div>
          </div>

          <TruistStatementPreview data={statementData} />
        </div>
      </main>
    </div>
  );
}
