import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect} from 'react';
import axios from 'axios';

export default function ClubFeed() {

  const [clubData, setclubData] = useState([]);
  const [clubPost, setclubPost] = useState([]);
  const [loading, setLoading] = useState(true); // 로딩 상태

  const fetchUserInfo = async () => {
    const token = await AsyncStorage.getItem('jwtToken');
    const storedUserData = await AsyncStorage.getItem('UserData');
    if (token || storedUserData) {
        try {
            const userInfo = JSON.parse(storedUserData); // 저장된 JSON 데이터를 객체로 변환
            const Id = userInfo.userId
            const response = await axios.get(`http://10.0.2.2:8001/page/feed/${Id}`, { 
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log('내 동아리 정보:', response.data.result[0])
            setclubData(response.data.myClub)
            setclubPost(response.data.result)
        } catch (err) {
            console.error('Failed to fetch user info:', err);
        } finally {
          setLoading(false);
        }
    }
};
useEffect(() => {
  // postimgs 배열이 존재하고, Img 속성이 있다면 GET 요청을 보냄
  clubPost.forEach((post) => {
    if (post.postimgs && post.postimgs.length > 0 && post.postimgs[0].Img) {
      fetchImageData(post.postimgs[0].img); // 이미지 URL을 통해 GET 요청
      console.log(post.postimgs[0].img)
    }
  });
}, []);



useEffect(() => {
  fetchUserInfo(); // 컴포넌트가 렌더링될 때 사용자 정보 가져오기
}, []);

    return(
    <SafeAreaView style={{flex:1, backgroundColor:'white'}}>
         <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
        <Text style={styles.sectionTitle}>동아리</Text>
        <ScrollView style={styles.clubContainer} horizontal contentContainerStyle={{ flexDirection: 'row' }} showsHorizontalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', marginVertical: 10 }}>
          {clubData.map((club, index) => (
            <View key={index} style={{ marginRight: 20 }}>
              <TouchableOpacity style={styles.clubBox}>
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

      <View>


      <View>
      {clubPost.map((post, index) => (
        <TouchableOpacity key={index}>
          {/* 구분선 */}
          <View style={{ height: 10, backgroundColor: '#d9d9d9' }}></View>

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
        backgroundColor:'#d9d9d9'
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
        marginBottom : 15
      },
      ClubName:{
        marginTop:35,
        marginLeft:10
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