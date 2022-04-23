import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BackButton } from '../../components/backbutton';

export function SupportHeader(props) {
  const { navigation, title } = props;
  return (
    <View style={hstyle.container}>
      <BackButton navigation={navigation} />
      <Text style={hstyle.title}>{title}</Text>
      <View style={hstyle.rightSpace} />
    </View>
  );
}

const hstyle = StyleSheet.create({
  container: {
    paddingTop: 48,
    paddingBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 19,
    fontWeight: 'bold',
  },
  rightSpace: {
    width: 36,
    height: 36,
  },
});

export const styles = StyleSheet.create({
  container: {
    height: '100%',
    paddingHorizontal: 32,
  },
  scrollViewer: {
    flex: 1,
  },
  title: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  chapter: {
    marginBottom: 24,
  },
  h1: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  h2: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  paragraph: {
    marginBottom: 8,
  },
  bullet: {
    fontSize: 13,
    lineHeight: 18,
    paddingVertical: 4,
    paddingLeft: 12,
  },
  p: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  bottomSpace: {
    height: 16,
  },
});
