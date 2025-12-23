import React, { createContext, useState, ReactNode, useEffect, useContext } from "react";
import { login as apilogin, register as apiregister} from '@/services/api';
import type { User } from '@/services/api';
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
import {
  AuthRequestConfig,
  DiscoveryDocument,
  makeRedirectUri,
  useAuthRequest,
} from "expo-auth-session";

export interface LoginProps { // Format koji login funkcija prima
    username: string;
    password: string;
}

export interface RegisterProps { // Format koji register funkcija prima
    username: string;
    password: string;
    email: string;
    first_name?: string;
    last_name?: string;
}

interface AuthContextType { // Format konteksta kojeg cemo koristit u drugim fajlovima
    user: User | undefined;
    token: string | null;
    login: (props: LoginProps) => Promise<User>;
    register: (props: RegisterProps) => Promise<User>;
    loginGoogle: () => Promise<User>;
    logout: () => void;
}

const config: AuthRequestConfig = {
  clientId: "google",
  scopes: ["openid", "profile", "email"], // Podaci koje trazimo od google-a
  redirectUri: makeRedirectUri(), // Kreira URL automatki, npr. ako je development onda exp://, u produkciji ce bit racunko://
};

const discovery: DiscoveryDocument = {
  authorizationEndpoint: `${BASE_URL}/api/auth/authorize`, // Odredimo gdje se salje usera da se napravi authorization
};

// Sa createcontext stavaramo state koje mogu koristit sve komponente, kao neki globalni state
export const AuthContext = createContext<AuthContextType | undefined>(undefined);



export function AuthProvider({ children } : { children: ReactNode }) {
    const [user, setUser] = useState<User | undefined>(undefined);
    const [token, setToken] = useState<string | null>(null); // Ovo je za zapamtit token koj cemo kasnije koristi

    // PromptAsync otvara browser u aplikaciji i ide na url koji smo zadali u DiscoveryDocument
    // useAuthRequst handle-a oauth flow, response i request su states koji se mjenjaju kroz proces
    const [request, response, promptAsync] = useAuthRequest(config, discovery);

    // State za tracking Google auth statusa
    const [googleAuthError, setGoogleAuthError] = useState<string | null>(null);

    // Uhvati response kad se vrati iz Google OAuth-a
    useEffect(() => {

        if (response?.type === 'success') {
            const { code } = response.params;

            if (code) {
                // Posalji code na backend za DRF token
                handleGoogleCode(code);
            }
        } else if (response?.type === 'error') {
            console.error('Google OAuth error:', response.error);
            setGoogleAuthError(response.error?.message || 'Google OAuth greška');
        } else if (response?.type === 'dismiss' || response?.type === 'cancel') {
            console.log('User cancelled Google sign in');
            setGoogleAuthError('Prijava otkazana');
        }
    }, [response]); // Kad se response promjeni, onda prolazimo kroz funkciju

    async function handleGoogleCode(code: string) {
        try {
            // Posalji code na backend /api/auth/google/
            const res = await fetch(`${BASE_URL}/api/auth/google/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || 'Google login failed');
            }

            const data = await res.json();

            // Spremi token i user info, isto kao i obican login
            setToken(data.token);
            setUser(data.user);

            console.log("token: ", data.token);

            console.log('Google login successful!');
            return data.user; // Vrati user objekt
        } catch (error: any) {
            console.error('Google code exchange failed:', error);
            throw error;
        }
    }

    async function login({username, password}: LoginProps): Promise<User> {

        try {
            const response = await apilogin({username, password}); // Ovo je funkcija iz api.ts

            setToken(response.token);
            setUser(response.user);

            console.log("Login uspio");
            return response.user; // Vrati user objekt
        }
        catch(error: any) {
            console.error("Login failed: ", error);
            throw new Error(error.message || 'Neuspjesna prijava');
        }

    }   


    async function register({username, password, email}: RegisterProps): Promise<User> {

        try {
            const response = await apiregister({username, password, email}); // Ovo je funkcija iz api.ts

            setToken(response.token);
            setUser(response.user);

            console.log("Register uspio");
            return response.user; // Vrati user objekt
        }
        catch(error: any) {
            console.error("Register failed: ", error);
            throw new Error(error.message || 'Neuspjesna registracija');
        }

    } 
    
    async function loginGoogle(): Promise<User> {

        try{
            if (!request) {
                throw new Error("OAuth request nije spreman");
            }

            // Resetiraj prethodni error
            setGoogleAuthError(null);

            // Otvara browser i ide na zadani URL
            const result = await promptAsync();

            // Ako je user otkazao ili doslo je do errora, bacamo error
            if (result.type === 'cancel' || result.type === 'dismiss') {
                throw new Error('Prijava otkazana');
            }

            if (result.type === 'error') {
                throw new Error(result.error?.message || 'Google OAuth greška');
            }

            // Ako je success, dohvati code i posalji na backend
            if (result.type === 'success') {
                const { code } = result.params;
                if (code) {
                    const loggedInUser = await handleGoogleCode(code);
                    return loggedInUser;
                }
            }

            throw new Error('Google login nije vratio code');

        } catch(e: any) {
            console.log('Google login error:', e);
            throw e; // Propagiraj error dalje
        }
    }

    function logout() {
        // Clear-aj user i token state
        setUser(undefined);
        setToken(null);
        setGoogleAuthError(null);

        console.log("User logged out");
    }

    return (
        // S ovim omotamo ostale sve ostale komponente npr. index.tsx, sve omotane onda mogu koristit AuthContext i pristupit tokenu, useru itd.
        // children oznacava sve sto je unutar AuthProvider
        <AuthContext.Provider value={{login, register, loginGoogle, logout, token, user}}>
            {children}
        </AuthContext.Provider>
    )
}

// Hook za korištenje AuthContext-a
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth mora biti korišten unutar AuthProvider-a');
    }
    return context;
}