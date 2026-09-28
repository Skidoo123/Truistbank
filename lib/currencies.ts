import { CurrencyCode, CurrencyConfig } from '@/types/statement';

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar ($)' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro (€)' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound (£)' },
  NGN: { code: 'NGN', symbol: '₦', name: 'Nigerian Naira (₦)' },
};

export const formatCurrency = (amount: number, currencyCode: CurrencyCode = 'USD'): string => {
  const currency = CURRENCIES[currencyCode] || CURRENCIES.USD;
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));

  return `${currency.symbol}${formatted}`;
};
