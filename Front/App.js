import { useState } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreens from "./src/screens/home/Home";
import LoginScreens from './src/screens/login/LoginScreens';
import SignUpScreens from './src/screens/Signup/SignUp';
import MainScreens from './src/screens/mainPage/mainScreen';
import MyPageScreens from './src/screens/myPage/myPage';
import ChatList from './src/screens/chat/ChatList';
import Chat from './src/screens/chat/Chat';

const RootStack = createNativeStackNavigator();

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);

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
              name="SignUp" 
              options={{ headerShown: false }} 
              component={SignUpScreens} 
            />
          </>
        ) : (
          <>
            <RootStack.Screen name="Home" options={{ headerShown: false }} component={HomeScreens} />
            <RootStack.Screen name="mainPage" options={{ headerShown: false }} component={MainScreens} />
            <RootStack.Screen name="myPage" options={{ headerShown: false }} component={MyPageScreens} />
            <RootStack.Screen name="ChatList" options={{ headerShown: false }} component={ChatList} />
            <RootStack.Screen name="Chat" options={{ headerShown: false }} component={Chat} />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
