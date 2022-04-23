import React, { useState, useEffect } from "react";
import {
  View,
  ImageBackground,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert
} from "react-native";
import { Svg, G, Path, Circle, Rect } from "react-native-svg";
import { useSelector } from "react-redux";
import { color } from "../assets/stdafx";
import { navName } from "../navigation/Paths";
import Bottom from "../assets/svg/bottom.png";

const homeSize = 50;
const colorType = {
  unactive: "#8b8b8b",
  active: color.blue,
};

export default function BottomBarNavigator(props) {
  const navigation = props.navigation;
  const navigationState = props.navigationState;

  const pageName = navigationState.routeNames[navigationState.index];

  const user = useSelector((state) => state.user);

  const requests = user.requests ? user.requests : [];
  const grequests = user.grequests ? user.grequests : 0;

  const [newCnt, setNewCnt] = useState(0);
  const [groupCnt, setGroupCnt] = useState(0);

  useEffect(() => {
    if (user && user.chats && user.chats.length > 0) {
      setNewCnt(
        user.chats
          .map((otherid) => user[otherid])
          .reduce((prev, cur) => prev + cur)
      );
    } else setNewCnt(0);
    if (user && user.groups && user.groups.length > 0) {
      setGroupCnt(
        user.groups
          .map((group) => user[group.id])
          .reduce((prev, cur) => prev + cur)
      );
    } else setGroupCnt(0);
  }, [user]);

  const onPressGroup = () => {
    if (user) {
      if (user.professional) {
        if (user.verified && user.confirmed) {
          navigation.navigate(navName.MainNavigator, { screen: navName.Groups });
        } else {
          Alert.alert('Breakzen', 'You must verify your email and ID first');
        }
      } else {
        if (user.verified) {
          navigation.navigate(navName.MainNavigator, { screen: navName.Groups });
        } else {
          Alert.alert('Breakzen', 'You must verify your email first');
        }
      }
    }
  }

  const onJobList = () => {
    if (user) {
      if (user.professional && (!user.verified || !user.confirmed))
        Alert.alert('Breakzen', 'You mush verify your email and ID first');
      else
        navigation.navigate(
          navName.MainNavigator, {
          screen: navName.JobListings,
        })
    }
  }

  return (
    <View style={styles.barContainer}>
      <ImageBackground source={Bottom} style={styles.bar}>
        <View style={styles.container}>
          <View style={styles.doubleWrapper}>
            <View>
              <View style={styles.menuWrapper}>
                <TouchableOpacity
                  onPress={onPressGroup}
                  background={color.blue}
                >
                  <View style={styles.svgWrapper}>
                    <Svg_Group
                      color={
                        pageName === navName.Groups
                          ? colorType.active
                          : colorType.unactive
                      }
                    />
                  </View>
                </TouchableOpacity>
              </View>
              {groupCnt + grequests > 0 && (
                <View style={styles.alert}>
                  <Text style={styles.alertText}>{groupCnt + grequests}</Text>
                </View>
              )}
            </View>

            <View style={styles.menuWrapper}>
              <TouchableOpacity
                onPress={onJobList}
                background={color.blue}
              >
                <View style={styles.svgWrapper}>
                  <Svg_Search
                    color={
                      pageName === navName.JobListings
                        ? colorType.active
                        : colorType.unactive
                    }
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.homeConatainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate(user.professional ?
                navName.HomeProfessional
                : navName.HomeScreen)}
            >
              <View style={styles.homeWrapper}>
                <View style={styles.svgWrapper}>
                  <Svg_Home />
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.doubleWrapper}>
            <View>
              <View style={styles.menuWrapper}>
                <TouchableOpacity
                  onPress={() => navigation.navigate(
                    navName.MainNavigator, {
                    screen: navName.Chats,
                  })}
                  background={color.blue}
                >
                  <View style={styles.svgWrapper}>
                    <Svg_Message
                      color={
                        pageName === navName.Chats
                          ? colorType.active
                          : colorType.unactive
                      }
                    />
                  </View>
                </TouchableOpacity>
              </View>
              {newCnt + requests.length > 0 && (
                <View style={styles.alert}>
                  <Text style={styles.alertText}>{newCnt + requests.length}</Text>
                </View>
              )}
            </View>
            <View style={styles.menuWrapper}>
              <TouchableOpacity
                onPress={() => navigation.navigate(
                  navName.MainNavigator, {
                  screen: navName.PersonalProfile,
                })
                }

                background={color.blue}
              >
                <View style={styles.svgWrapper}>
                  <Svg_Breakzen
                    color={
                      pageName === navName.PersonalProfile
                        ? colorType.active
                        : colorType.unactive
                    }
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

