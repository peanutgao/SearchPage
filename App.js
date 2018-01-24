/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  NavigatorIOS,
} from 'react-native';

import SearchPage from './Modules/SearchPage';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});



export default class App extends Component<{}> {
  render() {
    return (
       // 创建一个 Navigator, iOS独有的,
       // 一定要设置 initialRoute中的 component属性, 相当于iOS中设置 navigator的rootViewController, 否则会出错
       <NavigatorIOS
           style={styles.container}
           initialRoute={{
             title: 'Property Finder',
             component: SearchPage, // component是小写的,
           }}
       />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
