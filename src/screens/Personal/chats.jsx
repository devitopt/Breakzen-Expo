import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { Svg, G, Path } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";
import { BackButton } from "../../components/backbutton";
import { navName } from "../../navigation/Paths";
import {
  chatCollection,
  color,
  getMessageTime,
  messageType,
  isEqualArray,
} from "../../assets/stdafx";
import { addinfo } from "../../redux/actioncreators";
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
} from "firebase/firestore";
import { array } from "yup";

export default function Chats({ navigation }) {
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const addInfo = (info) => dispatch(addinfo(info));

  const requests = user.requests ? user.requests : [];
  const [messages, setMessages] = useState([]);
  const [searchStr, setSearchStr] = useState('');

  let individualSubcscribe = [];
  let textInput = React.createRef();
  const chatUpdate = async (uid, other) => {
    const docRef = doc(firestore, "users", uid);
    const snapShot = await getDoc(docRef);
    const userdata = snapShot.data();
    const array = userdata.chats;
    if (!array.includes(other)) {
      array.push(other);
      await updateDoc(docRef, { chats: array });
    }
  };

  const onConfirm = async (index) => {
    const collectionRef = collection(
      firestore,
      chatCollection(user.uid, requests[index].uid)
    );
    await addDoc(collectionRef, {
      sender: user.uid,
      receiver: requests[index].uid,
      content: "Accepted Connection Request",
      time: new Date(),
      read: false,
    });
    chatUpdate(user.uid, requests[index].uid);
    chatUpdate(requests[index].uid, user.uid);
    onDelete(index);
  };

  const onDelete = async (index) => {
    const rRequests = [...requests]; // if bug occurs use getDocs
    rRequests.splice(index, 1);
    const docRef = doc(firestore, "users", user.uid);
    await updateDoc(docRef, { requests: rRequests });
    addInfo({ requests: rRequests });
  };

  const get_Photo_Name = async (otherid) => {
    const docRef = doc(firestore, "users", otherid);
    const snapShot = await getDoc(docRef);
    const userData = snapShot.data();
    return {
      photo: userData.photo,
      name: userData.name,
      email: userData.email,
    };
  };

  const compare = (other1, other2) => other1.dateTime < other2.dateTime;

  useEffect(() => {
    let lastChats = [];
    const docRef = doc(firestore, "users", user.uid);
    const chatSubscribe = onSnapshot(docRef, (snapShot) => {
      if (snapShot) {
        const userData = snapShot.data();
        const chats = userData.chats;
        if (isEqualArray(chats, lastChats) == false) {
          lastChats = [...chats];
          individualSubcscribe.map((subscribe) => subscribe());
          individualSubcscribe = [];
          const array = new Array(chats.length);
          chats.map((otherid, index) => {
            array[index] = {
              otherid,
              bRead: user[otherid] ? false : true,
              hidden: true,
            };
            const q = query(
              collection(firestore, chatCollection(user.uid, otherid)),
              orderBy("time", "desc"),
              limit(1)
            );
            individualSubcscribe.push(
              onSnapshot(q, (chatShot) => {
                if (chatShot) {
                  if (chatShot.docs.length > 0) {
                    const chatData = chatShot.docs[0].data();
                    array[index].bRead =
                      chatData.receiver == user.uid ? chatData.read : true;
                    array[index].content = chatData.content;
                    array[index].time = getMessageTime(chatData.time);
                    array[index].type = chatData.type;
                    array[index].dateTime =
                      chatData.time.seconds * 1000 +
                      chatData.time.nanoseconds / 1000000;
                    if (
                      chatData.type != messageType.jobpost ||
                      !user.professional
                    )
                      array[index].hidden = false;
                    setMessages([...array]);
                  }
                }
              })
            );
            get_Photo_Name(otherid).then((res) => {
              array[index].photo = res.photo;
              array[index].name = res.name;
              array[index].email = res.email;
              setMessages([...array]);
            });
          });
          setMessages(array.sort(compare));
        }
      }
    });

    return () => {
      chatSubscribe();
      individualSubcscribe.map((subscribe) => subscribe());
      individualSubcscribe = [];
      console.log("Chats Unmounted");
    };
  }, []);

  // In case of be able to remove chats history, code again
  // useEffect(() => {
  //   const chats = user.chats;
  //   const array = new Array(chats.length);
  //   chats.map(async (otherid, index) => {
  //     array[index] = {
  //       otherid,
  //       bRead: !user[otherid],
  //       hidden: true,
  //     };
  //     const q = query(
  //       collection(firestore, chatCollection(user.uid, otherid)),
  //       orderBy("time", "desc"),
  //       limit(1)
  //     );
  //     const chatShot = await getDocs(q);
  //     console.log(chatShot.docs.length);
  //     if (chatShot.docs.length > 0) {
  //       const chatData = chatShot.docs[0].data();
  //       array[index].bRead =
  //         chatData.receiver === user.uid ? chatData.read : true;
  //       array[index].content = chatData.content;
  //       array[index].time = getMessageTime(chatData.time);
  //       array[index].type = chatData.type;
  //       array[index].dateTime =
  //         chatData.time.seconds * 1000 + chatData.time.nanoseconds / 1000000;
  //       if (chatData.type !== messageType.jobpost || !user.professional)
  //         array[index].hidden = false;
  //       setMessages([...array]);
  //     }
  //     get_Photo_Name(otherid).then((res) => {
  //       array[index].photo = res.photo;
  //       array[index].name = res.name;
  //       array[index].email = res.email;
  //       setMessages([...array]);
  //     });
  //   });
  // }, [user.chats]);

  return (
    <View style={{ height: "100%" }}>
      {/* <Header navigation={navigation} others={messages} /> */}
      {/* const { others } = props; */}
      <View style={hstyle.container}>
        <View style={hstyle.topMenu}>
          <BackButton navigation={navigation} />
          <Text style={hstyle.caption}>Individual Chats</Text>
          <View style={hstyle.rightBlank} />
        </View>
        <View style={hstyle.searchBar}>
          <Svg
            style={hstyle.searchSvg}
            xmlns="http://www.w3.org/2000/svg"
            width="14.241"
            height="14.195"
            viewBox="0 0 14.241 14.195"
          >
            <G id="search" transform="translate(0.5 0.5)">
              <G id="Group_10726" data-name="Group 10726">
                <Path
                  id="Path_24601"
                  data-name="Path 24601"
                  d="M13.114,12.725,9.1,8.711a5.243,5.243,0,1,0-.389.389l4.015,4.015a.275.275,0,1,0,.389-.389ZM5.223,9.9A4.673,4.673,0,1,1,9.9,5.223,4.678,4.678,0,0,1,5.223,9.9Z"
                  transform="translate(0 0)"
                  stroke="#000"
                  stroke-width="1"
                />
              </G>
            </G>
          </Svg>
          <TextInput 
            ref={input => { this.textInput = input }}
            style={hstyle.searchInput} 
            placeholder="search"
            defaultValue=""          
            onChangeText={setSearchStr}
          />
        </View>
        <Text style={hstyle.connections}>Connected with:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: "row" }}>            
            {messages.map(
              (message, index) =>
              !message.hidden && (!searchStr || (searchStr && message.name && message.name.includes(searchStr))) && (
                  <UserItem
                    key={index}
                    src={message.photo}
                    otherid={message.otherid}
                    name={message.name}                     
                    email={message.email}
                    navigation={navigation}
                    end={index === messages.length - 1}
                  />
                )
            )}
            {messages.length === 0 && (
              <Text style={hstyle.noConnection}>
                You don't have any connection yet
              </Text>
            )}
          </View>
        </ScrollView>
      </View>


      <ScrollView
        style={{ flex: 1, paddingHorizontal: 28 }}
        showsVerticalScrollIndicator={false}
      >
        {requests.map((request, index) => (
          <RequestItem
            request={request}
            key={index}
            onConfirm={() => onConfirm(index)}
            onDelete={() => onDelete(index)}
          />
        ))}
        {messages
          // .sort(compare)
          .map(
            (msg, index) =>
              msg.hidden !== true && (
                <MessageItem
                  key={index}
                  otherid={msg.otherid}
                  bRead={!user[msg.otherid]}
                  photo={msg.photo}
                  name={msg.name}
                  content={msg.content}
                  time={msg.time}
                  navigation={navigation}
                />
              )
          )}
      </ScrollView>
    </View>
  );
}

