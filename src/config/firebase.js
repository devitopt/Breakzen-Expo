import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";
import Constants from "expo-constants";

// add firebase config
const firebaseConfig = {
  apiKey: Constants.manifest.extra.apiKey,
  authDomain: Constants.manifest.extra.authDomain,
  projectId: Constants.manifest.extra.projectId,
  storageBucket: Constants.manifest.extra.storageBucket,
  messagingSenderId: Constants.manifest.extra.messagingSenderId,
  appId: Constants.manifest.extra.appId,
};

// initialize firebase
const firebase = initializeApp(firebaseConfig);

// initialize auth
const auth = getAuth();

//initialize firestore
const firestore = getFirestore();

//initialize storage
const storage = getStorage();

//initialize functions
const functions = getFunctions(firebase);

export { auth, firestore, functions, storage };
