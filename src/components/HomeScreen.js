import * as React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Button,
  ScrollView,
} from 'react-native';
import { navigate } from '../util/navigationService';
import { Text } from './common';

const HomeScreen = () => {
  const [serverState, setServerState] = React.useState('Loading...');
  const [messageText, setMessageText] = React.useState('');
  const [disableButton, setDisableButton] = React.useState(true);
  const [inputFieldEmpty, setInputFieldEmpty] = React.useState(true);
  const [serverMessages, setServerMessages] = React.useState([]);

  // let ws = React.useRef(new WebSocket('ws://localhost:8080')).current;
  // console.log('ws====', ws);

  // React.useEffect(() => {
  //   const serverMessagesList = [];

  //   ws.onopen = () => {
  //     console.log('WebSocket Client Connected');
  //     setServerState('Connected to the server');
  //     setDisableButton(false);
  //   };

  //   ws.onclose = e => {
  //     setServerState('Disconnected. Check internet or server.');
  //     setDisableButton(true);
  //   };

  //   ws.onerror = e => {
  //     setServerState(e.message);
  //   };

  //   ws.onmessage = e => {
  //     serverMessagesList.push(e.data);
  //     setServerMessages([...serverMessagesList]);
  //   };
  // }, []);

  // const submitMessage = () => {
  //   ws.send(messageText);
  //   setMessageText('');
  //   setInputFieldEmpty(true);
  // };

  return (
    <View style={styles.container}>
      <View
        style={{
          backgroundColor: '#eeceff',
          padding: 5,
        }}>
        <Text>{serverState}</Text>
      </View>
      <Button onPress={() => navigate('Geolocation')} title={'Go to Geolocation'} />
      <View
        style={{
          backgroundColor: '#ffeece',
          padding: 5,
          flexGrow: 1,
        }}>
        <ScrollView>
          {serverMessages.map((item, ind) => {
            return <Text key={ind}>{item}</Text>;
          })}
        </ScrollView>
      </View>

      <View
        style={{
          flexDirection: 'row',
        }}>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: 'black',
            flexGrow: 1,
            padding: 5,
          }}
          placeholder={'Add Message'}
          onChangeText={text => {
            setMessageText(text);
            setInputFieldEmpty(text.length > 0 ? false : true);
          }}
          value={messageText}
        />
        <Button
          onPress={submitMessage}
          title={'Submit'}
          disabled={disableButton || inputFieldEmpty}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
});
export default HomeScreen;
