# UPUTE — Dodavanje novog API poziva s `apiFetch`

Ovaj vodič opisuje **standardni** način kako dodati novi API poziv koristeći naš zajednički helper `apiFetch`.

**Arhitektura (tanko-UI pristup):**  
`services/` → **tipovi i putanje**  
`hooks/` → **pozivi na `apiFetch`**  
`ui (.tsx)` → **komponente koje koriste hookove**

---

## 1) Servis (📄 `services/<domena>.ts`)

U **services** dodaj tipove i (po želji) izvezi **konstantu putanje**. **Nema JSX-a**.

**Primjer — `services/categories.ts`:**
```ts
export const CATEGORIES_PATH = "/api/transaction/categories/";

// Tip koji vraća backend (uskladi sa serializerom)
export interface Category {
  id: number;
  categoryName: string;
}
```

> Ako endpoint prima podatke (POST/PUT), ovdje definiraj i `Input` tip (npr. `CategoryInput`).

---

## 2) Hook (📄 `hooks/use<Domain>.ts`)

Hook koristi `useApi()` i izlaže **čiste funkcije** koje UI zove.

**Primjer — `hooks/useCategories.ts`:**
```ts
import type { Category } from "@/services/categories";
import { CATEGORIES_PATH } from "@/services/categories";
import { useApi } from "@/services/api";

export function useCategories() {
  const { apiFetch } = useApi();

  async function listCategories(): Promise<Category[]> {
    return await apiFetch<Category[]>(CATEGORIES_PATH, { method: "GET" });
  }

  return { listCategories };
}
```

> Za **POST/PUT/DELETE**: promijeni `method` i proslijedi `json`:
> ```ts
> await apiFetch<ReturnType>("/api/route/", { method: "POST", json: payload });
> ```

---

## 3) Korištenje u UI komponenti (📄 `.tsx`)

UI **ne** implementira HTTP; koristi hook iz koraka 2.

**Primjer — `CategoryListScreen.tsx`:**
```tsx
import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useCategories } from "@/hooks/useCategories";
import type { Category } from "@/services/categories";

export default function CategoryListScreen() {
  const { listCategories } = useCategories();
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await listCategories();
        setData(res);
      } catch (e: any) {
        setError(e.message || "Greška pri dohvaćanju kategorija");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <ActivityIndicator style={{ margin: 16 }} />;
  if (error) return <Text style={{ color: "red", margin: 16 }}>{error}</Text>;

  return (
    <View style={{ padding: 12 }}>
      {data.map((c) => (
        <Text key={c.id}>{c.categoryName}</Text>
      ))}
    </View>
  );
}
```

