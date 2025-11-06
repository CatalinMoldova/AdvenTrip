import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ThemedText } from './themed-text'

const Input = (props) => {
  return (
    <View style={[styles.container, props.containerStyles && props.containerStyles]}>
      {props.icon && props.icon}
      <ThemedText ref={props.inputRef && props.inputRef} {...props}></ThemedText>
      <Text>Input</Text>
    </View>
  )
}

export default Input

const styles = StyleSheet.create({})