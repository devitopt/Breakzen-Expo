import React, { useState } from "react";
import {
  Text,
  View,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useSelector, useDispatch } from "react-redux";
import { Svg, G, Path } from "react-native-svg";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { ModalButton } from "../../components/modalbutton";
import { addinfo } from "../../redux/actioncreators";
import { FullButton } from "../../components/fullbutton";
import { size, color } from "../../assets/stdafx";
import { BackButton } from "../../components/backbutton";
import { Loading } from "../../components/loading";
import { firestore, storage } from "../../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { KeyboardAvoidingView } from "react-native";
import Constants from 'expo-constants';
export default function EditProfileInfo2({ navigation }) {
  const user = useSelector((state) => state.user);

  const [bLoading, setLoading] = useState(false);
  const [bModal, setModal] = useState(false);
  const [userImage, setUserImage] = useState("");
  const [aboutMe, setAboutMe] = useState(user.aboutme);
  const [goals, setGoals] = useState(user.goals);
  const [location, setLocation] = useState(user.location);

  const dispatch = useDispatch();
  const addInfo = (info) => dispatch(addinfo(info));

  const getFile = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      const fileUri = result.uri;
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      // if (fileInfo.size > 2 * 1024 * 1024)
      //   alert("Please select the image less than 2MB");
      // else 
      setUserImage(fileUri);
    }
  };

  const savePhoto = async () => {
    const storageRef = ref(storage, `${user.email}/photo`);
    const response = await fetch(userImage);
    const blob = await response.blob();
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  };

  const saveUserInfo = (imageUrl) => {
    const info = {
      aboutme: aboutMe,
      goals: [...goals],
      location,
      photo: imageUrl,
    };
    const docRef = doc(firestore, 'users', user.uid);
    updateDoc(docRef, info).then(()=>{
      setLoading(false);
      addInfo(info);
      navigation.goBack();
    })
  };

  const onSave = async () => {
    setLoading(true);

    if (userImage === "") {
      saveUserInfo(user.photo);
    } else {
      await savePhoto().then((imageUrl) => {
        saveUserInfo(imageUrl);
      });
    }
  };

  const removeGoal = (index) => {
    const array = [...goals];
    array.splice(index, 1);
    setGoals([...array]);
  };

  const onAddGoals = () => {
    setModal(true);
  };

  const onModalOk = (param) => {
    setModal(false);
    setGoals([...goals, param]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardShouldPersistTaps={'handled'}
    >    
      <View style={styles.screen}>
        <View style={styles.container}>
          <View style={{ marginTop: 48, marginBottom: 36 }}>
            <BackButton navigation={navigation} />
          </View>
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'}>
            <Text style={styles.caption}>My Profile</Text>
            <Text style={styles.pageComment}>
              Edit & confirm changes for your profile
            </Text>
            <View style={styles.imageContainer}>
              <TouchableOpacity onPress={getFile} useForeground>
                <View style={styles.imageWrapper}>
                  <Image
                    style={styles.image}
                    source={
                      userImage === ""
                        ? { uri: user.photo }
                        : { uri: `file://${userImage}` }
                    }
                  />
                </View>
              </TouchableOpacity>
            </View>
            <Text style={styles.title}> About Me </Text>
            <TextInput
              style={styles.input}
              value={aboutMe}
              onChangeText={setAboutMe}
              placeholder="Write a description about yourself"
              multiline
            />
            <Text style={styles.title}> My Goals </Text>
            <View style={styles.itemsContainer}>
              {goals.map((element, index) => (
                <TouchableOpacity useForeground onPress={() => removeGoal(index)}>
                  <View style={styles.item}>
                    <Text key={index}>{element}</Text>
                  </View>
                </TouchableOpacity>
              ))}
              <TouchableOpacity onPress={onAddGoals}>
                <View style={styles.item}>
                  <Svg_Add />
                </View>
              </TouchableOpacity>
            </View>
            <Text style={styles.title}> My Location </Text>
            <GooglePlacesAutocomplete
              ref={ref}
              placeholder="Search Address"
              fetchDetails={true}
              keyboardShouldPersistTaps={'handled'}            
              listViewDisplayed={false}
              enablePoweredByContainer={false}                
              onPress={(data, details = null) => {  
                setLocation(data.description);
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
                    height: 24,
                    color: '#5d5d5d',
                    fontSize: 14,
                  }
                }
              }
            />
            <View style={{ paddingTop: 24, paddingBottom: size.screenpb }}>
              <FullButton onPress={onSave} title="Confirm & Save" />
            </View>
          </ScrollView>
        </View>

        {bModal && (
          <SelectModal
            onCancel={() => setModal(false)}
            onOk={(param) => onModalOk(param)}
          />
        )}

        {bLoading && <Loading />}
      </View>
    </KeyboardAvoidingView>
  );
}

const inputpl = 24;

function SelectModal(props) {
  const [item, setItem] = useState("");

  const { onOk } = props;
  const { onCancel } = props;

  return (
    <View style={mstyle.container}>
      <View style={mstyle.modal}>
        <Text style={styles.title}>Your new Goal</Text>
        <TextInput
          style={styles.input}
          value={item}
          onChangeText={setItem}
          placeholder="goal"
        />
        <View style={mstyle.buttonContainer}>
          <View style={mstyle.buttonWrapper}>
            <ModalButton onPress={() => onOk(item)} title="Ok" ok />
          </View>
          <View style={mstyle.buttonWrapper}>
            <ModalButton onPress={onCancel} title="Cancel" />
          </View>
        </View>
      </View>
    </View>
  );
}

function Svg_Add() {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="16.291"
      height="16.291"
      viewBox="0 0 16.291 16.291"
    >
      <G id="plus-sign" transform="translate(-0.006)">
        <Path
          id="Path_34158"
          data-name="Path 34158"
          d="M16.3,8.146a1.426,1.426,0,0,1-1.426,1.426H9.577v5.294a1.425,1.425,0,1,1-2.851,0V9.571H1.431a1.425,1.425,0,0,1,0-2.851H6.726V1.426a1.426,1.426,0,0,1,2.851,0V6.72h5.295A1.426,1.426,0,0,1,16.3,8.146Z"
          transform="translate(0 0)"
          fill="#7dbdef"
        />
      </G>
    </Svg>
  );
}

const screenpx = 28;

const styles = StyleSheet.create({
  screen: {
    width: "100%",
    height: "100%",
  },
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
    borderRadius: 7,
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
    marginLeft: 24,
    marginBottom: 24,
  },
  itemsContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    paddingLeft: 12,
    marginBottom: 18,
  },
  item: {
    marginHorizontal: 12,
    paddingHorizontal: 12,
    marginVertical: 8,
    paddingVertical: 6,
    backgroundColor: "#ECECEC",
    borderRadius: 6,
  },
});

const mstyle = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    position: "absolute",
    backgroundColor: "#00000064",
    justifyContent: "center",
    paddingHorizontal: screenpx,
  },
  modal: {
    width: "100%",
    borderRadius: 16,
    backgroundColor: "white",
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonWrapper: {
    width: "45%",
  },
});
