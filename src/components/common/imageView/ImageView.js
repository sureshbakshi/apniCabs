import React, { useState } from "react";
import { Image } from "react-native";
import images from '../../../util/images'
import styles from './ImageView.styles'
const ImageView = ({ style, source, loadingText, ...rest }) => {
    let [showDefault, setShowDefault] = useState(true)
    return (<>
        <Image
            defaultSource={images.placeholder}
            source={source}
            onLoadEnd={() => setShowDefault(false)}
            style={[styles.placeholder,style]}
            {...rest}
        />
    </>
    );
};
export default ImageView;