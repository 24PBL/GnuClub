import React, { useState, useEffect } from 'react';
import { Text, Alert, TouchableOpacity, FlatList } from "react-native";
import styled from 'styled-components';
import axios from 'axios';
import * as Sign from '../login/LoginScreens'

export default function SignUpDetails({ route, navigation }) {
  const { email } = route.params; // 전달된 이메일
  const [studentId, setStudentId] = useState('');
  const [name, setname] = useState('');
  const [CheckPW, setCheckPw] = useState("");
  const [PW, setPw] = useState("");
  const [HardPwError, setHardPwError] = useState("");
  const [PNumber, setPNumber] = useState("");
  const [PwError, setPwError] = useState("");
  const [college, setCollege] = useState(""); 
  const [isCollegeListOpen, setIsCollegeListOpen] = useState(false); 

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

  const getPasswordInputStyle = () => {
    if (PW == CheckPW) {
      return {color : "blue"}
  }
    return {};
};

  useEffect(() => {
    if (PW && CheckPW) {
      if (PW === CheckPW) {
        setPwError("비밀번호가 확인되었습니다.");
      } else {
        setPwError("비밀번호가 일치하지 않습니다.");
      }
    } else {
      setPwError("");
    }
  }, [PW, CheckPW]);
  //비밀번호 확인

  // 단과 대학 선택 처리
  const handleCollegeSelect = (selectedCollege) => {
    setCollege(selectedCollege);
    setIsCollegeListOpen(false); // 선택 후 토글 닫기
  };

  // 비밀번호 유효성 검사
  const handlePWChange = (text) => {
    setPw(text);
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(text)) {
      setHardPwError('비밀번호는 8자 이상 숫자, 특수문자를 포함해야 합니다.');
    } else {
      setHardPwError('');
    }
  };

  const signUp = async (name, email, studentId, PNumber, college, major, sex, defaultImg) => {
    console.log("함수 정상 호출")
    try {
      const response = await axios.post('http://172.30.1.85:3000/signup', {
        userName: name,
        userEmail: email,
        userNum: studentId,
        userPhone: PNumber,
        college: college,
        userLesson : major,
        Field : sex,
        userImg : defaultImg 
      });
      console.log('서버 응답' , response.data);
      navigation.navigate("Login");
    } catch (error) {
      // 서버에서 409 상태 코드 반환
      if (error.response && error.response.status === 409) {         
          Alert.alert(
              "중복된 정보",
              "이미 존재하는 학번 또는 이메일입니다.", // 경고창
              [{ text: "확인" }] 
          );
          console.log(error)
      } else {
          console.error('회원가입 실패:', error);
      }
  }
};

const isFormValid = () => {
  return PW && CheckPW && name && PwError === "비밀번호가 확인되었습니다." && !HardPwError;
};

  return (
    <Container>
      <Text style={{ fontSize: 30, fontWeight: 'bold', marginBottom: 20, paddingLeft: 50 }}>회원가입</Text>
      <StyledLabel>학번</StyledLabel>
      <SignInputBox2 placeholder="학번" placeholderTextColor="rgba(0,0,0,0.2)" onChangeText={setStudentId} />
      <StyledLabel>이름</StyledLabel>
      <SignInputBox2 placeholder="이름" placeholderTextColor="rgba(0,0,0,0.2)" onChangeText={setname} />
      <StyledLabel>전화번호</StyledLabel>
      <SignInputBox2 placeholder="전화번호를 - 없이 입력하세요." placeholderTextColor="rgba(0,0,0,0.2)" onChangeText={setPNumber} />

      {/* 토글 버튼 */}
      <StyledLabel>단과 대학</StyledLabel>
      <TouchableOpacity onPress={() => setIsCollegeListOpen(!isCollegeListOpen)} style={styles.toggleButton}>
        <Text style={styles.toggleButtonText}>
          {college ? college : '단과 대학 선택'}
        </Text>
      </TouchableOpacity>

      {/* 단과 대학 리스트 */}
      {isCollegeListOpen && (
  <FlatList
    data={colleges}
    keyExtractor={(item, index) => index.toString()}
    renderItem={({ item }) => (
      <TouchableOpacity style={[styles.listItem, { width: 270 }]} onPress={() => handleCollegeSelect(item)}>
        <Text style={styles.listItemText}>{item}</Text>
      </TouchableOpacity>
    )}
    style={styles.dropdown} // 스타일 적용
  />
)}
      <StyledLabel>비밀번호</StyledLabel>
      <SignInputBox2
        placeholder="비밀번호"
        placeholderTextColor="rgba(0,0,0,0.2)"
        onChangeText={handlePWChange}
        secureTextEntry={true}
      />
      <Text style={{ color: "red" , marginLeft:50, marginTop:5}}>{HardPwError}</Text>
      <StyledLabel>비밀번호 확인</StyledLabel>
      <SignInputBox2
        placeholder="비밀번호 확인"
        placeholderTextColor="rgba(0,0,0,0.2)"
        onChangeText={setCheckPw}
        secureTextEntry={true}
      />
      <Text style={[{color : "red", marginLeft:50, marginTop:5}, getPasswordInputStyle()]}>{PwError}</Text>
      <SignUpBox 
                  onPress={() => signUp(studentId, inputValue, PW, nickname)} 
                  disabled={!isFormValid()} 
                  style={{ opacity: isFormValid() ? 1 : 0.5 }} 
>
                  <Sign.LoginText>회원가입</Sign.LoginText>
                </SignUpBox>
    </Container>
  );
}


// 뷰 스타일들

const styles = {
  toggleButton: {
    borderRadius: 10,
    width: 270, // SignInputBox2와 동일한 너비
    height: 55,
    paddingLeft: 10,
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
    marginLeft : 50
  },
  toggleButtonText: {
    fontSize: 16,
    color: 'rgba(0,0,0,0.8)',
  },
  dropdown: {
    borderRadius: 10, 
    width: 270, 
    backgroundColor: '#fff',
    maxHeight: 200, 
    overflow: 'hidden',
    alignSelf: 'center',
  },
  listItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
  },
  listItemText: {
    fontSize: 16,
  },
};

const Container = styled.View`
  flex: 1;
  padding: 20px;
  justify-content: center;
`;

const SignInputBox2 = styled.TextInput`
  border-radius: 10px;
  width: 270px;
  height: 55px;
  padding-left: 10px;
  font-size: 16px;
  border-width: 1px;
  border-color: black;
  margin-left : 50px;
`;

const StyledLabel = styled(Sign.Label)`
  margin-left: 50px;
`;

const SignUpBox = styled(Sign.LoginBox)`
  margin-left: 50px;
  width : 270px;
`;
