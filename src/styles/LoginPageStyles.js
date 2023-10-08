import {StyleSheet} from 'react-native';
import { COLORS } from '../constants';

const LoginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
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
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
  },
  textInputPickup: {
    backgroundColor: '#f2f4f6',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomColor: '#ccc',
    borderBottomWidth: 0.5,
    padding: 15,
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
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  googleBtn: {
    ...StyleSheet.button,
    backgroundColor: '#fff',
    elevation: 3,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
  },
  googleTxt: {
    ...StyleSheet.text,
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  greenTxt: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '500',
    marginLeft:10
  },
  headerText: {
    color: '#000',
    textAlign: 'center',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical:20
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
