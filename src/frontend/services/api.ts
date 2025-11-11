
import type { LoginProps, RegisterProps } from "@/contexts/AuthContext";
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

// Receipt categorization response interface
export interface ReceiptAnalysisResponse {
    message: string;
    amount: number;
    category_id: number;
    category_name: string;
}

// Funkcija za slanje base64 slike racuna na AI endpoint
export const categorizeReceipt = async(base64Image: string, token: string): Promise<ReceiptAnalysisResponse> => {
    const url = process.env.EXPO_PUBLIC_BASE_URL;

    const response = await fetch(`${url}/api/transaction/categorize_receipt/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`, // Auth token za pristup
        },
        body: JSON.stringify({
            image: base64Image
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Receipt analysis failed');
    }

    const data = await response.json();
    return data as ReceiptAnalysisResponse;
}



export const sendTransaction = async(amount: number, category:number, date:string , token: string): Promise<any> => {
    const url = process.env.EXPO_PUBLIC_BASE_URL;

    const response = await fetch(`${url}/api/transaction/manual_create_transaction/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`, // Auth token za pristup
        },
        body: JSON.stringify({
            amount,
            category,
            date
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Create transaction failed');
    }

    const data = await response.json();
    return data;
}