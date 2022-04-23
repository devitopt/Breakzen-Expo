import React, { useState } from "react";
import {
  Text,
  Image,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
// import * as ImagePicker from 'react-native-image-picker';
//import RNFS from 'react-native-fs';
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useSelector, useDispatch } from "react-redux";
// import DatePicker from "react-native-date-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { addinfo } from "../../redux/actioncreators";
import { Loading } from "../../components/loading";
import { FullButton } from "../../components/fullbutton";
import { size, color, initalValue } from "../../assets/stdafx";
import { BackButton } from "../../components/backbutton";
import { firestore, storage } from "../../config/firebase";
import {
  doc,
  collection,
  getDoc,
  getDocs,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  where,
  updateDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  uploadString,
} from "firebase/storage";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Constants from "expo-constants";


export default function CreateSocialGroup({ navigation }) {
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const addInfo = (info) => dispatch(addinfo(info));

  const [bDateModal, setDateModal] = useState(false);
  const [bPublic, setPublic] = useState(true);
  const [bLoading, setLoading] = useState(false);
  const [groupImage, setGroupImage] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [limit, setLimit] = useState("");
  const [description, setDiscription] = useState("");

  const dateString = (date) => {
    if (date === "") return date;
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear() - 2000;
    return `${month > 9 ? month : `0${month}`}/${
      day > 9 ? day : `0${day}`
    }/${year}`;
  };

  const onCreateGroup = async () => {
    if (groupImage === "") {
      alert("Please select the image.");
    } else if (
      title === "" ||
      date === "" ||
      location === "" ||
      (!bPublic && limit === "") ||
      description === ""
    ) {
      alert("Please input all fields.");
    } else {
      setLoading(true);
      const path = `${user.email}/group${new Date().getTime()}`;
      const storateRef = ref(storage, path);
      const response = await fetch(groupImage);
      const blob = await response.blob();
      uploadBytes(storateRef, blob).then((snapShot) => {
        getDownloadURL(storateRef).then((imageUrl) => {
          const collectionRef = collection(firestore, "groups");
          addDoc(collectionRef, {
            title,
            limit,
            date: dateString(date),
            location,
            latitude,
            longitude,
            public: bPublic,
            description,
            image: { src: imageUrl, path },
            creator: user.uid,
            members: [],
            invites: [],
          }).then((docShot) => {
            const gInfo = {
              groups: [
                ...user.groups,
                { id: docShot.id, chattime: initalValue.groupTime },
              ],
              groupcnt: user.groupcnt + 1,
            };
            const docRef = doc(firestore, "users", user.uid);
            updateDoc(docRef, gInfo).then(() => {
              addInfo(gInfo);
              navigation.goBack();
              setLoading(false);
            });
          });
        });
      });
      // setLoading(false);
    }
  };

  const getFile = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.75,
    });

    if (!result.cancelled) {
      const fileUri = result.uri;
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      // if (fileInfo.size > 2 * 1024 * 1024)
      //   alert("Please select the image less than 2MB");
      // else 
      setGroupImage(fileUri);
    }
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDateModal(false);
    setDate(currentDate);
  };

  const onDateSelected = (selectedDate) => {
    const currentDate = selectedDate || date;
    setDateModal(false);
    setDate(currentDate);
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardShouldPersistTaps={'handled'}
    >
    <View style={{ width: "100%", height: "100%" }}>
      <View style={styles.container}>
        <View style={{ marginTop: 48, marginBottom: 36 }}>
          <BackButton navigation={navigation} />
        </View>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'} listViewDisplayed={false}>
          <Text style={styles.caption}>Create Social Group</Text>
          <Text style={styles.pageComment}>
            Enter the following details to create a new social group
          </Text>
          {groupImage ? (
            <View style={styles.imageContainer}>
              <TouchableOpacity onPress={getFile} useForeground>
                <View style={styles.imageWrapper}>
                  <Image
                    style={styles.image}
                    source={{ uri: `file://${groupImage}` }}
                  />
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={getFile} background={color.blue}>
              <View style={styles.selectBox}>
                <Text style={styles.selectTitle}>Group Image</Text>
                <Text style={styles.selectComment}>
                  Upload image for your group
                </Text>
                <Text style={styles.selectLimit}>Max Size 2.0 MB</Text>
              </View>
            </TouchableOpacity>
          )}
          <Text style={styles.title}> Social Group Name </Text>
          <TextInput
            style={styles.input}
            placeholder="Name of Group"
            value={title}
            onChangeText={setTitle}
          />
          
          <Text style={styles.title}> Date and Location </Text>
          <View style={styles.datelocation}>
            <View style={styles.date}>
              <TextInput
                style={styles.input}
                placeholder="mm/dd/yy"
                value={dateString(date)}
                editable={Platform.OS === 'ios' ? false : true}
                onPressIn={() => setDateModal(true)}
              />              
            </View>
            <View style={styles.location}>              
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
                      marginLeft: inputpl,
                      marginBottom: 24,
                    },
                    textInput: {
                      height: inputpl,
                      color: '#5d5d5d',
                      fontSize: 14,
                    }
                  }
                }
              />
            </View>
          </View>
          <Text style={styles.title}> Type of Group </Text>
          <View style={styles.limitContainer}>
            <LimitItem
              title="Public"
              active={bPublic}
              onPress={() => setPublic(true)}
            />
            <LimitItem
              title="Private"
              active={!bPublic}
              onPress={() => setPublic(false)}
            />
          </View>
          {!bPublic && (
            <View>
              <Text style={styles.title}> Participants Limit </Text>
              <TextInput
                style={styles.input}
                placeholder="350"
                value={limit}
                onChangeText={setLimit}
              />
            </View>
          )}
          <Text style={styles.title}> Group Description </Text>
          <TextInput
            style={styles.input}
            placeholder="Write a description of group."
            value={description}
            onChangeText={setDiscription}
            multiline
          />
          <View style={styles.fullButton}>
            <FullButton onPress={onCreateGroup} title="Create Group" />
          </View>
        </ScrollView>
      </View>
      {bDateModal && Platform.OS === 'android' && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date == "" ? new Date() : date}
          mode="date"
          is24Hour={true}            
          onChange={onChange}
        />        
      )}
      {bDateModal && Platform.OS === 'ios' && (
        <DateTimePickerModal
          isVisible={bDateModal}
          mode="date"
          date={date == "" ? new Date() : date}
          value={date == "" ? new Date() : date}
          onConfirm={onDateSelected}
          onCancel={() => setDateModal(false)}
        />       
      )}
      {bLoading && <Loading />}
    </View>
    </KeyboardAvoidingView>
  );
}

