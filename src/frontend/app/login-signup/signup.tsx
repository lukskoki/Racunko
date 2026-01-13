import { Pressable, Text, TextInput, View, Alert, TouchableOpacity } from 'react-native'
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

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const { loginGoogle, register } = useAuth();
    // Ovdje handleamo input od usera i saljemo ga dalje u api request za register
    const handleSignup = async() => {
        
        try {
            await register({username: username, password, email});
            router.push("/login-signup/profileSetup");
        }
        catch (error: any) {
            console.error('Register failed: ', error);
            setErrorMessage(error.message || "Registracija neuspjesna");

        } 
        
    };
        const handleSignUpGoogle = async() => {
            // Vratit ce isti response kao i obican login
            try {
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
        }

    // S ovim provjeravamo da inputi nisu prazni - ako je prazno onda je gumb zasivljen
    const isFormValid = username.trim() !== '' && email.trim() !== '' && password.trim() !== '';

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
                        <Text style={style.title}>Započnite Besplatno</Text>
                        <Text style={style.secondaryTitle}>Besplatno zauvijek</Text>
                    </View>


                    {/* Ime i prezime */}
                    <View style={style.textInputBox}>
                        <View style={style.textInputBorder}>
                            <Text style={style.thirdTitle}>Username</Text>
                            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                                <TextInput
                                    style={style.input}
                                    textContentType="name"
                                    placeholder="peroPeric123"
                                    placeholderTextColor="#888"
                                    value={username}
                                    onChangeText={setUsername}
                                />
                            </TouchableWithoutFeedback>
                        </View>

                        {/* Email */}
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
                    </View>


                    <View style={style.buttonsContainer}>
                        {errorMessage && (
                            <View style ={globals.errorContainer}>
                                <Text style={globals.errorText}>{errorMessage}</Text>
                            </View>
                        )}
                        {/* Gumb za registraciju */}
                        <TouchableOpacity
                            style={[style.button, !isFormValid && style.buttonDisabled]}
                            onPress={handleSignUpGoogle}
                            disabled={!isFormValid}
                            activeOpacity={0.7}
                        >
                            <Text style={style.text}>Registriraj se</Text>
                        </TouchableOpacity>


                        <View style={style.separator}>
                            <View style={style.line}></View>
                            <Text style={style.secondaryTitle}>Ili se registrirajte sa</Text>
                            <View style={style.line}></View>
                        </View>

                        {/* Google sign up */}
                        <TouchableOpacity
                            style={style.googleButton}
                            onPress={handleSignUpGoogle}
                            activeOpacity={0.7}
                        >
                            <Image source={images.google} style={style.googleIcon}/>
                            <Text style={style.googleText}>Continue with Google</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Pressable>


    )
}
export default Signup
