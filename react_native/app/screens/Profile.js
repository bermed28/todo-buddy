import React, {useState, useEffect} from 'react';
import {SafeAreaView, Text, Button} from 'react-native';
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const Stack = createNativeStackNavigator();

function ProfileMain({navigation}){
    return (
        <SafeAreaView style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
            <Text>Profile Main</Text>
            <Button title={"Delete Account"} onPress={() => navigation.navigate('DeleteAccount')}/>
        </SafeAreaView>
    );
}

function DeleteAccount(){
    return (
      <SafeAreaView style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <Text>Are You Sure you want to delete your account?</Text>
          <Button title={"Yes I'm Sure, Delete"} color={"red"} onPress={() => console.log("Deleted")}/>
      </SafeAreaView>
    );
}

function Profile({navigation}) {
    const [user, setUser] = useState({});

    function fetchUserInformation() {
        AsyncStorage.getItem('userToken').then(
            (uid) => {
                const url = `http://localhost:8080/api/users/${uid}`
                console.log(url)
                axios.get(url).then((response) => {
                    console.log("UsrerInfo:", response.data)
                    setUser(response.data)
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
        <Stack.Navigator>
            <Stack.Screen
                name={"ProfileMain"}
                component={ProfileMain}
                options={{
                    headerStyle:{
                        backgroundColor: "#009873"
                    },
                    headerTintColor: "#ffff",
                    headerTitle: "My Profile",
                    headerLeft: () => (<Icon.Button name={'ios-menu'} size={25} backgroundColor={'#00000000'} onPress={() => navigation.openDrawer()}/>)
                }}
            />

            <Stack.Screen
                name={"DeleteAccount"}
                component={DeleteAccount}
                options={{
                    headerStyle:{backgroundColor: "#009873"},
                    headerTintColor: "#ffff",
                    headerBackTitle: "Back",
                    headerTitle: "Delete Account"
                }}
            />
        </Stack.Navigator>
  );

}

export default Profile;