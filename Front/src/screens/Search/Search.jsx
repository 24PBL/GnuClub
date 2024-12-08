import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
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
        const token = await AsyncStorage.getItem('jwtToken');
        const storedUserData = await AsyncStorage.getItem('UserData');
        if (token && storedUserData) {
            try {
                const userInfo = JSON.parse(storedUserData);
                const Id = userInfo.userId;
                const response = await axios.get(`http://10.0.2.2:8001/club/${Id}/search-club?keyword=${text}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setId(Id)
                setclubList(response.data.clubList)

            } catch (err) {
                console.error('Failed to fetch search results:', err);
            }
        }
    };

    return (
        <SafeAreaView flex={1} backgroundColor={'white'}>
            <View style={styles.container}>
                <Ionicons name="search-outline" size={33} style={styles.iconStyle} />
                <TextInput 
                    placeholder='동아리를 검색해주세요!' 
                    placeholderTextColor="rgba(0, 0, 0, 0.4)" 
                    onChangeText={setText}
                    value={text}
                    style={styles.textInput}
                />
                <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
                    <Text style={styles.searchButtonText}>검색</Text>
                </TouchableOpacity>
            </View>
            {clubList.map((club) => (
        <TouchableOpacity 
        onPress={() => navigation.navigate('ClubDetail', { 
            clanId : club.clanId,
            userId : Id})} key={club.clanId} style={{ borderWidth: 0.3, width: '90%', alignSelf: 'center', marginTop: 30, height: 100, flexDirection: 'row', borderRadius:10}}>
          <Image source={{ uri: `http://10.0.2.2:8001${club.clanImg}` }} style={{ width: 98, height: 98, borderRadius: 10, borderWidth:0.5, }} />
          <View style={{ marginLeft: 10 }}>
            <Text style={{ width: 120, fontWeight: 'bold' }}>{club.clanName}</Text>
            <Text style={{ width: 200 }}>{club.clanIntro}</Text>
          </View>
        </TouchableOpacity>
      ))}

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#d9d9d9', 
        width: '80%', 
        alignSelf: 'center', 
        borderRadius: 10, 
        flexDirection: 'row'
    },
    iconStyle: {
        opacity: 0.4, 
        alignSelf: 'center', 
        marginLeft: 10
    },
    textInput: {
        fontSize: 19, 
        marginLeft: 10, 
        width: 200
    },
    searchButton: {
        width: 50, 
        height: 35, 
        alignSelf: 'center', 
        borderRadius: 5, 
        marginLeft: 25, 
        backgroundColor: "#0091da", 
        justifyContent: 'center'
    },
    searchButtonText: {
        color: 'white', 
        fontWeight: 'bold', 
        fontSize: 17, 
        textAlign: 'center'
    }
});

export default Search;
