import React, {useState, useEffect, useCallback} from 'react';
import {
    ScrollView,
    View,
    Text,
    TextInput,
    RefreshControl,
    StyleSheet,
    Button,
    Dimensions,
    Platform,
    StatusBar, TouchableOpacity, Alert
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as Animatable from 'react-native-animatable';
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import DatePicker from 'react-native-datepicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {NavigationEvents} from "react-navigation";

import Task from '../components/Task';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import {LinearGradient} from "expo-linear-gradient";

const Stack = createNativeStackNavigator();

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

function ToDoListMain({navigation}){

    const [currentTasks, setCurrentTasks] = useState([]);
    const [numTasks, setNumTasks] = useState(0);

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        wait(1000).then(() => setRefreshing(false));
        fetchTasks()
    }, []);

    function fetchTasks(){

        AsyncStorage.getItem('userToken').then(
            (uid) => {
                const url = `https://birthday-christmas-app-backend.herokuapp.com/api/todo/${uid}`
                console.log(url)
                axios.get(url).then((response) => {
                    setCurrentTasks(response.data)
                    setNumTasks(response.data.length)
                }, (error) => {
                    console.log("Error:", error)
                });
            }
        );
    }
    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    enabled={true}
                />
            }
        >
            <View style={styles.items}>
                {
                    currentTasks.map((item, index) => {
                        return <Task key={index} text={item.tdtask} id={item.tdid} time={item.tdtime} date={item.tddate} navigation={navigation}/>
                    })
                }
            </View>
            <Button title={"Create New Task"} onPress={() => navigation.navigate('CreateTask')}/>

        </ScrollView>
    );
}

function ManageTask({route, navigation}){
    const {taskName, taskDate, taskTime} = route.params;

    const tempDate = taskDate.split('-')
    const tempTime = taskTime.split(':')

    const placeholderDate = new Date(parseInt(tempDate[0]), parseInt(tempDate[1]) - 1, parseInt(tempDate[2]), parseInt(tempTime[0]), parseInt(tempTime[1]), parseInt(tempTime[2]))

    const [tName, setTaskName] = useState(taskName);
    const [date, setDate] = useState(new Date())
    const [time, setTime] = useState(new Date());
    const [taskNameEntered, setTaskNameEntered] = useState(false);
    const [editedDate, setEditedDate] = useState(false);
    const [editedTime, setEditedTime] = useState(false);

    const [uid, setUID] = useState(-1);
    const tdid = route.params.taskID

    console.log("TDID:", tdid)
    function fetchUserInformation() {
        AsyncStorage.getItem('userToken').then((uid) => {setUID(uid);});
    }
    useEffect(() => {
        fetchUserInformation();
    }, []);

    function formatTime(hours, minutes, seconds){
        const result = (hours <= 9 ? "0" + hours : hours) + ":" + (minutes <= 9 ? "0" + minutes : minutes) + ":" + (seconds <= 9 ? "0" + seconds : seconds)
        console.log('FORMATTED TIME:', result)
        return result
    }

    function formatDate(year, month, day){
        if(month <= 9) month = "0" + month;
        if(day <= 9) day = "0" + day;

        const result = year + "-" + month + "-" + day
        console.log("FORMATTED DATE:", result)
        return result
    }

    function handleTaskEdit(navigation) {
        console.log("CHOSEN DATE:",date, "DEFAULT DATE:", placeholderDate)
        const defaultTime = formatTime(placeholderDate.getHours(), placeholderDate.getMinutes(), placeholderDate.getSeconds())
        const inputTime = formatTime(time.getHours(), time.getMinutes(), time.getSeconds())
        const defaultDate = formatDate(placeholderDate.getFullYear(), (placeholderDate.getMonth() + 1), placeholderDate.getDate())
        const inputDate = formatDate(date.getFullYear(),date.getMonth(),date.getDate())
        console.log("DEFAULT TIME:", defaultTime)
        const json = {tdtask: tName, tdtime: editedTime ? inputTime : defaultTime , tddate: editedDate ? inputDate : defaultDate, uid: uid};
        console.log("JSON:",json)
        const url = `https://birthday-christmas-app-backend.herokuapp.com/api/todo/${tdid}`
        axios.put(url, json, {
            headers: {'Content-Type': 'application/json'}
        })
            .then((response) => {
                    Alert.alert("Success", "Task Successfully Edited", [{text: "Okay"}])
                    navigation.goBack();
                }, (error) => {
                    console.log(error)
                    Alert.alert("Invalid Input", "Please Try Again", [{text: "Okay"}]);
                }
            );

    }
    console.log(date)
    return (
        <View style={styles.container}>
            <StatusBar backgroudColor={"#009387"} barStyle={'light-cotent'}/>
            <Animatable.View animation={'fadeInUpBig'} style={styles.footer}>
                <Text style={styles.text_footer}>Task Name</Text>
                <View style={styles.action}>
                    <FontAwesome name={'user-o'} color={"#05375a"} size={20}/>
                    <TextInput
                        autoCapitalize={'words'}
                        placeholder={taskName}
                        style={styles.textInput}
                        onChangeText={
                            (task) => {
                                if(task.length !== 0){
                                    setTaskName(task);
                                    setTaskNameEntered(true);
                                } else {
                                    setTaskName(task);
                                    setTaskNameEntered(false);
                                }
                            }
                        }
                    />
                    {taskNameEntered ?
                        <Animatable.View animation={'bounceIn'}>
                            <Feather name={'check-circle'} color={'green'} size={20}/>
                        </Animatable.View>
                        : null
                    }

                </View>
                <Text style={[styles.text_footer, {marginTop: 25}]}>Remind Me By:</Text>
                <View style={styles.action}>
                    <FontAwesome name={'calendar'} color={"#05375a"} size={20}/>
                    <DateTimePicker
                        style={{width: 150}}
                        value={editedDate ? date : placeholderDate}
                        mode="date"
                        dateFormat="longdate"
                        onChange={(event, date) => {setEditedDate(true); setDate(date);}}
                    />
                </View>
                <Text style={[styles.text_footer, {marginTop: 25}]}>Remind Me At:</Text>
                <View style={styles.action}>
                    <FontAwesome name={'clock-o'} color={"#05375a"} size={25}/>
                    <DateTimePicker
                        style={{width: 115}}
                        value={editedTime ? time : placeholderDate}
                        mode="time"
                        onChange={(event, time) => {setEditedTime(true); setTime(time)}}
                    />

                </View>
                <View style={styles.button}>
                    <TouchableOpacity onPress={() => {handleTaskEdit(navigation);}} style={[styles.signIn, {borderWidth: 1, borderColor: "#009387"}]}>
                        <Text style={[styles.textSign, {color: "#009387"}]}>Save Changes</Text>
                    </TouchableOpacity>
                </View>
            </Animatable.View>
        </View>
    );
}



