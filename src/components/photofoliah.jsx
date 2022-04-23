import * as React from 'react';
import {
  TouchableOpacity, View, Image, Text,
} from 'react-native';
import { Svg, G, Path } from 'react-native-svg';
import { color } from '../assets/stdafx';
import { navName } from '../navigation/Paths';

export function PhotofoliaH(props) {
  const { navigation, user, onClick, me } = props;
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(navName.Profile, { userId: user.uid });
      }}
      background={(color.blue)}
    >
      <View style={styles.container}>
        <View style={styles.photoContainer}>
          <Image style={styles.photo} source={{ uri: user.photo }} />
          <View
            style={[
              styles.active,
              user.connected 
                ? { backgroundColor: 'green' }
                : { backgroundColor: 'gray' },
            ]}
          />
        </View>
        <View style={styles.detailContainer}>
          <View style={styles.spaceBetween}>
            <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{user.name}</Text>
            <TouchableOpacity onPress={onClick} background={color.blue}>
              <View style={styles.menuWrapper}>
                {(me.favorite && me.favorite.includes(user.uid)) ? (
                  <Svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14.871"
                  height="14.159"
                  viewBox="0 0 14.871 14.159"
                >
                  <Path
                    id="Path_9376"
                    data-name="Path 9376"
                    d="M13.536,7.746l-3.9-.368a.674.674,0,0,1-.558-.413l-1.4-3.383a.668.668,0,0,0-1.24,0L5.06,6.964a.66.66,0,0,1-.558.413L.6,7.746a.674.674,0,0,0-.38,1.172L3.162,11.5a.668.668,0,0,1,.212.659l-.882,3.618a.674.674,0,0,0,.994.737L6.735,14.6a.676.676,0,0,1,.681,0l3.25,1.91a.671.671,0,0,0,.994-.737l-.871-3.618A.668.668,0,0,1,11,11.5l2.937-2.579A.682.682,0,0,0,13.536,7.746Z"
                    transform="translate(0.359 -2.812)"
                    fill="#ffc107"
                    stroke="#ffc107"
                    stroke-width="0.7"
                  />
                </Svg>
               ) : (
                  <Svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14.871"
                  height="14.159"
                  viewBox="0 0 14.871 14.159"
                >
                  <Path
                    id="Path_9376"
                    data-name="Path 9376"
                    d="M13.536,7.746l-3.9-.368a.674.674,0,0,1-.558-.413l-1.4-3.383a.668.668,0,0,0-1.24,0L5.06,6.964a.66.66,0,0,1-.558.413L.6,7.746a.674.674,0,0,0-.38,1.172L3.162,11.5a.668.668,0,0,1,.212.659l-.882,3.618a.674.674,0,0,0,.994.737L6.735,14.6a.676.676,0,0,1,.681,0l3.25,1.91a.671.671,0,0,0,.994-.737l-.871-3.618A.668.668,0,0,1,11,11.5l2.937-2.579A.682.682,0,0,0,13.536,7.746Z"
                    transform="translate(0.359 -2.812)"
                    fill="none"
                    stroke="#AAA"
                    stroke-width="0.7"
                  />
                </Svg>
                )}
                                
              </View>
            </TouchableOpacity>
            
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
              <Text style={styles.starpoint}>{user.star.toFixed(1)}</Text>
            </View>
            <Text style={{ paddingLeft: 24, color: 'gray', fontSize: 8 }}>
              {user.reviews.length}
              {' '}
              Reviews
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width="8.598"
              height="11.397"
              viewBox="0 0 8.598 11.397"
            >
              <G id="black-placeholder-variant" transform="translate(0)">
                <Path
                  id="Path_31252"
                  data-name="Path 31252"
                  d="M8.965,0a4.3,4.3,0,0,0-4.3,4.3c0,3.413,3.838,6.841,4,6.986a.45.45,0,0,0,.6-.009c.163-.152,3.992-3.77,3.992-6.977A4.3,4.3,0,0,0,8.965,0Zm0,6.349A2.049,2.049,0,1,1,11.014,4.3,2.05,2.05,0,0,1,8.965,6.349Z"
                  transform="translate(-4.666)"
                  fill="#7dbdef"
                />
              </G>
            </Svg>
            <Text style={{ paddingLeft: 8, fontSize: 10, fontWeight: 'bold' }}>
              {user.location}
            </Text>
          </View>
          <View style={styles.spaceBetween}>
            <Text style={{ fontSize: 10, color: color.blue, fontWeight: 'bold' }}>
              Check Availability
            </Text>
            <Text style={{ fontWeight: 'bold', fontSize: 12 }}>
              $
              {user.price}
              /Hr
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = {
  container: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    paddingRight: 8,
  },
  photoContainer: {
    width: undefined,
    height: '100%',
    aspectRatio: 1 / 1,
    padding: 8,
  },
  photo: {
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
  detailContainer: {
    flex: 1,
    paddingLeft: 16,
    justifyContent: 'space-evenly',
  },
  starpoint: {
    textAlign: 'center',
    color: 'black',
    fontSize: 8,
    paddingLeft: 4,
    fontWeight: '500',
  },
  spaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuWrapper: {
    padding: 8,
  },
};
