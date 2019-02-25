import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Alert,
    TouchableOpacity
} from 'react-native';

import IndexStyle from './index.style';

const style = StyleSheet.create(IndexStyle);
import * as WeChat from 'react-native-wechat';
import { observer } from 'mobx-react';

let wxId = 'wx5e81b48ad801a50a';

import Communications from 'react-native-communications';

@observer
class Share extends React.Component {

    constructor(props) {
        super(props);
        console.log(wxId);
        WeChat.registerApp(wxId);
    }

    listData = [
        {
            img: require('./img/hy.png'),
            txt: '微信朋友'
        },
        {
            img: require('./img/pyq.png'),
            txt: '微信朋友圈'
        },
        {
            img: require('./img/yx.png'),
            txt: '电子邮箱'
        }
    ];

    _onClose = async (status) => {
        let shareInfo = {
            type: 'news',
            title: '邀请您下载移动工作平台！',
            description: '随时随地关注平安不动产最新咨询、经营数据、解锁移动办公、AI面签新技能，快来下载平安不动产-移动工作平台，发现更多可能。',
            thumbImage: 'https://mop-pare.pingan.com.cn/static/img/logo.png',
            webpageUrl: 'https://mop-pare.pingan.com.cn/download',
        };
        //Alert.alert(WeChat.isWXAppInstalled())
        //this.props.navigator.dismissModal();
        switch (status) {
            case 1:

                WeChat.isWXAppInstalled()
                    .then((isInstalled) => {
                        if (isInstalled) {
                            WeChat.shareToSession(shareInfo).catch((error) => {
                                Alert.alert(error.message);
                            });
                        } else {
                            Alert.alert('没有安装微信软件，请您安装微信之后再试');
                        }
                    });
                break;
            case 2:
                let lineShareInfo = shareInfo;
                lineShareInfo.title = shareInfo.description;
                WeChat.isWXAppInstalled()
                    .then((isInstalled) => {
                        if (isInstalled) {
                            WeChat.shareToTimeline(lineShareInfo).catch((error) => {
                                Alert.alert(error.message);
                            });
                        } else {
                            Alert.alert('没有安装微信软件，请您安装微信之后再试');
                        }
                    });
                break;
            case 3:
                Communications.email(null, null, null, (shareInfo.title+'App下载地址'), shareInfo.webpageUrl);
                break;
        }
    };

    render() {
        return (
            <View style={style.liBox}>
                {
                    this.listData.map((item, index) => {
                        return (
                            <TouchableOpacity key={'share' + index} onPress={() => {
                                this._onClose(index + 1)
                            }} style={style.li}>
                                <Image style={style.img} source={item.img}/>
                                <Text style={style.txt}>{item.txt}</Text>
                            </TouchableOpacity>
                        );
                    })
                }
            </View>
        );
    }
}

export default Share;