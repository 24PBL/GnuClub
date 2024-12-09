import { Text, ScrollView, View, Image, StyleSheet} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useState, useEffect } from 'react';


export default function AppList() {
    const [AppResult, setAppResult] = useState([])
    const fetchUserInfo = async () => {
        const token = await AsyncStorage.getItem('jwtToken');
        const storedUserData = await AsyncStorage.getItem('UserData');
        if (token || storedUserData) {
            try {
                const userInfo = JSON.parse(storedUserData); // 저장된 JSON 데이터를 객체로 변환
                const Id = userInfo.userId
                const response = await axios.get(`http://10.0.2.2:8001/page/check-apply/${Id}`, { //차후 수정 예정 이거 데이터가 안옮겨져서 임시로 1로 함
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAppResult(response.data.result)
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

      const getResultTextAndColor = (result) => {
        switch (result) {
            case 1:
                return { text: '승인', color: 'blue' };
            case 2:
                return { text: '거절', color: 'red' };
            case 3:
                return { text: '검토중', color: 'gray' };
            default:
                return { text: '알 수 없음', color: 'black' };
        }
    };


    return(
        <SafeAreaProvider>
            <SafeAreaView style={{flex:1, backgroundColor:'white'}}>
            <Text style={{fontWeight:'bold', fontSize:20, marginLeft:20, marginTop:25, marginBottom:30}}>신청내역확인</Text>
                <ScrollView contentContainerStyle={{justifyContent: 'center',alignItems: 'center'}}>

                <View style={{ flex: 1, padding: 20 }}>
                        {AppResult.length > 0 ? (
                            AppResult.map((item, index) => {
                                const { text, color } = getResultTextAndColor(item.result);
                                return (
                                    <View key={index} style={{ width: 354, height: 100, flexDirection: 'row', alignItems: 'center', marginBottom: 25 }}>
                                        <Image
                                            source={{ uri: `http://10.0.2.2:8001${item.clan.clanImg}` }}
                                            style={styles.clubProfile}
                                        />
                                        <Text style={styles.clubText}>
                                            {item.clan.clanName}
                                            {"\n"}
                                            결과 : <Text style={{ color: color }}>{text}</Text>
                                        </Text>
                                    </View>
                                );
                            })
                        ) : (
                            <Text style={{ textAlign: 'center', fontSize: 16 }}>데이터가 없습니다.</Text>
                        )}
                    </View>
                    
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    clubProfile: {
      width:100, height:100, borderRadius:10, borderWidth:1, borderColor:'#d9d9d9'
    },
    clubText: {
        textAlign: 'center',
        flex: 1,
        fontSize: 15,
        height : 50
      }
})
