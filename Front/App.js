import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreens from "./src/screens/home/Home"
import ProfileScreens from './src/screens/profile/Profile';
import LoginScreens from './src/screens/login/LoginScreens';
import VerificationScreens from './src/screens/Signup/Verification';
import SignUpScreens from './src/screens/Signup/SignUp';


const RootStack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen name="Home" options={{headerShown : false}} component={HomeScreens}/>
        <RootStack.Screen name="Login" options={{headerShown : false}} component={LoginScreens}/>
        <RootStack.Screen name="Verification" options={{headerShown : false}} component={VerificationScreens}/>
        <RootStack.Screen name="Profile" options={{headerShown : false}} component={ProfileScreens} />
        <RootStack.Screen name="SignUp" options={{headerShown : false}} component={SignUpScreens}/>
      </RootStack.Navigator>
     </NavigationContainer>
  );
}

