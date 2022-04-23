import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { FullButton } from "../../components/fullbutton";
import { TextInput } from "react-native-gesture-handler";
import { Svg, G, Path } from "react-native-svg";
import { useSelector } from "react-redux";
import { BackButton } from "../../components/backbutton";
import { navName } from "../../navigation/Paths";
import { color, googleMapApi, buttonType } from "../../assets/stdafx";
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

export default function JobListings({ navigation }) {
  const user = useSelector((state) => state.user);
  const postCnt = user.postcnt ? user.postcnt : 0;
  const bUser = !user.professional;
  const [jobList, setJobList] = useState([]);
  const [totalJobList, setTotalJobList] = useState([]);
  const [mineIndex, setMineIndex] = useState(0);
  const default_url = `${googleMapApi}&origins=${user.location}`;
  const [searchStr, setSearchStr] = useState("");

  const isNearBy = async (jobdata) => {
    if (
      !(user.currentlocation || user.location) ||
      !(jobdata.location || jobdata.latitude || jobdata.longitude)
    )
      return false;

    let url = `${default_url}&destinations=${jobdata.location}`;
    if (user.currentlocation && jobdata.latitude && jobdata.longitude)
      url = `${googleMapApi}&origins=${user.currentlocation.latitude},${user.currentlocation.longitude}&destinations=${jobdata.latitude},${jobdata.longitude}`;
    return await fetch(url)
      .then((response) => response.json())
      .then((json) => {
        if (json.rows.length == 0) return false;
        const { elements } = json.rows[0];
        const distance = elements[0].distance.value;
        if (distance < 16000) return true;
        return false;
      });
  };

  useEffect(() => {
    const q = query(collection(firestore, "joblist"), orderBy("date", "desc"));
    const jobScribe = onSnapshot(q, (snapShot) => {
      if (snapShot) {
        const jobArray = [];
        snapShot.forEach((x) => {
          const jobdata = { ...x.data(), jid: x.id }
          isNearBy(jobdata).then((value) => {
            if (value === true) {
              jobArray.push(jobdata);
              setJobList([...jobArray]);
              setTotalJobList([...jobArray]);
            }
            setMineIndex(
              snapShot.docs.findIndex((x) => x.data().creator === user.uid)
            );
          })
        })
      }
    });
    return () => {
      jobScribe();
    };
  }, []);

  useEffect(() => {
    setJobList([...totalJobList.filter((x) => x.title.toLowerCase().includes(searchStr.toLowerCase()))]);
  }, [searchStr])
  return (
    <View style={style.container}>
      <Header navigation={navigation} bVerified={user.verified} bUser={bUser} postCnt={postCnt} />
      <View style={{ justifyContent: "center", marginBottom: 24, paddingHorizontal: 30 }}>
        <TextInput
          style={style.textInput}
          placeholder="search"
          onChangeText={(text) => setSearchStr(text)}
        />
        <Svg_Search />
      </View>
      <ScrollView style={style.scrollView} showsVerticalScrollIndicator={false}>
        {jobList.map(
          (job, index) =>
            (user.professional || user.uid === job.creator) && (
              <JobItem key={index} job={job} navigation={navigation} />
            )
        )}
        {!user.professional && mineIndex === -1 && (
          <View>
            <Text style={style.postOffer}>
              Post an offer to find a specialist
            </Text>
          </View>
        )}
        {user.professional && jobList.length === 0 && (
          <View>
            <Text style={style.postOffer}>
              We couldn't find any job offer today
            </Text>
          </View>
        )}
      </ScrollView>

    </View>
  );
}

function Header(props) {
  const onPlus = () => {
    if (props.bVerified) {
      props.navigation.navigate(navName.CreateJobListing)
    } else
      Alert.alert('Breakzen', 'You must verify your email first');
  }
  return (
    <View style={hstyle.container}>
      <View style={hstyle.menuBar}>
        <BackButton navigation={props.navigation} />
        <Text style={hstyle.title}>Job Listings</Text>
        <View style={hstyle.plusContainer}>
          {props.postCnt < 3 && props.bUser && (
            <TouchableOpacity
              onPress={onPlus}
            >
              <View style={hstyle.plusWrapper}>
                <Svg_Plus />
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={[hstyle.searchBox, { display: "none" }]}>
        <Svg_Search />
        <TextInput style={hstyle.searchInput} placeholder="search" />
      </View>
    </View>
  );
}

const getMonthString = (month) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return monthNames[month];
};

function JobItem(props) {
  const { job } = props;
  const timeStamp = new Date(
    job.date.seconds * 1000 + job.date.nanoseconds / 1000000
  );
  const date = `${timeStamp.getDate()}th ${getMonthString(
    timeStamp.getMonth()
  )} ${timeStamp.getFullYear()}`;
  return (
    <TouchableOpacity
      onPress={() =>
        props.navigation.navigate(navName.JobPost, {
          jobId: job.jid,
          jobCreator: job.creator,
        })
      }
      background={color.blue}
    >
      <View style={jstyle.container}>
        <View style={jstyle.titleWrapper}>
          <Text style={jstyle.title}>{job.title}</Text>
          <Svg_Back />
        </View>
        <Text style={jstyle.date}>{`Posted on ${date}`}</Text>
      </View>
    </TouchableOpacity>
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
      style={{ position: "absolute", paddingHorizontal: 40, paddingBottom: 10 }}
      xmlns="http://www.w3.org/2000/svg"
      width="15.459"
      height="15.459"
      viewBox="0 0 15.459 15.459"
    >
      <G id="search" transform="translate(0.5 0.5)">
        <G id="Group_10726" data-name="Group 10726">
          <Path
            id="Path_24601"
            data-name="Path 24601"
            d="M14.371,13.945l-4.4-4.4a5.745,5.745,0,1,0-.426.426l4.4,4.4a.3.3,0,1,0,.426-.426Zm-8.647-3.1a5.121,5.121,0,1,1,5.121-5.121A5.127,5.127,0,0,1,5.723,10.844Z"
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
      id="back_2_"
      data-name="back (2)"
      xmlns="http://www.w3.org/2000/svg"
      width="5.355"
      height="9.727"
      viewBox="0 0 5.355 9.727"
    >
      <Path
        id="Chevron_Right"
        d="M59.327,5.212,54.953,9.584a.491.491,0,0,1-.7-.694l4.027-4.026L54.258.839a.491.491,0,1,1,.7-.694l4.374,4.373A.5.5,0,0,1,59.327,5.212Z"
        transform="translate(-54.113 -0.001)"
        fill="#474461"
      />
    </Svg>
  );
}

const style = StyleSheet.create({
  container: {
    height: "100%",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 28,
  },
  postOffer: {
    marginTop: 48,
    color: "gray",
    textAlign: "center",
  },
  textInput: {
    textAlign: "center",
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: "#7DBDEF",
    paddingBottom: 5
  },
});

const hstyle = StyleSheet.create({
  container: {
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 28,
  },
  menuBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  plusContainer: {
    width: 36,
    height: 36,
    borderRadius: 36,
    overflow: "hidden",
  },
  plusWrapper: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  searchBox: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  searchSvg: {
    position: "absolute",
    left: 12,
  },
  searchInput: {
    textAlign: "center",
    fontSize: 16,
    borderColor: color.blue,
    borderWidth: 1,
    borderRadius: 12,
    width: "100%",
  },
});

const jstyle = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: "space-evenly",
    marginBottom: 12,
  },
  titleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  date: {
    fontSize: 10,
    fontWeight: "500",
  },
});
