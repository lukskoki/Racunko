import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    container: {
        width: '100%',
        height: '8%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    button: {
        flex: 1,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 3,
        borderColor: 'grey',
    },
    buttonActive: {
        flex: 1,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 3,
        borderColor: '#2563EB',
    },
    text: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#2563EB',
    },
    plain: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'black',
    }
});
