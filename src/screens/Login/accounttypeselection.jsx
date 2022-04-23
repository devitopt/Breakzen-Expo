import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Svg, G, Path } from "react-native-svg";
import { navName } from "../../navigation/Paths";
import { BackBar } from "./backbar";
import { AppBar } from "./appbar";
import { FullButton } from "../../components/fullbutton";
import { color, size } from "../../assets/stdafx";

export default function AccountTypeSelection({ route, navigation }) {
  const [bUser, setUser] = useState(0);
  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <BackBar navigation={navigation} />
        <AppBar
          title="Who are you?"
          comment="Select your account type to proceed"
        />
        <View style={styles.selectArea}>
          <Button
            onClick={() => setUser(0)}
            selected={!bUser}
            title="Service Provider"
          />
          <Button
            onClick={() => setUser(1)}
            selected={bUser}
            title="New User"
          />
        </View>
      </View>
      <FullButton
        onPress={() =>
          !bUser ? navigation.navigate(navName.RegisterProfessional, {values: route.params}) : navigation.navigate(navName.RegisterClient, {values: route.params})
        }
        title="Proceed"
      />
    </View>
  );
}

function Button(props) {
  return (
    <View style={styles.tview}>
      <TouchableOpacity onPress={() => props.onClick()} background={color.blue}>
        <View
          style={[
            styles.button,
            props.selected ? { backgroundColor: color.blue } : {},
          ]}
        >
          <View style={styles.imageWrapper}>
            <Svg_User />
          </View>
          <Text
            style={[
              { fontSize: 13 },
              props.selected ? { color: "white" } : { color: "black" },
            ]}
          >
            {props.title}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

function Svg_User() {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="19.195"
      height="23.258"
      viewBox="0 0 19.195 23.258"
    >
      <G id="technical-support" transform="translate(0 -2.173)">
        <G
          id="Group_38581"
          data-name="Group 38581"
          transform="translate(0 2.173)"
        >
          <G
            id="Group_38576"
            data-name="Group 38576"
            transform="translate(0 9.716)"
          >
            <G id="Group_38575" data-name="Group 38575">
              <G id="Group_38574" data-name="Group 38574">
                <G id="Group_38573" data-name="Group 38573">
                  <Path
                    id="Path_31224"
                    data-name="Path 31224"
                    d="M143.706,234.858a1.085,1.085,0,0,1-.88-1.065v-2.979h-4.147v2.979a1.087,1.087,0,0,1-.88,1.065l1.025,1.375h3.858A13.52,13.52,0,0,0,143.706,234.858Z"
                    transform="translate(-131.155 -230.813)"
                    fill="#ffddce"
                  />
                  <Path
                    id="Path_31225"
                    data-name="Path 31225"
                    d="M24.781,326.855v-1.771a6.407,6.407,0,0,0-5.2-6.291c-.3-.057-8.207,0-8.207,0a6.407,6.407,0,0,0-5.2,6.291v1.771Z"
                    transform="translate(-5.884 -314.527)"
                    fill="#ffd064"
                  />
                  <Path
                    id="Path_31226"
                    data-name="Path 31226"
                    d="M45.54,312.374H34.919a1.144,1.144,0,0,0-1.142,1.206l.4,7.394h12.1l.4-7.394A1.143,1.143,0,0,0,45.54,312.374Z"
                    transform="translate(-32.147 -308.442)"
                    fill="#eaf2ff"
                  />
                  <Path
                    id="Path_31227"
                    data-name="Path 31227"
                    d="M276.555,312.374H273.31a1.144,1.144,0,0,1,1.142,1.206l-.4,7.394H277.3l.4-7.394A1.144,1.144,0,0,0,276.555,312.374Z"
                    transform="translate(-260.132 -308.442)"
                    fill="#dbe8f9"
                  />
                  <Path
                    id="Path_31228"
                    data-name="Path 31228"
                    d="M16.057,479.253v-.611l-.13-.19H.8a.8.8,0,1,0,0,1.6H15.256a.8.8,0,0,0,.8-.8Z"
                    transform="translate(0 -466.512)"
                    fill="#9bc4f9"
                  />
                  <Path
                    id="Path_31229"
                    data-name="Path 31229"
                    d="M316.971,478.451H314.5v.8a.8.8,0,0,1-.8.8h3.268a.8.8,0,0,0,0-1.6Z"
                    transform="translate(-298.578 -466.511)"
                    fill="#7fb2f9"
                  />
                </G>
              </G>
              <Path
                id="Path_31230"
                data-name="Path 31230"
                d="M155.2,373.775a2.654,2.654,0,0,1,.685-1.775l.01-.011a2.272,2.272,0,0,0-.574-3.49.2.2,0,0,0-.292.169v1.69a.513.513,0,0,1-.513.513h-.631a.513.513,0,0,1-.513-.513v-1.69a.2.2,0,0,0-.292-.169,2.272,2.272,0,0,0-.574,3.49l.01.011a2.654,2.654,0,0,1,.685,1.775Z"
                transform="translate(-144.603 -361.835)"
                fill="#bcd6f9"
              />
            </G>
          </G>
          <G
            id="Group_38580"
            data-name="Group 38580"
            transform="translate(4.565)"
          >
            <G id="Group_38579" data-name="Group 38579">
              <G id="Group_38578" data-name="Group 38578">
                <G id="Group_38577" data-name="Group 38577">
                  <Path
                    id="Path_31231"
                    data-name="Path 31231"
                    d="M119.224,53.83a3.937,3.937,0,0,0,1.3-2.9l-.013-5.339a4.01,4.01,0,0,0-.449-1.848,4.272,4.272,0,0,0-1.459-.268,4.024,4.024,0,0,0-4.048,4.011l0,.787.012,2.644a3.847,3.847,0,0,0,1.294,2.822,4.309,4.309,0,0,0,1.882.965A4.494,4.494,0,0,0,119.224,53.83Z"
                    transform="translate(-113.596 -42.794)"
                    fill="#ffddce"
                  />
                  <Path
                    id="Path_31232"
                    data-name="Path 31232"
                    d="M180.661,51.415a3.95,3.95,0,0,0-2.82-3.775,3.9,3.9,0,0,1,.539,1.987l.013,5.219a3.848,3.848,0,0,1-1.27,2.833,4.349,4.349,0,0,1-1.654.924,4.085,4.085,0,0,0,3.935-.924,3.848,3.848,0,0,0,1.27-2.833Z"
                    transform="translate(-171.574 -46.756)"
                    fill="#ffcbbe"
                  />
                  <Path
                    id="Path_31233"
                    data-name="Path 31233"
                    d="M99.58,32.635h.282a3.633,3.633,0,0,0,1.126-.187,2.061,2.061,0,0,1,.615-.1V32.1a4,4,0,0,0-.551-2.033h0a3.979,3.979,0,0,0-.487-.657l-.325-.11H97.868a3.179,3.179,0,0,0-3.179,3.179v2.1a.725.725,0,0,0,.487.685l.783.273a.421.421,0,0,0,.559-.4l0-1.481a1.3,1.3,0,0,1,1.283-1.31h.016a2.062,2.062,0,0,1,.639.1A3.632,3.632,0,0,0,99.58,32.635Z"
                    transform="translate(-94.689 -29.301)"
                    fill="#756e78"
                  />
                  <Path
                    id="Path_31234"
                    data-name="Path 31234"
                    d="M213.093,30.959h-.042a.419.419,0,0,1-.419-.419,1.24,1.24,0,0,0-1.24-1.24H209.82a3.874,3.874,0,0,1,1.255,2.871v.181c.044,0,.088,0,.132,0h.015a1.3,1.3,0,0,1,1.283,1.31v1.482a.421.421,0,0,0,.559.4l.783-.273a.725.725,0,0,0,.487-.685V32.2A1.239,1.239,0,0,0,213.093,30.959Z"
                    transform="translate(-204.269 -29.301)"
                    fill="#665e66"
                  />
                </G>
              </G>
            </G>
          </G>
        </G>
      </G>
    </Svg>
  );
}

const imageSize = 42;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    paddingHorizontal: 34,
    paddingBottom: size.screenpb,
  },
  tview: {
    width: "46%",
    height: undefined,
    aspectRatio: 10 / 9,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#707070",
  },
  button: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  imageWrapper: {
    width: imageSize,
    height: imageSize,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: imageSize,
    marginBottom: 12,
  },
  selectArea: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
