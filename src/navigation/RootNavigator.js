import React, { useState, useEffect, useRef } from "react";
import { View } from 'react-native';
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { navName } from "./Paths";
import SigninNavigator from "./SigninNavigator";
import MembershipNavigator from "./MembershipNavigator";
import MainNavigator from "./MainNavigator";
import LoadingIndicator from "../components/loading";
import { auth } from "../config";
import { onAuthStateChanged } from "firebase/auth";
import { setuser } from "../redux/actioncreators";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../config/firebase";
import { useDispatch } from "react-redux";
import { WebView } from "react-native-webview";

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "white",
  },
};

const Stack = createStackNavigator();

const RootNavigator = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [isPaidProfessioanl, setIsPaidProfessional] = useState(true);
  const [isSignin, setIsSignin] = useState(false);
  const webView = useRef();

  const getUser = async (userId) => {
    try {
      const docRef = doc(firestore, "users", userId);
      const document = await getDoc(docRef);
      return document.data();
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const setConnected = async (userId) => {
    try {
      const docRef = doc(firestore, "users", userId);
      await updateDoc(docRef, {
        connected: true
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const unsubscribeAuthStateChanged = onAuthStateChanged(
      auth,
      async (authenticatedUser) => {
        setIsLoading(false);
        setIsSignin(false);
        setIsPaidProfessional(true);

        if (!authenticatedUser) {
          return;
        }

        const userData = await getUser(authenticatedUser.uid);
        if (userData && userData.logintype) {
          const userWithData = { ...userData, uid: authenticatedUser.uid };
          dispatch(setuser(userWithData));
          setIsSignin(true);

          const injected = `sendUserId('${authenticatedUser.uid}')`;
          console.log(injected);
          webView.current.injectJavaScript(injected);

          setConnected(authenticatedUser.uid);

          if (userData.professional) {
            if (userData.membership == "") {
              setIsPaidProfessional(false);
            } else {
              setIsPaidProfessional(true);
            }

          } else {
            setIsPaidProfessional(true);
          }

        }
      }
    );

    return () => unsubscribeAuthStateChanged();
  }, []);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <View style={{ width: '100%', height: '100%' }}>
      <View style={{ height: '100%' }}>
        <NavigationContainer theme={MyTheme}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isSignin ?
              isPaidProfessioanl ?
                <>
                  <Stack.Screen
                    name={navName.MainNavigator}
                    component={MainNavigator}
                  />
                </>
                : <>
                  <Stack.Screen
                    name={navName.MembershipNavigator}
                    component={MembershipNavigator}
                  />
                </>
              : <>
                <Stack.Screen
                  name={navName.SigninNavigator}
                  component={SigninNavigator}
                />
              </>
            }
          </Stack.Navigator>
        </NavigationContainer>
      </View>
      <WebView
        source={{ uri: "https://boiling-oasis-92513.herokuapp.com" }}
        ref={webView}
        style={{
          display: 'none',
        }}
      />
    </View>
  );
};

export default RootNavigator;
