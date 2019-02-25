import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Alert,
    TouchableOpacity,
    ART,
    Dimensions
} from 'react-native';
import {observer} from 'mobx-react';
import * as d3 from 'd3';
import IndexStyle from './index.style';

const {width, height} = Dimensions.get('window');

const style = StyleSheet.create(IndexStyle);
const {
    Surface, //  一个矩形可渲染的区域，是其他元素的容器
    Group, // 可容纳多个形状、文本和其他的分组
    Shape, // 形状定义，可填充
    Path, // 路径
    LinearGradient, // 渐变色
    Pattern, // 填充图片
    ClippingRectangle, // 剪辑
} = ART;

@observer
class Share extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataStatus: true,
            demo1Data: []
        };
    }

    arcPath = () => {


        let arcAry = [];
        const data = this.state.dataStatus ? [
            {name: '购物', number: 983},
            {name: '日常饮食', number: 300},
            {name: '医药', number: 1400},
            {name: '交通', number: 402},
            {name: '杂费', number: 134}
        ] : [
            {"number": 4, "name": "Locke"},
            {"number": 8, "name": "Reyes"},
            {"number": 15, "name": "Ford"},
            {"number": 16, "name": "Jarrah"},
            {"number": 23, "name": "Shephard"},
            {"number": 42, "name": "Kwon"}
        ];
        const arcs = d3.pie().sort(null).value(d => d.number)(data);
        const arc = d3.arc().outerRadius(width / 2).innerRadius(width / 3);

        console.log(arcs)

        for (let i = 0, len = arcs.length; i < len; i++) {
            console.log(arcs[i]['startAngle'])
            arcAry.push(arc({
                startAngle: arcs[i]['startAngle'],
                endAngle: arcs[i]['endAngle']
            }));
        }

        this.setState({
            demo1Data: arcAry
        });
    };

    changeData = () => {
        this.arcPath();
        this.setState({
            dataStatus: this.state.dataStatus ? false : true
        });
    };

    render() {
        let colors = this.state.dataStatus ? d3.schemeSet1 : d3.schemeCategory10;

        let ribbon = d3.ribbon()
            .radius(240);

        return (
            <View style={{flex: 1}}>
                <TouchableOpacity activeOpacity={1} style={style.d3Box} onPress={this.changeData}>
                    <Surface style={style.demo1} width={width} height={width}>
                        <Group x={width / 2} y={width / 2}>
                            {this.state.demo1Data.map((path, i) => <Shape strokeWidth={1} fill={colors[i]}
                                                                          key={'demo1Path' + i} d={path}/>)}
                        </Group>
                    </Surface>
                </TouchableOpacity>
                <Surface style={style.demo1} width={width} height={width}>
                    <Group x={0} y={0}>
                        <Shape strokeWidth={1} fill={colors[4]} d={ribbon({
                            source: {startAngle: 0.7524114, endAngle: 1.1212972},
                            target: {startAngle: 1.8617078, endAngle: 1.9842927}
                        })}/>
                    </Group>
                </Surface>
            </View>
        );
    }
}

export default Share;