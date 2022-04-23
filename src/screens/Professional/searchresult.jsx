import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  ImageBackground,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Svg, G, Path } from "react-native-svg";
import { FullButton } from "../../components/fullbutton";
import { BackButton } from "../../components/backbutton";
import { PhotofoliaH } from "../../components/photofoliah";
import { buttonType } from "../../assets/stdafx";
import HeaderBack from "../../assets/svg/header-back.png";
import { addinfo } from "../../redux/actioncreators";
import { firestore } from "../../config/firebase";
import { query, doc, updateDoc, getDocs, collection, where } from "firebase/firestore";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function SearchResult({ route, navigation }) {
  const me = useSelector((state) => state.user);
  const { searchStr, searchService } = route.params;
  const searchElement = searchStr.split(" ");
  const [users, setUsers] = useState([]);
  const [favoriteTop, setFavoriteTop] = useState(true);

  useEffect(() => {
    
    const q = query(
      collection(firestore, "users"),
      where("professional", "==", true),
      
      // where(
      //   "service",
      //   searchService == "all" ? "!=" : "==",
      //   searchService == "all" ? "unknown" : searchService,

      // )
    );
    getDocs(q).then((querySnapshot) => {
      querySnapshot &&
        setUsers(
          querySnapshot.docs
            .map((x) => ({ ...x.data(), uid: x.id }))
            .filter((x) => filterProfessional(x))
        );
    });
  }, [route.params]);

  const filterProfessional = (pro) => {
    let searchCnt = 0;
    const searchLen = searchElement.length;
    for (let i = 0; i < searchLen; i++) {
      const search = searchElement[i].toLowerCase();
      if (pro.service.toLowerCase().includes(search) || pro.zipcode == searchStr) searchCnt++;
      else if (pro.coach && pro.coach.toLowerCase().includes(search))
        searchCnt++;
      else if (
        pro.speciality.filter((x) => x.toLowerCase().includes(search)).length
      )
        searchCnt++;
    }
    return searchCnt == searchLen;
  };

  const onBack = () => {
    setUsers([]);
  };

  const onFilter = () => {    
    favoriteTop 
    ? users.sort((a, b) => (me.favorite && me.favorite.includes(a.uid)) ? -1 : 1)
    : users.sort((a, b) => (me.favorite && me.favorite.includes(a.uid)) ? 1 : -1)
    setFavoriteTop(!favoriteTop);
  }

  return (
    <View style={{ width: "100%", height: "100%" }}>
      <HomeHeader
        navigation={navigation}
        title="Search Result"
        cnt={users.length}
        onBack={onBack}
        onFilter={onFilter}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.professionalList}>
          {users.sort((a, b) => (me.favorite ?? me.favorite.includes(a.uid)) ? -1 : 1).map((user, index) => (
            <UserItem user={user} index={index} navigation={navigation} me={me} />            
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function UserItem(props) {
  const dispatch = useDispatch();
  const addInfo = (info) => dispatch(addinfo(info));
  const {user, index, navigation, me } = props;

  const onClickStar = async () => {
    if (me.favorite && me.favorite.includes(user.uid)) {
      const favorite = me.favorite.filter((x) => x != user.uid);
      const info = { favorite: [...favorite] };
      const docRef = doc(firestore, "users", me.uid);
      await updateDoc(docRef, info).then(() => {
        addInfo(info);      
      });
    } else {
      const info = { favorite: ([...me.favorite, user.uid]) };
      const docRef = doc(firestore, "users", me.uid);
      await updateDoc(docRef, info).then(() => {
        addInfo(info);      
      });
    }    
  }
  return (
    <View key={index} style={styles.professional}>
      <PhotofoliaH user={user} navigation={navigation} onClick={onClickStar} me={me}/>
    </View>
  )
}

function HomeHeader(props) {
  return (
    <View>
      <ImageBackground style={headerStyle.container} source={HeaderBack}>
        <View style={headerStyle.headerContainer}>
          <View style={headerStyle.topMenu}>
            <View style={headerStyle.menuWrapper}>
              <BackButton
                navigation={props.navigation}
                onPress={props.onBack}
                white
              />
              <Text style={headerStyle.title}>{props.title}</Text>
            </View>
            <View style={headerStyle.menuWrapper}>
              {/* <Svg_Menu1 /> */}
              <TouchableOpacity style={headerStyle.menuWrapper}
              onPress={props.onFilter}>
              <Svg_Menu2 />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ opacity: 0.5, justifyContent: "center" }}>
            <FullButton
              onPress={() => {
                // props.navigation.navigate(navName.Searching);
                props.navigation.goBack();
              }}
              search
              src={buttonType.search}
              title="Search"
            />
            <Text style={headerStyle.searchCnt}>{props.cnt}</Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

function Svg_Menu1() {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="16.721"
      height="12.595"
      viewBox="0 0 16.721 12.595"
    >
      <G
        id="Group_17084"
        data-name="Group 17084"
        transform="translate(16.571 0.15) rotate(90)"
      >
        <Path
          id="Path_80"
          data-name="Path 80"
          d="M3.022,9.107V.617a.617.617,0,1,0-1.234,0V9.107a2.392,2.392,0,0,0,0,4.63v1.9a.617.617,0,0,0,1.234,0v-1.9a2.393,2.393,0,0,0,0-4.63Zm-.617,3.485a1.17,1.17,0,1,1,1.17-1.169A1.171,1.171,0,0,1,2.405,12.591Z"
          transform="translate(0 0)"
          fill="#fff"
          stroke="#fff"
          stroke-width="0.3"
        />
        <Path
          id="Path_81"
          data-name="Path 81"
          d="M4.811,4.566A2.4,2.4,0,0,0,3.022,2.251V.617a.617.617,0,0,0-1.234,0V2.251a2.393,2.393,0,0,0,0,4.63V15.64a.617.617,0,1,0,1.234,0V6.882A2.4,2.4,0,0,0,4.811,4.566ZM2.405,5.737A1.171,1.171,0,1,1,3.576,4.566,1.173,1.173,0,0,1,2.405,5.737Z"
          transform="translate(7.484 0.164)"
          fill="#fff"
          stroke="#fff"
          stroke-width="0.3"
        />
      </G>
    </Svg>
  );
}

function Svg_Menu2() {
  return (
    <Svg
      style={{ marginLeft: 16 }}
      xmlns="http://www.w3.org/2000/svg"
      width="14.347"
      height="14.966"
      viewBox="0 0 14.347 14.966"
    >
      <G id="sort" transform="translate(0.212 0.191)">
        <Path
          id="Path_9367"
          data-name="Path 9367"
          d="M4.336,12.807V0H3.294V12.807L1.236,10.749.5,11.486l2.947,2.947a.521.521,0,0,0,.737,0L7.13,11.486l-.737-.737Zm0,0"
          transform="translate(-0.5)"
          fill="#fff"
          stroke="#fff"
          stroke-width="0.3"
        />
        <Path
          id="Path_9368"
          data-name="Path 9368"
          d="M231.13,3.1,228.183.155a.521.521,0,0,0-.737,0L224.5,3.1l.737.737,2.058-2.057V14.588h1.042V1.781l2.058,2.057Zm0,0"
          transform="translate(-217.207 -0.003)"
          fill="#fff"
          stroke="#fff"
          stroke-width="0.3"
        />
      </G>
    </Svg>
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
  topMenu: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  searchCnt: {
    position: "absolute",
    fontSize: 14,
    color: "white",
    fontWeight: "bold",
    right: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    paddingLeft: 8,
  },
  menuWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
});

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: -36,
    borderRadius: 24,
    backgroundColor: "white",
    paddingHorizontal: screenpx,
    paddingTop: 24,
  },
  professionalList: {
    marginBottom: 36,
  },
  professional: {
    width: "100%",
    height: undefined,
    aspectRatio: 32 / 11,
    marginBottom: 12,
  },
});
