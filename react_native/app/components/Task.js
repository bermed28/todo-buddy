import React, {useState} from 'react';
import {View, Alert,Text, StyleSheet,TouchableOpacity} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import {useTheme} from '@react-navigation/native';


function Task(props) {

    const {colors} = useTheme();
    const theme = useTheme();

    const tdid = props.id

    return(
        <View style={[theme.dark ? styles.darkItem : styles.item, styles.container]}>
            <TouchableOpacity onPress={() =>{

                Alert.alert("Complete Task", "Are you sure you want to complete this task?", [
                    {
                        text: "Yes",
                        onPress: () => {
                            const url = `https://birthday-christmas-app-backend.herokuapp.com/api/todo/${tdid}`
                            axios.delete(url).then(
                                (response)=>{
                                    Alert.alert("Success", "Task Completed!", [{text: 'Okay'}])
                                },
                                (error)=>{
                                    console.log(error)
                                }
                            );
                        }
                    },
                    {
                        text: 'No'
                    }
                ])


            }} style={styles.itemLeft}>
                <Icon name={'checkmark-circle-outline'} style={[styles.completed, {color: colors.text}]} size={24}/>
            </TouchableOpacity>

            <Text style={[styles.text, {color: colors.text}]}>{props.text}</Text>

            <TouchableOpacity onPress={() => props.navigation.navigate('ManageTask', {taskName: props.text, taskDate: props.date, taskTime: props.time, taskID: props.id})}>
                <Icon name={'create-outline'} style={[styles.edit, {color: colors.text}]} size={20}/>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    item:{
        backgroundColor: "rgba(247,247,247,1.0)", //"#ffffff",
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        marginHorizontal: 10,
        borderWidth: 1,
        borderColor: "black",
        width: "95%"
    },
    darkItem: {
        backgroundColor: "rgba(70,70,70,1.0)", //"#333333",
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-between',
        marginHorizontal: 10,
        borderWidth: 1,
        borderColor: "white",
        marginBottom: 20,
        width: "95%"
    },
    itemleft:{
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    completed:{
        width: 24,
        height: 24,
        borderRadius: 5,
        marginRight: 15
    },
    text:{
        maxWidth: '80%',
        flex: 1,
        alignItems: 'flex-start',
    },
    circular:{
        width: 12,
        height: 12,
        borderColor: "#05375a",
        borderWidth: 2,
        borderRadius: 5
    }
});
export default Task;