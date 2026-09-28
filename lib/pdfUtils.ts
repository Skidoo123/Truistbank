import { StatementData } from '@/types/statement';
import { formatCurrency } from './currencies';

export const downloadStatementPDF = async (elementId: string, filename: string = 'Truist_Account_Statement.pdf') => {
  if (typeof window === 'undefined') return;

  const input = document.getElementById(elementId);
  if (!input) {
    console.error(`Element with id ${elementId} not found.`);
    return;
  }

  try {
    // Dynamic import to prevent SSR prerendering issues with canvas/browser APIs
    const html2canvasModule = await import('html2canvas');
    const html2canvas = html2canvasModule.default || html2canvasModule;

    const jsPDFModule = await import('jspdf');
    const jsPDF = jsPDFModule.default || jsPDFModule;

    // Canvas options enforcing standard 800px printable width even on mobile screens
    const canvas = await html2canvas(input, {
      scale: 2, // High resolution (2x DPI)
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      scrollY: -window.scrollY,
      scrollX: 0,
      windowWidth: 1024, // Enforce 1024px virtual viewport so mobile PDF captures standard A4 desktop layout
      windowHeight: input.scrollHeight,
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          clonedElement.style.width = '800px';
          clonedElement.style.maxWidth = '800px';
          clonedElement.style.margin = '0 auto';
          clonedElement.style.transform = 'none';
        }
      },
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // First Page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;

    // Remaining pages if statement exceeds 1 page (up to 200 items)
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;
    }

    // Mobile-friendly Blob download for iOS Safari & Android Chrome
    const pdfBlob = pdf.output('blob');
    const blobUrl = URL.createObjectURL(pdfBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = blobUrl;
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 10000);
  } catch (err) {
    console.error('Failed to generate PDF:', err);
    window.print();
  }
};

export const exportStatementCSV = (data: StatementData) => {
  if (typeof window === 'undefined') return;

  const { account, summary, transactions } = data;
  const curr = account.currency;

  const rows: string[][] = [];

  // Header Section
  rows.push(['TRUIST BANK ACCOUNT STATEMENT']);
  rows.push(['Account Holder:', `"${account.accountHolderName.replace(/"/g, '""')}"`]);
  rows.push(['Account Number:', `'${account.accountNumber}`]);
  rows.push(['Routing Number:', `'${account.routingNumber}`]);
  rows.push(['Account Type:', account.accountType]);
  rows.push(['Statement Period:', `${summary.startDate || ''} to ${summary.endDate || ''}`]);
  rows.push([]);

  // Financial Summary Section
  rows.push(['FINANCIAL SUMMARY']);
  rows.push(['Opening Balance', formatCurrency(summary.openingBalance, curr)]);
  rows.push(['Total Credits / Deposits', formatCurrency(summary.totalCredits, curr)]);
  rows.push(['Total Debits / Withdrawals', formatCurrency(summary.totalDebits, curr)]);
  rows.push(['Net Closing Balance', formatCurrency(summary.closingBalance, curr)]);
  rows.push([]);

  // Transaction Ledger Header
  rows.push(['Date', 'Value Date', 'Description', 'Reference / ID', 'Type', 'Amount', 'Running Balance']);

  // Transaction Rows
  transactions.forEach((tx) => {
    rows.push([
      tx.date,
      tx.valueDate || tx.date,
      `"${tx.description.replace(/"/g, '""')}"`,
      `"${tx.reference.replace(/"/g, '""')}"`,
      tx.type.toUpperCase(),
      tx.type === 'credit' ? `+${tx.amount.toFixed(2)}` : `-${tx.amount.toFixed(2)}`,
      tx.runningBalance !== undefined ? tx.runningBalance.toFixed(2) : '',
    ]);
  });

  const csvString = rows.map((row) => row.join(',')).join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const startDateClean = summary.startDate || (transactions.length > 0 ? transactions[0].date : 'start');
  const endDateClean = summary.endDate || (transactions.length > 0 ? transactions[transactions.length - 1].date : 'end');
  const cleanFilename = `Truist_Statement_${account.accountNumber || '100028491823'}_${startDateClean}_to_${endDateClean}.csv`;

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', cleanFilename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 10000);
};
