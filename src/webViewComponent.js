import React, { useRef } from 'react';
import { SafeAreaView, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { goBack } from './util/navigationService';

const PaymentScreen = ({ navigation, route }) => {
  const gateway_request = route.params?.gateway_request
  const parsedRequest = JSON.parse(gateway_request)
  navigation.setOptions({
    headerShown: false,
  });
  const webviewRef = useRef(null);

  const handleWebViewMessage = (event) => {
    const { data } = event.nativeEvent;
    try {
      const parsedData = JSON.parse(data);
      if (parsedData.status && parsedData.response) {
        Alert.alert('Transaction Status', `Status: ${parsedData.status}, Response: ${parsedData.response}`);
      }
    } catch (error) {
      console.error('Failed to parse message from WebView', error);
    }
    goBack()
  };
  if (parsedRequest?.headers?.authorization && parsedRequest?.parameters?.bdorderid) {
    const { headers: { authorization }, parameters: { bdorderid } } = parsedRequest
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <WebView
          ref={webviewRef}
          source={{ uri: `https://apnicabi.com/payment.html?bdOrderId=${bdorderid}&authToken=${authorization}` }}
          onShouldStartLoadWithRequest={(request) => {
            if (request.url !== 'https://apnicabi.com') {
              // Handle the request for new windows or external URLs
              // For example, open in the same WebView, open in another WebView, or use a Linking library
              return false;
            }
            return true;
          }}
          onMessage={handleWebViewMessage}
          javaScriptEnabled
          domStorageEnabled
          
        />
      </SafeAreaView>
    );
  } else {
    goBack()
  }

};

export default PaymentScreen;
