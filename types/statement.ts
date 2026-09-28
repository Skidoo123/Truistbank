export type AccountType = 'Checking' | 'Savings' | 'Corporate' | 'Domiciliary';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'NGN';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
}

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  valueDate: string; // YYYY-MM-DD
  description: string;
  reference: string;
  type: 'credit' | 'debit';
  amount: number;
  runningBalance?: number;
}

export interface AccountDetails {
  accountHolderName: string;
  customerAddress: string;
  accountNumber: string;
  routingNumber: string;
  accountType: AccountType;
  bankName: string;
  branchName: string;
  sortCode: string; // or Routing #
  currency: CurrencyCode;
  bankAddress: string;
  bankPhone: string;
}

export interface FinancialSummary {
  startDate: string;
  endDate: string;
  openingBalance: number;
  totalCredits: number;
  totalDebits: number;
  closingBalance: number;
}

export interface StatementData {
  account: AccountDetails;
  summary: FinancialSummary;
  transactions: Transaction[];
}
