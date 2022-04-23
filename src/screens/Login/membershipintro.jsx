import React,  { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { navName } from '../../navigation/Paths';
import { AppBar } from './appbar';
import { color, memberType, size } from "../../assets/stdafx";
import { FullButton } from "../../components/fullbutton";

export default function MembershipIntro({ navigation }) {  
  
  const [membership, setMembership] = useState(memberType.general);
    return (
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <NoBackBar />
          <AppBar
            title="Membership Plan"
            comment="Select your membership plan to proceed"
          />
          <View style={styles.selectArea}>
            <Button
              onClick={() => setMembership(memberType.general)}
              selected={membership == memberType.general}
              title="General Plan"
            />
            <Button
              onClick={() => setMembership(memberType.pro)}
              selected={membership == memberType.pro}
              title="Pro Plan"
            />
          </View>
        </View>
        <FullButton
          onPress={() =>
            navigation.navigate(navName.SelectMembership, {membership: membership})
          }
          title="Proceed"
        />
      </View>
    );
  }
  
  function Button(props) {
    return (
      <View style={styles.tview}>
        <TouchableOpacity onPress={() => props.onClick()} background={color.blue}>
          <View
            style={[
              styles.button,
              props.selected ? { backgroundColor: color.blue } : {},
            ]}
          >            
            <Text
              style={[
                { fontSize: 13 },
                props.selected ? { color: "white" } : { color: "black" },
              ]}
            >
              {props.title}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }  

  function NoBackBar() {
    return (
      <View style={bstyles.container}>
      </View>
    );
  }
  
  const bstyles = StyleSheet.create({
    container: { marginTop: 48, height: 12, marginBottom: 36 },
  });
   
 
  const styles = StyleSheet.create({
    container: {
      width: "100%",
      height: "100%",
      backgroundColor: "white",
      paddingHorizontal: 34,
      paddingBottom: size.screenpb,
    },
    tview: {
      width: "46%",
      height: undefined,
      aspectRatio: 10 / 9,
      borderRadius: 12,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: "#707070",
    },
    button: {
      width: "100%",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
    },    
    selectArea: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
  });