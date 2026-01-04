
import type { LoginProps, RegisterProps } from "@/contexts/AuthContext";
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

// Chatbot interface
export interface ChatbotRequest {
    message: string;
    conversation_id?: number;
    title?: string;
}

export interface ChatbotResponse {
    conversation_id: number;
    message: string;
}

export interface ChatConversation {
    id: number;
    title: string;
    lastMessage: string;
    lastMessageAt: string;
}

export interface ChatMessage {
    id: number | string;
    message: string;
    created_at: string;
    isUser: boolean;
    text?: string; // Alias za message (za kompatibilnost)
    timestamp?: string | Date; // Alias za created_at (za kompatibilnost)
}



// Funkcija za slanje poruke chatbotu
export const sendChatMessage = async(token: string, request: ChatbotRequest): Promise<ChatbotResponse> => {
    const url = process.env.EXPO_PUBLIC_BASE_URL;

    const response = await fetch(`${url}/api/chatbot/message/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({
            message: request.message,
            conversation_id: request.conversation_id,
            title: request.title,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Chatbot request failed');
    }

    const data = await response.json();
    return data as ChatbotResponse;
}

// Funkcija za ucitavanja svih razgovora
export const fetchConversations = async(token: string): Promise<ChatConversation[]> => {
    const url = process.env.EXPO_PUBLIC_BASE_URL;

    const response = await fetch(`${url}/api/chatbot/conversations/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Chatbot request failed');
    }

    const data = await response.json();
    return data as ChatConversation[];
}



// Funkcija za ucitavanja svih razgovora
export const fetchChatHistory = async(token: string, conversationId: number): Promise<ChatMessage[]> => {
    const url = process.env.EXPO_PUBLIC_BASE_URL;

    const response = await fetch(`${url}/api/chatbot/conversations/${conversationId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Chatbot request failed');
    }

    const data = await response.json();
    return data as ChatMessage[];
}


export interface Group {
    id: number;
    groupName: string;
    groupCode: string;
    budget: number | null;
    income: number | null;
}

// s ovime se stvara nova grupa
export const makeGroup = async(token: string, groupName: string): Promise<Group> => {
    const url = process.env.EXPO_PUBLIC_BASE_URL;

    const response = await fetch(`${url}/api/auth/create_group/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`, // Auth token za pristup
        },
        body: JSON.stringify({
            groupName: groupName
        })
    });

    console.log("Group name: " + groupName);

    console.log("Stvaram grupu.");

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Making group failed');
    }

    const data = await response.json();
    return data as Group;
}

export interface Profile {
    user: string;
    group: string | null;
    role: string;
    isAdmin: boolean;
    budget: number | null;
    income: number | null;
    allowance: number | null;
    notifications: boolean;
    income_date: string | null;
    profile_completed: boolean;
}

// s ovime se pridruzuje grupi
export const joinGroup = async(token: string, groupCode: string): Promise<Profile> => {
    const url = process.env.EXPO_PUBLIC_BASE_URL;

    const response = await fetch(`${url}/api/auth/join_group/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({
            groupCode: groupCode,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Joining group failed');
    }

    const data = await response.json();
    return data as Profile;
}

// Dohvaca informacije o grupi korisnika
export const getGroup = async(token: string): Promise<Group> => {
    const url = process.env.EXPO_PUBLIC_BASE_URL;

    const response = await fetch(`${url}/api/auth/get_group/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Fetching group failed');
    }

    const data = await response.json();
    return data as Group;
}

// Member interface za get_members response
export interface Member {
    userId: number;
    user: string;
    group: string | null;
    role: string;
    isAdmin: boolean;
    budget: number | null;
    income: number | null;
    allowance: number | null;
    notifications: boolean;
    income_date: string | null;
    profile_completed: boolean;
}

// Dohvaca sve clanove grupe
export const getMembers = async(token: string): Promise<Member[]> => {
    const url = process.env.EXPO_PUBLIC_BASE_URL;

    const response = await fetch(`${url}/api/auth/get_members/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Fetching members failed');
    }

    const data = await response.json();
    return data as Member[];
}

// Mijenja budzet grupe (samo GroupLeader)
export const changeGroupBudget = async(token: string, budget: number): Promise<Group> => {
    const url = process.env.EXPO_PUBLIC_BASE_URL;

    const response = await fetch(`${url}/api/auth/change_group_budget/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({ budget }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Changing budget failed');
    }

    const data = await response.json();
    return data as Group;
}

// Mijenja dopusteni limit clana (samo GroupLeader)
export const changeUserAllowance = async(token: string, userId: number, allowance: number): Promise<Profile> => {
    const url = process.env.EXPO_PUBLIC_BASE_URL;

    const response = await fetch(`${url}/api/auth/change_user_allowance/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({ userId, allowance }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Changing allowance failed');
    }

    const data = await response.json();
    return data as Profile;
}

// Napusta grupu
export const leaveGroup = async(token: string): Promise<{ message: string }> => {
    const url = process.env.EXPO_PUBLIC_BASE_URL;

    const response = await fetch(`${url}/api/auth/leave_group/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Leaving group failed');
    }

    const data = await response.json();
    return data;
}

// Interface za spending podatke
export interface MemberSpending {
    userId: number;
    username: string;
    totalSpent: number;
    allowance: number | null;
}

// Interface za transakcije clana
export interface MemberTransaction {
    id: number;
    amount: number;
    date: string;
    category: string;
    transactionNote: string | null;
}

// Dohvaca potrosnju svih clanova grupe (tekuci mjesec)
export const getMemberSpending = async(token: string): Promise<MemberSpending[]> => {
    const url = process.env.EXPO_PUBLIC_BASE_URL;

    const response = await fetch(`${url}/api/auth/get_member_spending/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Fetching member spending failed');
    }

    const data = await response.json();
    return data as MemberSpending[];
}

// Dohvaca transakcije odredenog clana (tekuci mjesec) - samo GroupLeader ili admin
export const getMemberTransactions = async(token: string, userId: number): Promise<MemberTransaction[]> => {
    const url = process.env.EXPO_PUBLIC_BASE_URL;

    const response = await fetch(`${url}/api/auth/get_member_transactions/${userId}/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Fetching member transactions failed');
    }

    const data = await response.json();
    return data as MemberTransaction[];
}