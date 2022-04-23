import React,  { useState, useEffect, Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { navName } from '../../navigation/Paths';
import { BackBar } from './backbar';
import { AppBar } from './appbar';
import { ImageButton } from './imagebutton';
import {
  size,
  loginType,
} from "../../assets/stdafx";
import * as Facebook from 'expo-facebook';
import * as Google from 'expo-google-app-auth';
import Constants from "expo-constants";

export default function SignUpIntro({ navigation }) {

  const [socialId, setSocialId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [picture, setPicture] = useState('');
  const [logintype, setLoginType] = useState(null); 

  useEffect(() => {    
    if (email && email != '' && socialId && socialId != '' && name && name != '' && logintype) goNext()
  }, [socialId, email, name, picture]);
  
  async function onFbSignup() {
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
        setLoginType(loginType.facebook);
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

  const Glogin = async () => {

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

        setLoginType(loginType.google);
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
  };

  const goNext = () => {       
           
    navigation.navigate(navName.AccountTypeSelection, {      
      socialId: socialId,
      email: email,
      name: name,
      picture: picture,
      logintype: logintype
    });    
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, paddingHorizontal: 18 }}>
        <BackBar navigation={navigation} />
        <AppBar
          title="Register"
          comment="Create a new account using your email or social media accounts"
        />
        <View style={{ flex: 1, flexGrow: 1 }}>
          <ImageButton
            click={() => {onFbSignup()}}
            image={() =>
              <FacebookIcon />
            }
            title="Sign up using Facebook"
          />          
          <ImageButton
            click={() => {Glogin()}}
            image={() =>
              <GoogleIcon />
            }
            title="Sign up using Google"
          />
          {/* <ImageButton
            navigation={navigation}
            image={() =>
              <AppleIcon />
            }
            href={navName.SignInEmail}
            title="Sign up using Apple"
          /> */}

        </View>

        <View style={{ flex: 1, justifySelf: 'flex-end' }}>
          <ImageButton
            navigation={navigation}
            image={() =>
              <EmailIcon />
            }
            href={navName.AccountTypeSelection}
            title="Sign up using Email"
          />
          <View style={styles.footerCopy}>
            <Text style={styles.signupComment}>
              By Signing up, you agree to Breakzen llc{' '}
              <Text onPress={() => navigation.navigate(navName.TermsAndConditions)}
                style={styles.signupButton}>Terms of Service </Text>
              and
              <Text onPress={() => navigation.navigate(navName.PrivacyPolicy)} style={styles.signupButton}> Privacy Policy</Text>
            </Text>
          </View>
        </View>

      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    paddingBottom: size.screenpb,
  },
  signupComment: {
    color: '#BCBCBC',
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    marginBottom: 8,
    lineHeight: 24,
  },
  signupButton: {
    color: '#000',
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
  },
  footerCopy: {
    marginTop: 25,
  }
});
