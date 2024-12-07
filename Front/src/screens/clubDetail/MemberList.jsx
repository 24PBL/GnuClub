import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet,ScrollView, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';


const MemberList = () => {
    const route = useRoute();
  const { clanId, userId} = route.params;

  const [memInfo, setmemInfo] = useState([])
  const [Part, setPart] = useState([])

//토큰 기반 사용자 정보 가져오기
const fetchMemberList = async () => {
    const token = await AsyncStorage.getItem('jwtToken');
    console.log('Token:', token); 
    if (token) {
        try {
            const response = await axios.get(`http://10.0.2.2:8001/club/${userId}/${clanId}/member-list`, { 
                headers: { Authorization: `Bearer ${token}` },
            });
            setPart(response.data.memPart.part)
            setmemInfo(response.data.result || [])
        } catch (err) {
            console.error('Failed to fetch user info:', err);
        } finally {
          setLoading(false);
        }
    }
};

useEffect(() => {
  fetchMemberList(); // 컴포넌트가 렌더링될 때 사용자 정보 가져오기
}, []);

  return (
    <SafeAreaView>
    <View style={{marginBottom: 20}}>
      <Text style={{fontSize: 30, fontWeight: 'bold', marginLeft: 30}}>멤버</Text>
    </View>
    <ScrollView>

      {memInfo.map((member, index) => (
  <View key={index} style={styles.memberBox}>
    {/* 사진과 이름을 나란히 배치 */}
    <View style={styles.memberInfo}>
      <Image 
        style={styles.memberPhoto} 
        source={{ uri: `http://10.0.2.2:8001${member.user.userImg}` }} 
      />
      <Text style={{ fontSize: 20, marginLeft: 10, fontWeight:'bold' }}>{member.user.userName}</Text>
    </View>
    
    {/* 추방 버튼을 오른쪽 끝에 배치 */}
    {Part == 1 && member.user.userId != userId &&(
    <View style={styles.kick}>
      <Text style={styles.kickText}>추방</Text>
    </View>
    )}
  </View>
))}


      



    </ScrollView>
  </SafeAreaView>
  

  );
};

const styles = StyleSheet.create({
    memberPhoto: {
      width: 60,
      height: 60,
      backgroundColor: '#d9d9d9',
      borderRadius: 100,
    },
    memberBox: {
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: '#d9d9d9',
      width: '100%',
      height: 80,
      flexDirection: 'row', // 가로 방향 배치
      alignItems: 'center',
      paddingHorizontal: 10,
    },
    memberInfo: {
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
  
  

export default MemberList;
