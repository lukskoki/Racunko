import type { Category } from "@/services/categories";
import {CATEGORY_PATH} from "@/services/categories";
import {useApi} from "@/services/api";

export function useCategories() {
    const { apiFetch } = useApi();

    async function listCategories(): Promise<Category[]> {
        return await apiFetch<Category[]>(CATEGORY_PATH, { method: "GET" });
    }

    return { listCategories };
}
