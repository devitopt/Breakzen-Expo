import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Svg, G, Path, TSpan } from "react-native-svg";
import ViewSlider from "react-native-view-slider";
import { useSelector } from "react-redux";
import {
  chatCollection,
  color,
  defaultPhoto,
  messageType,
} from "../../assets/stdafx";
import { BackButton } from "../../components/backbutton";
import { navName } from "../../navigation/Paths";
import { firestore } from "../../config/firebase";
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
  deleteDoc,
} from "firebase/firestore";
import { MaterialIcons } from "@expo/vector-icons";

const screenw = Dimensions.get("screen").width;

const connectionState = {
  connected: "connected",
  pending: "pending",
  none: "none",
  me: "me",
};

export default function ProfileClient({ route, navigation }) {
  const user = useSelector((state) => state.user);
  const { userId } = route.params;

  const [client, setClient] = useState({
    photo: defaultPhoto[0],
    gallery: [],
    chats: [],
    name: "",
    location: "",
    zipcode: "",
    aboutme: "",
    goals: [],
    reported: false,
  });

  const [groups, setGroups] = useState([]);
  const [conState, setConState] = useState(connectionState.me);
  const [readMore, setReadMore] = useState(false);

  const getGroups = async () => {
    const array = [];
    getDocs(collection(firestore, "groups")).then((snapShot) => {
      snapShot.docs.map((groupShot) => {
        const groupData = groupShot.data();
        if (
          groupData.creator === userId ||
          (groupData.members && groupData.members.find((x) => x.id === userId))
        ) {
          array.push({ title: groupData.title, image: groupData.image });
          setGroups([...array]);
        }
      });
    });
  };

  useEffect(() => {
    if (userId === user.uid) {
      setConState(connectionState.me);
      setClient(user);
      if (user.aboutme.split(" ").length > 30) setReadMore(true);
    } else {
      getDoc(doc(firestore, "users", userId)).then((snapShot) => {
        const userData = snapShot.data();
        setClient({ ...userData, uid: userId });

        if (userData.chats.includes(user.uid)) {
          if (user.professional) {
            getDocs(
              query(
                collection(firestore, chatCollection(userId, user.uid)),
                orderBy("time", "desc"),
                limit(1)
              )
            ).then((msgShot) => {
              if (msgShot.docs[0].data().type === messageType.jobpost)
                setConState(connectionState.none);
              else setConState(connectionState.connected);
            });
          } else setConState(connectionState.connected);
        } else if (userData.requests.find((x) => x.uid === user.uid))
          setConState(connectionState.pending);
        else setConState(connectionState.none);

        if (userData.aboutme.split(" ").length > 30) setReadMore(true);
      });
    }
    getGroups();
  }, [route.params]);

  const onBack = () => {
    setClient({
      photo: defaultPhoto[0],
      gallery: [],
      chats: [],
      name: "",
      location: "",
      zipcode: "",
      aboutme: "",
      goals: [],
      reported: false,
    });
  };

  const onConnect = () => {
    const docRef = doc(firestore, "users", userId);
    updateDoc(docRef, {
      requests: [
        ...client.requests,
        {
          uid: user.uid,
          name: user.name,
          time: new Date(),
          photo: user.photo,
        },
      ],
    }).then(() => {
      setConState(connectionState.pending);
    });
  };

  const chatUpdate = async (cuser, otherid) => {
    const { chats } = cuser;
    const index = chats.findIndex((x) => x === otherid);
    chats.splice(index, 1);
    const docRef = doc(firestore, "users", cuser.uid);
    updateDoc(docRef, { chats }).then(() => {
      if (cuser.uid === userId) {
        setClient({ ...client, chats });
      }
    });
  };

  const removeChatHistory = async () => {
    const collectionRef = collection(
      firestore,
      chatCollection(user.uid, userId)
    );
    getDocs(collectionRef).then((snapShot) => {
      snapShot.docs.map((snapData) => {
        deleteDoc(
          doc(firestore, chatCollection(user.uid, userId), snapData.id)
        );
      });
    });
  };

  const onUnfollow = () => {
    chatUpdate(user, userId);
    chatUpdate(client, user.uid);
    removeChatHistory();
    setConState(connectionState.none);
  };

  const onReport = () => {
    if (user.uid !== userId && client.reported === false)
      navigation.navigate(navName.Report, { userId });
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <ProfileHeader
        navigation={navigation}
        photo={client.photo}
        gallery={client.gallery}
        onReport={onReport}
        onBack={onBack}
        reportShow={user.uid !== userId && client.reported === false}
      />
      <View style={styles.container}>
        <View>
          <Text style={styles.connection}>
            {"connections: "}
            <Text style={{ fontWeight: "bold" }}>{client.chats.length}</Text>
          </Text>
        </View>
        <View style={styles.paragraph}>
          <View style={styles.spaceBetween}>
            <Text style={{ fontSize: 17, fontWeight: "bold" }}>
              {client.name}
            </Text>
            {conState !== connectionState.me && (
              <View style={{ width: 90 }}>
                {conState === connectionState.none ? (
                  <ModalButton blue title="Connect" onPress={onConnect} />
                ) : conState === connectionState.pending ? (
                  <ModalButton title="Pending" onPress={() => {}} />
                ) : (
                  <ModalButton title="Unfollow" onPress={onUnfollow} />
                )}
              </View>
            )}
          </View>
          <View style={styles.spaceBetween}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Svg_Location />
              <Text style={{ fontSize: 11, paddingLeft: 8 }}>
                {client.location}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.paragraph}>
          <Text style={styles.title}>About Me</Text>
          <Text
            style={{ fontSize: 14, lineHeight: 22, color: "#707070" }}
            numberOfLines={readMore ? 3 : 0}
          >
            {client.aboutme}
          </Text>
          {readMore && (
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity onPress={() => setReadMore(false)}>
                <View>
                  <Text
                    style={{
                      color: color.blue,
                      fontWeight: "bold",
                      padding: 6,
                    }}
                  >
                    Read More
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View style={styles.paragraph}>
          <Text style={styles.title}>My Goals</Text>
          <View style={styles.goalView}>            
            {client.goals.map((goal, index) => (
              <View style={styles.goalItem} >
                <Text key={`text-${index}`} style={styles.goal}>
                  {goal}
                </Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.paragraph}>
          <Text style={styles.title}>Social Groups</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: "row" }}>
              {groups.map((group, index) => (
                <View key={`group-${index}`} style={styles.groupItem}>
                  <Image
                    style={styles.groupImage}
                    source={{ uri: group.image.src }}
                  />
                  <Text style={styles.groupTitle}>{group.title}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
}

function ProfileHeader(props) {
  const { navigation, photo, gallery } = props;
  return (
    <View>
      <ViewSlider
        renderSlides={
          gallery.length ? (
            <>
              <View style={headerStyle.viewBox}>
                <Image style={headerStyle.image} source={{ uri: photo }} />
              </View>
              {gallery.map((image, index) => (
                <View key={`gallery-${index}`} style={headerStyle.viewBox}>
                  <Image
                    style={headerStyle.image}
                    source={{ uri: image.src }}
                  />
                </View>
              ))}
            </>
          ) : (
            <>
              <View style={headerStyle.viewBox}>
                <Image style={headerStyle.image} source={{ uri: photo }} />
              </View>
            </>
          )
        }
        style={headerStyle.slider}
        height={screenw}
        slideCount={gallery.length ? gallery.length + 1 : 1}
        dots
        dotActiveColor="green"
        dotInactiveColor="white"
        dotsContainerStyle={headerStyle.dotContainer}
        autoSlide={false}
        slideInterval={2000}
      />
      <View style={headerStyle.topMenu}>
        <View style={{ borderRadius: 36, backgroundColor: "#CCCCCC64" }}>
          <BackButton navigation={navigation} onPress={props.onBack} white />
        </View>
        {props.reportShow && (
          <View style={headerStyle.tView}>
            <TouchableOpacity onPress={props.onReport}>
              <View style={headerStyle.wrapper}>
                {/* <Svg_Path /> */}
                <MaterialIcons name="report" size={24} color="black" />
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

function ModalButton(props) {
  return (
    <View style={fstyle.tconatiner}>
      <TouchableOpacity onPress={props.onPress}>
        <View
          style={[
            fstyle.container,
            props.blue
              ? { backgroundColor: color.blue }
              : { backgroundColor: color.gray },
          ]}
        >
          <Text style={fstyle.buttonText}>{props.title}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

function Svg_Path() {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="21"
      height="18"
      viewBox="0 0 27 23.788"
    >
      <G
        id="Group_39366"
        data-name="Group 39366"
        transform="translate(-328.5 -47)"
      >
        <G
          id="Group_38636"
          data-name="Group 38636"
          transform="translate(-562.094 -736.579)"
        >
          <Path
            id="Path_31259"
            data-name="Path 31259"
            d="M916.546,807.367h-24.9A1.24,1.24,0,0,1,890.594,806a3,3,0,0,1,.444-1.131c4.093-6.993,11.834-20.21,12.3-20.971a.918.918,0,0,1,.653-.321h.031l.051,0h.049l.049,0h.03a.92.92,0,0,1,.654.321c.46.756,8.2,13.977,12.3,20.981a3.029,3.029,0,0,1,.438,1.121A1.24,1.24,0,0,1,916.546,807.367Z"
            fill="#0288d1"
          />
          <Path
            id="Path_31260"
            data-name="Path 31260"
            d="M1082.135,1043.07a.679.679,0,1,0,.679.679A.679.679,0,0,0,1082.135,1043.07Z"
            transform="translate(-178.036 -242.052)"
            fill="#0288d1"
          />
          <Path
            id="Path_31261"
            data-name="Path 31261"
            d="M1081.985,944.83a.481.481,0,0,0,.481-.482l.169-5.562c0-.133-.184-.424-.668-.424s-.669.291-.669.424l.205,5.562A.481.481,0,0,0,1081.985,944.83Z"
            transform="translate(-177.888 -144.381)"
            fill="#0288d1"
          />
        </G>
        <Text
          style={{ color: "white", textAlign: "center" }}
          id="_"
          data-name="!"
          transform="translate(340 66)"
          fill="#fff"
          font-size="15"
          font-family="SegoeUI, Segoe UI"
        >
          {/* <TSpan x="0" y="0" fill="#fff"> */}!{/* </TSpan> */}
        </Text>
      </G>
    </Svg>
  );
}

function Svg_Location() {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="8.217"
      height="10.892"
      viewBox="0 0 8.217 10.892"
    >
      <G id="black-placeholder-variant" transform="translate(0)">
        <Path
          id="Path_31252"
          data-name="Path 31252"
          d="M8.775,0A4.113,4.113,0,0,0,4.666,4.108c0,3.262,3.668,6.538,3.824,6.676a.43.43,0,0,0,.578-.008c.156-.146,3.815-3.6,3.815-6.668A4.114,4.114,0,0,0,8.775,0Zm0,6.067a1.959,1.959,0,1,1,1.958-1.959A1.959,1.959,0,0,1,8.775,6.067Z"
          transform="translate(-4.666)"
          fill="#7dbdef"
        />
      </G>
    </Svg>
  );
}

const fstyle = {
  tconatiner: {
    width: "100%",
    height: 32,
    borderRadius: 12,
    overflow: "hidden",
  },
  container: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 14,
    color: "white",
  },
};

const screenpx = 28;

const headerStyle = StyleSheet.create({
  topMenu: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: screenpx,
    position: "absolute",
    width: "100%",
    top: 48,
  },
  viewBox: {
    width: screenw,
    height: screenw,
  },
  slider: {
    alignItems: "center",
  },
  dotContainer: {
    backgroundColor: "transparent",
    position: "absolute",
    bottom: 16,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  tView: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: "hidden",
  },
  wrapper: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "white",
    paddingHorizontal: screenpx,
    paddingTop: 16,
  },
  connection: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  spaceBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  paragraph: {
    marginBottom: 24,
  },
  title: {
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 6,
  },
  goalView: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "flex-start",
    borderRadius: 6
  },
  goalItem: {
    backgroundColor: color.blue,
    paddingHorizontal: 8,
    marginHorizontal: 6,
    paddingVertical: 8,
    marginVertical: 4,
    borderRadius: 6
  },
  goal: {    
    color: "white",    
  },
  groupItem: {
    width: 72,
    paddingTop: 12,
    marginRight: 24,
  },
  groupImage: {
    width: 72,
    height: 72,
    borderRadius: 12,
  },
  groupTitle: {
    textAlign: "center",
    paddingTop: 8,
  },
});
