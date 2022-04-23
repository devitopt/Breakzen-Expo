import React, { useState, useEffect } from 'react';
import {
  Text, View, StyleSheet,
} from 'react-native';
import { Svg, G, Path } from 'react-native-svg';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useSelector, useDispatch } from 'react-redux';
import { getStorage } from 'firebase/storage';
import { firestore } from '../../config/firebase';
import { BackButton } from '../../components/backbutton';
import { buttonType, size, color } from '../../assets/stdafx';
import { FullButton } from '../../components/fullbutton';
import { navName } from '../../navigation/Paths';
import { addinfo } from '../../redux/actioncreators';
import { Loading } from '../../components/loading';

const storage = getStorage();


function CameraFrame() {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="300"
      height="200"
      viewBox="0 0 309 210.132"
    >
      <G id="frame" transform="translate(2 2)">
        <Path
          id="Line_2"
          data-name="Line 2"
          d="M0,24.251V12.965H0A12.965,12.965,0,0,1,12.965,0H24.251"
          transform="translate(0 0)"
          fill="none"
          stroke="#fff"
          stroke-linecap="square"
          stroke-miterlimit="10"
          stroke-width="4"
        />
        <Path
          id="Line_2-2"
          data-name="Line 2"
          d="M-1.749,24.251V12.965h0A12.965,12.965,0,0,0-14.714,0H-26"
          transform="translate(306.749)"
          fill="none"
          stroke="#fff"
          stroke-linecap="square"
          stroke-miterlimit="10"
          stroke-width="4"
        />
        <Path
          id="Line_2-3"
          data-name="Line 2"
          d="M0-26v11.286H0A12.965,12.965,0,0,0,12.965-1.749H24.251"
          transform="translate(0 207.881)"
          fill="none"
          stroke="#fff"
          stroke-linecap="square"
          stroke-miterlimit="10"
          stroke-width="4"
        />
        <Path
          id="Line_2-4"
          data-name="Line 2"
          d="M0,24.251V12.965H0A12.965,12.965,0,0,1,12.965,0H24.251"
          transform="translate(305 206.132) rotate(180)"
          fill="none"
          stroke="#fff"
          stroke-linecap="square"
          stroke-miterlimit="10"
          stroke-width="4"
        />
      </G>
    </Svg>
  );
}

const title = ['Scan Front Side', 'Scan Back Side', 'Scan Cetificate'];
const path = [];
let end = 0;

export default function ScanId({ navigation }) {
  const user = useSelector((state) => state.user);
  const dispath = useDispatch();
  const addInfo = (info) => dispath(addinfo(info));
  const [bLoading, setLoading] = useState(false);
  const [camera, setCamera] = useState(0);
  const [cur, setCur] = useState(0);

  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);


  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);


  const launchCamera = async () => {
    const options = {
      quality: 0.85,
      fixOrientation: true,
      forceUpOrientation: true,
    };
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log(result);

      if (!result.cancelled) {
        path.push(image.path);
        if (cur === 2) {
          saveImages();
        } else {
          setCur(cur + 1);
        }
      }

    } catch (err) {
      alert('Error', `Failed to take picture: ${err.message || err}`);
    } finally {
    }
  };
  const putFile = (path, key) => {
    const reference = storage().ref(`${user.email}/${new Date().getTime()}`);
    reference.putFile(path).then(() => {
      reference.getDownloadURL().then((imageUrl) => {
        const info = {};
        info[key] = imageUrl;
        firestore()
          .collection('users')
          .doc(user.uid)
          .update(info)
          .then(() => {
            addInfo(info);
            end++;
            if (end === 3) {
              // set inital value
              setLoading(false);
              path = [];
              end = 0;

              navigation.navigate(navName.ScanConfirmation);
            }
          });
      });
    });
  };
  const saveImages = () => {
    setLoading(true);
    putFile(path[0], 'idfront');
    putFile(path[1], 'idback');
    putFile(path[2], 'cerfront');
  };
  return (
    <View styles={styles.screen}>
      <Camera
        ref={(ref) => {
          // this.camera = ref;
          setCamera(ref);
        }}
        captureAudio={false}
        style={styles.screen}
        type={type}
      />
      <View style={styles.container}>
        <View style={styles.topMenu}>
          <View style={styles.button}>
            <BackButton navigation={navigation} white />
          </View>
          <Text style={styles.title}>{title[cur]}</Text>
        </View>
        <Text style={styles.comment}>
          Position your document inside the frame. Make sure that all the data
          is clearly visible.
        </Text>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <CameraFrame />
        </View>
        <View style={{ paddingBottom: size.screenpb }}>
          <FullButton
            onPress={launchCamera}
            src={buttonType.scan}
            title={title[cur]}
          />
        </View>
      </View>
      {bLoading && <Loading />}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    width: '100%',
    height: '100%',
  },
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
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
    borderRadius: 36,
    backgroundColor: '#FFFFFF48',
    left: 0,
  },
  title: { fontSize: 17, fontWeight: 'bold', color: 'white' },
  comment: {
    fontSize: 14,
    lineHeight: 22,
    color: color.gray,
    textAlign: 'center',
    paddingTop: 24,
  },
  image: {
    alignSelf: 'center',
    marginBottom: 18,
  },
});
