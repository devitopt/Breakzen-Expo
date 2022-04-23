import * as React from 'react';
import {
  TouchableOpacity,
  View,
  Image,
  Text,
  StyleSheet,
} from 'react-native';
import { Svg, G, Path } from 'react-native-svg';
import { navName } from '../navigation/Paths';
import { color } from '../assets/stdafx';

export function PhotofoliaV(props) {
  const { navigation, user } = props;
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(navName.Profile, { userId: user.uid });
      }}
      background={(color.blue)}
    >
      <View style={styles.container}>
        <View style={styles.imageWrapper}>
          <Image style={styles.image} source={{ uri: user.photo }} />
        </View>
        <View
          style={[
            styles.active,
            user.connected
              ? { backgroundColor: 'green' }
              : { backgroundColor: 'gray' },
          ]}
        />
        <View style={styles.nameSect}>
          <Text style={styles.name} numberOfLines={1}>
            {user.name}
          </Text>
          <View style={styles.starSect}>
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width="7.819"
              height="7.493"
              viewBox="0 0 7.819 7.493"
            >
              <Path
                id="star_10_"
                data-name="star (10)"
                d="M7.8,3.323a.415.415,0,0,0-.358-.286l-2.257-.2L4.292.744a.416.416,0,0,0-.764,0L2.635,2.832l-2.257.2a.416.416,0,0,0-.236.727l1.706,1.5-.5,2.216a.415.415,0,0,0,.618.449L3.91,6.762,5.856,7.925a.416.416,0,0,0,.618-.449l-.5-2.216,1.706-1.5A.416.416,0,0,0,7.8,3.323Zm0,0"
                transform="translate(0 -0.491)"
                fill="#ffc107"
              />
            </Svg>
            <Text style={styles.starPoint}>{` ${user.star.toFixed(1)}`}</Text>
          </View>
        </View>
        <View style={styles.jobSect}>
          <View style={{ flex: 1 }}>
            <Text style={styles.job} numberOfLines={1}>
              {user.service}
            </Text>
          </View>
          <Text style={styles.price}>
            $
            {user.price}
            /Hr
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  imageWrapper: {
    width: '100%',
    height: undefined,
    aspectRatio: 10 / 10,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1 / 1,
    resizeMode: 'cover',
    borderRadius: 12,
  },
  active: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 16,
    borderColor: 'white',
    borderWidth: 3,
    right: 0,
  },
  nameSect: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  name: {
    flex: 1,
    color: '#153E73',
    fontWeight: 'bold',
    fontSize: 10,
  },
  starSect: { flexDirection: 'row', alignItems: 'center' },
  starPoint: { textAlign: 'center', color: 'black', fontSize: 8 },
  jobSect: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  job: { fontSize: 10, paddingRight: 1, flex: 1 },
  price: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: 10,
  },
});
