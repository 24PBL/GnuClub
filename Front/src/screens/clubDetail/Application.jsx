import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput} from 'react-native';
import RNPickerSelect from 'react-native-picker-select'; // Picker import
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Application = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchUserInfo = async () => {
    const token = await AsyncStorage.getItem('jwtToken');
    const storedUserData = await AsyncStorage.getItem('UserData');
    console.log('Token:', token); 
    console.log('Stored User Data:', storedUserData);
    if (token || storedUserData) {
        try {
            const userInfo = JSON.parse(storedUserData); // 저장된 JSON 데이터를 객체로 변환
            const Id = userInfo.userId
            const response = await axios.get(`http://10.0.2.2:8001/page/mypage/${Id}`, { //차후 수정 예정 이거 데이터가 안옮겨져서 임시로 1로 함
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log('User Info:', response.data.result.user);
            setUserInfo(response.data.result.user)
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

  return (
    <SafeAreaView style={{flex:1,backgroundColor:'white'}}>

      <TouchableOpacity style={{backgroundColor:'#0091da', width:70, height:35, borderRadius:10, justifyContent:'center', alignItems:'center', alignSelf:'flex-end', marginRight:30, marginTop:10}}>
        <Text style={{fontSize:16, color:'white', marginLeft:2}}>신청하기</Text>
        </TouchableOpacity>
      <View style={{alignItems : 'center', justifyContent:'center', marginTop:40}}>


        <View style={{marginBottom : 10}}>
          <Text style={styles.inputLabel}>이름</Text>
          <View style={styles.inputBox}><Text style={styles.inputText}>{userInfo.userName}</Text></View>
        </View>

        <View style={{marginBottom : 10}}>
          <Text style={styles.inputLabel}>단과대학</Text>
          <View style={styles.inputBox}><Text style={styles.inputText}>{userInfo?.collage_collage?.collageName || 'N/A'}</Text></View>
        </View>

        <View style={{marginBottom : 10}}>
          <Text style={styles.inputLabel}>학과</Text>
          <View style={styles.inputBox}><Text style={styles.inputText}>{userInfo.userLesson}</Text></View>
        </View>

        <View style={{marginBottom : 10}}>
          <Text style={styles.inputLabel}>학번</Text>
          <View style={styles.inputBox}><Text style={styles.inputText}>{userInfo.userNum}</Text></View>
        </View>

        <View style={{marginBottom : 10}}>
          <Text style={styles.inputLabel}>전화번호</Text>
          <View style={styles.inputBox}><Text style={styles.inputText}>{userInfo.userPhone}</Text></View>
        </View>

        <View style={{marginBottom : 10}}>
          <Text style={styles.inputLabel}>하고싶은 말</Text>
          <View style={styles.userSay}><TextInput style={styles.SaySize} multiline={true}></TextInput></View>
        </View>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  inputBox : {
    borderWidth : 1,
    width : 250,
    height : 47,
    borderRadius : 10,
    justifyContent : 'center'
  },
  inputLabel :{
    marginBottom : 10,
    color : '#727272'
  },
  inputText:{
    marginLeft : 15,
    fontSize : 18,
    color : 'gray'
    },
  userSay :{
    width : 250,
    height : 200,
    borderWidth : 1,
    borderRadius : 10
  },
  SaySize:{
    fontSize:15,
    marginLeft:15,
    width : 220,
    height : 190,
    textAlignVertical : 'top',
  }
})

export default Application;
