import {Pressable, Text, TextInput, View, Alert, TouchableOpacity, ActivityIndicator} from 'react-native'
import React, {useState} from 'react'
import stylesLandingPage from "@/app/styles/landingPage";
import style from "@/app/styles/login_signupPage";
import globals from "@/app/styles/globals";
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
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoadingLogin, setLoadingLogin] = useState(false);
    const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);

    const { login, loginGoogle } = useAuth();
    // Ovdje handleamo input od usera i saljemo ga dalje u api request za login
    const handleLogin = async() => {

        try {
            setLoadingLogin(true);
            const loggedInUser = await login({username: username, password});
            // Provjeri je li profile setup zavrsen
            if (loggedInUser.profile_completed) {
                router.push("/tabs/home-tab");
            } else {
                router.push("/login-signup/profileSetup");
            }

        }
        catch (error: any) {
            console.error('login failed: ', error);
            setErrorMessage(error.message || "Neispravan username ili password");
        } finally {
            setLoadingLogin(false);
        }
    };

    const handleLoginGoogle = async() => {
        // Vratit ce isti response kao i obican login
        try {
            setIsLoadingGoogle(true);
            const loggedInUser = await loginGoogle();
            // Provjeri je li profile setup zavrsen
            if (loggedInUser.profile_completed) {
                router.push("/tabs/home-tab");
            } else {
                router.push("/login-signup/profileSetup");
            }
        }
        catch (error: any) {
            console.error('Google login failed: ', error);
            // Prikazi error poruku samo ako nije user otkazao
            if (error.message !== 'Prijava otkazana') {
                setErrorMessage(error.message || "Google prijava neuspješna");
            }
        }
        finally {
            setIsLoadingGoogle(false);
        }
    }


    // S ovim provjeravamo da inputi nisu prazni - ako je prazno onda je gumb zasivljen
    const isFormValid = username.trim() !== '' && password.trim() !== '';

    const handleClose = () => {
        router.replace("/");
    };

    return (
        <Pressable style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
            <View style={stylesLandingPage.display}>

                <View style={stylesLandingPage.container}>
                    <Text style={stylesLandingPage.mainHeader}>Računko</Text>
                </View>

                <View style={style.loginPage}>
                    <Pressable onPress={handleClose} style={style.closeButton} hitSlop={10}>
                        <Ionicons name="close" size={22} color="#111827" />
                    </Pressable>
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
                        <View style={style.passwordAndErrorContainer}>
                            <Text style={style.secondaryTitle}>Zaboravili ste šifru?</Text>
                            {errorMessage && (
                                <View style ={globals.errorContainer}>
                                    <Text style={globals.errorText}>{errorMessage}</Text>
                                </View>
                            )}
                        </View>
                    </View>


                    <View style={style.buttonsContainer}>

                        {/* Gumb za login */}
                        <TouchableOpacity
                            style={[style.button, (!isFormValid) && style.buttonDisabled, (isFormValid && isLoadingLogin) && style.buttonDisabled]}
                            onPress={handleLogin}
                            disabled={!isFormValid}
                            activeOpacity={0.7}
                        >
                            <Text style={style.text}>Prijavi se</Text>

                            {isLoadingLogin && (
                                <ActivityIndicator
                                    size="small"
                                    color="black"
                                    style={{ position: "absolute" }}
                                />
                            )}
                        </TouchableOpacity>

                        <View style={style.separator}>
                            <View style={style.line}></View>
                            <Text style={style.secondaryTitle}>Ili se prijavite sa</Text>
                            <View style={style.line}></View>
                        </View>

                        {/* Google login */}
                        <TouchableOpacity
                            style={[style.googleButton]}
                            onPress={handleLoginGoogle}
                            activeOpacity={0.7}
                        >
                            <Image source={images.google} style={style.googleIcon}/>
                            <Text style={style.googleText}>Continue with Google</Text>

                            {isLoadingGoogle && (
                                <ActivityIndicator
                                    size="small"
                                    color="black"
                                    style={{ position: "absolute" }}
                                />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Pressable>

    )
}
export default Login
