import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import images from './util/images';
import { formatStatusText, formattedDate } from './util';
import { styles } from './navigation/TabBar';

export const ELEMENTS = {
  select: "select"
};
export const SELECT_OPTIONS_KEYS = {
  city: "city"
};
export const authInitialState = {
  googleInfo: null,
  userInfo: null,
  access_token: null,
  driverInfo: null,
  isSocketConnected: false,
  isDialogOpen: false,
  device_token: null,
  vehicleTypes: null,
  androidDeviceCode: null,
  selectedLanguage: 'en',
  rideChats: null
};

export const USER_ROLES = {
  USER: "USER",
  DRIVER: "DRIVER",
  OWNER: "OWNER",
};

export const ROLE_IDS = {
  [USER_ROLES.USER]: '8d9b7a03-dc12-4d5d-a8ee-6575bc5342e0',
  [USER_ROLES.DRIVER]: '7f4f1d06-8387-4bc3-8855-c8e0956b1c50',
  [USER_ROLES.OWNER] : '3cb09115-b4ef-4ed3-8658-f08a3a672451'
}

export const DEFAULT_VEHICLE_TYPES = [
  {
    "id": "60670798-84a5-11ee-a1cc-06a7f9e34a98",
    "code": "BIKE",
    "name": "Bike"
  },
  {
    "id": "856ca5e1-89f3-11ee-a1cc-06a7f9e34a98",
    "code": "AUTO",
    "name": "Auto"
  },
  {
    "id": "a043f775-84a5-11ee-a1cc-06a7f9e34a98",
    "code": "CAR",
    "name": "Car"
  }
]


export const COLORS = {
  primary: "#ED3D01",
  primary_dark: '#F6675A',
  primary_green: '#59E081',
  primary_soft: "#ff8f9d",
  brand_yellow: '#ffe403',
  brand_blue: '#2399ff',
  bg_primary: "#ffd1d6",
  bg_light: "#f9f9f9",
  bg_dark: "#f0f0f0",
  bg_secondary: "#ccc",
  bg_gray_primary: "#ececec",
  primary_blue: '#4D81E7',
  secondary_blue: '#539DF3',
  button_blue_bg: '#2499FF',
  primary_light: '#FFE5E2',
  neutral_gray: '#94A3B8',

  bg_blue_lite: '#EDF5FF',
  bg_gray_secondary: '#DFDFDF',
  brand_green: '#38C274',
  card_bg: '#F0F4F8',
  sepator_line: '#F1F5F9',
  sepator_line_dark: '#475569',

  text_gray: "#838383",
  text_gray1: "#8F92A1",
  text_dark: "#111",
  text_dark1: '#1A1C1E',
  text_dark2: '#030319',
  text_light_gray: '#6C7278',

  white: "#fff",
  black: "#2F2A49",
  gray: "gray",
  blue: "#00f",
  red: "#f00",
  dark_green: "#155724",
  green: "#29BE70",
  blue: '#2499FF',


  light_green: "#d4edda",
  light_green_primary: "#a1d5ae",
  yellow: "yellow",
  dodgerblue: "dodgerblue",
  orange: "#F2AB01",

  pending_bg: '#d73eff',
  approved_bg: '#11c874',
  cancelled_bg: '#ffce00',

  badges: {
    "is-top": "#f39f0a",
    "is-featured": "#e5f8f7",
    "is-bump-up": "#f39f0a",
    "is-sold": "#1aa78e",
    "is-popular": "#14e0ad",
  },

  cardBg: {
    "is-top": "#ffe3b0",
    "is-featured": "#e5f8f7",
    "is-popular": "#c4fff0",
  },

  button: {
    disabled: "#f797a3",
    active: "#f85c70",
  },
};

export const default_btn_styles = {
  styles: { height: 40, minWidth: 120 },
  textStyles: { color: COLORS.white, fontSize: 14, fontWeight: 400, lineHeight: 18 },
  isLowerCase: true,
}

export const ROUTES_NAMES = {
  findRide: 'FindRide',
  pickRide: 'PickRide',
  chat: 'Chat',
  findCaptain: 'FindCaptain',
  activeRide: 'ActiveRide',
  rideHistoryStack: 'RideHistoryStack',
  myRides: 'MyRides',
  myPlans: 'MyPlans',
  payment: 'Payment',
  wallet: 'Wallet',
  profile: 'Profile',
  moreDetails: 'MoreDetails',
  terms: 'Terms',
  signIn: 'SignIn',
  signUp: 'SignUp',
  searchRide: 'SearchRide',
  activeMap: 'ActiveMap',
  messageInfo: 'MessageInfo',
  refer: 'Refer',
  notifications: 'Notifications',
  rideDetails: 'RideDetails',
  otp: 'OTP',
  forgotPassword: 'ForgotPassword',
  gettingStartedPage: 'GettingStartedPage',
  selectonMap: 'SelectonMap',
  language: 'Language',
  chat: 'Chat'
}

