import { useState } from 'react';
import { getAnalytics, type AnalyticsResponse } from '@/services/api';
import { useAuth } from './useAuth';

export const useAnalytics = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth();

    const fetchAnalytics = async (month?: string): Promise<AnalyticsResponse | null> => {
        if (!token) {
            throw new Error('Morate biti prijavljeni');
        }

        setIsLoading(true);
        setError(null);

        try {
            const result = await getAnalytics(token, month);
            console.log('Analytics fetched successfully:', result);
            setIsLoading(false);
            return result;
        } catch (err: any) {
            const errorMessage = err.message || 'Greška pri dohvaćanju analytics podataka!';
            setError(errorMessage);
            setIsLoading(false);
            throw new Error(errorMessage);
        }
    };

    return {
        fetchAnalytics,
        isLoading,
        error,
    };
};
