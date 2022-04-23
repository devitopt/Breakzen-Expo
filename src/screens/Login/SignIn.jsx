import React,  { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { navName } from '../../navigation/Paths';
import { BackBar } from './backbar';
import { AppBar } from './appbar';
import { ImageButton } from './imagebutton';
import { color } from '../../assets/stdafx';
import GoogleIcon from '../../components/Icons/GoogleIcon';
import FacebookIcon from '../../components/Icons/FacebookIcon';
import AppleIcon from '../../components/Icons/AppleIcon';
import EmailIcon from '../../components/Icons/EmailIcon';
import * as Facebook from 'expo-facebook';
import { auth } from "../../config/firebase";
import {  signInWithEmailAndPassword } from 'firebase/auth';
import { Loading } from '../../components/loading';
import * as Google from 'expo-google-app-auth';
import Constants from "expo-constants";

export default function SignIn({ navigation }) {
  const [socialId, setSocialId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [picture, setPicture] = useState('');
  const [bLoading, setLoading] = useState(false);

  useEffect(() => {   
    if (email != '' && setSocialId !== '') onLogin()
  }, [socialId, email, name, picture]); 

  const onLogin = async () => {
    setLoading(true);    
    try {
      await
        signInWithEmailAndPassword(auth, email, socialId)
    } catch (error) {
      if (error.toString().includes('user-not-found')) {
        alert('User not found');
      } else if (error.toString().includes('invalid-email')){
        alert("Invalid Email Address");
      } else if (error.toString().includes('wrong-password')) {
        alert("Wrong password");
      } else {
        alert(error);
      }
    }

    setLoading(false);
  };  

  async function onFblogin() {
    try {
      await Facebook.initializeAsync({
        appId: Constants.manifest.extra.facebookAppId,
      });
      const { type, token, expirationDate, permissions, declinedPermissions } =
        await Facebook.logInWithReadPermissionsAsync({
          permissions: ['public_profile', 'email']
        });
        
      if (type === 'success') {
        const response = await fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,picture.type(large)`);
        const {picture, name, email, id} = await response.json();
        setSocialId(id);
        setEmail(email);
        setPicture(picture.data.url);
        setName(name); 
        
      } else {
        type === 'cancel'
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  }

  const onGlogin = async () => {  

    try {      
      const result = await Google.logInAsync({
        iosClientId: Constants.manifest.extra.iosClientId,
        androidClientId: Constants.manifest.extra.androidClientId,
        androidStandaloneAppClientId: Constants.manifest.extra.androidStandaloneAppClientId,
        iosStandaloneAppClientId: Constants.manifest.extra.iosStandaloneAppClientId,
        webClientId: Constants.manifest.extra.webClientId,
        scopes: ['profile', 'email']
      });
      if (result.type === 'success') {
        
        const user = result.user;
        
        setSocialId(user.id);
        setEmail(user.email);
        setPicture(user.photoUrl);
        setName(user.name);   
      } else {
        //CANCEL
      }
    } catch ({ message }) {
      alert('login: Error:' + message);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, paddingHorizontal: 18 }}>
        <BackBar navigation={navigation} />
        <AppBar
          title="Login"
          comment="Login to your account using your email or social media accounts"
        />
        <View style={{ flex: 1, flexGrow: 1 }}>
          <ImageButton
            click={() => {onFblogin()}}
            image={() =>
              <FacebookIcon />
            }
            title="Sign in using Facebook"
          />
          <ImageButton
            click={() => {onGlogin()}}
            image={() =>
              <GoogleIcon />
            }
            title="Sign in using Google"
          />
          {/* <ImageButton
            navigation={navigation}
            image={() =>
              <AppleIcon />
            }
            href={navName.SignInEmail}
            title="Sign in using Apple"
          /> */}

        </View>

        <View style={{ flex: 1, justifySelf: 'flex-end' }}>
          <ImageButton
            navigation={navigation}
            image={() =>
              <EmailIcon />
            }
            href={navName.SignInEmail}
            title="Sign in using Email"
          />
          <View style={styles.footerCopy}>
            <Text style={styles.signupComment}>
              Don't have account?
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate(navName.SignUpIntro)}
            >
              <Text style={styles.signupButton}> Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
        {bLoading && <Loading />}
      </View>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    paddingHorizontal: 34,
  },
  signupComment: {
    color: color.gray,
    fontSize: 14,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: 48,
    marginBottom: 48,
    fontFamily: 'Poppins_400Regular'
  },
  signupButton: {
    color: 'black',
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold'
  },
  footerCopy: {
    flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'center'
  }
});
