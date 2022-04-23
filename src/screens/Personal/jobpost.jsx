import React, { useEffect, useState } from "react";
import {
  Text,
  TextInput,
  View,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Svg, G, Path } from "react-native-svg";
import { navName } from "../../navigation/Paths";
import { chatCollection, color, memberType, messageType, size } from "../../assets/stdafx";
import { BackButton } from "../../components/backbutton";
import { addinfo } from "../../redux/actioncreators";
import { ModalButton } from "../../components/modalbutton";
import GroupBack from "../../assets/svg/group-back.png";
import SuccessAsset from "../../assets/svg/success.png";
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
  deleteDoc,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";

const state = {
  APPLY: 0,
  APPLIED: 1,
  NOTHING: 2,
};

export default function JobPost({ route, navigation }) {
  const user = useSelector((state) => state.user);
  const chatList = user.chats;

  const { jobId, jobCreator } = route.params;
  const [job, setJob] = useState({
    creator: "",
    title: "",
    date: "",
    description: "",
    location: "",
    jid: jobId,
  });

  const dispatch = useDispatch();
  const addInfo = (info) => dispatch(addinfo(info));

  const [bModal, setModal] = useState(false);
  const [bDelete, setDelete] = useState(false);
  const [bConfirm, setConfirm] = useState(false);
  const [status, setStatus] = useState(state.NOTHING);
  const [lModal, setLModal] = useState(false);
  const sendNotification = httpsCallable(functions, 'sendNotification')

  const getDateString = (date) => {
    const timeStamp = new Date(
      date.seconds * 1000 + date.nanoseconds / 1000000
    );
    return timeStamp.toDateString();
  };

  useEffect(() => {    
    //if (chatList.includes(jobCreator)) {
      const q = query(
        collection(firestore, chatCollection(user.uid, jobCreator)),
        where("type", "==", messageType.jobpost)
      );
      getDocs(q).then((snapShot) => {
        if (
          snapShot.docs.length &&
          snapShot.docs.find((x) => x.data().jobid == jobId)
        )
          setStatus(state.APPLIED);
        else setStatus(state.APPLY);
      });
    //}
    const docRef = doc(firestore, "joblist", jobId);
    getDoc(docRef).then((jobShot) => {
      const jobData = jobShot.data();
      setJob({
        creator: jobData.creator,
        title: jobData.title,
        date: getDateString(jobData.date),
        description: jobData.description,
        location: jobData.location,
        jid: jobShot.id,
      });
    });
  }, [route.params]);

  const onBack = () => {
    setJob({
      creator: "",
      title: "",
      date: "",
      description: "",
      location: "",
      jid: jobId,
    });
    setStatus(state.NOTHING);
    setConfirm(false);
  };

  const chatUpdate = async (uid, other) => {
    const docRef = doc(firestore, "users", uid);
    getDoc(docRef).then((snapShot) => {
      const userdata = snapShot.data();
      const array = userdata.chats;
      if (!array.includes(other)) {
        array.push(other);
        updateDoc(docRef, { chats: array });
      }
      if (uid == user.uid) {      
        if (user.applyCnt) {
          updateDoc(docRef, {applyCnt: user.applyCnt + 1}).then(() => {
            addInfo({ applyCnt: user.applyCnt + 1 });
          })
        } else {
          updateDoc(docRef, {applyCnt: 1}).then(() => {
            addInfo({ applyCnt: 1 });
          })
        }
      } else {
        const tokenArray = [{
          to: userdata.token,
          sound: "default",
          title: "Breakzen",
          body: `${user.name} is interested in helping you about ${job.title}`,
          priority: "high",
        }]
        sendNotification({
          tokenArray: tokenArray,
        })
      }
    });
  };  

  const onApply = () => {
    if (user.professional && user.membership === memberType.general && user.applyCnt && user.applyCnt >= 4) {
      showAlert()
      return;
    }
    if (status == state.APPLY) {
      const collectionRef = collection(
        firestore,
        chatCollection(user.uid, job.creator)
      );
      addDoc(collectionRef, {
        sender: user.uid,
        receiver: job.creator,
        content: `${user.name} is interested in helping you about ${job.title}`,
        time: new Date(),
        read: false,
        type: messageType.jobpost,
        jobid: job.jid,
      }).then((snapShot) => {
        chatUpdate(user.uid, job.creator);
        chatUpdate(job.creator, user.uid);        
        navigation.navigate(navName.JobPostSuccess);
      });
    }
  };  

  const showAlert = () => {
    Alert.alert(
      "Upgrade Plan",
      "You are exceeded to apply job limit. Please upgrade your plan to Pro",
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

  const deleteCancel = () => {
    setDelete(false);
  };

  const deleteOk = () => {
    const info = {
      postcnt: user.postcnt - 1,
    };
    const docRef = doc(firestore, "users", user.uid);
    updateDoc(docRef, info).then(() => {
      const collectionRef = collection(firestore, "joblist");
      deleteDoc(doc(firestore, "joblist", job.jid)).then(() => {
        setDelete(false);
        setConfirm(true);
      });
      addInfo(info);
    });
  };

  const onEdit = () => {
    setModal(true);
  };

  const onModalOk = (param) => {
    setModal(false);
    const docRef = doc(firestore, "joblist", job.jid);
    updateDoc(docRef, { description: param }).then(() => {
      setJob({ ...job, description: param });
    });
  };

  const onLocationOk = (param) => {
    setLModal(false);
    const docRef = doc(firestore, "joblist", job.jid);
    updateDoc(docRef, { location: param }).then(() => {
      setJob({ ...job, location: param });
    });
  };

  return (
    <KeyboardAvoidingView style={{ width: "100%", height: "100%" }}
    behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <HomeHeader
        navigation={navigation}
        title={job.title}
        date={job.date}
        trash={job.creator == user.uid}
        onDelete={() => {
          setDelete(true);
        }}
        onEdit={onEdit}
        onBack={onBack}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.commentWrapper}>
          <Text style={styles.comment}>{job.description}</Text>
        </View>
        <Text style={styles.title}>Location</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.content}>{job.location}</Text>
          {job.creator == user.uid && (
            <TouchableOpacity
              background={color.blue}
              onPress={() => setLModal(true)}
            >
              <View style={{ padding: 6, marginLeft: 12 }}>
                <Svg_Edit_Black />
              </View>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
      {user.professional && status != state.NOTHING && (
        <View
          style={{ paddingHorizontal: screenpx, paddingBottom: size.screenpb }}
        >
          <View style={styles.tView}>
            <TouchableOpacity onPress={onApply}>
              <View
                style={[
                  styles.topButton,
                  status == state.APPLY
                    ? { backgroundColor: color.blue }
                    : { backgroundColor: "#C2E1B9" },
                ]}
              >
                <Text
                  style={{ color: "white", fontWeight: "bold", fontSize: 14 }}
                >
                  {status == state.APPLY
                    ? "Apply"
                    : status == state.APPLIED
                    ? "Applied"
                    : "Chatting in with this client"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {bDelete && <DeleteJob onCancel={deleteCancel} onOk={deleteOk} />}
      {bConfirm && (
        <DeleteConfirm
          onOk={() => {
            navigation.navigate(navName.JobListings);
          }}
        />
      )}
      {bModal && (
        <SelectModal
          description={job.description}
          onCancel={() => setModal(false)}
          onOk={(param) => onModalOk(param)}
        />
      )}

      {lModal && (
        <SelectLocation
          description={job.location}
          onCancel={() => setLModal(false)}
          onOk={(param) => onLocationOk(param)}
        />
      )}
    </KeyboardAvoidingView>
  );
}

function HomeHeader(props) {
  return (
    <View>
      <ImageBackground style={headerStyle.container} source={GroupBack}>
        <View style={headerStyle.headerContainer}>
          <View style={headerStyle.topMenu}>
            <View style={headerStyle.menuWrapper}>
              <BackButton
                navigation={props.navigation}
                onPress={props.onBack}
                white
              />
              <Text style={headerStyle.title} numberOfLines={1}>
                {props.title}
              </Text>
            </View>
            {props.trash && (
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  onPress={props.onEdit}
                  background={color.blue}
                >
                  <View style={headerStyle.svgWrapper}>
                    <Svg_Edit />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={props.onDelete}
                  background={color.blue}
                >
                  <View style={headerStyle.svgWrapper}>
                    <Svg_Trash />
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
          <Text style={headerStyle.comment}>
            Posted Date:
            {props.date}
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
}

function SelectModal(props) {
  const { onOk } = props;
  const { onCancel } = props;

  const [review, setReview] = useState(props.description);

  return (
    <View style={mstyle.container}>
      <View style={mstyle.modal}>
        <Text style={mstyle.title}>Write your description here</Text>
        <TextInput
          style={mstyle.input}
          value={review}
          onChangeText={setReview}
          multiline
          numberOfLines={12}
          placeholder="Job Description"
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

function SelectLocation(props) {
  const { onOk } = props;
  const { onCancel } = props;

  const [review, setReview] = useState(props.description);

  return (
    <View style={mstyle.container}>
      <View style={mstyle.modal}>
        <Text style={mstyle.title}>Write a location here</Text>
        <TextInput
          style={mstyle.locationInput}
          value={review}
          onChangeText={setReview}
          placeholder="Job Location"
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

function DeleteJob(props) {
  return (
    <View style={dstyle.container}>
      <View style={dstyle.wrapper}>
        <Text style={dstyle.title}>Delete Post?</Text>
        <Text style={dstyle.comment}>
          Are you sure you want to delete this post from list?
        </Text>
        <View style={dstyle.buttonContainer}>
          <View
            style={[
              dstyle.button,
              { backgroundColor: color.gray, marginRight: 4 },
            ]}
          >
            <TouchableOpacity onPress={props.onCancel} background={color.blue}>
              <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
                <Text>Cancel</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={[dstyle.button, { backgroundColor: color.blue }]}>
            <TouchableOpacity onPress={props.onOk}>
              <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
                <Text style={{ color: "white" }}>Yes, Please</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

function DeleteConfirm(props) {
  return (
    <View style={dstyle.container}>
      <View style={dstyle.tview}>
        <TouchableOpacity onPress={props.onOk} background={color.blue}>
          <View style={dstyle.wrapper}>
            <Image style={{ alignSelf: "center" }} source={SuccessAsset} />
            <Text style={dstyle.comment}>
              Post was deleted successfully and will be removed from list
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Svg_Edit() {
  return (
    <Svg
      width="18"
      height="18"
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M2.27656 10C2.30781 10 2.33906 9.99687 2.37031 9.99219L4.99844 9.53125C5.02969 9.525 5.05938 9.51094 5.08125 9.4875L11.7047 2.86406C11.7192 2.84961 11.7307 2.83244 11.7385 2.81354C11.7463 2.79463 11.7504 2.77437 11.7504 2.75391C11.7504 2.73344 11.7463 2.71318 11.7385 2.69428C11.7307 2.67538 11.7192 2.65821 11.7047 2.64375L9.10781 0.0453125C9.07812 0.015625 9.03906 0 8.99687 0C8.95469 0 8.91563 0.015625 8.88594 0.0453125L2.2625 6.66875C2.23906 6.69219 2.225 6.72031 2.21875 6.75156L1.75781 9.37969C1.74261 9.46339 1.74804 9.54954 1.77364 9.63067C1.79923 9.71181 1.84421 9.78548 1.90469 9.84531C2.00781 9.94531 2.1375 10 2.27656 10ZM3.32969 7.275L8.99687 1.60938L10.1422 2.75469L4.475 8.42031L3.08594 8.66562L3.32969 7.275ZM12 11.3125H0.5C0.223437 11.3125 0 11.5359 0 11.8125V12.375C0 12.4438 0.05625 12.5 0.125 12.5H12.375C12.4438 12.5 12.5 12.4438 12.5 12.375V11.8125C12.5 11.5359 12.2766 11.3125 12 11.3125Z"
        fill="white"
      />
    </Svg>
  );
}

function Svg_Edit_Black() {
  return (
    <Svg
      width="18"
      height="18"
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M2.27656 10C2.30781 10 2.33906 9.99687 2.37031 9.99219L4.99844 9.53125C5.02969 9.525 5.05938 9.51094 5.08125 9.4875L11.7047 2.86406C11.7192 2.84961 11.7307 2.83244 11.7385 2.81354C11.7463 2.79463 11.7504 2.77437 11.7504 2.75391C11.7504 2.73344 11.7463 2.71318 11.7385 2.69428C11.7307 2.67538 11.7192 2.65821 11.7047 2.64375L9.10781 0.0453125C9.07812 0.015625 9.03906 0 8.99687 0C8.95469 0 8.91563 0.015625 8.88594 0.0453125L2.2625 6.66875C2.23906 6.69219 2.225 6.72031 2.21875 6.75156L1.75781 9.37969C1.74261 9.46339 1.74804 9.54954 1.77364 9.63067C1.79923 9.71181 1.84421 9.78548 1.90469 9.84531C2.00781 9.94531 2.1375 10 2.27656 10ZM3.32969 7.275L8.99687 1.60938L10.1422 2.75469L4.475 8.42031L3.08594 8.66562L3.32969 7.275ZM12 11.3125H0.5C0.223437 11.3125 0 11.5359 0 11.8125V12.375C0 12.4438 0.05625 12.5 0.125 12.5H12.375C12.4438 12.5 12.5 12.4438 12.5 12.375V11.8125C12.5 11.5359 12.2766 11.3125 12 11.3125Z"
        fill="black"
      />
    </Svg>
  );
}

function Svg_Trash() {
  return (
    <Svg
      id="delete_6_"
      data-name="delete (6)"
      xmlns="http://www.w3.org/2000/svg"
      width="20.938"
      height="18"
      viewBox="0 0 20.938 23.601"
    >
      <G id="Group_39357" data-name="Group 39357">
        <G id="Group_39356" data-name="Group 39356" transform="translate(0 0)">
          <Path
            id="Path_34186"
            data-name="Path 34186"
            d="M76.938,114.909H61.628a.605.605,0,0,0-.454.151.514.514,0,0,0-.151.454L62.6,129.22a3,3,0,0,0,3,2.632h7.625a3,3,0,0,0,3.026-2.723l1.3-13.676a.514.514,0,0,0-.151-.393A.6.6,0,0,0,76.938,114.909Zm-1.906,14.16a1.755,1.755,0,0,1-1.815,1.573H65.591a1.725,1.725,0,0,1-1.785-1.543l-1.513-12.98H76.272Z"
            transform="translate(-58.814 -108.252)"
            fill="#fff"
          />
          <Path
            id="Path_34187"
            data-name="Path 34187"
            d="M43.326,2.723H37.093V1.755A1.694,1.694,0,0,0,35.46,0h-3.9A1.694,1.694,0,0,0,29.83,1.663q0,.046,0,.092v.968H23.6a.605.605,0,1,0,0,1.21H43.326a.605.605,0,1,0,0-1.21Zm-7.443-.968v.968H31.041V1.755a.484.484,0,0,1,.514-.545h3.812a.484.484,0,0,1,.517.449A.478.478,0,0,1,35.882,1.755Z"
            transform="translate(-22.993 0)"
            fill="#fff"
          />
        </G>
      </G>
    </Svg>
  );
}

const screenpx = 32;

const dstyle = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#555555A0",
    paddingHorizontal: screenpx + 10,
    alignItems: "center",
    justifyContent: "center",
  },
  tview: {
    borderRadius: 24,
    overflow: "hidden",
  },
  wrapper: {
    paddingHorizontal: 36,
    paddingVertical: 32,
    backgroundColor: "white",
    borderRadius: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    paddingBottom: 16,
  },
  comment: {
    fontSize: 12,
    lineHeight: 20,
    color: "gray",
    paddingBottom: 16,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    borderRadius: 24,
    overflow: "hidden",
  },
});

const headerStyle = StyleSheet.create({
  container: {
    width: "100%",
    height: 160,
  },
  headerContainer: {
    width: "100%",
    height: "100%",
    paddingHorizontal: screenpx,
    paddingTop: 48,
  },
  topMenu: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
    flex: 1,
    paddingLeft: 12,
  },
  menuWrapper: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  svgWrapper: {
    padding: 4,
    marginLeft: 8,
  },
  comment: {
    fontSize: 13,
    fontWeight: "bold",
    color: "white",
    lineHeight: 26,
    paddingLeft: 12,
  },
});

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: -24,
    borderRadius: 24,
    backgroundColor: "white",
    paddingHorizontal: screenpx,
  },
  commentWrapper: {
    marginTop: 32,
    borderWidth: 1,
    borderRadius: 7,
    borderColor: "gray",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  comment: {
    fontSize: 13,
    fontWeight: "bold",
    color: "black",
    lineHeight: 26,
  },
  title: {
    paddingTop: 24,
    marginBottom: 6,
    fontSize: 16,
    fontWeight: "bold",
  },
  content: {
    paddingLeft: 16,
  },
  tView: {
    width: "100%",
    height: 50,
    borderRadius: 7,
    overflow: "hidden",
    marginTop: 16,
  },
  topButton: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
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
  title: {
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderColor: color.blue,
    borderRadius: 7,
    fontSize: 14,
    height: 240,
    marginBottom: 24,
    textAlignVertical: "top",
  },
  locationInput: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderColor: color.blue,
    borderRadius: 7,
    fontSize: 14,
    marginBottom: 24,
  },
});
