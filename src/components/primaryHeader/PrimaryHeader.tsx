import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeftIcon, User2Icon } from 'lucide-react-native';
import colors from '../../config/colors';
import fonts from '../../config/fonts';

const PrimaryHeader = ({
  title,
  onBackPress = () => {},
  onProfilePress = () => {},
  showRight = true,
  color = colors.white,
}: {
  title: string;
  navigation?: any;
  onBackPress: () => void;
  onProfilePress: () => void;
  showRight?: boolean;
  color?: string;
}) => {
  const { top } = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(top), [top]);
  return (
    <View style={styles.container}>
      <TouchableOpacity style={style.backButtonStyles} onPress={onBackPress}>
        <ChevronLeftIcon color={colors.white} />
      </TouchableOpacity>

      <Text style={[style.title, { color }]}>{title}</Text>

      {showRight ? (
        <TouchableOpacity onPress={onProfilePress} style={style.userIconStyles}>
          <User2Icon fill={colors.white} color={colors.white} size={22} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default PrimaryHeader;

const makeStyles = (top: number) =>
  StyleSheet.create({
    container: {
      paddingTop: top + 10,
      paddingBottom: 25,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
  });
const style = StyleSheet.create({
  userIconStyles: {
    borderColor: colors.white,
    borderWidth: 1,
    borderRadius: 100,
    padding: 5,
  },
  backButtonStyles: {
    backgroundColor: colors.c_EE4026,
    padding: 5,
    borderRadius: 100,
  },
  title: {
    fontSize: 22,
    fontFamily: fonts.bold,
    color: colors.white,
  },
});
