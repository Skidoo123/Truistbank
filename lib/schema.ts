import { z } from 'zod';

export const transactionSchema = z.object({
  id: z.string(),
  date: z.string().min(1, 'Date is required'),
  valueDate: z.string().min(1, 'Value Date is required'),
  description: z.string().min(1, 'Description is required'),
  reference: z.string().min(1, 'Reference is required'),
  type: z.enum(['credit', 'debit']),
  amount: z.coerce.number().positive('Amount must be positive'),
});

export const statementFormSchema = z.object({
  accountHolderName: z.string().min(2, 'Holder name must be at least 2 characters'),
  customerAddress: z.string().min(5, 'Address is required'),
  accountNumber: z.string().min(4, 'Account number is required'),
  routingNumber: z.string().min(4, 'Routing number is required'),
  accountType: z.enum(['Checking', 'Savings', 'Corporate', 'Domiciliary']),
  bankName: z.string().min(2, 'Bank name is required'),
  branchName: z.string().min(2, 'Branch name is required'),
  sortCode: z.string(),
  currency: z.enum(['USD', 'EUR', 'GBP', 'NGN']),
  bankAddress: z.string(),
  bankPhone: z.string(),
  
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  openingBalance: z.coerce.number().min(0, 'Opening balance must be 0 or greater'),
});

export type StatementFormData = z.infer<typeof statementFormSchema>;
