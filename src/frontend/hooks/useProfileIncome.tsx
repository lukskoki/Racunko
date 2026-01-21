import {useAuth} from "@/hooks/useAuth";
import {useState} from "react";
import {getProfile} from "@/services/api";

export const useProfileIncome = () => {
    const [isLoading,setIsLoading] = useState(false);
    const [error,setError] = useState(null);
    const {token} = useAuth();

    const getProfileIncome = async () => {
        if(!token){
            throw new Error("Morate biti prijavljeni");
        }

        setIsLoading(true);
        setError(null);

        try{
            const result = await getProfile(token);
            console.log("Profile fetched successfully:", result);
            setIsLoading(false);
            return result;
        }catch(err: any){
            const errorMessage = err.message || 'Greška pri dohvaćanju profila!!';
            setError(errorMessage);
            setIsLoading(false);
            throw new Error(errorMessage);
        }
    };

    return {getProfileIncome};
}