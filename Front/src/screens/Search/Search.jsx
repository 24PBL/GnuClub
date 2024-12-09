import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Search = () => {
    const [text, setText] = useState('');
    const [clubList, setclubList] = useState([]);
    const [Id, setId] = useState([]);
    const navigation = useNavigation();

    const handleSearch = async () => {
        if (text == null || text == '') {
            Alert.alert('검색', '동아리를 검색해주세요.');
        } else {
            const token = await AsyncStorage.getItem('jwtToken');
            const storedUserData = await AsyncStorage.getItem('UserData');
            if (token && storedUserData) {
                try {
                    const userInfo = JSON.parse(storedUserData);
                    const Id = userInfo.userId;
                    const response = await axios.get(`http://10.0.2.2:8001/club/${Id}/search-club?keyword=${text}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
    
                    // 검색 결과 처리
                    setId(Id);
                    if (response.data.clubList.length === 0) {
                        Alert.alert('검색 결과', '검색한 동아리가 없습니다.');
                    } else {
                        setclubList(response.data.clubList);
                    }
    
                } catch (err) {
                    // 오류 처리
                    console.error('Failed to fetch search results:', err);
    
                    // 404 오류와 같은 요청 실패 처리
                    if (err.response && err.response.status === 404) {
                        Alert.alert('오류', '검색한 동아리가 존재하지 않습니다.');
                    } else {
                        Alert.alert('네트워크 오류', '서버와의 연결에 문제가 있습니다. 다시 시도해주세요.');
                    }
                }
            }
        }
    };
    

    return (
        <SafeAreaView flex={1} backgroundColor={'white'}>
            <View style={styles.container}>
                <Ionicons name="search-outline" size={33} style={styles.iconStyle} />
                <TextInput
                    placeholder="동아리를 검색해주세요!"
                    placeholderTextColor="rgba(0, 0, 0, 0.4)"
                    onChangeText={setText}
                    value={text}
                    style={styles.textInput}
                />
                <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
                    <Text style={styles.searchButtonText}>검색</Text>
                </TouchableOpacity>
            </View>

            {/* 검색 결과가 있을 때만 동아리 목록을 표시 */}
            {clubList.length > 0 ? (
                clubList.map((club) => (
                    <TouchableOpacity
                        key={club.clanId}
                        onPress={() =>
                            navigation.navigate('ClubDetail', {
                                clanId: club.clanId,
                                userId: Id,
                            })
                        }
                        style={{
                            borderWidth: 0.3,
                            width: '90%',
                            alignSelf: 'center',
                            marginTop: 30,
                            height: 100,
                            flexDirection: 'row',
                            borderRadius: 10,
                        }}
                    >
                        <Image
                            source={{ uri: `http://10.0.2.2:8001${club.clanImg}` }}
                            style={{ width: 98, height: 98, borderRadius: 10, borderWidth: 0.5 }}
                        />
                        <View style={{ marginLeft: 10 }}>
                            <Text style={{ width: 120, fontWeight: 'bold' }}>{club.clanName}</Text>
                            <Text style={{ width: 200 }}>{club.clanIntro}</Text>
                        </View>
                    </TouchableOpacity>
                ))
            ) : (
                <View style={{ alignItems: 'center', marginTop: 20 }}>
                    <Text style={{ fontSize: 18, color: '#999' }}>검색 결과가 없습니다.</Text>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#d9d9d9',
        width: '80%',
        alignSelf: 'center',
        borderRadius: 10,
        flexDirection: 'row',
    },
    iconStyle: {
        opacity: 0.4,
        alignSelf: 'center',
        marginLeft: 10,
    },
    textInput: {
        fontSize: 19,
        marginLeft: 10,
        width: 200,
    },
    searchButton: {
        width: 50,
        height: 35,
        alignSelf: 'center',
        borderRadius: 5,
        marginLeft: 25,
        backgroundColor: '#0091da',
        justifyContent: 'center',
    },
    searchButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 17,
        textAlign: 'center',
    },
});

export default Search;
