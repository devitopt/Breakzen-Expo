import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Calendar } from "react-native-calendars";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useSelector } from "react-redux";
import { chatCollection, color, messageType, size } from "../../assets/stdafx";
import { FullButton } from "../../components/fullbutton";
import { BackButton } from "../../components/backbutton";
import { navName } from "../../navigation/Paths";
import { firestore } from "../../config/firebase";
import { doc, collection, getDoc, addDoc, updateDoc } from "firebase/firestore";
import Loading from "../../components/loading";

const weekDayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const String2Array = (str) => str.split(",").map((x) => parseInt(x));

export default function CheckAvailability({ route, navigation }) {
  const user = useSelector((state) => state.user);
  const professionalId = route.params.userId;  
  const professional = route.params.professional;  
  const [bLoading, setLoading] = useState(false);
  const [helpMsg, setHelpMsg] = useState("");
  const [bTimePicker, setTimePicker] = useState(false);
  const [pickerDate, setPickerDate] = useState(new Date());
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [markedDate, setMarkedDate] = useState("");
  const [markedTime, setMarkedTime] = useState([10, 0, 16, 0]);
  const [markedCalendar, setMarkedCalendar] = useState({});
  const weekDays = professional.weekdays;
  const times = professional.times;

  const chatUpdate = (uid, other) => {
    const docRef = doc(firestore, "users", uid);
    getDoc(docRef).then((snapShot) => {
      const userdata = snapShot.data();
      const array = userdata.chats;
      if (!array.includes(other)) {
        array.push(other);
        updateDoc(docRef, { chats: array });
      }
    });
  };
  const onConnectNow = () => {
    if (markedDate === "") {
      alert("Please Select Date");
    } else {
      setLoading(true);
      const collectionRef = collection(
        firestore,
        chatCollection(user.uid, professionalId)
      );
      addDoc(collectionRef, {
        sender: user.uid,
        receiver: professionalId,
        content: `Wanted Appointment Time:\n${DateTimeText(
          markedDate,
          markedTime
        )}\n${helpMsg}`,
        time: new Date(),
        read: false,
        type: messageType.checkAvailability,
      }).then(() => {
        chatUpdate(user.uid, professionalId);
        chatUpdate(professionalId, user.uid);
        navigation.navigate(navName.Success);
        setLoading(false);
      });
    }
  };
  const onDayPress = (day) => {
    const { dateString } = day;
    setMarkedDate(dateString);
    const markedObj = {};
    markedObj[dateString] = {
      customStyles: {
        container: {
          backgroundColor: color.blue,
        },
        text: {
          color: "white",
          fontWeight: "bold",
        },
      },
    };
    setMarkedCalendar(markedObj);
  };
  const onTimeSelected = (time) => {
    const temp = [...markedTime];
    temp[selectedIndex] = time.getHours();
    temp[selectedIndex + 1] = time.getMinutes();
    setMarkedTime(temp);
    setTimePicker(false);
  };
  const onPressFirstTime = () => {
    const date = new Date();
    date.setHours(markedTime[0]);
    date.setMinutes(markedTime[1]);
    setSelectedIndex(0);
    setPickerDate(date);
    setTimePicker(true);
  };
  const onPressSecondTime = () => {
    const date = new Date();
    date.setHours(markedTime[2]);
    date.setMinutes(markedTime[3]);
    setSelectedIndex(2);
    setPickerDate(date);
    setTimePicker(true);
  };
  return (
    <KeyboardAvoidingView style={{ width: "100%", height: "100%" }}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    keyboardShouldPersistTaps={'handled'}>
    <View
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "white",
      }}
    >
      <View style={styles.backBar}>
        <BackButton navigation={navigation} />
      </View>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'}>
        <View style={styles.paragraph}>
          <Text style={{ fontSize: 20, paddingBottom: 8, fontWeight: "bold" }}>
            Check Availability
          </Text>
          <Text style={{ fontSize: 14, color: "gray" }}>
            Before connecting you with this professional
          </Text>
        </View>
        <Text style={styles.titleBlue}>Professional Availability</Text>
        <View style={styles.appointmentContainer}>          
          {times.map((time, index) =>
            weekDays[index] ? (
              <PTimeItem
                key={index}
                index={index}
                time={time}
              />
            ) : (
              <></>
            )
          )}
        </View>
        <View style={styles.paragraph}>
          <Text style={styles.title}>Select your day and time</Text>
          <Calendar
            style={styles.calendar}
            markingType="custom"
            onDayPress={onDayPress}
            markedDates={markedCalendar}
          />
          <Text style={styles.title}>Appointment time</Text>
          <TimeItem
            time={markedTime}
            onPressFirstTime={onPressFirstTime}
            onPressSecondTime={onPressSecondTime}
          />
        </View>
        <View style={styles.paragraph}>
          <Text style={styles.title}>How this professional can help you?</Text>
          <TextInput
            style={styles.input}
            value={helpMsg}
            onChangeText={setHelpMsg}
            placeholder="Write a description"
            keyboardShouldPersistTaps={'handled'}
            multiline
          />
        </View>
        <View style={{ marginBottom: size.screenpb }}>
          <FullButton onPress={onConnectNow} title="Connect Now" />
        </View>
      </ScrollView>
      <DateTimePickerModal
        isVisible={bTimePicker}
        mode="time"
        minuteInterval={15}
        timePickerModeAndroid="spinner"
        date={pickerDate}
        onConfirm={onTimeSelected}
        onCancel={() => setTimePickerVisibility(false)}
      />
      {bLoading && <Loading />}
    </View>
    </KeyboardAvoidingView>
  );
}

