import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';

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
    pickRide:'PickRide',
    findCaptain: 'FindCaptain',
    activeRide:'ActiveRide',
    myRides: 'MyRides',
    wallet: 'Wallet',
    profile: 'Profile',
    moreDetails: 'MoreDetails',
    terms:'Terms',
    signIn: 'SignIn',
    signUp:'SignUp',
    searchRide: 'SearchRide'
  } 

  export const TAB_BAR_ICONS = {
    [ROUTES_NAMES.pickRide]: ['map-search', 'map-search-outline'],
    [ROUTES_NAMES.findRide]: ['map-search', 'map-search-outline'],
    [ROUTES_NAMES.myRides]: ['account-reactivate', 'account-reactivate-outline'],
    [ROUTES_NAMES.wallet]: ['wallet', 'wallet-outline'],
    [ROUTES_NAMES.moreDetails]: ['account-settings', 'account-settings-outline']
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


  export const VEHICLE_TYPES = {
    car: 'car-side',
    auto: 'golf-cart',//rv-truck,truck
    bike: 'bike'
  }