import * as React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { color } from '../assets/stdafx';

export function ModalButton(props) {
  return (
    <View style={fstyle.tconatiner}>
      <TouchableOpacity onPress={props.onPress}>
        <View
          style={[
            fstyle.container,
            props.ok ? { backgroundColor: color.blue }
              : { backgroundColor: color.gray },
          ]}
        >
          <Text style={fstyle.buttonText}>{props.title}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const button_height = 42;

const fstyle = {
  tconatiner: {
    width: '100%',
    height: button_height,
    borderRadius: 12,
    overflow: 'hidden',
  },
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 14,
    color: 'white',
  },
};
