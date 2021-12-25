import React, {useState, useEffect, useMemo} from 'react';
import {SafeAreaView, ActivityIndicator} from "react-native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import SplashScreen from "./SplashScreen";
import LogIn from "./LogIn";
import SignUp from "./SignUp";
import ToDo from "./ToDo";
import { AuthContext } from '../components/context';

const Stack = createNativeStackNavigator();

function RootStackScreen(){

    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name={"SplashScreen"} component={SplashScreen}/>
          <Stack.Screen name={"LogIn"} component={LogIn} options={{headerBackTitle: "Back"}}/>
          <Stack.Screen name={"SignUp"} component={SignUp} options={{headerBackTitle: "Back"}}/>
        </Stack.Navigator>
    );
}

export default RootStackScreen;