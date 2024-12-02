import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Badge } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';


const MainScreen = () => {


  return (
    <SafeAreaProvider>
    <SafeAreaView style={{flex : 1, backgroundColor : 'white'}}>
    <View style={styles.logocontainer}>
    <Image style={styles.logo} source={require('../../logo/GC_LOGO.png')} />
      <View style={{ position: 'relative', alignItems: 'center', marginLeft: 'auto', marginRight : 10, marginTop:5}}>
        <Ionicons name="notifications-outline" style={{ fontSize: 35, marginTop : 10 }} />
        <Badge 
            value="1" 
            status="error" 
            containerStyle={{ position: 'absolute', top: 5, right: -2 }}
        />
      </View>
    </View>
      <ScrollView showsVerticalScrollIndicator={false}>
    <View style={styles.container}>
      <View style={styles.banner}>
        <Text style={styles.bannerText}>userData.user</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>내 동아리</Text>
        <ScrollView style={styles.clubContainer} horizontal contentContainerStyle={{ flexDirection: 'row' }} showsHorizontalScrollIndicator={false}>
          <View style={{marginRight:20}}>
          <TouchableOpacity style={styles.clubBox}>
          </TouchableOpacity>
          <Text style={{textAlign:'center'}}>동아리명</Text>
          </View>
          
          <View style={{marginRight:20}}>
          <TouchableOpacity style={styles.clubBox}>
          </TouchableOpacity>
          <Text style={{textAlign:'center'}}>동아리명</Text>
          </View>
          <View style={{marginRight:20}}>
          <TouchableOpacity style={styles.clubBox}>
          </TouchableOpacity>
          <Text style={{textAlign:'center'}}>동아리명</Text>
          </View>
          <View style={{marginRight:20}}>
          <TouchableOpacity style={styles.clubBox}>
          </TouchableOpacity>
          <Text style={{textAlign:'center'}}>동아리명</Text>
          </View>
        </ScrollView>
      </View>

      <View style={{height:10, backgroundColor:'#d9d9d9'}}></View>

      <View style={styles.section}>
        <View style={{justifyContent:'space-between', flexDirection:'row'}}>
        <Text style={styles.sectionTitle}>홍보글</Text>
        <TouchableOpacity><Text style={{color:"#0091da", marginTop:10}}>더 보기</Text></TouchableOpacity></View>

        <ScrollView style={styles.clubContainer} horizontal contentContainerStyle={{ flexDirection: 'row' }} showsHorizontalScrollIndicator={false}>
          <View style={{marginRight:20}}>
          <TouchableOpacity style={styles.clubBox}>
          </TouchableOpacity>
          <Text style={{textAlign:'center'}}>홍보글 제목</Text>
          </View>
          
          <View style={{marginRight:20}}>
          <TouchableOpacity style={styles.clubBox}>
          </TouchableOpacity>
          <Text style={{textAlign:'center'}}>홍보글 제목</Text>
          </View>

          <View style={{marginRight:20}}>
          <TouchableOpacity style={styles.clubBox}>
          </TouchableOpacity>
          <Text style={{textAlign:'center'}}>홍보글 제목</Text>
          </View>

          <View style={{marginRight:20}}>
          <TouchableOpacity style={styles.clubBox}>
          </TouchableOpacity>
          <Text style={{textAlign:'center'}}>홍보글 제목</Text>
          </View>
        </ScrollView>
        </View>

      <View style={styles.section}>
      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
        <Text style={styles.sectionTitle}>동아리 이모저모</Text>
        <TouchableOpacity><Text style={{color:"#0091da", marginLeft:-40, marginTop:10}}>더 보기</Text></TouchableOpacity>
        </View>

        <TouchableOpacity style={{justifyContent:'center', alignItems:'center', marginTop:12, marginBottom:10}}>
          <Image style={styles.clubPhoto}></Image>
        </TouchableOpacity>

        <TouchableOpacity style={{justifyContent:'center', alignItems:'center', marginTop:12, marginBottom:10}}>
          <Image style={styles.clubPhoto}></Image>
        </TouchableOpacity>

        <TouchableOpacity style={{justifyContent:'center', alignItems:'center', marginTop:12, marginBottom:10}}>
          <Image style={styles.clubPhoto}></Image>
        </TouchableOpacity>

        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  logo :{
    width : 70,
    height : 70
  },
  logocontainer : {
    flexDirection : 'row'
  },
  container: {
    backgroundColor: '#fff',
    height : '91%'
  },
  banner: {
    height: 150,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10
  },
  clubContainer: {
    flexDirection: 'row'
  },
  promoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoImage: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  clubBox:{
    width:80, 
    height:80, 
    borderRadius:10, 
    backgroundColor:'#d9d9d9'
  },
  clubPhoto:{
    width : 300,
    height : 120,
    borderRadius : 10,
    backgroundColor : '#d9d9d9'
  }

});

export default MainScreen;
