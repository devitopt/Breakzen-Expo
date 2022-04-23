import * as React from 'react';
import {
  Text, View, Image, SafeAreaView,
} from 'react-native';
import { navName } from '../../navigation/Paths';
import { FullButton } from '../../components/fullbutton';
import { size } from '../../assets/stdafx';
import PSuccess from '../../assets/svg/p_success.png';

export default function Success({ navigation }) {
  return (
    <SafeAreaView
      style={{ paddingHorizontal: 36, height: '100%', backgroundColor: 'white' }}
    >
      <View style={{ alignItems: 'center', justifyContent: 'space-evenly', flex: 1 }}>
        <Image source={PSuccess} />
        <View>
          <Text style={{
            fontSize: 20, fontWeight: 'bold', textAlign: 'center', paddingBottom: 16,
          }}
          >
            Success!
          </Text>
          <Text
            style={{
              fontSize: 14,
              lineHeight: 22,
              paddingHorizontal: 24,
              color: 'gray',
              textAlign: 'center',
            }}
          >
            Your request was sent successfully and will be under review
          </Text>
        </View>
      </View>
      <View style={{ marginBottom: size.screenpb, paddingHorizontal: 24 }}>
        <FullButton
          onPress={() => navigation.navigate(navName.HomeScreen)}
          title="Back to List"
        />
      </View>
    </SafeAreaView>
  );
}