function Svg_Group(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="27"
      height="20"
      viewBox="0 0 23.431 17.446"
    >
      <G id="user_31_" data-name="user (31)" transform="translate(0.1 0.1)">
        <G
          id="Group_38604"
          data-name="Group 38604"
          transform="translate(8.08 0)"
        >
          <G
            id="Group_38603"
            data-name="Group 38603"
            transform="translate(0 0)"
          >
            <Path
              id="Path_31240"
              data-name="Path 31240"
              d="M174.2,85.333a3.535,3.535,0,1,0,3.535,3.535A3.539,3.539,0,0,0,174.2,85.333Zm0,6.06a2.525,2.525,0,1,1,2.525-2.525A2.529,2.529,0,0,1,174.2,91.393Z"
              transform="translate(-170.666 -85.333)"
              fill={props.color}
            // stroke="#bbb"
            // stroke-width="0.2"
            />
          </G>
        </G>
        <G
          id="Group_38606"
          data-name="Group 38606"
          transform="translate(16.16 4.878)"
        >
          <G
            id="Group_38605"
            data-name="Group 38605"
            transform="translate(0 0)"
          >
            <Path
              id="Path_31241"
              data-name="Path 31241"
              d="M343.859,170.667a2.525,2.525,0,1,0,2.525,2.525A2.529,2.529,0,0,0,343.859,170.667Zm0,4.04a1.515,1.515,0,1,1,1.515-1.515A1.517,1.517,0,0,1,343.859,174.707Z"
              transform="translate(-341.334 -170.667)"
              fill={props.color}
            // stroke="#bbb"
            // stroke-width="0.2"
            />
          </G>
        </G>
        <G
          id="Group_38608"
          data-name="Group 38608"
          transform="translate(2.092 4.878)"
        >
          <G
            id="Group_38607"
            data-name="Group 38607"
            transform="translate(0 0)"
          >
            <Path
              id="Path_31242"
              data-name="Path 31242"
              d="M46.707,170.667a2.525,2.525,0,1,0,2.525,2.525A2.528,2.528,0,0,0,46.707,170.667Zm0,4.04a1.515,1.515,0,1,1,1.515-1.515A1.517,1.517,0,0,1,46.707,174.707Z"
              transform="translate(-44.182 -170.667)"
              fill={props.color}
            // stroke="#bbb"
            // stroke-width="0.2"
            />
          </G>
        </G>
        <G
          id="Group_38610"
          data-name="Group 38610"
          transform="translate(5.05 10.176)"
        >
          <G
            id="Group_38609"
            data-name="Group 38609"
            transform="translate(0 0)"
          >
            <Path
              id="Path_31243"
              data-name="Path 31243"
              d="M113.231,256a6.573,6.573,0,0,0-6.565,6.565.505.505,0,1,0,1.01,0,5.555,5.555,0,0,1,11.11,0,.505.505,0,1,0,1.01,0A6.573,6.573,0,0,0,113.231,256Z"
              transform="translate(-106.666 -256)"
              fill={props.color}
            // stroke="#bbb"
            // stroke-width="0.2"
            />
          </G>
        </G>
        <G
          id="Group_38612"
          data-name="Group 38612"
          transform="translate(16.088 12.196)"
        >
          <G id="Group_38611" data-name="Group 38611">
            <Path
              id="Path_31244"
              data-name="Path 31244"
              d="M342.41,298.667a4.545,4.545,0,0,0-2.354.657.505.505,0,0,0,.524.864,3.536,3.536,0,0,1,5.365,3.025.505.505,0,1,0,1.01,0A4.551,4.551,0,0,0,342.41,298.667Z"
              transform="translate(-339.813 -298.667)"
              fill={props.color}
            // stroke="#bbb"
            // stroke-width="0.2"
            />
          </G>
        </G>
        <G
          id="Group_38614"
          data-name="Group 38614"
          transform="translate(0 12.196)"
        >
          <G id="Group_38613" data-name="Group 38613">
            <Path
              id="Path_31245"
              data-name="Path 31245"
              d="M6.9,299.322a4.547,4.547,0,0,0-6.9,3.89.505.505,0,1,0,1.01,0,3.536,3.536,0,0,1,5.364-3.026.505.505,0,1,0,.524-.864Z"
              transform="translate(0 -298.667)"
              fill={props.color}
            // stroke="#bbb"
            // stroke-width="0.2"
            />
          </G>
        </G>
      </G>
    </Svg>
  );
}

