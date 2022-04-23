import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  TextInput,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert
} from "react-native";
import { Svg, G, Path, Circle, Rect } from "react-native-svg";
import ViewSlider from "react-native-view-slider";
import { useSelector } from "react-redux";
import { navName } from "../../navigation/Paths";
import { BackButton } from "../../components/backbutton";
import { ModalButton } from "../../components/modalbutton";
import {
  breakzen,
  chatCollection,
  color,
  defaultPhoto,
  messageType,
  size,
  backcheckState,
  coachType,
  serviceType,
} from "../../assets/stdafx";

import venmo from "../../assets/svg/venmo.png";
import paypal from "../../assets/svg/paypal.png";
import cashApp from "../../assets/svg/cashapp.png";
import visa from "../../assets/svg/visa.png";
import masterCard from "../../assets/svg/mastercard.png";
import { MaterialIcons } from "@expo/vector-icons";
import verified from "../../assets/svg/verified.png"
import { firestore, functions } from "../../config/firebase";
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
import ActionSheet from "react-native-actionsheet";
import { useDispatch } from "react-redux";
import { addinfo } from "../../redux/actioncreators";
import { httpsCallable } from "firebase/functions";

const paymentImage = {
  venmo,
  paypal,
  cashApp,
  visa,
  masterCard,
};

const screenw = Dimensions.get("screen").width;

