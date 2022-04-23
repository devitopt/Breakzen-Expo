import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSelector, useDispatch } from "react-redux";
import { BackButton } from "../../components/backbutton";
import { breakzen, chatCollection, color, memberType, size } from "../../assets/stdafx";
import { FullButton } from "../../components/fullbutton";
import { addinfo } from "../../redux/actioncreators";
import { firestore, functions } from "../../config/firebase";
import { doc, updateDoc, addDoc, collection } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { Loading } from "../../components/loading";
import { CardItem } from "../../components/carditem";
import { ModalButton } from "../../components/modalbutton";
import {
  CreditCardInput,
  LiteCreditCardInput,
} from "react-native-credit-card-input";


export default function MySubscription({ navigation }) {
  const user = useSelector((state) => state.user);
  const [showBox, setShowBox] = useState(true);
  const dispatch = useDispatch();
  const addInfo = (info) => dispatch(addinfo(info));

  const [bModal, setModal] = useState(false);
  const [bLoading, setLoading] = useState(false);
  const [bRecurring, setRecurring] = useState(true);
  const [card, setCard] = useState(user.card);
  const [membershipType, setMembershipType] = useState(null);

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
  }, [card])

  const createPaymentMethod = httpsCallable(functions, "createPaymentMethod");
  const createSubscription = httpsCallable(functions, "createSubscription");
  const cancelSubscription = httpsCallable(functions, "cancelSubscription");
  const sendNotification = httpsCallable(functions, 'sendNotification');

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

  const onPressPlan = (membershipType) => {   
    setSubscription(membershipType);    
  };

  
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
            setSubscription(membershipType, res.data.customerId);
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const setSubscription = async (membershipType, customerId = null) => {    
    
    console.log("subscription...")

    if (!bLoading) {
      setLoading(true);
    }

    await createSubscription({
      customerId: user.customerId || customerId,
      price: membershipType == memberType.general ? MONTHLY_GENERAL_PRICE : MONTHLY_PRO_PRICE

    })
      .then(async (res) => {
        console.log(res);
          const docRef = doc(firestore, "users", user.uid);
          await updateDoc(docRef, { membership: membershipType, expireDate: new Date(), subscriptionId: res.data.subscriptionId} ).then(() => {
            addInfo({membership: membershipType, expireDate: new Date(), subscriptionId: res.data.subscriptionId });
            const collectionRef = collection(
              firestore,
              chatCollection(user.uid, breakzen.uid)
            );
            let message = !user.membership ? "We processed your payment successfully!" : "Your plan was updated successfully!";
            addDoc(collectionRef, {
              content: message,
              read: false,
              receiver: user.uid,
              sender: breakzen.uid,
              time: new Date(),
            });
            send(message)
          });          
      })
      .catch((error) => {
        let message = !user.membership ? "We are sorry to announce you that your payment fails!\n Please try again or update your payment method. If the problem persist, please contact support@breakzen.com" : "We failed updating your plan, please check your payment method or contact support@breakzen.com"
        addDoc(collectionRef, {
          content: message,
          read: false,
          receiver: user.uid,
          sender: breakzen.uid,
          time: new Date(),
        });
        send(message)
        
        console.log(error);
      });
      
      setLoading(false);
     
      navigation.goBack();
  }

  const send = async (txt) => {
    const tokenArray = [{
      to: user.token,
      sound: "default",
      title: "Breakzen",
      body: txt,
      priority: "high"      
    }]
    await sendNotification({
      tokenArray: tokenArray,
    })
  }

  const cancel = async () => {    
    
    console.log("cancel subscription...", user.subscriptionId)

    var msDiff = new Date().getTime() - timeStamp.getTime();    
    const prorate = msDiff < 1000 * 60 * 60 * 24 * 14 ? true : false
   
    setLoading(true);    

    await cancelSubscription({
      subscriptionId: user.subscriptionId,
      prorate: prorate
    })
      .then(async (res) => {
        console.log(res);
          const docRef = doc(firestore, "users", user.uid);
          await updateDoc(docRef, { subscriptionId: "", membership: "", expireDate: "" } ).then(() => {
            addInfo({subscriptionId: "", membership: "", expireDate: "" });
          });
      })
      .catch((error) => {
        console.log(error);
      });
      
      setLoading(false);
     
      navigation.goBack();
  }

  

  const showConfirmDialog = () => {
    return Alert.alert(
      "Confirm",
      "Do you really want to cancel your subscription?",
      [        
        {
          text: "Yes",
          onPress: () => {
            setShowBox(false);
            cancel()
          },
        },        
        {
          text: "Cancel",
        },
      ]
    );
  };

  const showAlert = () => {
    return Alert.alert(
      "Warnning",
      "You've already paid this subscription",
      [        
        {
          text: "Ok",
          onPress: () => {
            setShowBox(false);            
          },
        },                
      ]
    );
  };

  
  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.backBar}>
          <BackButton navigation={navigation} />
        </View>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <Text style={styles.caption}>My Subscription</Text>
          <Text style={styles.comment}>
            Your current membership subscription
          </Text>

          {user.membership != "" && (
            <View style={styles.topBar}>
              <View style={styles.spaceBetween}>
                <View style={styles.flexCenter}>
                  <Text style={styles.topBarTitle}>
                    {user.membership} Access
                  </Text>
                  <View style={styles.activeSymbol} />
                </View>
                <Text style={styles.payment}>{`Expire on ${expireDate}`}</Text>
              </View>
              <View style={[styles.spaceBetween, { marginTop: 12 }]}>
                <Text style={styles.topBarTitle}>Recurring Payment</Text>
                <View style={styles.flexCenter}>
                  <RecurringButton
                    title="Yes"
                    active={bRecurring}
                    onPress={() => setRecurring(true)}
                  />
                  <RecurringButton
                    title="Stop"
                    active={!bRecurring}
                    onPress={() => setRecurring(false)}
                  />
                </View>
              </View>
            </View>
          )}

          <Text style={styles.title}>General Access</Text>
          <Text style={styles.comment}>
          This membership gives you access to connect with your next client, advertise in our platform 24/7, 
          create up to 3 Social Groups, accept up to 8 appointments monthly, apply up to 4 job listings, and live chat.
          </Text>
          <View style={styles.spaceBetween}>
            <Text style={styles.payment}>Monthly Payment</Text>
            <Text style={styles.price}>$ 19.99</Text>
          </View>
          {user.membership != memberType.general ? (
            <>
              <View style={styles.spaceBetween}>
                <View style={styles.flexCenter}>
                  <Text style={styles.payment}>Yearly Payment</Text>
                  <Text style={[styles.payment, styles.free]}>
                    +1 Month Free
                  </Text>
                </View>
                <Text style={styles.price}>$ 219.99</Text>
              </View>
              <View style={styles.fullButton}>
                <FullButton
                  title="Select Plan"                  
                  onPress={() => user.customerId ? onPressPlan(memberType.general) : (setModal(true), setMembershipType(memberType.general)) }
                />
              </View>              
            </>
          ) : (
            <>
              <View style={styles.spaceBetween}>
                <Text style={styles.payment}>Card Number</Text>
                <Text style={styles.price}>
                  {user.card && user.card.last4 ? "**** **** **** " + user.card.last4 : "**** **** **** ****"}
                </Text>
              </View>
              <View style={styles.fullButton}>
                <View style={styles.spaceBetween}>
                  <View style={styles.upgradeContainer}>
                    <FullButton title="Your Plan"
                    onPress={() => showAlert()}
                    />
                  </View>
                  <View style={styles.cancelContainer}>
                    <TouchableOpacity                      
                      onPress={() => showConfirmDialog() }
                    >
                      <View style={styles.cancelWrapper}>
                        <Text style={{ color: "white" }}>Cancel</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </>
          )}
          <Text style={styles.title}>Pro Access</Text>
          <Text style={styles.comment}>
          This membership gives you access to connect with your next client, advertise in our platform 24/7, 
          be featured in home page, create unlimited Social Groups, 
          accept unlimited appointments monthly, apply unlimited job listings, and live chat.
          </Text>
          <View style={styles.spaceBetween}>
            <Text style={styles.payment}>Monthly Payment</Text>
            <Text style={styles.price}>$ 39.99</Text>
          </View>

          {user.membership != memberType.pro ? (
            <>
              <View style={styles.spaceBetween}>
                <View style={styles.flexCenter}>
                  <Text style={styles.payment}>Yearly Payment</Text>
                  <Text style={[styles.payment, styles.free]}>
                    +1 Month Free
                  </Text>
                </View>
                <Text style={styles.price}>$ 449.99</Text>
              </View>
              <View style={styles.fullButton}>
                <FullButton
                  title="Select Plan"
                  onPress={() => user.customerId ? onPressPlan(memberType.pro) : (setModal(true), setMembershipType(memberType.pro))}
                />
              </View>  
            </>
          ) : (
            <>
              <View style={styles.spaceBetween}>
                <Text style={styles.payment}>Card Number</Text>
                <Text style={styles.price}>
                {user.card && user.card.last4 ? "**** **** **** " + user.card.last4 : "**** **** **** ****"}
                </Text>
              </View>
              <View style={styles.fullButton}>
                <View style={styles.spaceBetween}>
                  <View style={styles.upgradeContainer}>
                    <FullButton title="Your Plan"
                    onPress={() => showAlert()}
                     />
                  </View>
                  <View style={styles.cancelContainer}>
                    <TouchableOpacity
                    onPress={() => showConfirmDialog() }
                    >
                      <View style={styles.cancelWrapper}>
                        <Text style={{ color: "white" }}>Cancel</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </>
          )}
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
    </View>
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

