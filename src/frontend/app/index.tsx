import {Button, Pressable, Text, View} from "react-native";
import styles from "@/app/styles";
import {SafeAreaView} from "react-native-safe-area-context";
import {Image} from "expo-image";
import {StatusBar} from "expo-status-bar";
import {router} from "expo-router";



export default function Index() {
  return (

      <SafeAreaView style={styles.display}>

          <View style={styles.container}>
              <Text style={styles.mainHeader}>Računko</Text>
          </View>

          <View style={styles.landingPageImgBox}>
                <Image source={"@/pictures/img.png"}/>
          </View>

          <View style={styles.textBox}>
                <Text style={styles.text}>Planirajte svoju potrošnju</Text>
                <Text style={styles.text}>- Pametno, uz Računko</Text>
          </View>

          <View style={styles.buttonBox}>
                <Pressable style={styles.registracija} onPress={() => router.push(("/login-signup/signup"))}>
                    <Text style={styles.text1}>Registracija</Text>
                </Pressable>

                <Pressable style={styles.prijava} onPress={() => router.push("/login-signup/login")}>
                    <Text style={styles.text1}>Prijava</Text>
                </Pressable>
          </View>
      </SafeAreaView>

  );
}

