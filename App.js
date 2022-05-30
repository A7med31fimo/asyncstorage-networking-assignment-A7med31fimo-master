import React, { useState, useEffect } from 'react';
import {
    KeyboardAvoidingView, ScrollView, StyleSheet,
    Text, TextInput, TouchableOpacity, View,ActivityIndicator
} from 'react-native';
import { Button, Icon } from 'react-native-elements'
import Task from './components/Item'
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function App() {

    const [taskItems, setTaskItems] = useState([]);
    const [task, setTask] = useState('');
    let Todos="Todos";
    let defaultvAL="defaultvAL"
    const changeEvent = (val) => {
        setTask(val);
    };

    const submit = (text) => {
        if (text === '') {
            setTaskItems(taskItems)
        } else {
            setTaskItems(
                (prev) => {
                    return [
                        {userId: 1, id:(Math.random()).toString(), title: text, completed: false},
                        ...prev
                    ];
                }
            )
            AsyncStorage.setItem(Todos,JSON.stringify(taskItems));
        }
    }


    const rem = (id) => {
        setTaskItems((previousTasks) => {
            return previousTasks.
                filter(todo => todo.id != id)
        })
        AsyncStorage.setItem(Todos, JSON.stringify(taskItems));
    };
    let flag=false;
    async function y(f){
         f=true;
         await sleep(3000);
         f=false;
    }
    
   async function load() {
            const getDataResponse = await fetch(
                `https://jsonplaceholder.typicode.com/todos?userId=1`);
    
              let todolist = await getDataResponse.json();
            AsyncStorage.setItem(Todos, JSON.stringify(todolist));
            AsyncStorage.setItem(defaultvAL, JSON.stringify(todolist));
            console.log('here is the data ', todolist);

        AsyncStorage.getItem(Todos).then(
            (value) => {
                if (value) {
                    AsyncStorage.getItem(Todos);
                    setTaskItems(todolist);
                         
                } else {
                    y(flag);
                    AsyncStorage.setItem(defaultvAL, JSON.stringify(todolist));
                    setTaskItems(todolist); 
                }
            }
        );
    }
    useEffect(() => {
        load();
        
    }, []);


    return (
        <View style={styles.container}>
            <View style={styles.taskWrapper}>
            
                <Text style={{
                    paddingTop:10,
                    fontSize: 24,
                    fontWeight: 'bold'
                }}>Today's Task</Text>
                <Button title={"Refrech"} onPress={ButtonClickOnMe}></Button>
                <View style={[styles.containerAct, styles.horizontalAct]}>   
                <ActivityIndicator style={{flex: 1,alignItems:'center',paddingTop:60,paddingLeft:170}} size="large" color="#1FBCF6" animating={taskItems.length === 0}/>
                <ActivityIndicator style={{flex: 1,alignItems:'center',paddingRight:170}} size="large" color="#f0ff00" animating={flag===true}/>
                </View>


                <View style={styles.items}>
                    <ScrollView>
                        {
                            taskItems.map((item, index) => {

                                return (
                                    <TouchableOpacity key={index} onPress={() => { rem(item.id) }}>
                                        <Task key={index} text={item.title} />
                                    </TouchableOpacity>

                                )
                            })
                        }
                    </ScrollView>

                </View>

            </View>


            {/* Write task */}
            <KeyboardAvoidingView style={styles.writeTaskWrapper}>
                <TextInput style={styles.input} placeholder={'Write a task'} onChangeText={changeEvent} />
                <TouchableOpacity onPress={() => submit(task)} >

                    <Icon
                        reverse
                        name='add'
                        color='#55BCF6' />
                </TouchableOpacity>
                
            </KeyboardAvoidingView>

            
        </View>
    );

    async function ButtonClickOnMe() {
       
        setTaskItems([])
        console.log("Before sleep");
        await sleep(3000);
        console.log("After sleep");
        load();
    }

    function sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E8EAED',
    },
    taskWrapper: {
        paddingTop: 80,
        paddingHorizontal: 20,
    },
    writeTaskWrapper: {
        position: 'absolute',
        bottom: 35,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    input: {
        paddingVertical: 15,
        paddingHorizontal: 15,
        backgroundColor: '#FFF',
        borderRadius: 60,
        borderColor: '#C0C0C0',
        borderWidth: 1,
        width: 250
    },
    containerAct: {
        flex: 1,
        justifyContent: "center"
    },
    horizontalAct: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10
    }, items: {
        marginTop: 30
    },
});