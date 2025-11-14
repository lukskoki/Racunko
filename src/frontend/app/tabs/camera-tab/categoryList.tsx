import React, { useEffect, useState } from "react";
import {Text, FlatList, Pressable, ActivityIndicator, View} from "react-native";
import { useCategories } from "@/hooks/useCategories";
import type { Category } from "@/services/api";
import { useLocalSearchParams, useRouter} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";
import styles from "@/app/styles/expenseSetup";

export default function CategoryList({
                                         onSelect,
                                     }: { onSelect?: (id: number) => void }) {
    const router = useRouter();
    const { listCategories } = useCategories();
    const [data, setData] = useState<Category[]>();
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
        onSelect?.(cat.id);
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
        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
            <FlatList
                data={data}
                keyExtractor={(c) => String(c.id)}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() => handlePick(item)}
                        style={styles.modalBoxComponent}
                    >
                        {/*Slike cemo kasnije dodat kada ih primamo s backenda*/}

                        {/*<View style={styles.componentPictureBox}>*/}
                        {/*    <Image source={images.hrana} style={styles.componentPicture}/>*/}
                        {/*</View>*/}
                        <View style={styles.componentBox}>
                            <Text style={styles.componentName}> {item.categoryName} </Text>
                        </View>
                    </Pressable>
                )}
                ListEmptyComponent={<Text style={{ padding: 16 }}>Nema kategorija.</Text>}
            />
        </SafeAreaView>
    );
}
