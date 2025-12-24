import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
    },
    main: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center',
    },
    image:{
        height: 250,
        width: 250,
    },
    codeView:{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    codeContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '75%',
    },
    codeInput: {
        width: 50,
        height: 50,
        borderWidth: 2,
        borderColor: "#D1D5DB",
        borderRadius: 10,
        textAlign: 'center',
        fontSize: 24,
        backgroundColor: '#F5F5F5',
    },
    makeGroup: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10,
        width: '75%',
        marginTop: 35
    },
    button: {
        width: '70%',
        paddingVertical: 15,
        backgroundColor: '#2563EB',
        borderRadius: 15,

    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        textAlign: "center"
    },
    statusModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusModalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 32,
        alignItems: 'center',
        gap: 16,
        minWidth: 280,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 10,
        width: '80%',
    },
    statusModalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1E293B',
        textAlign: 'center',
    },
    statusModalSubtitle: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
    },
    successIconContainer: {
        marginBottom: 8,
    },
    groupNameInput: {
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        minWidth: '100%',
    },
    modalButtonContainer: {
        width: '100%',
        gap: 8,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',

    },
    submitButton: {
        backgroundColor: '#2563EB',
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
        width: '35%',
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    cancelButton: {
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
        width: '35%',
    },
    cancelButtonText: {
        color: '#64748B',
        fontWeight: '600',
    },
    loadingText: {
        textAlign: 'center',
        marginTop: 10,
    },
})