import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreens from "./src/screens/home/Home";
import LoginScreens from './src/screens/login/LoginScreens';
import SignUpEmailScreens from './src/screens/Signup/SignUpEmail';
import SignUpDetailScreens from './src/screens/Signup/SignUpDetails';
import MainScreens from './src/screens/mainPage/mainScreen';
import MyPageScreens from './src/screens/myPage/myPage';
import ChatList from './src/screens/chat/ChatList';
import Chat from './src/screens/chat/Chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useEffect} from 'react'
import findPW1 from './src/screens/findPW/findPW1';
import findPW2 from './src/screens/findPW/findPW2';
import AppList from './src/screens/myPage/AppList';
import Notice from './src/screens/myPage/Notice';


const RootStack = createNativeStackNavigator();

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    console.log('Current sign-in state:', isSignedIn);
  }, [isSignedIn]);

  useEffect(() => {
    // 토큰 확인
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('jwtToken');
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
              name="home" 
              options={{ headerShown: false }} 
              children={(props) => <HomeScreens {...props} setIsSignedIn={setIsSignedIn} />} 
            />
            <RootStack.Screen 
              name="mainPage" 
              options={{ headerShown: false }} 
              component={MainScreens} />
            <RootStack.Screen name="myPage" options={{ headerShown: false }} component={MyPageScreens} />
            <RootStack.Screen name="ChatList" options={{ headerShown: false }} component={ChatList} />
            <RootStack.Screen name="Chat" options={{ headerShown: false }} component={Chat} />
            <RootStack.Screen name="AppList" options={{ headerShown: false }} component={AppList} />
            <RootStack.Screen name="Notice" options={{ headerShown: false }} component={Notice} />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}