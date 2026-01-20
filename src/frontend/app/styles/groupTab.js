import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    // === Existing NoGroupView styles ===
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

    // === Loading styles ===
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    loadingText: {
        textAlign: 'center',
        marginTop: 10,
        color: '#64748B',
        fontSize: 16,
    },
    errorText: {
        color: '#EF4444',
        fontSize: 16,
        textAlign: 'center',
    },

    // === GroupView container styles ===
    groupContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 24,
    },

    // === Header styles ===
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        backgroundColor: '#FFFFFF',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1E293B',
    },
    hamburgerButton: {
        padding: 5,
        alignSelf: 'center',
    },

    // === Budget card styles ===
    budgetCard: {
        margin: 16,
        padding: 20,
        backgroundColor: '#2563EB',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    budgetLabel: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 4,
    },
    budgetAmount: {
        fontSize: 32,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    budgetEditButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        padding: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        paddingHorizontal: 12,
        width: '100%',
    },
    currencyPrefix: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1E293B',
        marginRight: 4,
    },
    budgetInput: {
        flex: 1,
        fontSize: 18,
        padding: 12,
        color: '#1E293B',
    },

    // === Member list styles ===
    memberListContainer: {
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1E293B',
        marginBottom: 12,
    },
    emptyText: {
        textAlign: 'center',
        color: '#94A3B8',
        fontSize: 14,
        paddingVertical: 20,
    },

    // === Member card styles ===
    memberItem: {
        flexDirection: 'column',
        padding: 16,
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        marginBottom: 8,
    },
    currentUserItem: {
        backgroundColor: '#EFF6FF',
        borderWidth: 1,
        borderColor: '#2563EB',
    },
    memberInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#2563EB',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        flexWrap: 'wrap',
    },
    memberName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1E293B',
        marginRight: 8,
    },
    roleBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: '#FEF3C7',
        borderRadius: 6,
    },
    roleBadgeOwner: {
        backgroundColor: '#DBEAFE',
    },
    roleBadgeCoOwner: {
        backgroundColor: '#DCFCE7',
    },
    roleBadgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#92400E',
    },
    roleBadgeTextOwner: {
        color: '#1D4ED8',
    },
    roleBadgeTextCoOwner: {
        color: '#166534',
    },
    memberMenuButton: {
        padding: 8,
        marginLeft: 'auto',
    },

    // === Allowance display ===
    allowanceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
    },
    allowanceLabel: {
        fontSize: 14,
        color: '#64748B',
    },
    allowanceValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1E293B',
    },

    // === Menu modal styles ===
    menuModal: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    menuContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 24,
        paddingTop: 12,
        paddingBottom: 32,
    },
    menuHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#E2E8F0',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 16,
    },
    menuTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 20,
    },
    groupCodeSection: {
        marginBottom: 20,
    },
    groupCodeLabel: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 8,
    },
    groupCodeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
    },
    groupCode: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1E293B',
        letterSpacing: 4,
    },
    copyButton: {
        padding: 8,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
    },
    menuItemText: {
        fontSize: 16,
        marginLeft: 12,
        color: '#1E293B',
    },
    menuItemDanger: {
        color: '#EF4444',
    },
    closeMenuItem: {
        marginTop: 16,
        paddingVertical: 16,
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
        alignItems: 'center',
    },
    closeMenuItemText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#64748B',
    },

    // === Spending progress bar styles ===
    spendingContainer: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
    },
    spendingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    spendingLabel: {
        fontSize: 13,
        color: '#64748B',
    },
    spendingValue: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1E293B',
    },
    spendingValueOver: {
        color: '#EF4444',
    },
    progressBarContainer: {
        height: 8,
        backgroundColor: '#E2E8F0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        borderRadius: 4,
    },
    progressBarNormal: {
        backgroundColor: '#22C55E',
    },
    progressBarOver: {
        backgroundColor: '#EF4444',
    },

    // === Member detail modal styles ===
    detailModalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 24,
        paddingTop: 12,
        paddingBottom: 32,
        maxHeight: '80%',
    },
    detailSummary: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 16,
        marginBottom: 16,
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
    },
    detailSummaryItem: {
        alignItems: 'center',
    },
    detailSummaryLabel: {
        fontSize: 13,
        color: '#64748B',
        marginBottom: 4,
    },
    detailSummaryValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1E293B',
    },
    detailLoading: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    transactionList: {
        maxHeight: 300,
    },
    transactionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    transactionLeft: {
        flex: 1,
    },
    transactionCategory: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1E293B',
    },
    transactionDate: {
        fontSize: 13,
        color: '#64748B',
        marginTop: 2,
    },
    transactionNote: {
        fontSize: 12,
        color: '#94A3B8',
        marginTop: 4,
        fontStyle: 'italic',
    },
    transactionAmount: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1E293B',
    },
    roleSection: {
        marginBottom: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    roleSectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 12,
    },
    roleToggleButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        padding: 16,
        borderRadius: 8,
        marginBottom: 8,
    },
    roleToggleLeft: {
        flex: 1,
    },
    roleToggleLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 4,
    },
    roleToggleValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2563EB',
    },
    roleToggleArrow: {
        fontSize: 20,
        color: '#2563EB',
    },
    roleDescription: {
        fontSize: 12,
        color: '#6B7280',
        fontStyle: 'italic',
    },
    limitSection: {
        marginBottom: 20,
    },
    limitSectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 12,
    },
})
