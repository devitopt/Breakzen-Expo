import React, { useState, useEffect } from "react";
import { Text, Image, View, StyleSheet } from "react-native";
import { BackButton } from "../../components/backbutton";
import { useSelector, useDispatch } from "react-redux";
import { FullButton } from "../../components/fullbutton";
import StripeIdentity from "react-native-stripe-identity";
import { httpsCallable } from "firebase/functions";
import { functions } from "../../config/firebase";
import { Loading } from "../../components/loading";
import { firestore, storage } from "../../config/firebase";
import { addinfo } from "../../redux/actioncreators";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { idcheckStatus } from "../../assets/stdafx";


export default function ActivatingAccount({ navigation }) {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const addInfo = (info) => dispatch(addinfo(info));
  const [bLoading, setLoading] = useState(false);
  const createVerificationSession = httpsCallable(functions, "createVerificationSession");
  const [redirectToUrl, setRedirectToUrl] = useState("");

  const verifiySession =  async () => { 

    if (!user.verificationSessionId) {      
      setLoading(true);
      await createVerificationSession({
        user_id: user.uid,
      })
        .then(async (res) => {
          const response = res.data.response;
          console.log(res.data);          
          setRedirectToUrl(response.url)
          const docRef = doc(firestore, "users", user.uid);
          await updateDoc(docRef, { url: response.url, client_secret: response.client_secret, verificationSessionId: response.id, idverify: response.status ? response.status : "" } ).then(() => {
            addInfo({ url: response.url, client_secret: response.client_secret, verificationSessionId: response.id, idverify: response.status ? response.status : ""});
          });
      })
        .catch((error) => {
          console.log(error);
        });
    } else {
      if (user.url) {
        setLoading(true);
        console.log(user.url);
        setRedirectToUrl(user.url)
      }
    }
  };

  const updateStatus = async () => {
    const docRef = doc(firestore, "users", user.uid);
    await updateDoc(docRef, { idverify: idcheckStatus.processing } ).then(() => {
      addInfo({ idverify: idcheckStatus.processing});
    });

  }

  return (
    
    <View style={styles.container}>
      <View style={{ marginTop: 48, marginBottom: 36 }}>
        <BackButton navigation={navigation} />
      </View>
      <View style={{ flex: 1 }}>
        {redirectToUrl == "" && <View style={{ flex: 1 }}>
          <Text style={styles.title}>Activate Your Account</Text>
          <Text style={styles.comment}>
            As a professional we need to verify your account
          </Text>

          <View style={ styles.bottomView }>
            <FullButton style={{marginTop: 200, position: "abolute", bottom:50}}
              onPress={() => verifiySession()}
              title="Proceed"
            />
          </View>
        </View>}
        {redirectToUrl != "" && redirectToUrl != "success" && <View style={{ flex: 1 }}>
        
          <StripeIdentity
            redirectToUrl={redirectToUrl}
            refreshUrl="https://example.com/refresh"
            onSuccess={({ verificationIntentId }) => {
              console.log(`Stripe identity session succeeded. verification intent id: ${verificationIntentId}.`);
              setRedirectToUrl("success");      
              updateStatus()      
            }}
            onRefresh={() => {
              console.log(`Stripe identity session requested refresh.`);
            }}
            onLoadingComplete={() => {
              setLoading(false)
            }}
          />        
        </View>}
        {redirectToUrl == "success" && <View style={{ flex: 1 }}>
          <Text style={styles.title}>Welcome to Identity Verifcation</Text>
          <Text style={styles.comment}>We received your identify document. Please wait. We will let you know once it's completed</Text>
        </View>}
      </View>
      {bLoading && <Loading />}  
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    paddingBottom: 12,
    paddingHorizontal: 28,
  },
  comment: {
    fontSize: 14,
    lineHeight: 22,
    color: "gray",
    paddingHorizontal: 28,
  },
  subTitle: {
    fontSize: 14,
    fontWeight: "500",
    paddingTop: 36,
    paddingBottom: 36,
  },
  image: {
    alignSelf: "center",
    marginBottom: 18,
  },
  subcomment: {
    alignSelf: "center",
    fontSize: 13,
    color: "gray",
    paddingBottom: 12,
  },
  bottomView:{ 
    width: '100%', 
    height: 50,     
    justifyContent: 'center', 
    alignItems: 'center',
    position: 'absolute',
    bottom: 50,
    paddingHorizontal: 28,
  },
});
