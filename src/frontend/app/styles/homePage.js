import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    display: {
      flex: 1,
        alignItems: 'center',
    },
    topBoxContainer: {
        flexDirection: 'column',
        width:'85%',
        height:'25%',
        marginTop:25,
        justifyContent:'flex-start',
        alignItems: 'center',
        borderRadius:20,
        backgroundColor: 'white',
        shadowColor:'#3e3d3d',
        shadowOpacity:0.7,
        shadowRadius:5,
        elevation:5,
        shadowOffset:{width:0, height:4},
    },
    topBoxHeaderContainer: {
        flexDirection: 'row',
        width:'100%',
        height:'30%',
        marginLeft: 40,
        justifyContent:'flex-start',
        alignItems:'center'
    },
    topBoxHeaderText:{
      color:'black',
      fontSize:20,
        marginTop: 10,
        fontWeight:'bold',

    },
    topBoxElementContainer: {
        width:'100%',
        flexDirection:'row',
        height:'40%',
        justifyContent:'space-evenly',
        alignItems:'center',
    },
    topBoxElement: {
        width:'25%',
        height:'100%',
        flexDirection:'column',
        justifyContent:'center',
        gap: 10,
    },
    topBoxElementName: {
        fontSize:14,
        color: 'gray',
    },
    topBoxElementBudget:{
        color:'black',
        fontSize:17,
        fontWeight:'800',
    },
    topBoxElementSpent:{
        color:'red',
        fontSize:17,
        fontWeight:'800',
    },
    topBoxElementRemaining:{
        color:'#11EA09FF',
        fontSize:17,
        fontWeight:'800',
    },
    progressBarBox:{
        width:'80%',
        height:'15%',
        marginTop: 5,
        backgroundColor:'white',
        justifyContent:'center',
        alignItems:'center',
    },
    expenseHeader:{
        width:'85%',
        height:'5%',
        marginTop:30,
        alignItems:'center',
        flexDirection:'row',
        marginBottom:7,
    },
    expenseText:{
        fontSize:20,
        fontWeight:'bold',
        marginLeft:5,

    },
    categoryExpenseBox:{
        width:"85%",
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        height:70,
        backgroundColor:'white',
        borderRadius:15,
        shadowColor:'#3e3d3d',
        opacity: 0.5,
        shadowOpacity:0.5,
        shadowRadius:5,
        elevation:5,
        shadowOffset:{width:0, height:4},
        marginBottom: 10,
    },
    categoryName:{
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
        width:'30%',
        height:'100%',
        marginLeft:20,
    },
    categoryNameText:{
        fontSize:16,
        color:'black',
        opacity: 1.0,
    },
    categoryExpense:{
        flexDirection:'row',
        justifyContent:'flex-end',
        alignItems:'center',
        width:'30%',
        height:'100%',
        marginRight:20,
    },
    categoryExpenseText:{
        fontSize:16,
        color:'red',
    },
    analitikaBox: {
        flexDirection:'row',
        width:'100%',
        height:'5%',
        justifyContent:'flex-start',
        alignItems:"flex-end",
    },
    analitikaText:{
        fontSize:16,
        color:'black',
        fontWeight:'bold',
    },

    grafSpentBox:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        position:'absolute',
        width:'50%',
        height:'50%',

    },
    pieChartBox:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        width:'100%',
        height:'37%',
    },
    grafSpentText:{
        fontSize:30,
        color:'red',
    }


})