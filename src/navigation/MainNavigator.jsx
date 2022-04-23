import React, { useState } from "react";
import { useSelector } from "react-redux";
import { navName } from "./Paths";
import Professional from "../screens/Professional/professional";
import TrendingOnBreakzen from "../screens/Professional/trendingonbreakzen";
import Searching from "../screens/Professional/searching";
import SearchResult from "../screens/Professional/searchresult";
import Profile from "../screens/Professional/profile";
import ProfileClient from "../screens/Professional/profileclient";
import Success from "../screens/Professional/success";
import CheckAvailability from "../screens/Professional/checkavailability";
import PersonalProfile from "../screens/Personal/personalprofile";
import Groups from "../screens/Personal/groups";
import GroupMember from "../screens/Personal/groupmember";
import GroupRequest from "../screens/Personal/grouprequest";
import Chats from "../screens/Personal/chats";
import InsideChat from "../screens/Personal/insidechat";
import ActivatingAccount from "../screens/Personal/activatingaccount";
import ScanId from "../screens/Personal/scanid";
import ScanConfirmation from "../screens/Personal/scanconfirmation";
import SelectCard from "../screens/Personal/selectcard";
import PaymentSuccess from "../screens/Personal/paymentsuccess";
import EditProfileInfo from "../screens/Personal/editprofileinfo";
import EditProfileInfo2 from "../screens/Personal/editprofileinfo2";
import EmailRequestValidation from "../screens/Personal/emailrequestvalidation";
import BackCheck from "../screens/Personal/backcheck";
import CreateSocialGroup from "../screens/Personal/createsocialgroup";
import MyGallery from "../screens/Personal/mygallery";
import GroupPage from "../screens/Personal/grouppage";
import MyAccount from "../screens/Login/myaccount";
import Support from "../screens/Personal/support";
import MySubscription from "../screens/Personal/mysubscription";
import JobListings from "../screens/Personal/joblistings";
import CreateJobListing from "../screens/Personal/createjoblisting";
import JobPost from "../screens/Personal/jobpost";
import JobPostSuccess from "../screens/Personal/jobpostsuccess";
import Report from "../screens/Professional/report";
import TermsAndConditions from "../screens/Support/termsandconditions";
import PrivacyPolicy from "../screens/Support/privacypolicy";
import HomeScreen from "../screens/homescreen";
import HomeProfessional from "../screens/Professional/homeprofessional";
import GoogleMap from "../components/GoogleMap";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import BottomNavigator from "../components/BottomNavigator";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

export default function MainNavigator({ navigation, route }) {
  const isProfessional = useSelector((state) => state.user.professional);
  const [tabBarVisible, setTabBarVisibile] = useState(false);

  React.useLayoutEffect(() => {
    const tabHiddenRoutes = [
      navName.Professional,
      navName.GroupPage,
      navName.GroupMember,
      navName.Profile,
      navName.ProfileClient,
      navName.InsideChat,
      navName.JobPost,
      navName.JobPostSuccess,
      navName.CheckAvailability,
      navName.Success,
      navName.EditProfileInfo,
      navName.EditProfileInfo2,
      navName.MyGallery,
      navName.Searching,
      navName.SearchResult,
      navName.BackCheck,
      navName.ActivatingAccount,
      navName.MyAccount,
      navName.Report,
      navName.MapView,
    ];
    if (tabHiddenRoutes.includes(getFocusedRouteNameFromRoute(route))) {
      setTabBarVisibile(false);
    } else {
      setTabBarVisibile(true);
    }
  }, [navigation, route]);

  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      backBehavior="history"
      tabBar={(props) =>
        tabBarVisible ? <BottomNavigator {...props} /> : <></>
      }
    >
      {isProfessional == false && (
        <>
          <Tab.Screen name={navName.HomeScreen} component={HomeScreen} />
        </>
      )}
      {isProfessional == true && (
        <>
          <Tab.Screen
            name={navName.HomeProfessional}
            component={HomeProfessional}
          />
        </>
      )}
      <Tab.Screen name={navName.Professional} component={Professional} />
      <Tab.Screen
        name={navName.TrendingOnBreakzen}
        component={TrendingOnBreakzen}
      />
      <Tab.Screen name={navName.Searching} component={Searching} />
      <Tab.Screen name={navName.SearchResult} component={SearchResult} />
      <Tab.Screen name={navName.Profile} component={Profile} />
      <Tab.Screen name={navName.ProfileClient} component={ProfileClient} />
      <Tab.Screen
        name={navName.CheckAvailability}
        component={CheckAvailability}
      />
      <Tab.Screen name={navName.Success} component={Success} />
      <Tab.Screen name={navName.PersonalProfile} component={PersonalProfile} />
      <Tab.Screen name={navName.Groups} component={Groups} />
      <Tab.Screen name={navName.GroupMember} component={GroupMember} />
      <Tab.Screen name={navName.GroupRequest} component={GroupRequest} />
      <Tab.Screen name={navName.Chats} component={Chats} />
      <Tab.Screen name={navName.InsideChat} component={InsideChat} />
      <Tab.Screen
        name={navName.ActivatingAccount}
        component={ActivatingAccount}
      />
      <Tab.Screen name={navName.ScanId} component={ScanId} />
      <Tab.Screen
        name={navName.ScanConfirmation}
        component={ScanConfirmation}
      />
      <Tab.Screen name={navName.SelectCard} component={SelectCard} />
      <Tab.Screen name={navName.PaymentSuccess} component={PaymentSuccess} />
      <Tab.Screen name={navName.EditProfileInfo} component={EditProfileInfo} />
      <Tab.Screen
        name={navName.EditProfileInfo2}
        component={EditProfileInfo2}
      />
      <Tab.Screen
        name={navName.EmailRequestValidation}
        component={EmailRequestValidation}
      />
      <Tab.Screen name={navName.BackCheck} component={BackCheck} />
      <Tab.Screen
        name={navName.CreateSocialGroup}
        component={CreateSocialGroup}
      />
      <Tab.Screen name={navName.MyGallery} component={MyGallery} />
      <Tab.Screen name={navName.GroupPage} component={GroupPage} />
      <Tab.Screen name={navName.MyAccount} component={MyAccount} />
      <Tab.Screen name={navName.Support} component={Support} />
      <Tab.Screen name={navName.MySubscription} component={MySubscription} />
      <Tab.Screen name={navName.JobListings} component={JobListings} />
      <Tab.Screen
        name={navName.CreateJobListing}
        component={CreateJobListing}
      />
      <Tab.Screen name={navName.JobPost} component={JobPost} />
      <Tab.Screen name={navName.JobPostSuccess} component={JobPostSuccess} />
      <Tab.Screen name={navName.Report} component={Report} />
      <Tab.Screen
        name={navName.TermsAndConditions}
        component={TermsAndConditions}
      />
      <Tab.Screen name={navName.PrivacyPolicy} component={PrivacyPolicy} />
      <Tab.Screen name={navName.MapView} component={GoogleMap} />
    </Tab.Navigator>
  );
}
