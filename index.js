import React from 'react';
import {View, ScrollView, Text, Platform, Alert, Image} from 'react-native';
import {observer} from 'mobx-react';
import {Button} from 'antd-mobile-rn';

import SplashScreen from 'react-native-splash-screen';
import Orientation from 'react-native-orientation';
import DeviceInfo from 'react-native-device-info';
import Communications from 'react-native-communications';
import Permissions from 'react-native-permissions';

import MD5 from 'crypto-js/md5';
import RNFS from 'react-native-fs';

import {MIME} from './mimeType';
import FileOpener from 'react-native-file-opener-edoc2';

import QRCode from 'react-native-qrcode';

import {zip, unzip, unzipAssets, subscribe} from 'react-native-zip-archive';

import AppState from './app.state';

const filePath = 'https://github.com/jiaoxuebing2014/react-native-api-demo/archive/master.zip';

import ImagePicker from 'react-native-image-crop-picker';

import Video from 'react-native-video';

import ViewShot from "react-native-view-shot";

import TouchID from 'react-native-touch-id';

import CodePushComponent from './codePush/index.component';

import JpushComponent from './jpush/index.component';

@observer
class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fullScreen: false,
            imageUrl:undefined,
            update:false
        };
    }

    componentDidMount() {
        SplashScreen.hide();
        console.log(Orientation.getInitialOrientation());
        Orientation.lockToPortrait();
    }

    capture = ()=>{
        this.refs['viewShot'].capture().then(uri => {
            console.log(uri);
            this.setState({
                imageUrl:uri
            });
        })
    };

    permissionsCamera = (fn) => {
        Permissions.request('camera', {type: 'alert'}).then(response => {
            //response is an object mapping type to permission
            AppState.setTodo(JSON.stringify(response));
            if (response === 'denied') {
                Permissions.openSettings();
            } else {
                try{
                    fn && fn();
                }catch (e) {

                }
            }
        })
    };

    downloadFile = () => {
        //安卓获取存储权限
        Permissions.request('storage', {type: 'always'}).then(response => {
            console.log(response)
        }).catch(err => {
            console.log(err)
        });

        AppState.setTodo('下载0%');

        const uploadBegin = (response) => {
            console.log(response);
        };
        const uploadProgress = (response) => {
            let pro = Math.floor(response.bytesWritten / response.contentLength * 100);
            AppState.setTodo('下载' + pro + '%');
        };

        RNFS.mkdir(Platform.OS === 'ios' ? RNFS.DocumentDirectoryPath + '/appFiles' : RNFS.ExternalDirectoryPath + '/appFiles').then(() => {

            const downloadPath = `${Platform.OS === 'ios' ? RNFS.DocumentDirectoryPath : RNFS.ExternalDirectoryPath}/appFiles/${MD5(filePath)}.zip`;
            const options = {
                fromUrl: filePath,
                toFile: downloadPath,
                background: true,
                begin: uploadBegin,
                progress: uploadProgress
            };
            try {
                const ret = RNFS.downloadFile(options);
                ret.promise.then(res => {
                    console.log('success', res);
                    console.log(downloadPath);
                    AppState.setTodo(downloadPath);

                    FileOpener.open(
                        downloadPath,
                        MIME['.zip']
                    ).then(() => {
                        console.log('success!!');
                    }, (e) => {
                        console.log('error!!');
                        Alert.alert(
                            '温馨提示',
                            '此文件已损坏',
                            [
                                {text: '确定'}
                            ],
                            {cancelable: false}
                        )
                    });

                }).catch(err => {
                    console.log('err', err);
                });
            } catch (e) {
                console.log(error);
            }
        });
    };

    unzip = () => {
        const sourcePath = `${Platform.OS === 'ios' ? RNFS.DocumentDirectoryPath : RNFS.ExternalDirectoryPath}/appFiles/${MD5(filePath)}.zip`;
        const targetPath = `${Platform.OS === 'ios' ? RNFS.DocumentDirectoryPath : RNFS.ExternalDirectoryPath}/appFiles/`;

        unzip(sourcePath, targetPath)
            .then((path) => {
                AppState.setTodo('解压到：' + path);

                RNFS.readDir(targetPath).then(res=>{
                    console.log(res)
                    for(let i=0;i<res.length;i++){
                        console.log('是否是文件夹：'+res[i].isDirectory())
                    }
                })
            })
            .catch((error) => {
                console.log(error)
            })

    };

    openPicker = () => {
        this.permissionsCamera(() => {
            ImagePicker.openCamera({}).then(image => {
                console.log(image);
            });
        });
    };

    link = (page)=>{
        this.props.navigation.push(page);
    };

    hot = ()=>{
        this.setState({
            update:true
        });
    };

    touchId = ()=>{
        const optionalConfigObject = {
            title: "Authentication Required", // Android
            imageColor: "#e00606", // Android
            imageErrorColor: "#ff0000", // Android
            sensorDescription: "Touch sensor", // Android
            sensorErrorDescription: "Failed", // Android
            cancelText: "Cancel", // Android
            fallbackLabel: "", // iOS (if empty, then label is hidden)
            unifiedErrors: false, // use unified error messages (default false)
            passcodeFallback: true // iOS
        };

        TouchID.authenticate('打开指纹/FaceID识别', optionalConfigObject)
            .then(success => {
                Alert.alert(JSON.stringify(success))
            })
            .catch(error => {
                Alert.alert(JSON.stringify(error))
            });
    };

    render() {
        let deviceInfo = DeviceInfo.getDeviceId();
        return (
            <ScrollView style={{flex: 1}}>
                <ViewShot ref="viewShot" options={{ format: "png", quality: 0.9 }}>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <Text>视频</Text>
                        <Video style={{width: 200, height: 200}} fullscreen={this.state.fullScreen}
                               source={{uri: 'http://www.w3school.com.cn/i/movie.mp4'}}
                               onFullscreenPlayerDidDismiss={() => {
                                   this.setState({
                                       fullScreen: false
                                   });
                               }}
                        />
                        <Button onClick={() => {
                            this.setState({
                                fullScreen: true
                            });
                        }}>点击全屏播放</Button>
                        <Text>二维码</Text>
                        <QRCode
                            value={'https://www.baidu.com'}
                            size={200}
                            bgColor='purple'
                            fgColor='white'/>
                        <Text>{AppState.todo}</Text>
                        <Button onClick={() => {
                            AppState.setTodo(deviceInfo)
                        }}>点击</Button>
                        <Button onClick={() => Communications.web('http://www.baidu.com')}>打开浏览器</Button>
                        <Button onClick={this.permissionsCamera}>获取拍照权限</Button>
                        <Button onClick={this.downloadFile}>下载ZIP文件</Button>
                        <Button onClick={this.unzip}>解压下载下来的ZIP文件</Button>
                        <Button onClick={this.openPicker}>选择照片或视频</Button>
                        <Button onClick={this.capture}>截图</Button>
                        <Button onClick={()=>{this.link('BarCode')}}>扫-扫</Button>
                        <Button onClick={()=>{this.link('SQLite')}}>SQLite</Button>
                        <Button onClick={this.touchId}>Touch ID</Button>
                        <Button onClick={()=>{this.link('Share')}}>分享</Button>
                        <Button onClick={this.hot}>热更新</Button>
                        {this.state.update&&<CodePushComponent {...this.props}/>}
                        <JpushComponent {...this.props}/>
                        <Button onClick={()=>{this.link('d3Page')}}>d3</Button>
                    </View>
                </ViewShot>
                {this.state.imageUrl&&<Image style={{flex:1,height: 750}} source={{uri:this.state.imageUrl}} resizeMode={'contain'}/>}
            </ScrollView>
        );
    }
}

export default HomeScreen;