import { createStackNavigator } from 'react-navigation';

import HomeScreen from './index';
import BarCode from './barcode/barcode.component';
import SQLite from './sqlite/index.component';
import Share from './share/index.component';

import Update from './update/index.component';

import d3Page from './d3/index.component';

const MainStack = createStackNavigator(
    {
        Home: {
            screen: HomeScreen
        },
        BarCode: {
            screen: BarCode
        },
        SQLite: {
            screen: SQLite
        },
        Share: {
            screen: Share
        },
        d3Page: {
            screen: d3Page
        }
    },
    {
        /* Same configuration as before */
    }
);

export default createStackNavigator(
    {
        Main: MainStack,
        Update: {
            screen: Update
        },
    },
    {
        mode: 'modal',
        headerMode: 'none'
    }
);