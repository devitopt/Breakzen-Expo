import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { Svg, G, Path } from "react-native-svg";
import { navName } from "../../navigation/Paths";
import { FullButton } from "../../components/fullbutton";
import { BackButton } from "../../components/backbutton";
import { buttonType, color } from "../../assets/stdafx";

export default function Searching({ route, navigation }) {
  const { searchService } = route.params;
  const [searchStr, setSearchStr] = useState("");

  const onBack = () => {
    setSearchStr("")
  }

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <View style={styles.topMenu}>
          <View style={styles.BackButton}>
            <BackButton navigation={navigation} white onBack/>
          </View>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            Find a Specialist
          </Text>
        </View>
        <View style={{ justifyContent: "center", marginBottom: 24 }}>
          <TextInput
            style={styles.textInput}
            placeholder="search"
            value={searchStr}
            onChangeText={setSearchStr}
          />
          <Svg_Search />
        </View>
        <TouchableOpacity background={color.blue} onPress={() => {
            onBack();
           navigation.navigate(navName.SearchResult, {
            searchStr,
            searchService,
          });
        }}>
          <View style={styles.zipCodeWrapper}>
            <Text style={styles.zipCode}>Use Zip Code Filter</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={{ marginBottom: 36 }}>
        <FullButton
          // onPress={() => navigation.navigate(navName.SearchResult)}
          onPress={() => {
            onBack();
            navigation.navigate(navName.SearchResult, {
              searchStr,
              searchService,
            });
          }}
          src={buttonType.search}
          title="Search"
        />
      </View>
    </View>
  );
}

function Svg_Search() {
  return (
    <Svg
      style={{ position: "absolute" }}
      xmlns="http://www.w3.org/2000/svg"
      width="15.459"
      height="15.459"
      viewBox="0 0 15.459 15.459"
    >
      <G id="search" transform="translate(0.5 0.5)">
        <G id="Group_10726" data-name="Group 10726">
          <Path
            id="Path_24601"
            data-name="Path 24601"
            d="M14.371,13.945l-4.4-4.4a5.745,5.745,0,1,0-.426.426l4.4,4.4a.3.3,0,1,0,.426-.426Zm-8.647-3.1a5.121,5.121,0,1,1,5.121-5.121A5.127,5.127,0,0,1,5.723,10.844Z"
            transform="translate(0 0)"
            stroke="#000"
            stroke-width="1"
          />
        </G>
      </G>
    </Svg>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    paddingHorizontal: 28,
    backgroundColor: "white",
  },
  topMenu: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 48,
    marginBottom: 96,
  },
  BackButton: {
    position: "absolute",
    left: 0,
    backgroundColor: "#7DBDEF",
    borderRadius: 36,
  },
  textInput: {
    textAlign: "center",
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: "#7DBDEF",
  },
  zipCodeWrapper: {
    paddingVertical: 12,
  },
  zipCode: {
    color: "#7DBDEF",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 13,
  },
});
