import type {LoginProps, RegisterProps} from "@/contexts/AuthContext";

export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    profile_completed: boolean;
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
            email,

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

// Category interface
export interface Category {
    id: number;
    categoryName: string;
}

// Receipt categorization response interface
export interface ReceiptAnalysisResponse {
    message: string;
    amount: number;
    category_id: number;
    category_name: string;
    available_categories: Category[];
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

    const text = await response.text();
    console.log('RAW response:', response.status, text);

    if (!response.ok) {
        try {
            const errorData = JSON.parse(text);
            throw new Error(errorData.error || 'Create transaction failed');
        } catch {
            throw new Error(`Create transaction failed (status ${response.status})`);
        }
    }

    try {
        return JSON.parse(text);
    } catch {
        throw new Error('Server vratio neočekivan format odgovora (nije JSON)');
    }

    // Kovacevicev dio
    // if (!response.ok) {
    //     const errorData = await response.json();
    //     throw new Error(errorData.error || 'Create transaction failed');
    // }
    //
    // const data = await response.json();
    // return data;
}

// s ovime se dohvacaju sve kategorije
export const getCategories = async(token: string): Promise<Category[]> => {
    const url = process.env.EXPO_PUBLIC_BASE_URL;

    const response = await fetch(`${url}/api/transaction/categories/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`, // Auth token za pristup
        }
    });

    console.log("Dohvaćam kategorije.");

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Fetching categories failed');
    }

    const data = await response.json();
    return data as Category[];
}


// sa ovime šaljemo podatke o profilu
export const sendProfileInfo = async(token: string, income: number, notifications: boolean, income_date: number, expenses: {category: number, amount: number }[]): Promise<any> => {
    const url = process.env.EXPO_PUBLIC_BASE_URL;

    const response = await fetch(`${url}/api/auth/profile_setup/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({
            income,
            notifications,
            income_date,
            expenses
        }),
    });
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Greška pri slanju podataka: ${error}`);
    }

    return await response.json();

}



export const getExpenses = async(token: string) => {
    const url = process.env.EXPO_PUBLIC_BASE_URL;
    const response = await(fetch(`${url}/api/transaction/get_expenses/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`, // Auth token za pristup
        }
    }));
    console.log("Dohvaćam Troškove.");
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Fetching expenses failed');
    }
    const data = await response.json();
    return data;
}

export const getAllTransactions = async(token: string) => {
    const url = process.env.EXPO_PUBLIC_BASE_URL;


    const response = await(fetch(`${url}/api/transaction/get_transactions/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`, // Auth token za pristup
        }
    }));

    console.log("Dohvaćam Transakcije.");

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Fetching transactions failed');
    }

    const data = await response.json();
    return data;
}


export const getProfile = async(token: string) => {
    const url = process.env.EXPO_PUBLIC_BASE_URL;

    const response = await(fetch(`${url}/api/auth/get_profile_income/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        }
    }));
    const text = await response.text();
    console.log("Dohvaćam Profil income.");

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${text.slice(0, 120)}`);
    }
    const ct = response.headers.get("content-type") || "";
    if (!ct.includes("application/json")) {
        throw new Error(`Očekivan JSON, dobiveno: ${ct}. Body: ${text.slice(0, 120)}`);
    }
    return JSON.parse(text);
}