import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { TextInput } from "react-native-gesture-handler";
import { useSelector, useDispatch } from "react-redux";
import { Svg, G, Path } from "react-native-svg";
import { Loading } from "../../components/loading";
import { addinfo } from "../../redux/actioncreators";
import { ModalButton } from "../../components/modalbutton";
import { FullButton } from "../../components/fullbutton";
import {
  size,
  color,
  serviceType,
  abilityType,
  paymentType,
  coachType,
  HealerType,
} from "../../assets/stdafx";
import { BackButton } from "../../components/backbutton";
import { firestore, storage } from "../../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Constants from 'expo-constants';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const weekDayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const String2Array = (str) => str.split(",").map((x) => parseInt(x));

export default function EditProfileInfo({ navigation }) {
  const user = useSelector((state) => state.user);
  const { service } = user;

  const dispatch = useDispatch();
  const addInfo = (info) => dispatch(addinfo(info));

  const [bLoading, setLoading] = useState(false);
  const [bModal, setModal] = useState(false);
  const [sModal, setSModal] = useState(false);
  const [hModal, setHModal] = useState(false);
  const [modalType, setModalType] = useState(abilityType.speciality);
  const [modalService, setModalService] = useState(serviceType.personalTrainer);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedSubIndex, setSelectedSubIndex] = useState(0);

  const [pModal, setPModal] = useState(false);

  const [pickerDate, setPickerDate] = useState(new Date());
  const [bTimePicker, setTimePickerVisibility] = useState(false);

  const [userImage, setUserImage] = useState("");
  const [aboutMe, setAboutMe] = useState(user.aboutme);
  const [price, setPrice] = useState(user.price != "" ? (user.price * 1).toString(): user.price);
  const [speciality, setSpeciality] = useState(user.speciality);
  const [credential, setCredential] = useState(user.credential);
  const [paymentmethods, setPaymentMethods] = useState(user.paymentmethods);
  const [location, setLocation] = useState(user.location);
  const [phone, setPhone] = useState(user.phone);
  const [zipcode, setZipcode] = useState(user.zipcode);
  const [weekDays, setWeekDays] = useState(user.weekdays);
  const [times, setTimes] = useState(user.times);
  const [coach, setCoach] = useState(user.coach ? user.coach : "");

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const onSelectSpeciality = () => {
    if (service == serviceType.sportCoach) {
      setSModal(true);
    } else if (service == serviceType.holisticHealer) {
      setHModal(true);
    }
  };

  const onSpecialityModalOk = (specaility) => {
    setCoach(specaility);
    if (service == serviceType.sportCoach) {      
      setSModal(false);
    } else if (service == serviceType.holisticHealer) {
      setHModal(false);
    }
  };

  const onWeekDayPress = (index) => {
    const days = [...weekDays];
    days[index] = !days[index];
    setWeekDays(days);
  };

  const onTimeSelected = (time) => {
    const tempArray = [...times];
    const numArray = String2Array(tempArray[selectedIndex]);
    numArray[selectedSubIndex] = time.getHours();
    numArray[selectedSubIndex + 1] = time.getMinutes();
    tempArray[selectedIndex] = numArray.join();
    setTimes([...tempArray]);
    setTimePickerVisibility(false);
  };

  const onPressFirstTime = (index) => {
    const date = new Date();
    const ctimes = String2Array(times[index]);
    date.setHours(ctimes[0]);
    date.setMinutes(ctimes[1]);
    setPickerDate(date);
    setSelectedIndex(index);
    setSelectedSubIndex(0);
    setTimePickerVisibility(true);
  };

  const onPressSecondTime = (index) => {
    const date = new Date();
    const ctimes = String2Array(times[index]);
    date.setHours(ctimes[2]);
    date.setMinutes(ctimes[3]);
    setPickerDate(date);
    setSelectedIndex(index);
    setSelectedSubIndex(2);
    setTimePickerVisibility(true);
  };

  const onAddSpeciality = () => {
    setModalType(abilityType.speciality);
    setModalService(service);
    setModal(true);
  };

  const onAddCredential = () => {
    setModalType(abilityType.credential);
    setModalService(service);
    setModal(true);
  };

  const onModalOk = (param) => {
    if (modalType === abilityType.speciality) {
      if (!speciality.includes(param)) setSpeciality([...speciality, param]);
    } else if (!credential.includes(param))
      setCredential([...credential, param]);
    setModal(false);
  };

  const onAddPayment = () => {
    setPModal(true);
  };

  const onPModalOk = (param) => {
    setPModal(false);
    if (paymentmethods.includes(param) === false)
      setPaymentMethods([...paymentmethods, param]);
  };

  const removeSpeciality = (index) => {
    const array = [...speciality];
    array.splice(index, 1);
    setSpeciality([...array]);
  };

  const removeCredential = (index) => {
    const array = [...credential];
    array.splice(index, 1);
    setCredential([...array]);
  };

  const removePayment = (index) => {
    const array = [...paymentmethods];
    array.splice(index, 1);
    setPaymentMethods([...array]);
  };

  const getFile = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      const fileUri = result.uri;
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      // if (fileInfo.size > 2 * 1024 * 1024)
      //   alert("Please select the image less than 2MB");
      // else 
      setUserImage(fileUri);
    }
  };

  const onSave = () => {
    
    if (price < 1) {
      alert("Please select your estimate hourly rate to be more than $1");
      return;
    }
    setLoading(true);

    if (userImage === "") {
      saveUserInfo(user.photo);
    } else {
      savePhoto().then((imageUrl) => {
        saveUserInfo(imageUrl);
      });
    }
  };

  const saveUserInfo = (imageUrl) => {
    const info = {
      aboutme: aboutMe,
      price: price*1,
      speciality,
      credential,
      paymentmethods,
      weekdays: weekDays,
      times,
      location,
      zipcode,
      phone,
      photo: imageUrl,
      coach,
    };
    
    const docRef = doc(firestore, "users", user.uid);
    updateDoc(docRef, info).then(() => {
      setLoading(false);
      addInfo(info);
      navigation.goBack();
    });
  };

  const savePhoto = async () => {
    const storageRef = ref(storage, `${user.email}/photo`);
    const response = await fetch(userImage);
    const blob = await response.blob();
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardShouldPersistTaps={'handled'}
    >
      <View style={styles.container} keyboardShouldPersistTaps={'handled'}>
        <View style={{ marginTop: 48, marginBottom: 36 }}>
          <BackButton navigation={navigation} />
        </View>
        <ScrollView keyboardShouldPersistTaps={'handled'} showsVerticalScrollIndicator={false} listViewDisplayed={false}>
          <Text style={styles.caption}>My Profile</Text>
          <Text style={styles.pageComment}>
            Edit & confirm changes for your profile
          </Text>
          <View style={styles.imageContainer}>
            <TouchableOpacity onPress={getFile} useForeground>
              <View style={styles.imageWrapper}>
                <Image
                  style={styles.image}
                  source={
                    userImage === ""
                      ? { uri: user.photo }
                      : { uri: `file://${userImage}` }
                  }
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.flexRow}>
            <Text style={styles.serviceTitle}>Main Profession</Text>
            {service == serviceType.sportCoach && (
              <Text style={[styles.serviceTitle]}>Sport Speciality</Text>
            )}
            {service == serviceType.holisticHealer && (
              <Text style={[styles.serviceTitle]}>Holistic Profession</Text>
            )}
          </View>
          <View style={styles.flexRow}>
            <Text style={[styles.service]}>{service}</Text>
            {(service == serviceType.sportCoach || service == serviceType.holisticHealer) && (
              <TouchableOpacity onPress={onSelectSpeciality}>
                <Text style={[styles.service, { color: "gray" }]}>
                  {coach == "" ? "Select One" : coach}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.title}> About Me </Text>
          <TextInput
            style={styles.input}
            value={aboutMe}
            onChangeText={setAboutMe}
            placeholder="Write a description about yourself"
            multiline
          />
          <Text style={styles.title}> My Estimate Rate Hour </Text>
          <View style={styles.priceView}>
            <View>
              <TextInput
                style={[styles. input, { paddingLeft: 28, marginBottom: 0 }]}
                value={price}
                onChangeText={setPrice}
                placeholder="Rate"
                keyboardType="numeric"
                maxLength={3}                
              />
              <Text style={styles.price}>$</Text>
            </View>
            <View style={{ flex: 1, paddingLeft: inputpl }}>
              <Text style={{ color: color.gray }}>
                Your estimate price per hour showing in your profile
              </Text>
            </View>
          </View>
          <Text style={styles.ablilityTitle}>My Specialities</Text>
          <View style={styles.itemsContainer}>
            {speciality.map((element, index) => (
              <TouchableOpacity
                key={index}
                useForeground
                onPress={() => removeSpeciality(index)}
              >
                <View style={styles.item}>
                  <Text key={index}>{element}</Text>
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={onAddSpeciality}>
              <View style={styles.item}>
                <Svg_Add />
              </View>
            </TouchableOpacity>
          </View>
          <Text style={styles.ablilityTitle}>My Certificates</Text>
          <View style={styles.itemsContainer}>
            {credential.map((element, index) => (
              <TouchableOpacity
                key={index}
                useForeground
                onPress={() => removeCredential(index)}
              >
                <View style={styles.item}>
                  <Text key={index}>{element}</Text>
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={onAddCredential}>
              <View style={styles.item}>
                <Svg_Add />
              </View>
            </TouchableOpacity>
          </View>
          <Text style={styles.ablilityTitle}>Payment Methods</Text>
          <View style={styles.itemsContainer}>
            {paymentmethods.map((element, index) => (
              <TouchableOpacity
                key={index}
                useForeground
                onPress={() => removePayment(index)}
              >
                <View style={styles.item}>
                  <Text key={index}>{element}</Text>
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={onAddPayment}>
              <View style={styles.item}>
                <Svg_Add />
              </View>
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>Available Appointment Times</Text>
          <View style={styles.appointmentContainer}>
            <View style={styles.weekContainer}>
              {weekDays.map((weekDay, index) => (
                <WeekDay
                  key={index}
                  title={weekDayName[index]}
                  selected={weekDay}
                  onPress={() => onWeekDayPress(index)}
                />
              ))}
            </View>
            {times.map((time, index) =>
              weekDays[index] ? (
                <TimeItem
                  key={index}
                  index={index}
                  time={time}
                  onPressFirst={() => onPressFirstTime(index)}
                  onPressSecond={() => onPressSecondTime(index)}
                />
              ) : (
                <></>
              )
            )}
          </View>
          <Text style={styles.title}> My Location{ user.location? ": " + user.location : ""} </Text>
          <GooglePlacesAutocomplete
            ref={ref}
            placeholder="Search Address"
            fetchDetails={true}
            keyboardShouldPersistTaps={'handled'}            
            listViewDisplayed={false}
            enablePoweredByContainer={false}
            onPress={(data, details = null) => {
              setLocation(data.description);
            }}
            query={{
              key: Constants.manifest.extra.apiKey,
              language: 'en',
              region: 'us',
              address: 'us'              
            }}
            styles={
                {
                  textInputContainer: {
                  backgroundColor: 'white',
                  borderWidth: 1,
                  paddingHorizontal: 2,
                  paddingTop: 2,
                  borderColor: color.blue,
                  borderRadius: 7,
                  lineHeight: 20,
                  marginLeft: inputpl,
                  marginBottom: 24,
                },
                textInput: {
                  height: 32,
                  color: '#5d5d5d',
                  fontSize: 14,
                }
              }
            }
          />

          <TextInput
            style={styles.input}
            value={zipcode}
            onChangeText={setZipcode}
            placeholder="Zip Code"
          />

          <Text style={styles.title}> Phone Number </Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Phone Number"
          />
          <View style={{ paddingTop: 12, paddingBottom: size.screenpb }}>
            <FullButton onPress={onSave} title="Confirm & Save" />
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
      </View>

      {bModal && (
        <SelectModal
          type={modalType}
          service={modalService}
          onCancel={() => setModal(false)}
          onOk={(param) => onModalOk(param)}
        />
      )}
      {pModal && (
        <SelectPayment
          paymentmethods={paymentmethods}
          onCancel={() => setPModal(false)}
          onOk={(param) => onPModalOk(param)}
        />
      )}
      {sModal && (
        <SpecialityModal
          onOk={(specaility) => onSpecialityModalOk(specaility)}
        />
      )}
      {hModal && (
        <SpecialityHModal
          onOk={(specaility) => onSpecialityModalOk(specaility)}
        />
      )}
      {bLoading && <Loading />}
    </KeyboardAvoidingView>
  );
}

function WeekDay(props) {
  return (
    <View style={styles.weekDayWrapper}>
      <TouchableOpacity onPress={props.onPress}>
        <View
          style={[
            styles.weekDay,
            props.selected ? { backgroundColor: color.blue } : {},
          ]}
        >
          <Text
            style={props.selected ? { color: "white" } : { color: "black" }}
          >
            {props.title}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

function TimeItem(props) {
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
        <Text>{weekDayName[props.index]}</Text>
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

function SelectPayment(props) {
  const items = Object.keys(paymentType).map((x) => paymentType[x]);
  const [item, setItem] = useState(items[0]);
  const modalOk = props.onOk;

  return (
    <View style={mstyle.container}>
      <View style={mstyle.modal}>
        <Text style={styles.serviceTitle}>Select a Payment method.</Text>
        <Picker
          selectedValue={item}
          style={styles.picker}
          onValueChange={(itemValue, itemIndex) => setItem(items[itemIndex])}
        >
          {items.map((element, index) => (
            <Picker.Item key={index} label={element} value={element} />
          ))}
        </Picker>
        <View style={mstyle.buttonContainer}>
          <View style={mstyle.buttonWrapper}>
            <ModalButton onPress={() => modalOk(item)} title="Ok" ok />
          </View>
          <View style={mstyle.buttonWrapper}>
            <ModalButton onPress={props.onCancel} title="Cancel" />
          </View>
        </View>
      </View>
    </View>
  );
}

function SelectModal(props) {
  const { type, service } = props;
  const [items, setItems] = useState([]);
  const [item, setItem] = useState("");
  const modalOk = props.onOk;

  useEffect(() => {
    const docRef = doc(firestore, "ability", type);
    getDoc(docRef).then((snapShot) => {
      try {
        snapShot.exists ? setItems([...snapShot.data()[service]]) : {};
      } catch (error) {
        setItems([]);
        setItem("");
      }
    });
  }, []);

  const onOk = () => {
    if (!items.includes(item)) {
      const data = {};
      data[service] = [...items];
      data[service].push(item);
      const docRef = doc(firestore, "ability", type);
      updateDoc(docRef, data);
    }
    modalOk(item);
  };

  return (
    <View style={mstyle.container}>
      <View style={mstyle.modal}>
        <Text style={styles.serviceTitle}>
          Select your
          {type}.
        </Text>
        <Picker
          selectedValue={item}
          style={styles.picker}
          onValueChange={(itemValue, itemIndex) => setItem(itemValue)}
        >
          {items.map((element, index) => (
            <Picker.Item key={index} label={element} value={element} />
          ))}
        </Picker>
        <Text style={styles.title}>
          If there is no {type} you want, input please.
        </Text>
        <TextInput
          style={styles.input}
          value={item}
          onChangeText={setItem}
          placeholder={type}
        />
        <View style={mstyle.buttonContainer}>
          <View style={mstyle.buttonWrapper}>
            <ModalButton onPress={onOk} title="Ok" ok />
          </View>
          <View style={mstyle.buttonWrapper}>
            <ModalButton onPress={props.onCancel} title="Cancel" />
          </View>
        </View>
      </View>
    </View>
  );
}

function SpecialityModal(props) {
  const { onOk } = props;
  return (
    <View style={mstyle.container}>
      <View style={mstyle.modal}>
        {coachType.map((speciality, index) => (
          <TouchableOpacity onPress={() => onOk(speciality)}>
            <Text style={mstyle.speciality}>{speciality}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function SpecialityHModal(props) {
  const { onOk } = props;
  return (
    <View style={mstyle.container}>
      <View style={mstyle.modal}>
        {HealerType.map((speciality, index) => (
          <TouchableOpacity onPress={() => onOk(speciality)}>
            <Text style={mstyle.speciality}>{speciality}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function Svg_Add() {
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

const inputpl = 24;
const weekDayItemHeight = 36;
const screenpx = 28;

const styles = StyleSheet.create({
  
  screen: {
    width: "100%",
    height: "100%",
  },
  container: {
    width: "100%",
    height: "100%",
    paddingHorizontal: screenpx,
  },
  caption: {
    fontSize: 20,
    fontWeight: "bold",
    paddingBottom: 12,
  },
  pageComment: {
    fontSize: 14,
    lineHeight: 22,
    color: "gray",
    paddingBottom: 36,
  },
  imageContainer: {
    width: 140,
    height: 140,
    borderWidth: 1,
    borderRadius: 7,
    borderColor: "gray",
    borderStyle: "dashed",
    alignSelf: "center",
    marginBottom: 32,
  },
  imageWrapper: {
    width: "100%",
    height: "100%",
    padding: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 7,
  },
  flexRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 18,
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderColor: color.blue,
    borderRadius: 7,
    fontSize: 14,
    lineHeight: 20,
    marginLeft: inputpl,
    marginBottom: 24,
  },
  priceView: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  price: {
    position: "absolute",
    color: color.blue,
    fontSize: 18,
    fontWeight: "bold",
    left: inputpl + 8,
    top: 8,
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  service: {
    color: color.blue,
    marginLeft: inputpl,
    fontSize: 16,
    fontWeight: "bold",
    paddingTop: 12,
    paddingBottom: 18,
  },
  ablilityTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 16,
  },
  picker: {
    marginLeft: inputpl,
    marginBottom: 8,
  },
  itemsContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    paddingLeft: 12,
    marginBottom: 18,
  },
  item: {
    marginHorizontal: 12,
    paddingHorizontal: 12,
    marginVertical: 8,
    paddingVertical: 6,
    backgroundColor: "#ECECEC",
    lineHeight: 24,
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
  speciality: {
    fontSize: 16,
    textAlign: "center",
    paddingVertical: 4,
  },
});
