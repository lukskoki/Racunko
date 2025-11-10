import type { LoginProps, RegisterProps } from "@/contexts/AuthContext";
import {useAuth} from "@/hooks/useAuth";
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
const GOOGLE_CLIENT_ID = "637622547581-11fsitp0jun44vlvrfm95li16gj9f2cn.apps.googleusercontent.com";

export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
}
interface LoginResponse {
    token: string;
    user: User;
}
export const login = async({username, password}: LoginProps ): Promise<LoginResponse> => {
    console.log("Poziva se api");
    const url = process.env.EXPO_PUBLIC_BASE_URL; // U .env bi trebalo spremit EXPO_PUBLIC_BASE_URL=..., ak se na mobitelu testira onda treba django server runnat na ip od networka
    console.log("url: ", url);
    const response = await fetch(`${url}/api/auth/login/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // S ovim backend zna da saljemo JSON
        },
        body: JSON.stringify({
            username,
            password
        })
    });

    if (!response.ok) {
        console.error('Login failed');
        throw new Error("Login failed");
        
    }

    const data = await response.json();

    console.log(data);

    return data as LoginResponse;
}

export const register = async({username, password, email}: RegisterProps ): Promise<LoginResponse> => {
    console.log("Poziva se api");
    const url = process.env.EXPO_PUBLIC_BASE_URL; // U .env bi trebalo spremit EXPO_PUBLIC_BASE_URL=..., ak se na mobitelu testira onda treba django server runnat na ip od networka
    console.log("url: ", url);
    const response = await fetch(`${url}/api/auth/register/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // S ovim backend zna da saljemo JSON
        },
        body: JSON.stringify({
            username,
            password,
            email
        })
    });

    if (!response.ok) {
        console.error('Register failed');
        throw new Error("Register failed");
        
    }

    const data = await response.json();

    console.log(data);

    return data as LoginResponse;
}


export async function GET(request: Request) {
    if (!GOOGLE_CLIENT_ID) {
        return Response.json(
            {error: "GOOGLE_CLIENT_ID is not set"},
            { status : 500}
        );
    }

    const url = new URL(request.url);

    let idpClientId: string;
    const internalClient = url.searchParams.get("client_id")
    const redirectUri = url.searchParams.get("redirect_uri");

    let platform;

    if (redirectUri === "racunko://") {
        platform = "mobile";
    }
    else if (redirectUri === BASE_URL) {
        platform="web";
    }
    else {
        return Response.json({ error: "Invalid redirect URI"}, {status:400});
    }


    let state = platform + '|' + url.searchParams.get("state");

    if (internalClient === "google") {
        idpClientId= GOOGLE_CLIENT_ID;
    } else {
        return Response.json({error: "Invalid Client"}, {status:400});
    }


    const params = new URLSearchParams({
        client_id: idpClientId,
        redirect_uri: `${BASE_URL}/accounts/google/login/callback/`,
        response_type: "code",
        scope: url.searchParams.get("scope")  || "identity",
        state: state,
        prompt: "select_account"

    })

    const googleUrl = "https://accounts.google.com/o/oauth2/v2/auth"

    return Response.redirect(googleUrl + "?" + params.toString());
}

// radi jednostavnosti sam napravio neki generalni api request da ne treba za svaki poziv radit sve novo
// procitaj UPUTE.md da vidis kako radit novi poziv

type JsonInit = RequestInit & { json?: any };

export function useApi() {
    const {token} = useAuth();    // Token iz AuthContexta – ako postoji, šaljemo ga u Authorization headeru.
    const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;     // Baza URL-a servera; dolazi iz .env (npr. http://10.0.0.5:8000)
    if (!baseUrl) {
        console.warn("EXPO_PUBLIC_BASE_URL nije postavljen u .env");
    }

    /**
     * Generic fetch helper:
     *  - `path`: relativna ruta (npr. "/api/transaction/manual_create_transaction/")
     *            -> spaja se s baseUrl u puni URL
     *  - `init`: opcije poziva (metoda, headeri, tijelo...). Standardni RequestInit plus naš `json`.
     *  - <T>:   tip povratne vrijednosti (TypeScript generik) – očekivani oblik response JSON-a.
     */
    async function apiFetch<T>(path: string, init: JsonInit = {}): Promise<T> {
        console.log("Poziva se api");
        const url = `${baseUrl}${path}`;        // Sastavi puni URL: base + path
        console.log("url: ", url);
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            ...(init.headers as Record<string, string>),
        };
        if (token) headers["Authorization"] = `Token ${token}`;
        const res = await fetch(url, {
            ...init,
            headers,
            body: init.json ? JSON.stringify(init.json) : init.body,
        });
        if (!res.ok) {
            let detail = `${res.status} ${res.statusText}`;
            try {
                const err = await res.json();
                detail = err?.detail || JSON.stringify(err);
            } catch {/* ignore */}
            throw new Error(detail);
        }
        if (res.status === 204) return undefined as T;
        return (await res.json()) as T;
    }
    return {apiFetch};
}