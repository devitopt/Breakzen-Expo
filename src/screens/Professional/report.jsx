import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  Linking,
  KeyboardAvoidingView,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import qs from 'qs';
import { useSelector } from 'react-redux';
import { firestore } from '../../config/firebase';
import { FullButton } from '../../components/fullbutton';
import { color } from '../../assets/stdafx';
import { BackBar } from '../Login/backbar';
import { getDoc, doc, updateDoc, addDoc, collection } from 'firebase/firestore';



export default function Report({ route, navigation }) {
  const user = useSelector((state) => state.user);
  const { userId } = route.params;
  const [other, setOther] = useState({ name: '', email: '' });

  const reasons = [
    'Inappropriate profile picture(s)',
    'Sexual chat or pictures',
    'Spam/advertising',
    'Harassment',
    'Fraud',
    'Other',
  ];
  const [cur, setCur] = useState(0);
  const [description, setDescription] = useState('');

  const sendEmail = async (to, subject, body, options = {}) => {
    const { cc, bcc } = options;
    let url = `mailto:${to}`;

    // Create email link query
    const query = qs.stringify({
      subject,
      body,
      cc,
      bcc,
    });

    if (query.length) {
      url += `?${query}`;
    }

    // check if we can use this link
    const canOpen = await Linking.canOpenURL(url);

    if (!canOpen) {
      throw new Error('Provided URL can not be handled');
    }

    return Linking.openURL(url);
  };

  const onReport = async () => {
    

    const title = `${other.name} is reported.`;
    const content = `${user.name
      } has reported ${other.name
      } for this reason. \n\n${reasons[cur]
      }\n\n${description}`;   

    const collectionRef = collection(firestore, "reports");
    addDoc(collectionRef, {
      name: other.name,
      email: other.email,
      reason: reasons[cur],
      title,
      content,
    });  

    const docRef = doc(firestore, "users", userId);
    updateDoc(docRef, { reported: true }).then(() => {
      alert('Reported');
      navigation.goBack();
    });

    // sendEmail(
    //   'support@breakzen.com',
    //   title,
    //   content,
    //   // {cc: 'user@domain.com; user2@domain.com; userx@domain1.com'},
    // ).then(() => {      
    // });
  };

  const getOtherInfo = async () => {
    getDoc(doc(firestore, "users", userId)).then((snapShot) => {
      const userData = snapShot.data();
      setOther({
        name: userData.name,
        email: userData.email
      });
    });
  };

  useEffect(() => {
    getOtherInfo();
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={styles.container}>
        <BackBar navigation={navigation} />
        <Text style={styles.title}>Please state your reason for reporting this user:</Text>
        <View style={styles.reasonView}>
          {reasons.map((reason, index) => (
            <View key={index}>
              <TouchableOpacity onPress={() => setCur(index)}>
                <View
                  style={[
                    styles.reason,
                    cur === index && { backgroundColor: color.blue },
                  ]}
                >
                  <Text style={cur === index && { color: 'white' }}>{reason}</Text>
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <Text style={styles.title}>Tell us what happened:</Text>
        <TextInput
          style={styles.input}
          multiline
          value={description}
          onChangeText={setDescription}
        />
        <FullButton title="Send Report" onPress={onReport} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    width: "100%",
    height: "100%",
  },
  container: {
    paddingHorizontal: 28,
  },
  reasonView: {
    marginBottom: 24,
  },
  reason: {
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: color.blue,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 32,
    height: 100
  },
});
