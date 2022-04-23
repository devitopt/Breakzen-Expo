import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { navName } from './Paths';
const Stack = createStackNavigator();
import SelectMembership from '../screens/Login/selectmembership'
import MembershipIntro from '../screens/Login/membershipintro'
import MainNavigator from './MainNavigator';

export default function MembershipNavigator({ navigation }) {
    
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>

            <Stack.Screen name={navName.MembershipIntro} component={MembershipIntro} />            
            <Stack.Screen name={navName.SelectMembership} component={SelectMembership} />
            <Stack.Screen name={navName.MainNavigator} component={MainNavigator} />

            
        </Stack.Navigator>
    );
}