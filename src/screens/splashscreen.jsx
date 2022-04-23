import React, { useEffect } from 'react';
import {
  Image, StyleSheet, Animated, Easing, View,
} from 'react-native';
import { navName } from '../navigation/Paths';
import Splash from '../assets/svg/splash.gif';

export default function SplashScreen({ navigation }) {
  // let opacity = new Animated.Value(0);
  useEffect(() => {
    // opacity.setValue(0);
    // Animated.timing(opacity, {
    //   toValue: 1,
    //   duration: 2000,
    //   easing: Easing.linear,
    //   useNativeDriver: true,
    // }).start(() => {
    //   navigation.replace(navName.WelcomeScreen);
    // });

    setTimeout(() => {
      navigation.replace(navName.WelcomeScreen);
    }, 3000);
  }, []);
  // let opacityStyle = [styles.container, {opacity}];
  return (

    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={Splash}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FCFCFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '80%',
    height: undefined,
    aspectRatio: 67 / 64,
  },
});
