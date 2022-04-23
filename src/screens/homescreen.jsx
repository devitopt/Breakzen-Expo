import React, { useEffect, useState, useContext } from "react";
import {
  Text,
  View,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Svg, Path } from "react-native-svg";
import { useSelector, useDispatch } from "react-redux";
import { firestore } from "../config/firebase";
import { navName } from "../navigation/Paths";
import { FullButton } from "../components/fullbutton";
import { PhotofoliaV } from "../components/photofoliav";
import {
  color,
  buttonType,
  serviceType,
  memberType,
  googleMapApi,
  chatCollection,
  messageType,
  isEqualArray,
} from "../assets/stdafx";
import { addinfo } from "../redux/actioncreators";
import HeaderBack from "../assets/svg/header-back.png";
import PersonalTrainers from "../assets/trainer/coach.jpg";
import HolisticHealers from "../assets/trainer/holistic.jpg";
import Massage from "../assets/trainer/massage.jpg";
import Nutrition from "../assets/trainer/nutrition.jpg";
import {
  doc,
  collection,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  onSnapshot,
  query,
  limit,
  where,
} from "firebase/firestore";
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { useRef } from "react";
import Constants from 'expo-constants';

export default function HomeScreen({ navigation }) {
  console.log("HomeScreen");
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const addInfo = (info) => dispatch(addinfo(info));

  const default_url = `${googleMapApi}&origins=${user.location}`;
  const [professionalCnt, setProfessionalCnt] = useState(["", "", "", ""]);
  const [trendings, setTrendings] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [healers, sethealers] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [nutritionists, setNutritionists] = useState([]);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  let chatFirstCall = true;
  let chatSubscribe = undefined;
  let unsubscribeProfessional = undefined;
  let individualSubcscribe = [];
  let groupFirstCall = true;
  let groupSubscribe = [];

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldShowAlert: true,
      shouldSetBadge: false
    }),
  });

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

  if (errorMsg) {
    alert(errorMsg);
  }

  const isNearBy = async (userdata) => {
    if (
      !(user.location || location) ||
      !(userdata.location || userdata.currentlocation) ||
      !userdata.membership
    )
      return false;
    let url = `${default_url}&destinations=${userdata.location}`;
    if (location && userdata.currentlocation)
      url = `${googleMapApi}&origins=${location.coords.latitude},${location.coords.longitude}&destinations=${userdata.currentlocation.latitude},${userdata.currentlocation.longitude}`;
    return await fetch(url)
      .then((response) => response.json())
      .then((json) => {
        if (json.rows.length == 0) return false;
        const { elements } = json.rows[0];
        //if (elements.length > 0 && elements[0].distance && elements[0].distance.valuer) {
        const distance = elements[0].distance.value;
        if (distance < 16000) return true;
        return false;
        //} else {
        //  return false;
        //}

      });
  };

  const updateLocation = async () => {
    if (errorMsg) {
      alert(errorMsg);
    } else if (location) {
      const currentlocation = { latitude: location.coords.latitude, longitude: location.coords.longitude };
      const docRef = doc(firestore, "users", user.uid);
      await updateDoc(docRef, { currentlocation }).then(() => {
        addInfo({ currentlocation });
      });
    }
  }

  const getProfessionals = async () => {
    const q = query(
      collection(firestore, "users"),
      where("professional", "==", true)
    );
    // const querySnapshot = await getDocs(q);
    unsubscribeProfessional = onSnapshot(q, querySnapshot => {
      console.log('changed', querySnapshot.size);
      const professionalCnt = [0, 0, 0, 0];
      const trendingArray = [];
      const coachesArray = [];
      const healersArray = [];
      const therapistsArray = [];
      const nutritionistsArray = [];
      querySnapshot.forEach((doc) => {
        const userdata = { ...doc.data(), uid: doc.id };
        // console.log(userdata);
        const type = userdata.service;
        if (
          type === serviceType.personalTrainer ||
          type == serviceType.sportCoach
        ) {
          professionalCnt[0]++;
          coachesArray.push(userdata);
          setCoaches([...coachesArray]);
        }

        else if (type === serviceType.holisticHealer) {
          professionalCnt[1]++;
          healersArray.push(userdata);
          sethealers([...healersArray]);
        }
        else if (type === serviceType.massageTherapist) {
          professionalCnt[2]++;
          therapistsArray.push(userdata);
          setTherapists([...therapistsArray]);
        }
        else if (type === serviceType.nutritionist) {
          professionalCnt[3]++;
          nutritionistsArray.push(userdata);
          setNutritionists([...nutritionistsArray]);
        }
        if (userdata.membership == memberType.pro)
          trendingArray.push({ ...userdata, trending: true });
        else
          trendingArray.push({ ...userdata, trending: false });
        setTrendings([...trendingArray]);
        setProfessionalCnt([...professionalCnt]);

      });
    });
  };

  const getMessageNotification = () => {
    chatSubscribe = onSnapshot(
      doc(firestore, "users", user.uid),
      (snapShot) => {
        if (snapShot) {
          const userData = snapShot.data();          
          if (userData != undefined) {
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
      }
    );
  };

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
      await updateDoc(docRef, { token: expoPushToken }).then(() => {
        addInfo({ token: expoPushToken });
      });
    }
  }

  useEffect(() => {
    getProfessionals();
    console.log("HomeScreen Mounted");
    requestPermissions();
    getMessageNotification();
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

    return () => {
      console.log("HomeScreen Unmounted");
      subscribeMsgNotification();
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    updateLocation();
  }, [location])

  useEffect(() => {
    addUsertoken();
  }, [expoPushToken])

  // const schedulePushNotification = async () => {
  //   await Notifications.scheduleNotificationAsync({
  //     content: {
  //       title: "You've got mail! 📬",
  //       body: 'Here is the notification body',
  //       data: { data: 'goes here' },
  //       sound: 'notification.wav',
  //       vibrate: [0, 250, 250, 250],
  //       priority: 'max',
  //     },
  //     trigger: { 
  //       seconds: 2,
  //       channelId: 'new-emails',
  //     },
  //   });
  // }

  const subscribeMsgNotification = () => {
    chatSubscribe();
    individualSubcscribe.map((subscribe) => subscribe());
    individualSubcscribe = [];

    groupSubscribe.map((subscribe) => subscribe());
    groupSubscribe = [];

    unsubscribeProfessional();
  };

  return (
    <View style={{ width: "100%", height: "100%", backgroundColor: "white" }}>
      {console.log('HomeScreen HomeScreen')}
      <HomeHeader
        navigation={navigation}
        userId={user.uid}
        userName={user.name}
        userPhoto={user.photo}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.topMenu}>
          <Text style={styles.title}>Professionals</Text>
        </View>
        <View style={styles.professionalList}>
          <View style={styles.professional}>
            <Professional
              navigation={navigation}
              href={serviceType.personalTrainer}
              src={PersonalTrainers}
              text="Trainers & Coaches"
              comment={`${professionalCnt[0]} trainer${professionalCnt[0] > 1 ? 's' : ''}`}
              targets={coaches}
            />
          </View>
          <View style={styles.professional}>
            <Professional
              src={HolisticHealers}
              text="Holistic Healers"
              comment={`${professionalCnt[1]} healer${professionalCnt[1] > 1 ? 's' : ''}`}
              navigation={navigation}
              href={serviceType.holisticHealer}
              targets={healers}
            />
          </View>
          <View style={styles.professional}>
            <Professional
              src={Massage}
              text="Massage Therapists"
              comment={`${professionalCnt[2]} Therapist${professionalCnt[2] > 1 ? 's' : ''}`}
              navigation={navigation}
              href={serviceType.massageTherapist}
              targets={therapists}
            />
          </View>
          <View style={styles.professional}>
            <Professional
              src={Nutrition}
              text="Nutritionists"
              comment={`${professionalCnt[3]} Nutritionist${professionalCnt[3] > 1 ? 's' : ''}`}
              navigation={navigation}
              href={serviceType.nutritionist}
              targets={nutritionists}
            />
          </View>
        </View>
        <View style={styles.topMenu}>
          <Text style={styles.title}>Trending Today</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(navName.MainNavigator, {
                screen: navName.TrendingOnBreakzen,
                params: trendings
              });
            }}
            background={color.blue}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingRight: 8,
              }}
            >
              <Text style={styles.viewAll}>View All</Text>
              <Svg
                id="back_2_"
                data-name="back (2)"
                xmlns="http://www.w3.org/2000/svg"
                width="4.851"
                height="8.811"
                viewBox="0 0 4.851 8.811"
              >
                <Path
                  id="Chevron_Right"
                  d="M58.835,4.721,54.873,8.681a.445.445,0,0,1-.63-.628l3.648-3.646L54.244.76a.445.445,0,0,1,.63-.629l3.962,3.961A.449.449,0,0,1,58.835,4.721Z"
                  transform="translate(-54.113 -0.001)"
                  fill="#7dbdef"
                />
              </Svg>
            </View>
          </TouchableOpacity>
        </View>
        <ScrollView
          style={styles.trendingList}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {trendings.map((trending, index) => (
            <View style={styles.trending} key={index}>
              <PhotofoliaV active user={trending} navigation={navigation} />
            </View>
          ))}
        </ScrollView>
      </ScrollView>
    </View>
  );
}

