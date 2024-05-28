import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import images from './util/images';
import { formatStatusText, formattedDate } from './util';


export const authInitialState = {
  googleInfo: null,
  userInfo: null,
  access_token: null,
  driverInfo: null,
  isSocketConnected: false,
  isDialogOpen: false,
  device_token: null,
  vehicleTypes: null,
  androidDeviceCode: null
};

export const USER_ROLES = {
  USER: "USER",
  DRIVER: "DRIVER",
  OWNER: "OWNER",
};

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
  primary: "#f85c70",
  primary_soft: "#ff8f9d",
  brand_yellow: '#ffe403',
  brand_blue: '#2399ff',
  bg_primary: "#ffd1d6",
  bg_light: "#f9f9f9",
  bg_dark: "#f0f0f0",
  bg_secondary: "#ccc",
  bg_gray_primary: "#ececec",

  text_gray: "#838383",
  text_dark: "#111",

  white: "#fff",
  black: "#000",
  gray: "gray",
  blue: "#00f",
  red: "#f00",
  dark_green: "#155724",
  green: "#11c874",

  light_green: "#d4edda",
  light_green_primary: "#a1d5ae",
  yellow: "yellow",
  dodgerblue: "dodgerblue",
  orange: "#ff6600",

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

export const ROUTES_NAMES = {
  findRide: 'FindRide',
  pickRide: 'PickRide',
  chat: 'Chat',
  findCaptain: 'FindCaptain',
  activeRide: 'ActiveRide',
  rideHistoryStack: 'RideHistoryStack',
  myRides: 'MyRides',
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
  forgotPassword: 'ForgotPassword'
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
  UNAVAILABLE: 'UNAVAILABLE'
}

export const RIDE_STATUS_LABELS = {
  [RideStatus.USER_CANCELLED]:  'User Cancelled',
  [RideStatus.DRIVER_CANCELLED]: 'Driver Cancelled',
  [RideStatus.COMPLETED]:  'Completed',
  [RideStatus.ACCEPTED]: 'On Going',
}

export const colorsNBg = {
  [RideStatus.USER_CANCELLED]: { color: COLORS.black, bg: COLORS.bg_secondary, label: 'Cancelled', image: images.rideCancel },
  [RideStatus.DRIVER_CANCELLED]: { color: COLORS.black, bg: COLORS.bg_secondary, label: 'Cancelled', image: images.rideCancel },
  [RideStatus.COMPLETED]: { color: COLORS.white, bg: COLORS.green, label: 'Completed', image: images.rideAccept },
  [RideStatus.ACCEPTED]: { color: COLORS.white, bg: COLORS.brand_blue, label: 'On Going', image: images.rideAccept },
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
  ACCEPTED: 'REQUEST_ACCEPTED'
}

export const RequestStatus = {
  REQUESTED: 'REQUESTED',

}
export const RideProxyNumber = '08071175144'
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
  [ROUTES_NAMES.pickRide]: ['map-search', 'map-search-outline'],
  [ROUTES_NAMES.findRide]: ['map-search', 'map-search-outline'],
  [ROUTES_NAMES.rideHistoryStack]: ['account-reactivate', 'account-reactivate-outline'],
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
  car: 'car-side',
  auto: 'golf-cart',//rv-truck,truck
  'Bike': 'bike'
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
},{
  key: 'request.reason',
},{
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
    name: 'email',
    label: "Email",
    props: {
      placeholder: "example@example.com",
    },
  },
  {
    name: 'password',
    label: "Password",
    props: {
      placeholder: "12345",
      secureTextEntry: true,
    },
  },
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
    label: "Email Address*",
    props: {
      placeholder: "Enter email address*",
      required: true,
      editable: false,
      selectTextOnFocus: false
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
    name: 'password',
    label: "Password*",
    props: {
      placeholder: "Enter password*",
      required: true,
      secureTextEntry: true,
    },
  },
  // {
  //   name: 'referred_by',
  //   label: "Referral Code",
  //   props: {
  //     placeholder: "Referral Code",
  //     required: false,
  //     inputMode: 'numeric',
  //     keyboardType: 'number-pad',
  //   },
  // },
];