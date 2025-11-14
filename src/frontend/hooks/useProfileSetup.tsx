import { useState, useCallback } from "react";
import {useAuth} from "@/hooks/useAuth";
import { sendProfileInfo } from "@/services/api";
import {ExpenseInput} from "@/contexts/ProfileSetupContext";

type ProfileSetup = {
    income: number;
    notifications: boolean;
    income_date: number;
    expenses: ExpenseInput[];
};

export function useProfileSetup(){
    const {token} = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const submitProfile = async ({income, income_date, notifications, expenses}: ProfileSetup) => {
        if (!token) throw new Error("Morate biti prijavljeni");
        setIsSubmitting(true);
        setError(null);
        try {
            const resp = await sendProfileInfo(token, income, notifications, income_date, expenses);
        } catch (e: any) {
            const msg = e?.message || "Greška pri slanju profila";
            setError(msg);
            throw new Error(msg);
        };
    }
    return {submitProfile, isSubmitting, error};
}
