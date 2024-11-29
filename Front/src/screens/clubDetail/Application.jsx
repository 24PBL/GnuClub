import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select'; // Picker import

const Application = ({ navigation }) => {
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [major, setMajor] = useState('');
  const [phone, setPhone] = useState('');
  const [studentId, setStudentId] = useState(''); 
  const [message, setMessage] = useState('');
  const [filteredMajors, setFilteredMajors] = useState([]);
  const [isMajorListOpen, setIsMajorListOpen] = useState(false);

  const colleges = [
    '인문대학', 
    '사회과학대학',
    '자연과학대학',
    '경영대학',
    '공과대학',
    'IT공과대학',
    '우주항공대학',
    '농업생명과학대학',
    '법과대학',
    '사범대학',
    '수의과대학',
    '의과대학',
    '간호대학',
    '해양과학대학',
    '약학대학',
    '건설환경공과대학',
    '본부대학',
  ];

  const collegeMajorsMap = {
    '인문대학':[
    "영어영문학부 영어영문학전공",
    "영어영문학부 영어전공",
    "국어국문학과",
    "독어독문학과",
    "러시아학과",
    "민속예술무용학과",
    "불어불문학과",
    "사학과",
    "중어중문학과",
    "철학과",
    "한문학과"],
    '사회과학대학':[
    "경제학부",
    "사회복지학부",
    "미디어커뮤니케이션학과",
    "사회학과",
    "심리학과",
    "아동가족학과",
    "정치외교학과",
    "행정학과"],
    '자연과학대학':[
    "생명과학부",
    "물리학과",
    "수학과",
    "식품영양학과",
    "의류학과",
    "정보통계학과",
    "제약공학과",
    "지질과학과",
    "항노화신소재과학과",
    "화학과"],
    '경영대학':[
    "경영학부",
    "회계세무학부",
    "경영정보학과",
    "국제통상학과",
    "산업경영학과",
    "스마트유통물류학과"],
    '공과대학':[
    "건축공학부",
    "기계공학부",
    "나노 신소재공학부 고분자공학전공",
    "나노 신소재공학부 금속재료공학전공",
    "나노 신소재공학부 세라믹공학전공",
    "산업시스템공학부",
    "건축학과",
    "기계융합공학과",
    "도시공학과",
    "미래자동차공학과",
    "에너지공학과",
    "토목공학과",
    "화학공학과"],
    'IT공과대학':[
    "메카트로닉스공학부",
    "전자공학부",
    "반도체공학과",
    "소프트웨어공학과",
    "전기공학과",
    "제어로봇공학과",
    "컴퓨터공학과",
    "AI정보공학과"],
    '우주항공대학':[
    "항공우주공학부"],
    '농업생명과학대학':[
    "식품자원경제학과",
    "동물생명융합학부",
    "식품공학과",
    "원예과학부",
    "축산과학부",
    "환경산림과학부",
    "농학과",
    "스마트농산업학과",
    "식물의학과",
    "환경생명화학과",
    "환경재료과학과",
    "생물산업기계공학과",
    "지역시스템공학과"],
    '법과대학':[
    "법학과"],
    '사범대학':[
    "교육학과",
    "국어교육과",
    "역사교육과",
    "영어교육과",
    "유아교육과",
    "윤리교육과",
    "일반사회교육과",
    "일어교육과",
    "지리교육과",
    "물리교육과",
    "생물교육과",
    "수학교육과",
    "화학교육과",
    "미술교육과",
    "음악교육과",
    "체육교육과"],
    '수의과대학':[
    "수의예과",
    "수의학과"],
    '의과대학':[
    "의예과",
    "의학과"],
    '간호대학':[
    "간호학과"],
    '해양과학대학':[
    "해양수산경영학과",
    "미래산업융합학과",
    "수산생명의학과",
    "해양경찰시스템학과",
    "해양생명과학과",
    "기계시스템공학과",
    "스마트에너지기계공학과",
    "조선해양공학과",
    "해양식품공학과",
    "해양토목공학과",
    "해양환경공학과"],
    '약학대학':[
    "약학과"],
    '건설환경공과대학':[
    "건설시스템공학과",
    "인테리어재료공학과",
    "조경학과",
    "환경공학과",
    "디자인비즈니스학과"],
    '본부대학':[
    "휴먼헬스케어학과"]
    }

  const handleCollegeSelect = (selectedCollege) => {
    setCollege(selectedCollege);
    setFilteredMajors(collegeMajorsMap[selectedCollege] || []);
    setMajor('');
    setIsMajorListOpen(false);
  };

  const handleMajorChange = (text) => {
    setMajor(text);
    const filtered = (collegeMajorsMap[college] || []).filter((major) =>
      major.includes(text)
    );
    setFilteredMajors(filtered);
    setIsMajorListOpen(filtered.length > 0);
  };

  const handleSubmit = () => {
    console.log('Form submitted', { name, college, major, phone, studentId, message });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back-outline" size={24} color="#0091DA" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.applyButton} onPress={handleSubmit}>
        <Text style={styles.applyButtonText}>신청하기</Text>
      </TouchableOpacity>

      <Text style={styles.label}>이름</Text>
      <TextInput 
        style={styles.input} 
        value={name} 
        onChangeText={setName} 
      />

      <Text style={styles.label}>단과대학</Text>
      <RNPickerSelect
        onValueChange={handleCollegeSelect}
        items={colleges.map(college => ({ label: college, value: college }))}
        value={college}
        style={pickerSelectStyles}        
        //placeholder={{ label: '단과대학을 선택하세요', value: null }}
      />

      <Text style={styles.label}>학과</Text>
      <RNPickerSelect
        onValueChange={setMajor}
        items={filteredMajors.map(major => ({ label: major, value: major }))}
        value={major}
        style={pickerSelectStyles}
      />

      <Text style={styles.label}>학번</Text>
      <TextInput 
        style={styles.input} 
        value={studentId} 
        onChangeText={(text) => setStudentId(text.replace(/[^0-9]/g, ''))} 
        keyboardType="numeric"
        maxLength={10}         
        //placeholder={{ label: '학과를 선택하세요', value: null }}
      />

      <Text style={styles.label}>전화번호</Text>
      <TextInput 
        style={styles.input} 
        value={phone} 
        onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, ''))} 
        keyboardType="numeric"
        maxLength={11}
      />

      <Text style={styles.label}>하고 싶은 말</Text>
      <TextInput 
        style={[styles.input, styles.messageInput]} 
        value={message} 
        onChangeText={setMessage} 
        multiline
      />
    </ScrollView>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputAndroid: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,  
    height: 30,
  },
  inputIOS: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
    paddingTop: 15,
  },
});

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 16,
    zIndex: 10,
  },
  applyButton: {
    backgroundColor: '#0091DA',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  messageInput: {
    height: 100,
    textAlignVertical: 'top',
  },
});

export default Application;
