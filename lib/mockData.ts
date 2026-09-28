import { AccountDetails, FinancialSummary, Transaction } from '@/types/statement';
import { format, subDays, addDays, parseISO, isValid } from 'date-fns';

export const DEFAULT_ACCOUNT: AccountDetails = {
  accountHolderName: 'ALEXANDER D. MORGAN',
  customerAddress: '4812 PARKMONT BOULEVARD\nSUITE 300\nCHARLOTTE, NC 28277',
  accountNumber: '100028491823',
  routingNumber: '053100465',
  accountType: 'Checking',
  bankName: 'TRUIST BANK',
  branchName: 'SouthPark Branch - Charlotte',
  sortCode: '053100465',
  currency: 'USD',
  bankAddress: 'PO Box 1847, Wilson, NC 27894-1847',
  bankPhone: '844-4TRUIST (844-487-8478)',
};

export const formatDateForStatement = (dateStr: string): string => {
  if (!dateStr) return '';
  try {
    const d = parseISO(dateStr);
    if (!isValid(d)) return dateStr;
    return format(d, 'MM/dd/yyyy');
  } catch {
    return dateStr;
  }
};

export const generateMockTransactions = (
  startDateStr: string,
  endDateStr: string,
  count?: number
): Transaction[] => {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const mockTemplates = [
    { desc: 'ACME CORP PAYROLL DIRECT DEPOSIT', type: 'credit' as const, min: 2850, max: 5200, prefix: 'DEP' },
    { desc: 'TRUIST ATM WITHDRAWAL #8841 CHARLOTTE NC', type: 'debit' as const, min: 40, max: 200, prefix: 'ATM' },
    { desc: 'ZELLE TRANSFER FROM SARAH JENKINS REF #ZEL884', type: 'credit' as const, min: 100, max: 650, prefix: 'ZEL' },
    { desc: 'AMAZON.COM*MB9481 DIGITAL SEATTLE WA', type: 'debit' as const, min: 14.99, max: 189.50, prefix: 'POS' },
    { desc: 'STARBUCKS STORE 04812 CHARLOTTE NC', type: 'debit' as const, min: 5.75, max: 18.40, prefix: 'POS' },
    { desc: 'DUKE ENERGY ELECTRIC BILL AUTO PAY', type: 'debit' as const, min: 120, max: 240, prefix: 'ACH' },
    { desc: 'WHOLE FOODS MARKET CHARLOTTE NC', type: 'debit' as const, min: 45.20, max: 195.80, prefix: 'POS' },
    { desc: 'TRUIST ONLINE TRANSFER TO SAVINGS *4812', type: 'debit' as const, min: 250, max: 1000, prefix: 'TRF' },
    { desc: 'CHEVRON GAS STATION 901 CHARLOTTE NC', type: 'debit' as const, min: 35.00, max: 72.50, prefix: 'POS' },
    { desc: 'STRIPE FREELANCE PAYMENTS DISBURSEMENT', type: 'credit' as const, min: 450, max: 1850, prefix: 'DEP' },
    { desc: 'TARGET STORES 1402 CHARLOTTE NC', type: 'debit' as const, min: 28.50, max: 142.10, prefix: 'POS' },
    { desc: 'UBER TRIP RIDE HELP.UBER.COM', type: 'debit' as const, min: 18.25, max: 45.90, prefix: 'POS' },
    { desc: 'APPLE.COM/BILL CUPERTINO CA', type: 'debit' as const, min: 9.99, max: 29.99, prefix: 'POS' },
    { desc: 'TRUIST INTEREST CREDIT FOR PERIOD', type: 'credit' as const, min: 4.50, max: 22.80, prefix: 'INT' },
    { desc: 'NETFLIX.COM STREAMING SUBSCRIPTION', type: 'debit' as const, min: 15.49, max: 22.99, prefix: 'POS' },
    { desc: 'WALMART SUPERCENTER CHARLOTTE NC', type: 'debit' as const, min: 52.10, max: 210.40, prefix: 'POS' },
    { desc: 'TRADER JOES #542 CHARLOTTE NC', type: 'debit' as const, min: 38.40, max: 115.90, prefix: 'POS' },
    { desc: 'STATE FARM AUTO INSURANCE PREMIUM', type: 'debit' as const, min: 145.00, max: 198.00, prefix: 'ACH' },
    { desc: 'CHARLOTTE WATER UTILITY BILL PAY', type: 'debit' as const, min: 42.00, max: 88.50, prefix: 'ACH' },
    { desc: 'CHIPOTLE ONLINE 1842 CHARLOTTE NC', type: 'debit' as const, min: 12.80, max: 34.50, prefix: 'POS' },
    { desc: 'BEST BUY STORES 0492 CHARLOTTE NC', type: 'debit' as const, min: 89.99, max: 420.00, prefix: 'POS' },
    { desc: 'VENMO CASHOUT DISBURSEMENT REF 981240', type: 'credit' as const, min: 80.00, max: 450.00, prefix: 'DEP' },
    { desc: 'HOME DEPOT STORE #3821 CHARLOTTE NC', type: 'debit' as const, min: 64.30, max: 310.20, prefix: 'POS' },
    { desc: 'SPOTIFY USA STREAMING SERVICE', type: 'debit' as const, min: 10.99, max: 16.99, prefix: 'POS' },
    { desc: 'CVS PHARMACY #4812 CHARLOTTE NC', type: 'debit' as const, min: 18.50, max: 62.40, prefix: 'POS' },
    { desc: 'DOORDASH FOOD DELIVERY SAN FRANCISCO', type: 'debit' as const, min: 24.50, max: 68.20, prefix: 'POS' },
    { desc: 'COSTCO WHOLESALE #341 CHARLOTTE NC', type: 'debit' as const, min: 125.00, max: 380.00, prefix: 'POS' },
    { desc: 'ZELLE TRANSFER TO DAVID MILLER REF #ZEL992', type: 'debit' as const, min: 50.00, max: 250.00, prefix: 'ZEL' },
    { desc: 'TRUIST ATM DEPOSIT CASH/CHECK #8821', type: 'credit' as const, min: 200.00, max: 850.00, prefix: 'ATM' },
  ];

  const numTransactions = count ? Math.min(200, Math.max(1, count)) : Math.floor(Math.random() * 8) + 25;

  const transactions: Transaction[] = [];

  for (let i = 0; i < numTransactions; i++) {
    const dayOffset = Math.floor((i / Math.max(1, numTransactions - 1)) * diffDays);
    const txDate = addDays(start, dayOffset);
    const dateFormatted = format(txDate, 'yyyy-MM-dd');
    const template = mockTemplates[i % mockTemplates.length];

    const rawAmount = Math.random() * (template.max - template.min) + template.min;
    const amount = Math.round(rawAmount * 100) / 100;
    const randomRef = `${template.prefix}-${Math.floor(10000000 + Math.random() * 90000000)}`;

    transactions.push({
      id: `tx-${i + 1}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      date: dateFormatted,
      valueDate: dateFormatted,
      description: template.desc,
      reference: randomRef,
      type: template.type,
      amount,
    });
  }

  // Sort by date ascending
  return transactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const redistributeTransactionDates = (
  transactions: Transaction[],
  startDateStr: string,
  endDateStr: string
): Transaction[] => {
  if (transactions.length === 0) return [];

  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return transactions;

  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const count = transactions.length;

  return transactions.map((tx, idx) => {
    const dayOffset = Math.floor((idx / Math.max(1, count - 1)) * diffDays);
    const txDate = addDays(start, dayOffset);
    const dateFormatted = format(txDate, 'yyyy-MM-dd');

    return {
      ...tx,
      date: dateFormatted,
      valueDate: dateFormatted,
    };
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const calculateSummaryAndBalances = (
  openingBalance: number,
  transactions: Transaction[],
  customStartDate?: string,
  customEndDate?: string
): { summary: FinancialSummary; transactionsWithBalances: Transaction[] } => {
  let running = openingBalance;
  let totalCredits = 0;
  let totalDebits = 0;

  const sortedTx = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const transactionsWithBalances = sortedTx.map((tx) => {
    if (tx.type === 'credit') {
      running += tx.amount;
      totalCredits += tx.amount;
    } else {
      running -= tx.amount;
      totalDebits += tx.amount;
    }
    return {
      ...tx,
      runningBalance: Math.round(running * 100) / 100,
    };
  });

  const startDate = customStartDate || (sortedTx.length > 0 ? sortedTx[0].date : format(subDays(new Date(), 30), 'yyyy-MM-dd'));
  const endDate = customEndDate || (sortedTx.length > 0 ? sortedTx[sortedTx.length - 1].date : format(new Date(), 'yyyy-MM-dd'));

  return {
    summary: {
      startDate,
      endDate,
      openingBalance: Math.round(openingBalance * 100) / 100,
      totalCredits: Math.round(totalCredits * 100) / 100,
      totalDebits: Math.round(totalDebits * 100) / 100,
      closingBalance: Math.round(running * 100) / 100,
    },
    transactionsWithBalances,
  };
};
