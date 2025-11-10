export const TRANSACTION_PATH = "/api/transaction/manual_create_transaction/";

export interface TransactionInput {
    amount: string | number;
    category: number | string;
    date: string;
}

export interface Transaction {
    id: number;
    amount: string;            // DRF najčešće vraća decimalu kao string
    category: number | string; // uskladi s backend serializerom
    date: string;              // ISO datum
}

export function buildTransactionPayload(input: TransactionInput) {
    const amount =
        typeof input.amount === "number" ? input.amount.toFixed(2) : input.amount;

    return {
        amount,
        category: input.category,
        date: input.date,
    };
}
