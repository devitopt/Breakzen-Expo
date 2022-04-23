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
import Svg, { Path, G } from "react-native-svg";
import { useSelector, useDispatch } from "react-redux";
import { BackButton } from "../../components/backbutton";
import { navName } from "../../navigation/Paths";
import {
  color,
  memberType,
  groupMember,
  initalValue,
  googleMapApi
} from "../../assets/stdafx";
import { addinfo } from "../../redux/actioncreators";
import { firestore } from "../../config/firebase";
import {
  doc,
  collection,
  getDoc,
  onSnapshot,  
  updateDoc,
  query,
} from "firebase/firestore";


export default function Groups({ navigation }) {
  const user = useSelector((state) => state.user);
  const userGroups = user.groups;
  const default_url = `${googleMapApi}&origins=${user.location}`;

  const dispath = useDispatch();
  const addInfo = (info) => dispath(addinfo(info));
  
  const [groups, setGroups] = useState([]);

  const addGroup2User = (groupId) => {
    const docRef = doc(firestore, "users", user.uid);
    updateDoc(docRef, {
      groups: [...userGroups, { id: groupId, chattime: initalValue.groupTime }],
    });
  };

  const removeGroup2User = async (groupId) => {
    const array = userGroups.filter((x) => x.id != groupId);
    const docRef = doc(firestore, "users", user.uid);
    updateDoc(docRef, { groups: [...array] });
  };

  const updateGRequests = async () => {
    const docRef = doc(firestore, "users", user.uid);
    const snapShot = await getDoc(docRef);
    const info = { grequests: snapShot.data().grequests - 1 };
    updateDoc(docRef, info).then(() => {
      addInfo(info);
    });
  };

  const isNearBy = async (groupdata) => {
    if (
      !(user.currentlocation || user.location) ||
      !(groupdata.location || groupdata.latitude || groupdata.longitude)
    )
      return false;
    
    let url = `${googleMapApi}&origins=${user.currentlocation.latitude},${user.currentlocation.longitude}&destinations=${groupdata.latitude},${groupdata.longitude}`;
    return await fetch(url)
    .then((response) => response.json())
    .then((json) => {
      if (json.rows.length == 0)  return false;
      const { elements } = json.rows[0];
      const distance = elements[0].distance.value;
      if (distance < 16000) return true;
      return false;
    });
    
  };

  useEffect(() => {
    
    const q = query(collection(firestore, "groups"));
    const groupSubscribe = onSnapshot(q, (snapShot) => {
      if (snapShot) {
        const groupArray = [];
        snapShot.forEach((x) => {
          const groupdata = x.data();
          if (groupdata.creator == user.uid || isMember(groupdata.members) || groupdata.invites.includes(user.uid)) { 
            groupArray.push({...groupdata, id: x.id });            
          } else {    
            isNearBy(groupdata).then((value) => {
              if (value === true) {
                groupArray.push({...groupdata, id: x.id });
              }
            })          
          }
        })
        setGroups([...groupArray]);
      }
    })

    return () => {
      groupSubscribe();
    };
  }, []);

  const isMember = (members) => {
    return members.some(function(member) {
      return member.id === user.uid
    });
  }

  return (
    <View style={styles.containter}>
      <View style={styles.paddingWrapper}>
        <Header
          navigation={navigation}
          membership={user.membership}
          groupcnt={user.groupcnt}
        />
      </View>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {groups.length > 0 ? (
        groups.map((group, index) => (
          <GroupItem
            key={index}
            navigation={navigation}
            group={group}
            userId={user.uid}
            unRead={user[group.id]}
            addGroup2User={() => addGroup2User(group.id)}
            updateGRequests={updateGRequests}
            removeGroup2User={() => removeGroup2User(group.id)}
          />
        ))
        ) : (
          <Text style={styles.emptyText}>You may don't see Social Groups around you; Be the first creating one</Text>
        )}
      </ScrollView>
    </View>
  );
}

