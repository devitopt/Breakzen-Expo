import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Svg, Path, G, Circle } from "react-native-svg";
import { useSelector, useDispatch } from "react-redux";
import { TextInput } from "react-native-gesture-handler";
import { navName } from "../../navigation/Paths";
import {
  color,
  chatCollection,
  messageType,
  isEqualArray,
  memberType,
} from "../../assets/stdafx";
import { addinfo } from "../../redux/actioncreators";
import { InsideButton } from "./insidebutton";
import HeaderBack from "../../assets/svg/header-back.png";
import Blur from "../../assets/svg/blur.png";
import { firestore } from "../../config/firebase";
import {
  doc,
  collection,
  getDoc,
  getDocs,
  addDoc,
  onSnapshot,
  query,
  limit,
  where,
  updateDoc
} from "firebase/firestore";
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { useRef } from "react";
import Constants from 'expo-constants';

const dayType = {
  Today: 1,
  Next: 2,
  Before: 3,
};

export default function HomeProfessional({ navigation }) {

  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const addInfo = (info) => dispatch(addinfo(info));

  let chatFirstCall = true;
  let chatSubscribe = undefined;
  let individualSubcscribe = [];
  let groupFirstCall = true;
  let groupSubscribe = [];

  const [todays, setTodays] = useState([]);
  const [nexts, setNexts] = useState([]);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldShowAlert: true,
      shouldSetBadge: false
    }),
  });

  const analyse = async (content, otherid) => {
    const time = content.split("\n")[1];
    const date = time.split(" ")[0].split("/");

    const year = date[2];
    const month = date[0];
    const day = date[1];

    const today = new Date();

    if (
      (today.getFullYear() !== year ||
        today.getMonth() + 1 !== month ||
        today.getDate() !== day) &&
      new Date(year, month - 1, day) < today
    )
      return { today: dayType.Before };

    const docRef = doc(firestore, "users", otherid);
    const docSnap = await getDoc(docRef);

    const userData = docSnap.data();
    return {
      today: dayType.Today,
      otherid,
      name: userData.name,
      location: userData.location,
      photo: userData.photo,
      time,
    };
  };

  const onAccept = async (today) => {
    if (user.membership === memberType.general && user.acceptCnt && user.acceptCnt >= 8) {
      showAlert()
      return;
    }
    await addDoc(
      collection(firestore, chatCollection(user.uid, today.otherid)),
      {
        sender: user.uid,
        receiver: today.otherid,
        content: `${user.name} has accepted ${today.name}`,
        time: new Date(),
        read: false,
        type: messageType.professionalAccept,
      }
    );
    const array = todays;
    const index = array.findIndex((x) => x.otherid === today.otherid);
    array.splice(index, 1);
    setTodays([...array]);
    setNexts([...nexts, today]);
    if (user.membership == memberType.general) {
      const docRef = doc(firestore, "users", user.uid);
      const acceptCnt = user.acceptCnt ? user.acceptCnt : 0;
      const info = { acceptCnt: acceptCnt+1 }
      updateDoc(docRef, info).then(() => {
        addinfo(info);
      })
    }
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
  const onDecline = async (next, reasonText) => {

    await addDoc(
      collection(firestore, chatCollection(user.uid, next.otherid)),
      {
        sender: user.uid,
        receiver: next.otherid,
        content: `${user.name} has cancelled appointment with ${next.name}\n${reasonText}`,
        time: new Date(),
        read: false,
        type: messageType.professionalDecline,
      }
    );
    const array = nexts;
    const index = array.findIndex((x) => x.otherid === next.otherid);
    array.splice(index, 1);
    setNexts([...array]);
  };

  const getMessageNotification = () => {
    chatSubscribe = onSnapshot(
      doc(firestore, "users", user.uid),
      (snapShot) => {
        if (snapShot) {
          const userData = snapShot.data();
          const chats = userData.chats;
          if (isEqualArray(chats, user.chats) == false || chatFirstCall) {
            chatFirstCall = false;
            individualSubcscribe.map((subscribe) => subscribe());
            individualSubcscribe = [];
            addInfo({ chats });
            chats.map((otherid) => {
              const q = query(
                collection(firestore, chatCollection(user.uid, otherid)),
                where("receiver", "==", user.uid),
                where("read", "==", false)
              );
              individualSubcscribe.push(
                onSnapshot(q, (chatSnapShot) => {
                  if (chatSnapShot) {
                    const info = {};
                    info[otherid] = chatSnapShot.docs.length;
                    addInfo(info);
                  }
                })
              );
            });
          }
          const groups = userData.groups;
          if (isEqualArray(groups, user.groups) == false || groupFirstCall) {
            groupFirstCall = false;
            groupSubscribe.map((subscribe) => subscribe());
            groupSubscribe = [];
            addInfo({ groups });
            groups.map((group) => {
              const q = query(
                collection(firestore, "groupchat" + group.id),
                where("time", ">", group.chattime),
                limit(1)
              );
              groupSubscribe.push(
                onSnapshot(q, (snapShot) => {
                  if (snapShot) {
                    const info = {};
                    info[group.id] = Number(snapShot.docs.length > 0);
                    addInfo(info);
                  }
                })
              );
            });
          }
        }
      }
    );
  };

  const subscribeMsgNotification = () => {
    chatSubscribe();
    individualSubcscribe.map((subscribe) => subscribe());
    individualSubcscribe = [];

    groupSubscribe.map((subscribe) => subscribe());
    groupSubscribe = [];
  };

  const getAppointments = () => {
    const todayArray = [];
    const nextArray = [];
    user.chats.map(async (chat) => {
      const q = query(
        collection(firestore, chatCollection(user.uid, chat)),
        where("type", "==", messageType.checkAvailability)
      );
      const chatData = getDocs(q);
      const checkCnt = (await chatData).docs.length;
      if (checkCnt) {
        const data = (await chatData).docs[checkCnt - 1].data();
        const snapShot = await analyse(data.content, data.sender);
        if (snapShot.today != dayType.Before) {
          const q2 = query(
            collection(firestore, chatCollection(user.uid, chat)),
            where("type", "==", messageType.professionalDecline)
          );
          const decShot = getDocs(q2);
          const decCnt = (await decShot).docs.length;
          if (decCnt < checkCnt) {
            const q3 = query(
              collection(firestore, chatCollection(user.uid, chat)),
              where("type", "==", messageType.professionalAccept)
            );
            const acceptShot = getDocs(q3);
            const acceptCnt = (await acceptShot).docs.length;
            if (acceptCnt >= checkCnt) {
              nextArray.push({ ...snapShot });
              setNexts([...nextArray]);
              setTodays([...todayArray]);
            } else {
              todayArray.push({ ...snapShot });
              setTodays([...todayArray]);
              setNexts([...nextArray]);
            }
          }
        }
      }
    });
  };

  const requestPermissions = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }
    
    let location = await Location.getCurrentPositionAsync({
      timeInterval: 1000 * 20,
    });
    setLocation(location);

    let backPerm = await Location.requestBackgroundPermissionsAsync();
    console.log(backPerm);
  };

  const updateLocation = async () => {
    if (errorMsg) {
      alert(errorMsg);
    } else if (location) {
      const currentlocation = { latitude: location.coords.latitude, longitude: location.coords.longitude }
      const docRef = doc(firestore, "users", user.uid);
      await updateDoc(docRef, { currentlocation } ).then(() => {
       addInfo({ currentlocation });
      });
    } 
  }

  const registerForPushNotificationsAsync = async () => {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        sound: 'notification.wav',
      });
    }
  
    return token;
  }

  const addUsertoken = async () => {
    
    if (user && expoPushToken) {      
      const docRef = doc(firestore, "users", user.uid);
      await updateDoc(docRef, { token: expoPushToken } ).then(() => {
        addInfo({ token: expoPushToken });
      });      
    }
  }
  
  useEffect(() => {
    updateLocation();
  }, [location]);

  useEffect(() => {
    requestPermissions();
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
    });
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    Notifications.setNotificationChannelAsync('chats', {
      name: 'Chat Notifications',
      sound: 'notification.wav'
    });  

    getAppointments();
    getMessageNotification();
    return () => {
      subscribeMsgNotification();
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    addUsertoken();
  }, [expoPushToken])
  
  return (
    <View style={{ width: "100%", height: "100%", backgroundColor: "white" }}>
      <HomeHeader
        navigation={navigation}
        userId={user.uid}
        userName={user.name}
        userPhoto={user.photo}
        userService={user.service}
        userStar={user.star}
        userReviews={user && user.reviews ? user.reviews.length : 0}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* <PaymentUi /> */}

        <Text style={styles.title}>Your Appointments</Text>
        <ScrollView
          style={styles.todayList}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {todays.map((today, index) => (
            // <View style={styles.today} key={index}></View>
            <TodayItem
              key={index}
              data={today}
              onPress={() => onAccept(today)}
            />
          ))}
          {todays.length === 0 && (
            <Text style={styles.noAppointment}>
              You don't have any appointment today.
            </Text>
          )}
        </ScrollView>
        {nexts.length > 0 && (
          <Text style={styles.title}>Next Appointments</Text>
        )}
        {nexts.map((next, index) => (
          <NextItem
            key={index}
            data={next}
            onMessage={() =>
              // navigation.navigate(navName.InsideChat, { otherid: next.otherid })
              navigation.navigate(navName.MainNavigator, {
                screen: navName.InsideChat,
                params: { otherid: next.otherid },
              })
            }
            onDecline={(reasonText) => onDecline(next, reasonText)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function HomeHeader(props) {
  const {
    navigation,
    userId,
    userName,
    userPhoto,
    userService,
    userStar,
    userReviews,
  } = props;
  return (
    <View>
      <ImageBackground style={headerStyle.container} source={HeaderBack}>
        <View style={headerStyle.headerContainer}>
          <View style={headerStyle.userContainer}>
            <View style={{ justifyContent: "space-evenly" }}>
              <Text style={headerStyle.title}>Welcome {" " + userName}</Text>
              <Text style={headerStyle.comment}>
                to the Wellness Community!
              </Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(navName.MainNavigator, {
                  screen: navName.Profile,
                  params: { userId },
                })
              }
              // onPress={() => navigation.navigate(navName.Profile, { userId })}
              // background={(color.blue)}
              useForeground
            >
              <View style={headerStyle.imageWrapper}>
                <Image style={headerStyle.image} source={{ uri: userPhoto }} />
              </View>
            </TouchableOpacity>
          </View>
          <View style={headerStyle.viewInfo}>
            <Text style={headerStyle.userService}>{userService}</Text>
            <View style={headerStyle.viewReview}>
              <Svg_Star />
              <Text style={headerStyle.userStar}>{userStar.toFixed(1)}</Text>
              <Text style={{ color: "white" }}>|</Text>
              <Text style={headerStyle.userReview}>{userReviews} Reviews</Text>
            </View>
          </View>
          <Text />
        </View>
      </ImageBackground>
    </View>
  );
}

function TodayItem(props) {
  const { name, time, location, photo } = props.data;
  return (
    <View style={tstyle.container}>
      <View style={tstyle.header}>
        <Text style={tstyle.requestTime}>Appointment Request</Text>
        <View style={tstyle.timeView}>
          <Svg_Clock />
          <Text style={tstyle.time}>{time}</Text>
        </View>
      </View>
      <View style={tstyle.content}>
        <View style={tstyle.infoView}>
          <Image style={tstyle.photo} source={{ uri: photo }} />
          <View style={tstyle.userInfo}>
            <Text style={tstyle.name}>{name}</Text>
            <View style={tstyle.locationView}>
              <Svg_Location />
              <Text style={tstyle.location}>{location}</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={tstyle.buttonView}>
        <View style={tstyle.buttonWrapper}>
          <InsideButton title="Accept" onPress={props.onPress} ok />
        </View>
        <View style={tstyle.buttonWrapper}>
          <InsideButton title="Decline" />
        </View>
      </View>
    </View>
  );
}

function NextButton(props) {
  return (
    <View
      style={[
        nstyle.buttonView,
        props.cancel && { backgroundColor: "white", borderColor: "gray" },
      ]}
    >
      <TouchableOpacity
        background={props.cancel ? color.blue : "gray"}
        onPress={props.onPress}
      >
        <View style={nstyle.buttonWrapper}>
          <Text style={[nstyle.buttonText, props.cancel && { color: "black" }]}>
            {props.title}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

function NextItem(props) {
  const { time, photo, name, location } = props.data;
  const { onDecline } = props;
  const [menu, setMenu] = useState(false);
  const [decline, setDecline] = useState(false);
  const [reasonText, setReason] = useState("");
  return (
    <View style={[nstyle.tView, menu && decline && { height: 150 }]}>
      <TouchableOpacity onPress={props.onMessage} background={color.blue}>
        <View style={nstyle.container}>
          <TouchableOpacity
            useForeground
            onPress={() => {
              setMenu(true);
            }}
          >
            <View style={nstyle.tImage}>
              <Image style={nstyle.photo} source={{ uri: photo }} />
            </View>
          </TouchableOpacity>
          <View style={nstyle.infoView}>
            <Text style={nstyle.name}>{name}</Text>
            <Text style={nstyle.time}>{time}</Text>
            <Text style={nstyle.location}>{location}</Text>
          </View>
        </View>
      </TouchableOpacity>
      {menu && (
        <ImageBackground
          source={Blur}
          style={[nstyle.menuContainer, decline && { opacity: 1 }]}
        >
          {!decline ? (
            <View>
              <Text style={nstyle.cancelTitle}>Cancelling Appointment?</Text>
              <View style={nstyle.cancelButtonView}>
                <NextButton title="Yes" onPress={() => setDecline(true)} />
                <NextButton title="No" cancel onPress={() => setMenu(false)} />
              </View>
            </View>
          ) : (
            <View>
              <Text style={[nstyle.cancelTitle, { fontSize: 14 }]}>
                Why are you cancelling this appointment?
              </Text>
              <TextInput
                text={reasonText}
                onChangeText={setReason}
                style={nstyle.input}
                placeholder="Notify your client here..."
                multiline
              />
              <View style={[nstyle.cancelButtonView, { width: "80%" }]}>
                <NextButton
                  title="Summit"
                  onPress={() => {
                    onDecline(reasonText);
                    setMenu(false);
                    setDecline(false);
                  }}
                />
                <NextButton
                  title="Cancel"
                  cancel
                  onPress={() => {
                    setMenu(false);
                    setDecline(false);
                  }}
                />
              </View>
            </View>
          )}
        </ImageBackground>
      )}
    </View>
  );
}

function Svg_Star() {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 9.944 9.529"
    >
      <Path
        id="star_10_"
        data-name="star (10)"
        d="M9.918,4.092a.527.527,0,0,0-.455-.363l-2.87-.261L5.458.812a.528.528,0,0,0-.972,0L3.351,3.468l-2.87.261a.529.529,0,0,0-.3.925l2.169,1.9L1.71,9.374a.528.528,0,0,0,.786.571l2.476-1.48,2.475,1.48a.528.528,0,0,0,.786-.571l-.64-2.818,2.169-1.9a.529.529,0,0,0,.155-.562Zm0,0"
        transform="translate(0 -0.491)"
        fill="#ffc107"
      />
    </Svg>
  );
}

function Svg_Clock() {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      viewBox="0 0 15 15"
    >
      <G id="Icon" transform="translate(1.193 1.035)">
        <Circle
          id="Oval"
          cx="6.5"
          cy="6.5"
          r="6.5"
          transform="translate(-0.193 -0.035)"
          fill="none"
          stroke="#fff"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-miterlimit="10"
          stroke-width="2"
        />
        <Path
          id="Shape"
          d="M0,0V3.9L1.949,5.848"
          transform="translate(6.497 2.599)"
          fill="none"
          stroke="#fff"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-miterlimit="10"
          stroke-width="2"
        />
      </G>
    </Svg>
  );
}

function Svg_Location() {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      height="12"
      viewBox="0 0 8.442 10.096"
    >
      <G id="Icon" transform="translate(0.5 0.5)">
        <Path
          id="Shape"
          d="M7.442,3.721C7.442,6.616,3.721,9.1,3.721,9.1S0,6.616,0,3.721a3.721,3.721,0,0,1,7.442,0Z"
          transform="translate(0 0)"
          fill="#457afe"
          stroke="#457afe"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-miterlimit="10"
          stroke-width="1"
        />
        <Circle
          id="Oval"
          cx="1.24"
          cy="1.24"
          r="1.24"
          transform="translate(2.481 2.481)"
          fill="#fff"
          stroke="#fff"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-miterlimit="10"
          stroke-width="1"
        />
      </G>
    </Svg>
  );
}

const screenpx = 28;

const headerStyle = StyleSheet.create({
  container: {
    width: "100%",
    height: 224,
  },
  headerContainer: {
    width: "100%",
    height: "100%",
    paddingHorizontal: screenpx,
    paddingTop: 48,
  },
  userContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
  },
  comment: {
    fontSize: 11,
    color: "white",
  },
  imageWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    // height: undefined,
    // aspectRatio: 32 / 38,
  },
  viewInfo: {
    alignSelf: "flex-end",
  },
  viewReview: {
    flexDirection: "row",
    alignItems: "center",
  },
  userService: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "right",
    paddingBottom: 6,
  },
  userStar: {
    paddingLeft: 6,
    paddingRight: 8,
    fontSize: 12,
  },
  userReview: {
    paddingLeft: 8,
    color: "white",
    fontSize: 12,
  },
});

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    marginTop: -24,
    borderRadius: 24,
    backgroundColor: "white",
    paddingHorizontal: screenpx,
    // paddingTop: 24,
  },
  professionalList: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  professional: {
    width: "47%",
    height: undefined,
    marginBottom: 18,
    aspectRatio: 15 / 18,
  },
  title: {
    fontSize: 14,
    color: "black",
    fontWeight: "bold",
    marginBottom: 24,
    marginTop: 24,
  },
  todayList: {
    flexDirection: "row",
  },
  noAppointment: {
    color: "gray",
    paddingLeft: 32,
    marginBottom: 16,
  },
});

