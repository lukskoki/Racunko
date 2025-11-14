import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    display:{
        flex: 1,
        justifyContent:'space-between',
        alignItems:'flex-start',
        flexDirection:'column',
    },

    profileHeaderBox:{
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        width:'100%',
        height:'25%',
        gap:25,

    },
    line:{
      width:'90%',
      height:'2%',
        backgroundColor:'#2563EB',
    },
    profileImage:{
        width:'15%',
        height:'100%',

    },
    profileHeader:{
        flexDirection:'row',
        width:'90%',
        height:'30%',
        justifyContent:'flex-start',
        alignItems:'center',
        gap:10,
    },
    profileHeaderText:{
          fontSize:50,
        color:'#2563EB',
    },
    logOutBox:{
        width:'100%',
        height:'17%',
        justifyContent:'center',
        alignItems:'center',

    },
    logOutText:{
        color:'white',
        fontWeight:800,
        fontSize:30,
    },
    logOutButton:{
        paddingVertical: 20,
        paddingHorizontal: 30,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#2563EB',
        borderRadius:30,

    }
})