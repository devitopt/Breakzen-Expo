import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert
} from 'react-native';
import { auth } from '../../config/firebase';
import { FullButton } from '../../components/fullbutton';
import { BackBar } from './backbar';
import { AppBar } from './appbar';
import { InputLabel } from './inputlabel';
import {
  buttonType, color, inputType, size,
} from '../../assets/stdafx';

import { Loading } from '../../components/loading';
import { sendPasswordResetEmail } from 'firebase/auth';


export default function ForgotPassword({ navigation }) {
  
  const [email, setEmail] = useState(''); 
  const [bLoading, setLoading] = useState(false);  

  const onForgotPassword = async () => {
    setLoading(true);
    if (email === '') {
      alert('Email can not be empty value.');
      setLoading(false);
      return;
    }
    try {
      await
        sendPasswordResetEmail(auth, email)
        showConfirmDialog();     
    } catch (error) {
      alert(error);
    }

    setLoading(false);
  };  

  const showConfirmDialog = () => {
    return Alert.alert(
      "Confirm",
      "We sent reset password url to your mail inbox.",
      [        
        {
          text: "Ok",
          onPress: () => {
            navigation.goBack();
          },
        }
      ]
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <BackBar navigation={navigation} />
        <ScrollView
          style={styles.scrollArea}
          showsVerticalScrollIndicator={false}
        >
          <AppBar
            title="Forgot Password"
            comment="Please input your email to reset password. You will receive reset password url in your mail inbox."
          />
          <InputLabel src={inputType.email} title="Email Address" />
          <TextInput
            selectionColor={color.blue}
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Mist4227s@gmail.com"
            keyboardType="email-address"
          />          
          
          <FullButton onPress={onForgotPassword} src={buttonType.login} title="Forgot Password" />
        </ScrollView>
      </View>
      {bLoading && <Loading />}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    width: '100%',
    height: '100%',
  },
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    paddingHorizontal: 34,
    paddingBottom: 12,
  },
  scrollArea: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 26,
    paddingVertical: 16,
    borderColor: color.lightGray,
    borderRadius: 7,
    fontSize: 12,
    marginBottom: 34
  } 
});
