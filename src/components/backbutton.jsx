import * as React from "react";
import { TouchableOpacity, Image, View, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import { color } from "../assets/stdafx";

const buttonSize = 36;

export function BackButton(props) {
  const onPress = props.onPress;

  const onPressButton = () => {
    if (onPress) onPress();
    props.navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPressButton} background={color.blue}>
        <View style={styles.wrapper}>
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            width="7.02"
            height="12.026"
            viewBox="0 0 7.02 12.026"
          >
            <Path
              id="Path_25"
              data-name="Path 25"
              d="M4.924,0,0,5.335l4.924,5.335"
              transform="translate(1.361 0.678)"
              stroke={props.white ? "#FFF" : "#000"}
              stroke-miterlimit="10"
              stroke-width="2"
            />
          </Svg>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: buttonSize,
    height: buttonSize,
    borderRadius: buttonSize,
    overflow: "hidden",
  },
  wrapper: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
