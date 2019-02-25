import React from "react";
import {
    View,
    Text,
    Alert
} from 'react-native';
import {Button} from 'antd-mobile-rn';

import Storage from 'react-native-storage';
import { AsyncStorage } from 'react-native';

const storage = new Storage({
    // 最大容量，默认值1000条数据循环存储
    size: 1000,

    // 存储引擎：对于RN使用AsyncStorage，对于web使用window.localStorage
    // 如果不指定则数据只会保存在内存中，重启后即丢失
    storageBackend: AsyncStorage,

    // 数据过期时间，默认一整天（1000 * 3600 * 24 毫秒），设为null则永不过期
    defaultExpires: 1000 * 3600 * 24,

    // 读写时在内存中缓存数据。默认启用。
    enableCache: true, // 你可以在构造函数这里就写好sync的方法 // 或是在任何时候，直接对storage.sync进行赋值修改 // 或是写到另一个文件里，这里require引入

    // 如果storage中没有相应数据，或数据已过期，
    // 则会调用相应的sync方法，无缝返回最新数据。
    // sync方法的具体说明会在后文提到
    // sync: require('你可以另外写一个文件专门处理sync'
});


import SQLite from 'react-native-sqlite-storage';
import SQLiteConfig from './config';

SQLite.DEBUG(SQLiteConfig.debuggable);
SQLite.enablePromise(false);

let database_name = SQLiteConfig.dbName;//数据库文件
let database_version = SQLiteConfig.dbVersion;//版本号
let database_displayname = SQLiteConfig.dbDisplayName;
let database_size = SQLiteConfig.dbSize;//-1应该是表示无限制
let db;

class SQLiteComponent extends React.Component {

    componentWillMount(){
        db && this.open();
    }

    componentDidMount(){
        storage.save({
            key: 'loginState', // 注意:请不要在key中使用_下划线符号!
            data: {
                from: 'some other site',
                userid: 'some userid',
                token: 'some token'
            },
            expires: null
        });
    }

    componentWillUnmount() {
        if (db) {
            this.close();
            console.log('关闭SQLite');
        } else {
            console.log('没有关闭SQLite');
        }
    }

    getStorage = ()=>{
        // 读取
        storage.load({
            key: 'loginState',
            // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
            autoSync: false, // 设置为false的话，则等待sync方法提供的最新数据(当然会需要更多时间)。
        })
        .then(ret => {
            Alert.alert(JSON.stringify(ret))
        })
        .catch(err => {

        });
    };

    open = () => {
        return new Promise((resolve,reject)=>{
            db = SQLite.openDatabase(
                database_name,
                database_version,
                database_displayname,
                database_size,
                () => {
                    resolve();
                    console.log('打开 SQLite');
                },
                (err) => {
                    reject(err);
                    console.log(err)
                }
            );
        });
    };

    close = () => {
        db && db.close();
    };

    insertOrderData(orderData) {
        // console.log(orderData)
        let len = orderData.length;
        if (!db) {
            this.open();
        }
        this.createTable();
        db.transaction((tx) => {
            for (let i = 0; i < len; i++) {
                let order = orderData[i];
                if (
                    order
                    && order.orderId
                    && order.createTime

                ) {
                    let orderId = order.orderId;
                    let createTime = order.createTime;
                    let nowHolderId = order.nowHolderId;
                    let nowHolderName = order.nowHolderName;
                    let lastHolderId = order.lastHolderId;
                    let lastHolderName = order.lastHolderName;


                    let sql = 'INSERT INTO t_order(orderId,createTime,nowHolderId,nowHolderName,lastHolderId,lastHolderName)' +
                        'values(?,?,?,?,?,?)';
                    tx.executeSql(sql, [orderId, createTime, nowHolderId, nowHolderName, lastHolderId, lastHolderName], () => {

                        }, (err) => {
                            console.log(err);
                        }
                    );
                }

            }
        }, (error) => {
            console.log(error)
        }, () => {
            Alert.alert('成功插入 ' + len + ' 条工单数据')
        });
    }

    createTable = async () =>{
        if (!db) {
            await this.open();
        }
        console.log(db);
        //创建用户表
        db.transaction((tx) => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS t_order (' +
                'id INTEGER PRIMARY KEY  AUTOINCREMENT,' +
                'orderId VARCHAR,' +
                'createTime VARCHAR,' +
                'nowHolderId VARCHAR,' +
                'nowHolderName VARCHAR,' +
                'lastHolderId VARCHAR,' +
                'lastHolderName VARCHAR)'
                , [], () => {

                }, (err) => {
                    console.log(err)
                });
        }, (err) => {//所有的 transaction都应该有错误的回调方法，在方法里面打印异常信息，不然你可能不会知道哪里出错了。
            console.log(err)
        }, () => {
            console.log('创建用户表 成功')
        });
    };

    selectAllUser = async ()=>{
        if (!db) {
            await this.open();
        }
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM t_order', [], (tx, results) => {
                // console.log(results.rows);
                let len = results.rows.length;
                let dataSqlite = [];
                for (let i = 0; i < len; i++) {
                    let row = results.rows.item(i);
                    dataSqlite.push(row)
                }
                Alert.alert(JSON.stringify(dataSqlite))
            });
        });
    };

    render() {
        return (
            <View>
                <Button onClick={this.selectAllUser}><Text>查询用户表</Text></Button>
                <Button onClick={()=>{
                    this.insertOrderData([{
                        orderId:Math.random(),
                        createTime:new Date().toString(),
                        nowHolderId:Math.random(),
                        nowHolderName:Math.random(),
                        lastHolderId:Math.random(),
                        lastHolderName:Math.random()
                    }])
                }}><Text>插入数据</Text></Button>
                <Button onClick={this.getStorage}><Text>Storage</Text></Button>
            </View>
        )
    }
}

export default SQLiteComponent;