import { StyleSheet, Text, TextInput, View } from 'react-native';
import React from 'react';
import { LucideIcon } from 'lucide-react-native';
import colors from '../../config/colors';
import fonts from '../../config/fonts';

interface ProfileInputFieldProps {
  icon: React.ComponentType<any>;
  value: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  editable?: boolean;
  onChangeText?: (text: string) => void;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
}

const ProfileInputField = ({
  icon: Icon,
  value,
  placeholder,
  secureTextEntry = false,
  editable = true,
  onChangeText,
  keyboardType = 'default',
}: ProfileInputFieldProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon size={20} color={colors.white} />
      </View>
      <TextInput
        style={[styles.input, !editable && styles.inputDisabled]}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={colors.white}
        secureTextEntry={secureTextEntry}
        editable={editable}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
      <View style={styles.separator} />
    </View>
  );
};

export default ProfileInputField;

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  iconContainer: {
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    fontFamily: fonts.normal,
    color: colors.white,
    paddingVertical: 8,
  },
  inputDisabled: {
    opacity: 0.8,
  },
  separator: {
    height: 1,
    backgroundColor: colors.white,
    opacity: 0.3,
    marginTop: 8,
  },
});
