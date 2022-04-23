import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import { color } from '../assets/stdafx';

const borderRadius = 12;

export function SelectAttachment(props) {
    return (
        <View style={styles.screen}>
            <View style={styles.menu}>
                <TouchableOpacity
                    onPress={props.onDocument}>
                    <View style={styles.menuItem}>
                        <AntDesign name="file1" size={24} color={color.blue} />
                        <Text style={styles.menuText}>Document</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={props.onLocation}
                >
                    <View style={styles.menuItem}>
                        <AntDesign name="enviromento" size={24} color={color.blue} />
                        <Text style={styles.menuText}>Location</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={styles.cancel}>
                <TouchableOpacity
                    onPress={props.onCancel}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}

export default SelectAttachment;

const styles = StyleSheet.create({
    screen: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: '#00000096',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    menu: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: borderRadius,
        paddingVertical: 12,
    },
    menuItem: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        paddingVertical: 12,
    },
    menuText: {
        fontSize: 16,
        paddingLeft: 24,
    },
    cancel: {
        width: '100%',
        marginTop: 24,
        backgroundColor: 'white',
        borderRadius: borderRadius,
        padding: 12,
        alignItems: 'center',
    },
    cancelText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: color.blue,
    }
})