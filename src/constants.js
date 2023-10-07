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
    findCaptain: 'FindCaptain',
    myRides: 'MyRides',
    wallet: 'Wallet',
    profile: 'Profile',
    moreDetails: 'MoreDetails',
    terms:'Terms',
    signIn: 'SignIn',
    signUp:'SignUp'
  } 

  export const TAB_BAR_ICONS = {
    [ROUTES_NAMES.findRide]: ['map-search', 'map-search-outline'],
    [ROUTES_NAMES.myRides]: ['account-reactivate', 'account-reactivate-outline'],
    [ROUTES_NAMES.wallet]: ['wallet', 'wallet-outline'],
    [ROUTES_NAMES.moreDetails]: ['account-settings', 'account-settings-outline']
  }