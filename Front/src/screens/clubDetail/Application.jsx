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
    // Major data as in the original code
  };

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
