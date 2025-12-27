import React, {useEffect, useState} from "react";
import styles from "@/app/styles/expenseSetup";
import {Alert, Animated, Modal, Pressable, Text, TextInput, View} from "react-native";
import {Image} from "expo-image";
import {images} from "@/app/assets";
import {SafeAreaView} from "react-native-safe-area-context";
import CategoryTile from "./categoryTile";
import ScrollView = Animated.ScrollView;
import { useCategories } from "@/hooks/useCategories";
import {Category} from "@/services/api";
import { useProfileSetup } from "@/hooks/useProfileSetup";
import {useProfileContext} from "@/contexts/ProfileSetupContext";
import {router} from "expo-router";
import type { ExpenseInput } from "@/contexts/ProfileSetupContext";

const ExpenseSetup = () => {
        const [modalVisible, setModalVisible] = useState(false);
        const [isPressed, setIsPressed] = useState(false);
        const [isSelected, setSelected] = useState<number[]>([]);
        const [amount, setAmount] = useState<Record<string,string>>({});
        const {listCategories} = useCategories();
        const [categories, setCategories] = useState<Category[]>([]);


        const {income, notifications, income_date, setExpenses, reset} = useProfileContext(); // Uzimamo podatke iz konteksta sa prvog ekrana

        const {submitProfile, isSubmitting, error} = useProfileSetup(); //Iz hooka uzimamo funkciju za submit podataka


    useEffect(() => {
        (async () => {
            try {
                const result: Category[] = await listCategories();
                setCategories(result);
            } catch (e) {
                console.error(e);
            }
        })();
    }, []);


        const toggle= (id: number) => {
            setSelected(prev =>
                prev.includes(id) ? prev.filter(item => item !== id)
                    : [...prev, id]
            );
        };
        const expenses: ExpenseInput[] = isSelected.map(id =>({
            category: id,
            amount: Number(amount[String(id)]),
        }))

        const handleSubmit = async (): Promise<void> => {
            router.push("/tabs/home-tab");
            try{
                setExpenses(expenses);
                await submitProfile({
                    income: Number(income),
                    income_date: Number(income_date),
                    notifications: notifications,
                    expenses,
                });
                router.push("/tabs/home-tab");
            }catch (e: any) {
                Alert.alert("Greška", e?.message || "Slanje nije uspjelo.");
            }
        };
        return (
            <View style={styles.display}>

                <View style={styles.container}>
                    <Text style={styles.mainHeader}> Računko </Text>
                </View>

                <View style={styles.mainContent}>
                    <View style={styles.progressBarContainer}>
                        <View style={styles.profileProgressContainer}>
                            <Image source={images.profileIconWhite} style={styles.profileIcon} />
                        </View>
                        <View style={styles.linkProgressContainer}>

                        </View>
                        <View style={styles.expensesProgressContainer}>
                            <Text style={styles.euro}> € </Text>
                        </View>
                    </View>

                    <View style={styles.profileTextContainer}>
                        <View style={styles.mainProfileText}>
                            <Text style={styles.profileText}> FIKSNI TROŠKOVI </Text>
                            {!isPressed && (
                                <Pressable style={styles.plusButton} onPress={() => setIsPressed(!isPressed)}>
                                    <Image source={images.bluePlus} style={styles.plus}/>
                                </Pressable>
                            )}

                            {isPressed && (
                                <Pressable style={styles.plusButton1} onPress={() => setIsPressed(!isPressed)}>
                                    <Image source={images.bluePlus} style={styles.plus}/>
                                </Pressable>
                            )}
                        </View>

                        <View style={styles.secondaryProfileText}>
                            <Text style={styles.detailText}> • Unesi svoje mjesečne fiksne troškove, poput kredita, stanarine ili troškova za auto, Računko
                                će ih automatski uračunati u tvoj mjesečni budžet
                            </Text>
                        </View>
                    </View>



                    <ScrollView style={{flex:1}} nestedScrollEnabled contentContainerStyle={{gap:10}}>
                    {isSelected.map(id =>{
                        const category = categories.find(c => c.id === id);
                        if(!category) return null;


                        return (

                            <View style={styles.categoryBoxContainer} key={id}>
                                <View style={styles.categoryBox}>
                                    {/*
                                    <Image source={category.image} style={styles.categoryImage}/>
                                    */}
                                    <Text style={styles.categoryName}> {category.categoryName} </Text>

                                    <View style={styles.rightSideInputBox}>
                                        <TextInput
                                            style={styles.input}
                                            value={amount[category.id]?.toString() || ""}
                                            onChangeText={(value) => setAmount({...amount, [category.id]: value})}
                                            keyboardType="numeric"
                                            placeholder="0"
                                            placeholderTextColor="black"
                                            returnKeyType={"done"}/>
                                        <Text style={styles.euro2}> € </Text>
                                    </View>
                                </View>


                                <Pressable style={styles.minusContainer} onPress={() => {
                                    setSelected(prev => prev.filter(x => x !== id));
                                    setAmount(prev => {
                                        const { [id]: _, ...rest } = prev;
                                        return rest;
                                    });
                                }}>
                                        <Image source={images.minus} style={styles.minus}/>
                                </Pressable>
                            </View>

                        );
                    })}
                        </ScrollView>



                    <Pressable style={styles.submit} onPress={handleSubmit}>
                        <Text style={styles.submitText}>Submit</Text>
                    </Pressable>
                </View>

                <Modal
                    visible={isPressed}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => {
                        setModalVisible(false)
                        setIsPressed(!isPressed);
                        }
                    }
                >
                    <View style={styles.modalScreen}>
                        <SafeAreaView style={styles.modalBox}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalHeaderText}> KATEGORIJE </Text>
                                <Pressable style={styles.closeButtonBox} onPress={() => setIsPressed(!isPressed)}>
                                    <Text style={styles.closeButton}> X </Text>
                                </Pressable>
                            </View>

                            <ScrollView
                                style={{ flex: 1 }}
                                nestedScrollEnabled
                            >
                                {categories.map((item) => {


                                    return (
                                        <CategoryTile
                                        key={item.id}
                                        id={item.id}
                                        title={item.categoryName}
                                        //{/* image={item.image} */}
                                        onToggle={toggle}
                                        checked={isSelected.includes(item.id)}
                                    />
                                    );
                                })}
                            </ScrollView>
                        </SafeAreaView>
                    </View>


                </Modal>

            </View>
        )
}


export default ExpenseSetup;