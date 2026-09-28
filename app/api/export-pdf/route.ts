import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { account, summary, transactions } = body;

    if (!account || !summary || !transactions) {
      return NextResponse.json(
        { error: 'Missing required statement data parameters.' },
        { status: 400 }
      );
    }

    // Process statement metadata
    const responsePayload = {
      status: 'success',
      message: 'Statement processed successfully for PDF compilation.',
      statementRef: `TRST-${account.accountNumber?.slice(-4) || '0000'}-${Date.now()}`,
      metadata: {
        accountHolder: account.accountHolderName,
        accountNumber: account.accountNumber,
        currency: account.currency || 'USD',
        transactionCount: transactions.length,
        closingBalance: summary.closingBalance,
        generatedAt: new Date().toISOString(),
      },
    };

    return NextResponse.json(responsePayload, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Failed to process statement payload', details: err.message },
      { status: 500 }
    );
  }
}
