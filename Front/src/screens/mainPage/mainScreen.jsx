import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, ActivityIndicator} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';


const MainScreen =  ({navigation}) => {
  const [userData, setUserData] = useState(null); // 사용자 데이터 상태
  const [loading, setLoading] = useState(true); // 로딩 상태

  const morePromotion= () => {
    navigation.navigate('MorePromotion')
  }

  // 사용자 정보 가져오기 (AsyncStorage에서)
  const fetchUserInfo = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem('UserData');
      if (storedUserData) {
        const userInfo = JSON.parse(storedUserData); // 저장된 JSON 데이터를 객체로 변환
        setUserData(userInfo); // 사용자 정보 상태에 저장
      } else {
        console.log('사용자 정보가 저장되어 있지 않습니다.');
      }
    } catch (error) {
      console.error('사용자 정보를 불러오는 중 오류 발생:', error);
    } finally {
      setLoading(false); // 로딩 완료
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

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text>사용자 정보를 불러오는 데 실패했습니다.</Text>
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
      <View style={styles.banner}>
        <Text style={styles.bannerText}>{userData.userName}</Text>
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
        <TouchableOpacity onPress={morePromotion}><Text style={{color:"#0091da", marginTop:10}}>더 보기</Text></TouchableOpacity></View>

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
