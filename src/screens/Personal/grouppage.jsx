import React, { useState, useEffect, useCallback, useMemo } from "react";
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
} from "react-native";
import { SelectAttachment } from "../../components/SelectAttachment";
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from "expo-file-system";
import * as Location from 'expo-location';
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { Svg, G, Path } from "react-native-svg";
import { navName } from "../../navigation/Paths";
import { color, getMessageTime, groupMember } from "../../assets/stdafx";
import { BackButton } from "../../components/backbutton";
import { ModalButton } from "../../components/modalbutton";
import { BottomBar } from "./bottombar";
import { Loading } from "../../components/loading";
import { addinfo } from "../../redux/actioncreators";
import GroupBack from "../../assets/svg/group-back.png";
import SuccessAsset from "../../assets/svg/success.png";
import { firestore, functions, storage } from "../../config/firebase";
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
import {
  ref,
  uploadBytes,
  getDownloadURL,
  uploadString,
  deleteObject,
} from "firebase/storage";
import { httpsCallable } from "firebase/functions";
import MapView from 'react-native-maps';

export default function GroupPage({ route, navigation }) {
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const addInfo = (info) => dispatch(addinfo(info));

  const { groupId, memberType, creator, image } = route.params;

  const [bModal, setModal] = useState(false);
  const [bLoading, setLoading] = useState(false);
  const [bDelete, setDelete] = useState(false);
  const [bConfirm, setConfirm] = useState(false);
  const [msgs, setMsgs] = useState([]);
  const [description, setDescription] = useState("");
  const [viewAll, setViewAll] = useState(false);
  const [members, setMembers] = useState(false);

  const [attachShow, setAttachShow] = useState(false);
  const [attach, setAttach] = useState({
    type: '',
    name: '',
    uri: ''
  });

  const sendNotification = httpsCallable(functions, 'sendNotification');

  let lastTime = undefined;
  let chatScribe = undefined;

  useEffect(() => {
    const q = query(
      collection(firestore, `groupchat${groupId}`),
      orderBy("time", "asc")
    );
    chatScribe = onSnapshot(q, (querySnapshot) => {
      if (querySnapshot) {
        const chatData = querySnapshot.docs;
        setMsgs([...chatData.map((x) => x.data())]);
        if (chatData.length) {
          lastTime = chatData[chatData.length - 1].data().time;
        }
      }
    });

    getDoc(doc(firestore, "groups", groupId)).then((snapShot) => {

      const groupData = snapShot.data();
      const groupMembers = groupData.members;

      const array = [];

      getDoc(doc(firestore, "users", groupData.creator)).then((userShot) => {
        const userData = userShot.data();
        if (userData.uid != user.uid) {
          array.push({
            photo: userData.photo,
            name: userData.name,
            token: userData.token
          });
        }
        setMembers([...array]);
      });

      groupMembers.map(async (member) => {
        getDoc(doc(firestore, "users", member.id)).then((userShot) => {
          const userData = userShot.data();
          if (userData.uid != user.uid) {
            array.push({
              photo: userData.photo ? userData.photo : "",
              name: userData.name,
              token: userData.token
            });
          }
          setMembers([...array]);
        });
      });
    });
    return () => {
      updateUserGroups();
      chatScribe();
    };
  }, [route.params]);

  const onBack = () => {
    updateUserGroups();
    chatScribe();
    setMsgs([]);
    setDescription("");
    setMembers([]);
  };

  const deleteCancel = () => {
    setDelete(false);
  };

  const deleteOk = () => {
    setDelete(false);
    setConfirm(true);
  };

  const deleteGroup = () => {
    setLoading(true);
    const collectionRef = collection(firestore, `groupchat${groupId}`);
    getDocs(collectionRef).then((snapShot) => {
      snapShot.docs.map(async (data) => {
        deleteDoc(doc(firestore, `groupchat${groupId}`, data.id));
      });
    });
    updateGroupCnt();
    const storageRef = ref(storage, image.path);
    deleteObject(storageRef).then(() => {
      deleteDoc(doc(firestore, "groups", groupId)).then(() => {
        navigation.goBack();
      });
    });
  };

  const updateGroupCnt = async () => {
    const array = user.groups.filter((x) => x.id !== groupId);
    const info = { groupcnt: user.groupcnt - 1, groups: array };
    const docRef = doc(firestore, "users", user.uid);
    updateDoc(docRef, info).then(() => {
      addInfo({ groupcnt: user.groupcnt - 1 });
    });
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

  const onSendMsg = async (txt) => {
    if (txt !== "" || attach.name != '') {
      const src = await uploadFile();
      const msgContent = {
        photo: user.photo,
        userid: user.uid,
        msg: txt,
        time: new Date(),
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
      addDoc(collection(firestore, `groupchat${groupId}`), msgContent);
      send(txt);
    }
  };

  const onDownload = async (attach, attachName) => {
    setLoading(true);
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
    const tokenArray = [];
    members.forEach(member => {
      tokenArray.push({
        to: member.token,
        sound: "default",
        title: "Breakzen",
        body: txt,
        priority: "high",
      });
    })
    await sendNotification({
      tokenArray: tokenArray,
    })
  }

  const updateUserGroups = () => {
    if (lastTime) {
      const { groups } = user;
      const groupIndex = groups.findIndex((x) => x.id === groupId);
      if (groupIndex !== -1 && groups[groupIndex].chattime !== lastTime) {
        groups[groupIndex].chattime = lastTime;
        const info = { groups };
        updateDoc(doc(firestore, "users", user.uid), info);
      }
    }
  };

  const onDelete = () => {
    setDelete(true);
  };

  const onEdit = () => {
    setModal(true);
  };

  const onModalOk = (param) => {
    setModal(false);
    updateDoc(doc(firestore, "groups", groupId), { description: param }).then(
      () => {
        setDescription(param);
      }
    );
  };

  const HomeHeaderMemo = useCallback(
    () => (
      <HomeHeader
        navigation={navigation}
        groupId={groupId}
        creator={creator}
        userId={user.uid}
        memberType={memberType}
        setDescription={setDescription}
        onDelete={onDelete}
        onEdit={onEdit}
        onBack={onBack}
      />
    ),
    [route.params]
  );

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView style={{ width: "100%", height: "100%" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ImageBackground
          resizeMode="cover"
          style={headerStyle.container}
          source={GroupBack}
        >
          <HomeHeaderMemo />
          <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
          >
            <View style={headerStyle.commentWrapper}>
              <TouchableOpacity onPress={() => setViewAll(!viewAll)}>
                <Text style={headerStyle.comment} numberOfLines={viewAll ? 0 : 3}>
                  {description}
                </Text>
              </TouchableOpacity>
            </View>
            {msgs.map((msg, index) => (
              <ChatBoxA
                key={index}
                active={user.uid === msg.userid}
                msg={msg}
                download={() => onDownload(msg.attach, msg.attachName)}
                onMapPress={() => onMapPress(msg.latitude, msg.longitude)}
                time={getMessageTime(msg.time)}
              />
            ))}
            <View style={{ height: 12 }} />
          </ScrollView>
          {(creator === user.uid || memberType === groupMember.member) && (
            <View
              style={{ paddingHorizontal: screenpx, backgroundColor: "white" }}
            >
              <BottomBar onPress={onSendMsg}
                onAttach={onAttach}
                onCancelAttach={onCancelAttach}
                attach={attach} />
            </View>
          )}

          {bDelete && <DeleteGroup onCancel={deleteCancel} onOk={deleteOk} />}
          {bConfirm && <DeleteConfirm onOk={deleteGroup} />}

          {bModal && (
            <SelectModal
              description={description}
              onCancel={() => setModal(false)}
              onOk={(param) => onModalOk(param)}
            />
          )}
        </ImageBackground>
      </KeyboardAvoidingView>
      {attachShow &&
        <SelectAttachment onDocument={onDocument}
          onLocation={onLocation}
          onCancel={() => setAttachShow(false)} />
      }
      {bLoading && <Loading />}
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

function HomeHeader(props) {
  const { navigation, groupId, creator, userId, memberType } = props;
  const { setDescription } = props;
  const [creatorName, setCreatorName] = useState("");
  const [publicStr, setPublic] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [memberCnt, setMemberCnt] = useState("");
  const [members, setMembers] = useState([]);

  const onPath = () => {
    if (creator === userId || memberType === groupMember.member) {
      navigation.navigate(navName.GroupRequest, {
        groupId,
        creatorName,
      });
    } else {
      alert("Only for members");
    }
  };

  const onViewAll = () => {
    navigation.navigate(navName.GroupMember, {
      groupId,
      creatorName,
    });
  };

  useEffect(() => {
    getDoc(doc(firestore, "groups", groupId)).then((snapShot) => {
      const groupData = snapShot.data();
      setPublic(groupData.public ? "Public" : "Private");
      setTitle(groupData.title);
      setDate(groupData.date);
      setLocation(groupData.location);
      setDescription(groupData.description);

      const groupMembers = groupData.members;
      setMemberCnt(groupMembers.length + 1);

      const array = [];

      getDoc(doc(firestore, "users", groupData.creator)).then((userShot) => {
        const userData = userShot.data();
        setCreatorName(userData.name);
        array.push({
          photo: userData.photo ? userData.photo : "",
          name: userData.name,
        });
        setMembers([...array]);
      });

      groupMembers.map(async (member) => {
        getDoc(doc(firestore, "users", member.id)).then((userShot) => {
          const userData = userShot.data();
          array.push({
            photo: userData.photo ? userData.photo : "",
            name: userData.name,
          });
          setMembers([...array]);
        });
      });
    });
  }, []);

  return (
    <View>
      <View style={headerStyle.headerContainer}>
        <View style={headerStyle.topMenu}>
          <View style={headerStyle.menuWrapper}>
            <BackButton navigation={navigation} onPress={props.onBack} white />
            <View>
              <Text style={headerStyle.title}>{title}</Text>
              <Text style={headerStyle.creator}>
                {creatorName} |{publicStr}
              </Text>
            </View>
          </View>
          <View style={headerStyle.menuWrapper}>
            {userId === creator && (
              <TouchableOpacity onPress={props.onEdit} background={color.blue}>
                <View style={headerStyle.svg_item}>
                  <Svg_Edit />
                </View>
              </TouchableOpacity>
            )}
            {userId === creator && (
              <TouchableOpacity
                onPress={props.onDelete}
                background={color.blue}
              >
                <View style={headerStyle.svg_item}>
                  <Svg_Trash />
                </View>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={onPath} background={color.blue}>
              <View style={headerStyle.svg_item}>
                <Svg_Path />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={headerStyle.dateLocation}>
          Date: {date} | Location: {location}
        </Text>
        <View style={headerStyle.memberMenu}>
          <Text style={headerStyle.memberCnt}>Members ({memberCnt})</Text>
          <TouchableOpacity onPress={onViewAll}>
            <View>
              <Text style={headerStyle.memberCnt}>View All</Text>
            </View>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: "row" }}>
            {members.map((member, index) => (
              <MemberItem key={index} member={member} />
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

function MemberItem(props) {
  const { member } = props;
  return (
    <View style={headerStyle.memberView}>
      <View style={headerStyle.photoWrapper}>
        <Image style={headerStyle.photo} source={{ uri: member.photo ? member.photo : "" }} />
      </View>
      <Text style={headerStyle.memberName} numberOfLines={1}>
        {member.name}
      </Text>
    </View>
  );
}

function ChatBoxA(props) {
  const msg = props.msg;
  return (
    <View style={cstyle.container}>
      <Image style={cstyle.photo} source={{ uri: msg.src }} />
      <View style={[cstyle.containerA]}>
        <View
          style={[
            cstyle.wrapper,
            cstyle.wrapperA,
            props.active && { backgroundColor: color.blue },
          ]}
        >
          {msg.message != '' &&
            <Text style={[cstyle.message, props.active && { color: "white" }]}>
              {msg.message}
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
          <Text style={cstyle.time}>{props.time}</Text>
        </View>
      </View>
    </View>
  );
}

function DeleteGroup(props) {
  return (
    // <View style={[dstyle.container, props.show ? {} : { display: "none" }]}>
    <View style={[dstyle.container]}>
      <View style={dstyle.wrapper}>
        <Text style={dstyle.title}>Delete Group?</Text>
        <Text style={dstyle.comment}>
          Are you sure you want to delete this group from list?
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View
            style={[
              dstyle.button,
              { backgroundColor: color.gray, marginRight: 4 },
            ]}
          >
            <TouchableOpacity onPress={props.onCancel}>
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
    <View style={[dstyle.container]}>
      {/* <View style={[dstyle.container, props.show ? {} : { display: "none" }]}> */}
      <View style={dstyle.tview}>
        <TouchableOpacity onPress={props.onOk} background={color.blue}>
          <View style={dstyle.wrapper}>
            <Image style={{ alignSelf: "center" }} source={SuccessAsset} />
            <Text style={dstyle.comment}>
              Group was deleted successfully and will be removed from list
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Svg_Trash() {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 20.938 23.601"
    >
      <G id="delete_6_" data-name="delete (6)" transform="translate(-22.993 0)">
        <G
          id="Group_39357"
          data-name="Group 39357"
          transform="translate(22.993 0)"
        >
          <G
            id="Group_39356"
            data-name="Group 39356"
            transform="translate(0 0)"
          >
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
      </G>
    </Svg>
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

function Svg_Path() {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 19.354 23.601"
    >
      <G
        id="icons_share"
        data-name="icons/share"
        transform="translate(-6.636 -4.013)"
      >
        <Path
          id="path"
          d="M13.419,15.86a2.977,2.977,0,0,1,.108.968,5.924,5.924,0,0,1-.108.968l5.7,4.247a3.735,3.735,0,1,1-1.29,2.8,5.924,5.924,0,0,1,.108-.968l-5.7-4.247a3.641,3.641,0,0,1-2.473.968,3.763,3.763,0,1,1,0-7.527,3.641,3.641,0,0,1,2.473.968l5.7-4.247a7.346,7.346,0,0,1-.108-1.021,3.763,3.763,0,1,1,3.763,3.763,3.641,3.641,0,0,1-2.473-.968l-5.7,4.3Zm8.172-5.484a1.613,1.613,0,1,0-1.613-1.613,1.584,1.584,0,0,0,1.613,1.613Zm0,16.128a1.613,1.613,0,1,0-1.613-1.613A1.584,1.584,0,0,0,21.591,26.5ZM9.763,18.44A1.613,1.613,0,1,0,8.15,16.827,1.584,1.584,0,0,0,9.763,18.44Z"
          transform="translate(0.636 -0.987)"
          fill="#fff"
        />
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
    paddingHorizontal: 42,
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
  button: {
    borderRadius: 24,
    overflow: "hidden",
  },
});

const headerStyle = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  headerContainer: {
    width: "100%",
    // height: '100%',
    paddingHorizontal: screenpx,
    paddingTop: 48,
    paddingBottom: 16,
  },
  topMenu: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
    paddingLeft: 8,
  },
  creator: {
    fontSize: 12,
    color: "white",
    paddingLeft: 8,
  },
  dateLocation: {
    color: "white",
    marginBottom: 8,
  },
  menuWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentWrapper: {
    borderWidth: 1,
    borderRadius: 7,
    borderColor: "gray",
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 0,
  },
  comment: {
    fontSize: 12,
    lineHeight: 18,
    paddingVertical: 6,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
  },
  svg_item: {
    padding: 4,
    marginLeft: 4,
  },
  memberMenu: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  memberCnt: {
    color: "white",
  },
  memberView: {
    width: 48,
    marginHorizontal: 12,
  },
  photoWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    padding: 3,
    borderWidth: 1,
    borderColor: "white",
  },
  photo: {
    width: "100%",
    height: "100%",
    borderRadius: 32,

    marginBottom: 4,
  },
  memberName: {
    textAlign: "center",
    color: "white",
    fontSize: 12,
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
    marginTop: 20,
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
    width: "100%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: "white",
    paddingHorizontal: screenpx,
    // paddingTop: 24,
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
});
