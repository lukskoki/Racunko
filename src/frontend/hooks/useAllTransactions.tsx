import {useState} from "react";
import {getAllTransactions} from "@/services/api";
import {useAuth} from "@/hooks/useAuth";

export interface Transaction {
    id: number;
    profile: string;
    amount: string;
    date: string;
    category:string;
    group:string;
    image: string; // dolazi kao string iz Django DecimalField-a
    transactionNote: string;
    store: string;
}
export const useAllTransactions = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const {token} = useAuth();

    const listAllTransactions = async (): Promise<Transaction[]> => {
        if (!token) {
            throw new Error('Morate biti prijavljeni');
        }

        setIsLoaded(true);
        setError(null);

        try {
            const result = await getAllTransactions(token);
            console.log('Transactions fetched successfully:', result);
            setIsLoaded(false);
            return result;
        } catch (err: any) {
            const errorMessage = err.message || 'Greska pri dohvaćanju transactiona!';
            setError(errorMessage);
            setIsLoaded(false);
            throw new Error(errorMessage);
        }
    };

    return {listAllTransactions, isLoaded};
}