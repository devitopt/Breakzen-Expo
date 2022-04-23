import React, { useEffect } from "react";
import { Image, View, Text, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { color, size } from "../../assets/stdafx";
import { BackButton } from "../../components/backbutton";
import { FullButton } from "../../components/fullbutton";
import { addinfo } from "../../redux/actioncreators";
import EmailVerify from "../../assets/svg/email_verify.png";
import { auth } from "../../config/firebase";
import { firestore } from "../../config/firebase";
import { sendEmailVerification } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";

export default function EmailRequestValidation({ navigation }) {
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const addInfo = (info) => dispatch(addinfo(info));

  useEffect(() => {
    sendEmailVerification(auth.currentUser);
    const unsubscribeSetInterval = setInterval(() => {
      if (auth) {
        auth.currentUser.reload().then(() => {
          if (auth.currentUser.emailVerified) {
            clearInterval(unsubscribeSetInterval);
            alert("Email Verified");
            updateDoc(doc(firestore, "users", user.uid), {
              verified: true,
            }).then(() => {
              addInfo({ verified: true });
            });
          }
        });
      }
    }, 3000);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.backBar}>
        <BackButton navigation={navigation} />
      </View>
      <View style={styles.main}>
        <Image source={EmailVerify} />
        <Text style={styles.title}>Verify Email</Text>
        <Text style={styles.comment}>
          Please confirm your email to verify your identify
        </Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>
      <FullButton
        title="Resend Email"
        onPress={() => sendEmailVerification(auth.currentUser)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    paddingHorizontal: 32,
    paddingBottom: size.screenpb,
  },
  backBar: {
    marginTop: 48,
    marginBottom: 36,
  },
  main: {
    flex: 1,
    alignItems: "center",
    paddingTop: 36,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    paddingTop: 36,
    paddingBottom: 24,
  },
  comment: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    color: "gray",
    paddingBottom: 36,
  },
  email: {
    color: color.blue,
    fontSize: 18,
  },
});
