import React from 'react';
import { View, Text, Image } from 'react-native';
import { Svg, Circle } from 'react-native-svg';
import { color } from '../../assets/stdafx';

export function ConfirmLabel(props) {
  return (
    <View style={styles.confirmLabel}>
      <View style={styles.labelImage}>
        {props.active ? (
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            width="6"
            height="6"
            viewBox="0 0 6 6"
          >
            <Circle
              id="Ellipse_1249"
              data-name="Ellipse 1249"
              cx="3"
              cy="3"
              r="3"
              fill="#7dbdef"
            />
          </Svg>
        ) : (
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            width="6"
            height="6"
            viewBox="0 0 6 6"
          >
            <Circle
              id="Ellipse_1251"
              data-name="Ellipse 1251"
              cx="3"
              cy="3"
              r="3"
              fill="#bcbcbc"
            />
          </Svg>
        )}
      </View>
      <Text
        style={[
          styles.labelText,
          props.active ? { color: color.blue } : { color: color.gray },
        ]}
      >
        {props.text}
      </Text>
    </View>
  );
}

const styles = {
  confirmLabel: {
    paddingLeft: 32,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  labelImage: {
    position: 'absolute',
    left: 0,
  },
  labelText: {
    fontSize: 12,
    fontWeight: '500',
  },
};
