import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    errorContainer: {
        alignSelf: 'center',
        width: '80%',
        backgroundColor: '#FEE2E2',
        borderRadius: 8,
        padding: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#EF4444',
        marginBottom: 8,
    },
    errorText: {
        color: '#991B1B',
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
    },
    temporaryText: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    }
});