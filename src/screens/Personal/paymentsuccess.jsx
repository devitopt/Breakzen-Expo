import * as React from 'react';
import {
  Text, View, Image, SafeAreaView,
} from 'react-native';
import { navName } from '../../navigation/Paths';
import { FullButton } from '../../components/fullbutton';
import { size } from '../../assets/stdafx';
import SuccessAsset from '../../assets/svg/success.png'

export default function PaymentSuccess({ navigation }) {
  return (
    <SafeAreaView
      style={{ paddingHorizontal: 36, height: '100%', backgroundColor: 'white' }}
    >
      <View
        style={{ alignItems: 'center', justifyContent: 'space-evenly', flex: 1 }}
      >
        <Image source={SuccessAsset} />
        <View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              textAlign: 'center',
              paddingBottom: 16,
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
            Payment processed successfully and your subscription is active now
          </Text>
        </View>
      </View>
      <View style={{ marginBottom: size.screenpb }}>
        <FullButton
          onPress={() => navigation.navigate(navName.PersonalProfile)}
          title="Back to Profile"
        />
      </View>
    </SafeAreaView>
  );
}
