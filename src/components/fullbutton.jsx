import * as React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import {
  Svg, G, Path, Ellipse,
} from 'react-native-svg';
import { color, buttonType } from '../assets/stdafx';

const search_back_color = '#FCFCFC48';
const button_height = 50;

function SvgBox(props) {
  return (
    <View style={props.style}>
      {props.src === buttonType.login ? (
        <Svg
          xmlns="http://www.w3.org/2000/svg"
          width="15.498"
          height="18.625"
          viewBox="0 0 15.498 18.625"
        >
          <G id="login" transform="translate(-35.057 0.25)">
            <Path
              id="Path_9369"
              data-name="Path 9369"
              d="M116.365,0H103.9a.566.566,0,0,0-.566.566v1.7h1.133V1.133H115.8v15.86H104.47V15.86h-1.133v1.7a.566.566,0,0,0,.566.566h12.461a.566.566,0,0,0,.566-.566V.566A.566.566,0,0,0,116.365,0Z"
              transform="translate(-66.625)"
              fill="#fff"
              stroke="#fff"
              stroke-width="0.5"
            />
            <Path
              id="Path_9370"
              data-name="Path 9370"
              d="M40.042,166.848l.8.8,3.8-3.8-3.8-3.8-.8.8,2.432,2.432H34.446v1.133h8.027Z"
              transform="translate(0.861 -154.787)"
              fill="#fff"
              stroke="#fff"
              stroke-width="0.5"
            />
          </G>
        </Svg>
      ) : props.src === buttonType.register ? (
        <Svg
          xmlns="http://www.w3.org/2000/svg"
          width="15.383"
          height="17.387"
          viewBox="0 0 15.383 17.387"
        >
          <Path
            id="add-user_5_"
            data-name="add-user (5)"
            d="M30.179,17.387a.679.679,0,0,1-.679-.679,6.187,6.187,0,0,1,6.18-6.18H36.7a6.168,6.168,0,0,1,2.035.343.679.679,0,0,1-.447,1.283,4.813,4.813,0,0,0-1.588-.267H35.68a4.828,4.828,0,0,0-4.822,4.822A.679.679,0,0,1,30.179,17.387Zm10.527-12.8a4.584,4.584,0,1,0-4.584,4.584A4.59,4.59,0,0,0,40.706,4.584Zm-1.358,0a3.226,3.226,0,1,1-3.226-3.226A3.23,3.23,0,0,1,39.348,4.584ZM44.2,13.312H42.166V11.274a.679.679,0,0,0-1.358,0v2.038H38.771a.679.679,0,1,0,0,1.358h2.038v2.038a.679.679,0,0,0,1.358,0V14.67H44.2a.679.679,0,1,0,0-1.358Z"
            transform="translate(-29.5)"
            fill="#fff"
          />
        </Svg>
      ) : props.src === buttonType.search ? (
        <Svg
          xmlns="http://www.w3.org/2000/svg"
          width="14.241"
          height="14.195"
          viewBox="0 0 14.241 14.195"
        >
          <G id="search" transform="translate(0.5 0.5)">
            <G id="Group_10726" data-name="Group 10726">
              <Path
                id="Path_24601"
                data-name="Path 24601"
                d="M13.114,12.725,9.1,8.711a5.243,5.243,0,1,0-.389.389l4.015,4.015a.275.275,0,1,0,.389-.389ZM5.223,9.9A4.673,4.673,0,1,1,9.9,5.223,4.678,4.678,0,0,1,5.223,9.9Z"
                transform="translate(0 0)"
                fill="#fff"
                stroke="#fff"
                stroke-width="1"
              />
            </G>
          </G>
        </Svg>
      ) : props.src === buttonType.scan ? (
        <Svg
          xmlns="http://www.w3.org/2000/svg"
          width="20.211"
          height="20.211"
          viewBox="0 0 20.211 20.211"
        >
          <G id="qr-code-scan" transform="translate(0)">
            <Path
              id="Path_29662"
              data-name="Path 29662"
              d="M373.421,0h-2.829a.592.592,0,1,0,0,1.184h2.829a1,1,0,0,1,1,1V5.013a.592.592,0,0,0,1.184,0V2.185A2.187,2.187,0,0,0,373.421,0Z"
              transform="translate(-355.394)"
              fill="#fff"
            />
            <Path
              id="Path_29663"
              data-name="Path 29663"
              d="M.592,5.606a.592.592,0,0,0,.592-.592V2.185a1,1,0,0,1,1-1H5.013A.592.592,0,0,0,5.013,0H2.185A2.187,2.187,0,0,0,0,2.185V5.013a.592.592,0,0,0,.592.592Z"
              transform="translate(0 0)"
              fill="#fff"
            />
            <Path
              id="Path_29664"
              data-name="Path 29664"
              d="M5.013,374.421H2.185a1,1,0,0,1-1-1v-2.829a.592.592,0,1,0-1.184,0v2.829a2.187,2.187,0,0,0,2.185,2.185H5.013a.592.592,0,0,0,0-1.184Z"
              transform="translate(0 -355.394)"
              fill="#fff"
            />
            <Path
              id="Path_29665"
              data-name="Path 29665"
              d="M375.013,370a.592.592,0,0,0-.592.592v2.829a1,1,0,0,1-1,1h-2.829a.592.592,0,0,0,0,1.184h2.829a2.187,2.187,0,0,0,2.185-2.185v-2.829A.592.592,0,0,0,375.013,370Z"
              transform="translate(-355.394 -355.394)"
              fill="#fff"
            />
            <Path
              id="Path_29666"
              data-name="Path 29666"
              d="M327.235,81.184h1.878a.466.466,0,0,1,.465.465v1.878a.592.592,0,1,0,1.184,0V81.649A1.651,1.651,0,0,0,329.113,80h-1.878a.592.592,0,0,0,0,1.184Z"
              transform="translate(-313.749 -76.842)"
              fill="#fff"
            />
            <Path
              id="Path_29667"
              data-name="Path 29667"
              d="M81,81.649v1.878a.592.592,0,0,0,1.184,0V81.649a.466.466,0,0,1,.465-.465h1.878a.592.592,0,1,0,0-1.184H82.649A1.651,1.651,0,0,0,81,81.649Z"
              transform="translate(-77.802 -76.842)"
              fill="#fff"
            />
            <Path
              id="Path_29668"
              data-name="Path 29668"
              d="M84.527,328.579H82.649a.466.466,0,0,1-.465-.465v-1.878a.592.592,0,0,0-1.184,0v1.878a1.651,1.651,0,0,0,1.649,1.649h1.878a.592.592,0,0,0,0-1.184Z"
              transform="translate(-77.802 -312.789)"
              fill="#fff"
            />
            <Path
              id="Path_29669"
              data-name="Path 29669"
              d="M330.763,328.114v-1.878a.592.592,0,1,0-1.184,0v1.878a.466.466,0,0,1-.465.465h-1.878a.592.592,0,0,0,0,1.184h1.878A1.651,1.651,0,0,0,330.763,328.114Z"
              transform="translate(-313.749 -312.789)"
              fill="#fff"
            />
            <Path
              id="Path_29670"
              data-name="Path 29670"
              d="M1,241.592a.592.592,0,0,0,.592.592H20.54a.592.592,0,0,0,0-1.184H1.592A.592.592,0,0,0,1,241.592Z"
              transform="translate(-0.961 -231.486)"
              fill="#fff"
            />
          </G>
        </Svg>
      ) : (
        /* tick */
        <Svg
          id="tick_13_"
          data-name="tick (13)"
          xmlns="http://www.w3.org/2000/svg"
          width="17.229"
          height="14.65"
          viewBox="0 0 17.229 14.65"
        >
          <G id="Group_38607" data-name="Group 38607">
            <Path
              id="Path_29671"
              data-name="Path 29671"
              d="M15.73,27.855,5.6,39.654,1.349,35.68,0,37.123,5.755,42.5,17.229,29.142Z"
              transform="translate(0 -27.855)"
              fill="#fff"
            />
          </G>
        </Svg>
      )}
    </View>
  );
}

export function FullButton(props) {
  return (
    <View style={fstyle.tconatiner}>
      <TouchableOpacity onPress={props.onPress}>
        <View
          style={[
            fstyle.container,
            props.search ? { backgroundColor: search_back_color } : {},
          ]}
        >
          {props.src && <SvgBox style={fstyle.buttonImage} src={props.src} />}
          <Text style={fstyle.buttonText}>{props.title}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const fstyle = {
  tconatiner: {
    width: '100%',
    height: button_height,
    borderRadius: 7,
    overflow: 'hidden',
  },
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: color.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 14,
    color: 'white',
  },
  buttonImage: {
    position: 'absolute',
    left: 20,
  },
};
