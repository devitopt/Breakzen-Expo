import React, { useState, useEffect } from "react";
import {
  View, Text, Image, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Alert, Platform
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSelector, useDispatch } from "react-redux";
import { BackButton } from "../../components/backbutton";
import { SelectAttachment } from "../../components/SelectAttachment";
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from "expo-file-system";
import * as Location from 'expo-location';
// import RNFS from 'react-native-fs';
import {
  color,
  chatCollection,
  getMessageTime,
  messageType,
  defaultPhoto,
  breakzen,
  memberType,
} from "../../assets/stdafx";
import { FullButton } from "../../components/fullbutton";
import { BottomBar } from "./bottombar";
import { navName } from "../../navigation/Paths";
import { firestore, storage, functions } from "../../config/firebase";
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
  deleteObject,
} from "firebase/storage";
import { httpsCallable } from "firebase/functions";
import { addinfo } from "../../redux/actioncreators";
import { Loading } from "../../components/loading";
import MapView from 'react-native-maps';

export default function InsideChat({ route, navigation }) {
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch;
  const addInfo = (info) => dispatch(addinfo(info));

  const { otherid } = route.params;
  const collectionName = chatCollection(user.uid, otherid);
  const [scrollView, setScrollView] = useState(undefined);

  const [check, setCheck] = useState(false);
  const [accept, setAccept] = useState(false);
  const [msgs, setMsgs] = useState([]);

  const [bLoading, setLoading] = useState(false);
  const [attachShow, setAttachShow] = useState(false);
  const [attach, setAttach] = useState({
    type: '',
    name: '',
    uri: ''
  });

  const [otherData, setOtherData] = useState({
    photo: defaultPhoto[0],
    name: "",
    uid: breakzen.uid,
    token: "",
    chats: [],
    acceptCnt: 0
  });

  const sendNotification = httpsCallable(functions, 'sendNotification');

  let chatSubscribe = undefined;

  // There is an availability here to increase speed by fetching only new messages
  const fetchMessages = async () => {
    const q = query(
      collection(firestore, collectionName),
      orderBy("time", "asc")
    );
    const snapShot = await getDocs(q);
    setMsgs(snapShot.docs.map((x) => x.data()));
  };

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync();
    return location.coords;
  }

  const onSendMessage = async (txt) => {
    if (txt !== "" || attach.name != '') {
      const src = await uploadFile();
      const msgContent = {
        sender: user.uid,
        receiver: otherid,
        content: txt,
        time: new Date(),
        read: false,
      };

      if (attach.type == 'file') {
        msgContent['attachType'] = 'file';
        msgContent['attach'] = src;
        msgContent['attachName'] = attach.name;
      } else if (attach.type == 'location') {
        const coords = await getCurrentLocation();
        msgContent['attachType'] = 'location';
        msgContent['latitude'] = coords.latitude;
        msgContent['longitude'] = coords.longitude;
      }

      setAttach({
        type: '',
        name: '',
      })

      const collectionRef = collection(firestore, collectionName);
      addDoc(collectionRef, msgContent).then(() => {
        send(txt);
      });
      // scrollView.scrollToEnd({ animated: true });
      // fetchMessages();
    }
  };

  const onDownload = async (attach, attachName) => {
    setLoading(true);

    const downloadResumable = FileSystem.createDownloadResumable(
      attach,
      FileSystem.documentDirectory + attachName,
    );

    try {
      const { uri } = await downloadResumable.downloadAsync();
      console.log('Finished downloading to ', uri);
      console.log(FileSystem.documentDirectory + attachName);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  const onMapPress = (latitude, longitude) => {
    console.log(latitude, longitude);
    navigation.navigate({ name: navName.MapView, params: { latitude, longitude } });
  }

  const onAttach = () => {
    setAttachShow(true);
  }

  const onCancelAttach = () => {
    setAttach({
      type: '',
      name: '',
      uri: ''
    })
  }

  const getFile = async () => {
    let result = await DocumentPicker.getDocumentAsync();
    if (result.type == 'success') {
      const fileUri = result.uri;
      console.log(fileUri);
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (fileInfo.size > 10 * 1024 * 1024)
        alert("Please select the image less than 10MB");
      else {
        setAttach({
          type: 'file',
          name: result.name,
          uri: result.uri,
        })
      }
    }
  }

  const uploadFile = async () => {
    if (attach.type == 'file') {
      setLoading(true);
      const path = `${user.email}/${new Date().getTime()}`;
      const storageRef = ref(storage, path);
      const response = await fetch(attach.uri);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob);
      const src = await getDownloadURL(storageRef);
      setLoading(false);
      return src;
    } else
      return '';
  }

  const onDocument = () => {
    getFile();
    setAttachShow(false);
  }

  const onLocation = () => {
    setAttach({
      type: 'location',
      name: 'Your location attached',
    });
    setAttachShow(false);
  }

  const send = async (txt) => {
    const tokenArray = [{
      to: otherData.token,
      sound: "default",
      title: "Breakzen",
      body: txt,
      priority: "high",
    }]
    await sendNotification({
      tokenArray: tokenArray,
    })
  }

  const onAccept = async () => {

    if (user.professional && user.membership === memberType.general && user.acceptCnt && user.acceptCnt >= 8) {
      showAlert()
      return;
    }

    setAccept(true);
    const collectionRef = collection(firestore, collectionName);
    if (user.professional) {
      await addDoc(collectionRef, {
        sender: user.uid,
        receiver: otherid,
        content: `${user.name} has accepted ${otherData.name}`,
        time: new Date(),
        read: false,
        type: messageType.professionalAccept,
      });
      // scrollView.scrollToEnd({ animated: true });
      // fetchMessages();
    } else {
      await addDoc(collectionRef, {
        sender: user.uid,
        receiver: otherid,
        content: `${user.name} has accepted ${otherData.name}`,
        time: new Date(),
        read: false,
        type: messageType.clientAccept,
      });
      // scrollView.scrollToEnd({ animated: true });
      // fetchMessages();
    }
    if (user.membership == memberType.general) {
      const docRef = doc(firestore, "users", user.uid);
      const acceptCnt = user.acceptCnt ? user.acceptCnt : 0;
      const info = { acceptCnt: acceptCnt + 1 }
      updateDoc(docRef, info).then(() => {
        addinfo(info);
      })
    }

    send(`${user.name} has accepted ${otherData.name}`);
  };

  const showAlert = () => {
    Alert.alert(
      "Upgrade Plan",
      "You are exceeded the accept appointment limit. Please upgrade your plan to Pro",
      [
        {
          text: "Upgrade plan",
          onPress: () => {
            onUpgradePlan();
          },
        }, 
        {
          text: "Cancel"
        }
      ])
  }
  const onUpgradePlan = () => {
    navigation.navigate(navName.MainNavigator, {
      screen: navName.MySubscription      
    })
  }

  const onCancel = () => {
    return Alert.alert(
      "Confirm",
      "Are you sure you want to cancel appointment?",
      [
        {
          text: "Yes",
          onPress: () => {
            onCancelProcess();
          },
        },
        {
          text: "No"
        }
      ]
    );
  }

  const onCancelProcess = async () => {
    setAccept(false);
    const collectionRef = collection(firestore, collectionName);
    await addDoc(collectionRef, {
      sender: user.uid,
      receiver: otherid,
      content: `${user.name} has canceled ${otherData.name}`,
      time: new Date(),
      read: false,
      type: user.professional ? messageType.professionalCancel : messageType.clientCancel,
    });

    send(`${user.name} has canceled ${otherData.name}`);

    if (!user.professional && (otherData.membership && otherData.membership == memberType.general)) {
      const docRef = doc(firestore, "users", otherData.uid);
      const acceptCnt = otherData.acceptCnt ? otherData.acceptCnt : 0;
      if (acceptCnt > 0) {
        console.log(acceptCnt);
        const info = { acceptCnt: acceptCnt - 1 }
        await updateDoc(docRef, info).then(() => {
          addinfo(info);
        });
      }
    }

    const chats = user.chats;
    if (chats.includes(otherData.uid)) {
      const chat = chats.filter((x) => x != otherData.uid);
      const info = { chats: [...chat] };
      const docRef = doc(firestore, "users", user.uid);
      updateDoc(docRef, info).then(() => {
        addInfo(info);
      });
    }

    const otherchats = otherData.chats;
    if (otherchats.includes(user.uid)) {
      const chat = otherchats.filter((x) => x != user.uid);
      const info = { chats: [...chat] };
      const docRef = doc(firestore, "users", otherData.uid);
      updateDoc(docRef, info).then(() => {
      });
    }
    onBack();
    navigation.goBack();
  }

  // useEffect(async () => {
  //   if (user[otherid]) {
  //     fetchMessages();
  //     const q = query(
  //       collection(firestore, collectionName),
  //       where("receiver", "==", user.uid),
  //       where("read", "==", false)
  //     );
  //     const snapShot = await getDocs(q);
  //     snapShot.docs.map(async (data) => {
  //       const docRef = doc(firestore, collectionName, data.id);
  //       await updateDoc(docRef, { read: true });
  //     });
  //   }
  // }, [user]);

  useEffect(() => {
    console.log("Inside Chats");
    // fetchMessages();

    const q0 = query(
      collection(firestore, collectionName),
      orderBy("time", "asc")
    );
    chatSubscribe = onSnapshot(q0, (snapShot) => {
      if (snapShot) {
        setMsgs([...snapShot.docs.map((x) => x.data())]);
        // scrollView.scrollToEnd({animated: true});
        snapShot.docs
          .filter(
            (x) => x.data().receiver == user.uid && x.data().read == false
          )
          .map(async (x) => {
            const docRef = doc(firestore, collectionName, x.id);
            await updateDoc(docRef, { read: true });
          });
      }
    });

    if (user.professional) {
      const q = query(
        collection(firestore, collectionName),
        where("type", "==", messageType.checkAvailability)
      );
      getDocs(q).then((snapShot) => {
        if (snapShot.docs.length) setCheck(true);
      });

      const q2 = query(
        collection(firestore, collectionName),        
        where("type", "in", [messageType.professionalAccept, messageType.professionalCancel, messageType.checkAvailability])
      );
      getDocs(q2).then((messageShot) => {
        if (messageShot.docs.length > 0 ) {
          const array = messageShot.docs.sort((a,b) => (a.data().time - b.data().time));
          const lastItem = array[array.length-1].data();
          if (lastItem.type != messageType.professionalAccept || lastItem.type == messageType.check) setAccept(false);
          else setAccept(true);
        } 
      });
    } else {
      let checkLen = 0;
      const q = query(
        collection(firestore, collectionName),
        where("type", "==", messageType.jobpost)
      );
      getDocs(q).then((snapShot) => {
        if (snapShot.docs.length) {
          setCheck(true);
          checkLen = snapShot.docs.length;
        }
      });

      const q2 = query(
        collection(firestore, collectionName),
        where("type", "==", messageType.clientAccept)
      );
      getDocs(q2).then((messageShot) => {
        if (messageShot.docs.length < checkLen) setAccept(false);
      });
    }

    const docRef = doc(firestore, "users", otherid);
    getDoc(docRef).then((snapShot) => {
      const userData = snapShot.data();
      setOtherData({
        professional: userData.professional,
        photo: userData.photo ? userData.photo : defaultPhoto[0],
        name: userData.name,
        uid: otherid,
        token: userData.token,
        chats: userData.chats,
        acceptCnt: userData.acceptCnt,
        membership: userData.membership
      });
    });

    return () => {
      chatSubscribe();
      console.log("insidechats subscribe");
    };
  }, [route.params]);

  const onBack = () => {
    if (chatSubscribe) chatSubscribe();
    setOtherData({
      photo: defaultPhoto[0],
      name: "",
      uid: breakzen.uid,
      token: "",
      chats: [],
      acceptCnt: 0
    });
    setMsgs([]);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (user.chats.includes(otherid) == false) navigation.goBack();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (scrollView) scrollView.scrollToEnd({ animated: true });
  });

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <Header
          navigation={navigation}
          otherData={otherData}
          showAccept={check && !accept}
          onAccept={onAccept}
          onCancel={onCancel}
          onBack={onBack}
          online
        />
        <ScrollView
          ref={(view) => {
            setScrollView(view);
          }}
          style={{ flex: 1, marginTop: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {msgs.map((msg, index) =>
            msg.sender == user.uid ? (
              <ChatBoxB
                key={index}
                // message={msg.content}
                // time={getMessageTime(msg.time)}
                msg={msg}
                download={() => onDownload(msg.attach, msg.attachName)}
                onMapPress={() => onMapPress(msg.latitude, msg.longitude)}
              />
            ) : (
              <ChatBoxA
                key={index}
                src={otherData.photo}
                // message={msg.content}
                // time={getMessageTime(msg.time)}
                msg={msg}
                download={() => onDownload(msg.attach, msg.attachName)}
                onMapPress={() => onMapPress(msg.latitude, msg.longitude)}
              />
            )
          )}
        </ScrollView>
        {otherData.uid !== breakzen.uid && (
          <BottomBar onPress={(txt) => onSendMessage(txt)}
            onAttach={onAttach}
            onCancelAttach={onCancelAttach}
            attach={attach} />
        )}

      </KeyboardAvoidingView>
      {attachShow &&
        <SelectAttachment onDocument={onDocument}
          onLocation={onLocation}
          onCancel={() => setAttachShow(false)} />
      }
      {bLoading &&
        <Loading />
      }
    </View>
  );
}

