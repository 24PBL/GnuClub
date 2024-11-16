import React, { useState, useEffect } from 'react';
import { Text, Alert, TouchableOpacity, FlatList, Switch, StyleSheet, View, ScrollView} from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
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
  const [major, setmajor] = useState(""); 
  const [sex, setsex] = useState(""); 

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

  const signUp = async (name, email, studentId, PNumber, college, major, sex, defaultImg, PW) => {
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
        userImg : defaultImg,
        userPW : PW
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
const defaultImg = 'https://s3-alpha-sig.figma.com/img/3c10/d706/e1dde50927ea1403189349f292313bd2?Expires=1732492800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=lvuUK2DIXm70dWGPhnxMXLc7xLZL~S1idKyJWkZaktXElDK~UbVTzB6R3mtGP9ZZFlaXn2RWGBi3yZ53QLyH3OzSs2FANSbUpkCcuu8D-VZM9uFmP9RoEF5M-~6VqKMsOKdszMTqY3jhrxwAZ6mmFDUJHuEnnAV6qg4dFYJe3s5-J94bt-8AlMayuc1HSWlEdN1rvsarkHwy-zVtCly1o35xNUeUlIDF3A-Xf8sCxQLpiV7jVd7KlEEcgOVtxz8Zf1xT5iuFzVa6-s3OWddnwJO6sFY4xFwl8zK-StoEW~l-j2E2wSST1Fm5FAqgE1m2ZErKY65rd0J7dhF35-qeQA__';

const isFormValid = () => {
  return PW && CheckPW && name && (PW === CheckPW) && !HardPwError && studentId && PNumber && major && college;
};

const [isMale, setIsMale] = useState(true); // 기본값을 '남'으로 설정

  const handleToggle = () => {
    setIsMale(previousState => {
      const newValue = !previousState;
      setsex(newValue ? '남' : '여');
      return newValue;
  });
  };

  return (
    <SafeAreaProvider>
    <SafeAreaView style={{flex : 1, backgroundColor : 'white'}}>
  <FlatList
  data={[1]} // 하나의 항목만, 화면 전체를 처리할 수 있도록
  keyExtractor={(item) => item.toString()}
  renderItem={() => (
    <Container>
      <Text style={{ fontSize: 30, fontWeight: 'bold', marginBottom: 20, paddingLeft: 50 }}>회원가입</Text>

      <View style={styles2.container}>
      <View style={styles2.toggleContainer}>
        <Switch
          value={isMale}
          onValueChange={handleToggle} // 토글 스위치 값 변경 시 호출되는 함수
          trackColor={{ false: '#FF69B4', true: '#1E90FF' }} // 배경 색상 (여: 분홍, 남: 파랑)
          thumbColor={isMale ? '#1E90FF' : '#FF69B4'} // 핸들 색상 (남: 파랑, 여: 분홍)
        />
      </View>
      <Text style={styles2.selectedGender}>
        성별: {isMale ? '남' : '여'}
      </Text>
      </View>

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
  <ScrollView
    style={styles.dropdown}
    contentContainerStyle={{ paddingVertical: 10 }}
    nestedScrollEnabled={true} // 이 속성 추가
  >
    {colleges.map((item, index) => (
      <TouchableOpacity
        key={index}
        style={[styles.listItem, { width: 270 }]}
        onPress={() => handleCollegeSelect(item)}
      >
        <Text style={styles.listItemText}>{item}</Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
)}

      <StyledLabel>학과</StyledLabel>
      <SignInputBox2 placeholder="학과" placeholderTextColor="rgba(0,0,0,0.2)" onChangeText={setmajor} />
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
                  onPress={() => signUp(name, email, studentId, PNumber,college,major,sex, defaultImg,PW )} 
                  disabled={!isFormValid()} 
                  style={{ opacity: isFormValid() ? 1 : 0.5 }} 
>
                  <Sign.LoginText>회원가입</Sign.LoginText>
                </SignUpBox>
    </Container>
    )}
    ListFooterComponent={() => <View style={{ height: 50 }} />} // 하단 여백
  />
  </SafeAreaView>
  </SafeAreaProvider>
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
    marginBottom: 5,
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

const styles2 = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  option: {
    fontSize: 18,
    marginHorizontal: 10,
  },
  selectedGender: {
    fontSize: 18,
  },
});
