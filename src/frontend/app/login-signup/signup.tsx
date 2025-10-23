import { Pressable, Text, TextInput, View} from 'react-native'
import React, {useState} from 'react'
import stylesLandingPage from "@/app/styles/landingPage";
import style from "@/app/styles/login_signupPage";
import { router } from "expo-router";
import {Image} from "expo-image";
import { images } from "@/app/assets";
import {Ionicons} from "@expo/vector-icons";
import { Keyboard, TouchableWithoutFeedback } from "react-native";


const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);

    return (
        <View style={stylesLandingPage.display}>

            <View style={stylesLandingPage.container}>
                <Text style={stylesLandingPage.mainHeader}>Računko</Text>
            </View>

            <View style={style.loginPage}>
                <View style={style.titleBox}>
                    <Text style={style.title}>Započnite Besplatno</Text>
                    <Text style={style.secondaryTitle}>Besplatno zauvijek</Text>
                </View>

                <View style={style.textInputBox}>
                    <View style={style.textInputBorder}>
                        <Text style={style.thirdTitle}>Ime i prezime</Text>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                            <TextInput
                                style={style.input}
                                textContentType="name"
                                placeholder="Pero Perić"
                                placeholderTextColor="#888"
                                value={name}
                                onChangeText={setName}
                            />
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={style.textInputBorder}>
                        <Text style={style.thirdTitle}>Email</Text>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                            <TextInput
                                style={style.input}
                                textContentType="emailAddress"
                                placeholder="primjer@gmail.com"
                                placeholderTextColor="#888"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                            />
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={style.textInputBorderPassword}>
                        <View style={style.passwordBox}>
                            <Text style={style.thirdTitle}>Šifra</Text>
                            <TextInput
                                style={style.inputPassword}
                                placeholder="sifra123"
                                placeholderTextColor="#888"
                                secureTextEntry={!passwordVisible}
                                value={password}
                                onChangeText={setPassword}
                            />
                        </View>
                        <Pressable style={style.eyeBtn} onPress={() => setPasswordVisible(!passwordVisible)} >
                            <Ionicons
                                name={passwordVisible ? "eye" : "eye-off"}
                                size={24}
                                color="#666"/>
                        </Pressable>
                    </View>
                </View>

                <View style={style.buttonsContainer}>
                    <Pressable style={style.button} onPress={() => router.push("/tabs/home-tab")}>
                        <Text style={style.text}>Registriraj se</Text>
                    </Pressable>

                    <View style={style.separator}>
                        <View style={style.line}></View>
                        <Text style={style.secondaryTitle}>Ili se registrirajte sa</Text>
                        <View style={style.line}></View>
                    </View>

                    <Pressable style={style.googleButton} onPress={() => router.push("/tabs/home-tab")}>
                        <Image source={images.google} style={style.googleIcon}/>
                        <Text style={style.googleText}>Continue with Google</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}
export default Signup