function RecurringButton(props) {
  return (
    <View style={rstyles.container}>
      <TouchableOpacity onPress={props.onPress}>
        <View
          style={[
            rstyles.button,
            props.active ? { backgroundColor: color.blue } : {},
          ]}
        >
          <Text style={props.active ? { color: "white" } : { color: "black" }}>
            {props.title}
          </Text>
        </View>
      </TouchableOpacity>
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

const styles = StyleSheet.create({
  screen: {
    width: "100%",
    height: "100%",
  },
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    paddingHorizontal: 28,
  },
  backBar: {
    marginTop: 48,
    marginBottom: 36,
  },
  caption: {
    fontSize: 20,
    fontWeight: "bold",
    paddingBottom: 12,
  },
  comment: {
    fontSize: 13,
    lineHeight: 22,
    color: "gray",
    paddingBottom: 18,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    paddingTop: 36,
    paddingBottom: 12,
  },
  topBar: {
    paddingTop: 24,
    paddingBottom: 12,
  },
  spaceBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 8,
  },
  flexCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  topBarTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#153E73",
  },
  activeSymbol: {
    width: 10,
    height: 10,
    borderRadius: 10,
    marginLeft: 12,
    backgroundColor: "#C2E1B9",
  },
  payment: {
    fontSize: 13,
  },
  free: {
    color: color.blue,
    paddingLeft: 18,
  },
  price: {
    fontSize: 16,
  },
  fullButton: {
    paddingTop: 12,
    paddingBottom: size.screenpb,
  },
  upgradeContainer: {
    width: "60%",
  },
  cancelContainer: {
    width: "35%",
    height: 50,
    borderRadius: 7,
    backgroundColor: "#EF7D7D",
    overflow: "hidden",
  },
  cancelWrapper: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

const rstyles = StyleSheet.create({
  container: {
    width: 60,
    height: 30,
    borderRadius: 7,
    overflow: "hidden",
  },
  button: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
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