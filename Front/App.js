import { useState } from "react"
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreens from "./src/screens/home/Home"
import LoginScreens from './src/screens/login/LoginScreens';
import SignUpScreens from './src/screens/Signup/SignUp';
import mainScreens from './src/screens/mainPage/mainScreen';
import myPageScreens from './src/screens/myPage/myPage'
import Chatlist from './src/screens/chat/ChatList'

const RootStack = createNativeStackNavigator()

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  return (
    <NavigationContainer>
      <RootStack.Navigator>
        {!isSignedIn ? (
        <>
          <RootStack.Screen name="Home" options={{headerShown : false}} component={HomeScreens}/>
          <RootStack.Screen name="Login" options={{headerShown : false}} component={LoginScreens}/>
          <RootStack.Screen name="SignUp" options={{headerShown : false}} component={SignUpScreens}/>
        </>
        ) : (
          <>
          <RootStack.Screen name="mainPage" options={{headerShown : false}} component={mainScreens}/>
          <RootStack.Screen name="myPage" options={{headerShown : false}} component={myPageScreens}/>
          <RootStack.Screen name="ChatList" options={{headerShown : false}} component={Chatlist}/>
        </>
        )}
      </RootStack.Navigator>
     </NavigationContainer>
  );
}

