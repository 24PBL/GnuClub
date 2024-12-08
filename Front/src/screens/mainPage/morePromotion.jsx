import React, {useEffect, useState} from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, styled} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';


export default function MorePromotion() {
    const [ad, setad] = useState('');
    const isFocused = useIsFocused();
    const [id, setid] = useState('');
    const navigation = useNavigation();


    const sections = {
        1: "공연 분과",
        2: "봉사 분과",
        3: "문화 분과",
        4: "체육 분과",
        5: "학술 분과",
        6: "종교 분과"
      };
    
      useEffect(() => {
        if (isFocused) {
          fetchAdInfo(); // 화면 활성화 시 데이터 가져오기
        }
      }, [isFocused]); // isFocused가 변경될 때 실행


    const fetchAdInfo = async () => {
        const token = await AsyncStorage.getItem('jwtToken');
        const storedUserData = await AsyncStorage.getItem('UserData');
        if (token || storedUserData) {
            try {
                const userInfo = JSON.parse(storedUserData); // 저장된 JSON 데이터를 객체로 변환
                const Id = userInfo.userId
                const response = await axios.get(`http://10.0.2.2:8001/page/home/${Id}/more-club-ad`, { //차후 수정 예정 이거 데이터가 안옮겨져서 임시로 1로 함
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log(JSON.stringify(response.data.result, null, 2))
                setid(Id)
                setad(response.data.result)
            } catch (err) {
                console.error('Failed to fetch user info:', err);
            } finally {
              setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchAdInfo(); // 컴포넌트가 렌더링될 때 사용자 정보 가져오기
      }, []);


    return (
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
      <ScrollView style={{ paddingBottom: 20 }}showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
        <Text style={{ fontSize: 25, fontWeight: 'bold', marginLeft: 13, marginTop: 40 }}>
          홍보글 모두보기
        </Text>

        {Object.keys(sections).map((key) => {
          const sectionName = sections[key];
          const posts = ad[key] || []; // 해당 분과 데이터 가져오기
          return (
            <View key={key} style={{ marginTop: 15 }}>
              <View style={{ justifyContent: 'space-between', flexDirection: 'row', height: 70, marginBottom: 10 }}>
                <Text style={styles.clubLabel}>{sectionName}</Text>
              </View>

              {posts.length > 0 ? (
  <View
    flexDirection={'row'}
    style={{ flexWrap: 'wrap', justifyContent: 'flex-start', marginLeft: 13 }}
  >
    {/* 글 박스 */}
    {posts.map((post, index) => (
      <TouchableOpacity key={post.noticeId} style={styles.clubBox} onPress={() => 
        navigation.navigate('ClubNotice', { clanId : post.clanId,
        userId : id, noticeId : post.noticeId        
  })}
  >
        <Image
          style={styles.ImgBox}
          source={{ uri: `http://10.0.2.2:8001${post.noticeimgs[0]?.img}` }}
        />
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.PostTitle}>
          {post.postHead}
        </Text>
      </TouchableOpacity>
    ))}
    {/* 빈 칸 추가 */}
    {Array.from({ length: 3 - posts.length }).map((_, idx) => (
      <View key={`empty-${idx}`} style={styles.emptyBox} />
    ))}
  </View>
) : (
  <Text style={{ marginLeft: 16, color: 'gray', fontSize: 16 }}>존재하지 않습니다</Text>
)}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    clubLabel :{
        fontSize : 25,
        fontWeight : 'bold',
        marginTop:25,
        marginLeft : 16,
    },
    ImgBox:{
        width:100,
        height:100,
        borderRadius:10,
        backgroundColor:'#d9d9d9',
    },
    PostTitle:{ 
        width:95,
        marginLeft:5,
        fontWeight:'bold'

    },
    clubBox:{
        marginLeft:13,
        justifyContent:'center',
        width:100,
        marginRight:13,
        marginBottom:20
    },
    emptyBox: {
        width: 100,
        height: 130,
        marginBottom: 10,
        marginRight: 10,
        backgroundColor: 'transparent', // 빈 칸은 보이지 않음
      },
      
})