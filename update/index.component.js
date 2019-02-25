import React from 'react';
import {observer} from 'mobx-react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import {
    ActivityIndicator
} from 'antd-mobile-rn';
import UpdateStyle from './index.style';

const style = StyleSheet.create(UpdateStyle);
import CodePush from 'react-native-code-push';

@observer
class Update extends React.Component {

    constructor(props) {
        super(props);
        console.log(props)
        this.state = {
            progress: 0
        };
    }

    checkUpdate = () => {
        let {
            description = '',
            version,
            appVersion,
            isMandatory,
            packageSize,
            isPending,
            failedInstall,
            isUpdate,
            downloadUrlIos,
            downloadUrlAndroid
        } = this.props.navigation.state.params;

        if (packageSize) {
            this.sync();
        } else {

        }
    };

    sync = () => {
        this.setProgress(1);
        CodePush.sync(
            {
                installMode: CodePush.InstallMode.IMMEDIATE,
                updateDialog: false
            },
            ()=>{},
            this.codePushDownloadDidProgress.bind(this)
        );
    };

    setProgress = (value)=>{
        this.setState({
            progress: value
        });
    };

    codePushDownloadDidProgress(progress) {
        const progressValue = Math.round(progress.receivedBytes/progress.totalBytes*100);
        console.log(progressValue)
        if(progressValue===100){

        }
    }

    closeModal = ()=>{
        this.props.navigation.pop();
    };

    componentWillUnmount(){

    }

    render() {
        let {
            description = '',
            isMandatory
        } = this.props.navigation.state.params;
        let descriptionAry = description.split('|');

        return (
            <View style={{flex:1,height:'100%'}}>
                {this.state.progress > 0 ? <ActivityIndicator toast text={'下载中' + this.state.progress + '%'}/> :
                    <View style={style.main}>
                        <View style={style.box}>
                            <Text style={style.h1}>发现</Text>
                            <Text style={style.h2}>新版本</Text>
                            <View style={style.updateTxt}>
                                {descriptionAry.map((item, i) => {
                                    return (
                                        <View style={style.li} key={'upText' + i}>
                                            <View style={style.yd}></View>
                                            <Text style={style.upTxt}>{item}</Text>
                                        </View>
                                    );
                                })}
                            </View>
                            <TouchableOpacity style={style.updateBtn} onPress={this.checkUpdate}>
                                <Image style={style.btnUpdate} source={require('../asset/common/btnSmall.png')}
                                       resizeMode="stretch"/>
                                <Text style={style.updateBtnTxt}>立即升级</Text>
                            </TouchableOpacity>
                            <Image style={style.updateImg} source={require('../asset/common/update.png')}
                                   resizeMode="stretch"/>
                        </View>
                        {
                            isMandatory ? <View style={style.btn}/> :
                                <TouchableOpacity style={style.btn} onPress={this.closeModal}>
                                    <Image style={style.btnImg} source={require('../asset/common/close.png')}
                                           resizeMode="stretch"/>
                                </TouchableOpacity>
                        }
                    </View>
                }
            </View>
        );
    }
}
export default Update;