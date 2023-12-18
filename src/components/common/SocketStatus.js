import { useEffect, useState } from "react"
import { View } from "react-native"
import { Text } from "react-native-paper"
import { useSelector } from "react-redux"

const messages = ['Connecting...', 'If still not connected please press online/offline button']
let watchCounter = undefined
export default ({multipleMsg= true, containerStyles={}, textStyles={}}) => {
    const { isSocketConnected } = useSelector((state) => state.auth)
    const [counter, setCounter] = useState(0)
    useEffect(() => {
        if (!isSocketConnected && multipleMsg)
            watchCounter = setInterval(() => {
                if (counter < messages.length - 1) {
                    setCounter(counter + 1)
                } else {
                    setCounter(0)
                }
            }, 5000)
        return () => watchCounter ?? clearInterval(watchCounter)
    }, [multipleMsg, isSocketConnected])

    return (<>
        {!isSocketConnected && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20,...containerStyles  }}><Text style={{fontWeight: 'bold',...textStyles}}>{messages[counter]}</Text></View>}
    </>)
}