import React, {useState, useEffect} from 'react';
import {StyleSheet, TouchableOpacity, Text, View, Image} from "react-native";
import {createDrawerNavigator} from "@react-navigation/drawer";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Icon from 'react-native-vector-icons/Ionicons';

import Settings from "./Settings";
import Profile from "./Profile";
import Tasks from "./Tasks";
import DrawerContent from "./DrawerContent";
import About from './About';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";


const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();


function ToDoScreen(){
    const [user, setUser] = useState({});
    const [remainingTasks, setRemainingTasks] = useState(-1);
    function fetchUserInformation() {
        AsyncStorage.getItem('userToken').then(
            (uid) => {
                const url = `https://birthday-christmas-app-backend.herokuapp.com//api/users/${uid}`
                axios.get(url).then((response) => {
                    setUser(response.data)
                    setRemainingTasks(response.data.tasks)
                }, (error) => {
                    console.log("Error:", error)
                });
            }
        );
    }
    useEffect(() => {
        fetchUserInformation();
    }, []);

    return (

        <Tab.Navigator
            initialRouteName="Tasks"
            screenOptions={{
                backgroundColor: "#ffff",
                showLabel: false,
                tabBarStyle: {
                    position: "absolute",
                    bottom: 25,
                    left: 20,
                    right: 20,
                    elevation: 0,
                    backgroundColor: "#009873",
                    borderRadius: 15,
                    height: 90,
                    ...styles.shadow
                }
            }}
        >
            <Tab.Screen
                name="Tasks"
                component={Tasks}
                options={{
                    headerShown: false,
                    tabBarLabel: "My Tasks",
                    tabBarActiveTintColor: "white",
                    tabBarLabelStyle: {fontSize: 12},
                    tabBarIcon: ({focused}) => (<Icon name={'checkbox-outline'} color={focused ? "white" : "#696969"} size={26}/>)
                }}
            />
            <Tab.Screen
                name={"Profile"}
                component={Profile}
                options={{
                    tabBarActiveTintColor: "white",
                    tabBarLabelStyle: {fontSize: 12},
                    tabBarIcon: ({focused}) => (
                        <View>
                            <Icon name={'ios-person'} color={focused ? "white" : "#696969"} size={26}/>
                        </View>
                    ),
                    headerShown: false
                }}

            />
            <Tab.Screen
                name="Settings"
                component={Settings}
                options={{
                    tabBarLabelStyle: {fontSize: 12},
                    headerShown: false,
                    tabBarActiveTintColor: "white",
                    tabBarIcon: ({focused}) => (<Icon name={'cog-outline'} color={focused ? "white" : "#696969"} size={26}/>)
                }}
            />
        </Tab.Navigator>
    );
}
function ToDo() {
    return (
        <Drawer.Navigator drawerContent={props => <DrawerContent {...props}/>}>
            <Drawer.Screen name={"ToDoMain"} component={ToDoScreen} options={{headerShown: false}}/>
            <Drawer.Screen name={"About"} component={About} options={{headerShown: false}}/>
        </Drawer.Navigator>
        // <Text>Test</Text>
    );
}

const styles = StyleSheet.create({
    shadow:{
        shadowColor: "#05375a",
        shadowOffset:{
            width: 0,
            height: 10
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5
    }
})
export default ToDo;