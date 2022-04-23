export const color = {
  blue: "#7DBDEF",
  gray: "#BCBCBC",
  backGray: "#EEEEEE",
  lightGray: "#F7F7F7",
  // backGray: '#FBFBFB',
};

export const size = {
  screenpb: 32,
};

export const buttonType = {
  login: "login",
  register: "register",
  search: "search",
  forgot: "forgot",
  scan: "scan",
  tick: "tick",
  //---------------------------
  facebook: "facebook",
  google: "google",
  apple: "apple",
  email: "email",
};

export const inputType = {
  email: "email",
  password: "password",
  user: "user",
  service: "service",
};

export const serviceType = {
  personalTrainer: "Personal Trainer",
  holisticHealer: "Holistic Healer",
  massageTherapist: "Massage Therapist",
  nutritionist: "Nutritionist",
  sportCoach: "Sport Coach",
};

export const abilityType = {
  speciality: "speciality",
  credential: "credential",
};

export const memberType = {
  general: "General",
  pro: "Pro",
};

export const planType = {
  monthly: "Monthly",
  annual: "Annual",
};

export const groupMember = {
  creator: "creator",
  member: "member",
  request: "request",
  invite: "invite",
  none: "none",
};

export const messageType = {
  professionalAccept: "accept",
  clientAccept: "caccept",
  professionalDecline: "decline",
  clientDecline: "cdecline",
  professionalCancel: "cancel",
  clientCancel: "ccancel",
  checkAvailability: "check",
  jobpost: "jobpost",
};

export const googleMapApi =
  "https://maps.googleapis.com/maps/api/distancematrix/json" +
  "?mode=car" +
  "&sensor=false" +
  "&key=AIzaSyDfFoyLP4-R0oZO7TTwkqbJHFuEE34QaLs";

export const chatCollection = (id1, id2) => {
  const array = [id1, id2];
  return `chat${array.sort().join("")}`;
};

export const getMessageTime = (time) => {
  const timeStamp = new Date(time.seconds * 1000 + time.nanoseconds / 1000000);
  const hour = timeStamp.getHours();
  const minute = timeStamp.getMinutes();
  const hourString = hour < 10 ? `0${hour}` : hour;
  const minuteString = minute < 10 ? `0${minute}` : minute;
  return `${hourString}:${minuteString}`;
};

export const initalValue = {
  groupTime: new Date(2021, 7),
};

export const defaultPhoto = [
  "https://firebasestorage.googleapis.com/v0/b/breakzen-34355.appspot.com/o/DefaultPhoto%2FSYMBOL%20blue%20background.png?alt=media&token=f4840b4c-471e-4d28-8958-9b0b39a4291c",
];

export const breakzen = {
  photo:
    "https://firebasestorage.googleapis.com/v0/b/breakzen-34355.appspot.com/o/DefaultPhoto%2Fic_launcher.png?alt=media&token=948fa4e5-48f0-42da-b23c-bca74573c5e9",
  uid: "I5dWQejukJBTRo3VllL1",
  name: "Breakzen",
};

const chars =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

const Base64 = {
  btoa: (input = "") => {
    const str = input;
    let output = "";

    for (
      let block = 0, charCode, i = 0, map = chars;
      str.charAt(i | 0) || ((map = "="), i % 1);
      output += map.charAt(63 & (block >> (8 - (i % 1) * 8)))
    ) {
      charCode = str.charCodeAt((i += 3 / 4));

      if (charCode > 0xff) {
        throw new Error(
          "'btoa' failed: The string to be encoded contains characters outside of the Latin1 range."
        );
      }

      block = (block << 8) | charCode;
    }

    return output;
  },

  atob: (input = "") => {
    const str = input.replace(/=+$/, "");
    let output = "";

    if (str.length % 4 === 1) {
      throw new Error(
        "'atob' failed: The string to be decoded is not correctly encoded."
      );
    }
    for (
      let bc = 0, bs = 0, buffer, i = 0;
      (buffer = str.charAt(i++));
      ~buffer && ((bs = bc % 4 ? bs * 64 + buffer : buffer), bc++ % 4)
        ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
        : 0
    ) {
      buffer = chars.indexOf(buffer);
    }

    return output;
  },
};

export const checkrKey = `Basic ${Base64.btoa(
  "4ee58966d149d934577abc646b7460aa5add8590"
)}`;

export const backcheckState = {
  none: "none",
  pending: "pending",
  done: "done",
};

export const idcheckStatus = {
  requires_input: "requires_input",
  processing: "processing",
  verified: "verified",
  canceled: "canceled"
};

export const loginType = {
  email: "email",
  facebook: "facebook",
  google: "google",
  apple: "apple"
};

export const paymentType = {
  cashApp: "cashApp",
  masterCard: "masterCard",
  paypal: "paypal",
  venmo: "venmo",
  visa: "visa",
};

export const isEqualArray = (array1, array2) => {
  const len1 = array1.length;
  const len2 = array2.length;
  if (len1 == len2) {
    for (let i = 0; i < len1; i++) {
      if (array1[i] != array2[i]) return false;
    }
  } else return false;
  return true;
};

export const coachType = [
  "American Football",
  "Baseball",
  "Basketball",
  "Badminton",
  "Boxing",
  "CrossFit",
  "Golf",
  "Ice Hockey",
  "Soccer",
  "Swimming",
  "Tennis",
  "Volleyball",
  "WWE",
];

export const HealerType = [
  "Meditation",
  "Yoga",
  "Reiki",
  "General healer"
];

export const defaultUserData = {
  professional: {
    backcheck: backcheckState.none, // background checked
    confirmed: false, // ID verificaton Confirmed
    coach: '',
    service: "",
    speciality: [],
    credential: [],
    star: 0,
    reviews: [],
    price: "",
    membership: "",
    card: {},
    customerId: '',
    paymentMethodId: '',
    paymentmethods: [],
    times: [
      "10,0,16,0",
      "10,0,16,0",
      "10,0,16,0",
      "10,0,16,0",
      "10,0,16,0",
      "10,0,16,0",
      "10,0,16,0",
    ],
    weekdays: [false, false, false, false, false, false, false],
    cerfront: "",
    idfront: "",
    idback: "",
    expiredate: "",
  },
  client: {
    goals: [],
    postcnt: 0,
    favorite: [],
  },
  user: {
    professional: true,
    reported: false,
    aboutme: "",
    email: "",
    verified: false,  // Email Verified
    name: "",
    location: "",
    zipcode: "",
    phone: "",
    photo: defaultPhoto[0],
    gallery: [],
    chats: [breakzen.uid],
    requests: [],
    grequests: 0,
    groupcnt: 0,
    groups: [],
  },
};
