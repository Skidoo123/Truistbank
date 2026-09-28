'use client';

import React, { useState } from 'react';
import { AccountDetails, AccountType, CurrencyCode, FinancialSummary, Transaction } from '@/types/statement';
import { CURRENCIES } from '@/lib/currencies';
import { format, subDays } from 'date-fns';
import {
  User,
  Building2,
  Calendar,
  DollarSign,
  PlusCircle,
  Trash2,
  Edit2,
  Sparkles,
  CreditCard,
  Hash,
  MapPin,
  ListOrdered,
  Save,
  RotateCcw,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

interface FormDashboardProps {
  account: AccountDetails;
  summary: FinancialSummary;
  transactions: Transaction[];
  onUpdateAccount: (account: AccountDetails) => void;
  onUpdateOpeningBalance: (balance: number) => void;
  onUpdateDates: (startDate: string, endDate: string) => void;
  onAddTransaction: (tx: Transaction) => void;
  onEditTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  onGenerateMockData: (count?: number) => void;
  onResetAll: () => void;
}

export const FormDashboard: React.FC<FormDashboardProps> = ({
  account,
  summary,
  transactions,
  onUpdateAccount,
  onUpdateOpeningBalance,
  onUpdateDates,
  onAddTransaction,
  onEditTransaction,
  onDeleteTransaction,
  onGenerateMockData,
  onResetAll,
}) => {
  const [activeTab, setActiveTab] = useState<'account' | 'summary' | 'transactions'>('account');
  const [generatorCountInput, setGeneratorCountInput] = useState<number>(100);

  // New/Editing Transaction state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [txForm, setTxForm] = useState<{
    date: string;
    valueDate: string;
    description: string;
    reference: string;
    type: 'credit' | 'debit';
    amount: string;
  }>({
    date: new Date().toISOString().split('T')[0],
    valueDate: new Date().toISOString().split('T')[0],
    description: '',
    reference: '',
    type: 'debit',
    amount: '',
  });

  const handleAccountChange = (field: keyof AccountDetails, value: string) => {
    onUpdateAccount({
      ...account,
      [field]: value,
    });
  };

  const handleTxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txForm.description || !txForm.amount) return;

    const numAmount = parseFloat(txForm.amount) || 0;
    if (numAmount <= 0) return;

    if (editingId) {
      onEditTransaction({
        id: editingId,
        date: txForm.date,
        valueDate: txForm.valueDate || txForm.date,
        description: txForm.description,
        reference: txForm.reference || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
        type: txForm.type,
        amount: numAmount,
      });
      setEditingId(null);
    } else {
      onAddTransaction({
        id: `tx-custom-${Date.now()}`,
        date: txForm.date,
        valueDate: txForm.valueDate || txForm.date,
        description: txForm.description,
        reference: txForm.reference || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
        type: txForm.type,
        amount: numAmount,
      });
    }

    // Reset Form
    setTxForm({
      date: new Date().toISOString().split('T')[0],
      valueDate: new Date().toISOString().split('T')[0],
      description: '',
      reference: '',
      type: 'debit',
      amount: '',
    });
  };

  const startEditTx = (tx: Transaction) => {
    setEditingId(tx.id);
    setTxForm({
      date: tx.date,
      valueDate: tx.valueDate || tx.date,
      description: tx.description,
      reference: tx.reference,
      type: tx.type,
      amount: tx.amount.toString(),
    });
    setActiveTab('transactions');
  };

  const cancelEditTx = () => {
    setEditingId(null);
    setTxForm({
      date: new Date().toISOString().split('T')[0],
      valueDate: new Date().toISOString().split('T')[0],
      description: '',
      reference: '',
      type: 'debit',
      amount: '',
    });
  };

  const handlePresetDates = (preset: 'last30' | 'thisMonth' | 'lastMonth' | 'ytd') => {
    const today = new Date();
    let start: Date;
    let end: Date = today;

    if (preset === 'last30') {
      start = subDays(today, 30);
    } else if (preset === 'thisMonth') {
      start = new Date(today.getFullYear(), today.getMonth(), 1);
    } else if (preset === 'lastMonth') {
      start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      end = new Date(today.getFullYear(), today.getMonth(), 0);
    } else {
      start = new Date(today.getFullYear(), 0, 1);
    }

    onUpdateDates(format(start, 'yyyy-MM-dd'), format(end, 'yyyy-MM-dd'));
  };

  return (
    <div className="w-full flex flex-col h-full bg-[#181026] text-slate-100 rounded-xl border border-white/10 shadow-2xl overflow-hidden">
      {/* Top Header Bar */}
      <div className="p-4 bg-gradient-to-r from-[#240046] via-[#3B0066] to-[#180033] border-b border-white/10 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img
            src="/truist-logo.png"
            alt="Truist Logo"
            className="w-7 h-7 object-contain rounded bg-white p-0.5 shadow"
          />
          <div>
            <h2 className="font-bold text-sm tracking-wide text-white">Statement Controls</h2>
            <p className="text-[10px] text-teal-300 font-mono">Truist Generator Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onGenerateMockData(50)}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-[#00A3A6] hover:bg-[#008489] text-white text-xs font-semibold rounded-lg shadow transition"
            title="Generate 50 transactions"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>50 Tx</span>
          </button>

          <button
            onClick={() => onGenerateMockData(100)}
            className="px-2.5 py-1.5 bg-[#240046] hover:bg-[#3B0066] border border-[#00A3A6]/40 text-teal-300 font-bold text-xs rounded-lg transition"
            title="Generate 100 transactions"
          >
            100 Tx
          </button>

          <button
            onClick={() => onGenerateMockData(200)}
            className="hidden sm:flex items-center px-2.5 py-1.5 bg-gradient-to-r from-purple-700 to-teal-600 hover:opacity-90 text-white font-extrabold text-xs rounded-lg shadow transition"
            title="Generate 200 transactions"
          >
            200 Tx
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-white/10 bg-[#120B1D]">
        <button
          onClick={() => setActiveTab('account')}
          className={`flex-1 py-3 px-2 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
            activeTab === 'account'
              ? 'border-[#00A3A6] text-[#00A3A6] bg-white/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Account & Customer</span>
        </button>

        <button
          onClick={() => setActiveTab('summary')}
          className={`flex-1 py-3 px-2 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
            activeTab === 'summary'
              ? 'border-[#00A3A6] text-[#00A3A6] bg-white/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Financial Summary</span>
        </button>

        <button
          onClick={() => setActiveTab('transactions')}
          className={`flex-1 py-3 px-2 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
            activeTab === 'transactions'
              ? 'border-[#00A3A6] text-[#00A3A6] bg-white/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ListOrdered className="w-3.5 h-3.5" />
          <span>Ledger ({transactions.length})</span>
        </button>
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 p-5 overflow-y-auto space-y-6">
        {/* TAB 1: ACCOUNT & CUSTOMER DETAILS */}
        {activeTab === 'account' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
              <Building2 className="w-4 h-4" />
              Customer & Bank Information
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Account Holder Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={account.accountHolderName}
                    onChange={(e) => handleAccountChange('accountHolderName', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-[#00A3A6] transition"
                    placeholder="Full Name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Customer Address
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <textarea
                    rows={3}
                    value={account.customerAddress}
                    onChange={(e) => handleAccountChange('customerAddress', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-[#00A3A6] transition resize-none"
                    placeholder="Street, Suite, City, State ZIP"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Account Number
                  </label>
                  <div className="relative">
                    <Hash className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      value={account.accountNumber}
                      onChange={(e) => handleAccountChange('accountNumber', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#00A3A6] transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Routing / Sort Code
                  </label>
                  <div className="relative">
                    <CreditCard className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      value={account.routingNumber}
                      onChange={(e) => handleAccountChange('routingNumber', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#00A3A6] transition"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Account Type
                  </label>
                  <select
                    value={account.accountType}
                    onChange={(e) => handleAccountChange('accountType', e.target.value as AccountType)}
                    className="w-full bg-[#181026] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00A3A6] transition"
                  >
                    <option value="Checking">Checking / Current</option>
                    <option value="Savings">Savings</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Domiciliary">Domiciliary</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Currency
                  </label>
                  <select
                    value={account.currency}
                    onChange={(e) => handleAccountChange('currency', e.target.value as CurrencyCode)}
                    className="w-full bg-[#181026] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00A3A6] transition"
                  >
                    {Object.values(CURRENCIES).map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Bank Name & Branch
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={account.bankName}
                    onChange={(e) => handleAccountChange('bankName', e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00A3A6]"
                    placeholder="Bank Name"
                  />
                  <input
                    type="text"
                    value={account.branchName}
                    onChange={(e) => handleAccountChange('branchName', e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00A3A6]"
                    placeholder="Branch Name"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FINANCIAL SUMMARY */}
        {activeTab === 'summary' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              Statement Period & Balance Summary
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Start Date</label>
                <input
                  type="date"
                  value={summary.startDate}
                  onChange={(e) => onUpdateDates(e.target.value, summary.endDate)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#00A3A6]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">End Date</label>
                <input
                  type="date"
                  value={summary.endDate}
                  onChange={(e) => onUpdateDates(summary.startDate, e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#00A3A6]"
                />
              </div>
            </div>

            {/* Quick Date Presets */}
            <div>
              <p className="text-[10px] text-slate-400 font-medium mb-1.5">Quick Date Ranges:</p>
              <div className="grid grid-cols-4 gap-1.5">
                <button
                  type="button"
                  onClick={() => handlePresetDates('last30')}
                  className="px-2 py-1 bg-white/5 hover:bg-[#00A3A6]/20 hover:border-[#00A3A6]/50 border border-white/10 rounded text-[10px] text-slate-300 hover:text-white transition text-center font-medium"
                >
                  Last 30D
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetDates('thisMonth')}
                  className="px-2 py-1 bg-white/5 hover:bg-[#00A3A6]/20 hover:border-[#00A3A6]/50 border border-white/10 rounded text-[10px] text-slate-300 hover:text-white transition text-center font-medium"
                >
                  This Month
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetDates('lastMonth')}
                  className="px-2 py-1 bg-white/5 hover:bg-[#00A3A6]/20 hover:border-[#00A3A6]/50 border border-white/10 rounded text-[10px] text-slate-300 hover:text-white transition text-center font-medium"
                >
                  Last Month
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetDates('ytd')}
                  className="px-2 py-1 bg-white/5 hover:bg-[#00A3A6]/20 hover:border-[#00A3A6]/50 border border-white/10 rounded text-[10px] text-slate-300 hover:text-white transition text-center font-medium"
                >
                  YTD
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Opening Balance ({account.currency})
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-400 font-mono text-xs">
                  {CURRENCIES[account.currency]?.symbol || '$'}
                </span>
                <input
                  type="number"
                  step="0.01"
                  value={summary.openingBalance}
                  onChange={(e) => onUpdateOpeningBalance(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-7 pr-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#00A3A6]"
                />
              </div>
            </div>

            {/* Auto Calculated Metrics Cards */}
            <div className="space-y-2 pt-2">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Calculated Statement Metrics
              </p>

              <div className="grid grid-cols-1 gap-2.5">
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/20 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-emerald-400 font-bold uppercase">Total Credits (+) / Deposits</p>
                    <p className="text-sm font-bold font-mono text-emerald-300">
                      +{CURRENCIES[account.currency]?.symbol}{summary.totalCredits.toFixed(2)}
                    </p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>

                <div className="p-3 bg-rose-950/40 border border-rose-500/20 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-rose-400 font-bold uppercase">Total Debits (-) / Withdrawals</p>
                    <p className="text-sm font-bold font-mono text-rose-300">
                      -{CURRENCIES[account.currency]?.symbol}{summary.totalDebits.toFixed(2)}
                    </p>
                  </div>
                  <XCircle className="w-5 h-5 text-rose-400" />
                </div>

                <div className="p-3 bg-[#240046] border border-[#00A3A6]/40 rounded-lg flex justify-between items-center shadow-lg">
                  <div>
                    <p className="text-[10px] text-teal-300 font-bold uppercase">Net Closing Balance</p>
                    <p className="text-base font-extrabold font-mono text-white">
                      {CURRENCIES[account.currency]?.symbol}{summary.closingBalance.toFixed(2)}
                    </p>
                  </div>
                  <div className="px-2 py-1 bg-[#00A3A6] rounded text-[10px] font-bold text-white">
                    AUTO-UPDATED
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TRANSACTION LEDGER */}
        {activeTab === 'transactions' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Bulk Generator Control Box */}
            <div className="p-3.5 bg-gradient-to-r from-[#240046] via-[#1E0938] to-[#120B1D] border border-[#00A3A6]/40 rounded-lg space-y-2.5 shadow-lg">
              <div className="flex justify-between items-center text-xs font-bold text-teal-300">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
                  Bulk Statement Generator (Up to 200 Rows)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{transactions.length} Loaded</span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onGenerateMockData(25)}
                  className="px-2.5 py-1 bg-white/5 hover:bg-[#00A3A6]/20 border border-white/10 rounded text-[11px] font-medium text-slate-200 transition"
                >
                  25 Tx
                </button>
                <button
                  type="button"
                  onClick={() => onGenerateMockData(50)}
                  className="px-2.5 py-1 bg-white/5 hover:bg-[#00A3A6]/20 border border-white/10 rounded text-[11px] font-medium text-slate-200 transition"
                >
                  50 Tx
                </button>
                <button
                  type="button"
                  onClick={() => onGenerateMockData(100)}
                  className="px-3 py-1 bg-[#240046] hover:bg-[#3B0066] border border-[#00A3A6]/50 rounded text-[11px] font-bold text-teal-300 transition"
                >
                  100 Tx
                </button>
                <button
                  type="button"
                  onClick={() => onGenerateMockData(150)}
                  className="px-3 py-1 bg-[#240046] hover:bg-[#3B0066] border border-[#00A3A6]/50 rounded text-[11px] font-bold text-teal-300 transition"
                >
                  150 Tx
                </button>
                <button
                  type="button"
                  onClick={() => onGenerateMockData(200)}
                  className="px-3 py-1 bg-gradient-to-r from-[#00A3A6] to-purple-600 hover:opacity-95 rounded text-[11px] font-extrabold text-white shadow transition"
                >
                  200 Tx
                </button>
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-white/10">
                <span className="text-[10px] text-slate-300">Custom Count:</span>
                <input
                  type="number"
                  min={1}
                  max={200}
                  value={generatorCountInput}
                  onChange={(e) => setGeneratorCountInput(Math.min(200, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-20 bg-[#120B1D] border border-white/20 rounded px-2.5 py-1 text-xs font-mono text-white focus:outline-none focus:border-[#00A3A6]"
                />
                <button
                  type="button"
                  onClick={() => onGenerateMockData(generatorCountInput)}
                  className="flex-1 py-1 px-3 bg-[#00A3A6] hover:bg-[#008489] text-white text-xs font-bold rounded shadow transition"
                >
                  Generate {generatorCountInput} Transactions
                </button>
              </div>
            </div>

            {/* Add/Edit Transaction Form */}
            <form onSubmit={handleTxSubmit} className="p-3.5 bg-white/5 border border-white/10 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold uppercase text-teal-400 flex items-center gap-1.5">
                  <PlusCircle className="w-3.5 h-3.5" />
                  {editingId ? 'Edit Transaction' : 'Add Single Transaction'}
                </h4>
                {editingId && (
                  <button
                    type="button"
                    onClick={cancelEditTx}
                    className="text-[10px] text-rose-400 hover:underline"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-300 mb-0.5">Date</label>
                  <input
                    type="date"
                    value={txForm.date}
                    onChange={(e) => setTxForm({ ...txForm, date: e.target.value })}
                    className="w-full bg-[#120B1D] border border-white/10 rounded px-2 py-1 text-xs font-mono text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-300 mb-0.5">Type</label>
                  <select
                    value={txForm.type}
                    onChange={(e) => setTxForm({ ...txForm, type: e.target.value as 'credit' | 'debit' })}
                    className="w-full bg-[#120B1D] border border-white/10 rounded px-2 py-1 text-xs text-white"
                  >
                    <option value="debit">Debit (Withdrawal -)</option>
                    <option value="credit">Credit (Deposit +)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-300 mb-0.5">Description / Narration</label>
                <input
                  type="text"
                  placeholder="e.g. TRUIST ATM WITHDRAWAL #9412"
                  value={txForm.description}
                  onChange={(e) => setTxForm({ ...txForm, description: e.target.value })}
                  className="w-full bg-[#120B1D] border border-white/10 rounded px-2.5 py-1 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-300 mb-0.5">Reference ID</label>
                  <input
                    type="text"
                    placeholder="Auto-generated if empty"
                    value={txForm.reference}
                    onChange={(e) => setTxForm({ ...txForm, reference: e.target.value })}
                    className="w-full bg-[#120B1D] border border-white/10 rounded px-2 py-1 text-xs font-mono text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-300 mb-0.5">
                    Amount ({CURRENCIES[account.currency]?.symbol})
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={txForm.amount}
                    onChange={(e) => setTxForm({ ...txForm, amount: e.target.value })}
                    className="w-full bg-[#120B1D] border border-white/10 rounded px-2 py-1 text-xs font-mono text-white"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#240046] hover:bg-[#3B0066] border border-[#00A3A6]/40 text-white font-bold text-xs rounded transition flex items-center justify-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5 text-[#00A3A6]" />
                <span>{editingId ? 'Save Changes' : 'Add to Statement'}</span>
              </button>
            </form>

            {/* List of Existing Transactions */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                <span>Transaction History</span>
                <span className="text-[10px] font-normal text-slate-500">Sorted by Date</span>
              </div>

              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                {transactions.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-white/10 rounded-lg">
                    No transactions yet. Click "Generate Mock Data" above or add one manually.
                  </div>
                ) : (
                  transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex justify-between items-start text-xs transition"
                    >
                      <div className="space-y-0.5 max-w-[65%]">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-slate-400">{tx.date}</span>
                          <span
                            className={`px-1.5 py-0.2 text-[9px] font-bold rounded uppercase ${
                              tx.type === 'credit'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-rose-500/20 text-rose-300'
                            }`}
                          >
                            {tx.type}
                          </span>
                        </div>
                        <p className="font-medium text-white truncate">{tx.description}</p>
                        <p className="font-mono text-[9.5px] text-slate-400">{tx.reference}</p>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={`font-mono font-bold ${
                            tx.type === 'credit' ? 'text-emerald-400' : 'text-slate-200'
                          }`}
                        >
                          {tx.type === 'credit' ? '+' : '-'}${tx.amount.toFixed(2)}
                        </span>

                        <div className="flex items-center gap-1.5 mt-1">
                          <button
                            onClick={() => startEditTx(tx)}
                            className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-teal-300 transition"
                            title="Edit"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => onDeleteTransaction(tx.id)}
                            className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-rose-400 transition"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Footer Control */}
      <div className="p-3 bg-[#120B1D] border-t border-white/10 flex justify-between items-center text-xs">
        <button
          onClick={onResetAll}
          className="flex items-center gap-1 text-slate-400 hover:text-rose-400 transition text-[11px]"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Defaults</span>
        </button>

        <span className="text-[10px] text-slate-500 font-mono">
          Truist Format v2.4
        </span>
      </div>
    </div>
  );
};
