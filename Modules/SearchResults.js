'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    Image,
    View,
    TouchableHighlight,
    FlatList,
    Text,
} from 'react-native';

export default class SearchResults extends Component<{}> {
    constructor(props) {
        super(props);
    }

    _renderItem = ({item, index}) => {
        return (
            <ListItem
                item={item}
                index={index}
                onPressItem={this._onPressItem} // 1.3 赋值 子组件的 onPressItem 方法
            />
        );
    };

    _keyExtractor = (item, index) => index;

    _onPressItem = (index) => {
        console.log('Pressed row: ' + index)
    };

    render() {
        return (
            <FlatList
                data={this.props.listings}  // 上个页面传递过来的值
                renderItem={this._renderItem}
                keyExtractor={this._keyExtractor} // keyExtractor属性指定一个唯一的key用来区分渲染的item
            />
        )
    }
}


// https://www.jianshu.com/p/6e6f3b270592
// http://www.zcfy.cc/article/why-and-how-to-use-purecomponent-in-react-js-60devs-2344.html
// React.PureComponent最重要的一个用处就是优化React应用，这很容易快速地实现。
// 使用React.PureComponent对性能的提升是非常可观的，因为它减少了应用中的渲染次数。
// PureComponent改变了生命周期方法shouldComponentUpdate，并且它会自动检查组件是否需要重新渲染。
// 这时，只有PureComponent检测到state或者props发生变化时，PureComponent才会调用render方法，因此，你不用手动写额外的检查，就可以在很多组件中改变state
//
//  *** 如果只是`单纯` 的组件, 没有state值的变化, 用 React.PureComponent 可以提高性能 ***
//
class ListItem extends React.PureComponent {
    constructor(props) {
        super(props);

        this._onPress = this._onPress.bind(this);
    }

    // 1.2 方法执行时调用 onPressItem 属性方法
    // onPressItem 方法是从父控件传递进来的
    _onPress = function () {
        this.props.onPressItem(this.props.index);
    };

    render() {
        const item = this.props.item;
        const price = item.price_formatted;

        return (
            // 1.1 对onPress 添加监听方法
            // underlayColor: 设置按住高亮的颜色
            <TouchableHighlight onPress={this._onPress} underlayColor='#dddddd'>
                <View>
                    <View style={styles.rowContainer}>
                        <Image
                            source={{uri: item.img_url}}
                            style={styles.thumb}
                        />
                        <View style={styles.textContainer}>
                            <Text style={styles.price}>{price}</Text>
                            <Text
                                style={styles.title}>
                                numberOfLines={1}
                                {item.title}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.separator}/>
                </View>
            </TouchableHighlight>
        );
    }
}

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row',
        padding: 10,
    },

    thumb: {
        width: 80,
        height: 80,
        marginRight: 10,
    },

    textContainer: {
        flex: 1,
    },

    price: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#48BBEC',
    },

    title: {
        fontSize: 20,
        color: '#656565'
    },

    separator: {
        height: 0.5,
        backgroundColor: '#dddddd',
    },

});