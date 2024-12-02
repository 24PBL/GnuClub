import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateClub = () => {
  const [clanName, setClanName] = useState('');
  const [clanIntro, setClanIntro] = useState('');
  const [clanClass, setClanClass] = useState('');
  const [clanImg, setClanImg] = useState(null);
  const [recruitPeriod, setRecruitPeriod] = useState('');
  const [people, setPeople] = useState('');
  const [fee, setFee] = useState('');
  const [interview, setInterview] = useState(false);

  // 이미지 선택 함수
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setClanImg(result.assets[0].uri);
    }
  };

  // 동아리 생성 함수
  const createClan = async () => {
    const newClan = {
      clanName,
      clanIntro,
      clanclass : 1,
      clanImg: clanImg,
      recruitPeriod,
      people,
      fee,
      interview,
    };

    try {
      const token = await AsyncStorage.getItem('jwtToken');
      const response = await axios.post('http://10.0.2.2:8001/club/1/create-club/fill-info/submit', newClan,{headers: { Authorization: `Bearer ${token}` }}); //1은 임시값 -> 원래 데이터 받아 와야됨.
      console.log('동아리 생성 성공:', response.data);
    } catch (error) {
      console.error('동아리 생성 실패:', error.response);
      console.log(newClan)
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
        <Text style={styles.title}>동아리 생성</Text>
        <ScrollView>
      <View style={styles.container}>    
        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
          {clanImg ? (
            <Image source={{ uri: clanImg }} style={styles.image} />
          ) : (
            <Ionicons name="camera-outline" size={40} color="gray" />
          )}
        </TouchableOpacity>
        <Text style={styles.blockLabel}>동아리 이름</Text>
        <TextInput
          style={styles.input}
          placeholder="동아리 이름"
          value={clanName}
          onChangeText={setClanName}
        />
        <Text style={styles.blockLabel}>동아리 소개</Text>
        <TextInput
          style={styles.input}
          placeholder="동아리 소개"
          value={clanIntro}
          onChangeText={setClanIntro}
        />
        <Text style={styles.blockLabel}>동아리 분과</Text>
        <TextInput
          style={styles.input}
          placeholder="동아리 분류"
          value={clanClass}
          onChangeText={setClanClass}
        />
        <Text style={styles.blockLabel}>모집 기간</Text>
        <TextInput
          style={styles.input}
          placeholder="모집 기간"
          value={recruitPeriod}
          onChangeText={setRecruitPeriod}
        />
        <Text style={styles.blockLabel}>모집 인원</Text>
        <TextInput
          style={styles.input}
          placeholder="모집 인원"
          value={people}
          onChangeText={setPeople}
          keyboardType="numeric"
        />
        <Text style={styles.blockLabel}>동아리 회비</Text>
        <TextInput
          style={styles.input}
          placeholder="회비"
          value={fee}
          onChangeText={setFee}
          keyboardType="numeric"
        />

        <View style={styles.checkboxContainer}>
          <Text style={styles.checkboxLabel}>면접 여부</Text>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => setInterview(!interview)}
          >
            {interview ? (
              <Ionicons name="checkbox" size={24} color="blue" />
            ) : (
              <Ionicons name="checkbox-outline" size={24} color="gray" />
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={createClan} style={styles.createButton}>
          <Text style={styles.createButtonText}>동아리 생성</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor : 'white'
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingLeft: 10,
  },
  imagePicker: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ddd',
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    alignSelf : 'center'
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxLabel: {
    fontSize: 16,
    marginRight: 10,
    fontWeight:'bold'
  },
  checkbox: {
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  createButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  blockLabel:{
    fontSize:18,
    fontWeight:'bold',
    marginBottom:10
  }
});

export default CreateClub;