function CreateTask({navigation}){
    const [taskName, setTaskName] = useState('');
    const [date,setDate] = useState(new Date())
    const [time, setTime] = useState(new Date());
    const [taskNameEntered, setTaskNameEntered] = useState(false);


    const [uid, setUID] = useState(-1);

    function fetchUserInformation() {
        AsyncStorage.getItem('userToken').then((uid) => {setUID(uid);});
    }
    useEffect(() => {
        fetchUserInformation();
    }, []);


    function handleTaskCreation(navigation){
        if(taskName === "") {
            Alert.alert("Empty Fields", "Input Fields Cannot Be Empty", [{text: 'Okay'}])
        } else {
            const inputTime = time.getHours() + ":" + time.getMinutes() + ":" +time.getSeconds()
            const inputDate = date.getFullYear() + "-" + date.getMonth() + '-' + date.getDay()
            const json = {tdtask: taskName, tdtime: inputTime, tddate: inputDate, uid: uid};
            const url = 'https://birthday-christmas-app-backend.herokuapp.com/api/todo'
            axios.post(url, json, {
                headers: {'Content-Type': 'application/json'}
            })
                .then((response) => {
                        Alert.alert("Success", "Task Successfully Created", [{text: "Okay"}])
                        navigation.goBack();
                    }, (error) => {
                        console.log(error)
                        Alert.alert("Invalid Input", "Please Try Again", [{text: "Okay"}]);
                    }
                );
        }

    }


    return (
        <View style={styles.container}>
            <StatusBar backgroudColor={"#009387"} barStyle={'light-cotent'}/>
            <Animatable.View animation={'fadeInUpBig'} style={styles.footer}>
                <Text style={styles.text_footer}>Task Name</Text>
                <View style={styles.action}>
                    <FontAwesome name={'user-o'} color={"#05375a"} size={20}/>
                    <TextInput
                        autoCapitalize={'words'}
                        placeholder={"Enter Task Name"}
                        style={styles.textInput}
                        onChangeText={
                            (task) => {
                                if(task.length !== 0){
                                    setTaskName(task);
                                    setTaskNameEntered(true);
                                } else {
                                    setTaskName(task);
                                    setTaskNameEntered(false);
                                }
                            }
                        }
                    />
                    {taskNameEntered ?
                        <Animatable.View animation={'bounceIn'}>
                            <Feather name={'check-circle'} color={'green'} size={20}/>
                        </Animatable.View>
                        : null
                    }

                </View>
                <Text style={[styles.text_footer, {marginTop: 25}]}>Remind Me By:</Text>
                <View style={styles.action}>
                    <FontAwesome name={'calendar'} color={"#05375a"} size={20}/>
                    <DateTimePicker
                        style={{width: 150}}
                        value={date}
                        mode="date"
                        dateFormat="longdate"
                        onChange={(event, date) => {setDate(date)}}
                    />
                </View>
                <Text style={[styles.text_footer, {marginTop: 25}]}>Remind Me At:</Text>
                <View style={styles.action}>
                    <FontAwesome name={'clock-o'} color={"#05375a"} size={25}/>
                    <DateTimePicker
                        style={{width: 115}}
                        value={time}
                        mode="time"
                        onChange={(event, time) => {setTime(time)}}
                    />

                </View>
                <View style={styles.button}>
                    <TouchableOpacity onPress={() => {handleTaskCreation(navigation);}} style={[styles.signIn, {borderWidth: 1, borderColor: "#009387"}]}>
                        <Text style={[styles.textSign, {color: "#009387"}]}>Create Task</Text>
                    </TouchableOpacity>
                </View>
            </Animatable.View>
        </View>
    );
}

