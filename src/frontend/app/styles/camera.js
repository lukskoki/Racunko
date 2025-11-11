import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
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
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    bottomSheet: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        height: '75%',
        width: '100%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginTop: 15,
        color: '#333',
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    resultContainer: {
        width: '100%',
        marginTop: 20,
        marginBottom: 20,
    },
    resultRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    resultLabel: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    resultValue: {
        fontSize: 16,
        color: '#333',
        fontWeight: '600',
    },
    buttonRow: {
        flexDirection: 'row',
        width: '100%',
        gap: 10,
        marginTop: 10,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        color: '#666',
        fontWeight: '600',
    },
    saveButton: {
        flex: 1,
        backgroundColor: '#007AFF',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    saveButtonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
    inputGroup: {
        width: '100%',
        marginBottom: 15,
    },
    inputLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
        fontWeight: '500',
    },
    input: {
        width: '100%',
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        color: '#333',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    dateInput: {
        width: '100%',
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    dateText: {
        fontSize: 16,
        color: '#333',
    },
    successIcon: {
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
    }
})