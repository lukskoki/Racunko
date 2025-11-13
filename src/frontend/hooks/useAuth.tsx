import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

export function useAuth() {
    const context = useContext(AuthContext); // S ovim uhvatimo sve sto se nalazilo u AuthContext.Provider value = ...

    if (!context) {
        throw new Error("useUser mora bit koristen unutar AuthProvider");
    }

    return context;
}