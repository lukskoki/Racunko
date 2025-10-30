import {images} from "@/app/assets";
import styles from "@/app/styles/profileSetup";
import React, { useState} from "react";
import {Pressable, Switch, Text, TextInput, View} from "react-native";
import {Image} from "expo-image";
import { Picker } from "@react-native-picker/picker";
import {router} from "expo-router";


const  ProfileSetup = () => {
    const [amount, setAmount] = useState("");
    const data =  Array.from({ length: 28 }, (_, i) => i + 1);
    const [isEnabled, setIsEnabled] = useState(false);
    const [selectedNumber, setSelectedNumber] = useState(1);
    const [showPicker, setShowPicker] = useState(false);


    return(
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
                           <Text style={styles.profileText}> PROFIL </Text>
                       </View>

                       <View style={styles.secondaryProfileText}>
                           <Text style={styles.detailText}> • Unesi svoju plaću i datum isplate da Računko može pratiti tvoj budžet </Text>
                           <Text style={styles.detailText}> • Uključi obavijesti ako želiš podsjetnike i savjete o potrošnji </Text>
                       </View>
                   </View>


                   <View style={styles.inputContainer}>
                       <View style={styles.inputBox}>
                           <Text style={styles.incomeText}> Mjesečni prihod </Text>
                           <View style={styles.rightSideInputBox}>
                               <TextInput
                                   style={styles.input}
                                   value={amount}
                                   onChangeText={setAmount}
                                   keyboardType="numeric"
                                   placeholder="0"
                                   placeholderTextColor="black"
                                    returnKeyType={"done"}
                                   />
                               <Text style={styles.euro2}> € </Text>
                           </View>

                       </View>



                       <View style={styles.inputBox}>
                           <Text style={styles.incomeText}> Datum Isplate </Text>
                           <View style={styles.dateBox}>
                                <Pressable onPress={() => setShowPicker((prev) => !prev)}>
                                    {!showPicker && (
                                        <Text style={styles.buttonText}>
                                            {selectedNumber}. u mjesecu
                                        </Text>
                                    )}
                                </Pressable>

                               {showPicker && (

                                       <Picker
                                           selectedValue={selectedNumber}
                                           onValueChange={(itemValue) => {
                                               setSelectedNumber(itemValue);
                                               setShowPicker(false);
                                           }}
                                           style={styles.picker}
                                           itemStyle={{color: "black",
                                               fontSize: 22,
                                               backgroundColor: "white",
                                               height: "100%",
                                               borderRadius:25,
                                               width: "70%",
                                               left: "25%",
                                               shadowColor:'#3e3d3d',
                                           }}
                                       >

                                           {Array.from({ length: 28 }, (_, i) => (
                                               <Picker.Item key={i} label={`${i + 1}`} value={i + 1} />
                                           ))}
                                       </Picker>

                               )}

                           </View>
                       </View>



                       <View style={styles.inputBox}>
                           <Text style={styles.incomeText}> Obavijesti </Text>
                           <View style={styles.switchBox}>
                               <Switch
                                    value={isEnabled}
                                    onValueChange={setIsEnabled}
                                    trackColor={{ false: "#ccc", true: "#2563EB" }}
                               />
                           </View>

                       </View>
                   </View>




                   <View style={styles.footerTextBox}>
                        <Text style={styles.footerText}> • Sve podatke možeš kasnije promijeniti u postavkama profila</Text>
                   </View>


                   <View  style={styles.continueButton}>
                       <Pressable style={styles.continueButtonBox} onPress={() => router.push("/login-signup/expenseSetup")}>
                           <Text style={styles.continue}> Nastavi </Text>
                       </Pressable>

                   </View>
               </View>
           </View>
       )
}

export default ProfileSetup;