import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { Phone } from 'lucide-react-native';
import FastImage from 'react-native-fast-image';
import colors from '../../config/colors';
import fonts from '../../config/fonts';

interface ContactCardProps {
  name: string;
  phoneNumber: string;
  avatar?: ImageSourcePropType | string;
  onCallPress?: () => void;
  onPress?: () => void;
}

const ContactCard = ({
  name,
  phoneNumber,
  avatar,
  onCallPress,
  onPress,
}: ContactCardProps) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Profile Picture */}
      <View style={styles.avatarContainer}>
        {avatar ? (
          typeof avatar === 'string' ? (
            <FastImage
              source={{ uri: avatar } as any}
              style={styles.avatar}
              resizeMode="cover"
            />
          ) : (
            <Image source={avatar} style={styles.avatar} resizeMode="cover" />
          )
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      {/* Contact Information */}
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <View style={styles.phoneContainer}>
          <Phone size={14} color={colors.c_F47E20} strokeWidth={2} />
          <Text style={styles.phoneNumber}>{phoneNumber}</Text>
        </View>
      </View>

      {/* Call Button */}
      <TouchableOpacity
        style={styles.callButton}
        onPress={onCallPress}
        activeOpacity={0.7}
      >
        <Phone size={20} color={colors.white} strokeWidth={2} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default ContactCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    // Shadow for avatar
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    backgroundColor: colors.c_F3F3F3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.c_666666,
  },
  infoContainer: {
    flex: 1,
    gap: 6,
  },
  name: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.c_2B2B2B,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  phoneNumber: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_2B2B2B,
  },
  callButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.c_F47E20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});