function Svg_Search(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="20"
      viewBox="0 0 22.5 17.671"
    >
      <G id="_3" data-name="3" transform="translate(-715.336 -106.543)">
        <Rect
          id="Rectangle_17348"
          data-name="Rectangle 17348"
          width="21.5"
          height="14.138"
          transform="translate(715.836 109.576)"
          fill="none"
          stroke={props.color}
          stroke-linecap="square"
          stroke-miterlimit="10"
          stroke-width="1"
        />
        <Path
          id="Path_34198"
          data-name="Path 34198"
          d="M715.838,115.608l3.863,5.066h3.666"
          transform="translate(-0.001 -6.031)"
          fill="none"
          stroke={props.color}
          stroke-miterlimit="10"
          stroke-width="1"
        />
        <Path
          id="Path_34199"
          data-name="Path 34199"
          d="M759.337,125.739H764.1l2.24-2.938"
          transform="translate(-30.629 -11.095)"
          fill="none"
          stroke={props.color}
          stroke-miterlimit="10"
          stroke-width="1"
        />
        <Path
          id="Path_34200"
          data-name="Path 34200"
          d="M742.345,109.577v-1.927a.606.606,0,0,1,.606-.606h4.6a.606.606,0,0,1,.606.606v.311"
          transform="translate(-18.665 0)"
          fill="none"
          stroke={props.color}
          stroke-linecap="square"
          stroke-miterlimit="10"
          stroke-width="1"
        />
        <Rect
          id="Rectangle_17349"
          data-name="Rectangle 17349"
          width="4.243"
          height="2.422"
          transform="translate(724.464 113.433)"
          fill="none"
          stroke={props.color}
          stroke-linecap="square"
          stroke-miterlimit="10"
          stroke-width="1"
        />
        <Path
          id="Path_34201"
          data-name="Path 34201"
          d="M742.044,145.568v2.422H727.369v-1.211"
          transform="translate(-8.121 -27.126)"
          fill="none"
          stroke={props.color}
          stroke-linecap="square"
          stroke-miterlimit="10"
          stroke-width="1"
        />
      </G>
    </Svg>
  );
}

function Svg_Home() {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="21"
      height="24"
      viewBox="0 0 18.969 20.112"
    >
      <G id="noun_Home_1859323" transform="translate(0.25 0.25)">
        <Path
          id="Path_7"
          data-name="Path 7"
          d="M13.235,4.165a1.14,1.14,0,0,1,.863.387l6.926,7.792a1.153,1.153,0,0,1,.292.767v6.048a2.311,2.311,0,0,1-2.309,2.309H15.543V18a2.309,2.309,0,1,0-4.617,0v3.463H7.463a2.311,2.311,0,0,1-2.309-2.309V13.111a1.153,1.153,0,0,1,.292-.767l6.926-7.792a1.14,1.14,0,0,1,.863-.387m0-1.154a2.3,2.3,0,0,0-1.726.775L4.583,11.577A2.309,2.309,0,0,0,4,13.111v6.048a3.463,3.463,0,0,0,3.463,3.463h3.463a1.154,1.154,0,0,0,1.154-1.154V18a1.154,1.154,0,0,1,2.309,0v3.463a1.154,1.154,0,0,0,1.154,1.154h3.463a3.463,3.463,0,0,0,3.463-3.463V13.111a2.309,2.309,0,0,0-.583-1.534L14.96,3.785a2.3,2.3,0,0,0-1.726-.775Z"
          transform="translate(-4 -3.01)"
          fill="#fff"
          stroke="#fff"
          stroke-width="0.5"
        />
      </G>
    </Svg>
  );
}

