import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
} from "react-native";

import { CardItem } from "../../components/carditem";
import { useSelector, useDispatch } from "react-redux";
import { addinfo } from "../../redux/actioncreators";
import { FullButton } from "../../components/fullbutton";
import { BackBar } from "./backbar";
import { AppBar } from "./appbar";
import { InputLabel } from "./inputlabel";
import { ConfirmLabel } from "./confirmlabel";
import { color, inputType, size } from "../../assets/stdafx";
import { Eye } from "./eye";
import { ModalButton } from "../../components/modalbutton";
import {
  CreditCardInput,
  LiteCreditCardInput,
} from "react-native-credit-card-input";
import { firestore, storage, functions, firebase, auth } from "../../config/firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { Loading } from "../../components/loading";
import { updatePassword, signInWithEmailAndPassword, deleteUser } from "firebase/auth";
import { navName } from "../../navigation/Paths";


export default function MyAccount({ navigation }) {
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const addInfo = (info) => dispatch(addinfo(info));

  const [bModal, setModal] = useState(false);
  const [bLoading, setLoading] = useState(false);
  const [currentPwdVisible, setCurrentPwdVisible] = useState(true);
  const [newPwdVisible, setNewPwdVisible] = useState(true);
  const [card, setCard] = useState(user.card ? user.card : {});
  const [currentPwd, setCurrrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");


  const createPaymentMethod = httpsCallable(functions, "createPaymentMethod");
  const updatePaymentMethod = httpsCallable(functions, "updatePaymentMethod");

  const onModalOk = (item) => {
    if (item.valid) {
      setModal(false);
      setCard(item);
      //console.log(item);
    }
  };

  const saveData = async () => {    
    if (currentPwd.length > 0 && newPwd.length > 0) {
      if (newPwd.length > 7) {
        setLoading(true);
        await changePassword();
      } else {
        setLoading(false);
        alert("Password must be at least 8 characters");
      }
    }

    if (card && card.values) {
      setLoading(true);
      updatePayment();
    }     
  };

  const changePassword = async () => {  
    try {
      await signInWithEmailAndPassword(auth, user.email, currentPwd)
      .then(() => {
      updatePassword(auth.currentUser, newPwd)
        .then(() => {
          setLoading(false);
          alert("Password updated!");
        }).catch((error) => {
          setLoading(false);
          alert(error);
        }).catch((error) => {
          setLoading(false);
          alert(error);
        })
      })
    } catch (error) {
      setLoading(false);
      if (error.toString().includes('user-not-found')) {
        alert('User not found');
      } else if (error.toString().includes('invalid-email')){
        alert("Invalid Email Address");
      } else if (error.toString().includes('wrong-password')) {
        alert("Wrong password");
      } else {
        alert(error);
      }
    }
    setLoading(false);
  } 

  const updatePayment =  async () => {
    if (user.customerId != "") {
      console.log("updating...");
      console.log(card)
      console.log(user.customerId);
      
      await updatePaymentMethod({
        cardDetails: {
          number: card.values.number.replace(" ", ""),
          exp_month: parseInt(card.values.expiry.split("/")[0]),
          exp_year: 2000 + parseInt(card.values.expiry.split("/")[1]),
          cvc: card.values.cvc,
        },        
        customerId: user.customerId,
      })
        .then(async (res) => {        
          console.log(res);
          console.log("update success")
          const docRef = doc(firestore, "users", user.uid);
          await updateDoc(docRef, { card: {last4: card.values.number.slice(-4)}}).then(() => {
            addInfo({ card: {last4: card.values.number.slice(-4)} });
          });
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log("creating...");
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
        console.log("create success")
        const docRef = doc(firestore, "users", user.uid);
        await updateDoc(docRef, { customerId: res.data.customerId, card: {last4: card.values.number.slice(-4)}}).then(() => {
          addInfo({ customerId: res.data.customerId, card: {last4: card.values.number.slice(-4)} });
        });
      })
      .catch((error) => {
        console.log(error);
      });
    }
    setLoading(false);
  }

  const onDelete = () => {
    return Alert.alert(
      "Delete Account",
      "Are you sure you want to delete permanently your account?",
      [        
        {
          text: "Yes",
          onPress: () => {
            deleteAccount();
          },
        },
        {
          text: "No"
        }
      ]
    );
  }

  const deleteAccount = async () => {

    const docRef = doc(firestore, "users", user.uid);
    deleteDoc(docRef).then(() => {      
      const currentuser = auth.currentUser;
      deleteUser(currentuser).then(() => {
        navigation.replace(navName.SigninNavigator, {
          screen: navName.WelcomeScreen,
        });
      }).catch((error) => {        
        alert(error);
      })
    });    
  }

  return (
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
            title="My Account"
            comment="Change your password here; If you need to update your email, please contact Support@breakzen.com"
          />
          <InputLabel href="" src={inputType.email} title="Email Address" />
          <Text style={styles.email}>{user.email}</Text>
          <Text style={styles.title}>Password</Text>
          <InputLabel
            href=""
            src={inputType.password}
            title="Current Password"
          />         
          <View style={styles.passwordInput}>
            <TextInput
              style={styles.input}
              placeholder="* * * * * *"
              secureTextEntry={currentPwdVisible}
              onChangeText={(text) => setCurrrentPwd(text)}
              value={currentPwd}
            />
            <View style={{ position: "absolute", right: 17 }}>
              <Eye show={currentPwdVisible} onPress={() => setCurrentPwdVisible(!currentPwdVisible)} />
            </View>
          </View>
          <InputLabel href="" src={inputType.password} title="New Password" />          
          <View style={styles.passwordInput}>
            <TextInput
              style={styles.input}
              placeholder="* * * * * *"
              secureTextEntry={newPwdVisible}
              onChangeText={(text) => setNewPwd(text)}
              value={newPwd}
            />
            <View style={{ position: "absolute", right: 17 }}>
              <Eye show={newPwdVisible} onPress={() => setNewPwdVisible(!newPwdVisible)} />
            </View>
          </View>
          <View style={styles.confirmContainer}>
            <ConfirmLabel text="Be 8 to 72 characters long" active />
            <ConfirmLabel text="not contain your name or email" active />
            <ConfirmLabel text="not be commonly used or easily guessed" />
          </View>
          {user.professional && (
            <View>
              <View style={styles.payMenu}>
                <Text style={styles.title}>Payment Methods</Text>
                <TouchableOpacity onPress={() => setModal(true)}>
                  <View style={styles.updateWrapper}>
                    <Text style={styles.update}>Update</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <CardItem card={card} />
            </View>
          )}
          <View style={{ height: 18 }} />
          <FullButton onPress={saveData} title="Save" />
          <View>
            <Text style={styles.deleteLabel} onPress={onDelete}>Delete Account</Text>
          </View>
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

const inputpl = 32;
const screenpx = 28;

const styles = StyleSheet.create({
  screen: {
    width: "100%",
    height: "100%",
  },
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    paddingHorizontal: 34,
    paddingBottom: size.screenpb,
  },
  scrollArea: {
    flex: 1,
  },
  email: {
    color: color.blue,
    marginLeft: inputpl,
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderColor: color.blue,
    borderRadius: 7,
    marginLeft: inputpl,
    fontSize: 12,
  },
  passwordInput: {
    justifyContent: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    paddingTop: 24,
    paddingBottom: 16,
  },
  confirmContainer: {
    marginBottom: 12,
    marginTop: 12,
  },
  confirmLabel: {
    paddingLeft: inputpl,
    paddingVertical: 8,
    justifyContent: "center",
  },
  payMenu: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  updateWrapper: {
    marginTop: 8,
  },
  update: {
    color: color.blue,
    fontWeight: "500",
    padding: 8,
  },
  deleteLabel: {
    color: "red",
    marginTop: 50,
    textAlign: "center",
    marginBottom: 50,
    padding: 10,
    fontWeight: '600'
  }
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
