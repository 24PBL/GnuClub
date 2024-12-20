import React, { useState, useEffect } from 'react';
import { Text, Alert, TouchableOpacity, FlatList, StyleSheet, View, ScrollView} from "react-native";
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
  const [collage, setcollage] = useState(""); 
  const [iscollageListOpen, setIscollageListOpen] = useState(false); 
  const [major, setmajor] = useState(""); 

  const [PError, setPError] = useState(""); 
  const [filteredMajors, setFilteredMajors] = useState([]); 
  const [isMajorListOpen, setIsMajorListOpen] = useState(false);
  const [collageNum, setcollageNum] = useState(false);

  const collages = [
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

  const collageMajorsMap = {
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
    '건설환경공학대학':[
    "건설시스템공학과",
    "인테리어재료공학과",
    "조경학과",
    "환경공학과",
    "디자인비즈니스학과"],
    '본부대학':[
    "휴먼헬스케어학과"]
    }

    //선택 학과 업데이트
  const handleMajorSelect = (selectedMajor) => {
      setmajor(selectedMajor); 
      setIsMajorListOpen(false);
    };

  // 단과대학 선택 처리
  const handlecollageSelect = (selectedcollage) => {
    const selectedIndex = (collages.indexOf(selectedcollage)+1);
    setcollage(selectedcollage)
    setcollageNum(selectedIndex);
    setFilteredMajors(collageMajorsMap[selectedcollage] || []); // 선택된 단과 대학의 학과 리스트로 업데이트
    setIscollageListOpen(false); 
    setIsMajorListOpen(false); 
};


// 학과 필터링 (자동완성)
const handleMajorChange = (text) => {
  setmajor(text);
  const filtered = (collageMajorsMap[collage] || []).filter((major) =>
      major.includes(text)
  );
  setFilteredMajors(filtered); // 필터링된 리스트로 업데이트
  setIsMajorListOpen(filtered.length > 0); // 자동완성 목록 표시
};



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

  const signUp = async (name, email, PW, studentId, PNumber, collage, major) => {
    try {
      const response = await axios.post('http://10.0.2.2:8001/auth/join/fill-user-info', {
        userName: name,
        userEmail: email,
        userPassword : PW,
        userNum: studentId,
        userPhone: PNumber,
        collage: collage,
        userLesson : major
      });
  
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
  return PW && CheckPW && name && (PW === CheckPW) && !HardPwError && studentId && PNumber && major && collage;
};

  // 비밀번호 유효성 검사
  const PNumberError = (text) => {
    setPNumber(text);
    const PNumberRegex = /^010\d{8}$/;
    if (!PNumberRegex.test(text)) {
      setPError('잘못된 전화번호 형식입니다.');
    } else {
      setPError('');
    }
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
      <StyledLabel>학번</StyledLabel>
      <SignInputBox2 placeholder="학번" placeholderTextColor="rgba(0,0,0,0.2)" onChangeText={setStudentId} />
      <StyledLabel>이름</StyledLabel>
      <SignInputBox2 placeholder="이름" placeholderTextColor="rgba(0,0,0,0.2)" onChangeText={setname} />
      <StyledLabel>전화번호</StyledLabel>
      <SignInputBox2 placeholder="전화번호를 - 없이 입력하세요." placeholderTextColor="rgba(0,0,0,0.2)" onChangeText={PNumberError} />
      <Text style={{ color: "red" , marginLeft:50, marginTop:5}}>{PError}</Text>

      {/* 토글 버튼 */}
      <StyledLabel>단과 대학</StyledLabel>
      <TouchableOpacity onPress={() => setIscollageListOpen(!iscollageListOpen)} style={styles.toggleButton}>
        <Text style={styles.toggleButtonText}>
          {collage ? collage : '단과 대학 선택'}
        </Text>
      </TouchableOpacity>

      {/* 단과 대학 리스트 */}
      {iscollageListOpen && (
  <ScrollView
    style={styles.dropdown}
    contentContainerStyle={{ paddingVertical: 10 }}
    nestedScrollEnabled={true} // 이 속성 추가
    showsVerticalScrollIndicator={false}
  >
    {collages.map((item, index) => (
      <TouchableOpacity
        key={index}
        style={[styles.listItem, { width: 270 }]}
        onPress={() => handlecollageSelect(item)}
      >
        <Text style={styles.listItemText}>{item}</Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
)}

      <StyledLabel>학과</StyledLabel>
      <SignInputBox2 placeholder="학과" placeholderTextColor="rgba(0,0,0,0.2)"value={major} onChangeText={handleMajorChange} />

      {isMajorListOpen && (
      <ScrollView
        style={styles3.dropdown}
        contentContainerStyle={{ paddingVertical: 10 }}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false} 

      >
        {filteredMajors.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles3.listItem, { width: 270 }]}
            onPress={() => handleMajorSelect(item)}
          >
            <Text style={styles3.listItemText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>)}
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
                  onPress={() => signUp(name, email, PW, studentId, PNumber , collageNum , major )} 
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

const styles3 = {
  ...styles, 
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
