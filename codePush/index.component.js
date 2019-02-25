import React from 'react';
import codePush from 'react-native-code-push';
import {
    Alert,
} from 'react-native';

let codePushOptions = { checkFrequency: codePush.CheckFrequency.MANUAL };

@codePush(codePushOptions)
class CodePushComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount(){
        codePush.disallowRestart();
    }

    componentDidMount(){
        codePush.allowRestart();
        this._checkForUpdate();
    }
    _checkForUpdate = () => {
        codePush.checkForUpdate().then(update => {
            console.log(update)
            //Alert.alert('温馨提示',JSON.stringify(update));
            if (!update) {
                Alert.alert('温馨提示', '没有检查到可用的更新包');
            } else {
                this._linkUpdatePage(update);
            }
        }).catch((error) => {
            // Alert.alert(JSON.stringify(error));
        });
    };

    _linkUpdatePage = (info) => {
        // this.props.navigation.showModal({
        //     screen: "mop.update",
        //     passProps: {
        //         info: info
        //     },
        //     animationType: 'none'
        // });

        this.props.navigation.push('Update',info)
    };

    render() {
        return null;
    }
}

export default CodePushComponent;