function Tasks({navigation}) {

    const [user, setUser] = useState({});
    const [numTasks, setNumTasks] = useState(0);

    function fetchUserInformation() {
        AsyncStorage.getItem('userToken').then(
            (uid) => {
                const url = `https://birthday-christmas-app-backend.herokuapp.com/api/users/${uid}`
                console.log(url)
                axios.get(url).then((response) => {
                    setUser(response.data)
                    setNumTasks(response.data.tasks)
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
                name={"TasksMain"}
                component={ToDoListMain}
                options={{
                    headerTitle: "My Tasks",
                    headerTintColor: "#ffff",
                    headerStyle: {
                        backgroundColor: "#009873"
                    },
                    headerLeft: () => (<Icon.Button name={'ios-menu'} size={25} backgroundColor={'#00000000'} onPress={() => navigation.openDrawer()}/>)
                }}
            />
            <Stack.Screen
                name={"ManageTask"}
                component={ManageTask}
                options={{
                    headerBackTitle: "Back",
                    headerTitle: "Edit Task",
                    headerTintColor: "#ffff",
                    headerStyle: {
                        backgroundColor: "#009873"
                    }
                }}
            />

            <Stack.Screen
                name={"CreateTask"}
                component={CreateTask}
                options={{
                    headerBackTitle: "Back",
                    headerTitle: "Create New Task",
                    headerTintColor: "#ffff",
                    headerStyle: {
                        backgroundColor: "#009873"
                    }
                }}
            />

        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    items:{
        marginTop: 30
    },
    container:{
        flex: 1,
        backgroundColor: "#ffff",
        minHeight: Math.round(Dimensions.get('screen').height)
    },
    header:{
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer:{
        flex: 3,
        backgroundColor: "#ffff",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: "#ffff",
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer:{
        color: "#05375a",
        fontSize: 18
    },
    action:{
        flexDirection: "row",
        marginTop:10,
        borderBottomWidth: 1,
        borderBottomColor: "#f2f2f2",
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: "#05375a",
    },
    button: {
        alignItems: "center",
        marginTop: 50
    },
    signIn:{
        width: "100%",
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign:{
        fontSize: 18,
        fontWeight: 'bold'
    }, errorMsg: {
        marginTop: 10,
        color: 'red'
    },
    dateButton:{
        width: "50%",
        marginTop: 15,
        marginBottom: 15,
        paddingLeft: 25,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    }
});
export default Tasks;