import React, { Component } from 'react';
import {observer} from 'mobx-react';
import {
    Platform,
    Alert
} from 'react-native'
import JPushModule from 'jpush-react-native';

const receiveCustomMsgEvent = 'receivePushMsg';
const receiveNotificationEvent = 'receiveNotification';
const openNotificationEvent = 'openNotification';
const getRegistrationIdEvent = 'getRegistrationId';

@observer
class Jpush extends Component {
    constructor (props) {
        super(props)
    }

    componentDidMount () {
        if (Platform.OS === 'android') {
            JPushModule.initPush(); //初始化
            //JPushModule.stopPush(); //停止
            //JPushModule.resumePush(); //恢复
            JPushModule.notifyJSDidLoad(resultCode => {
                if (resultCode === 0) {
                }
            })
        } else {
            JPushModule.setupPush();
            // JPushModule.setBadge(0,success=>{});
        }

        //接收自定义消息事件
        JPushModule.addReceiveCustomMsgListener(map => {
            console.log('接收自定义消息事件',map);
        });

        //接收推送事件
        JPushModule.addReceiveNotificationListener(map => {
            console.log('接收推送事件',map);
        });

        //点击推送事件
        JPushModule.addReceiveOpenNotificationListener(map => {
            console.log('点击推送事件',map);
            this.navigatorPage(map);
        });
    }

    navigatorPage = (map)=>{

        if(Platform.OS==='ios') {
            JPushModule.getBadge(badge => {
                console.log(badge)
                JPushModule.setBadge((badge - 1), success => {
                });
            });
        }

        let {extras} = map;

        let extrasObj = Platform.OS==='ios'?extras:JSON.parse(extras);

        Alert.alert(JSON.stringify(extrasObj))
    };

    componentWillUnmount () {
        JPushModule.removeReceiveCustomMsgListener(receiveCustomMsgEvent);
        JPushModule.removeReceiveNotificationListener(receiveNotificationEvent);
        JPushModule.removeReceiveOpenNotificationListener(openNotificationEvent);
        
        JPushModule.removeGetRegistrationIdListener(getRegistrationIdEvent);
        JPushModule.clearAllNotifications();
    }

    render () {
        return null
    }
}

export default Jpush;