export const RideStatus = {
  REQUESTED: 'REQUESTED',
  ACCEPTED: 'ACCEPTED',
  DECLINED: 'DECLINED',
  CLOSED: 'CLOSED',
  ONRIDE: 'ONRIDE',
  CANCELLED: 'CANCELLED',
  AUTO_CANCELLED: 'AUTO_CANCELLED',
  COMPLETED: 'COMPLETED',
  USER_CANCELLED: 'USER_CANCELLED',
  DRIVER_CANCELLED: 'DRIVER_CANCELLED',
  PENDING: 'PENDING',
  UNAVAILABLE: 'UNAVAILABLE',
  INITIATED:'INITIATED'
}

export const RIDE_STATUS_LABELS = {
  [RideStatus.USER_CANCELLED]: 'User Cancelled',
  [RideStatus.DRIVER_CANCELLED]: 'Driver Cancelled',
  [RideStatus.COMPLETED]: 'Completed',
  [RideStatus.ACCEPTED]: 'On Going',
}

export const colorsNBg = {
  [RideStatus.USER_CANCELLED]: { color: COLORS.black, bg: COLORS.bg_secondary, label: 'Cancelled', image: images.rideCancel },
  [RideStatus.DRIVER_CANCELLED]: { color: COLORS.black, bg: COLORS.bg_secondary, label: 'Cancelled', image: images.rideCancel },
  [RideStatus.COMPLETED]: { color: COLORS.primary, bg: COLORS.green, label: 'Completed', image: images.rideAccept },
  [RideStatus.ACCEPTED]: { color: COLORS.primary, bg: COLORS.brand_blue, label: 'On Going', image: images.rideAccept },
}

export const VerificationStatus = {
  REJECTED: 'REJECTED',
  VERIFIED: 'VERIFIED',
  ONHOLD: 'ONHOLD',
  REVEIEW: 'REVIEWING',
}

export const DriverAvailableStatus = {
  OFFLINE: 'OFFLINE',
  ONLINE: 'ONLINE',
  ONRIDE: 'ONRIDE',
  ACCEPTED: 'REQUEST_ACCEPTED',
  BUSY: 'BUSY'
}

export const RequestStatus = {
  REQUESTED: 'REQUESTED',

}
export const RideProxyNumber = '03368202999' //exotel: '08071175144' //'03368202999'
export const SUPPORT = {
  mobile: {
    label: '1800 309 5959',
    value: '18003095959'
  },
  email: {
    label: 'contact@apnicabi.com',
    value: 'contact@apnicabi.com?subject=Support'
  }
}

export const ClearRideStatus = [RideStatus.USER_CANCELLED, RideStatus.DRIVER_CANCELLED, RideStatus.COMPLETED]


export const TAB_BAR_ICONS = {
  [ROUTES_NAMES.chat]: ['chat', 'chat'],
  [ROUTES_NAMES.pickRide]: ['home-search-outline', 'home-search-outline'],
  [ROUTES_NAMES.findRide]: ['home-search-outline', 'home-search-outline'],
  [ROUTES_NAMES.rideHistoryStack]: ['clock-outline', 'clock-outline'],
  [ROUTES_NAMES.wallet]: ['wallet', 'wallet-outline'],
  [ROUTES_NAMES.moreDetails]: ['account-settings', 'account-settings-outline']
}

export const ExpiryStatus = {
  'pollution_expiry': `Pollution certificate`,
  'registration_expiry': `Registration certificate`,
  'road_tax_expiry': `Road tax certificate`,
  "insurance_expiry": "Insurance certificate"
}

export const toastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: 'green' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400'
      }}
    />
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: (props) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: 'red' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 14
      }}
      text2Style={{
        fontSize: 15
      }}
    />
  ),
  /*
    Or create a completely new type - `tomatoToast`,
    building the layout from scratch.
 
    import Toast from 'react-native-toast-message';
    const showToast = () => {
        Toast.show({
            type: 'tomatoToast',
            text1: 'This is an info message',
            position: 'bottom'
        });
    }
 
    I can consume any custom `props` I want.
    They will be passed when calling the `show` method (see below)
  */
  tomatoToast: ({ text1, props }) => (
    <View style={{ height: 60, width: '100%', backgroundColor: 'tomato' }}>
      <Text>{text1}</Text>
      <Text>{props.uuid}</Text>
    </View>
  )
};


