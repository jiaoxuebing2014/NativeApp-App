import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableHighlight,
    Alert,
    Platform
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import * as Animatable from 'react-native-animatable';

import BarcodeStyle from './barcode.style';

const style = StyleSheet.create(BarcodeStyle);

const TopToBottom = {
    from: {
        top: 0,
    },
    to: {
        top: 270,
    },
};

class MoveImage extends React.Component {
    render() {
        return (
            <Animatable.Image
                easing="linear"
                animation={TopToBottom}
                iterationCount="infinite"
                duration={2000}
                direction="alternate"
                source={require('./img/line.png')}
                style={[style.line, {}]}
            >
            </Animatable.Image>
        );
    }
}

Animatable.createAnimatableComponent(MoveImage);

class Barcode extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            switchBtn: false,
            swImg: [require('./img/s-on.png'), require('./img/s-off.png')]
        };
    }

    codeReadData = true;

    changeLight = () => {
        this.setState({
            switchBtn: this.state.switchBtn ? false : true
        });
    };

    backPage = () => {
        this.props.navigator.pop({
            animated: true,
            animationType: 'fade'
        });
    };

    linkUrl = (url)=>{
        this.props.navigator.push({
            screen: 'h5',
            passProps: {
                url: url
            }
        });
    };

    codeRead = (res) => {
        if(this.codeReadData) {
            this.codeReadData = false;
            if (res.data.indexOf('http://') > -1 || res.data.indexOf('https://') > -1) {
                this.backPage();
                this.linkUrl(res.data);
            }else{
                Alert.alert('扫描结果',res.data,[
                    {
                        text: '确定',
                        onPress:()=>{
                            this.codeReadData = true;
                        }
                    }
                ])
            }
        }
    };

    get _renderAuth(){
        return (
            <View style={{flex:1,height:'100%',justifyContent:'center',alignItems:'center'}}>
                <Text style={{textAlign:'center'}}>{Platform.OS==='ios'?'请打开摄像头权限。\n设置->隐私->相机，勾选平安不动产':'请打开摄像头权限。'}</Text>
            </View>
        );
    };

    render() {
        const img = this.state.switchBtn ? this.state.swImg[0] : this.state.swImg[1];
        return (
            <View style={style.barcode}>
                <RNCamera
                    style={style.camera}
                    onBarCodeRead={(data, bounds) => this.codeRead(data, bounds)}
                    notAuthorizedView={this._renderAuth}
                    flashMode={this.state.switchBtn ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
                >
                </RNCamera>
                <View style={style.wrap}>
                    <View style={style.titleBox}>
                        <Text style={style.title}>对准二维码/条形码到框内即可扫描</Text>
                    </View>
                    <View style={style.boxs}>
                        <View style={style.boxSlide}></View>
                        <View style={style.boxCenter}>
                            <View style={[style.boxBj, style.boxBj1]}/>
                            <View style={[style.boxBj, style.boxBj2]}/>
                            <View style={[style.boxBj, style.boxBj3]}/>
                            <View style={[style.boxBj, style.boxBj4]}/>
                            <MoveImage/>
                        </View>
                        <View style={style.boxSlide}></View>
                    </View>
                    <View style={style.switch}>
                        <TouchableHighlight style={style.simgBox} onPress={this.changeLight}>
                            <Image source={img} style={style.simg}/>
                        </TouchableHighlight>
                        <Text style={style.stxt}>手电筒</Text>
                    </View>
                </View>
            </View>
        );
    }


}

export default Barcode;