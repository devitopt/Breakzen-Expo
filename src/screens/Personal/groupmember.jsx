import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/core";
import { BackButton } from "../../components/backbutton";
import { color } from "../../assets/stdafx";
import { navName } from "../../navigation/Paths";
import GroupBack from "../../assets/svg/group-back.png";
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
import moment from "moment";

export default function GroupMember({ route, navigation }) {
  const { groupId, creatorName } = route.params;

  const [title, setTitle] = useState("");
  const [publicStr, setPublicStr] = useState("");
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const docRef = doc(firestore, "groups", groupId);
    getDoc(docRef).then((snapShot) => {
      const groupData = snapShot.data();
      setTitle(groupData.title);
      setPublicStr(groupData.public ? "public" : "private");

      const gMembers = groupData.members ? groupData.members : [];
      const memberArray = [];

      getDoc(doc(firestore, "users", groupData.creator)).then((snapShot) => {
        const userData = snapShot.data();
        memberArray.push({
          professional: userData.professional,
          photo: userData.photo,
          name: userData.name,
          uid: snapShot.id,
          date: moment(groupData.date).format("ddd MMM DD yyyy"),
        });
        setMembers([...memberArray]);
      });

      gMembers.map((member) => {
        getDoc(doc(firestore, "users", member.id)).then((snapShot) => {
          const userData = snapShot.data();
          memberArray.push({
            professional: userData.professional,
            photo: userData.photo,
            name: userData.name,
            uid: snapShot.id,
            date: member.date,
          });
          setMembers([...memberArray]);
        });
      });
    });
  }, [route.params]);

  // useFocusEffect(
  //   useCallback(() => {

  //   }, [])
  // );

  const onPressUser = (index) => {
    if (members[index].professional) {
      navigation.navigate(navName.Profile, { userId: members[index].uid });
    } else {
      navigation.navigate(navName.ProfileClient, {
        userId: members[index].uid,
      });
    }
  };

  return (
    <View style={{ width: "100%", height: "100%" }}>
      <HomeHeader
        navigation={navigation}
        creatorName={creatorName}
        title={title}
        publicStr={publicStr}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {members.map((member, index) => (
          <TouchableOpacity
            key={index}
            background={color.blue}
            onPress={() => onPressUser(index)}
          >
            <View style={styles.memberView}>
              <Image style={styles.photo} source={{ uri: member.photo }} />
              <View style={styles.memberInfo}>
                <Text style={styles.name}>{member.name}</Text>
                <Text style={styles.date}>
                  Joined on 
                  {' '}
                  {member.date}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

function HomeHeader(props) {
  const { navigation, creatorName, title, publicStr } = props;
  return (
    <View>
      <ImageBackground style={headerStyle.container} source={GroupBack}>
        <View style={headerStyle.headerContainer}>
          <View style={headerStyle.topMenu}>
            <View style={headerStyle.menuWrapper}>
              <BackButton navigation={navigation} white />
              <View>
                <Text style={headerStyle.title}>{title}</Text>
                <Text style={headerStyle.creator}>
                  {creatorName} |{publicStr}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const screenpx = 32;

const headerStyle = StyleSheet.create({
  container: {
    width: "100%",
    height: 150,
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
    marginBottom: 16,
  },
  menuWrapper: {
    flexDirection: "row",
    alignItems: "center",
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
});

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: -24,
    borderRadius: 24,
    backgroundColor: "white",
    paddingHorizontal: screenpx - 4,
    // paddingTop: 24,
  },
  memberView: {
    flexDirection: "row",
    marginTop: 24,
    padding: 6,
  },
  memberInfo: {
    justifyContent: "space-around",
    paddingLeft: 24,
  },
  photo: {
    width: 48,
    height: 48,
    borderRadius: 32,
  },
});
