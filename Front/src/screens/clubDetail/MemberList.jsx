import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


const MemberList = () => {
    const route = useRoute();
  const { clanId, userId} = route.params;

//토큰 기반 사용자 정보 가져오기
const fetchMemberList = async () => {
    const token = await AsyncStorage.getItem('jwtToken');
    console.log('Token:', token); 
    if (token) {
        try {
            const response = await axios.get(`http://10.0.2.2:8001/club/${userId}/${clanId}/member-list`, { 
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log('User Info:', response);
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
    <View style={styles.container}>
      <Text style={styles.text}>{clanId}  {userId}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  text: {
    fontSize: 18,
    color: '#000000',
  },
});

export default MemberList;
