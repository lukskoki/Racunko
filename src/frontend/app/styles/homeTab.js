import {StyleSheet} from 'react-native';


export default StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 0,
    },
    container: {
        flex: 1,
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    monthSelector: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        paddingVertical: 12,
    },
    monthArrow: {
        padding: 12,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    monthArrowText: {
        fontSize: 24,
        color: '#3B82F6',
        fontWeight: '600',
    },
    monthText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        marginHorizontal: 24,
        minWidth: 180,
        textAlign: 'center',
    },
    header: {
        marginBottom: 24,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 8,
    },
    headerAmount: {
        fontSize: 48,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4,
    },
    headerBudget: {
        fontSize: 16,
        color: '#6B7280',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    cardTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 16,
    },
    chartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        height: 200,
        paddingVertical: 16,
    },
    chartBar: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginHorizontal: 4,
    },
    chartBarWrapper: {
        width: '100%',
        height: 140,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    chartBarFill: {
        width: '80%',
        backgroundColor: '#3B82F6',
        borderRadius: 4,
        minHeight: 4,
    },
    chartAmount: {
        fontSize: 10,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
    },
    chartDate: {
        fontSize: 10,
        color: '#6B7280',
        marginTop: 8,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    statBox: {
        flex: 1,
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 4,
    },
    statValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    statValueNegative: {
        color: '#EF4444',
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 16,
    },
    progressSection: {
        marginTop: 16,
    },
    progressBar: {
        height: 8,
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#3B82F6',
        borderRadius: 4,
    },
    progressFillOver: {
        backgroundColor: '#EF4444',
    },
    progressText: {
        fontSize: 12,
        color: '#6B7280',
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 12,
    },
    categoryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    categoryLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    categoryDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#3B82F6',
        marginRight: 12,
    },
    categoryDot2: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#3B82F6',
        marginTop: 7,
    },
    categoryName: {
        fontSize: 15,
        color: '#374151',
    },
    categoryAmount: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    summaryLabel: {
        fontSize: 14,
        color: '#6B7280',
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#6B7280',
    },
    errorText: {
        fontSize: 16,
        color: '#EF4444',
        textAlign: 'center',
    },
    emptyText: {
        fontSize: 14,
        color: '#9CA3AF',
        fontStyle: 'italic',
    },
    plusContainer: {
        flexDirection: 'row',
        width: '100%',
        height: 70,
        backgroundColor: '#FFFFFF',
        justifyContent: 'space-between',
        alignItems: 'center',

    },
    plusButton: {
        width: '10%',
        height: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        shadowColor: '#323232',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
        borderRadius: 4,
        marginBottom: 16,
    },
    plus: {
        color: '#3B82F6',
        fontSize: 20,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    categoryBottomSheet: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingBottom: 20,
        maxHeight: '70%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
    },

    modalHeader: {
        alignItems: 'center',
        paddingTop: 12,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    modalHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#CBD5E1',
        borderRadius: 2,
        marginBottom: 12,
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1E293B',
    },
    categoriesScrollView: {
        paddingHorizontal: 20,
        paddingTop: 8,
    },

    categoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 65,
        gap: 12,
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 8,
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    categoryItemSelected: {
        backgroundColor: '#EFF6FF',
        borderColor: '#2563EB',
    },

    categoryItemText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        color: '#1E293B',
    },
    categoryItemTextSelected: {
        color: '#2563EB',
        fontWeight: '600',
    },

    card1: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

});