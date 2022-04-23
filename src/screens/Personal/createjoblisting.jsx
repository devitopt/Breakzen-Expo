import React, { useState } from "react";
import { Text, View, ScrollView, StyleSheet } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useSelector, useDispatch } from "react-redux";
import { firestore } from "../../config/firebase";
import { BackButton } from "../../components/backbutton";
import { size, color } from "../../assets/stdafx";
import { FullButton } from "../../components/fullbutton";
import { navName } from "../../navigation/Paths";
import { addinfo } from "../../redux/actioncreators";
import { Loading } from "../../components/loading";
import { ref } from "firebase/storage";
import {
  doc,
  collection,  
  addDoc,
  updateDoc
} from "firebase/firestore";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Constants from "expo-constants";

export default function CreateJobListing({ navigation }) {
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const addInfo = (info) => dispatch(addinfo(info));

  const [bLoading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [description, setDescription] = useState("");

  const onCreatePost = () => {
    if (
      title === "" ||
      location === "" ||
      description === ""
    ) {
      alert("Please input all fields.");
      return;
    }
    setLoading(true);
    const info = {
      postcnt: (user.postcnt ? user.postcnt : 0) + 1,
    };
    const docRef = doc(firestore, "users", user.uid);
    updateDoc(docRef, info).then(() => {
      addInfo(info);
      const collectionRef = collection(firestore, "joblist");
      addDoc(collectionRef, {
        title,
        description,
        location,
        latitude,
        longitude,
        date: new Date(),
        creator: user.uid,
      }).then((snapShot) => {
        setLoading(false);
        navigation.navigate(navName.JobListings);
      });
    });
  };
  return (
    <View style={{ width: "100%", height: "100%" }}>
      <View style={styles.container}>
        <View style={{ marginTop: 48, marginBottom: 36 }}>
          <BackButton navigation={navigation} />
        </View>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'} listViewDisplayed={false}>
          <Text style={styles.caption}>Create Job Listing</Text>
          <Text style={styles.pageComment}>
            Enter the following details to create a new job listing
          </Text>

          <Text style={styles.title}> Job Listing Name </Text>
          <TextInput
            style={styles.input}
            placeholder="Name of Post"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.title}> Job Description </Text>
          <TextInput
            style={styles.input}
            placeholder="Please share your description here"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <Text style={styles.title}> Location </Text>
          <GooglePlacesAutocomplete
            ref={ref}
            placeholder="Search Address"
            fetchDetails={true}
            keyboardShouldPersistTaps={'handled'}            
            listViewDisplayed={false}
            enablePoweredByContainer={false}                
            onPress={(data, details = null) => {
              setLocation(data.description);
              setLatitude(details.geometry.location.lat);
              setLongitude(details.geometry.location.lng);
            }}
            query={{
              key: Constants.manifest.extra.apiKey,
              language: 'en',
              region: 'us',
              address: 'us'              
            }}
            styles={
                {
                  textInputContainer: {
                  backgroundColor: 'white',
                  borderWidth: 1,
                  paddingHorizontal: 2,
                  paddingTop: 2,
                  borderColor: color.blue,
                  borderRadius: 7,
                  lineHeight: 20,
                  marginLeft: 24,
                  marginBottom: 24,
                },
                textInput: {
                  height: 24,
                  color: '#5d5d5d',
                  fontSize: 14,
                }
              }
            }
          />
          <View style={{ paddingTop: 12, paddingBottom: size.screenpb }}>
            <FullButton onPress={onCreatePost} title="Create Post" />
          </View>
        </ScrollView>
      </View>
      {bLoading && <Loading />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    paddingHorizontal: 28,
  },
  caption: {
    fontSize: 20,
    fontWeight: "bold",
    paddingBottom: 12,
  },
  pageComment: {
    fontSize: 14,
    lineHeight: 22,
    color: "gray",
    paddingBottom: 36,
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
    paddingBottom: 24,
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderColor: color.blue,
    borderRadius: 7,
    fontSize: 14,
    marginLeft: 32,
    marginBottom: 24,
  },
});