function Svg_Message(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 15.646 15.646"
    >
      <Path
        id="messenger_2_"
        data-name="messenger (2)"
        d="M7.823,0A7.824,7.824,0,0,0,1.037,11.717L.029,14.848a.611.611,0,0,0,.769.769l3.13-1.008A7.823,7.823,0,1,0,7.823,0Zm0,14.424a6.582,6.582,0,0,1-3.494-1,.612.612,0,0,0-.511-.064l-2.26.728.728-2.26a.612.612,0,0,0-.064-.511,6.6,6.6,0,1,1,5.6,3.107Zm.764-6.6a.764.764,0,1,1-.764-.764A.764.764,0,0,1,8.587,7.823Zm3.056,0a.764.764,0,1,1-.764-.764A.764.764,0,0,1,11.643,7.823Zm-6.112,0a.764.764,0,1,1-.764-.764A.764.764,0,0,1,5.531,7.823Zm0,0"
        fill={props.color}
      />
    </Svg>
  );
}

function Svg_Breakzen(props) {
  return (
    // <Svg
    //   xmlns="http://www.w3.org/2000/svg"
    //   width="21"
    //   height="20"
    //   viewBox="0 0 16.589 15.846"
    // >
    //   <G
    //     id="Group_38623"
    //     data-name="Group 38623"
    //     transform="translate(0.103 0.1)"
    //   >
    //     <G id="Group_38622" data-name="Group 38622">
    //       <G
    //         id="Group_38615"
    //         data-name="Group 38615"
    //         transform="translate(3.629)"
    //       >
    //         <Path
    //           id="Path_31246"
    //           data-name="Path 31246"
    //           d="M569.717,280.449a3.484,3.484,0,0,0,1.346-2.892,3.888,3.888,0,0,0-1.268-2.985,4.362,4.362,0,0,0-3.1-1.192h-6.932a.366.366,0,0,0-.366.366v3.295h.733v-2.929H566.7a3.6,3.6,0,0,1,2.6,1,3.177,3.177,0,0,1,1.036,2.447,2.678,2.678,0,0,1-1.675,2.655.366.366,0,0,0,.063.7,3.156,3.156,0,0,1,2.7,3.341,3.843,3.843,0,0,1-1.194,2.9,4.049,4.049,0,0,1-2.975,1.138H560.13v-5.818H559.4v6.184a.366.366,0,0,0,.366.366h7.489a4.806,4.806,0,0,0,3.483-1.343,4.542,4.542,0,0,0,1.419-3.432A3.884,3.884,0,0,0,569.717,280.449Z"
    //           transform="translate(-559.397 -273.38)"
    //           fill={props.color}
    //         // stroke="#707070"
    //         // stroke-width="0.2"
    //         />
    //       </G>
    //       <Path
    //         id="Path_31247"
    //         data-name="Path 31247"
    //         d="M586.049,395.745a1.446,1.446,0,0,1-1.519,1.453h-4.616a1.1,1.1,0,0,1,2.14-.366h2.477a1.084,1.084,0,0,0,1.153-1.087,1.058,1.058,0,0,0-1.172-1.026h-5.459l.066-.366h5.393A1.415,1.415,0,0,1,586.049,395.745Z"
    //         transform="translate(-573.944 -385.257)"
    //         fill={props.color}
    //       // stroke="#707070"
    //       // stroke-width="0.2"
    //       />
    //       <G
    //         id="Group_38621"
    //         data-name="Group 38621"
    //         transform="translate(0 2.222)"
    //       >
    //         <G
    //           id="Group_38616"
    //           data-name="Group 38616"
    //           transform="translate(0 1.073)"
    //         >
    //           <Path
    //             id="Path_31248"
    //             data-name="Path 31248"
    //             d="M523.6,324.4a1.813,1.813,0,0,1-1.886,1.82H518.14v-.733h3.571a1.084,1.084,0,0,0,1.153-1.087,1.058,1.058,0,0,0-1.172-1.026h-8.81a1.756,1.756,0,0,1-1.756-1.756,1.766,1.766,0,0,1,1.756-1.756h8.273a.883.883,0,0,0,.9-.982.9.9,0,0,0-.9-.94h-8.617V317.2h8.617a1.7,1.7,0,0,1,0,3.388h-8.273a1.023,1.023,0,0,0,0,2.047h8.81A1.776,1.776,0,0,1,523.6,324.4Z"
    //             transform="translate(-511.125 -317.202)"
    //             fill={props.color}
    //           // stroke="#707070"
    //           // stroke-width="0.2"
    //           />
    //         </G>
    //         <G
    //           id="Group_38618"
    //           data-name="Group 38618"
    //           transform="translate(5.969 8.617)"
    //         >
    //           <G id="Group_38617" data-name="Group 38617">
    //             <Path
    //               id="Path_31249"
    //               data-name="Path 31249"
    //               d="M592.721,418.649a1.07,1.07,0,0,1-.063.366,1.1,1.1,0,1,1,0-.733A1.07,1.07,0,0,1,592.721,418.649Z"
    //               transform="translate(-590.518 -417.547)"
    //               fill={props.color}
    //             // stroke="#707070"
    //             // stroke-width="0.2"
    //             />
    //           </G>
    //         </G>
    //         <G
    //           id="Group_38620"
    //           data-name="Group 38620"
    //           transform="translate(0.028 0)"
    //         >
    //           <G
    //             id="Group_38619"
    //             data-name="Group 38619"
    //             transform="translate(0)"
    //           >
    //             <Circle
    //               id="Ellipse_1252"
    //               data-name="Ellipse 1252"
    //               cx="1.102"
    //               cy="1.102"
    //               r="1.102"
    //               transform="translate(0 0.843) rotate(-22.5)"
    //               fill={props.color}
    //             // stroke="#707070"
    //             // stroke-width="0.2"
    //             />
    //           </G>
    //         </G>
    //       </G>
    //     </G>
    //   </G>
    // </Svg>

    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="21.000000pt"
      height="20.000000pt"
      viewBox="0 0 21.000000 20.000000"
      preserveAspectRatio="xMidYMid meet"
    >
      <G
        transform="translate(0.000000,20.000000) scale(0.003093,-0.003130)"
        fill={props.color}
        stroke="none"
      >
        <Path d="M640 6229 c0 -57 4 -88 10 -84 6 3 10 4 10 2 0 -22 26 -140 47 -207 27 -90 100 -245 156 -332 164 -252 441 -443 772 -531 78 -20 102 -21 1040 -27 1072 -7 997 -2 1161 -80 64 -31 95 -54 155 -117 191 -200 229 -446 108 -692 -79 -160 -213 -264 -398 -312 -71 -18 -128 -19 -1281 -19 -1169 0 -1209 -1 -1284 -20 -133 -34 -269 -122 -349 -225 -46 -60 -103 -176 -113 -228 -3 -21 -13 -41 -20 -44 -11 -4 -14 -32 -14 -120 0 -67 4 -112 9 -108 5 3 17 -21 26 -52 34 -117 108 -233 199 -311 65 -56 192 -123 267 -141 31 -7 548 -11 1655 -12 1253 -2 1626 -5 1687 -15 123 -20 247 -85 329 -173 235 -248 230 -619 -12 -861 -67 -67 -122 -100 -226 -137 l-79 -28 -1375 -6 c-1513 -6 -1410 -1 -1611 -69 -92 -30 -211 -89 -317 -157 -70 -44 -218 -188 -288 -278 -99 -130 -193 -337 -224 -495 -6 -30 -13 -65 -16 -78 -2 -13 -9 -20 -14 -17 -6 4 -10 -30 -10 -89 l0 -96 1968 0 c1195 0 1961 4 1953 9 -17 11 -6 15 109 31 154 22 367 89 527 166 252 120 532 357 699 590 160 223 269 478 325 757 26 131 29 169 29 328 0 249 -35 441 -121 665 -59 155 -168 349 -266 477 -131 170 -374 383 -558 489 -38 23 -71 42 -72 43 -2 1 20 56 47 122 27 66 61 163 75 214 52 191 68 489 41 725 -76 640 -543 1242 -1152 1484 -117 47 -289 96 -399 115 -55 9 -101 21 -103 26 -2 5 -620 9 -1553 9 l-1549 0 0 -91z" />
      </G>
    </Svg>
  );
}

const styles = StyleSheet.create({
  barContainer: {
    height: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
    maxWidth: 420,
  },
  container: {
    paddingHorizontal: 24,
    width: "100%",
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  homeConatainer: {
    marginHorizontal: 36,
    width: homeSize,
    height: homeSize,
    borderRadius: homeSize,
    backgroundColor: color.blue,
    overflow: "hidden",
  },
  homeWrapper: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  doubleWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  menuWrapper: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    overflow: "hidden",
  },
  svgWrapper: {
    padding: 16,
  },
  alert: {
    position: "absolute",
    right: 0,
    top: 2,
    width: 18,
    height: 18,
    borderRadius: 12,
    backgroundColor: "#FF0000DD",
    alignItems: "center",
    justifyContent: "center",
  },
  alertText: {
    paddingBottom: 1,
    fontSize: 10,
    color: "white",
  },
});

