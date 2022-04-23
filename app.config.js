import 'dotenv/config';

export default {
  expo: {
    name: 'Breakzen',
    slug: 'breakzen',
    privacy: 'public',
    owner: 'breakzen',
    platforms: ['ios', 'android'],
    version: '0.1.0',
    orientation: 'portrait',
    icon: './src/assets/flame.png',
    splash: {
      image: './src/assets/splash.png',
      resizeMode: 'cover',
      backgroundColor: '#F57C00'
    },
    plugins: [
      [       
        "expo-notifications",
        {
          "icon": "./assets/favicon.png",
          "color": "#ff0000",
          "sounds": [
            "./assets/dinheiro.wav"
          ],
          "mode": "production"
        },        
      ],
      [
        "expo-location", { "isAndroidBackgroundLocationEnabled": true }
      ]
    ],
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: ['**/*'],
    scheme:'com.googleusercontent.apps.865330437158-6utfjhqbc3pps1au9kahl5pgv9pntd7p',
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.breakzen.breakzen",
      infoPlist: {
        UIBackgroundModes: [
          "location", "fetch"
        ],
        LSApplicationQueriesSchemes: [        
          "fbapi",
          // "fbapi20130214",
          // "fbapi20130410",
          // "fbapi20130702",
          // "fbapi20131010",
          // "fbapi20131219",
          // "fbapi20140410",
          // "fbapi20140116",
          // "fbapi20150313",
          // "fbapi20150629",
          // "fbapi20160328",
          "fbauth",
          "fb-messenger-share-api",
          "fbauth2",
          "fbshareextension"
        ],
        CFBundleURLTypes: [
          {
            CFBundleURLSchemes : [
              "fb595598541722630"
            ]
          }
        ],
        NSLocationWhenInUseUsageDescription: "App will use your location to get nearby users",
        NSLocationAlwaysUsageDescription: "App will use your location to get nearby users"//,
        //FacebookAppID: "595598541722630",
        //FacebookClientToken: "9896f528420d3eb41b5d25992af006a9",
        //FacebookDisplayName: "Breakzen"
      },
      config: {
        googleSignIn: {          
          reservedClientId: "com.googleusercontent.apps.865330437158-6utfjhqbc3pps1au9kahl5pgv9pntd7p"
        }
      },      
      googleServicesFile: "./GoogleService-Info.plist"  
    },    
    android: {
      package: "com.breakzen.breakzen",
      googleServicesFile: "./google-services.json",
      useNextNotificationsApi: true,
      permissions: ["ACCESS_COARSE_LOCATION", "ACCESS_FINE_LOCATION", "ACCESS_BACKGROUND_LOCATION", "CAMERA", "FOREGROUND_SERVICE", "RECEIVE_BOOT_COMPLETED", "NOTIFICATIONS"],
      useNextNotificationsApi: true,
    },
    extra: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      iosClientId: "865330437158-6utfjhqbc3pps1au9kahl5pgv9pntd7p.apps.googleusercontent.com",
      androidClientId: "865330437158-tivs5ohcnpv9hmmjf8fo0hsdnj2nvvqi.apps.googleusercontent.com",
      androidStandaloneAppClientId: "865330437158-811b2tdfesr3neqslelc41derdr1c96b.apps.googleusercontent.com",
      iosStandaloneAppClientId: "865330437158-c19v8tg3t8smmoqlfbujh7fcji0761rt.apps.googleusercontent.com",
      webClientId: "865330437158-6pg24be2tr1f4fejfi34j0fsa70f7kei.apps.googleusercontent.com",
      facebookScheme: "fb595598541722630",
      facebookAppId: "595598541722630",
      facebookDisplayName: "Breakzen"
    }         
  }
};
