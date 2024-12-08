import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreens from "./src/screens/home/Home";
import LoginScreens from './src/screens/login/LoginScreens';
import SignUpEmailScreens from './src/screens/Signup/SignUpEmail';
import SignUpDetailScreens from './src/screens/Signup/SignUpDetails';
import MainScreens from './src/screens/mainPage/mainScreen';
import MyPageScreens from './src/screens/myPage/myPage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useEffect} from 'react'
import findPW1 from './src/screens/findPW/findPW1';
import findPW2 from './src/screens/findPW/findPW2';
import AppList from './src/screens/myPage/AppList';
import Notice from './src/screens/myPage/Notice';
import ClubDetail from './src/screens/clubDetail/ClubDetail';
import Application from './src/screens/clubDetail/Application';
import CreatePost from './src/screens/clubDetail/CreatePost';
import MorePromotion from './src/screens/mainPage/morePromotion';
import ClubFeed from './src/screens/club/clubFeed';
import MemberList from './src/screens/clubDetail/MemberList';
import ClubNotice from './src/screens/clubDetail/ClubNotice'
import Board from './src/screens/clubDetail/Board'
import ApplyList from './src/screens/clubDetail/ApplyList'
import Apply from './src/screens/clubDetail/Apply'






const RootStack = createNativeStackNavigator();

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    console.log('Current sign-in state:', isSignedIn);
  }, [isSignedIn]);

  useEffect(() => {
    // 토큰 확인
    const checkToken = async () => {
      const token = await  AsyncStorage.getItem('jwtToken');
      setIsSignedIn(!!token); // 토큰이 있으면 true, 없으면 false
    };
    checkToken();
  }, []);

  return (

    <NavigationContainer>
      <RootStack.Navigator>
        {!isSignedIn ? (
          <>
            <RootStack.Screen 
              name="Login" 
              options={{ headerShown: false }} 
              // setIsSignedIn을 LoginScreens에 전달
              children={(props) => <LoginScreens {...props} setIsSignedIn={setIsSignedIn} />} 
            />
            <RootStack.Screen name="SignUpEmail" options={{ headerShown: false }} component={SignUpEmailScreens}/>
            <RootStack.Screen name="SignUpDetail" options={{ headerShown: false }} component={SignUpDetailScreens}/>
            <RootStack.Screen name="findPW1" options={{headerShown : false}} component={findPW1}/>
            <RootStack.Screen name="findPW2" options={{headerShown : false}} component={findPW2}/>
          </>
        ) : (
          <>
            <RootStack.Screen 
              name="homeScreen" 
              options={{ headerShown: false }}
              children={(props) => <HomeScreens {...props} setIsSignedIn={setIsSignedIn} />} 
            />
            <RootStack.Screen 
              name="mainPage" 
              options={{ headerShown: false }} 
              component={MainScreens} />
            <RootStack.Screen name="myPage" options={{ headerShown: false }} component={MyPageScreens} />
            <RootStack.Screen name="AppList" options={{ headerShown: false }} component={AppList} />
            <RootStack.Screen name="Notice" options={{ headerShown: false }} component={Notice} />
            <RootStack.Screen name="ClubDetail" options={{ headerShown: false }} component={ClubDetail} />
            <RootStack.Screen name="Application" options={{ headerShown: false }} component={Application} />
            <RootStack.Screen name="CreatePost" options={{ headerShown: false }} component={CreatePost} />
            <RootStack.Screen name="MorePromotion" options={{ headerShown: false }} component={MorePromotion} />
            <RootStack.Screen name="MemberList" options={{ headerShown: false }} component={MemberList} />
            <RootStack.Screen name="ClubNotice" options={{ headerShown: false }} component={ClubNotice} />
            <RootStack.Screen name="Board" options={{ headerShown: false }} component={Board} />
            <RootStack.Screen name="ApplyList" options={{ headerShown: false }} component={ApplyList} />
            <RootStack.Screen name="Apply" options={{ headerShown: false }} component={Apply} />
       </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>

  );
}