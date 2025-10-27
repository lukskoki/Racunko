
import type { LoginProps, RegisterProps } from "@/contexts/AuthContext";
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