const tstyle = StyleSheet.create({
  container: {
    width: 300,
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: color.gray,
    marginHorizontal: 12,
  },
  header: {
    backgroundColor: color.blue,
    height: 72,
    paddingLeft: 24,
    justifyContent: "center",
  },
  requestTime: {
    color: "#FFFFFFA0",
    fontSize: 12,
    paddingBottom: 6,
  },
  timeView: {
    flexDirection: "row",
    alignItems: "center",
  },
  time: {
    paddingLeft: 8,
    color: "white",
    fontSize: 12,
  },
  content: {
    paddingLeft: 24,
    paddingTop: 16,
  },
  infoView: {
    flexDirection: "row",
  },
  photo: {
    width: 42,
    height: 42,
    borderRadius: 8,
  },
  userInfo: {
    paddingLeft: 12,
    justifyContent: "space-around",
  },
  name: {
    fontSize: 12,
  },
  locationView: {
    flexDirection: "row",
    alignItems: "center",
  },
  location: {
    fontSize: 12,
    paddingLeft: 6,
  },
  buttonView: {
    flexDirection: "row",
    marginTop: 24,
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  buttonWrapper: {
    width: "48%",
  },
});

const nstyle = StyleSheet.create({
  tView: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: color.gray,
    overflow: "hidden",
    marginBottom: 16,
  },
  container: {
    width: "100%",
    padding: 12,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  menuContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0.9,
  },
  tImage: {
    borderRadius: 12,
    overflow: "hidden",
  },
  cancelTitle: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    paddingTop: 12,
    paddingBottom: 12,
    paddingRight: 12,
  },
  decLineView: {
    flexDirection: "row",
    padding: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    fontSize: 12,
    paddingHorizontal: 12,
    marginHorizontal: 24,
    borderRadius: 8,
    height: 48,
    marginBottom: 12,
  },
  cancelButtonView: {
    flexDirection: "row",
    width: "70%",
    alignSelf: "center",
    justifyContent: "space-around",
  },
  buttonView: {
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    backgroundColor: color.blue,
    borderColor: "white",
  },
  buttonWrapper: {
    paddingVertical: 4,
    paddingHorizontal: 32,
  },
  buttonText: {
    fontWeight: "bold",
    color: "white",
  },
  photo: {
    width: 64,
    height: 64,
    borderRadius: 12,
  },
  infoView: {
    paddingLeft: 12,
    justifyContent: "space-around",
  },
  name: {
    fontSize: 13,
  },
  time: {
    fontSize: 13,
    color: "gray",
  },
  location: {
    fontSize: 13,
    color: "gray",
  },
});
