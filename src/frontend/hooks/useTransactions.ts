import { Transaction, TransactionInput, buildTransactionPayload, TRANSACTION_PATH} from "@/services/transactions";
import {useApi} from "@/services/api";

export function useTransactions() {
    const { apiFetch } = useApi();

    async function createTransaction(input: TransactionInput): Promise<Transaction> {
        const payload = buildTransactionPayload(input);

        return await apiFetch<Transaction>(TRANSACTION_PATH, { method: "POST", json: payload });
    }

    return { createTransaction };
}
