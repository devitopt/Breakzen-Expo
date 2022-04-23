import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { navName } from './Paths';
const Stack = createStackNavigator();
import SplashScreen from '../screens/splashscreen';
import WelcomeScreen from '../screens/welcomescreen';
import SignIn from '../screens/Login/SignIn';
import SignUpIntro from '../screens/Login/SignUpIntro';
import SignInEmail from '../screens/Login/signinemail';
import ForgotPassword from '../screens/Login/forgotpassword'
import AccountTypeSelection from '../screens/Login/accounttypeselection';
import RegisterProfessional from '../screens/Login/registerprofessional';
import RegisterClient from '../screens/Login/registerclient';
import TermsAndConditions from '../screens/Support/termsandconditions';
import PrivacyPolicy from '../screens/Support/privacypolicy';

export default function SigninNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name={navName.SplashScreen} component={SplashScreen} />
            <Stack.Screen name={navName.WelcomeScreen} component={WelcomeScreen} />
            <Stack.Screen name={navName.SignInIntro} component={SignIn} />
            <Stack.Screen name={navName.SignUpIntro} component={SignUpIntro} />
            
            <Stack.Screen
                name={navName.AccountTypeSelection}
                component={AccountTypeSelection}
            />
            <Stack.Screen
                name={navName.RegisterProfessional}
                component={RegisterProfessional}
            />
            <Stack.Screen name={navName.RegisterClient} component={RegisterClient} />
            <Stack.Screen name={navName.SignInEmail} component={SignInEmail} />
            <Stack.Screen name={navName.ForgotPassword} component={ForgotPassword} />         
            <Stack.Screen
                name={navName.TermsAndConditions}
                component={TermsAndConditions}
            />
            <Stack.Screen name={navName.PrivacyPolicy} component={PrivacyPolicy} />
        </Stack.Navigator>
    );
}