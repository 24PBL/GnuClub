import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect} from 'react';
import axios from 'axios';

export default function ClubFeed() {
  const fetchUserInfo = async () => {
    const token = await AsyncStorage.getItem('jwtToken');
    const storedUserData = await AsyncStorage.getItem('UserData');
    console.log('Token:', token); 
    console.log('Stored User Data:', storedUserData);
    if (token || storedUserData) {
        try {
            const userInfo = JSON.parse(storedUserData); // 저장된 JSON 데이터를 객체로 변환
            const Id = userInfo.userId
            const response = await axios.get(`http://10.0.2.2:8001/page/feed/${Id}`, { 
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log('User Info:', response.data.result)
        } catch (err) {
            console.error('Failed to fetch user info:', err);
        } finally {
          setLoading(false);
        }
    }
};

useEffect(() => {
  fetchUserInfo(); // 컴포넌트가 렌더링될 때 사용자 정보 가져오기
}, []);

    return(
    <SafeAreaView style={{flex:1, backgroundColor:'white'}}>
         <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
        <Text style={styles.sectionTitle}>동아리</Text>
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

      <View>
        <View style={{height:10, backgroundColor:'#d9d9d9'}}></View>
        <View flexDirection={'row'}>
            <Image style={styles.FeedImgBox}></Image>
            <Text style={styles.ClubName}>동아리 이름</Text>
        </View>
        <View style={styles.PostBox}>
            <Text style={styles.ClubPostTitle}>동아리 포스트 제목</Text>
            <Text style={styles.PostDate}>2024-xx-xx</Text>
            <Text style={styles.Post}>왜 다음주에요 왜 다음주에요 왜 다음주에요 왜 다음주에요 왜 다음주에요 </Text>
        </View>
      </View>

      <View>
        <View style={{height:10, backgroundColor:'#d9d9d9'}}></View>
        <View flexDirection={'row'}>
            <Image style={styles.FeedImgBox}></Image>
            <Text style={styles.ClubName}>동아리 이름</Text>
        </View>
        <View style={styles.PostBox}>
            <Text style={styles.ClubPostTitle}>동아리 포스트 제목</Text>
            <Text style={styles.PostDate}>2024-xx-xx</Text>
            <Text style={styles.Post}>왜 다음주에요 왜 다음주에요 왜 다음주에요 왜 다음주에요 왜 다음주에요 </Text>
        </View>
      </View>

      <View>
        <View style={{height:10, backgroundColor:'#d9d9d9'}}></View>
        <View flexDirection={'row'}>
            <Image style={styles.FeedImgBox}></Image>
            <Text style={styles.ClubName}>동아리 이름</Text>
        </View>
        <View style={styles.PostBox}>
            <Text style={styles.ClubPostTitle}>동아리 포스트 제목</Text>
            <Text style={styles.PostDate}>2024-xx-xx</Text>
            <Text style={styles.Post}>왜 다음주에요 왜 다음주에요 왜 다음주에요 왜 다음주에요 왜 다음주에요 </Text>
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
      }
})