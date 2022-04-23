import React from 'react';
import {
  Text, Image, View, StyleSheet,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { BackButton } from '../../components/backbutton';
import { buttonType, color, size } from '../../assets/stdafx';
import { FullButton } from '../../components/fullbutton';
import { navName } from '../../navigation/Paths';

export default function ScanConfirmation({ navigation }) {
  const user = useSelector((state) => state.user);
  return (
    <View style={styles.container}>
      <View style={styles.topMenu}>
        <View style={styles.button}>
          <BackButton navigation={navigation} />
        </View>
        <Text style={styles.caption}>Confirmation</Text>
      </View>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.comment}>
          Have a final check if all data is clearly visible and that it matches
          the information you have entered in previous steps.
        </Text>
        <Text style={styles.title}>National ID Verification</Text>
        <View style={styles.spaceBetween}>
          <Text>Font Side</Text>
          <Text style={styles.scanAgain}>Scan Again</Text>
        </View>
        <Image style={styles.image} source={{ uri: user.idfront }} />
        <View style={styles.spaceBetween}>
          <Text>Back Side</Text>
          <Text style={styles.scanAgain}>Scan Again</Text>
        </View>
        <Image style={styles.image} source={{ uri: user.idback }} />
        <Text style={styles.title}>Certificate Verification</Text>
        <View style={styles.spaceBetween}>
          <Text>Front Side</Text>
          <Text style={styles.scanAgain}>Scan Again</Text>
        </View>
        <Image style={styles.image} source={{ uri: user.cerfront }} />
        <View style={{ paddingBottom: size.screenpb }}>
          <FullButton
            onPress={() => navigation.navigate(navName.MyAccount)}
            src={buttonType.tick}
            title="Confrim & Proceed"
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    paddingHorizontal: 28,
  },
  topMenu: {
    marginTop: 48,
    marginBottom: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    position: 'absolute',
    left: 0,
  },
  caption: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  comment: {
    fontSize: 14,
    lineHeight: 22,
    color: 'gray',
    textAlign: 'center',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 36,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    paddingBottom: 24,
  },
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
  },
  scanAgain: {
    fontWeight: 'bold',
    color: color.blue,
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 3 / 2,
    marginBottom: 36,
    borderRadius: 24,
  },
});
