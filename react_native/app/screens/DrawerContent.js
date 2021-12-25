import React, {useState, useEffect, useCallback} from 'react';
import {SafeAreaView, View, StyleSheet, RefreshControl} from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { StackActions } from '@react-navigation/native';
import { Avatar, Title, Caption, Paragraph, Drawer, Text, TouchableRipple, Switch} from 'react-native-paper';
import {AuthContext} from "../components/context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import profilePicture from '../assets/defaultAvatar.jpg';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";


function DrawerContent(props){
    const [user,setUser] = useState({});
    const [isDarkMode, setDarkMode] = useState(false);
    const [remainingTasks, setRemainingTasks] = useState(-1);
    const {signOut} = React.useContext(AuthContext);

    const toggleTheme = () => {
        setDarkMode(!isDarkMode);
    }

    function fetchUserInformation() {
        AsyncStorage.getItem('userToken').then(
            (uid) => {
                const url = `http://localhost:8080/api/users/${uid}`
                console.log(url)
                axios.get(url).then((response) => {
                    console.log("UsrerInfo:", response.data)
                    setUser(response.data)
                    setRemainingTasks(response.data.tasks)
                }, (error) => {
                    console.log("Error:", error)
                });
            }
        );
    }

    const [refreshing, setRefreshing] = useState(false);

    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }


    const onRefresh = useCallback(() => {
        setRefreshing(true);
        wait(1000).then(() => setRefreshing(false));
        fetchUserInformation()
    }, []);

    useEffect(() => {
        fetchUserInformation();
    }, []);

    return (
        <SafeAreaView style={{flex: 1}}>
            <DrawerContentScrollView {...props}
                                     refreshControl={
                                         <RefreshControl
                                             refreshing={refreshing}
                                             onRefresh={onRefresh}
                                             enabled={true}
                                         />
                                     }
            >
                <SafeAreaView style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <SafeAreaView style={{flexDirection: "row", marginTop: 15}}>
                            <Avatar.Image source={profilePicture} size={50}/>
                            <View style={{marginLeft: 15, flexDirection:"column"}}>
                                <Title style={styles.title}>{user.ufirstname + " " + user.ulastname}</Title>
                                <Caption style={styles.ca}>{user.username}</Caption>
                            </View>
                        </SafeAreaView>
                        <SafeAreaView style={styles.row}>
                            <View style={styles.section}>
                                <Paragraph style={[styles.paragraph, styles.caption]}>{remainingTasks}</Paragraph>
                                <Caption style={styles.caption}>Pending Tasks</Caption>
                            </View>
                        </SafeAreaView>
                    </View>
                    <Drawer.Section style={styles.drawerSection}>
                        <DrawerItem
                            label="Home"
                            icon={({color, size}) => <Icon name="home-outline" color={color} size={size}/>}
                            onPress={() => {props.navigation.navigate("Tasks")}}
                        />
                        <DrawerItem
                            label="Profile"
                            icon={({color, size}) => <Icon name="account" color={color} size={size}/>}
                            onPress={() => {props.navigation.navigate("Profile")}}
                        />
                        <DrawerItem
                            label="Settings"
                            icon={({color, size}) => <Icon name="cog-outline" color={color} size={size}/>}
                            onPress={() => {props.navigation.navigate("Settings")}}
                        />
                        <DrawerItem
                            label="About bermedDev"
                            icon={({color, size}) => <Icon name="account-check" color={color} size={size}/>}
                            onPress={() => {props.navigation.navigate("About")}}
                        />
                    </Drawer.Section>
                    <Drawer.Section title={"Preferences"}>
                        <TouchableRipple onPress={() => {toggleTheme()}}>
                            <View style={styles.preference}>
                                <Text>Dark Mode</Text>
                                <View pointerEvents="none">
                                    <Switch value={isDarkMode}/>
                                </View>
                            </View>
                        </TouchableRipple>
                    </Drawer.Section>
                </SafeAreaView>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem
                    label="Sign Out"
                    icon={({color, size}) => <Icon name="exit-to-app" color={color} size={size}/>}
                    onPress={() => {signOut()}}
                />
            </Drawer.Section>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1
    },
    userInfoSection: {
        paddingLeft: 20
    },
    title: {
        fontSize: 18,
        marginTop: 3,
        fontWeight: "bold"
    },
    caption:{
        fontSize: 14,
        lineHeight: 14
    },
    row: {
        marginTop: 20,
        flexDirection: "row",
        alignItems: "center"
    },
    section:{
        flexDirection: "row",
        alignItems: "center",
        marginRight: 15
    },
    paragraph:{
        fontWeight: "bold",
        marginRight: 3
    },
    drawerSection:{
        marginTop: 15
    },
    bottomDrawerSection:{
        marginBottom: 15,
        borderTopColor: "#f4f4f4",
        borderTopWidth: 1
    },
    preference:{
        flexDirection: "row",
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16
    }
});

export default DrawerContent;