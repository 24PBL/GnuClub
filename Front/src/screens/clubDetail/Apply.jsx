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
  const { clanId, userId, resumeId} = route.params;
  const [appInfo, setappInfo] = useState([])

  const fetchApp = async () => {
    const token = await AsyncStorage.getItem('jwtToken');
    console.log('Token:', token); 
    if (token || storedUserData) {
        try {
            const response = await axios.get(`http://10.0.2.2:8001/club/${userId}/${clanId}/show-resume/${resumeId}`, { //차후 수정 예정 이거 데이터가 안옮겨져서 임시로 1로 함
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(JSON.stringify(response.data, null, 2));
            setappInfo(response.data.result)
        } catch (err) {
            console.error('Failed to fetch user info:', err);
        } finally {
          setLoading(false);
        }
    }
};

useEffect(() => {
  fetchApp(); // 컴포넌트가 렌더링될 때 사용자 정보 가져오기
}, []);



  return (
    <SafeAreaView style={{flex:1,backgroundColor:'white'}}>
      <View style={{alignItems : 'center', justifyContent:'center', marginTop:40}}>


        <View style={{marginBottom : 10}}>
          <Text style={styles.inputLabel}>이름</Text>
          <View style={styles.inputBox}><Text style={styles.inputText}>{}</Text></View>
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
