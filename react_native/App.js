import React, {useEffect, useMemo, useReducer} from 'react';
import {Text, SafeAreaView} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {DancingScript_400Regular, useFonts} from "@expo-google-fonts/dancing-script";
import AsyncStorage from '@react-native-async-storage/async-storage';

import ToDo from "./app/screens/ToDo";
import RootStackScreen from "./app/screens/RootStackScreen";
import {AuthContext} from "./app/components/context";



const Stack = createNativeStackNavigator();


function App() {
    console.log("App executed");
    const [loaded] = useFonts({
        DancingScript_400Regular,
    });

    // const [isLoading, setIsLoading] = useState(true);
    // const [userToken, setUserToken] = useState(null);

    const initialLoginState = {
        isLoading: true,
        userName: null,
        userToken: null
    };

    const loginReducer = (prevState, action) => {
        switch (action.type){
            case 'RETREIVE_TOKEN':
                return {
                    ...prevState,
                    userToken: action.token,
                    isLoading: false
                }
            case 'LOGIN':
                return {
                    ...prevState,
                    userName: action.id,
                    userToken: action.token,
                    isLoading: false
                }
            case 'LOGOUT':
                return {
                    ...prevState,
                    userName: null,
                    userToken: null,
                    isLoading: false
                }
        }
    }

    const [loginState, dispatch] = useReducer(loginReducer, initialLoginState)


    const authContext = useMemo(() => ({
        signIn: async (foundUser) => {
            let userToken = null;
            try{
                userToken = String(foundUser.uid);
                console.log("foundUser:",JSON.stringify(foundUser))
                await AsyncStorage.setItem('userToken', userToken);
            } catch(e){
                console.log(e);
            }

            dispatch({type: 'LOGIN', id: foundUser.username, token: foundUser.uid})
        },
        signOut: async () => {
            try{
                await AsyncStorage.removeItem('userToken');
                console.log(AsyncStorage.getItem('userToken'))
            } catch(e){
                console.log(e);
            }
            dispatch({type: "LOGOUT"})
        },
    }));

    useEffect(() => {
        setTimeout(async () => {
            let userToken = null;
            try{
                userToken = await AsyncStorage.getItem('userToken');
            } catch(e){
                console.log(e);
            }
            dispatch({type: "RETREIVE_TOKEN", token: userToken})
        }, 1000)
    }, []);

    if (!loaded) {
        return null;
    }

    if(loginState.isLoading){
        return(
            <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: "center" }}>
                <Text>Bermed Dev Studios</Text>
            </SafeAreaView>
        );
    }

    return (
        <AuthContext.Provider value={authContext}>
            <NavigationContainer>
                {loginState.userToken !== null ? <ToDo/> : <RootStackScreen/>}
            </NavigationContainer>
        </AuthContext.Provider>
    );
}

export default App;
