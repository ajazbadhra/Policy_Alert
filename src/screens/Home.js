import React, { useState, useRef } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    ActivityIndicator,
    ScrollView,
} from 'react-native'
import { androidCameraPermission } from '../../permissions';
import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios';
import RBSheet from 'react-native-raw-bottom-sheet';

const Home = ({ navigation }) => {

    const refRBSheet = useRef();
    const [data, setData] = useState([]);
    const [prediction, setPrediction] = useState([]);
    const [loading, setLoading] = useState(false);

    const onCamera = () => {
        ImagePicker.openCamera({
            cropping: true,
            freeStyleCropEnabled: true,
        })
            .then(image => {
                console.log(image);
                imageUpload(image.path);
            })
            .catch(e => {
                console.log('oncam', e);
            });
    }

    const onGallery = () => {
        ImagePicker.openPicker({
            cropping: true,
            freeStyleCropEnabled: true,
        })
            .then(image => {
                console.log('selected Image', image);
                imageUpload(image.path);
            })
            .catch(e => {
                console.log('ongal', e);
            });
    };

    const imageUpload = async imagePath => {
        setLoading(true);
        const imageData = new FormData();
        imageData.append('image', {
            uri: imagePath,
            name: 'image.jpg',
            fileName: 'img',
            type: 'image/jpeg',
        });
        console.log('form data', imageData);
        await axios({
            headers: { 'content-type': 'multipart/form-data' },
            method: 'post',
            url: 'https://termsconditionsapi.herokuapp.com/api/text_extract/',
            data: imageData,
        })
            .then(function (response) {
                setData(response.data);
                setLoading(false);
                console.log('image upload successfully', response.data);
            })
            .catch(error => {
                console.log('error riased', error);
            });
    };

    return (
        <>
            {loading && (
                <View style={styles.loadstyle}>
                    <ActivityIndicator
                        animating={true}
                        size="large"
                        textContent={'Loading...'}
                        color="#0000ff"
                    />
                </View>
            )}

            {data.length > 0 ? (
                <View style={styles.container}>
                    <ScrollView >
                        <Text selectable={true} style={styles.text}>
                            {data}
                        </Text>
                    </ScrollView>
                    <TouchableOpacity
                        style={
                            { ...styles.btnStyle, backgroundColor: 'green' }}
                        activeOpacity={0.8}
                        onPress={async () => {
                            setLoading(true);
                            const textData = new FormData();
                            textData.append('terms', data);
                            await axios({
                                headers: { 'content-type': 'multipart/form-data' },
                                method: 'post',
                                url: 'https://termsconditionsapi.herokuapp.com/api/text_process/',
                                data: textData,
                            })
                                .then((response) => {
                                    setPrediction(response.data);
                                    setLoading(false);
                                    setData([])
                                    console.log('Prediction := ', response.data);
                                    // console.log('Prediction state := ', prediction);
                                    // navigation.replace('Prediction', { prediction: prediction })
                                })
                                .catch(error => {
                                    console.log('prediction error riased', error);
                                });
                        }}>
                        <Text style={styles.textStyle}>Go For Prediction</Text>
                    </TouchableOpacity>
                </View>
            ) : null}
            {prediction && prediction.length > 0 ?
                navigation.replace('Prediction', { prediction: prediction }):null
            }
            {data.length <= 0 ? (
                <View style={styles.container}>
                    <TouchableOpacity
                        style={styles.btnStyle}
                        activeOpacity={0.8}
                        onPress={() => {
                            refRBSheet.current.open();
                        }}>
                        <Text style={styles.textStyle}>select your image</Text>
                    </TouchableOpacity>

                    <RBSheet
                        ref={refRBSheet}
                        closeOnDragDown={true}
                        closeOnPressMask={true}
                        height={200}
                        customStyles={{
                            wrapper: {
                                backgroundColor: 'transparent',
                            },
                            draggableIcon: {
                                backgroundColor: '#000',
                            },
                        }}>
                        <TouchableOpacity
                            style={styles.menuStyle}
                            onPress={async () => {
                                const permissionStatus = await androidCameraPermission();
                                if (permissionStatus || Platform.OS == 'android') {
                                    onCamera();
                                    refRBSheet.current.close();
                                }
                            }}>
                            <Text style={{ fontSize: 20 }}>Take Picture</Text>
                            {/* <Text style={{ fontSize: 10, color: 'red' }}>
                                ! use This for single image
                            </Text> */}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.menuStyle}
                            onPress={async () => {
                                const permissionStatus = await androidCameraPermission();
                                if (permissionStatus || Platform.OS == 'android') {
                                    setData([]);
                                    onGallery();
                                    refRBSheet.current.close();
                                }
                            }}>
                            <Text style={{ fontSize: 20 }}>Select Picture</Text>
                            {/* <Text style={{ fontSize: 10, color: 'red' }}>
                                ! use This for multiple images{' '}
                            </Text> */}
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.menuStyle}
                            onPress={() => {
                                refRBSheet.current.close();
                            }}>
                            <Text style={{ fontSize: 20 }}>Close</Text>
                        </TouchableOpacity>
                    </RBSheet>
                </View>
            ) : null}
        </>
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        marginTop: 10,
    },
    loadstyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    btnStyle: {
        backgroundColor: 'blue',
        height: 48,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        paddingHorizontal: 16,
    },
    text: {
        marginLeft: 10,
    },
    menuStyle: {
        flex: 1,
        margin: 5,
    },
})