function Header(props) {
  const { showAccept, onAccept, onCancel, otherData, navigation } = props;
  return (
    <View style={hstyle.container}>
      <View style={hstyle.backProfile}>
        <BackButton navigation={props.navigation} onPress={props.onBack} />
        <TouchableOpacity
          onPress={() => {
            if (otherData.uid !== breakzen.uid) {
              otherData.professional
                ? navigation.navigate(navName.Profile, {
                  userId: otherData.uid,
                })
                : navigation.navigate(navName.ProfileClient, {
                  userId: otherData.uid,
                });
            }
          }}
        >
          <View style={hstyle.profile}>
            <View style={hstyle.imageWrapper}>
              <Image style={hstyle.image} source={{ uri: otherData.photo }} />
              <View
                style={[
                  hstyle.onlineSymbol,
                  otherData.connected
                    ? { backgroundColor: "green" }
                    : { backgroundColor: "gray" },
                ]}
              />
            </View>
            <View style={hstyle.description}>
              <Text style={hstyle.name}>{otherData.name}</Text>
              <Text style={hstyle.state}>
                {props.online ? "Online" : "Offline"}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      {otherData.uid !== breakzen.uid && (
        showAccept ? (
          <View style={{ width: 80, justifyContent: "center" }}>
            <FullButton title="Accept" onPress={onAccept} />
          </View>
        ) : (
          <View style={{ width: 80, justifyContent: "center" }}>
            <FullButton title="Cancel" onPress={onCancel} />
          </View>
        )      
      )}
    </View>
  );
}

