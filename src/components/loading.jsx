import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import animation from '../assets/svg/animation.gif'

export function Loading() {
  return (
    <View style={styles.loading}>
      <Image
        style={styles.logo}
        source={animation}
      />
    </View>
  );
}

export default Loading

const styles = StyleSheet.create({
  loading: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#FFFFFF96',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '70%',
    height: undefined,
    aspectRatio: 67 / 64,
    // opacity: 0.7,
  },
});