function Header(props) {
  const { navigation, membership, groupcnt } = props;
  return (
    <View style={hstyle.containter}>
      <View style={hstyle.topMenu}>
        <BackButton navigation={navigation} />
        <Text style={hstyle.title}>Social Groups</Text>
        <View style={hstyle.addButton}>
          {(membership == memberType.pro || groupcnt < 3) && (
            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate(navName.CreateSocialGroup)
              }
            >
              <View style={styles.svg_plus}>
                <Svg_Plus />
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={hstyle.searchBox}>
        <Svg_Search />
        <TextInput style={hstyle.searchBar} placeholder="search" />
      </View>
    </View>
  );
}

function GroupItem(props) {
  const { navigation, group, userId, unRead } = props;

  const { addGroup2User } = props;
  const { removeGroup2User } = props;
  const { updateGRequests } = props;

  const { title, creator, image, limit, id, members, invites } = group;
  const bPublic = group.public;
  const memberCnt = members.length + 1; // +1 means creator

  const [decline, setDecLine] = useState(false);
  const [memberType, setMemberType] = useState("");
  const [memberDate, setMemberDate] = useState("");

  // Component Didupdate
  useEffect(() => {
    const memberInfo = members.find((x) => x.id == userId);
    if (creator == userId) {
      setMemberType(groupMember.creator);
    } else if (memberInfo) {
      setMemberDate(memberInfo.date);
      setMemberType(groupMember.member);
    } else if (invites.includes(userId)) {
      setMemberType(groupMember.invite);
    } else {
      setMemberType(groupMember.none);
      if (bPublic == false) setDecLine(true);
    }
  });

  const goToGroupPage = () => {
    if (
      memberType == groupMember.member ||
      memberType == groupMember.creator ||
      bPublic
    ) {
      navigation.navigate(navName.GroupPage, {
        groupId: id,
        memberType,
        creator,
        image,
      });
    } else alert("Only members can access to Private Group");
  };

  // There is only case of pulbic
  const joinGroup = () => {
    const dateString = new Date().toDateString();
    const info = { id: userId, date: dateString };
    const index = invites.findIndex((x) => x == userId);
    if (index != -1) invites.splice(index, 1);
    const docRef = doc(firestore, "groups", id);
    updateDoc(docRef, { members: [...members, info], invites }).then(() => {
      addGroup2User();
      setMemberType(groupMember.member);
      setMemberDate(dateString);
    });
  };

  const acceptInvitation = () => {
    if (!bPublic && memberCnt >= limit) {
      alert("Members Limit");
    } else {
      const dateString = new Date().toDateString();
      const info = { id: userId, date: dateString };
      const index = invites.findIndex((x) => x == userId);
      if (index != -1) invites.splice(index, 1);
      const docRef = doc(firestore, "groups", id);
      updateDoc(docRef, { members: [...members, info], invites }).then(() => {
        addGroup2User();
        updateGRequests();
        setMemberType(groupMember.member);
        setMemberDate(dateString);
      });
    }
  };

  const decLine = async () => {
    const index = invites.findIndex((x) => x == userId);
    invites.splice(index, 1);
    const docRef = doc(firestore, "groups", id);
    updateDoc(docRef, { invites }).then(() => {
      updateGRequests();
    });
  };

  const leaveGroup = async () => {
    const index = members.findIndex((x) => x.id == userId);
    members.splice(index, 1);
    const docRef = doc(firestore, "groups", id);
    updateDoc(docRef, { members }).then(() => {
      removeGroup2User();
      setMemberType(groupMember.none);
      if (!bPublic) setDecLine(true);
    });
  };

  return (
    !decline && (
      <View style={styles.tGroupItem}>
        <TouchableOpacity onPress={goToGroupPage} background={color.blue}>
          <View
            style={[
              styles.groupItem,
              (unRead || memberType == groupMember.invite) && {
                backgroundColor: "#7DBDEF64",
              },
            ]}
          >
            <Image style={styles.groupImage} source={{ uri: image.src }} />
            <View style={styles.description}>
              <View style={styles.titleWrapper}>
                <Text
                  style={[
                    styles.title,
                    unRead ? { color: color.blue } : { color: "black" },
                  ]}
                >
                  {title}
                  {bPublic ? (
                    <Text style={{ color: color.blue }}>{" | public"}</Text>
                  ) : (
                    <Text style={{ color: "#EF7D7D" }}>{" | private"}</Text>
                  )}
                </Text>
                <TouchableOpacity
                  background={color.blue}
                  onPress={goToGroupPage}
                >
                  <View style={styles.goToGroup}>
                    <Svg_Back />
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.cntWrapper}>
                <Svg_User />
                <Text style={styles.cnt}>
                  {memberCnt} {!bPublic && `/ ${limit}`}
                </Text>
                <Text style={styles.member}>participants</Text>
              </View>
              {memberType == groupMember.creator && (
                <Text style={styles.date}>You are creator of this group</Text>
              )}
              {memberType == groupMember.member && (
                <View style={styles.menuBar}>
                  <Text style={styles.date}>{`Since ${memberDate}`}</Text>
                  <TouchableOpacity
                    onPress={leaveGroup}
                    background={color.blue}
                  >
                    <View style={[styles.menuWrapper, { marginLeft: 16 }]}>
                      <Text style={[styles.menuText, { color: "#EF7D7D" }]}>
                        Leave
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              {memberType == groupMember.request && (
                <Text style={styles.date}>Joining Request Sent</Text>
              )}
              {memberType == groupMember.none && (
                <View style={styles.menuBar}>
                  <TouchableOpacity onPress={joinGroup} background={color.blue}>
                    <View style={styles.menuWrapper}>
                      <Text style={[styles.menuText, { color: color.blue }]}>
                        Join this group
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              {memberType == groupMember.invite && (
                <View style={styles.menuBar}>
                  <TouchableOpacity
                    onPress={acceptInvitation}
                    background={color.blue}
                  >
                    <View style={styles.menuWrapper}>
                      <Text style={[styles.menuText, { color: "#209040" }]}>
                        Accept Invitation
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={decLine} background={color.blue}>
                    <View style={[styles.menuWrapper, { marginLeft: 16 }]}>
                      <Text style={[styles.menuText, { color: "#EF7D7D" }]}>
                        Decline
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  );
}

function Svg_User() {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="9.509"
      height="11.397"
      viewBox="0 0 9.509 11.397"
    >
      <G id="user_33_" data-name="user (33)" transform="translate(0 0)">
        <Path
          id="Path_34159"
          data-name="Path 34159"
          d="M89.777,5.49a2.656,2.656,0,0,0,1.941-.8,2.656,2.656,0,0,0,.8-1.941A2.657,2.657,0,0,0,91.718.8a2.744,2.744,0,0,0-3.882,0,2.656,2.656,0,0,0-.8,1.941,2.656,2.656,0,0,0,.8,1.941A2.657,2.657,0,0,0,89.777,5.49Zm0,0"
          transform="translate(-85.095)"
          fill="#7dbdef"
        />
        <Path
          id="Path_34160"
          data-name="Path 34160"
          d="M9.486,250.575a6.78,6.78,0,0,0-.092-.72,5.674,5.674,0,0,0-.177-.724,3.576,3.576,0,0,0-.3-.675,2.548,2.548,0,0,0-.449-.585,1.979,1.979,0,0,0-.645-.405A2.229,2.229,0,0,0,7,247.316a.836.836,0,0,0-.446.189c-.134.087-.29.188-.465.3a2.663,2.663,0,0,1-.6.265,2.335,2.335,0,0,1-1.471,0,2.657,2.657,0,0,1-.6-.265l-.465-.3a.834.834,0,0,0-.446-.189,2.226,2.226,0,0,0-.823.149,1.977,1.977,0,0,0-.645.405,2.548,2.548,0,0,0-.449.585,3.583,3.583,0,0,0-.3.675,5.687,5.687,0,0,0-.177.724,6.757,6.757,0,0,0-.092.72c-.015.218-.023.444-.023.673a1.893,1.893,0,0,0,.562,1.432,2.023,2.023,0,0,0,1.448.528H7.5a2.023,2.023,0,0,0,1.448-.528,1.892,1.892,0,0,0,.562-1.432c0-.23-.008-.456-.023-.673Zm0,0"
          transform="translate(0 -241.811)"
          fill="#7dbdef"
        />
      </G>
    </Svg>
  );
}

function Svg_Plus() {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="16.291"
      height="16.291"
      viewBox="0 0 16.291 16.291"
    >
      <G id="plus-sign" transform="translate(-0.006)">
        <Path
          id="Path_34158"
          data-name="Path 34158"
          d="M16.3,8.146a1.426,1.426,0,0,1-1.426,1.426H9.577v5.294a1.425,1.425,0,1,1-2.851,0V9.571H1.431a1.425,1.425,0,0,1,0-2.851H6.726V1.426a1.426,1.426,0,0,1,2.851,0V6.72h5.295A1.426,1.426,0,0,1,16.3,8.146Z"
          transform="translate(0 0)"
          fill="#7dbdef"
        />
      </G>
    </Svg>
  );
}

function Svg_Search() {
  return (
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
  );
}

function Svg_Back() {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="5.355"
      height="9.727"
      viewBox="0 0 5.355 9.727"
    >
      <G id="back_2_" data-name="back (2)" transform="translate(0 0)">
        <Path
          id="Chevron_Right"
          d="M59.327,5.212,54.953,9.584a.491.491,0,0,1-.7-.694l4.027-4.026L54.258.839a.491.491,0,1,1,.7-.694l4.374,4.373A.5.5,0,0,1,59.327,5.212Z"
          transform="translate(-54.113 -0.001)"
          fill="#474461"
        />
      </G>
    </Svg>
  );
}

const styles = StyleSheet.create({
  containter: {
    height: "100%",
    backgroundColor: "white",
  },
  paddingWrapper: {
    paddingHorizontal: 28,
  },
  emptyText: {
    marginTop: 48,
    color: "gray",
    textAlign: "center",
    paddingHorizontal: 28,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  tGroupItem: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 8,
  },
  groupItem: {
    flexDirection: "row",
    height: 100,
    padding: 8,
  },
  groupImage: {
    width: undefined,
    height: "100%",
    aspectRatio: 1 / 1,
    borderRadius: 12,
    resizeMode: "cover",
  },
  description: {
    flex: 1,
    paddingLeft: 20,
    justifyContent: "space-evenly",
  },
  titleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
  },
  goToGroup: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  cntWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  cnt: {
    paddingLeft: 8,
    fontSize: 12,
    fontWeight: "500",
  },
  member: {
    paddingLeft: 6,
    fontSize: 12,
    color: "gray",
  },
  date: {
    fontSize: 12,
    fontWeight: "500",
  },
  svg_dollar: {
    padding: 4,
    marginRight: 4,
  },
  svg_plus: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  menuBar: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuWrapper: {
    padding: 1,
  },
  menuText: {
    fontSize: 12,
    fontWeight: "bold",
  },
});

const hstyle = StyleSheet.create({
  containter: {
    paddingTop: 48,
    paddingBottom: 24,
  },
  topMenu: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 36,
    overflow: "hidden",
  },
  searchBox: {
    display: "none",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  searchSvg: {
    position: "absolute",
    left: 12,
  },
  searchBar: {
    textAlign: "center",
    fontSize: 16,
    borderColor: color.blue,
    borderWidth: 1,
    borderRadius: 12,
    width: "100%",
  },
});
