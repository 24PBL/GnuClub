import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet,Alert, TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';


const Application = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const route = useRoute();
  const { clanId, userId, resumeId} = route.params;
  const [appInfo, setappInfo] = useState([])

  const fetchApp = async () => {
    const token = await AsyncStorage.getItem('jwtToken');
    if (token || storedUserData) {
        try {
            const response = await axios.get(`http://10.0.2.2:8001/club/${userId}/${clanId}/show-resume/${resumeId}`, { //차후 수정 예정 이거 데이터가 안옮겨져서 임시로 1로 함
                headers: { Authorization: `Bearer ${token}` },
            });
            setappInfo(response.data)
        } catch (err) {
            console.error('Failed to fetch user info:', err);
        } finally {
          setLoading(false);
        }
    }
};

const ApplyDecide = async (decide) => {
    const token = await AsyncStorage.getItem('jwtToken');
    if (token) {
        try {
            const response = await axios.post(`http://10.0.2.2:8001/club/${userId}/${clanId}/${resumeId}/decide-apply`,{
                decision : decide
            },{
                headers: { Authorization: `Bearer ${token}` },
            });
            navigation.navigate('ClubDetail', { clanId : clanId,
                userId : userId        
          })
        } catch (err) {
            console.error('Failed to fetch user info:', err);
        } finally {
          setLoading(false);
        }
    }
};

if (loading) {
  return (
    <View style={{position:'absolute', top:400, left:150}}>
      <ActivityIndicator size="large" color="#0091da" />
      <Text style={{fontWeight:'bold', fontSize:30}}>로딩 중...</Text>
    </View>
  );
}

useEffect(() => {
  fetchApp(); // 컴포넌트가 렌더링될 때 사용자 정보 가져오기
}, []);

const yes = () => {
    Alert.alert(
      '승인',
      `승인 하시겠습니까?`,
      [
        {
          text: '확인',
          onPress: () => ApplyDecide(1),
        },
        {
          text: '취소',
          style: 'cancel',
        },
      ],
      { cancelable: false }
    );
  };

  const no = () => {
    Alert.alert(
      '거절',
      `거절 하시겠습니까?`,
      [
        {
          text: '확인',
          onPress: () => ApplyDecide(2),
        },
        {
          text: '취소',
          style: 'cancel',
        },
      ],
      { cancelable: false }
    );
  };


  return (
    <SafeAreaView style={{flex:1,backgroundColor:'white'}}>
      <View style={{alignItems : 'center', justifyContent:'center', marginTop:40}}>


        <View style={{marginBottom : 10}}>
          <Text style={styles.inputLabel}>이름</Text>
          <View style={styles.inputBox}><Text style={styles.inputText}>{appInfo?.result?.userName}</Text></View>
        </View>

        <View style={{marginBottom : 10}}>
          <Text style={styles.inputLabel}>단과대학</Text>
          <View style={styles.inputBox}><Text style={styles.inputText}>{appInfo?.resumeUser?.collage_collage?.collageName || 'N/A'}</Text></View>
        </View>

        <View style={{marginBottom : 10}}>
          <Text style={styles.inputLabel}>학과</Text>
          <View style={styles.inputBox}><Text style={styles.inputText}>{appInfo?.result?.userLesson}</Text></View>
        </View>

        <View style={{marginBottom : 10}}>
          <Text style={styles.inputLabel}>학번</Text>
          <View style={styles.inputBox}><Text style={styles.inputText}>{appInfo?.resumeUser?.userNum}</Text></View>
        </View>

        <View style={{marginBottom : 10}}>
          <Text style={styles.inputLabel}>전화번호</Text>
          <View style={styles.inputBox}><Text style={styles.inputText}>{appInfo?.resumeUser?.userPhone}</Text></View>
        </View>

        <View style={{marginBottom : 10}}>
          <Text style={styles.inputLabel}>하고싶은 말</Text>
          <View style={styles.useretc}><Text style={styles.etcSize} multiline={true}
                    value={text}>{appInfo?.result?.etc}</Text></View>
        </View>
        <TouchableOpacity style={{width:60, height:45, backgroundColor:'#0091da', borderRadius:10, justifyContent:'center',position:'absolute', top:690, left:80}}>
            <Text style={{color:'white', textAlign:'center', fontWeight:'bold', fontSize:20}} onPress={() => yes()}>승인</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{width:60, height:45, backgroundColor:'red', borderRadius:10, justifyContent:'center', position:'absolute', top:690, right:80}}>
            <Text style={{color:'white', textAlign:'center', fontWeight:'bold', fontSize:20}} onPress={() => no()}>거절</Text>
            </TouchableOpacity>

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
  useretc :{
    width : 250,
    height : 200,
    borderWidth : 1,
    borderRadius : 10
  },
  etcSize:{
    fontSize:15,
    marginLeft:15,
    width : 220,
    height : 190,
    color : 'gray',
    marginTop:10
  }
})

export default Application;
