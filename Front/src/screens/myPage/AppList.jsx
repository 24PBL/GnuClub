import { Text, ScrollView, View, Image} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';



export default function AppList() {
    return(
        <SafeAreaProvider>
            <SafeAreaView style={{flex:1, backgroundColor:'white'}}>
            <Text style={{fontWeight:'bold', fontSize:20, marginLeft:20, marginTop:25, marginBottom:30}}>신청내역확인</Text>
                <ScrollView contentContainerStyle={{justifyContent: 'center',alignItems: 'center'}}>
                    <View style={{width:354, height:100, flexDirection:'row', alignItems:'center',  marginBottom:25}}>
                        <Image source={require('../../logo/GC_LOGO.png')} style={{width:100, height:100, borderRadius:10, borderWidth:1, borderColor:'#d9d9d9'}}></Image>
                        <Text style={{textAlign:'center', flex:1, fontSize:15}}>동아리이름{"\n"}결과 : 보류중</Text>
                    </View>
                    <View style={{width:354, height:100, flexDirection:'row', alignItems:'center',  marginBottom:25}}>
                        <Image source={require('../../logo/GC_LOGO.png')} style={{width:100, height:100, borderRadius:10, borderWidth:1, borderColor:'#d9d9d9'}}></Image>
                        <Text style={{textAlign:'center', flex:1, fontSize:15}}>동아리이름{"\n"}결과 : 보류중</Text>
                    </View>
                    <View style={{width:354, height:100, flexDirection:'row', alignItems:'center',  marginBottom:25}}>
                        <Image source={require('../../logo/GC_LOGO.png')} style={{width:100, height:100, borderRadius:10, borderWidth:1, borderColor:'#d9d9d9'}}></Image>
                        <Text style={{textAlign:'center', flex:1, fontSize:15}}>동아리이름{"\n"}결과 : 보류중</Text>
                    </View>
                    <View style={{width:354, height:100, flexDirection:'row', alignItems:'center',  marginBottom:25}}>
                        <Image source={require('../../logo/GC_LOGO.png')} style={{width:100, height:100, borderRadius:10, borderWidth:1, borderColor:'#d9d9d9'}}></Image>
                        <Text style={{textAlign:'center', flex:1, fontSize:15}}>동아리이름{"\n"}결과 : 보류중</Text>
                    </View>
                    <View style={{width:354, height:100, flexDirection:'row', alignItems:'center',  marginBottom:25}}>
                        <Image source={require('../../logo/GC_LOGO.png')} style={{width:100, height:100, borderRadius:10, borderWidth:1, borderColor:'#d9d9d9'}}></Image>
                        <Text style={{textAlign:'center', flex:1, fontSize:15}}>동아리이름{"\n"}결과 : 보류중</Text>
                    </View>
                    <View style={{width:354, height:100, flexDirection:'row', alignItems:'center',  marginBottom:25}}>
                        <Image source={require('../../logo/GC_LOGO.png')} style={{width:100, height:100, borderRadius:10, borderWidth:1, borderColor:'#d9d9d9'}}></Image>
                        <Text style={{textAlign:'center', flex:1, fontSize:15}}>동아리이름{"\n"}결과 : 보류중</Text>
                    </View>
                    <View style={{width:354, height:100, flexDirection:'row', alignItems:'center',  marginBottom:25}}>
                        <Image source={require('../../logo/GC_LOGO.png')} style={{width:100, height:100, borderRadius:10, borderWidth:1, borderColor:'#d9d9d9'}}></Image>
                        <Text style={{textAlign:'center', flex:1, fontSize:15}}>동아리이름{"\n"}결과 : 보류중</Text>
                    </View>
                    <View style={{width:354, height:100, flexDirection:'row', alignItems:'center',  marginBottom:25}}>
                        <Image source={require('../../logo/GC_LOGO.png')} style={{width:100, height:100, borderRadius:10, borderWidth:1, borderColor:'#d9d9d9'}}></Image>
                        <Text style={{textAlign:'center', flex:1, fontSize:15}}>동아리이름{"\n"}결과 : 보류중</Text>
                    </View>
                    <View style={{width:354, height:100, flexDirection:'row', alignItems:'center',  marginBottom:25}}>
                        <Image source={require('../../logo/GC_LOGO.png')} style={{width:100, height:100, borderRadius:10, borderWidth:1, borderColor:'#d9d9d9'}}></Image>
                        <Text style={{textAlign:'center', flex:1, fontSize:15}}>동아리이름{"\n"}결과 : 보류중</Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}
