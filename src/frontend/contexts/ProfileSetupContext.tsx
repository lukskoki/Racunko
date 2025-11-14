import React, { createContext, useContext, useMemo, useState, ReactNode } from "react";

export type ExpenseInput = { id: number; amount: number };

type ProfileSetupState = {
    income: number | null;
    notifications: boolean;
    income_date: number | null;
    expenses: ExpenseInput[];
    setBasics: (args: {
        income: number | null;
        notifications: boolean;
        income_date: number;
    }) => void;
    setExpenses: (expenses: ExpenseInput[]) => void;
    reset: () => void;
};
const ProfileSetupContext = createContext<ProfileSetupState | null>(null);

export function ProfileSetupProvider({ children }: { children: ReactNode }) {
    const [income, setIncome] = useState<number | null>(null);
    const [notifications, setNotifications] = useState<boolean>(false);
    const [income_date, setIncomeDate] = useState<number | null>(null);
    const [expenses, setExpensesState] = useState<ExpenseInput[]>([]);

    const setBasics = ({income, notifications, income_date}:{ income: number | null, notifications: boolean, income_date: number}) =>{
        setIncome(income);
        setNotifications(notifications);
        setIncomeDate(income_date);
    };

    const setExpenses = (expenses: ExpenseInput[]) => {
        setExpensesState(expenses);
    };

    const reset = () => {
        setIncome(null);
        setNotifications(false);
        setIncomeDate(null);
        setExpensesState([]);
    };

    const value = useMemo(() => ({
        income, notifications, income_date, expenses, setBasics, setExpenses, reset}),
        [income, notifications, income_date,expenses]
        );

    return (
        <ProfileSetupContext.Provider value={value}>{children}</ProfileSetupContext.Provider>
    );
}

export function useProfileContext(): ProfileSetupState {
    const ctx = useContext(ProfileSetupContext);
    if (!ctx) throw new Error("useProfileContext must be used within <ProfileSetupProvider>");
    return ctx;
}