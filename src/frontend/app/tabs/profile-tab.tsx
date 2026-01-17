import { Pressable, Text, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../styles/profile";
import { Image } from "expo-image";
import { images } from "@/app/assets";
import { router } from "expo-router";
import { useAuth } from '@/hooks/useAuth';

const Profil = () => {
    const { logout, user } = useAuth();

    const handleLogout = () => {
        // Ocisti token i user data
        // Nije dobro stavit await logout() jer onda usera nece izlogirat ako dode do greske, a trebalo bi u svakom slucaju
        logout();
        router.dismissAll();
        router.replace("/");
    };

    const displayName = user
        ? [user.first_name, user.last_name].filter(Boolean).join(' ')
        : '';

    return (
        <SafeAreaView style={styles.display}>
            <View style={styles.profileHero}>
                <View style={styles.profileHeroRow}>
                    <View style={styles.avatarWrap}>
                        <Image source={images.user} style={styles.profileImage} />
                    </View>
                    <View style={styles.profileTextWrap}>
                        <Text style={styles.profileKicker}>Moj profil</Text>
                        <Text style={styles.profileName}>
                            {displayName || user?.username || 'Korisnik'}
                        </Text>
                        <Text style={styles.profileSub}>{user?.email || 'Nema emaila'}</Text>
                    </View>
                </View>
                <View style={[
                    styles.status,
                    user?.profile_completed ? styles.statusOk : styles.statusWarn
                ]}>
                    <Text style={[
                        styles.statusText,
                        user?.profile_completed ? styles.statusTextOk : styles.statusTextWarn
                    ]}>
                        {user?.profile_completed ? 'Dovršen profil' : 'Nije dovršen'}
                    </Text>
                </View>
            </View>

            <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>Osnovno</Text>
                {!user ? (
                    <Text style={styles.infoEmpty}>Nema ucitanih podataka o profilu.</Text>
                ) : (
                    <>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Ime i prezime</Text>
                            <Text style={styles.infoValue}>{displayName || user.username}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Korisnicko ime</Text>
                            <Text style={styles.infoValue}>{user.username}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Email</Text>
                            <Text style={styles.infoValue}>{user.email}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Status profila</Text>
                            <Text style={styles.infoValue}>
                                {user.profile_completed ? "Dovršen" : "Nije dovršen"}
                            </Text>
                        </View>
                    </>
                )}
            </View>

            <View style={styles.logOutBox} >
                <Pressable onPress={handleLogout} style={styles.logOutButton}>
                    <Text style={styles.logOutText}>Log Out</Text>
                </Pressable>
            </View>

        </SafeAreaView>
    )
}
export default Profil
