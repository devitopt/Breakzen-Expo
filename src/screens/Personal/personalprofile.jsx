import React, { useState } from "react";
import {
  ScrollView,
  Text,
  Image,
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Svg, G, Path, Circle } from "react-native-svg";
import { Switch } from "react-native-switch";
import { auth, functions, firestore } from "../../config/firebase";
import { BackButton } from "../../components/backbutton";
import { navName } from "../../navigation/Paths";
import { backcheckState, color, idcheckStatus, memberType } from "../../assets/stdafx";
import HeaderBack from "../../assets/svg/header-back.png";
import { httpsCallable } from "firebase/functions";
import { addinfo } from "../../redux/actioncreators";
import { Loading } from "../../components/loading";
import { doc, updateDoc } from "firebase/firestore";

const MenuType = {
  User: "User",
  Gallery: "Gallery",
  Notification: "Notification",
  Subscription: "Subscription",
  Privacy: "Privacy",
  Support: "Support",
  SignOut: "SignOut",
};

const notificationSize = 24;

export default function PersonalProfile({ navigation }) {
  
  const user = useSelector((state) => state.user);
  const [bNotification, setNotification] = useState(true);
  const [bLoading, setLoading] = useState(false);
  const retrieveVerificationSession = httpsCallable(functions, "retrieveVerificationSession")
  const dispatch = useDispatch();
  const addInfo = (info) => dispatch(addinfo(info));

  const onSignOut = () => {
    updateToken();
    auth.signOut().then(() => {      
      navigation.replace(navName.SigninNavigator, {
        screen: navName.WelcomeScreen,
      });
      // navigation.dispatch(
      //   CommonActions.reset({
      //     index: 1,
      //     routes: [{name: navName.WelcomeScreen}],
      //   }),
      // );
    });
  };

  const updateToken = async () => {
    const docRef = doc(firestore, "users", user.uid);
    await updateDoc(docRef, { token: null } ).then(() => {
      addInfo({ token: null });
    });
  }

  const getUpdateStatus = async () => {
   
    console.log(user.verificationSessionId);
  
    if (user.verificationSessionId) {
      setLoading(true);
      await retrieveVerificationSession({
        verificationSessionId: user.verificationSessionId,
      })
        .then(async (res) => {
          const response = res.data.response;
          console.log(response); 
          const docRef = doc(firestore, "users", user.uid);
          await updateDoc(docRef, { idverify: response.status } ).then(() => {
            addInfo({ idverify: response.status });
          });
         
      })
        .catch((error) => {
          console.log(error);
        });
    }
    setLoading(false);
  }  

  return (
    <View style={styles.container}>
      <View style={{ height: 144, overflow: 'hidden' }}>
        <ImageBackground style={styles.headerBack} source={HeaderBack}>
          <View style={styles.backButton}>
            <BackButton navigation={navigation} white />
          </View>
        </ImageBackground>
      </View>
      <View style={styles.profileContainer}>
        <View style={styles.profile}>
          <View style={styles.imageWrapper}>
            <Image style={styles.image} source={{ uri: user.photo }} />
          </View>
          <Text>{user.name}</Text>
          <Text>{user.email}</Text>
        </View>
      </View>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.mainContainer}>
          <View style={styles.menuList}>
            <MenuItem
              src={MenuType.User}
              title="My Profile"
              onPress={() =>
                navigation.navigate(
                  user.professional
                    ? navName.EditProfileInfo
                    : navName.EditProfileInfo2
                )
              }
            />
            <MenuItem
              src={MenuType.Gallery}
              title="My Gallery"
              onPress={() => navigation.navigate(navName.MyGallery)}
            />
            <Notification
              src={MenuType.Notification}
              title="Notifications"
              notification={bNotification}
              setNotification={setNotification}
            />
            {user.professional && (
              <MenuItem
                src={MenuType.Subscription}
                title="Subscriptions"
                onPress={() => navigation.navigate(navName.MySubscription)}
              />
            )}
            <MenuItem
              src={MenuType.Privacy}
              title="Account"
              onPress={() => navigation.navigate(navName.MyAccount)}
            />
            <MenuItem
              src={MenuType.Support}
              title="Support"
              onPress={() => navigation.navigate(navName.Support)}
            />
            <MenuItem
              src={MenuType.SignOut}
              title="Sign Out"
              noForward
              onPress={onSignOut}
            />
          </View>
          <ErrorMessage
            verify={!user.verified}
            navigation={navigation}
            href={navName.EmailRequestValidation}
          />
          {user.professional && (
            <BackMessage
              verify={user.backcheck == backcheckState.none}
              pending={user.backcheck == backcheckState.pending}
              navigation={navigation}
              href={navName.BackCheck}
            />
          )}
          {user.professional && (
            // <IDVerification
            //   verify={user.idverify != idcheckStatus.verified}
            //   pending={user.idverify == idcheckStatus.processing}
            //   action={getUpdateStatus}
            //   navigation={navigation}              
            //   href={navName.ActivatingAccount}
            // />
            <TouchableOpacity
              onPress={() => {                
                if ( !user.idverify || (user.idverify != idcheckStatus.verified && !user.idverify == idcheckStatus.processing) || user.idverify == idcheckStatus.requires_input ) { 
                  navigation.navigate(navName.ActivatingAccount)
                } else if (user.idverify == idcheckStatus.processing) {
                  getUpdateStatus();
                }    
              }}
              background={color.blue}
            >
              <View style={mstyle.errorWrapper}>
                <View style={{ position: "absolute", left: 12 }}>          
                  {user.idverify == idcheckStatus.processing ? (<Svg_Clock />) : user.idverify != idcheckStatus.verified ? (<Svg_Alert />) : (<Svg_Menu type={MenuType.Privacy} />)}
                </View>
                <Text
                  style={[
                    { fontWeight: "bold", fontSize: 16 },
                    user.idverify == idcheckStatus.processing ? { color: "#C2E1B9" } : user.idverify != idcheckStatus.verified ? { color: "#EF7D7D" } : { color: 'green' },
                  ]}
                >
                  {user.idverify == idcheckStatus.processing ? "Identity Checking" : user.idverify != idcheckStatus.verified ? "Verify Identity" : "Identity Verified"}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
        <View style={{ height: 12 }} />
      </ScrollView>
      {bLoading && <Loading />}
    </View>
  );
}

function Notification(props) {
  return (
    <View style={mstyle.container}>
      <View style={mstyle.titleWrapper}>
        <Svg_Menu type={props.src} />
        <Text style={mstyle.title}>{props.title}</Text>
      </View>
      <Switch
        value={props.notification}
        onValueChange={props.setNotification}
        disabled={false}
        activeText="On"
        inActiveText="Off"
        circleSize={notificationSize}
        barHeight={notificationSize}
        circleBorderWidth={0}
        backgroundActive={color.blue}
        backgroundInactive="gray"
        circleActiveColor="white"
        circleInActiveColor="white"
        innerCircleStyle={{
          borderWidth: 3,
          borderColor: props.notification ? color.blue : "gray",
          alignItems: "center",
          justifyContent: "center",
        }} // style for inner animated circle for what you (may) be rendering inside the circle
        renderActiveText={false}
        renderInActiveText={false}
        switchLeftPx={2} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
        switchRightPx={2} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
        switchWidthMultiplier={2} // multipled by the `circleSize` prop to calculate total width of the Switch
        switchBorderRadius={notificationSize} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.
      />
    </View>
  );
}

function MenuItem(props) {
  return (
    <TouchableOpacity onPress={props.onPress} background={color.blue}>
      <View style={mstyle.container}>
        <View style={mstyle.titleWrapper}>
          <Svg_Menu type={props.src} />
          <Text style={mstyle.title}>{props.title}</Text>
        </View>
        {!props.noForward && <Svg_Right />}
      </View>
    </TouchableOpacity>
  );
}

function ErrorMessage(props) {
  return (
    <TouchableOpacity
      onPress={() => {
        if (props.verify) props.navigation.navigate(props.href);
      }}
      background={color.blue}
    >
      <View style={mstyle.errorWrapper}>
        <View style={{ position: "absolute", left: 12 }}>
          {props.verify ? <Svg_Alert /> : <Svg_Menu type={MenuType.Privacy} />}
        </View>
        <Text
          style={[
            { fontWeight: "bold", fontSize: 16 },
            props.verify ? { color: "#EF7D7D" } : { color: 'green' },
          ]}
        >
          {props.verify ? "Verify Your Email" : "Email Verified"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function BackMessage(props) {
  return (
    <TouchableOpacity
      onPress={() => {
        if (props.verify) props.navigation.navigate(props.href);
      }}
      background={color.blue}
    >
      <View style={mstyle.errorWrapper}>
        <View style={{ position: "absolute", left: 12 }}>
          {props.pending ? (
            <Svg_Clock />
          ) : props.verify ? (
            <Svg_Alert />
          ) : (
            <Svg_Menu type={MenuType.Privacy} />
          )}
        </View>
        <Text
          style={[
            { fontWeight: "bold", fontSize: 16 },
            props.pending
              ? { color: "#C2E1B9" }
              : props.verify
              ? { color: "#EF7D7D" }
              : { color: 'green' },
          ]}
        >
          {props.pending
            ? "Background Checking"
            : props.verify
            ? "Check your Background"
            : "Background Checked"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// function IDVerification(props) {
//   return (
//     <TouchableOpacity
//       onPress={() => {
//         if (props.verify) props.navigation.navigate(props.href);
//       }}
//       background={color.blue}
//     >
//       <View style={mstyle.errorWrapper}>
//         <View style={{ position: "absolute", left: 12 }}>
//           {props.verify ? <Svg_Alert /> : <Svg_Menu type={MenuType.Privacy} />}
//         </View>
//         <Text
//           style={[
//             { fontWeight: "bold", fontSize: 16 },
//             props.verify ? { color: "#EF7D7D" } : { color: 'green' },
//           ]}
//         >
//           {props.verify ? "Confirm Identity" : "Identity Confirmed"}
//         </Text>
//       </View>
//     </TouchableOpacity>
//   );
// }

function Svg_Alert() {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="19.935"
      height="19.932"
      viewBox="0 0 19.935 19.932"
    >
      <G id="alert" transform="translate(0 -0.044)">
        <G
          id="Group_39290"
          data-name="Group 39290"
          transform="translate(0 0.044)"
        >
          <Path
            id="Path_34156"
            data-name="Path 34156"
            d="M17.019,2.969A9.966,9.966,0,0,0,2.912,17.049a9.89,9.89,0,0,0,7.043,2.926h.023v0a9.962,9.962,0,0,0,7.041-17ZM10.4,15.279a.628.628,0,0,1-.44.182A.617.617,0,0,1,9.527,14.4a.668.668,0,0,1,.446-.183.622.622,0,0,1,.611.624A.626.626,0,0,1,10.4,15.279Zm.186-2.932a.623.623,0,0,1-1.246,0L9.35,5.494a.561.561,0,0,1,.625-.622.62.62,0,0,1,.616.623Z"
            transform="translate(0 -0.044)"
            fill="#ef7d7d"
          />
        </G>
      </G>
    </Svg>
  );
}

function Svg_Clock() {
  return (
    <Svg
      id="clock_11_"
      data-name="clock (11)"
      xmlns="http://www.w3.org/2000/svg"
      width="19.932"
      height="19.932"
      viewBox="0 0 19.932 19.932"
    >
      <G id="Group_39291" data-name="Group 39291">
        <Path
          id="Path_34157"
          data-name="Path 34157"
          d="M9.966,0a9.966,9.966,0,1,0,9.966,9.966A9.977,9.977,0,0,0,9.966,0Zm4.52,11.341H9.713a.842.842,0,0,1-.842-.842V3.649a.842.842,0,0,1,1.684,0V9.657h3.93a.842.842,0,1,1,0,1.684Z"
          fill="#c2e1b9"
        />
      </G>
    </Svg>
  );
}

function Svg_Right() {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="7.951"
      height="13.019"
      viewBox="0 0 7.951 13.019"
    >
      <G
        id="Group_38703"
        data-name="Group 38703"
        transform="translate(0.355 0.3)"
      >
        <Path
          id="Path_34070"
          data-name="Path 34070"
          d="M108.576,5.725,103.049.2a.681.681,0,0,0-.961,0l-.407.407a.68.68,0,0,0,0,.961l4.641,4.641-4.646,4.646a.681.681,0,0,0,0,.961l.407.407a.681.681,0,0,0,.961,0l5.532-5.532a.686.686,0,0,0,0-.964Z"
          transform="translate(-101.478)"
          fill="#000"
        />
      </G>
    </Svg>
  );
}

function Svg_Menu(props) {
  return props.type == MenuType.User ? (
    <Svg
      id="profile-user_1_"
      data-name="profile-user (1)"
      xmlns="http://www.w3.org/2000/svg"
      width="19"
      height="18.999"
      viewBox="0 0 19 18.999"
    >
      <Path
        id="Path_34071"
        data-name="Path 34071"
        d="M9.5,0A9.5,9.5,0,1,0,19,9.5,9.5,9.5,0,0,0,9.5,0Zm0,2.84A3.142,3.142,0,1,1,6.358,5.984,3.142,3.142,0,0,1,9.5,2.841Zm0,13.675a6.972,6.972,0,0,1-4.54-1.674,1.339,1.339,0,0,1-.47-1.018,3.169,3.169,0,0,1,3.184-3.168h3.656a3.164,3.164,0,0,1,3.179,3.168,1.336,1.336,0,0,1-.469,1.017A6.969,6.969,0,0,1,9.5,16.516Z"
        transform="translate(0 -0.001)"
        fill="#7dbdef"
      />
    </Svg>
  ) : props.type == MenuType.Gallery ? (
    <Svg
      id="crop"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
    >
      <G id="Group_39289" data-name="Group 39289" transform="translate(6 6)">
        <Circle
          id="Ellipse_1263"
          data-name="Ellipse 1263"
          cx="1.5"
          cy="1.5"
          r="1.5"
          transform="translate(-0.405)"
          fill="#7dbdef"
        />
      </G>
      <Path
        id="Path_34155"
        data-name="Path 34155"
        d="M19.166,15.833H17.5V5A2.5,2.5,0,0,0,15,2.5H4.167V.833A.833.833,0,0,0,2.5.833V2.5H.833a.833.833,0,0,0,0,1.667H2.5V15A2.5,2.5,0,0,0,5,17.5H15.833v1.667a.833.833,0,0,0,1.667,0V17.5h1.667a.833.833,0,0,0,0-1.667ZM15,4.167A.834.834,0,0,1,15.833,5v5.783L13.95,8.9a1.5,1.5,0,0,0-2.067,0L7.917,12.867l-1.05-1.05a1.5,1.5,0,0,0-2.067,0l-.633.632V4.167Z"
        fill="#7dbdef"
      />
    </Svg>
  ) : props.type == MenuType.Notification ? (
    <Svg
      id="notification_9_"
      data-name="notification (9)"
      xmlns="http://www.w3.org/2000/svg"
      width="19.001"
      height="19.001"
      viewBox="0 0 19.001 19.001"
    >
      <G id="Group_38710" data-name="Group 38710">
        <Path
          id="Path_34078"
          data-name="Path 34078"
          d="M9.5,0A9.5,9.5,0,1,0,19,9.5,9.5,9.5,0,0,0,9.5,0Zm0,14.754a1.235,1.235,0,0,1-1.235-1.235h2.47A1.235,1.235,0,0,1,9.5,14.754Zm4.173-2.473h0c0,.457-.37.487-.826.487H6.155c-.457,0-.826-.03-.826-.487V12.2a.825.825,0,0,1,.47-.743l.262-2.264A3.442,3.442,0,0,1,8.794,5.827V4.948a.708.708,0,0,1,1.415,0v.879a3.442,3.442,0,0,1,2.733,3.368l.262,2.265a.824.824,0,0,1,.47.743Z"
          transform="translate(-0.001)"
          fill="#2fc3f2"
        />
      </G>
    </Svg>
  ) : props.type == MenuType.Subscription ? (
    <Svg
      id="dollar_7_"
      data-name="dollar (7)"
      xmlns="http://www.w3.org/2000/svg"
      width="19"
      height="19"
      viewBox="0 0 19 19"
    >
      <Path
        id="Path_34074"
        data-name="Path 34074"
        d="M16.218,2.783A9.5,9.5,0,0,0,2.783,16.218,9.5,9.5,0,0,0,16.218,2.783ZM9.5,8.906a2.672,2.672,0,0,1,.73,5.242.186.186,0,0,0-.137.179v.5a.6.6,0,0,1-.565.61.594.594,0,0,1-.622-.593v-.517a.186.186,0,0,0-.136-.179A2.676,2.676,0,0,1,6.828,11.6a.6.6,0,0,1,.576-.61.594.594,0,0,1,.611.594A1.484,1.484,0,1,0,9.5,10.094a2.672,2.672,0,0,1-.73-5.242.186.186,0,0,0,.137-.179v-.5a.6.6,0,0,1,.565-.61.594.594,0,0,1,.622.593v.517a.186.186,0,0,0,.136.179,2.676,2.676,0,0,1,1.942,2.553.6.6,0,0,1-.576.61.594.594,0,0,1-.611-.594A1.484,1.484,0,1,0,9.5,8.906Z"
        transform="translate(0)"
        fill="#2fc3f2"
      />
    </Svg>
  ) : props.type == MenuType.Privacy ? (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="16.963"
      height="18.999"
      viewBox="0 0 16.963 18.999"
    >
      <Path
        id="secure"
        d="M29.029,2.659a.621.621,0,0,0-.449-.513L20.944.023a.621.621,0,0,0-.333,0L12.976,2.147a.621.621,0,0,0-.449.513c-.044.318-1.055,7.843,1.537,11.586a12.191,12.191,0,0,0,6.568,4.736.623.623,0,0,0,.292,0,12.19,12.19,0,0,0,6.568-4.736C30.083,10.5,29.073,2.978,29.029,2.659ZM25.7,7.052l-5.208,5.208a.621.621,0,0,1-.878,0L16.4,9.041a.621.621,0,0,1,0-.878l.639-.639a.621.621,0,0,1,.878,0l2.142,2.142,4.13-4.13a.621.621,0,0,1,.878,0l.639.639A.621.621,0,0,1,25.7,7.052Z"
        transform="translate(-12.296 0)"
        fill="#2fc3f2"
      />
    </Svg>
  ) : props.type == MenuType.Support ? (
    <Svg
      id="help-web-button"
      xmlns="http://www.w3.org/2000/svg"
      width="18.999"
      height="19"
      viewBox="0 0 18.999 19"
    >
      <Path
        id="Path_34075"
        data-name="Path 34075"
        d="M9.508,0a9.5,9.5,0,1,0,9.5,9.495A9.5,9.5,0,0,0,9.508,0Zm.677,14.781a1.119,1.119,0,0,1-.766.3,1.157,1.157,0,0,1-.784-.291,1.02,1.02,0,0,1-.335-.814,1.049,1.049,0,0,1,.324-.781,1.094,1.094,0,0,1,.8-.317,1.082,1.082,0,0,1,1.1,1.1A1.029,1.029,0,0,1,10.185,14.781Zm2.751-6.82a3.359,3.359,0,0,1-.6.814q-.349.343-1.256,1.153a5.2,5.2,0,0,0-.4.4,1.635,1.635,0,0,0-.225.317,1.526,1.526,0,0,0-.114.288q-.04.143-.122.5a.819.819,0,0,1-.876.766.9.9,0,0,1-.645-.25.984.984,0,0,1-.261-.744,2.742,2.742,0,0,1,.192-1.072,2.709,2.709,0,0,1,.508-.8,11.646,11.646,0,0,1,.855-.814q.472-.413.681-.622a2.106,2.106,0,0,0,.353-.468,1.126,1.126,0,0,0,.143-.56,1.3,1.3,0,0,0-.438-.994A1.6,1.6,0,0,0,9.6,5.478,1.564,1.564,0,0,0,8.4,5.887a3.262,3.262,0,0,0-.648,1.2q-.251.833-.95.833a.935.935,0,0,1-.7-.291A.89.89,0,0,1,5.824,7a2.665,2.665,0,0,1,.449-1.418A3.458,3.458,0,0,1,7.584,4.4,4.123,4.123,0,0,1,9.6,3.924a4.29,4.29,0,0,1,1.885.394A3.056,3.056,0,0,1,12.744,5.39a2.63,2.63,0,0,1,.446,1.473A2.268,2.268,0,0,1,12.936,7.96Z"
        transform="translate(-0.008)"
        fill="#2fc3f2"
      />
    </Svg>
  ) : (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="18.957"
      height="19"
      viewBox="0 0 18.957 19"
    >
      <Path
        id="sign-out"
        d="M10.5,1a9.5,9.5,0,0,1,9.457,8.636h-7.73V7.045a.863.863,0,0,0-1.474-.611L7.3,9.889a.863.863,0,0,0,0,1.221l3.455,3.455a.863.863,0,0,0,1.474-.611V11.364h7.73A9.5,9.5,0,1,1,10.5,1Z"
        transform="translate(-1 -1)"
        fill="#7dbdef"
      />
    </Svg>
  );
}

const screenpx = 28;

const mstyle = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 20,
  },
  titleWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    position: "absolute",
    left: 48,
    fontSize: 14,
    fontWeight: "500",
  },
  errorWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    // marginBottom: 12,
  },
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: "100%",
    height: "100%",
  },
  headerBack: {
    width: "100%",
    height: undefined,
    aspectRatio: 37 / 24,
  },
  backButton: {
    width: 36,
    marginLeft: screenpx,
    marginTop: 48,
    marginBottom: 36,
    borderRadius: 36,
    backgroundColor: "#FFFFFF24",
  },
  profileContainer: {
    marginTop: -24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: "white",
  },
  mainContainer: {
    width: "100%",
    paddingHorizontal: screenpx,
    backgroundColor: "white",
  },
  profile: {
    width: "100%",
    alignItems: "center",
    marginTop: -55,
    marginBottom: 24,
  },
  imageWrapper: {
    width: 110,
    height: 110,
    borderRadius: 110,
    borderColor: "white",
    borderWidth: 5,
    overflow: "hidden",
    marginBottom: 6,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    // height: undefined,
    // aspectRatio: 32 / 38,
  },
  menuList: {
    width: "100%",
    paddingHorizontal: 8,
  },
});
