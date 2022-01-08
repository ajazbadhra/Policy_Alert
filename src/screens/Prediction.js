import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'

const Prediction = ({ route, navigation }) => {
    return (
        <>
            <View style={styles.container}>
                <Text style={styles.text}>{route.params.prediction}</Text>
                <TouchableOpacity
                    style={styles.btnStyle}
                    activeOpacity={0.8}
                    onPress={() => {
                        navigation.replace('Home')
                    }}>
                    <Text style={styles.textStyle}>Goto Home</Text>
                </TouchableOpacity>
            </View>
        </>
    )
}

export default Prediction

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
    },
    btnStyle: {
        position : 'absolute',
        bottom:0,
        backgroundColor: 'blue',
        height: 48,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        width : '100%'
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        paddingHorizontal: 16,
    },
    text: {
        color : 'black',
        marginLeft : 10,

    },
})
