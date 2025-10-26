import { Pressable, Text, TextInput, View, Alert, TouchableOpacity } from 'react-native'
import React, {useState} from 'react'
import stylesLandingPage from "@/app/styles/landingPage";
import style from "@/app/styles/login_signupPage";
import { router } from "expo-router";
import {Image} from "expo-image";
import { images } from "@/app/assets";
import {Ionicons} from "@expo/vector-icons";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { useAuth } from '@/hooks/useAuth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);

    const { login } = useAuth();
    // Ovdje handleamo input od usera i saljemo ga dalje u api request za login
    const handleLogin = async() => {
        
        try {
            await login({username: username, password});
            router.push("/tabs/home-tab");
        }
        catch (error) {
            console.error('login failed: ', error);

        } 
        
        
    };


    // S ovim provjeravamo da inputi nisu prazni - ako je prazno onda je gumb zasivljen
    const isFormValid = username.trim() !== '' && password.trim() !== '';

    return (
        <View style={stylesLandingPage.display}>

            <View style={stylesLandingPage.container}>
                <Text style={stylesLandingPage.mainHeader}>Računko</Text>
            </View>

            <View style={style.loginPage}>
                <View style={style.titleBox}>
                    <Text style={style.title}>Dobrodošli Nazad</Text>
                    <Text style={style.secondaryTitle}>Upišite svoje podatke</Text>
                </View>


         
                <View style={style.textInputBox}>
                    {/* Username */}
                    <View style={style.textInputBorder}>
                        <Text style={style.thirdTitle}>Username</Text>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                            <TextInput
                                style={style.input}
                                textContentType="username"
                                placeholder="pero123"
                                placeholderTextColor="#888"
                                autoCapitalize="none"
                                value={username}
                                onChangeText={setUsername}
                                keyboardType="default"
                            />
                        </TouchableWithoutFeedback>
                    </View>

                    {/* Sifra */}
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
                    <Text style={style.secondaryTitle}>Zaboravili ste šifru?</Text>
                </View>


                
                <View style={style.buttonsContainer}>

                    {/* Gumb za login */}
                    <TouchableOpacity
                        style={[style.button, !isFormValid && style.buttonDisabled]}
                        onPress={handleLogin}
                        disabled={!isFormValid}
                        activeOpacity={0.7}
                    >
                        <Text style={style.text}>Prijavi se</Text>
                    </TouchableOpacity>

                    <View style={style.separator}>
                        <View style={style.line}></View>
                        <Text style={style.secondaryTitle}>Ili se prijavite sa</Text>
                        <View style={style.line}></View>
                    </View>

                    {/* Google login */}
                    <TouchableOpacity
                        style={style.googleButton}
                        onPress={() => router.push("/tabs/home-tab")}
                        activeOpacity={0.7}
                    >
                        <Image source={images.google} style={style.googleIcon}/>
                        <Text style={style.googleText}>Continue with Google</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}
export default Login