function PTimeItem(props) {
  const time = String2Array(props.time);
  const fhour =
    time[0] > 12
      ? time[0] - 12 > 0
        ? time[0] - 12
        : 12
      : time[0] > 0
      ? time[0]
      : 12;
  const fnoon = time[0] > 12 ? "PM" : "AM";
  const fmin = time[1] < 10 ? `0${time[1]}` : time[1];
  const lhour =
    time[2] > 12
      ? time[2] - 12 > 0
        ? time[2] - 12
        : 12
      : time[2] > 0
      ? time[2]
      : 12;
  const lmin = time[3] < 10 ? `0${time[3]}` : time[3];
  const lnoon = time[2] > 12 ? "PM" : "AM";

  return (
    <View style={styles.timeContainer}>
      <View style={styles.weekDayNameContainer}>
        <Text style ={ {fontSize: 16} } >{weekDayName[props.index]}</Text>
      </View>
      <View style={styles.timeWrapper}>
        <TouchableOpacity onPress={props.onPressFirst}>
          <View style={styles.timeWrapperView}>
            <Text>{fhour}</Text>
            <Text> : </Text>
            <Text>{fmin}</Text>
            <Text>{` ${fnoon}`}</Text>
          </View>
        </TouchableOpacity>
      </View>
      <Text>{"     -     "}</Text>
      <View style={styles.timeWrapper}>
        <TouchableOpacity onPress={props.onPressSecond}>
          <View style={styles.timeWrapperView}>
            <Text>{lhour}</Text>
            <Text> : </Text>
            <Text>{lmin}</Text>
            <Text>{` ${lnoon}`}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function TimeText(hour, min, ch = "") {
  const fhour =
    hour > 12 ? (hour - 12 > 0 ? hour - 12 : 12) : hour > 0 ? hour : 12;
  const fnoon = hour > 12 ? "PM" : "AM";
  const fmin = min < 10 ? `0${min}` : min;
  return `${fhour + ch}:${ch}${fmin} ${fnoon}`;
}

function DateTimeText(date, time) {
  const dateArray = date.split("-");
  const res = `${dateArray[1]}/${dateArray[2]}/${dateArray[0]}`;
  return `${res} ${TimeText(time[0], time[1])} to ${TimeText(
    time[2],
    time[3]
  )}`;
}

function TimeItem(props) {
  const { time } = props;
  return (
    <View style={styles.timeContainer}>
      <Text>From</Text>
      <View style={styles.timeWrapper}>
        <TouchableOpacity onPress={props.onPressFirstTime}>
          <View style={styles.timeWrapperView}>
            <Text>{TimeText(time[0], time[1], " ")}</Text>
          </View>
        </TouchableOpacity>
      </View>
      <Text>To</Text>
      <View style={styles.timeWrapper}>
        <TouchableOpacity onPress={props.onPressSecondTime}>
          <View style={styles.timeWrapperView}>
            <Text>{TimeText(time[2], time[3], " ")}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const screenpx = 28;
const weekDayItemHeight = 36;

const styles = StyleSheet.create({
  backBar: {
    marginTop: 48,
    marginBottom: 36,
    paddingHorizontal: screenpx,
  },
  container: {
    width: "100%",
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: screenpx,
  },
  paragraph: {
    marginBottom: 36,
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
    paddingBottom: 24,
  },
  titleBlue: {
    fontSize: 14,
    fontWeight: "500",
    paddingBottom: 24,
    color: color.blue
  },
  comment: {
    paddingLeft: 24,
    color: "gray",
    fontSize: 13,
    lineHeight: 22,
  },
  calendar: {
    elevation: 6,
    marginBottom: 24,
  },
  appointmentContainer: {
    marginTop: 12,
    marginBottom: 36,
  },
  weekContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  weekDayWrapper: {
    width: "13%",
    height: weekDayItemHeight,
    borderRadius: 7,
    overflow: "hidden",
  },
  weekDay: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingLeft: 6,
  },
  weekDayNameContainer: {
    width: 64,
  },
  timeWrapperView: {
    flexDirection: "row",
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  timeWrapper: {
    backgroundColor: "#ECECEC",
    borderRadius: 6,
    overflow: "hidden",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  timeWrapperView: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  timeWrapper: {
    backgroundColor: "#ECECEC",
    borderRadius: 6,
    overflow: "hidden",
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderColor: color.blue,
    borderRadius: 7,
    marginLeft: 32,
    fontSize: 13,
  },
});