function ChatBoxA(props) {
  const msg = props.msg;
  return (
    <View style={cstyle.container}>
      <Image style={cstyle.photo} source={{ uri: props.src }} />
      <View style={cstyle.containerA}>
        <View style={[cstyle.wrapper, cstyle.wrapperA]}>
          {msg.content != '' &&
            <Text style={cstyle.message}>{msg.content}</Text>
          }
          {
            msg.attachType == 'file' ?
              <TouchableOpacity
                onPress={props.download}
              >
                <Text style={cstyle.attachUri}>{msg.attachName}</Text>
              </TouchableOpacity> :
              msg.attachType == 'location' ?
                <View style={cstyle.locationContainer}>
                  <TouchableOpacity
                    onPress={props.onMapPress}>
                    <MapView style={cstyle.location}
                      initialRegion={{
                        latitude: msg.latitude,
                        longitude: msg.longitude,
                        latitudeDelta: 0.0421,
                        longitudeDelta: 0.0421,
                      }}
                    />
                  </TouchableOpacity>
                </View>
                : <></>
          }
          <Text style={cstyle.time}>{getMessageTime(msg.time)}</Text>
        </View>
      </View>
    </View>
  );
}

function ChatBoxB(props) {
  const msg = props.msg;
  return (
    <View style={cstyle.container}>
      <View style={[cstyle.wrapper, { backgroundColor: color.blue }]}>
        {msg.content != '' &&
          <Text style={[cstyle.message, { color: "white" }]}>
            {msg.content}
          </Text>
        }
        {
          msg.attachType == 'file' ?
            <TouchableOpacity
              onPress={props.download}
            >
              <Text style={cstyle.attachUri}>{msg.attachName}</Text>
            </TouchableOpacity> :
            msg.attachType == 'location' ?
              <View style={cstyle.locationContainer}>
                <TouchableOpacity
                  onPress={props.onMapPress}>
                  <MapView style={cstyle.location}
                    initialRegion={{
                      latitude: msg.latitude,
                      longitude: msg.longitude,
                      latitudeDelta: 0.0421,
                      longitudeDelta: 0.0421,
                    }}
                  />
                </TouchableOpacity>
              </View>
              : <></>
        }
        <Text style={cstyle.time}>{getMessageTime(msg.time)}</Text>
      </View>
    </View>
  );
}

