import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    display:{
        flex:1,
        flexDirection:'column',
        justifyContent:'flex-start',
        width:'100%',
        height:'100%',
        backgroundColor:'white',
    },
    container: {
        width:'100%',
        height:'27%',
        flexDirection:'row',
        backgroundColor: '#2563EB',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop:85,

    },
    mainHeader:{
      fontSize:50,
      color:'#FFFFFF',
        fontWeight:'800',
    },

    landingPageImgBox: {
        marginTop:-42,
        position:'fixed',
        borderTopRightRadius:50,
        borderTopLeftRadius:50,
        shadowColor:'#3e3d3d',
        shadowOpacity:0.7,
        shadowRadius:2,
        elevation: 15,
        shadowOffset:{width:0, height:-4},
        backgroundColor:'white',
        width: '100%',
        height:'40%',
    },

    textBox: {
        width: '100%',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        height:'15%',
        backgroundColor:'white',
        padding: 10,
    },

    text:{
        color:'black',
        fontSize:35,
        fontWeight:'400',
    },

    buttonBox:{
      width:'100%',
      height:'20%',
        flexDirection:'row',
      justifyContent:'center',
      alignItems:'center',
      gap:15,
    backgroundColor:'white',
    },

    prijava:{
        width:'42%',
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
        height:'35%',
        backgroundColor:'#3F6CF4',
        borderRadius: 20,
    },

    registracija:{
        width:'42%',
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
        height:'35%',
        opacity:0.54,
        backgroundColor:'#2563EB',
        borderRadius: 20,
    },
    text1:{
        color:'white',
        fontSize:20,
    }
})