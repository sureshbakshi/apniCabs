// useSound.js
import SoundPlayer from 'react-native-sound-player'

const useSound = (soundFilePath) => {


  const playSound = () => {
    try {
        console.log({soundFilePath})
        SoundPlayer.playUrl(soundFilePath)
    } catch (e) {
        console.log(`cannot play the sound file`, e)
    }
  };

  return playSound;
};

export default useSound;
