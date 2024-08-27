import { StyleSheet } from 'react-native';
import { COLORS } from '../constants';
import { getScreen } from '../util';

const LoginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    height: getScreen().screenHeight
  },

  logoSection: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.65)',
    height: 260,
  },
  logoTxt: {
    fontSize: 30,
    color: '#fff',
    fontWeight: '100',
  },
  section: {
    flex: 1,
    padding: 20,
  },
  textInputPickup: {
    borderColor: '#CCCCCC',
    borderRadius: 8,
    borderWidth: 0.5,
    paddingHorizontal: 15,
    height: 44,
    fontSize: 16,
  },
  textInputDrop: {
    backgroundColor: '#f2f4f6',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    marginBottom: 20,
    padding: 15,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    height:48
  },
  text: {
    fontSize: 18,
    lineHeight: 27,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  googleBtn: {
    ...StyleSheet.button,
    backgroundColor: COLORS.bg_light,
    elevation: 3,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
  },
  googleTxt: {
    ...StyleSheet.text,
    color: COLORS.black,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  greenTxt: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10
  },
  headerText: {
    color: '#000',
    textAlign: 'center',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20
  },
  forgotSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signUpSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default LoginStyles;
