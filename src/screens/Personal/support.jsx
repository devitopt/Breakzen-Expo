import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Svg, G, Path } from 'react-native-svg';
import { BackBar } from '../Login/backbar';
import { AppBar } from '../Login/appbar';
import { color, inputType, size } from '../../assets/stdafx';
import { navName } from '../../navigation/Paths';
import qs from 'qs';

const buttonType = {
  privacy: 'privacy',
  terms: 'terms',
};

const onReport = () => {

  sendEmail(
    'support@breakzen.com',
    'Reporting an Error',
    "",
    // {cc: 'user@domain.com; user2@domain.com; userx@domain1.com'},
  ).then(() => {      
  });
}

const sendEmail = async (to, subject, body, options = {}) => {
  const { cc, bcc } = options;
  let url = `mailto:${to}`;

  const query = qs.stringify({
    subject,
    body,
    cc,
    bcc,
  });

  if (query.length) {
    url += `?${query}`;
  }
  const canOpen = await Linking.canOpenURL(url);
  if (!canOpen) {
    throw new Error('Provided URL can not be handled');
  }
  return Linking.openURL(url);
};

export default function Support({ navigation }) {
  return (
    <View style={styles.container}>
      <BackBar navigation={navigation} />
      <View
        style={styles.scrollArea}
        showsVerticalScrollIndicator={false}
      >
        <AppBar
          title="Support"
          comment="Contact our support via email or report any issue or error"
        />
        <Text style={[styles.link, { color: color.blue }]}>
          Support@breakzen.com
        </Text>
        <Text style={[styles.link, { color: '#EF7D7D' }]} onPress={onReport}>Report an Error</Text>
      </View>
      <View style={styles.bottomBar}>
        <BottomButton
          src={buttonType.privacy}
          title="Privacy Policy"
          onPress={() => navigation.navigate(navName.PrivacyPolicy)}
        />
        <BottomButton
          src={buttonType.terms}
          title="Terms of Use"
          onPress={() => navigation.navigate(navName.TermsAndConditions)}
        />
      </View>
    </View>
  );
}

function BottomButton(props) {
  const { onPress } = props;
  return (
    <TouchableOpacity
      background={(color.blue)}
      onPress={onPress}
    >
      <View style={styles.button}>
        <View style={styles.svgBox}>
          {props.src === buttonType.privacy ? (
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width="16.152"
              height="18.458"
              viewBox="0 0 16.152 18.458"
            >
              <G id="shield-with-lock" transform="translate(-31.992 0)">
                <Path
                  id="Path_34188"
                  data-name="Path 34188"
                  d="M225.158,160A1.155,1.155,0,0,0,224,161.15V162.3h2.307V161.15A1.155,1.155,0,0,0,225.158,160Z"
                  transform="translate(-185.09 -154.227)"
                  fill="#7dbdef"
                />
                <Path
                  id="Path_34189"
                  data-name="Path 34189"
                  d="M47.488.114a1.154,1.154,0,0,0-1.222.141,4.748,4.748,0,0,1-5.475,0,1.154,1.154,0,0,0-1.447,0,4.748,4.748,0,0,1-5.475,0,1.153,1.153,0,0,0-1.877.9v9.229c0,3.616,2.9,6.617,7.754,8.03a1.16,1.16,0,0,0,.644,0C45.245,17,48.144,14,48.144,10.383V1.154A1.153,1.153,0,0,0,47.488.114ZM43.529,11.537a1.153,1.153,0,0,1-1.154,1.154H37.761a1.153,1.153,0,0,1-1.154-1.154V9.23a1.154,1.154,0,0,1,1.154-1.154V6.922a2.307,2.307,0,1,1,4.615,0V8.076A1.154,1.154,0,0,1,43.529,9.23Z"
                  transform="translate(0 0)"
                  fill="#7dbdef"
                />
                <Path
                  id="Path_34190"
                  data-name="Path 34190"
                  d="M240.581,272a.577.577,0,1,0,.577.577A.577.577,0,0,0,240.581,272Z"
                  transform="translate(-200.513 -262.19)"
                  fill="#7dbdef"
                />
              </G>
            </Svg>
          ) : (
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width="14.473"
              height="19"
              viewBox="0 0 14.473 19"
            >
              <G
                id="document_6_"
                data-name="document (6)"
                transform="translate(-61)"
              >
                <Path
                  id="Path_34191"
                  data-name="Path 34191"
                  d="M70.982,5.566a1.3,1.3,0,0,1-1.3-1.3V0H63.041A2.043,2.043,0,0,0,61,2.041V16.959A2.043,2.043,0,0,0,63.041,19H73.432a2.043,2.043,0,0,0,2.041-2.041V5.566Zm-6.939,7.793h2.7a.557.557,0,0,1,0,1.113h-2.7a.557.557,0,0,1,0-1.113Zm-.557-2.412a.557.557,0,0,1,.557-.557h8.164a.557.557,0,0,1,0,1.113H64.043A.557.557,0,0,1,63.486,10.947Zm8.721-3.525a.557.557,0,0,1,0,1.113H64.043a.557.557,0,0,1,0-1.113Z"
                  fill="#7dbdef"
                />
                <Path
                  id="Path_34192"
                  data-name="Path 34192"
                  d="M325,10.258a.186.186,0,0,0,.186.186h4.242a2.036,2.036,0,0,0-.39-.51l-3.578-3.385A2.048,2.048,0,0,0,325,6.221v4.037Z"
                  transform="translate(-254.203 -5.99)"
                  fill="#7dbdef"
                />
              </G>
            </Svg>
          )}
        </View>
        <Text style={styles.buttonText}>{props.title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    paddingHorizontal: 34,
    paddingBottom: size.screenpb,
  },
  scrollArea: {
    flex: 1,
  },
  link: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 32,
  },
  bottomBar: {
    paddingLeft: 24,
    paddingBottom: 18,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  svgBox: {
    width: 72,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: '500',
  },
});