function LimitItem(props) {
  return (
    <View
      style={[
        {
          width: "47%",
          borderRadius: 7,
          overflow: "hidden",
        },
        props.active ? { backgroundColor: color.blue, color: "white" } : {},
      ]}
    >
      <TouchableOpacity onPress={props.onPress} background={color.blue}>
        <View
          style={{ paddingVertical: 12, width: "100%", alignItems: "center" }}
        >
          <Text style={props.active ? { color: "white" } : { color: "black" }}>
            {props.title}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const inputpl = 24;

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
    marginLeft: inputpl,
    marginBottom: 24,
  },
  datelocation: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  date: {
    width: "40%",
  },
  location: {
    width: "60%",
  },
  limitContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: inputpl,
    paddingBottom: 32,
  },
  imageContainer: {
    width: 140,
    height: 140,
    borderWidth: 1,
    borderRadius: 7,
    borderColor: "gray",
    borderStyle: "dashed",
    alignSelf: "center",
    marginBottom: 32,
  },
  imageWrapper: {
    width: "100%",
    height: "100%",
    padding: 10,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  selectBox: {
    borderWidth: 1,
    borderRadius: 1,
    borderColor: "gray",
    borderStyle: "dashed",
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 36,
  },
  selectTitle: {
    fontSize: 15,
    paddingBottom: 8,
  },
  selectComment: {
    color: "gray",
    fontSize: 11,
    paddingBottom: 24,
  },
  selectLimit: {
    color: color.blue,
    fontSize: 11,
  },
  fullButton: {
    paddingTop: 12,
    paddingBottom: size.screenpb,
  },
});
