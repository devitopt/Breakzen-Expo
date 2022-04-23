import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { firestore } from '../../config/firebase';
import { useSelector } from 'react-redux';
import { color, breakzen } from '../../assets/stdafx';
import { navName } from '../../navigation/Paths';
import { BackButton } from '../../components/backbutton';
import GroupBack from '../../assets/svg/group-back.png'
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function GroupMember({ route, navigation }) {
  const user = useSelector((state) => state.user);
  const { groupId, creatorName } = route.params;
  const [title, setTitle] = useState('');
  const [requests, setRequests] = useState([]);
  const [invites, setInvites] = useState([]);
  const [memberCnt, setMemberCnt] = useState(0);
  const [limit, setLimit] = useState(0);
  const [publicStr, setPublciStr] = useState('');

  const sendInvitation = async (memberid) => {
    if (publicStr === 'Private' && limit <= memberCnt) {
      alert('Members Limit');
    } else {
      const array = [...requests];
      const index = array.findIndex((x) => x.uid === memberid);
      array.splice(index, 1);
      const docRef = doc(firestore, 'groups', groupId);
      await updateDoc(docRef, { invites: [...invites, memberid] }).then(() => {
        setRequests([...array]);
        setInvites([...invites, memberid]);
      });

      const docRef1 = doc(firestore, 'users', memberid);
      const userShot = await getDoc(docRef1);
      const { grequests } = userShot.data();
      await updateDoc(docRef1, { grequests: grequests + 1 }).then((x) => {
        //navigation.goBack();
      });      
    }
  };

  useEffect(() => {
    const docRef = doc(firestore, "groups", groupId);
    getDoc(docRef).then((snapShot) => {
      const groupData = snapShot.data();
      setLimit(Number(groupData.limit));
      setTitle(groupData.title);
      setPublciStr(groupData.public ? 'Public' : 'Private');

      const gMembers = groupData.members;
      setMemberCnt(gMembers.length + 1);

      const gInvites = groupData.invites;
      setInvites(gInvites);

      const array = user.chats;    
      const gRequests = array.filter((x) => (
        gMembers.find((e) => e.id === x) === undefined
        && x !== groupData.creator
        && gInvites.includes(x) === false
        && x !== breakzen.uid
      ));      

      const requestArray = [];
      gRequests.map((member) => {
        const docRef = doc(firestore, "users", member);
        getDoc(docRef).then((snapShot) => {
          const userData = snapShot.data();
          requestArray.push({
            photo: userData.photo,
            name: userData.name,
            email: userData.email,
            professional: userData.professional,
            uid: snapShot.id,
          });
          setRequests([...requestArray]);
        })
      });
    });
    
  }, [route.params]);

  const onPressUser = (index) => {
    if (requests[index].professional) {
      navigation.navigate(navName.Profile, { userId: requests[index].uid });
    } else {
      navigation.navigate(navName.ProfileClient, { userId: requests[index].uid });
    }
  };

  return (
    <View style={{ width: '100%', height: '100%' }}>
      <HomeHeader
        navigation={navigation}
        creatorName={creatorName}
        title={title}
        publicStr={publicStr}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {requests.map((member, index) => (
          <TouchableOpacity
            key={index}
            background={(color.blue)}
            onPress={() => onPressUser(index)}
          >
            <View style={styles.memberView}>
              <Image style={styles.photo} source={{ uri: member.photo }} />
              <View style={styles.memberInfo}>
                <Text style={styles.name}>
                  {member.name}                  
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    sendInvitation(member.uid);
                  }}
                >
                  <View>
                    <Text style={styles.invite}>Send Invitation</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        {requests.length === 0 && (
          <View>
            <Text style={styles.noConnection}>
              You don't have any connections yet or they are already in groups
              or in requests.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function HomeHeader(props) {
  const {
    navigation, creatorName, title, publicStr,
  } = props;
  return (
    <View>
      <ImageBackground
        style={headerStyle.container}
        source={GroupBack}
      >
        <View style={headerStyle.headerContainer}>
          <View style={headerStyle.topMenu}>
            <View style={headerStyle.menuWrapper}>
              <BackButton navigation={navigation} white />
              <View>
                <Text style={headerStyle.title}>{title}</Text>
                <Text style={headerStyle.creator}>
                  {creatorName}
                  {' '}
                  |
                  {publicStr}
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
    width: '100%',
    height: 150,
  },
  headerContainer: {
    width: '100%',
    height: '100%',
    paddingHorizontal: screenpx,
    paddingTop: 48,
  },
  topMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  menuWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
    paddingLeft: 8,
  },
  creator: {
    fontSize: 12,
    color: 'white',
    paddingLeft: 8,
  },
  limitContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: -24,
    borderRadius: 24,
    backgroundColor: 'white',
    paddingHorizontal: screenpx - 4,
    // paddingTop: 24,
  },
  memberView: {
    flexDirection: 'row',
    marginTop: 24,
    padding: 6,
  },
  memberInfo: {
    justifyContent: 'space-around',
    paddingLeft: 24,
  },
  photo: {
    width: 48,
    height: 48,
    borderRadius: 32,
  },
  name: {},
  date: {},
  invite: {
    color: color.blue,
  },
  noConnection: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 22,
    color: 'gray',
  },
});
