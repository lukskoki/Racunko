import React, { useState } from "react";
import styles from "@/app/styles/expenseSetup";
import {Animated, FlatList, Modal, Pressable, Text, TextInput, View} from "react-native";
import {Image} from "expo-image";
import {images} from "@/app/assets";
import {SafeAreaView} from "react-native-safe-area-context";
import CategoryTile from "./categoryTile";
import ScrollView = Animated.ScrollView;
const Categories = [
    { id: "1", title: "Hrana", image: images.hrana },
    { id: "2", title: "Režije", image: images.rezije },
    { id: "3", title: "Prijevoz", image: images.prijevoz },
    { id: "4", title: "Roba", image: images.roba },
    { id: "5", title: "Zabava", image: images.zabava },
    { id: "6", title: "Restorani", image: images.restorani },
    { id: "7", title: "Zdravlje", image: images.zdravlje },
    { id: "8", title: "Obrazovanje", image: images.obrazovanje },
    { id: "9", title: "Pokloni", image: images.poklon },
    { id: "10", title: "Telekomunikacije", image: images.telekomunikacije },
    { id: "11", title: "Ljubimci", image: images.ljubimci },
    { id: "12", title: "Putovanja", image: images.putovanja },
    { id: "13", title: "Kućanstvo", image: images.kucanstvo },

];

const ExpenseSetup = () => {
        const [modalVisible, setModalVisible] = useState(false);
        const [isPressed, setIsPressed] = useState(false);
        const [isSelected, setSelected] = useState<string[]>([]);
        const [amount, setAmount] = useState<Record<string,string>>({});



        const toggle= (id: string) => {
            setSelected(prev =>
                prev.includes(id) ? prev.filter(item => item !== id)
                    : [...prev, id]
            );
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
                        const category = Categories.find(c => c.id === id);
                        if(!category) return null;


                        return (

                            <View style={styles.categoryBoxContainer} key={id}>
                                <View style={styles.categoryBox}>
                                    <Image source={category.image} style={styles.categoryImage}/>
                                    <Text style={styles.categoryName}> {category.title} </Text>

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
                                {Categories.map((item) => {


                                    return (
                                        <CategoryTile
                                        key={item.id}
                                        id={item.id}
                                        title={item.title}
                                        image={item.image}
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