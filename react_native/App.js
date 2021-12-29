import React, {useState, useEffect, useMemo, useReducer} from 'react';
import {Text, SafeAreaView, StatusBar} from 'react-native';
import {
    NavigationContainer,
    DarkTheme as NavigationDarkTheme,
    DefaultTheme as NavigationDefaultTheme,
    useTheme
} from '@react-navigation/native';
import {DancingScript_400Regular, useFonts} from "@expo-google-fonts/dancing-script";
import AsyncStorage from '@react-native-async-storage/async-storage';

import ToDo from "./app/screens/ToDo";
import RootStackScreen from "./app/screens/RootStackScreen";
import {AuthContext} from "./app/components/context";
import {Provider as PaperProvider, DefaultTheme as PaperDefaultTheme, DarkTheme as PaperDarkTheme} from 'react-native-paper';


function App() {

    const [isDarkMode, setDarkMode] = useState(false);

    const [loaded] = useFonts({
        DancingScript_400Regular,
    });

    const initialLoginState = {
        isLoading: true,
        userName: null,
        userToken: null,
    };

    const CustomDefaultTheme = {
        ...NavigationDefaultTheme,
        ...PaperDefaultTheme,
        colors: {
            ...NavigationDefaultTheme.colors,
            ...PaperDefaultTheme.colors,
            background: "#ffffff",
            text: "#333333"
        }
    }

    const CustomDarkTheme = {
        ...NavigationDarkTheme,
        ...PaperDarkTheme,
        colors: {
            ...NavigationDarkTheme.colors,
            ...PaperDarkTheme.colors,
            background: "#333333",
            text: "#ffffff"
        }
    }

    const loginReducer = (prevState, action) => {
        switch (action.type){
            case 'RETREIVE_TOKEN':
                return {
                    ...prevState,
                    darkMode: action.dark,
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
                await AsyncStorage.setItem('userToken', userToken);
            } catch(e){
                console.log(e);
            }

            dispatch({type: 'LOGIN', id: foundUser.username, token: foundUser.uid})
        },
        signOut: async () => {
            try{
                await AsyncStorage.removeItem('userToken');
            } catch(e){
                console.log(e);
            }
            dispatch({type: "LOGOUT"})
        },
        toggleTheme:  (value) => {
            setDarkMode(!value)
        }

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

        <PaperProvider theme={isDarkMode ? CustomDarkTheme : CustomDefaultTheme}>
            <AuthContext.Provider value={authContext}>
                <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'}/>
                <NavigationContainer theme={isDarkMode ? CustomDarkTheme : CustomDefaultTheme}>
                    {loginState.userToken !== null ? <ToDo/> : <RootStackScreen/>}
                </NavigationContainer>
            </AuthContext.Provider>
        </PaperProvider>
    );
}

export default App;
