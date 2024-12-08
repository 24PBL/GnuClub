import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';


const Application = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const route = useRoute();
  const { clanId, userId} = route.params;


  const fetchUserInfo = async () => {
    const token = await AsyncStorage.getItem('jwtToken');
    console.log('Token:', token); 
    if (token) {
        try {
            const response = await axios.get(`http://10.0.2.2:8001/page/mypage/${userId}`, { //차후 수정 예정 이거 데이터가 안옮겨져서 임시로 1로 함
                headers: { Authorization: `Bearer ${token}` },
            });
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

const submit = async () => {
  const token = await AsyncStorage.getItem('jwtToken');
  try {
    const response = await axios.post(`http://10.0.2.2:8001/club/${userId}/${clanId}/apply-club`, {
      etc: text
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    navigation.navigate('ClubDetail', { clanId: clanId, userId: userId });
  } catch (error) {
    console.log(error);
    // 서버에서 받은 에러 메세지 확인
    if (error.response) {
      // 서버가 응답한 경우
      console.error('Server response:', error.response.data.result);
      Alert.alert(
        "중복 신청", // 제목
        '승인 대기 중 상태 입니다.', // 메시지
        [
          { text: "확인", onPress: () => console.log("확인 클릭") },
        ]
      );
    } else if (error.request) {
      // 서버가 응답하지 않은 경우
      console.error('No response:', error.request);
      alert('서버와의 연결이 실패했습니다. 나중에 다시 시도해주세요.');
    } else {
      console.error('Error:', error.message);
      alert('알 수 없는 오류가 발생했습니다.');
    }
  }
};


  return (
    <SafeAreaView style={{flex:1,backgroundColor:'white'}}>

      <TouchableOpacity onPress={()=>{submit()}} style={{backgroundColor:'#0091da', width:70, height:35, borderRadius:10, justifyContent:'center', alignItems:'center', alignSelf:'flex-end', marginRight:30, marginTop:10}}>
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
          <View style={styles.userSay}><TextInput style={styles.SaySize} multiline={true} onChangeText={setText}
                    value={text}></TextInput></View>
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
