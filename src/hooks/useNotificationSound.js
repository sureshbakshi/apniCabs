import { useEffect } from "react"
import SoundPlayer from "react-native-sound-player"
import audio from "../assets/audio"

export default () => {
    const setSoundConfig = () => {
        SoundPlayer.setSpeaker(true)
        SoundPlayer.setVolume(1);
    }

    useEffect(() => {
        const _onFinishedLoadingSubscription = SoundPlayer.addEventListener('FinishedLoading', ({ success }) => {
            if (success) {
                setSoundConfig()
            }
        })
        return () => _onFinishedLoadingSubscription.remove()
    }, [])

    const playSound = (filePath = audio.knock) => {
        try {
            SoundPlayer.playUrl(filePath)
        } catch (e) {
            console.log(`cannot play the sound file`, e)
        }
    }
    return { playSound }
}