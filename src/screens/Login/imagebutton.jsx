import React from 'react';
import {
  Text, View, TouchableOpacity,
} from 'react-native';

export function ImageButton(props) {

  return (
    <TouchableOpacity
      onPress={() => props.href ? props.navigation.navigate(props.href) : props.click()}
    >
      <View style={styles.button}>
        {props.image && <View style={styles.buttonImage}>{props.image()}</View>}
        <Text style={styles.buttonText}>{props.title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = {
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginVertical: 8,
    backgroundColor: '#F7F7F766',
    borderRadius: 8,
    flexDirection: 'row',
  },
  buttonImage: {
    marginRight: 20,
    width: 18,
  },
  buttonText: {
    color: 'black',
    fontSize: 12,
    fontFamily: 'Poppins_400Regular'
  },
};
