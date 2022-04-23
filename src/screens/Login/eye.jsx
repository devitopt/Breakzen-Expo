import React from "react";
import { TouchableOpacity } from "react-native";
import { Svg, Ellipse, Path } from "react-native-svg";
import { Entypo } from "@expo/vector-icons";

export function Eye(props) {
  return (
    <TouchableOpacity onPress={props.onPress}>
      {props.show ? (
        <Entypo name="eye" size={24} color="black" />
      ) : (
        <Entypo name="eye-with-line" size={24} color="black" />
      )}
      {/* <Svg
        id="Group_37033"
        data-name="Group 37033"
        xmlns="http://www.w3.org/2000/svg"
        width="19.215"
        height="13.301"
        viewBox="0 0 19.215 13.301"
      >
        <Path
          id="Path_103"
          data-name="Path 103"
          d="M12.6,20.3a10.152,10.152,0,0,0,9.561-6.391.739.739,0,0,0,0-.517A10.152,10.152,0,0,0,12.6,7a10.152,10.152,0,0,0-9.561,6.391.739.739,0,0,0,0,.517A10.152,10.152,0,0,0,12.6,20.3Zm8.068-6.65A8.7,8.7,0,0,1,12.6,18.821a8.7,8.7,0,0,1-8.068-5.172A8.7,8.7,0,0,1,12.6,8.477,8.7,8.7,0,0,1,20.672,13.649Z"
          transform="translate(-2.997 -6.999)"
          fill="#7dbdef"
        />
        <Ellipse
          id="Ellipse_134"
          data-name="Ellipse 134"
          cx="3.5"
          cy="3.5"
          rx="3.5"
          ry="3.5"
          transform="translate(6.108 2.959)"
          fill="#7dbdef"
        />
      </Svg> */}
    </TouchableOpacity>
  );
}