function HomeHeader(props) {
  const { navigation, userId, userName, userPhoto } = props;
  return (
    <View>
      <ImageBackground style={headerStyle.container} source={HeaderBack}>
        <View style={headerStyle.headerContainer}>
          <View style={headerStyle.userContainer}>
            <View style={{ justifyContent: "space-evenly" }}>
              <Text style={headerStyle.title}>
                Welcome
                {" " + userName}
              </Text>
              <Text style={headerStyle.comment}>
                Let's check your updates today!
              </Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(navName.MainNavigator, {
                  screen: navName.ProfileClient,
                  params: { userId },
                })
              }
              // background={(color.blue)}
              useForeground
            >
              <View style={headerStyle.imageWrapper}>
                <Image style={headerStyle.image} source={{ uri: userPhoto }} />
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ opacity: 0.5 }}>
            <FullButton
              onPress={() =>
                navigation.navigate(navName.MainNavigator, {
                  screen: navName.Searching,
                  params: {
                    searchService: "all",
                  },
                })
              }
              src={buttonType.search}
              title="Search"
              search
            />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

function Professional(props) {
  const { navigation, href, src, text, comment, targets } = props;
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(navName.Professional, { type: href, targets: targets });
      }}
      background={color.blue}
      useForeground
    >
      <View style={pstyle.container}>
        <View style={pstyle.imageWrapper}>
          <Image
            style={
              href == serviceType.personalTrainer
                ? pstyle.imageCoach
                : pstyle.image
            }
            source={src}
          />
        </View>
        <View style={{ position: "absolute", width: "100%", bottom: 16 }}>
          <Text style={pstyle.text}>{text}</Text>
          <Text style={pstyle.comment}>{comment}</Text>
        </View>
      </View>
    </TouchableOpacity>
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
});

const pstyle = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
    borderColor: "#153E73",
    borderWidth: 1,
    overflow: "hidden",
  },
  imageWrapper: {
    width: "100%",
    height: undefined,
    aspectRatio: 10 / 9,
    alignItems: "center",
    justifyContent: "center",
  },
  imageCoach: {
    width: "80%",
    height: undefined,
    aspectRatio: 1 / 1,
    resizeMode: "cover",
  },
  image: {
    width: "60%",
    height: undefined,
    aspectRatio: 1 / 1,
    resizeMode: "cover",
  },
  text: {
    textAlign: "center",
    color: "#153E73",
    fontWeight: "bold",
    fontSize: 12,
    marginBottom: 4,
  },
  comment: {
    textAlign: "center",
    color: "#515F65",
    fontSize: 9,
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
    paddingTop: 24,
  },
  topMenu: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
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
  },
  viewAll: {
    color: color.blue,
    fontSize: 12,
    paddingRight: 16,
    paddingLeft: 8,
    paddingVertical: 8,
  },
  trendingList: {
    flexDirection: "row",
    marginBottom: 32,
  },
  trending: {
    marginHorizontal: 4,
    width: 100,
    height: undefined,
    aspectRatio: 10 / 14,
  },
});
