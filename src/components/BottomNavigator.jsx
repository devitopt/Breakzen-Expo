import React from "react";
import {
    View,
} from "react-native";
import BottomBarNavigator from "./BottomBarNavigator";

export default function BottomNavigator(props) {
    const { state, navigation } = props
    return (
        <View style={{ flexDirection: 'row' }}>
            <BottomBarNavigator navigation={navigation} navigationState={state} />
        </View>
    );
}

