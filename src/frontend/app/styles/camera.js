import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    container: {
        width: '100%',
        justifyContent: 'center',
        flex: 1,
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 50,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: 'transparent',
        width: '100%',
        height:'12%',

    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    shutterButton: {
        height: 90,
        width: 90,

    },
    flipButton: {
        height: 45,
        width: 45,
    }
})