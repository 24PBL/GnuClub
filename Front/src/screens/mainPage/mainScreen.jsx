import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, ActivityIndicator} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import axios from 'axios';

const MainScreen =  ({navigation}) => {
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [userData, setuserData] = useState(null);
  const [banner, setbanner] = useState(null);
  const [PostImg, setPostImg] = useState(null);
  const [NoticeImg, setNoticeImg] = useState(null);
  const [userId, setuserId] = useState(null);
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
            setuserId(Id)
            const response = await axios.get(`http://10.0.2.2:8001/page/home/${Id}`, { //차후 수정 예정 이거 데이터가 안옮겨져서 임시로 1로 함
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(JSON.stringify(response.data.result, null, 2))
          setbanner(response.data.result.banner)
          setuserData(response.data.result.myClub.map((entry) => entry.clan)); //응답 결과에서 동아리 정보 분리
          setPostImg(response.data.result.randomClubAnything)
          setNoticeImg(response.data.result.randomClubAd)
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
        <Text style={{fontWeight:'bold', fontSize:30}}>로딩 중...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{flex : 1, backgroundColor : 'white'}}>
    <View style={styles.logocontainer}>
    <Image style={styles.logo} source={require('../../logo/GC_LOGO.png')} />
    </View>
  <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
    <View style={styles.container}>
      <View style={{borderTopWidth : 0.6, borderBottomWidth : 0.5, borderColor:'#0091da'}}>
      <Image style={styles.banner} src={`http://10.0.2.2:8001${banner}?v=${new Date().getTime()}`}>
      </Image></View>

      {/* 동아리 표시 블록*/}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>내 동아리</Text>
        <ScrollView horizontal contentContainerStyle={{flexDirection : 'row'}} showsHorizontalScrollIndicator={false}>

          {userData.map((entry, index) => (
          <View key={index} style={{ marginRight: 20 }}>
          <TouchableOpacity style={styles.clubBox} onPress={() => navigation.navigate('ClubDetail', { clanId : entry.clanId,
                                                                                                      userId : userId        
          })}>
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

        <ScrollView 
      horizontal 
      contentContainerStyle={{ flexDirection: 'row' }} 
      showsHorizontalScrollIndicator={false}
    >
      {NoticeImg.map((post) => {
        const imageUri = post.noticeimgs.length > 0 ? post.noticeimgs[0].img : 'https://default-image-url.com'; // 이미지가 있을 경우 첫 번째 이미지, 없으면 기본 이미지
        console.log(imageUri)
        return (
          <View key={post.noticeId} style={{ marginRight: 20}}>
            <TouchableOpacity>
              <Image
                source={{ uri: `http://10.0.2.2:8001${imageUri}` }}
                style={styles.clubBox}
              />
            </TouchableOpacity>
            <Text style={{ textAlign: 'center'}}>
              {post.postHead.length > 6
                ? post.postHead.slice(0, 6) + '...'
                : post.postHead}
            </Text>
          </View>
        );
      })}
    </ScrollView>
        </View>

      <View style={styles.section}>
      <View style={{justifyContent:'space-between', flexDirection:'row'}}>
        <Text style={styles.sectionTitle}>동아리 이모저모</Text>
        <TouchableOpacity><Text style={{color:"#0091da", marginLeft:-40, marginTop:10}}>더 보기</Text></TouchableOpacity>
        </View>

       <View>
  {PostImg.map((post) => {
    // postimgs 배열에 이미지가 없으면 해당 요소를 렌더링하지 않음
    if (!post.postimgs || post.postimgs.length === 0) {
      return null; // 이미지를 렌더링하지 않음
    }

    return (
      <View key={post.postId} style={{ marginBottom: 20 }}>
        <Text style={{ fontWeight: 'bold', marginLeft: 40 }}>{post.postHead}</Text>
        {post.postimgs.map((img, imgIndex) => {
          const imgUri = img.img; // img.img 속성에 접근
          return (
            <TouchableOpacity
              key={imgIndex}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 12,
                marginBottom: 10,
              }}
            >
              <Image
                style={styles.clubPhoto}
                source={{ uri: `http://10.0.2.2:8001${imgUri}` || 'https://default-image-url.com' }} // 기본 이미지 URL 처리
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  })}
</View>

        </View>
      </View>
    </ScrollView>
    </SafeAreaView>
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
    justifyContent: 'center',
    alignItems: 'center',
    borderColor : 'Red',
    borderTopWidth : 1

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
    borderWidth : 0.5
  },
  clubPhoto:{
    width : 300,
    height : 120,
    borderRadius : 10,
    backgroundColor : '#d9d9d9'
  },

});

export default MainScreen;
