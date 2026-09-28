'use client';

import React from 'react';
import { StatementData } from '@/types/statement';
import { formatCurrency } from '@/lib/currencies';
import { formatDateForStatement } from '@/lib/mockData';
import { Landmark, ShieldCheck, PhoneCall, HelpCircle } from 'lucide-react';

interface Props {
  data: StatementData;
}

export const TruistStatementPreview: React.FC<Props> = ({ data }) => {
  const { account, summary, transactions } = data;
  const curr = account.currency;

  return (
    <div className="w-full flex justify-center py-2 px-1 overflow-x-auto sm:overflow-x-visible">
      {/* Printable Statement Document (Simulating standard A4 portrait sheet) */}
      <div
        id="truist-statement-document"
        className="w-full max-w-[800px] bg-white text-slate-900 shadow-2xl rounded-sm p-8 sm:p-10 font-sans print:shadow-none print:p-0 print:max-w-none text-[13px] leading-snug border border-slate-200"
        style={{ minHeight: '1050px' }}
      >
        {/* TOP TRUIST BRAND HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-[#240046] pb-6 mb-6 gap-4">
          {/* Brand Logo & Address */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <img
                src="/truist-logo.png"
                alt="Truist Logo"
                className="w-10 h-10 object-contain rounded"
              />
              <div>
                <h1 className="text-2xl font-black tracking-tight text-[#240046] font-sans">
                  TRUIST <span className="text-[#00A3A6] font-semibold text-lg">HH</span>
                </h1>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                  {account.bankName || 'TRUIST BANK'}
                </p>
              </div>
            </div>
            <div className="text-[11px] text-slate-600 mt-2 leading-tight">
              <p className="font-semibold text-slate-800">{account.bankAddress || 'P.O. Box 1847, Wilson, NC 27894-1847'}</p>
              <p>Customer Care: {account.bankPhone || '844-4TRUIST (844-487-8478)'}</p>
              <p className="text-[#008489] font-medium">www.truist.com</p>
            </div>
          </div>

          {/* Statement Meta & Account Details */}
          <div className="text-right sm:text-right w-full sm:w-auto bg-slate-50 p-4 rounded border border-slate-200">
            <h2 className="text-base font-bold text-[#240046] uppercase tracking-wider mb-1">
              ACCOUNT STATEMENT
            </h2>
            <div className="text-xs space-y-1 text-slate-700">
              <p>
                <span className="text-slate-500">Statement Period:</span>{' '}
                <span className="font-semibold text-slate-900">
                  {formatDateForStatement(summary.startDate)} to {formatDateForStatement(summary.endDate)}
                </span>
              </p>
              <p>
                <span className="text-slate-500">Account Number:</span>{' '}
                <span className="font-mono font-bold text-[#240046]">{account.accountNumber}</span>
              </p>
              <p>
                <span className="text-slate-500">Routing / Sort Code:</span>{' '}
                <span className="font-mono font-semibold">{account.routingNumber || account.sortCode}</span>
              </p>
              <p>
                <span className="text-slate-500">Account Type:</span>{' '}
                <span className="font-semibold bg-[#240046]/10 text-[#240046] px-2 py-0.5 rounded text-[11px]">
                  Truist {account.accountType}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* CUSTOMER & BRANCH ADDRESS SECTION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div className="bg-slate-50/80 p-4 rounded-lg border border-slate-200">
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">Account Holder</p>
            <p className="font-bold text-slate-900 text-sm tracking-wide">{account.accountHolderName}</p>
            <div className="text-xs text-slate-600 mt-1 whitespace-pre-line font-mono leading-relaxed">
              {account.customerAddress}
            </div>
          </div>

          <div className="bg-[#240046]/5 p-4 rounded-lg border border-[#240046]/15 flex flex-col justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-[#240046] mb-1">Servicing Branch</p>
              <p className="font-bold text-slate-900 text-xs">{account.branchName || 'Charlotte Main Branch'}</p>
              <p className="text-xs text-slate-600 mt-0.5">Primary Contact: Truist Direct Line</p>
            </div>
            <div className="flex items-center gap-2 mt-3 pt-2 border-t border-[#240046]/10 text-[11px] text-[#240046] font-medium">
              <ShieldCheck className="w-4 h-4 text-[#00A3A6]" />
              <span>FDIC-Insured Account Deposit Protection</span>
            </div>
          </div>
        </div>

        {/* ACCOUNT FINANCIAL SUMMARY GRID */}
        <div className="mb-8">
          <div className="bg-[#240046] text-white px-4 py-2.5 rounded-t-lg flex justify-between items-center shadow-sm">
            <span className="font-bold tracking-wide uppercase text-xs flex items-center gap-2">
              <Landmark className="w-4 h-4 text-[#00A3A6]" />
              ACCOUNT SUMMARY OVERVIEW
            </span>
            <span className="text-[11px] opacity-80 font-mono">Currency: {curr}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-slate-200 border-x border-b border-slate-200 bg-white rounded-b-lg text-center overflow-hidden">
            {/* Opening Balance */}
            <div className="p-4 hover:bg-slate-50 transition-colors">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Beginning Balance
              </p>
              <p className="text-base font-bold font-mono text-slate-800">
                {formatCurrency(summary.openingBalance, curr)}
              </p>
            </div>

            {/* Total Credits */}
            <div className="p-4 hover:bg-emerald-50/50 transition-colors">
              <p className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider mb-1">
                Total Deposits (+)
              </p>
              <p className="text-base font-bold font-mono text-emerald-600">
                +{formatCurrency(summary.totalCredits, curr)}
              </p>
            </div>

            {/* Total Debits */}
            <div className="p-4 hover:bg-rose-50/50 transition-colors">
              <p className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider mb-1">
                Total Withdrawals (-)
              </p>
              <p className="text-base font-bold font-mono text-rose-600">
                -{formatCurrency(summary.totalDebits, curr)}
              </p>
            </div>

            {/* Ending Balance */}
            <div className="p-4 bg-[#240046]/5 hover:bg-[#240046]/10 transition-colors">
              <p className="text-[11px] font-bold text-[#240046] uppercase tracking-wider mb-1">
                Ending Balance (=)
              </p>
              <p className="text-base font-extrabold font-mono text-[#240046]">
                {formatCurrency(summary.closingBalance, curr)}
              </p>
            </div>
          </div>
        </div>

        {/* TRANSACTION LEDGER TABLE */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#00A3A6] rounded-full inline-block" />
              TRANSACTION ACTIVITY DETAILS
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              {transactions.length} Total Record{transactions.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#240046] text-white text-[11px] font-semibold tracking-wider uppercase">
                  <th className="py-2.5 px-3 border-r border-white/10 w-[90px]">Date</th>
                  <th className="py-2.5 px-3 border-r border-white/10 w-[90px]">Value Date</th>
                  <th className="py-2.5 px-3 border-r border-white/10">Description / Merchant</th>
                  <th className="py-2.5 px-3 border-r border-white/10 w-[110px]">Reference</th>
                  <th className="py-2.5 px-3 border-r border-white/10 text-right w-[110px]">Amount ({curr})</th>
                  <th className="py-2.5 px-3 text-right w-[120px]">Balance ({curr})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 italic">
                      No transactions recorded in this period.
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx, idx) => {
                    const isCredit = tx.type === 'credit';
                    return (
                      <tr
                        key={tx.id || idx}
                        className={`transition-colors ${
                          idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'
                        } hover:bg-purple-50/40`}
                      >
                        <td className="py-2.5 px-3 font-mono text-slate-700 whitespace-nowrap">
                          {formatDateForStatement(tx.date)}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-500 whitespace-nowrap">
                          {formatDateForStatement(tx.valueDate || tx.date)}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-slate-900 leading-snug">
                          {tx.description}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                          {tx.reference}
                        </td>
                        <td
                          className={`py-2.5 px-3 font-mono font-bold text-right whitespace-nowrap ${
                            isCredit ? 'text-emerald-700' : 'text-slate-800'
                          }`}
                        >
                          {isCredit ? '+' : '-'}{formatCurrency(tx.amount, curr)}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-right text-slate-900 whitespace-nowrap bg-slate-50/40">
                          {tx.runningBalance !== undefined ? formatCurrency(tx.runningBalance, curr) : '-'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* FOOTER & LEGAL DISCLAIMER */}
        <div className="mt-auto pt-6 border-t border-slate-200 text-[10px] text-slate-500 space-y-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-slate-50 p-3 rounded border border-slate-200">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-3.5 h-3.5 text-[#240046]" />
              <span>
                <strong>Questions about your statement?</strong> Call Truist Client Care at 844-4TRUIST (844-487-8478).
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <HelpCircle className="w-3.5 h-3.5 text-[#00A3A6]" />
              <span>Online Banking: truist.com/support</span>
            </div>
          </div>

          <div className="leading-normal text-slate-400 text-[9.5px]">
            <p className="mb-1">
              <strong>IMPORTANT NOTICE:</strong> Truist Bank is Member FDIC. Equal Housing Lender. Please examine this statement immediately upon receipt. Any errors or unauthorized transactions must be reported within 60 days of the statement date.
            </p>
            <p>
              Electronic transfers, Automated Clearing House (ACH), and Zelle payments are subject to the Truist Bank Account Agreement and Disclosure.
            </p>
          </div>

          <div className="flex justify-between items-center pt-2 text-[10px] font-mono text-slate-400 border-t border-slate-100">
            <span>Truist Bank © 2026. All rights reserved.</span>
            <span>Document Ref: TRST-STMT-{account.accountNumber.slice(-4)}-{Date.now().toString().slice(-6)}</span>
            <span>Page 1 of {Math.max(1, Math.ceil((transactions.length + 6) / 22))}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
