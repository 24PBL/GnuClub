import { Text, TouchableOpacity} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';



export default function Notice() {
    return(
        <SafeAreaProvider style={{backgroundColor:'white'}}>
            <SafeAreaView style={{alignItems:'center', justifyContent:'center'}}>
            <Text style={{fontWeight:'bold', fontSize:20, marginLeft:20, marginTop:25, marginBottom:15}}>공지사항</Text>
            <TouchableOpacity style={{borderBottomWidth:1, borderBottomColor:'#d9d9d9', flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingBottom: 15, marginTop:15}}>
                <Text style={{fontSize:18, width:300}}>첫 공지사항 입니다.</Text>
                <Text style={{fontSize:12, color:'gray'}}>2024-11-24</Text> 
            </TouchableOpacity>
            <TouchableOpacity style={{borderBottomWidth:1, borderBottomColor:'#d9d9d9', flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingBottom: 15, marginTop:15}}>
                <Text style={{fontSize:18, width:300}}>이건 그냥 코드에서 적어요..</Text>
                <Text style={{fontSize:12, color:'gray'}}>2024-11-24</Text> 
            </TouchableOpacity>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}
