import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    markerImageLarge: {
        minHeight: 5,
        minWidth: 5,
        height: 75,
        width: 50,
    },
    markerImageSmall: {
        minHeight: 5,
        minWidth: 5,
        height: 30,
        width: 30
    }
});
