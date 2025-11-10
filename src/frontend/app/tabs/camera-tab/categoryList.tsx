import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, ActivityIndicator } from "react-native";
import { useCategories } from "@/hooks/useCategories";
import type { Category } from "@/services/categories";
import {useLocalSearchParams, useRouter} from "expo-router";

export default function CategoryList({
                                         onSelect,
                                     }: { onSelect?: (id: number) => void }) {
    const router = useRouter();
    const { listCategories } = useCategories();
    const [data, setData] = useState<Category[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const params = useLocalSearchParams<{ amount?: string; date?: string }>();


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

    function handlePick(cat: Category) {
        setSelectedId(cat.id);
        // Ako ti je proslijeđen callback, zovi ga
        onSelect?.(cat.id);

        // ⇩⇩ VAŽNO: vrati se na prvi ekran uz parametre
        // Promijeni pathname u točan put do tvog prvog ekrana!
        router.replace({
            pathname: "/tabs/camera-tab/manual-input",
            params: {
                categoryId: Number(cat.id),
                categoryName: cat.categoryName,
                amount: params.amount ?? "",
                date: params.date ?? "",
            },
        });
    }

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={data}
                keyExtractor={(c) => String(c.id)}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() => handlePick(item)}
                        style={{
                            paddingVertical: 12,
                            paddingHorizontal: 16,
                            borderBottomWidth: 1,
                            borderColor: "#eee",
                            backgroundColor: item.id === selectedId ? "#f2f2f2" : "white",
                        }}
                    >
                        <Text style={{ fontWeight: item.id === selectedId ? "700" : "400" }}>
                            {item.categoryName}
                        </Text>
                    </Pressable>
                )}
                ListEmptyComponent={<Text style={{ padding: 16 }}>Nema kategorija.</Text>}
            />
        </View>
    );
}
