import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { BackButton } from '../../components/backbutton';

export function BackBar(props) {
  return (
    <View style={styles.container}>
      <BackButton navigation={props.navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 48, marginBottom: 36 },
});
