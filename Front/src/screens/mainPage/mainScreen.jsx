import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, ActivityIndicator} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import axios from 'axios';

const MainScreen =  ({navigation}) => {
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [userData, setuserData] = useState(null);
  const [banner, setbanner] = useState(null);
  const morePromotion= () => {
    navigation.navigate('MorePromotion')
  }

  // 사용자 정보 가져오기 (AsyncStorage에서)
  const fetchUserInfo = async () => {
    const token = await AsyncStorage.getItem('jwtToken');
    const storedUserData = await AsyncStorage.getItem('UserData');
    console.log('Token:', token); 
    if (token || storedUserData) {
        try {
            const userInfo = JSON.parse(storedUserData); // 저장된 JSON 데이터를 객체로 변환
            const Id = userInfo.userId
            const response = await axios.get(`http://10.0.2.2:8001/page/home/${Id}`, { //차후 수정 예정 이거 데이터가 안옮겨져서 임시로 1로 함
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(response.data.result.banner)
          setbanner(response.data.result.banner)
          setuserData(response.data.result.myClub.map((entry) => entry.clan)); //응답 결과에서 동아리 정보 분리
        } catch (err) {
            console.error('Failed to fetch user info:', err);
        } finally {
          setLoading(false);
        }
    }
};

  useEffect(() => {
    fetchUserInfo(); // 컴포넌트 렌더링 시 사용자 정보 가져오기
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>로딩 중...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
    <SafeAreaView style={{flex : 1, backgroundColor : 'white'}}>
    <View style={styles.logocontainer}>
    <Image style={styles.logo} source={require('../../logo/GC_LOGO.png')} />
    </View>
  <ScrollView showsVerticalScrollIndicator={false}>
    <View style={styles.container}>
      <Image style={styles.banner} src={`http://10.0.2.2:8001${banner}`}>
      </Image>

      {/* 동아리 표시 블록*/}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>내 동아리</Text>
        <ScrollView horizontal contentContainerStyle={{flexDirection : 'row'}} showsHorizontalScrollIndicator={false}>
          {userData.map((entry, index) => (
          <View key={index} style={{ marginRight: 20 }}>
          <TouchableOpacity style={styles.clubBox}>
            <Image style={styles.clubBox} src={`http://10.0.2.2:8001${entry.clanImg}`}></Image>
          </TouchableOpacity>
          <Text style={{ textAlign: 'center' }}>{entry.clanName}</Text>
        </View>
      ))}
        </ScrollView>
      </View>



      <View style={{height:10, backgroundColor:'#d9d9d9'}}></View>

      <View style={styles.section}>
        <View style={{justifyContent:'space-between', flexDirection:'row'}}>
        <Text style={styles.sectionTitle}>홍보글</Text>
        <TouchableOpacity onPress={morePromotion}><Text style={{color:"#0091da", marginTop:10}}>더 보기</Text></TouchableOpacity></View>

        <ScrollView horizontal contentContainerStyle={{ flexDirection: 'row' }} showsHorizontalScrollIndicator={false}>
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
    borderWidth: 1
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10
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
