import {useState} from "react";
import {getExpenses} from "@/services/api";
import {useAuth} from "@/hooks/useAuth";

export interface Expense {
    id: number;
    profile: string;
    category: string;
    expenseName: string;
    expenseNote:string;
    expenseLength:string;
    amount: string; // dolazi kao string iz Django DecimalField-a
}
export const useExpenses = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const {token} = useAuth();

    const listExpenses = async (): Promise<Expense[]> => {
        if (!token) {
            throw new Error('Morate biti prijavljeni');
        }

        setIsLoading(true);
        setError(null);

        try {
            const result = await getExpenses(token);
            console.log('Expenses fetched successfully:', result);
            setIsLoading(false);
            return result;
        } catch (err: any) {
            const errorMessage = err.message || 'Greska pri dohvaćanju expensa!';
            setError(errorMessage);
            setIsLoading(false);
            throw new Error(errorMessage);
        }
    };

    return {listExpenses, isLoading};
}