import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  KeyboardAvoidingView
} from 'react-native';
import { useSelector, useDispatch } from "react-redux";
import { FullButton } from '../../components/fullbutton';
import { BackBar } from './backbar';
import { AppBar } from './appbar';
import {
  color, memberType, planType, size
} from '../../assets/stdafx';
import { navName } from '../../navigation/Paths';
import { ConfirmLabel } from "./confirmlabel";
import CheckMark from "../../assets/checkmark.png";
import { addinfo } from "../../redux/actioncreators";
import { firestore, functions } from "../../config/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { ModalButton } from "../../components/modalbutton";
import { Loading } from "../../components/loading";
import {
  CreditCardInput,
  LiteCreditCardInput,
} from "react-native-credit-card-input";
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import MainNavigator from "../../navigation/MainNavigator";
import { signInWithEmailLink } from 'firebase/auth';

export default function SelectMembership({ route, navigation }) {

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const addInfo = (info) => dispatch(addinfo(info));
  const { membership } = route.params;
  const [plan, setPlan] = useState(planType.monthly);

  const [bModal, setModal] = useState(false);
  const [bLoading, setLoading] = useState(false);
  const [card, setCard] = useState(user.card);
  const [paid, setSuccess] = useState(false); 
  
  const timeStamp = new Date(
    typeof user.expireDate == "object"
      ? user.expireDate.seconds * 1000 + user.expireDate.nanoseconds / 1000000
      : user.expireDate
  );
  const expireDate = `${timeStamp.getDate()}th ${getMonthString(
    timeStamp.getMonth()
  )}`;

  useEffect(() => {

    (card && card.values && !card.last4) ? getCustomerId() : null;
  }, [card]);

  const createPaymentMethod = httpsCallable(functions, "createPaymentMethod");
  const createSubscription = httpsCallable(functions, "createSubscription");

  const MONTHLY_PRO_PRICE = "price_1JtaIPEEI6dOK9WQfXVgGyB1";
  const MONTHLY_GENERAL_PRICE = "price_1JtaFbEEI6dOK9WQ0LBvXCXo";
  const ANNUAL_PRO_PRICE = "price_1K9uErEEI6dOK9WQ43coYvBa";
  const ANNUAL_GENERAL_PRICE = "price_1K9uDuEEI6dOK9WQ9k1HGcbG";

  const onModalOk = (item) => {
    if (item.valid) {
      setModal(false);
      setCard(item);
    }
  };

  const setSubscription = async (customerId) => {    
    
    console.log("subscription...")

    if (!bLoading) {
      setLoading(true);
    }
    
    await createSubscription({
      customerId: customerId,
      price: membership == memberType.general ? plan == planType.monthly ? MONTHLY_GENERAL_PRICE : ANNUAL_GENERAL_PRICE : plan == planType.monthly ? MONTHLY_PRO_PRICE : ANNUAL_PRO_PRICE

    })
      .then(async (res) => {
        console.log(res);
          const docRef = doc(firestore, "users", user.uid);
          await updateDoc(docRef, { membership: membership, expireDate: new Date(), subscriptionId: res.data.subscriptionId} ).then(() => {
            addInfo({membership: membership, expireDate: new Date(), subscriptionId: res.data.subscriptionId });
          });
      })
      .catch((error) => {
        console.log(error);
      });
     
      setLoading(false);
      setSuccess(true);
  }  

  const getCustomerId = async () => {
    
    setLoading(true);
 
    if (user.customerid) {
      return user.customerid;
    } else {
      console.log("creating...");
      console.log(card)
      await createPaymentMethod({
        cardDetails: {
          number: card.values.number.replace(" ", ""),
          exp_month: parseInt(card.values.expiry.split("/")[0]),
          exp_year: 2000 + parseInt(card.values.expiry.split("/")[1]),
          cvc: card.values.cvc,
        },
        email: user.email,
      })
        .then(async (res) => {
          console.log(res);          
          const docRef = doc(firestore, "users", user.uid);
          await updateDoc(docRef, { paymentMethodId: res.data.paymentMethodId, customerId: res.data.customerId, card: {last4: card.values.number.slice(-4)} }).then(() => {
            addInfo({ paymentMethodId: res.data.paymentMethodId, customerId: res.data.customerId, card: {last4: card.values.number.slice(-4)} });
            setSubscription(res.data.customerId);
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };  

  const Stack = createStackNavigator();

  return (
    paid ? (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <>
          <Stack.Screen
            name={navName.MainNavigator}
            component={MainNavigator}
          />
        </>        
      </Stack.Navigator>   
    ) : (
      <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <BackBar navigation={navigation} />
        <ScrollView
          style={styles.scrollArea}
          showsVerticalScrollIndicator={false}
        >
          <AppBar
            title={`${membership} Plan`}
            comment={`Professional who want to ${membership == memberType.general ? 'make more money' : 'grow their business'}`}
          />
          <View style={styles.confirmContainer}>
            <ConfirmLabel text={`General ${membership == memberType.general ? 'Ad' : '& Trending Ad'}`} active />
            <ConfirmLabel text={`${membership == memberType.general ? 'Up to 3 ' : 'Unlimited'} Social Groups`} active />
            <ConfirmLabel text={`${membership == memberType.general ? 'Up to 8 ' : 'Unlimited'} Appointments`} active />
            <ConfirmLabel text={`${membership == memberType.general ? 'Up to 4 ' : 'Unlimited'} Job listings`} active />
            <ConfirmLabel text="Support 24/7" active />
            <ConfirmLabel text="Live Chat" active />
          </View>

          <View
            style={[
              styles.selectArea,
              { marginTop: 50 }
            ]}>
            <PlanButton
              plan={{ period: "m", price: membership == memberType.general ? "19.99" : "39.99", bonus: "Cancel Anytime" }}
              onClick={() => setPlan(planType.monthly)}
              selected={plan == planType.monthly}
              title={planType.monthly}
            />                
          </View>

          <View style={styles.selectArea}>
            <PlanButton
              plan={{ period: "y", price: membership == memberType.general ? "219.99" : "439.99", bonus: "One month free" }}
              onClick={() => setPlan(planType.annual)}
              selected={plan == planType.annual}
              title={planType.annual}
            />
          </View>
          
          <View style={{ height: 50 }} />
          <FullButton title="Proceed"
            onPress={() => setModal(true)}
          />
        </ScrollView>
      </View>
      {bModal && (
        <SelectPayment
          onCancel={() => {
            setModal(false);
          }}
          onOk={onModalOk}
        />
      )}
      {bLoading && <Loading />}
    </KeyboardAvoidingView>
    )
  );
}

function SelectPayment(props) {
  const [item, setItem] = useState({});
  const onModalOk = props.onOk;
  return (
    <View style={mstyle.container}>
      <View style={mstyle.modal}>
        <Text style={mstyle.serviceTitle}>Select a Payment method.</Text>
        <CreditCardInput onChange={(form) => setItem(form)} />
        {/* <PayPal 
      amount={20}//i.e $20 
      orderID={<orderID/>} //transactionID
      ProductionClientID={<ProductionClientID/>}
      success={(a)=>{
            //callback after payment has been successfully compleated
            console.log(a)
      }} 
      failed={(a)=>{
            //callback if payment is failed
      }}
    /> */}
        <View style={mstyle.buttonContainer}>
          <View style={mstyle.buttonWrapper}>
            <ModalButton onPress={() => onModalOk(item)} title="Ok" ok />
          </View>
          <View style={mstyle.buttonWrapper}>
            <ModalButton onPress={props.onCancel} title="Cancel" />
          </View>
        </View>
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
  return monthNames[month - 1];
};

function PlanButton(props) {
  return (
    <View 
      style={[
        styles.tview, 
        props.selected ? { borderColor: "#7DBDEF" } : { borderColor: "#707070" }
      ]}>
      <TouchableOpacity onPress={() => props.onClick()} background={color.blue}>
        <View
          style={[
            styles.button,
            props.selected ? { backgroundColor: "#7DBDEF22" } : {},
            { flexDirection:'row' }
          ]}
        >
          <View
            style={[
              { marginLeft: 20, borderRadius: 15, borderWidth: 1 },
              props.selected ? { borderColor: color.blue, backgroundColor: color.blue } : { borderColor: "#707070", backgroundColor: "#0000" }
            ]}
          >
            <Image source={CheckMark} style={{ margin: 5, height: 10, width: 10, tintColor: "white" }} />
          </View>
          <View
            style={{ marginLeft: 20, marginRight: 'auto' }}
          >
            <Text
              style={{ fontSize: 20, fontWeight: "600", color: "black" }}
            >
              {props.title}
            </Text>
            <Text
              style={{ fontSize: 13, marginTop: 5, color: "gray" }}
            >
              {props.plan.bonus}
            </Text>
          </View>
          <Text
            style={{ fontSize: 20, color: "black", marginRight: 20 }}
          >
            ${props.plan.price}<Text style={{ color: "gray" }}>/{props.plan.period}</Text>
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    width: '100%',
    height: '100%',
  },
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    paddingHorizontal: 34,
    paddingBottom: 12,
  },
  scrollArea: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 26,
    paddingVertical: 16,
    borderColor: color.lightGray,
    borderRadius: 7,
    fontSize: 12,
    marginBottom: 34
  },
  tview: {
    marginLeft: "auto",
    marginRight: "auto",
    width: "100%",
    height: undefined,
    aspectRatio: 10 / 2.5,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1
  },
  selectArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10
  },
  button: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  }
});

const screenpx = 28;

const mstyle = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    position: "absolute",
    backgroundColor: "#00000064",
    justifyContent: "center",
    paddingHorizontal: screenpx,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 18,
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
    marginTop: 18,
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
