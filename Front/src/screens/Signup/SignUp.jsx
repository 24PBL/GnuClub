import { Alert, Text, ScrollView } from 'react-native'
import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import * as Sign from '../login/LoginScreens'
import axios from 'axios';



export default function SignUp({navigation}) {

    const Regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //이메일 형식

    const [studentId, setStudentId] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [PW, setPw] = useState("");
    const [nickname, setNickname] = useState("");

    const [emailError, setEmailError] = useState('');
    const [CheckPW, setCheckPw] = useState("");
    const [PwError, setPwError] = useState("");

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


    const handleInputChange = (text) => {
        setInputValue(text);

        setEmailError('');
    };

    const handleSubmit = () => {
        if (!Regex.test(inputValue)){
            setEmailError('올바른 이메일 형식이 아닙니다.')
        }
        console.log('입력된 값:', inputValue);
    };

    //이메일, 닉네임.


    const signUp = async (studentId, email, password, nickname) => {
      console.log("함수 정상 호출")
      try {
        const response = await axios.post('http://10.0.2.2:3000/signup', {
          student_id: studentId,
          email: email,
          password: password,
          nickname: nickname
        });
        console.log('서버 응답' , response.data);
        navigation.navigate("Login");
      } catch (error) {
        // 서버에서 409 상태 코드 반환
        if (error.response && error.response.status === 409) {         
            Alert.alert(
                "중복된 정보", // 경고창 제목
                "이미 존재하는 학번 또는 이메일입니다.", // 경고창
                [{ text: "확인" }] 
            );
            console.log(error)
        } else {
            console.error('회원가입 실패:', error);
        }
    }
  };
  
  return (
    <Sign.Back>
        <Text style={{fontSize : 30, fontWeight : 'bold', textAlign : 'center', marginTop : 70}}>회원가입</Text>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{marginTop : 60}}>
            <Sign.Container>
                <Sign.Label>학번</Sign.Label>
                <SignInputBox2 placeholder="학번" placeholderTextColor = "rgba(0,0,0,0.2)" onChangeText={setStudentId}></SignInputBox2>
                <Sign.Separator/>
                <Sign.Separator/>
                <Sign.Label>이메일</Sign.Label>
                <TextAndTouch><SignInputBox placeholder="아이디@gnu.ac.kr" placeholderTextColor = "rgba(0,0,0,0.2)" value={inputValue} onChangeText={handleInputChange}></SignInputBox><TouchbleBox onPress={handleSubmit}><Text style={{color:'#0091DA', fontSize:17}}>요청</Text></TouchbleBox></TextAndTouch>
                <Text style={{color : "red"}}>{emailError}</Text>
                <Sign.Label>인증번호</Sign.Label>
                <TextAndTouch><SignInputBox placeholder="인증번호" placeholderTextColor = "rgba(0,0,0,0.2)"></SignInputBox><TouchbleBox><Text style={{color:'#0091DA', fontSize:17}}>확인</Text></TouchbleBox></TextAndTouch>
                <Sign.Separator/>
                <Sign.Label>닉네임</Sign.Label>
                <SignInputBox2 placeholder="홍길동" placeholderTextColor = "rgba(0,0,0,0.2)" onChangeText={setNickname}></SignInputBox2>
                <Sign.Separator/>
                <Sign.Label>비밀번호</Sign.Label>
                <SignInputBox2 placeholder="비밀번호" placeholderTextColor = "rgba(0,0,0,0.2)" onChangeText={setPw} secureTextEntry={true}></SignInputBox2>
                <Sign.Separator/>
                <Sign.Label>비밀번호 확인</Sign.Label>
                <SignInputBox2 placeholder="비밀번호 확인" placeholderTextColor = "rgba(0,0,0,0.2)" onChangeText={setCheckPw} secureTextEntry={true}></SignInputBox2>
                <Text style={[{color : "red"} , getPasswordInputStyle()]}>{PwError}</Text>
                <Sign.LoginBox onPress={() => signUp(studentId, inputValue, PW, nickname)}><Sign.LoginText>회원가입</Sign.LoginText></Sign.LoginBox>
            </Sign.Container>
        </ScrollView>
    </Sign.Back>
  )
 }


export const SignInputBox = styled.TextInput`
    border-radius : 10px;
    width : 205px;
    height : 45px;
    padding-left : 10px;
    font-size : 16px;
`

export const SignInputBox2 = styled.TextInput`
    border-radius : 10px;
    width : 270px;
    height : 55px;
    padding-left : 10px;
    font-size : 16px;
    border-width : 1px;
    border-color : black;
`

export const SignTitle = styled.Text`
    font-size : 30px;
    margin-bottom : 10px;
    font-weight : bold;
`

export const CheckBox = styled.TouchableOpacity`
    width : 260px;
    height : 45px;
    border-radius : 10px;
    background-color : #0091DA;
    justify-content : center;
    align-items : center;
    margin-top : 30px;
`

export const CheckText = styled.Text`
    color : white;
    font-weight : bold;
`
export const TouchbleBox = styled.TouchableOpacity`
    width : 50px;
    height : 40px;
    border-radius : 10px;
    justify-content : center;
    align-items : center;
    border-color : #0091DA;
    border-width : 1px;
`
export const TextAndTouch = styled.View`
    border-width : 1px;
    border-color : black;
    border-radius : 10px;
    flex-direction : row;
    width : 270px;
    height : 55px;
    justify-content : center;
    align-items : center;
`