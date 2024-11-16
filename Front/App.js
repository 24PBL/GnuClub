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

const RootStack = createNativeStackNavigator();

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);

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
            <RootStack.Screen 
              name="SignUpEmail" 
              options={{ headerShown: false }} 
              component={SignUpEmailScreens} 
            />
            <RootStack.Screen 
              name="SignUpDetail" 
              options={{ headerShown: false }} 
              component={SignUpDetailScreens} 
            />
          </>
        ) : (
          <>
            <RootStack.Screen name="Home" options={{ headerShown: false }} component={HomeScreens} />
            <RootStack.Screen name="mainPage" options={{ headerShown: false }} component={MainScreens}/>
            <RootStack.Screen name="myPage" options={{ headerShown: false }} component={MyPageScreens} />
            <RootStack.Screen name="ChatList" options={{ headerShown: false }} component={ChatList} />
            <RootStack.Screen name="Chat" options={{ headerShown: false }} component={Chat} />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}