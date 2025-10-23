import { Pressable, Text, View, TouchableOpacity} from "react-native";
import styles from "@/app/styles/landingPage";
import {Image} from "expo-image";
import {router} from "expo-router";
import { images } from "@/app/assets";


export default function Index() {
  return (

      <View style={styles.display}>

          <View style={styles.container}>
              <Text style={styles.mainHeader}>Računko</Text>
          </View>

          <View style={styles.mainContent}>
              <View style={styles.landingPageImgBox}>
                  <Image source={images.racunko} style={styles.image} />
              </View>

              <View style={styles.textBox}>
                  <Text style={styles.text1}>Planirajte svoju potrošnju</Text>
                  <Text style={styles.text2}>Pametno, uz Računko</Text>
              </View>

              <View style={styles.buttonBox}>
                {/* Registracija */}
                  <TouchableOpacity 
                    style={styles.registracija} 
                    onPress={() => router.push(("/login-signup/signup"))}
                    activeOpacity={0.7}
                  >

                      <Text style={styles.text3}>Registracija</Text>
                  </TouchableOpacity>

                    {/* Prijava */}
                    <TouchableOpacity 
                        style={styles.prijava} 
                        onPress={() => router.push("/login-signup/login")}
                        activeOpacity={0.7}
                    >

                      <Text style={styles.text3}>Prijava</Text>

                  </TouchableOpacity>
              </View>
          </View>
      </View>

  );
}