export default function Profile({ route, navigation }) {
  const user = useSelector((state) => state.user);
  const { userId } = route.params;

  const dispatch = useDispatch;
  const addInfo = (info) => dispatch(addinfo(info));

  const sendNotification = httpsCallable(functions, 'sendNotification');

  const [professional, setProfessional] = useState({
    name: "",
    price: "",
    star: 0,
    speciality: [],
    credential: [],
    paymentmethods: [],
    reviews: [],
    service: "",
    location: "",
    zipcode: "",
    aboutme: "",
    photo: defaultPhoto[0],
    gallery: [],
    reported: false,
    backcheck: backcheckState.none,
  });

  const [requestSent, setRequestSent] = useState(2);
  const [accepted, setAccepted] = useState(false);
  const [readMore, setReadMore] = useState(false);
  const [bModal, setModal] = useState(false);
  const [rModal, setRModal] = useState(false);
  const [reviewerId, setReviewerId] = useState("");
  const [reviewIndex, setReviewIndex] = useState(0);
  const [otherToken, setOtherToken] = useState(false);

  let actionSheet = useRef();
  var optionArray = ['Report', 'Block', 'Cancel'];

  const onReadMore = () => {
    setReadMore(false);
  };

  useEffect(() => {
    if (user.chats && user.chats.find((x) => x == userId)) {
      getDocs(
        query(
          collection(firestore, chatCollection(user.uid, userId)),
          where("type", "==", messageType.checkAvailability)
        )
      ).then((snapShot) => {
        if (snapShot.docs.length) setRequestSent(true);
        else setRequestSent(false);
      });
      getDocs(
        query(
          collection(firestore, chatCollection(user.uid, userId)),
          where("type", "==", messageType.professionalAccept)
        )
      ).then((snapShot) => {
        if (snapShot.docs.length) setAccepted(true);
      });
    } else setRequestSent(false);
    getDoc(doc(firestore, "users", userId)).then((snapShot) => {
      const userData = snapShot.data();
      setProfessional(userData);
      if (userData.aboutme.split(" ").length > 30) setReadMore(true);
    });
  }, [route.params]);

  useEffect(() => {
    sendToUser(`Congratulations!, you just received an answer from ${user.name}, you can read it in professional’s profile.`);
  }, [otherToken]);

  const onBack = () => {
    setProfessional({
      name: "",
      price: "",
      star: 0,
      speciality: [],
      credential: [],
      paymentmethods: [],
      reviews: [],
      service: "",
      location: "",
      zipcode: "",
      aboutme: "",
      photo: defaultPhoto[0],
      gallery: [],
      reported: false,
      backcheck: backcheckState.none,
    });
    setRequestSent(2);
  };

  const writeReview = () => {
    setModal(true);
  };

  const onRespond = (userid, index) => {
    if (userId == user.uid) {
      setRModal(true);
      setReviewerId(userid);
      setReviewIndex(index);
    }
  };

  const chatUpdate = (uid, other) => {
    const docRef = doc(firestore, "users", uid);
    getDoc(docRef).then((snapShot) => {
      const userdata = snapShot.data();
      if (userdata.token ) setOtherToken(userdata.token);
      const array = userdata.chats;
      if (!array.includes(other)) {
        array.push(other);
        updateDoc(docRef, { chats: [...array] });
      }
    });
  };

  const onRespondModalOk = async (param) => {
    setRModal(false);
    const collectionRef = collection(
      firestore,
      chatCollection(reviewerId, breakzen.uid)
    );
    addDoc(collectionRef, {
      content: `${user.name} answered to your review\n"${param}"`,
      read: false,
      receiver: reviewerId,
      sender: breakzen.uid,
      time: new Date(),
      userid: userId,
      index: reviewIndex,
    }).then(() => {
      chatUpdate(reviewerId, breakzen.uid);
      const array = [...professional.reviews];
      array[reviewIndex].refresh = true;
      setProfessional({ ...professional, reviews: [...array] });
      alert("Respond successfully");      
    });
  };

  const onModalOk = (param) => {
    setModal(false);

    const dateNow = new Date();
    const array = [
      ...professional.reviews,
      {
        name: user.name,
        userid: user.uid,
        photo: user.photo,
        star: param.star,
        review: param.review,
        time: `${dateNow.toDateString()} ${dateNow.toTimeString().split(" ")[0]
          }`,
      },
    ];

    const reviewslen = professional.reviews.length;
    const star =
      (professional.star * reviewslen + param.star) / (reviewslen + 1);

    const docRef = doc(firestore, "users", userId);
    updateDoc(docRef, { reviews: array, star }).then(() => {
      setProfessional({ ...professional, reviews: array, star });
    });
    const collectionRef = collection(
      firestore,
      chatCollection(userId, breakzen.uid)
    );
    addDoc(collectionRef, {
      content:
        "Congratulations!, You just received a new review, you can read it in your profile.",
      read: false,
      receiver: userId,
      sender: breakzen.uid,
      time: new Date(),
    });
    send("Congratulations!, You just received a new review, you can read it in your profile.");
  };

  const send = async (txt) => {
    const tokenArray = [{
      to: professional.token,
      sound: "default",
      title: "Breakzen",
      body: txt,
      priority: "high"      
    }]
    await sendNotification({
      tokenArray: tokenArray,
    })
  }

  const sendToUser = async (txt) => {
    const tokenArray = [{
      to: otherToken,
      sound: "default",
      title: "Breakzen",
      body: txt,
      priority: "high"      
    }]
    await sendNotification({
      tokenArray: tokenArray,
    })
  }

  const showOption = () => {
    if (user.uid != userId)
      actionSheet.current.show();
  };

  const onResult = (index) => {
    if (index == 0 && professional.reported == false) {
      onReport();
    }
    if (index == 1) {
      if (user.chats.includes(userId)) {
        showConfirmDialog();
      } else {
        alert("You don't have connection with this user");
      }
    }
  }

  const onReport = () => {
    navigation.navigate(navName.Report, { userId });
  }

  const onBlock = async () => {
    const chats = user.chats;
    if (chats.includes(userId)) {
      const chat = chats.filter((x) => x != userId);
      const info = { chats: [...chat] };
      const docRef = doc(firestore, "users", user.uid);
      updateDoc(docRef, info).then(() => {
        addInfo(info);
        onBack();
      });
      return Alert.alert(
        "Success",
        "You've blocked successfully.",
        [
          {
            text: "Ok",
            onPress: () => {
              onBack()
            },
          }
        ]
      );
    }
  }

  const showConfirmDialog = () => {
    return Alert.alert(
      "Confirm",
      "Are you sure you want to block this user?",
      [
        {
          text: "Ok",
          onPress: () => {
            onBlock();
            navigation.goBack();
          },
        },
        {
          text: "Cancel",
        },
      ]
    );
  };

  const onCheckAvailability = () => {
    if (user && user.verified)
      navigation.navigate(navName.CheckAvailability, { userId })
    else
      Alert.alert('Breakzen', 'You must verify your email first');
  }

  return (
    <View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileHeader
          navigation={navigation}
          photo={professional.photo}
          gallery={professional.gallery}
          reportShow={user.uid != userId && professional.reported == false}
          onReport={showOption}
          onBack={onBack}
        />
        <View style={styles.container}>
          {professional.backcheck == backcheckState.done && (
            <View style={styles.backcheckContainer}>
              <MaterialIcons name="verified" size={40} color="blue" />
              {/* <Image source={verified} /> */}
              <Text style={{ color: "gray" }}>Background Checked</Text>
            </View>
          )}
          {professional.backcheck == backcheckState.done && (
            <View style={{ height: 20 }} />
          )}
          {professional.reported && user.uid != userId && (
            <Text style={styles.report}>Reported</Text>
          )}
          <View style={styles.spaceBetween}>
            <Text style={{ fontSize: 17, fontWeight: "bold" }}>
              {professional.name}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Svg_Star />
              <Text style={{ fontSize: 11, paddingLeft: 4, paddingRight: 24 }}>
                {professional.star.toFixed(1)}
              </Text>
              <Text style={{ fontSize: 10, color: "gray" }}>
                {professional.reviews.length} Reviews
              </Text>
            </View>
          </View>
          <View style={styles.spaceBetween}>
            {professional.service == serviceType.sportCoach || professional.service == serviceType.holisticHealer &&
              professional.coach != "" ? (
              professional.service == serviceType.sportCoach ? (
                <Text>{`${professional.coach} Coach`}</Text>
              ) : (
                <Text>{`${professional.coach} Instructor`}</Text>
              )
            ) : (
              <Text>{professional.service}</Text>
            )}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Svg_Location />
              <Text style={{ fontSize: 11, paddingLeft: 8 }}>
                {professional.location}
              </Text>
            </View>
          </View>
          <View style={{ height: 16 }} />
          {!user.professional && requestSent != 2 && (
            <View>
              {requestSent ? (
                <View style={styles.tView}>
                  <View style={styles.topButton}>
                    <Text
                      style={{
                        color: "#7DBDEF",
                        fontWeight: "bold",
                        fontSize: 14,
                      }}
                    >
                      Request Sent
                    </Text>
                    <Svg_Check />
                  </View>
                </View>
              ) : (
                <View style={styles.tView}>
                  <TouchableOpacity
                    onPress={onCheckAvailability}
                    background={color.blue}
                  >
                    <View style={styles.topButton}>
                      <Text
                        style={{
                          color: "#7DBDEF",
                          fontWeight: "bold",
                          fontSize: 14,
                        }}
                      >
                        Check Availability
                      </Text>
                      <Svg_Calendar />
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
          <View style={styles.paragraph}>
            <Text style={styles.title}>About Me</Text>
            <Text
              style={{ fontSize: 14, lineHeight: 22, color: "#707070" }}
              numberOfLines={readMore ? 3 : 0}
            >
              {professional.aboutme}
            </Text>
            {readMore && (
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity onPress={onReadMore}>
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
            <Text style={styles.title}>My Specialities</Text>
            <View style={styles.itemsContainer}>
              {professional.speciality.map((element, index) => (
                <View style={styles.item}>
                  <Text key={index} style={{ color: 'white' }}>{element}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.paragraph}>
            <Text style={styles.title}>My Certificates</Text>
            <View style={styles.itemView}>
              {professional.credential.map((element, index) => (
                <View style={styles.item}>
                  <Text key={index} style={{ color: 'white' }}>
                    {element}
                  </Text>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.paragraph}>
            <Text style={styles.title}>Payment Methods</Text>
            <View style={styles.itemView}>
              {professional.paymentmethods.map((method) => (
                <Image
                  source={paymentImage[method]}
                  key={method}
                  style={{ marginRight: 6 }}
                />
              ))}
            </View>
          </View>
          <View style={styles.spaceBetween}>
            <Text style={styles.title}>Reviews</Text>
            {!user.professional && accepted && (
              <TouchableOpacity background={color.blue} onPress={writeReview}>
                <View>
                  <Text
                    style={{
                      color: color.blue,
                      fontWeight: "bold",
                      fontSize: 12,
                    }}
                  >
                    Write a review
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
          {professional.reviews.map((item, index) => (
            <Review
              key={index}
              item={item}
              index={index}
              userId={userId}
              onRespond={() => onRespond(item.userid, index)}
            />
          ))}
          {professional.reviews.length == 0 && (
            <View>
              <Text style={styles.noReview}>No reviews yet</Text>
            </View>
          )}

          {!user.professional && requestSent == false && (
            <View style={styles.tbView}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(navName.CheckAvailability, { userId, professional })
                }
              >
                <View style={styles.bottomButton}>
                  <Text
                    style={{ color: "white", fontWeight: "bold", fontSize: 14 }}
                  >
                    Check Availability
                  </Text>
                  <Text style={styles.subButton}>${professional.price}</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
          <ActionSheet
            ref={actionSheet}
            options={optionArray}
            cancelButtonIndex={2}
            onPress={(index) => {
              onResult(index)
            }}
          />
        </View>
      </ScrollView>
      {bModal && (
        <SelectModal
          onCancel={() => setModal(false)}
          onOk={(param) => onModalOk(param)}
        />
      )}
      {rModal && (
        <RespondModal
          onCancel={() => setRModal(false)}
          onOk={(param) => onRespondModalOk(param)}
        />
      )}
    </View>
  );
}

function ProfileHeader(props) {
  const { gallery, photo } = props;
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
                <View key={index} style={headerStyle.viewBox}>
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
          <BackButton
            navigation={props.navigation}
            onPress={props.onBack}
            white
          />
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

function Svg_Calendar() {
  return (
    <Svg
      style={styles.buttonImage}
      xmlns="http://www.w3.org/2000/svg"
      width="14.704"
      height="13.555"
      viewBox="0 0 14.704 13.555"
    >
      <G
        id="calendar_24_"
        data-name="calendar (24)"
        transform="translate(0 -20)"
      >
        <G id="Group_38655" data-name="Group 38655" transform="translate(0 20)">
          <G id="Group_38654" data-name="Group 38654">
            <Path
              id="Path_31253"
              data-name="Path 31253"
              d="M14.129,21.153H11.3v-.579a.574.574,0,0,0-1.149,0v.579h-5.6v-.579a.574.574,0,0,0-1.149,0v.579H.574A.574.574,0,0,0,0,21.728V32.981a.574.574,0,0,0,.574.574H14.129a.574.574,0,0,0,.574-.574V21.728A.574.574,0,0,0,14.129,21.153Zm-.574,11.253H1.149V22.3H3.4v.579a.574.574,0,0,0,1.149,0V22.3h5.6v.579a.574.574,0,0,0,1.149,0V22.3h2.254Z"
              transform="translate(0 -20)"
              fill="#7dbdef"
            />
          </G>
        </G>
        <G
          id="Group_38657"
          data-name="Group 38657"
          transform="translate(6.576 25.398)"
        >
          <G id="Group_38656" data-name="Group 38656">
            <Circle
              id="Ellipse_1257"
              data-name="Ellipse 1257"
              cx="0.775"
              cy="0.775"
              r="0.775"
              fill="#7dbdef"
            />
          </G>
        </G>
        <G
          id="Group_38659"
          data-name="Group 38659"
          transform="translate(6.576 28.772)"
        >
          <G id="Group_38658" data-name="Group 38658">
            <Circle
              id="Ellipse_1258"
              data-name="Ellipse 1258"
              cx="0.775"
              cy="0.775"
              r="0.775"
              fill="#7dbdef"
            />
          </G>
        </G>
        <G
          id="Group_38661"
          data-name="Group 38661"
          transform="translate(3.202 25.398)"
        >
          <G id="Group_38660" data-name="Group 38660">
            <Circle
              id="Ellipse_1259"
              data-name="Ellipse 1259"
              cx="0.775"
              cy="0.775"
              r="0.775"
              fill="#7dbdef"
            />
          </G>
        </G>
        <G
          id="Group_38663"
          data-name="Group 38663"
          transform="translate(9.951 25.398)"
        >
          <G id="Group_38662" data-name="Group 38662">
            <Circle
              id="Ellipse_1260"
              data-name="Ellipse 1260"
              cx="0.775"
              cy="0.775"
              r="0.775"
              fill="#7dbdef"
            />
          </G>
        </G>
        <G
          id="Group_38665"
          data-name="Group 38665"
          transform="translate(3.202 28.772)"
        >
          <G id="Group_38664" data-name="Group 38664">
            <Circle
              id="Ellipse_1261"
              data-name="Ellipse 1261"
              cx="0.775"
              cy="0.775"
              r="0.775"
              fill="#7dbdef"
            />
          </G>
        </G>
        <G
          id="Group_38667"
          data-name="Group 38667"
          transform="translate(9.951 28.772)"
        >
          <G id="Group_38666" data-name="Group 38666">
            <Circle
              id="Ellipse_1262"
              data-name="Ellipse 1262"
              cx="0.775"
              cy="0.775"
              r="0.775"
              fill="#7dbdef"
            />
          </G>
        </G>
      </G>
    </Svg>
  );
}

function Svg_Check() {
  return (
    <Svg
      style={styles.buttonImage}
      xmlns="http://www.w3.org/2000/svg"
      width="16.573"
      height="14.091"
      viewBox="0 0 16.573 14.091"
    >
      <G id="tick_7_" data-name="tick (7)" transform="translate(0 -27.855)">
        <G
          id="Group_37185"
          data-name="Group 37185"
          transform="translate(0 27.855)"
        >
          <Path
            id="Path_29193"
            data-name="Path 29193"
            d="M15.131,27.855,5.386,39.2,1.3,35.381,0,36.769l5.536,5.177L16.573,29.093Z"
            transform="translate(0 -27.855)"
            fill="#7dbdef"
          />
        </G>
      </G>
    </Svg>
  );
}

function Svg_Star() {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="9.944"
      height="9.529"
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

function Svg_Star_Border() {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="14.871"
      height="14.159"
      viewBox="0 0 14.871 14.159"
    >
      <Path
        id="Path_9376"
        data-name="Path 9376"
        d="M13.536,7.746l-3.9-.368a.674.674,0,0,1-.558-.413l-1.4-3.383a.668.668,0,0,0-1.24,0L5.06,6.964a.66.66,0,0,1-.558.413L.6,7.746a.674.674,0,0,0-.38,1.172L3.162,11.5a.668.668,0,0,1,.212.659l-.882,3.618a.674.674,0,0,0,.994.737L6.735,14.6a.676.676,0,0,1,.681,0l3.25,1.91a.671.671,0,0,0,.994-.737l-.871-3.618A.668.668,0,0,1,11,11.5l2.937-2.579A.682.682,0,0,0,13.536,7.746Z"
        transform="translate(0.359 -2.812)"
        fill="none"
        stroke="#AAA"
        stroke-width="0.7"
      />
    </Svg>
  );
}

function Svg_Star2() {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="14.684"
      height="14.072"
      viewBox="0 0 14.684 14.072"
    >
      <Path
        id="star_10_"
        data-name="star (10)"
        d="M.038,5.809A.779.779,0,0,1,.71,5.272l4.238-.385L6.624.965a.78.78,0,0,1,1.435,0L9.736,4.888l4.239.385a.781.781,0,0,1,.443,1.366l-3.2,2.81.945,4.161A.779.779,0,0,1,11,14.452L7.342,12.267,3.688,14.452a.78.78,0,0,1-1.161-.843l.945-4.161L.267,6.639a.781.781,0,0,1-.229-.83Zm0,0"
        transform="translate(0 -0.491)"
        fill="#ffc107"
      />
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

function Svg_Payment() {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="107.273"
      height="22.423"
      viewBox="0 0 107.273 22.423"
    >
      <G id="Group_36320" data-name="Group 36320" transform="translate(-0.209)">
        <G
          id="Group_16920"
          data-name="Group 16920"
          transform="translate(0.209)"
        >
          <Rect
            id="Rectangle_16873"
            data-name="Rectangle 16873"
            width="9.808"
            height="17.625"
            transform="translate(13.238 2.396)"
            fill="#ff5f00"
          />
          <Path
            id="Path_19471"
            data-name="Path 19471"
            d="M13.862,68.611A11.244,11.244,0,0,1,18.128,59.8a11.211,11.211,0,1,0,0,17.632A11.2,11.2,0,0,1,13.862,68.611Z"
            transform="translate(0 -57.4)"
            fill="#eb001b"
          />
          <Path
            id="Path_19472"
            data-name="Path 19472"
            d="M274.328,68.611A11.2,11.2,0,0,1,256.2,77.427a11.242,11.242,0,0,0,0-17.632,11.2,11.2,0,0,1,18.128,8.816Z"
            transform="translate(-238.044 -57.4)"
            fill="#f79e1b"
          />
        </G>
        <G id="visa" transform="translate(59.285 3.67)">
          <G
            id="Group_17438"
            data-name="Group 17438"
            transform="translate(4.503 0)"
          >
            <G id="Group_17437" data-name="Group 17437">
              <Path
                id="Path_19515"
                data-name="Path 19515"
                d="M42.459,100.23,40.04,115.283h3.866l2.417-15.053Zm11.662,6.132c-1.351-.667-2.179-1.118-2.179-1.8.017-.62.7-1.256,2.228-1.256a6.728,6.728,0,0,1,2.88.557l.351.157.526-3.149a9.758,9.758,0,0,0-3.47-.62c-3.818,0-6.507,1.985-6.523,4.824-.032,2.1,1.925,3.258,3.389,3.955,1.5.715,2,1.179,2,1.815-.017.976-1.209,1.426-2.322,1.426a7.863,7.863,0,0,1-3.628-.776l-.509-.232-.541,3.273a12.073,12.073,0,0,0,4.312.777c4.058,0,6.7-1.955,6.731-4.981C57.382,108.672,56.351,107.4,54.122,106.362Zm13.717-6.085H64.847a1.916,1.916,0,0,0-2.021,1.211l-5.743,13.8H61.14l1.118-2.987H66.8l.58,3h3.579Zm-4.455,9.005c.078.008,1.557-4.876,1.557-4.876l1.178,4.876ZM36.81,100.23l-3.788,10.227-.413-2.017a11.238,11.238,0,0,0-5.347-6.112l3.469,12.94h4.091L40.9,100.232H36.81Z"
                transform="translate(-27.262 -100.23)"
                fill="#2394bc"
              />
            </G>
          </G>
          <Path
            id="Path_19516"
            data-name="Path 19516"
            d="M8.576,102.186a2.526,2.526,0,0,0-2.515-1.938h-6L0,100.527c4.68,1.154,8.608,4.7,9.882,8.043Z"
            transform="translate(0 -100.245)"
            fill="#efc75e"
          />
        </G>
      </G>
    </Svg>
  );
}

function Review(props) {
  const { item, index, userId } = props;
  const { onRespond } = props;

  const array = [0, 1, 2, 3, 4];
  const [respond, setRespond] = useState("");
  const [time, setTime] = useState("");

  // use respondArray on Profile function to increase the speed.
  useEffect(() => {
    const q = query(
      collection(firestore, chatCollection(breakzen.uid, item.userid)),
      where("userid", "==", userId),
      where("index", "==", index)
    );
    getDocs(q).then((snapShot) => {
      if (snapShot.docs.length) {
        const snapData = snapShot.docs[0].data();
        const { content } = snapData;
        const carray = content.split("\n");
        carray.splice(0, 1);
        setRespond(carray.join("\n"));
        const date = new Date(
          snapData.time.seconds * 1000 + snapData.time.nanoseconds / 1000000
        );
        setTime(`${date.toDateString()} ${date.toTimeString().split(" ")[0]}`);
      }
    });
  });

  return (
    <View style={[styles.paragraph, rstyle.container]}>
      <TouchableOpacity
        background={color.blue}
        onPress={() => {
          if (respond == "") onRespond();
        }}
      >
        <View style={{ padding: 4 }}>
          <View style={styles.spaceBetween}>
            <View style={rstyle.spaceBetween}>
              <View style={{ width: 30, height: 30 }}>
                <Image style={rstyle.image} source={{ uri: item.photo }} />
              </View>
              <View style={{ paddingLeft: 12 }}>
                <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                  {item.name}
                </Text>
                <Text style={{ fontSize: 11, color: "gray" }}>{item.time}</Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {array.map((val) => (
                <View key={val} style={{ marginLeft: 8 }}>
                  {val < item.star ? <Svg_Star2 /> : <Svg_Star_Border />}
                </View>
              ))}
            </View>
          </View>
          <Text style={rstyle.reviewText}>{item.review}</Text>
          {time != "" && (
            <View>
              <View style={rstyle.respondTitle}>
                <Text style={rstyle.clientName}>{`To ${item.name}`}</Text>
                <Text style={rstyle.respondTime}>{time}</Text>
              </View>
              <Text style={rstyle.respondContent}>{respond}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

function SelectModal(props) {
  const { onOk } = props;
  const { onCancel } = props;

  const [review, setReview] = useState("");
  const [star, setStar] = useState(0);

  const array = [0, 1, 2, 3, 4];

  return (
    <View style={mstyle.container}>
      <View style={mstyle.modal}>
        <View style={mstyle.starContainer}>
          <Text style={[styles.title, { marginBottom: 0 }]}>Select star</Text>
          <View style={mstyle.starView}>
            {array.map((val) => (
              <View style={mstyle.tstar}>
                <TouchableOpacity
                  key={val}
                  background={color.blue}
                  onPress={() => setStar(val + 1)}
                >
                  <View style={mstyle.star}>
                    {val < star ? <Svg_Star2 /> : <Svg_Star_Border />}
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
        <Text style={styles.title}>Write your review here</Text>
        <TextInput
          style={mstyle.input}
          value={review}
          onChangeText={setReview}
          multiline
          placeholder="Your review here"
        />
        <View style={mstyle.buttonContainer}>
          <View style={mstyle.buttonWrapper}>
            <ModalButton onPress={() => onOk({ star, review })} title="Ok" ok />
          </View>
          <View style={mstyle.buttonWrapper}>
            <ModalButton onPress={onCancel} title="Cancel" />
          </View>
        </View>
      </View>
    </View>
  );
}

function RespondModal(props) {
  const { onOk } = props;
  const { onCancel } = props;

  const [review, setReview] = useState("");

  return (
    <View style={mstyle.container}>
      <View style={mstyle.modal}>
        <Text style={styles.title}>Write your respond here</Text>
        <TextInput
          style={mstyle.input}
          value={review}
          onChangeText={setReview}
          multiline
          placeholder="Your respond here"
        />
        <View style={mstyle.buttonContainer}>
          <View style={mstyle.buttonWrapper}>
            <ModalButton onPress={() => onOk(review)} title="Ok" ok />
          </View>
          <View style={mstyle.buttonWrapper}>
            <ModalButton onPress={onCancel} title="Cancel" />
          </View>
        </View>
      </View>
    </View>
  );
}

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
    paddingHorizontal: screenpx,
    paddingTop: 16,
  },
  backcheckContainer: {
    position: "absolute",
    top: -24,
    right: screenpx,
    alignItems: "center",
  },
  report: {
    textAlign: "center",
    marginBottom: 16,
    fontSize: 16,
    fontWeight: "bold",
    color: "#EF7D7D",
  },
  spaceBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  tView: {
    width: "100%",
    height: 50,
    borderRadius: 7,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: color.blue,
    // marginTop: 16,
    marginBottom: 24,
  },

  topButton: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonImage: {
    position: "absolute",
    left: 24,
  },
  paragraph: {
    marginBottom: 32,
  },
  title: {
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 12,
  },
  tbView: {
    width: "100%",
    height: 50,
    borderRadius: 7,
    overflow: "hidden",
    marginBottom: size.screenpb,
  },
  noReview: {
    color: "gray",
    paddingLeft: 6,
    marginBottom: 32,
  },
  bottomButton: {
    width: "100%",
    height: "100%",
    backgroundColor: color.blue,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 24,
    paddingRight: 12,
  },
  subButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: "white",
    backgroundColor: "#FFFFFF40",
    borderRadius: 8,
    fontWeight: "bold",
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
    backgroundColor: color.blue,
    color: "white",
    lineHeight: 24,
    borderRadius: 6
  },
  itemView: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "flex-start",
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
  input: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderColor: color.blue,
    borderRadius: 7,
    fontSize: 14,
    marginBottom: 24,
  },
  starContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  starView: {
    flexDirection: "row",
    alignItems: "center",
  },
  tstar: {
    borderRadius: 24,
    overflow: "hidden",
  },
  star: {
    padding: 6,
  },
});

const rstyle = StyleSheet.create({
  container: {
    backgroundColor: "#7DBDEF24",
    borderRadius: 6,
    overflow: "hidden",
  },
  spaceBetween: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 30,
  },
  reviewText: {
    marginTop: 16,
    paddingLeft: 20,
    color: "#707070",
    fontSize: 12,
    lineHeight: 18,
  },
  respondTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    paddingLeft: 20,
  },
  clientName: {
    color: color.blue,
    fontWeight: "bold",
    fontSize: 12,
    lineHeight: 18,
  },
  respondTime: {
    color: "gray",
    fontSize: 11,
    lineHeight: 18,
  },
  respondContent: {
    marginTop: 8,
    paddingLeft: 20,
    color: "gray",
    fontSize: 12,
    lineHeight: 18,
  },
});
