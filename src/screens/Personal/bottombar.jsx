import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import {
  Svg, G, Path, Circle, Rect,
} from 'react-native-svg';
import { color } from '../../assets/stdafx';

export function BottomBar(props) {
  const [msg, setMsg] = useState('');
  return (
    <View>
      <View style={bstyle.attach}>
        {
          props.attach.name != '' &&
          <View style={bstyle.attachTextWrapper}>
            <Text style={bstyle.attachText} numberOfLines={1}>
              {props.attach.name}
            </Text>
          </View>
        }
        {
          props.attach.name != '' &&
          <TouchableOpacity
            onPress={props.onCancelAttach}>
            <Text style={bstyle.cancelText}>Cancel</Text>
          </TouchableOpacity>
        }
        {
          props.attach.name == '' &&
          <View style={{ height: 4 }} />
        }
      </View>
      <View style={bstyle.container}>
        <View style={bstyle.inputWrapper}>
          <TextInput
            style={bstyle.input}
            placeholder="Add a comment"
            value={msg}
            onChangeText={setMsg}
          />
          <View style={bstyle.send}>
            <TouchableOpacity
              onPress={() => {
                props.onPress(msg);
                setMsg('');
              }}
            >
              <View style={bstyle.svgWrapper}>
                <Svg_Send />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          onPress={props.onAttach}>
          <View style={{ padding: 8 }}>
            <Svg_Attach />
          </View>
        </TouchableOpacity>
        {/* <View style={{ padding: 8 }}>
        <Svg_Audio />
      </View> */}
      </View>
    </View>
  );
}

function Svg_Send() {
  return (
    <Svg
      id="right-arrow_18_"
      data-name="right-arrow (18)"
      xmlns="http://www.w3.org/2000/svg"
      width="15.776"
      height="17"
      viewBox="0 0 15.776 17"
    >
      <G id="Group_36404" data-name="Group 36404">
        <Path
          id="Path_24849"
          data-name="Path 24849"
          d="M15.45,23.926.8,16.079a.517.517,0,0,0-.674.183.734.734,0,0,0-.014.8L4.931,24.52.113,31.974a.736.736,0,0,0,.012.8.536.536,0,0,0,.438.243A.5.5,0,0,0,.8,32.96l14.649-7.847a.7.7,0,0,0,0-1.187Z"
          transform="translate(0 -16.02)"
          fill="#7dbdef"
        />
      </G>
    </Svg>
  )
}

function Svg_Attach() {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="20.416"
      height="19.586"
      viewBox="0 0 20.416 19.586"
    >
      <Path
        id="attachment-clip"
        d="M4.985,0A4.991,4.991,0,0,0,0,4.985v9.438a.609.609,0,1,0,1.219,0V4.985a3.766,3.766,0,0,1,7.533,0v9.73a2.453,2.453,0,0,1-2.45,2.45c-.01,0-.019.005-.029.006s-.019-.006-.03-.006a2.453,2.453,0,0,1-2.45-2.45V8.879a1.193,1.193,0,1,1,2.387,0v5.544a.609.609,0,1,0,1.219,0V8.879a2.412,2.412,0,1,0-4.824,0v5.837a3.673,3.673,0,0,0,3.669,3.669c.011,0,.019-.005.03-.006s.019.006.029.006A3.674,3.674,0,0,0,9.97,14.716V4.985A4.991,4.991,0,0,0,4.985,0Z"
        transform="translate(13.875) rotate(49)"
        fill="#000"
      />
    </Svg>
  )
}

function Svg_Audio() {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="12.14"
      height="17.692"
      viewBox="0 0 12.14 17.692"
    >
      <G
        id="microphone_2_"
        data-name="microphone (2)"
        transform="translate(0)"
      >
        <G
          id="Group_38338"
          data-name="Group 38338"
          transform="translate(0 7.773)"
        >
          <G id="Group_38337" data-name="Group 38337">
            <Path
              id="Path_32458"
              data-name="Path 32458"
              d="M92.474,225.452a.518.518,0,0,0-1.037,0,5.033,5.033,0,1,1-10.067,0,.518.518,0,0,0-1.037,0,6.078,6.078,0,0,0,5.552,6.048v2.317H84.739a.518.518,0,1,0,0,1.037H88.07a.518.518,0,1,0,0-1.037H86.922V231.5A6.078,6.078,0,0,0,92.474,225.452Z"
              transform="translate(-80.334 -224.934)"
              fill="#000"
            />
          </G>
        </G>
        <G
          id="Group_38340"
          data-name="Group 38340"
          transform="translate(3.331)"
        >
          <G id="Group_38339" data-name="Group 38339">
            <Path
              id="Path_32459"
              data-name="Path 32459"
              d="M179.473,0a2.742,2.742,0,0,0-2.739,2.739V8.291a2.739,2.739,0,0,0,5.478,0V2.739A2.742,2.742,0,0,0,179.473,0Zm1.7,8.291a1.7,1.7,0,0,1-3.4,0V2.739a1.7,1.7,0,0,1,3.4,0Z"
              transform="translate(-176.734)"
              fill="#000"
            />
          </G>
        </G>
      </G>
    </Svg>
  )
}

const bstyle = StyleSheet.create({
  attach: {
    marginTop: 6,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  attachTextWrapper: {
    flex: 1,
  },
  attachText: {
    color: 'blue',
  },
  cancelText: {
    fontWeight: 'bold'
  },
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    // marginVertical: 16,
    marginBottom: 16,
    marginTop: 6,
  },
  inputWrapper: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 12,
  },
  input: {
    borderColor: color.gray,
    borderWidth: 1,
    height: 40,
    borderRadius: 40,
    fontSize: 12,
    color: 'gray',
    paddingLeft: 20,
    paddingRight: 42,
  },
  send: {
    position: 'absolute',
    right: 8,
    borderRadius: 96,
    overflow: 'hidden',
  },
  svgWrapper: {
    width: '100%',
    height: '100%',
    padding: 8,
  },
});