export function ModalButton(props) {
  return (
    <View style={fstyle.tconatiner}>
      <TouchableOpacity onPress={props.onPress}>
        <View
          style={[
            fstyle.container,
            props.ok
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

function UserItem(props) {
  return (
    <TouchableOpacity
      onPress={() =>
        props.navigation.navigate(navName.InsideChat, {
          otherid: props.otherid,
        })
      }
      background={color.blue}
    >
      <View style={[ustyle.container, !props.end && { marginRight: 24 }]}>
        <View style={ustyle.imageWrapper}>
          <Image style={ustyle.image} source={{ uri: props.src }} />
        </View>
        <Text style={ustyle.name} numberOfLines={1}>
          {props.name}
        </Text>
        <Text style={ustyle.email} numberOfLines={1}>
          {props.email}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

/* function Header(props) {
  const { others } = props;
  return (
    <View style={hstyle.container}>
      <View style={hstyle.topMenu}>
        <BackButton navigation={props.navigation} />
        <Text style={hstyle.caption}>Individual Chats</Text>
        <View style={hstyle.rightBlank} />
      </View>
      <View style={hstyle.searchBar}>
        <Svg
          style={hstyle.searchSvg}
          xmlns="http://www.w3.org/2000/svg"
          width="14.241"
          height="14.195"
          viewBox="0 0 14.241 14.195"
        >
          <G id="search" transform="translate(0.5 0.5)">
            <G id="Group_10726" data-name="Group 10726">
              <Path
                id="Path_24601"
                data-name="Path 24601"
                d="M13.114,12.725,9.1,8.711a5.243,5.243,0,1,0-.389.389l4.015,4.015a.275.275,0,1,0,.389-.389ZM5.223,9.9A4.673,4.673,0,1,1,9.9,5.223,4.678,4.678,0,0,1,5.223,9.9Z"
                transform="translate(0 0)"
                stroke="#000"
                stroke-width="1"
              />
            </G>
          </G>
        </Svg>
        <TextInput 
          style={hstyle.searchInput} 
          placeholder="search"
          onChangeText={setSearchStr}
        />
      </View>
      <Text style={hstyle.connections}>Connected with:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ flexDirection: "row" }}>
          {others.map(
            (other, index) =>
              other.hidden !== true && (
                <UserItem
                  key={index}
                  src={other.photo}
                  otherid={other.otherid}
                  name={other.name}
                  email={other.email}
                  navigation={props.navigation}
                  end={index === others.length - 1}
                />
              )
          )}
          {others.length === 0 && (
            <Text style={hstyle.noConnection}>
              You don't have any connection yet
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
} */

const MessageItem = (props) => {
  const { otherid, bRead, photo, name, content, time } = props;
  return (
    <TouchableOpacity
      onPress={() => props.navigation.navigate(navName.InsideChat, { otherid })}
      background={color.blue}
    >
      <View style={{ flexDirection: "row", height: 50, marginBottom: 18 }}>
        <View style={mstyle.container}>
          {photo !== "" && (
            <Image style={mstyle.photo} source={{ uri: photo }} />
          )}
        </View>
        <View style={mstyle.messageBox}>
          <Text
            style={[
              mstyle.name,
              !bRead ? { color: color.blue } : { color: "black" },
            ]}
          >
            {name}
          </Text>
          <View style={mstyle.messageWrapper}>
            <View style={mstyle.message}>
              <Text
                style={[mstyle.messageTxt, !bRead && { color: color.blue }]}
                numberOfLines={1}
              >
                {content}
              </Text>
            </View>
            <Text style={mstyle.time}>{time}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const RequestItem = (props) => {
  const { uid, photo, name, time } = props.request;
  const { onConfirm } = props;
  const { onDelete } = props;
  return (
    <View
      style={{
        flexDirection: "row",
        height: 72,
        backgroundColor: "#00000032",
        padding: 4,
        borderRadius: 12,
        marginBottom: 18,
      }}
    >
      <View style={mstyle.container}>
        <Image style={mstyle.photo} source={{ uri: photo }} />
      </View>
      <View style={mstyle.messageBox}>
        <Text style={mstyle.name}>{name}</Text>
        <View style={mstyle.messageWrapper}>
          <View style={mstyle.message}>
            <Text style={mstyle.messageTxt} numberOfLines={1}>
              Sent you a request to connect
            </Text>
          </View>
          <Text style={mstyle.time}>{getMessageTime(time)}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <View style={{ width: "30%", marginRight: 12 }}>
            <ModalButton title="Confirm" ok onPress={onConfirm} />
          </View>
          <View style={{ width: "30%" }}>
            <ModalButton title="Delete" onPress={onDelete} />
          </View>
        </View>
      </View>
    </View>
  );
};

const button_height = 24;

const fstyle = {
  tconatiner: {
    width: "100%",
    height: button_height,
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

const ustyle = StyleSheet.create({
  container: {
    width: 50,
    alignItems: "center",
  },
  imageWrapper: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#7DBDEF",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 44,
    height: 44,
    borderRadius: 44,
  },
  name: {
    paddingTop: 4,
    fontSize: 11,
    fontWeight: "bold",
  },
  email: {
    color: "gray",
    fontSize: 8,
    lineHeight: 10,
  },
});

const hstyle = StyleSheet.create({
  container: {
    paddingTop: 48,
    paddingBottom: 36,
    paddingHorizontal: 28,
  },
  topMenu: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  caption: {
    fontSize: 16,
    fontWeight: "bold",
  },
  rightBlank: {
    width: 36,
    height: 36,
  },
  searchBar: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  connections: {
    fontWeight: "bold",
    marginBottom: 12,
  },
  searchSvg: {
    position: "absolute",
    left: 12,
  },
  searchInput: {
    textAlign: "center",
    fontSize: 16,
    paddingVertical: 8,
    borderColor: color.blue,
    borderWidth: 1,
    borderRadius: 12,
    width: "100%",
  },
  noConnection: {
    color: "gray",
    paddingLeft: 24,
  },
});

const mstyle = StyleSheet.create({
  container: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#7DBDEF",
    alignItems: "center",
    justifyContent: "center",
  },
  photo: {
    width: 44,
    height: 44,
    borderRadius: 44,
  },
  messageBox: {
    flex: 1,
    paddingLeft: 16,
    justifyContent: "space-evenly",
  },
  name: {
    fontSize: 14,
    fontWeight: "bold",
  },
  messageWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  message: {
    flex: 1,
    paddingRight: 8,
  },
  messageTxt: {
    fontWeight: "500",
    fontSize: 12,
    color: "gray",
  },
  time: {
    fontWeight: "500",
    fontSize: 12,
    color: "#7DBDEF",
  },
});
