import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import { BackBar } from "./backbar";
import { AppBar } from "./appbar";
import { InputLabel } from "./inputlabel";
import { FullButton } from "../../components/fullbutton";
import {
  buttonType,
  color,
  chatCollection,
  breakzen,
  defaultUserData,
  inputType,
  size,
  loginType,
  defaultPhoto
} from "../../assets/stdafx";
import { Eye } from "./eye";
import { ConfirmLabel } from "./confirmlabel";
import { firestore, auth } from "../../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, collection, addDoc, setDoc } from "firebase/firestore";

export default function RegisterClient({ route, navigation }) {

  const [passwordVisible, setPasswordVisible] = useState(true);
  const [fullName, setFullName] = useState(route.params.values && route.params.values.name ? route.params.values.name : "");
  const [email, setEmail] = useState(route.params.values && route.params.values.email ? route.params.values.email : "");
  const [password, setPassword] = useState(route.params.values && route.params.values.socialId ? route.params.values.socialId : "");
  const [logintype, setLoginType] = useState(route.params.values && route.params.values.logintype ? route.params.values.logintype : loginType.email)
  const [photo, setPhoto] = useState(route.params.values && route.params.values.picture ? route.params.values.picture : defaultPhoto[0])
  
  const clientFirstMsg =
    '"Welcome to the biggest Wellness Community"\nYou can connect with licensed local professionals in the Wellness industry or with more users by creating and participating in social groups, chatting online, and listing jobs to find the best professional that adapts to your specific needs.\nBreakzen connects two different paths into one, because we believe when there is a will, there is our way.';

  const onRegister = () => {
    if (email === "" || password === "") {
      alert("Email and Password can not be empty value.");
    } else if (password.length < 8) {
      alert("Password must be at least 8 characters");
    } else {
      try {
        createUserWithEmailAndPassword(auth, email, password)
          .then((newUser) => {
            alert("Created Successfully.");
            const userId = newUser.user.uid;
            const docRef = doc(firestore, "users", userId);
            setDoc(docRef, {
              ...defaultUserData.user,
              ...defaultUserData.client,
              professional: false,
              name: fullName,
              email,
              photo: photo,
              logintype: loginType
            }).then(() => {
              const collectionRef = collection(
                firestore,
                chatCollection(userId, breakzen.uid)
              );
              addDoc(collectionRef, {
                content: clientFirstMsg,
                read: false,
                receiver: userId,
                sender: breakzen.uid,
                time: new Date(),
              });
            });
          })
          .catch((error) => {
            if (error.toString().includes('invalid-email')){
              alert("Invalid Email Address");
            } else if (error.toString().includes('email-already-in-use')) {
              alert("User already exist");
            } else {
              alert(error);
            }
          });
      } catch (error) {
        if (error.toString().includes('invalid-email')){
          alert("Invalid Email Address");
        } else if (error.toString().includes('email-already-in-use')) {
          alert("User already exist");
        } else {
          alert(error);
        }
      }
    }
  };
  return (
    <View style={styles.container}>
      <BackBar navigation={navigation} />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <AppBar
          title="Register"
          comment="Create a new account using your email or social media accounts"
        />
        <InputLabel src={inputType.user} title="Full Name" />
        <TextInput
          style={styles.input}
          placeholder="Khalid Saied Abdelmonem"
          value={fullName}
          onChangeText={setFullName}
          editable={(logintype == loginType.email)}
        />
        <InputLabel src={inputType.email} title="Email Address" />
        <TextInput
          style={styles.input}
          placeholder="Mist4227s@gmail.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          editable={(logintype == loginType.email)}
        />
        <InputLabel src={inputType.password} title="Password" />
        <View style={styles.passwordInput}>
          <TextInput
            style={styles.input}
            placeholder="* * * * * *"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={passwordVisible}
            editable={(logintype == loginType.email)}
          />
          <View style={styles.eye}>
          <Eye show={passwordVisible} onPress={() => logintype == loginType.email ? setPasswordVisible(!passwordVisible) : setPasswordVisible(true)} />
          </View>
        </View>
        <View style={{ marginBottom: 48 }}>
          <ConfirmLabel text="Be 8 to 72 characters long" active />
          <ConfirmLabel text="not contain your name or email" active />
          <ConfirmLabel text="not be commonly used or easily guessed" />
        </View>
        <FullButton
          onPress={onRegister}
          src={buttonType.register}
          title="Register"
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    paddingHorizontal: 34,
    paddingBottom: size.screenpb,
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderColor: color.blue,
    borderRadius: 7,
    fontSize: 12,
    marginLeft: 32,
  },
  passwordInput: {
    position: "relative",
    marginBottom: 24,
    justifyContent: "center",
  },
  eye: {
    position: "absolute",
    right: 12,
  },
});
