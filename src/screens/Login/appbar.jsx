import * as React from 'react';
import { Text } from 'react-native';
import { color } from '../../assets/stdafx';

export function AppBar(props) {
  return (
    <>
      <Text style={styles.title}>{props.title}</Text>
      <Text style={styles.comment}>{props.comment}</Text>
    </>
  );
}

const styles = {
  title: {
    color: 'black',
    fontSize: 20,
    marginBottom: 12,
    fontFamily: 'Poppins_600SemiBold'
  },
  comment: {
    color: color.gray,
    fontSize: 13,
    lineHeight: 22,
    marginBottom: 48,
    fontFamily: 'Poppins_400Regular'
  },
};
