import React, { useEffect, useState } from "react";
import {
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { backcheckState, checkrKey, color, size } from "../../assets/stdafx";
import { BackButton } from "../../components/backbutton";
import { FullButton } from "../../components/fullbutton";
import { addinfo } from "../../redux/actioncreators";
import EmailVerify from "../../assets/svg/email_verify.png";
import { ModalButton } from "../../components/modalbutton";
import { Loading } from "../../components/loading";
import {
  StripeProvider,
  CardField,
  useStripe,
} from "@stripe/stripe-react-native";
import { firestore, functions } from "../../config/firebase";
import { httpsCallable } from "firebase/functions";
import { doc, updateDoc } from "firebase/firestore";
import { WebView } from "react-native-webview";
const stripePublishableKey =
  "pk_test_51JgygeEEI6dOK9WQe24E7Me0fNkSRIUT52ZLWhFgJ9GZkE9jpAEd4F8odrYETWecnwXGj8jdRBgJFkmQNFG4lA9E009RMPtQvO";

export default function BackCheck({ navigation }) {
  const user = useSelector((state) => state.user);
  const userNames = user.name.split(" ");

  const dispatch = useDispatch();
  const addInfo = (info) => dispatch(addinfo(info));

  const [sModal, setSModal] = useState(false);
  const [bLoading, setLoading] = useState(false);

  const checkrHeaders = {
    Accept: "application/json",
    Authorization: checkrKey,
    "Content-Type": "application/json",
    "X-User-Agent": "Checkr.2.0.0.js",
  };

  const createCandidate = async () =>
    fetch("https://api.checkr.com/v1/candidates", {
      method: "POST",
      headers: checkrHeaders,
      body: JSON.stringify({
        first_name: userNames[0],
        last_name: `LA${userNames[1]}`, // Temporary value
        email: user.email,
      }),
    });

  const inviteCandidate = async (candidate_id) =>
    fetch("https://api.checkr.com/v1/invitations", {
      method: "POST",
      headers: checkrHeaders,
      body: JSON.stringify({
        package: "driver_pro",
        candidate_id,
        work_locations: [
          {
            country: "US",
            state: "CA",
            city: "San Francisco",
          },
        ],
        communication_types: ["email", "sms"],
      }),
    });

  // const createGeo = () => {
  //   fetch('https://api.checkr.com/v1/geos', {
  //     method: 'POST',
  //     headers: checkrHeaders,
  //     body: JSON.stringify({
  //       name: 'New York',
  //       state: 'NY',
  //       city: 'New York',
  //     }),
  //   })
  //     .then(response => response.json())
  //     .then(json => {
  //       console.log(json);
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     });
  // };

  const updateDatabase = () => {
    updateDoc(doc(firestore, "users", user.uid), {
      backcheck: backcheckState.pending,
    }).then(() => {
      addInfo({ backcheck: backcheckState.pending });
      navigation.goBack();
    });
  };

  const createInvitation = () => {
    setSModal(true);
  };

  const onOkPay = () => {
    setSModal(false);
    setLoading(true);
    createCandidate()
      .then((response) => response.json())
      .then((json) => {
        const candidate_id = json.id;
        inviteCandidate(candidate_id)
          .then((response) => response.json())
          .then((json) => {
            updateDatabase();
            setLoading(false);
          })
          .catch((error) => {
            alert(error);
            setLoading(false);
          });
      })
      .catch((error) => {
        alert(error);
        setLoading(false);
      });
  };

  const onCancelPay = () => {
    setSModal(false);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.backBar}>
          <BackButton navigation={navigation} />
        </View>
        <View style={styles.main}>
          <Image source={EmailVerify} />
          <Text style={styles.title}>Send Request</Text>
          <Text style={styles.comment}>
            Please confirm your email to start check
          </Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
        <FullButton title="Send Request" onPress={createInvitation} />
      </View>
      {sModal && (
        <StripeProvider
          publishableKey={stripePublishableKey}
          merchantIdentifier="merchant.identifier"
        >
          <SelectPayment
            onOk={onOkPay}
            onCancel={onCancelPay}
            email={user.email}
            paymentMethodId={user.paymentMethodId}
            setLoading={setLoading}
          />
        </StripeProvider>
      )}
      {bLoading && <Loading />}
    </View>
  );
}