export const VEHICLE_IMAGES = {
  BIKE: images.bike,
  AUTO: images.auto,
  CAR: images.carYellow
}

export const VEHICLE_TYPES = {
  'CAR': 'car-side',
  'AUTO': 'golf-cart',//rv-truck,truck
  'BIKE': 'bike'
}

export const VEHICLE_INFORMATION = [{
  key: 'driver.vehicle.registration_number',
  props: {
    style: { fontWeight: 'bold' }
  }
}, {
  key: ['driver.vehicle.model', 'driver.vehicle.colour'],
  props: {

  }
}]

export const USER_INFORMATION = [{
  key: 'user.name',
  props: {
    style: { fontWeight: 'bold' }
  }
}]
export const RIDE_HISTOY_DETAILS = [{
  key: 'request.ride.driver.vehicle.registration_number',
  props: {
    style: { fontWeight: 'bold' }
  }
}, {
  key: 'request.ride.created_at',
  formatter: formattedDate
}, {
  key: 'request.ride.status',
  formatter: formatStatusText
}]

export const RIDE_CANCEL_INFO = [{
  key: 'request.status',
  formatter: formatStatusText
}, {
  key: 'request.reason',
}, {
  key: 'request.created_at',
  formatter: formattedDate

}]

export const USER_DETAILS = [{
  key: 'userDetails.name',
  props: {
    style: { fontWeight: 'bold' }
  }
}]

export const BASE_FARE_FORM = [
  {
    name: 'base_fare',
    label: "Base fare",
    props: {
      placeholder: "Enter Base fare amount",
    },
  },
  {
    name: 'fare_0_10_km',
    label: "Fare for 0 to 10km",
    props: {
      placeholder: "Enter fare amount for below 10km",
    },
  },
  {
    name: 'fare_10_20_km',
    label: "Fare for 10.1 to 20km",
    props: {
      placeholder: "Enter fare amount for 10.1 to 20km",
    },
  },
  {
    name: 'fare_20_50_km',
    label: "Fare for 20.1 to 50km",
    props: {
      placeholder: "Enter fare amount for 20.1 to 50km",
    },
  },
  {
    name: 'fare_above_50_km',
    label: "Fare for above 50 km",
    props: {
      placeholder: "Enter fare amount above 50km",
    },
  },
];

export const CONTACTS_FORM = [
  {
    name: 'phone_number1',
    label: "",
    props: {
      placeholder: "Enter Phone Number 1",
    },
  },
  {
    name: 'phone_number2',
    label: "",
    props: {
      placeholder: "Enter Phone Number 2",
    },
  },
  {
    name: 'phone_number3',
    label: "",
    props: {
      placeholder: "Enter Phone Number 3",
    },
  },
  {
    name: 'phone_number4',
    label: "",
    props: {
      placeholder: "Enter Phone Number 4",
    },
  },
];


export const LOGIN_FORM = [
  {
    name: 'phone',
    label: "Phone number",
    props: {
      placeholder: "Enter phone number",
    },
  },
  // {
  //   name: 'password',
  //   label: "Password",
  //   props: {
  //     placeholder: "12345",
  //     secureTextEntry: true,
  //   },
  // },
];

export const FORGOT_PASSWORD = [
  {
    name: 'mobile',
    label: "Phone number",
    props: {
      placeholder: "Enter Phone number",
    },
  },
  {
    name: 'password',
    label: "New password",
    props: {
      placeholder: "Enter new password",
      secureTextEntry: true,
    },
  },
  {
    name: 'confirm_password',
    label: "Confirm new password",
    props: {
      placeholder: "Enter confirm new password",
      secureTextEntry: true,
    },
  },
];


export const SIGN_UP_FORM = [
  {
    name: 'name',
    label: "Name*",
    props: {
      placeholder: "Enter name*",
      required: true,
    },
  },
  {
    name: 'email',
    label: "Email Address",
    props: {
      placeholder: "Enter email address",
      // required: false,
      // editable: false,
      // selectTextOnFocus: false
    },
  },
  {
    name: 'phone',
    label: "Phone Number*",
    props: {
      placeholder: "Enter phone number*",
      required: true,
      inputMode: 'numeric',
      keyboardType: 'number-pad',

    },
  },
  {
    name: 'referredBy',
    label: "Referral Code",
    props: {
      placeholder: "Referral Code",
      required: false,
    },
  },
];

export const MAPS_LABELS = {
  from: 'Pickup',
  to: 'Drop'
}

export const SOCKET_EVENTS = {
  rideCompleted: 'ride-completed',
  sendMessage: 'send-message',
  joinRoom: 'join-room'
}