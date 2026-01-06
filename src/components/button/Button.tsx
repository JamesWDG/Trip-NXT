import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
interface Params {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  color?: string;
  fontSize?: number;
  fontFamily?: string;
  otherStyles?: ViewStyle | ViewStyle[];
  bgColor?: string;
}
const Button = ({
  title,
  onPress,
  disabled = false,
  color = colors.black,
  fontSize = 14,
  fontFamily = fonts.normal,
  otherStyles = {},
  bgColor = colors.white,
}: Params) => {
  const textStyles = textStyle(color, fontSize, fontFamily);
  const containerStyles = styles((bgColor = colors.white));
  return (
    <TouchableOpacity
      style={[containerStyles.button, otherStyles]}
      disabled={disabled}
      onPress={onPress}
    >
      <Text style={textStyles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;

const textStyle = (color: string, fontSize: number, fontFamily: string) =>
  StyleSheet.create({
    text: {
      color: color,
      fontSize: fontSize,
      fontFamily: fontFamily,
    },
  });
const styles = (bgColor: string) =>
  StyleSheet.create({
    button: {
      height: 50,
      width: '100%',
      borderRadius: 100,
      backgroundColor: bgColor,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
