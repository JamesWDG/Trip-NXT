import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import PrimaryHeader from '../primaryHeader/PrimaryHeader';
import colors from '../../config/colors';
import { NavigationProp } from '@react-navigation/native';

const WrapperContainer = ({
  title,
  children,
  navigation,
  showRight,
}: {
  title: string;
  showRight: boolean;
  children: React.ReactNode;
  navigation?: NavigationProp<any>;
}) => {
  return (
    <View style={styles.container}>
      <PrimaryHeader
        onProfilePress={() => navigation?.navigate('Profile')}
        title={title}
        showRight={showRight}
        onBackPress={() => navigation?.goBack()}
      />
      <View style={styles.scrollViewContent}>{children}</View>
    </View>
  );
};

export default WrapperContainer;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.c_0162C0,
    flex: 1,
  },
  scrollViewContent: {
    backgroundColor: colors.white,
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // paddingHorizontal: 20,
  },
});
