import * as React from "react";
import { Text, View, Image, SafeAreaView, StyleSheet } from "react-native";
import { navName } from "../../navigation/Paths";
import { FullButton } from "../../components/fullbutton";
import { size } from "../../assets/stdafx";
import SuccessAsset from "../../assets/svg/success.png";

export default function JobPostSuccess({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentWrapper}>
        <Image source={SuccessAsset} />
        <View>
          <Text style={styles.title}>Success!</Text>
          <Text style={styles.comment}>Request processed successfully</Text>
        </View>
      </View>
      <View style={styles.buttonWrapper}>
        <FullButton
          onPress={() => navigation.navigate(navName.JobListings)}
          title="Back to Listing"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 36,
    height: "100%",
    backgroundColor: "white",
  },
  contentWrapper: {
    alignItems: "center",
    justifyContent: "space-evenly",
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    paddingBottom: 16,
  },
  comment: {
    fontSize: 14,
    lineHeight: 22,
    paddingHorizontal: 24,
    color: "gray",
    textAlign: "center",
  },
  buttonWrapper: {
    marginBottom: size.screenpb,
    paddingHorizontal: 24
  },
});
