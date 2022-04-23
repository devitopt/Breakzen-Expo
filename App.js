/* eslint-disable react/jsx-filename-extension */
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppLoading from "expo-app-loading";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_500Medium
} from "@expo-google-fonts/poppins";

import RootNavigator from "./src/navigation/RootNavigator";
import { Provider } from "react-redux";
import configureStore from "./src/redux/store";
import { LogBox } from "react-native";

const store = configureStore();
const App = () => {
  LogBox.ignoreLogs(["Setting a timer"]);

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <RootNavigator />
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