const hstyle = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 48,
    paddingBottom: 24,
    elevation: 10,
  },
  backProfile: {
    flexDirection: "row",
    alignItems: "center",
  },
  profile: {
    flexDirection: "row",
    marginLeft: 20,
    padding: 6,
  },
  imageWrapper: {
    width: 50,
    height: 50,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 50,
  },
  onlineSymbol: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 16,
    height: 16,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: "white",
  },
  description: {
    justifyContent: "space-evenly",
    paddingLeft: 16,
  },
  name: {
    fontSize: 14,
    fontWeight: "bold",
  },
  state: {
    fontSize: 11,
    color: "gray",
    fontWeight: "500",
  },
});

const cstyle = StyleSheet.create({
  time: {
    fontSize: 12,
    color: "gray",
    fontWeight: "500",
  },
  message: {
    fontSize: 13,
    lineHeight: 20,
    paddingBottom: 8,
  },
  photo: {
    width: 36,
    height: 36,
    borderRadius: 36,
    alignSelf: "flex-end",
  },
  wrapper: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  wrapperA: {
    marginLeft: 20,
    backgroundColor: color.backGray,
  },
  containerA: {
    flex: 1,
    flexDirection: "row",
  },
  container: {
    flexDirection: "row",
    marginBottom: 20,
  },
  attachUri: {
    color: 'blue',
    fontWeight: 'bold',
  },
  locationContainer: {
    width: 200,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
  },
  location: {
    width: '100%',
    height: '100%',
  }
});

const styles = StyleSheet.create({
  screen: {
    width: '100%',
    height: '100%',
  },
  container: {
    backgroundColor: "white",
    paddingHorizontal: 24,
    height: "100%",
  }
});
