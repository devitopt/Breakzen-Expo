import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { auth } from '../../config/firebase';
import { FullButton } from '../../components/fullbutton';
import { BackBar } from './backbar';
import { AppBar } from './appbar';
import { InputLabel } from './inputlabel';
import {
  buttonType, color, inputType, size,
} from '../../assets/stdafx';
import { Eye } from './eye';
import { Loading } from '../../components/loading';
import { signInWithEmailAndPassword } from 'firebase/auth';
import CheckBox from 'expo-checkbox';
import { navName } from "../../navigation/Paths";

export default function SignInEmail({ navigation }) {
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bLoading, setLoading] = useState(false);
  const [toggleCheckBox, setToggleCheckBox] = useState(false)

  const onLogin = async () => {
    setLoading(true);
    if (email === '' || password === '') {
      alert('Email and Password can not be empty value.');
      setLoading(false);
      return;
    }
    try {
      await
        signInWithEmailAndPassword(auth, email, password);
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

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <BackBar navigation={navigation} />
        <ScrollView
          style={styles.scrollArea}
          showsVerticalScrollIndicator={false}
        >
          <AppBar
            title="Login"
            comment="Login to your account using your email and start working today!"
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
          <InputLabel src={inputType.password} title="Password" />
          <View style={styles.passwordInput}>
            <TextInput
              selectionColor={color.blue}
              style={styles.input}
              placeholder="* * * * * *"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={passwordVisible}
            />
            <View style={{ position: 'absolute', right: 17 }}>
              <Eye show={passwordVisible} onPress={() => setPasswordVisible(!passwordVisible)} />
            </View>
          </View>
          <View style={{ marginBottom: 24, flex: 1, flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
            <View style={{ flex: 1, flexDirection: 'row', alignContent: 'center' }}>
              <CheckBox
                disabled={false}
                value={toggleCheckBox}
                style={{ borderColor: color.lightGray }}
                onValueChange={(newValue) => setToggleCheckBox(newValue)}
              />
              <Text style={styles.remeberMe}>Remember Me</Text>
            </View>
            <TouchableOpacity>
              <Text onPress={() => navigation.navigate(navName.ForgotPassword)} style={styles.forgotPwd}>Forgot Password</Text>
            </TouchableOpacity>
          </View>
          <FullButton onPress={onLogin} src={buttonType.login} title="Login" />
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
  },
  passwordInput: {
    marginBottom: 24,
    position: 'relative',
    justifyContent: 'center',
  },
  remeberMe: {
    color: color.gray,
    fontSize: 14,
    marginBottom: 24,
    marginLeft: 8,
    fontFamily: 'Poppins_400Regular'
  },
  forgotPwd: {
    color: 'black',
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold'
  },
});
