import React, { createContext, useState, ReactNode } from "react";

interface LoginProps { // Format koji login funkcija prima
    username: string;
    password: string;
}

interface RegisterProps { // Format koji register funkcija prima
    username: string;
    password: string;
    email: string;
    first_name: string;
    last_name: string;
}

interface AuthContextType { // Format konteksta kojeg cemo koristit u drugim fajlovima
    user: RegisterProps | undefined; // Za sad moze bit isto kao i registerProps, mozda cemo kasnije nadodat jos nesto pa ce imat svoj interface
    token: string | null;
    login: (props: LoginProps) => Promise<void>;
    register: (props: RegisterProps) => Promise<void>;
}

// Sa createcontext stavaramo state koje mogu koristit sve komponente, kao neki globalni state
export const AuthContext = createContext<AuthContextType | undefined>(undefined);



export function AuthProvider({ children } : { children: ReactNode }) {
    const [user, setUser] = useState<RegisterProps | undefined>(undefined);
    const [token, setToken] = useState<string | null>(null); // Ovo je za zapamtit token koj cemo kasnije koristi

    async function login({username, password}: LoginProps) {
        console.log({
            username, password
        });
    }


    async function register({username, password, first_name, last_name, email}: RegisterProps) {
        console.log({username, password, first_name, last_name, email});
    }

    return (
        // S ovim omotamo ostale sve ostale komponente npr. index.tsx, sve omotane onda mogu koristit AuthContext i pristupit tokenu, useru itd.
        // children oznacava sve sto je unutar AuthProvider
        <AuthContext.Provider value={{login, register, token, user}}>
            {children} 
        </AuthContext.Provider>
    )
}