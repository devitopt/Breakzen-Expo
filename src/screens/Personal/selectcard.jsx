import React from 'react';
import {
  Text,
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {
  Svg, G, Path, Rect, Circle,
} from 'react-native-svg';
import { BackButton } from '../../components/backbutton';
import { color, size } from '../../assets/stdafx';
import { navName } from '../../navigation/Paths';
import { CardItem } from '../../components/carditem';

export default function SelectCard({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.topMenu}>
        <View style={styles.button}>
          <BackButton navigation={navigation} />
        </View>
        <Text style={styles.caption}>Payment</Text>
      </View>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Total</Text>
        <Text style={styles.comment}>$36.00</Text>
        <View style={[styles.spaceBetween, { marginBottom: 24 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width="21.791"
              height="26.937"
              viewBox="0 0 21.791 26.937"
            >
              <G
                id="Group_38143"
                data-name="Group 38143"
                transform="translate(0 0)"
              >
                <G
                  id="Group_16920"
                  data-name="Group 16920"
                  transform="translate(0.209 0)"
                >
                  <Rect
                    id="Rectangle_16873"
                    data-name="Rectangle 16873"
                    width="5.834"
                    height="10.483"
                    transform="translate(7.874 1.425)"
                    fill="#ff5f00"
                  />
                  <Path
                    id="Path_19471"
                    data-name="Path 19471"
                    d="M8.245,64.068a6.688,6.688,0,0,1,2.538-5.244,6.668,6.668,0,1,0,0,10.487A6.663,6.663,0,0,1,8.245,64.068Z"
                    transform="translate(0 -57.4)"
                    fill="#eb001b"
                  />
                  <Path
                    id="Path_19472"
                    data-name="Path 19472"
                    d="M266.983,64.068A6.664,6.664,0,0,1,256.2,69.312a6.687,6.687,0,0,0,0-10.487,6.664,6.664,0,0,1,10.783,5.244Z"
                    transform="translate(-245.401 -57.4)"
                    fill="#f79e1b"
                  />
                </G>
                <G id="visa" transform="translate(0 20.117)">
                  <G
                    id="Group_17438"
                    data-name="Group 17438"
                    transform="translate(2.036 0)"
                  >
                    <G id="Group_17437" data-name="Group 17437">
                      <Path
                        id="Path_19515"
                        data-name="Path 19515"
                        d="M34.133,100.23l-1.094,6.806h1.748l1.093-6.806ZM39.406,103c-.611-.3-.985-.505-.985-.814.007-.281.317-.568,1.007-.568a3.042,3.042,0,0,1,1.3.252l.159.071.238-1.424a4.412,4.412,0,0,0-1.569-.281c-1.726,0-2.942.9-2.949,2.181-.014.947.87,1.473,1.532,1.788s.906.533.906.821c-.007.441-.547.645-1.05.645a3.555,3.555,0,0,1-1.64-.351l-.23-.1-.244,1.48a5.459,5.459,0,0,0,1.95.351c1.835,0,3.028-.884,3.043-2.252C40.88,104.047,40.414,103.472,39.406,103Zm6.2-2.751H44.255a.866.866,0,0,0-.914.548l-2.6,6.237h1.835l.505-1.35h2.052l.262,1.356h1.618Zm-2.014,4.071c.035,0,.7-2.2.7-2.2l.533,2.2ZM31.579,100.23l-1.713,4.624-.187-.912a5.081,5.081,0,0,0-2.417-2.763l1.568,5.85h1.85l2.748-6.8h-1.85Z"
                        transform="translate(-27.262 -100.23)"
                        fill="#2394bc"
                      />
                    </G>
                  </G>
                  <Path
                    id="Path_19516"
                    data-name="Path 19516"
                    d="M3.877,101.124a1.142,1.142,0,0,0-1.137-.876H.028L0,100.374a6.658,6.658,0,0,1,4.468,3.636Z"
                    transform="translate(0 -100.247)"
                    fill="#efc75e"
                  />
                </G>
              </G>
            </Svg>
            <Text style={styles.payment}>Online Payment</Text>
          </View>
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
          >
            <G
              id="Group_38265"
              data-name="Group 38265"
              transform="translate(0)"
            >
              <Circle
                id="Ellipse_1256"
                data-name="Ellipse 1256"
                cx="10"
                cy="10"
                r="10"
                transform="translate(0)"
                fill="#7dbdef"
              />
              <G
                id="tick_7_"
                data-name="tick (7)"
                transform="translate(5.061 6.149)"
              >
                <G id="Group_37185" data-name="Group 37185">
                  <Path
                    id="Path_29193"
                    data-name="Path 29193"
                    d="M8.269,27.855l-5.326,6.2L.709,31.968,0,32.727l3.025,2.829,6.032-7.025Z"
                    transform="translate(0 -27.855)"
                    fill="#fff"
                  />
                </G>
              </G>
            </G>
          </Svg>
        </View>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: elementSpace,
            marginBottom: 12,
          }}
        >
          <Text style={{ fontSize: 12 }}>Add New Card</Text>
          <Svg
            style={{ position: 'absolute', left: elementSpace }}
            xmlns="http://www.w3.org/2000/svg"
            width="13.908"
            height="13.908"
            viewBox="0 0 13.908 13.908"
          >
            <Path
              id="add_3_"
              data-name="add (3)"
              d="M11.756,5.3H7.837a.231.231,0,0,1-.231-.231V1.153a1.153,1.153,0,1,0-2.305,0V5.071a.231.231,0,0,1-.231.231H1.153a1.153,1.153,0,0,0,0,2.305H5.071a.231.231,0,0,1,.231.231v3.919a1.153,1.153,0,1,0,2.305,0V7.837a.231.231,0,0,1,.231-.231h3.919a1.153,1.153,0,0,0,0-2.305Zm0,0"
              transform="translate(0.5 0.5)"
              fill="#a5a5a5"
              stroke="#fff"
              stroke-width="1"
            />
          </Svg>
        </View>
        <View style={{ marginBottom: 12 }}>
          <CardItem />
        </View>
        <View style={{ marginBottom: 24 }}>
          <CardItem gray />
        </View>
        <View style={[styles.spaceBetween, { marginBottom: 24 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width="20.018"
              height="23.968"
              viewBox="0 0 20.018 23.968"
            >
              <G id="paypal" transform="translate(-42.193)">
                <Path
                  id="Path_34183"
                  data-name="Path 34183"
                  d="M60.3,6.192a8.235,8.235,0,0,0,.062-1.006A5.186,5.186,0,0,0,55.171,0H46.5a1.117,1.117,0,0,0-1.1.931L42.209,19.913a1.117,1.117,0,0,0,1.1,1.3h3.17a1.125,1.125,0,0,0,1.11-.931L47.6,20.2h0l-.442,2.626a.984.984,0,0,0,.971,1.147h2.773a.984.984,0,0,0,.97-.821l.788-4.682a1.676,1.676,0,0,1,1.653-1.4h.729A7.165,7.165,0,0,0,62.211,9.9,4.544,4.544,0,0,0,60.3,6.192Z"
                  transform="translate(0)"
                  fill="#002987"
                />
                <Path
                  id="Path_34184"
                  data-name="Path 34184"
                  d="M161.2,132.28a8.166,8.166,0,0,1-8.1,7.158H150.68a1.213,1.213,0,0,0-1.165.878l-1.446,8.592a.984.984,0,0,0,.97,1.147h2.773a.984.984,0,0,0,.97-.821l.788-4.682a1.676,1.676,0,0,1,1.653-1.4h.729a7.165,7.165,0,0,0,7.165-7.165h0A4.544,4.544,0,0,0,161.2,132.28Z"
                  transform="translate(-100.906 -126.088)"
                  fill="#0085cc"
                />
                <Path
                  id="Path_34185"
                  data-name="Path 34185"
                  d="M180.4,122.3h2.419a8.166,8.166,0,0,0,8.1-7.158,4.529,4.529,0,0,0-2.635-.842h-6.313a1.472,1.472,0,0,0-1.452,1.228l-1.287,7.65A1.213,1.213,0,0,1,180.4,122.3Z"
                  transform="translate(-130.624 -108.952)"
                  fill="#00186a"
                />
              </G>
            </Svg>
            <Text style={styles.payment}>Paypal</Text>
          </View>
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
          >
            <G
              id="Group_38265"
              data-name="Group 38265"
              transform="translate(0)"
            >
              <Circle
                id="Ellipse_1256"
                data-name="Ellipse 1256"
                cx="10"
                cy="10"
                r="10"
                transform="translate(0)"
                fill="#f1f1f1"
              />
              <G
                id="tick_7_"
                data-name="tick (7)"
                transform="translate(5.061 6.149)"
              >
                <G id="Group_37185" data-name="Group 37185">
                  <Path
                    id="Path_29193"
                    data-name="Path 29193"
                    d="M8.269,27.855l-5.326,6.2L.709,31.968,0,32.727l3.025,2.829,6.032-7.025Z"
                    transform="translate(0 -27.855)"
                    fill="#cfcfcf"
                  />
                </G>
              </G>
            </G>
          </Svg>
        </View>
      </ScrollView>
      <TouchableOpacity
        onPress={() => navigation.navigate(navName.PaymentSuccess)}
      >
        <View style={styles.bottomButton}>
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>
            Proceed & Pay
          </Text>
          <Text style={styles.subButton}>$ 36.00</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const elementSpace = 12;

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
  title: {
    fontSize: 17,
    color: 'gray',
    textAlign: 'center',
    paddingTop: 24,
    paddingBottom: 8,
  },
  comment: {
    fontSize: 30,
    color: color.blue,
    textAlign: 'center',
    paddingBottom: 24,
  },
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: elementSpace,
    borderRadius: 7,
  },
  payment: {
    paddingLeft: elementSpace * 2,
  },
  scanAgain: {
    fontWeight: 'bold',
    color: color.blue,
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 31 / 20,
    marginBottom: 36,
  },
  bottomButton: {
    width: '100%',
    height: 50,
    borderRadius: 7,
    backgroundColor: color.blue,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 24,
    paddingRight: 12,
    marginBottom: size.screenpb,
  },
  subButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: 'white',
    backgroundColor: '#FFFFFF40',
    borderRadius: 8,
    fontWeight: 'bold',
  },
});
