import React, { useState } from "react";
import {
  Text,
  Image,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
// import RNFS from 'react-native-fs';
// import * as ImagePicker from "react-native-image-picker";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Svg, G, Path } from "react-native-svg";
import { useSelector, useDispatch } from "react-redux";
import { BackButton } from "../../components/backbutton";
import { size, color } from "../../assets/stdafx";
import { FullButton } from "../../components/fullbutton";
import { navName } from "../../navigation/Paths";
import { addinfo } from "../../redux/actioncreators";
import { Loading } from "../../components/loading";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { firestore, storage } from "../../config/firebase";

export default function MyGallery({ navigation }) {
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const addInfo = (info) => dispatch(addinfo(info));

  const [bLoading, setLoading] = useState(false);
  const [cur, setCur] = useState(-1);

  const putFile = async (filePath) => {
    setLoading(true);
    const path = `${user.email}/${new Date().getTime()}`;
    const storageRef = ref(storage, path);
    const response = await fetch(filePath);
    const blob = await response.blob();
    await uploadBytes(storageRef, blob);
    const src = await getDownloadURL(storageRef);

    const docRef = doc(firestore, "users", user.uid);
    const info = { gallery: [...user.gallery, { src, path }] };
    addInfo(info);
    setLoading(false);
    await updateDoc(docRef, info);
  };

  const onDelete = async (index) => {
    setCur(-1);
    setLoading(true);
    const array = user.gallery;
    const storageRef = ref(storage, array[index].path);
    deleteObject(storageRef).then(() => {
      array.splice(index, 1);
      const docRef = doc(firestore, "users", user.uid);
      updateDoc(docRef, { gallery: [...array] }).then(() => {
        addInfo({ gallery: [...array] });
      });
    });
    setLoading(false);
  };

  const getFile = async () => {
    
    if (user.gallery.length >= 5) {
      alert("You can add max 5 photos in your gallery");
      return;
    }
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
      putFile(fileUri);
    }

    setCur(-1);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <View style={{ marginTop: 48, marginBottom: 36 }}>
          <BackButton navigation={navigation} />
        </View>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <Text style={styles.caption}>My Gallery</Text>
          <Text style={styles.pageComment}>Add new images to your profile</Text>
          <View style={styles.imageList}>
            <View style={styles.imageWrapper}>
              <TouchableOpacity onPress={getFile} background={color.blue}>
                <View style={styles.tImageWrapper}>
                  <Svg_Plus />
                </View>
              </TouchableOpacity>
            </View>
            {user.gallery.map((image, index) => (
              <View style={styles.imageWrapper}>
                <TouchableOpacity
                  key={index}
                  onPress={() => (cur === index ? setCur(-1) : setCur(index))}
                  background={color.blue}
                  useForeground
                >
                  <View>
                    <Image style={styles.image} source={{ uri: image.src }} />
                    {cur === index && (
                      <View style={styles.deleteWrapper}>
                        <View style={styles.deleteView}>
                          <TouchableOpacity onPress={() => onDelete(index)}>
                            <View>
                              <Text style={styles.deleteText}>X</Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
        <View style={{ paddingTop: 12, paddingBottom: size.screenpb }}>
          <FullButton
            onPress={() => {
              navigation.goBack();
            }}
            title="Back to Profile"
          />
        </View>
      </View>
      {bLoading && <Loading />}
    </View>
  );
}

function Svg_Plus() {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="29.14"
      height="29.141"
      viewBox="0 0 29.14 29.141"
    >
      <G id="plus-sign" transform="translate(0.994 1)">
        <Path
          id="Path_34158"
          data-name="Path 34158"
          d="M27.146,13.571a2.375,2.375,0,0,1-2.376,2.375h-8.82v8.82a2.375,2.375,0,1,1-4.75,0V15.945H2.38a2.375,2.375,0,0,1,0-4.75H11.2V2.375a2.375,2.375,0,0,1,4.75,0V11.2h8.821A2.375,2.375,0,0,1,27.146,13.571Z"
          transform="translate(0 0)"
          fill="#7dbdef"
        />
      </G>
    </Svg>
  );
}

const styles = StyleSheet.create({
  screen: {
    width: "100%",
    height: "100%",
  },
  container: {
    width: "100%",
    height: "100%",
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
  imageList: {
    flexDirection: "row",
    justifyContent: "flex-start",
    flexWrap: "wrap",
  },
  tImageWrapper: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "gray",
    borderStyle: "dashed",
  },
  imageWrapper: {
    width: "29.3%",
    height: undefined,
    borderRadius: 12,
    overflow: "hidden",
    aspectRatio: 1 / 1,
    margin: "2%",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  deleteWrapper: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#7DBDEF96",
  },
  deleteView: {
    position: "absolute",
    right: 6,
    top: 5,
    borderRadius: 12,
    overflow: "hidden",
  },
  deleteText: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
