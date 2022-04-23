import React from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { navName } from "../navigation/Paths";
import { FullButton } from "../components/fullbutton";
import { color, size, buttonType } from "../assets/stdafx";
import Splash from "../assets/splash/splash.png";
import Blur from "../assets/splash/blur.png";
import LogoSymbol from "../assets/splash/logo_symbol.png";
import LogoComment from "../assets/splash/logo_comment.png";
import { SafeAreaView } from "react-native-safe-area-context";

const screenWidth = Dimensions.get('screen').width;
const {width, height} = Image.resolveAssetSource(Splash);

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* <ImageBackground source={Splash} style={styles.container}> */}
      {/* <ImageBackground source={Blur} style={styles.blurContainer}> */}
        <View style={styles.logoContainer}>
          <Image source={LogoSymbol} style={styles.logoSymbol} />
          <Image source={LogoComment} style={styles.logoComment} />
        </View>
        <View style={styles.buttonContainer}>
          <FullButton
            onPress={() => navigation.navigate(navName.SignInIntro)}
            src={buttonType.login}
            title="Login"
          />
          <TouchableOpacity
            onPress={() => navigation.navigate(navName.SignUpIntro)}
            background={color.blue}
          >
            <View style={styles.signupButton}>
              <Text style={styles.buttonText}>Create an Account</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.bottomContainer}>
          <Image source={Splash} style={styles.bottomImage} />
        </View>
      {/* </ImageBackground> */}
      {/* </ImageBackground> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center"
  },  
  logoContainer: {
    // flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80,
    zIndex: 10
  },
  logoSymbol: {
    width: "30%",
    height: undefined,
    aspectRatio: 67 / 64,
    marginBottom: 32,
  },
  logoComment: {
    width: "50%",
    height: undefined,
    aspectRatio: 421 / 66,
  },
  buttonContainer: {
    marginTop: 50,
    width: "80%",
    zIndex: 10
  },
  signupButton: {
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  buttonText: {
    fontSize: 14,
    color: "black",
  },
  bottomContainer: {
    width: "100%",
    position: "absolute",
    bottom: 0
  },
  bottomImage: {
    width: "100%",
    height: height / width * screenWidth,
    resizeMode: "contain"
  }
});