function SelectPayment(props) {
  const { email, paymentMethodId } = props;
  const mModalOK = props.onOk;
  const setLoading = props.setLoading;

  const [showGateway, setShowGateway] = useState(false);
  const [prog, setProg] = useState(false);
  const [progClr, setProgClr] = useState("#000");
  const onMessage = (e) => {
    let data = e.nativeEvent.data;
    setShowGateway(false);
    console.log(data);
    let payment = JSON.parse(data);
    if (payment.status === "COMPLETED") {
      // alert("PAYMENT MADE SUCCESSFULLY!");
      mModalOK();
    } else {
      alert("PAYMENT FAILED. PLEASE TRY AGAIN.");
    }
  };

  const createPaymentIntent = httpsCallable(functions, "createPaymentIntent");

  const onCardOk = () => {
    if (paymentMethodId == "") {
      alert("Please select your card on My Account page.");
    } else {
      setLoading(true);
      createPaymentIntent({ email, amount: 800 })
        .then((res) => {
          console.log(res);
          setLoading(false);
          mModalOK();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <View style={mstyle.container}>
      <View style={mstyle.modal}>
        <Text style={mstyle.title}>You should pay $8 first.</Text>
        <Text style={mstyle.title}>What method would you pay with?</Text>
        <View style={mstyle.buttonContainer}>
          <View style={mstyle.buttonWrapper}>
            <ModalButton onPress={onCardOk} title="Card" ok />
          </View>
          <View style={mstyle.buttonWrapper}>
            <ModalButton
              onPress={() => setShowGateway(true)}
              title="Paypal"
              ok
            />
          </View>
          <View style={mstyle.buttonWrapper}>
            <ModalButton onPress={props.onCancel} title="Cancel" />
          </View>
        </View>
      </View>
      <SafeAreaView>
        {showGateway ? (
          <Modal
            visible={showGateway}
            onDismiss={() => setShowGateway(false)}
            onRequestClose={() => setShowGateway(false)}
            animationType={"fade"}
            transparent
          >
            <View style={wstyles.webViewCon}>
              <View style={wstyles.wbHead}>
                <TouchableOpacity
                  style={{ padding: 13 }}
                  onPress={() => setShowGateway(false)}
                >
                  <Text>Close</Text>
                </TouchableOpacity>
                <Text
                  style={{
                    flex: 1,
                    textAlign: "center",
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "#00457C",
                  }}
                >
                  PayPal GateWay
                </Text>
                <View style={{ padding: 13, opacity: prog ? 1 : 0 }}>
                  <ActivityIndicator size={24} color={progClr} />
                </View>
              </View>
              <WebView
                source={{ uri: "https://brave-wave-326720.web.app/" }}
                style={{ flex: 1 }}
                onLoadStart={() => {
                  setProg(true);
                  setProgClr("#000");
                }}
                onLoadProgress={() => {
                  setProg(true);
                  setProgClr("#00457C");
                }}
                onLoadEnd={() => {
                  setProg(false);
                }}
                onLoad={() => {
                  setProg(false);
                }}
                onMessage={onMessage}
              />
            </View>
          </Modal>
        ) : null}
      </SafeAreaView>
    </View>
  );
}

const screenpx = 32;

const styles = StyleSheet.create({
  screen: {
    width: "100%",
    height: "100%",
  },
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    paddingHorizontal: screenpx,
    paddingBottom: size.screenpb,
  },
  backBar: {
    marginTop: 48,
    marginBottom: 36,
  },
  main: {
    flex: 1,
    alignItems: "center",
    paddingTop: 36,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    paddingTop: 36,
    paddingBottom: 24,
  },
  comment: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    color: "gray",
    paddingBottom: 36,
  },
  email: {
    color: color.blue,
    fontSize: 18,
  },
});

const wstyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  btnCon: {
    height: 45,
    width: "70%",
    elevation: 1,
    backgroundColor: "#00457C",
    borderRadius: 3,
  },
  btn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  btnTxt: {
    color: "#fff",
    fontSize: 18,
  },
  webViewCon: {
    position: "absolute",
    top: 32,
    left: 0,
    right: 0,
    bottom: 0,
  },
  wbHead: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    zIndex: 25,
    elevation: 2,
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
  title: {
    fontSize: 16,
    marginBottom: 8,
  },
  buttonContainer: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonWrapper: {
    width: "30%",
  },
  cardField: {
    width: "100%",
    height: 50,
    marginVertical: 30,
  },
});
