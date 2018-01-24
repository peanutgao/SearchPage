import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Button,
    ActivityIndicator,
    Image,
    TextInput,
} from 'react-native';

import SearchResults from './SearchResults';

function urlForQueryAndPage(key, value, pageNumber) {
    const data = {
        country: 'uk',
        pretty: '1',
        encoding: 'json',
        listing_type: 'buy',
        action: 'search_listings',
        page: pageNumber,
    };
    data[key] = value;

    // 拼接请求参数
    // country=uk&pretty=1&encoding=json&listing_type=buy&action=search_listings&page=1&place_name=london
    const querySting = Object.keys(data)
        .map(key => key + '=' + encodeURIComponent(data[key]))
        .join('&');

    // 拼接请求url
    return 'https://api.nestoria.co.uk/api?' + querySting;
}

export default class SearchPage extends Component {
    // 当一个组件的state值改变时, render() 函数会被调用
    constructor(props) {
        super(props);

        this.state = {
            searchString: 'london',
            message: '',
        };

        this._onSearchTextChanged = this._onSearchTextChanged.bind(this);
    }

    /**
    * => 箭头语法
    * 如果用箭头语法,函数里面有用到 this 也可以不用 bind this
    * 在JS中没有私有函数和变量的概念, 所以大多在定义私有函数的时候, 函数名通常用下横线(underscore)开头

    _onSearchTextChanged = (event) => {
        console.log('_onSearchTextChanged');
        this.setState({
            searchString: event.nativeEvent.text,
        });
        console.log('Current: ' + this.state.searchString + ', Next: ' + event.nativeEvent.text);
    };

    *   普通方式定义函数,
    *   如果函数里面有用到 this, 那一定需要在 constructor 中 bind this,
    *   否则会出现 this.setState is not a function 的错误
    * */
    _onSearchTextChanged(event) {
        this.setState({
            searchString: event.nativeEvent.text,
            isLoading: false,
        });
    };

    _onSearchPressed = () => {
        const query = urlForQueryAndPage('place_name', this.state.searchString, 1);
        this._executeQuery(query);
    };

    _executeQuery = (query) => {
        console.log(query);
        this.setState({
            isLoading: true,
        });

        // 网络请求数据
        // 1. 通过fetch(url) 函数来请求网络数据
        // 2. 请求成功后用 .then(func) 来转换数据
        // 3. 用 catch(func) 函数捕捉异常
        fetch(query)
            .then(response => response.json())
            .then(json => this._handleResponse(json.response))
            .catch(error => {
                this.setState({
                    isLoading: false,
                    message: 'Something bad happened' + error
                });
            })
    };

    _handleResponse = (response) => {
        this.setState({
            isLoading: false,
            message: ''
        });

        if (response.application_response_code.substr(0, 1) === '1') {
            console.log('Properties found: ' + response.listings.length);
            // Navigator跳转页面 / 用props传递数据
            // 1. 通过 this.props.navigator 获得 navigator
            // 2. 通过 navigator 的 push(obj) 跳转页面
            // 3. push()函数的入参主要包含 3 个值的字典
            //      3.1 title: 跳转的页面的标题
            //      3.2 component: 要跳转的页面(组件)
            //      3.3 passProps: 传递过去的参数值
            this.props.navigator.push({
                title: 'Results',
                component: SearchResults,
                passProps: {
                    listings: response.listings
                }
            });
        }
        else {
            this.setState({
                message: 'Location not recognized; please try again.'
            });
        };
    };

    render() {
        const spinner = this.state.isLoading ? <ActivityIndicator/> : null;
        return (
            <View style={styles.container}>
                <Text style={styles.description}>
                    Search for house to buy!
                </Text>
                <Text style={styles.description}>
                    Search by place-name or postcode.
                </Text>

                <View style={styles.flowRight}>
                    <TextInput
                        style={styles.searchInput}
                        value={this.state.searchString}
                        onChange={this._onSearchTextChanged}
                        placeholder='Search via name or postcode'
                    />
                    {/* Button 只能是非常简单的按钮, 如果要自定义按钮需要用 TouchableOpacity 或者 TouchableHighLight */}
                    <Button
                        onPress={this._onSearchPressed}
                        color='#48BBEC'
                        title='Go'
                    />
                </View>

                <Image
                    source={require('../Resources/house.png')}
                    style={styles.image}
                />

                {spinner}

                <Text style={styles.description}>{this.state.message}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 30,
        margin: 65,
        alignItems: 'center'
    },

    description: {
        marginBottom: 20,
        fontSize: 18,
        textAlign: 'center',
        color: '#656565'
    },

    flowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch'
    },

    searchInput: {
        height: 36,
        padding: 4,
        marginRight: 5,
        flexGrow: 1,    // CSS flex-grow 属性定义弹性盒子项（flex item）的拉伸因子。
        fontSize: 18,
        borderWidth: 1,
        borderColor: '#48BBEC',
        borderRadius: 8,
        color: '#48BBEC',
    },

    image: {
        width: 217,
        height: 138,
    }
});