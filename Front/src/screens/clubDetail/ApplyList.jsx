import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet,ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';



const ApplyList = () => {
    const route = useRoute();
  const { clanId, userId} = route.params;
  const [Apply, setApply] = useState([]);
  const navigation = useNavigation();
//토큰 기반 사용자 정보 가져오기
const fetchApplyList = async () => {
    const token = await AsyncStorage.getItem('jwtToken'); 
    if (token) {
        try {
            const response = await axios.get(`http://10.0.2.2:8001/club/${userId}/${clanId}/apply-list`, { 
                headers: { Authorization: `Bearer ${token}` },
            });
            setApply(response.data.result)
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
  fetchApplyList(); // 컴포넌트가 렌더링될 때 사용자 정보 가져오기
}, []);

  return (
    <SafeAreaView flex={1} backgroundColor={"white"}>
    <View style={{marginBottom: 20}}>
      <Text style={{fontSize: 30, fontWeight: 'bold', marginLeft: 30}}>신청자 목록</Text>
    </View>
    <ScrollView>

    <>
      {Apply.map((item) => {
        if (item.result === 3) {
          return (
            <TouchableOpacity key={item.idx} style={styles.peopleBox} onPress={() => navigation.navigate('Apply', { clanId : clanId,
                userId : userId, resumeId : item.idx       
          })}>
              <View style={styles.peopleInfo}>
                <Image 
                  style={styles.peoplePhoto}
                  source={{ uri: `http://10.0.2.2:8001${item.userImg}` }} 
                />
                <Text style={{ fontSize: 20, marginLeft: 10, fontWeight: 'bold' }}>{item.userName}</Text>
              </View>
            </TouchableOpacity>
          );
        }
        return null; // 결과가 3이 아닌 항목은 표시하지 않음
      })}
    </>




    </ScrollView>
  </SafeAreaView>
  

  );
};

const styles = StyleSheet.create({
    peoplePhoto: {
      width: 60,
      height: 60,
      borderRadius: 100,
      backgroundColor:'gray'
    },
    peopleBox: {
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: '#d9d9d9',
      width: '100%',
      height: 80,
      flexDirection: 'row', // 가로 방향 배치
      alignItems: 'center',
      paddingHorizontal: 10
    },
    peopleInfo: {
      flexDirection: 'row', // 사진과 이름을 나란히 배치
      alignItems: 'center', // 수직 정렬
      flex: 1, // 공간을 차지하며 버튼과의 간격 조정
    },
    kick: {
      marginLeft: 'auto', // 버튼을 오른쪽 끝에 배치
      width: 50,
      height: 40,
      justifyContent: 'center',
      borderRadius: 5,
      backgroundColor: '#0091da',
    },
    kickText: {
      textAlign: 'center',
      fontSize: 18,
      color: 'white',
      fontWeight: 'bold',
    },
  });
  
  

export default ApplyList;
