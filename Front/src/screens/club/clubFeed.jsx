import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, ActivityIndicator} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect, } from 'react';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';

export default function ClubFeed() {

  const [clubData, setclubData] = useState([]);
  const [clubPost, setclubPost] = useState([]);
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [id, setid] = useState('')
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const fetchUserInfo = async () => {
    const token = await AsyncStorage.getItem('jwtToken');
    const storedUserData = await AsyncStorage.getItem('UserData');
    if (token || storedUserData) {
        try {
            const userInfo = JSON.parse(storedUserData); // 저장된 JSON 데이터를 객체로 변환
            const Id = userInfo.userId
            setid(Id)
            const response = await axios.get(`http://10.0.2.2:8001/page/feed/${Id}`, { 
                headers: { Authorization: `Bearer ${token}` },
            });
            setclubData(response.data.myClub)
            setclubPost(response.data.result)
        } catch (err) {
            console.error('Failed to fetch user info:', err);
        } finally {
          setLoading(false);
        }
    }
};


const moreInfo = async () => {
  const lastPost = clubPost[clubPost.length - 1]; // 마지막 요소
const lastPostTime = lastPost ? new Date(lastPost.createAt).toISOString().split('T')[0] : null; // 작성시간 추출
  const token = await AsyncStorage.getItem('jwtToken');
  if (token) {
      try {
          const response = await axios.get(`http://10.0.2.2:8001/page/feed/${id}?lastTimestamp=${lastPostTime}`, { 
              headers: { Authorization: `Bearer ${token}` },
          });
          setclubPost(response.data.result)
      } catch (err) {
          console.error('Failed to fetch user info:', err);
      } finally {
        setLoading(false);
      }
  }
};

const handleScroll = (event) => {
  const { contentSize, contentOffset, layoutMeasurement } = event.nativeEvent;

  if (contentOffset.y + layoutMeasurement.height >= contentSize.height - 20) {
    console.log('스크롤 끝에 도달');
    moreInfo();
  }
};



useEffect(() => {
  // 클럽 데이터를 가져오는 비동기 작업
  const fetchImages = async () => {
    const images = clubPost
      .filter((post) => post.postimgs && post.postimgs.length > 0)
      .map((post) => post.postimgs[0].img);

    for (const img of images) {
      console.log(img); // 이미지 URL 출력 (필요시 이미지 가져오기 로직 추가)
    }
  };

  if (clubPost.length > 0) {
    fetchImages(); // clubPost가 변경될 때만 실행
  }
}, [clubPost]);


useEffect(() => {
  if (isFocused) {
    fetchUserInfo(); // 화면 활성화 시 데이터 가져오기
  }
}, [isFocused]); // isFocused가 변경될 때 실행



useEffect(() => {
  fetchUserInfo(); // 컴포넌트가 렌더링될 때 사용자 정보 가져오기
}, [clubPost]);

    return(
    <SafeAreaView style={{flex:1, backgroundColor:'white'}}>

<ScrollView
  showsVerticalScrollIndicator={false}
  onScroll={handleScroll}
  scrollEventThrottle={16}
  nestedScrollEnabled={false}
  keyboardShouldPersistTaps="handled"
>
      <View>
        <View style={styles.section}>
        <Text style={styles.sectionTitle}>동아리</Text>

    
        <ScrollView style={styles.clubContainer} horizontal contentContainerStyle={{ flexDirection: 'row' }} showsHorizontalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', marginVertical: 10 }}>
          {clubData.map((club, index) => (
            <View key={index} style={{ marginRight: 20 }}>
              <TouchableOpacity style={styles.clubBox}
               onPress={() => navigation.navigate('ClubDetail', { clanId : club.clan.clanId,
                userId : id       
          })}
              >
                <Image 
                  source={{ uri: `http://10.0.2.2:8001${club.clan.clanImg}` }} 
                  style={styles.clubBox}
                />
              </TouchableOpacity>
              <Text style={{ textAlign: 'center' }}>{club.clan.clanName}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      </View>
        </View>

      <View>
        
      <View style={{ height: 10, backgroundColor: '#d9d9d9' }}></View>

      <View>
      {clubPost.map((post, index) => (
        <TouchableOpacity key={index} onPress={() => navigation.navigate('Board', { clanId : post.clan.clanId,
          userId : id, postId : post.postId        
})}>

    

          {/* 동아리 이름 및 이미지 */}
          <View style={{ flexDirection: 'row' }}>
            <Image
              style={styles.FeedImgBox}
              source={{ uri: `http://10.0.2.2:8001${post.clan.clanImg}` }}
            />
            <Text style={styles.ClubName}>{post.clan.clanName}</Text>
          </View>

          {/* 포스트 내용 */}
          <View style={styles.PostBox}>
            <Text style={styles.ClubPostTitle}>{post.postHead}</Text>
            <Text style={styles.PostDate}>
              {new Date(post.createAt).toISOString().split('T')[0]}
            </Text>

            {/* 포스트 이미지 (존재하는 경우에만 렌더링) */}
            {post.postimgs && post.postimgs.length > 0 && post.postimgs[0] && post.postimgs[0].img && (
              <Image
                style={styles.PostImg}
                source={{ uri: `http://10.0.2.2:8001${post.postimgs[0].img}` }}
              />
            )}
            <Text style={styles.Post}>{post.postBody}</Text>
          </View>
          <View style={{ height: 10, backgroundColor: '#d9d9d9' }}></View>
        </TouchableOpacity>
      ))}
    </View>
      </View>

      
      </ScrollView>
    </SafeAreaView>
    )
}

const styles = StyleSheet.create ({
    clubBox:{
        width:70, 
        height:70, 
        borderRadius:10, 
        backgroundColor:'#d9d9d9',
        borderWidth : 0.5
    },section: {
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
      FeedImgBox:{
        width:70, 
        height:70, 
        borderRadius:10, 
        backgroundColor:'#d9d9d9',
        marginLeft : 25,
        marginTop : 10,
        marginBottom : 15,
        borderWidth : 0.5
      },
      ClubName:{
        marginTop:35,
        marginLeft:10,
        fontWeight:'bold'
      },
      ClubPostTitle:{
        fontWeight:'bold',
        fontSize:25,
        marginLeft:25
      },
      PostDate:{
        marginLeft:25,
        marginTop:5,
        opacity:0.3,
        fontSize:15
      },
      Post:{
        marginLeft : 25,
        marginTop : 20,
        fontSize : 19
      },
      PostBox:{
        width:'95%',
        height:400
      },
      PostImg:{
        width:300,
        height: 200,
        marginLeft: 25,
        borderRadius :10
      }
})