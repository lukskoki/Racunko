import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    display: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexDirection: 'column',
        backgroundColor: '#EEF2F6',
        paddingTop: 12,
    },

    profileHero: {
        width: '90%',
        alignSelf: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#0F172A',
        shadowOpacity: 0.12,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 8 },
        elevation: 4,
    },
    profileHeroRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatarWrap: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#E2E8F0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileImage: {
        width: 36,
        height: 36,
    },
    profileTextWrap: {
        flex: 1,
    },
    profileKicker: {
        fontSize: 12,
        color: '#64748B',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    profileName: {
        fontSize: 22,
        fontWeight: '700',
        color: '#0F172A',
    },
    profileSub: {
        marginTop: 2,
        fontSize: 14,
        color: '#475569',
    },
    status: {
        alignSelf: 'flex-start',
        marginTop: 12,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 999,
    },
    statusOk: {
        backgroundColor: '#DCFCE7',
    },
    statusWarn: {
        backgroundColor: '#FEF9C3',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '700',
    },
    statusTextOk: {
        color: '#166534',
    },
    statusTextWarn: {
        color: '#92400E',
    },
    infoCard: {
        width: '90%',
        alignSelf: 'center',
        backgroundColor: '#F8FAFC',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#0F172A',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },
    infoTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1E3A8A',
        marginBottom: 10,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 6,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#E2E8F0',
    },
    infoLabel: {
        fontSize: 16,
        color: '#475569',
    },
    infoValue: {
        fontSize: 16,
        color: '#0F172A',
        fontWeight: '600',
        textAlign: 'right',
        flexShrink: 1,
        maxWidth: '60%',
    },
    infoEmpty: {
        fontSize: 16,
        color: '#64748B',
    },
    logOutBox: {
        width: '100%',
        marginTop: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,

    },
    logOutText: {
        color: 'white',
        fontWeight: 700,
        fontSize: 18,
    },
    logOutButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DC2626',
        borderRadius: 999,
        shadowColor: '#0F172A',
        shadowOpacity: 0.16,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,

    }
})
