import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { Phone } from 'lucide-react-native';
import GradientButtonForAccomodation from '../gradientButtonForAccomodation/GradientButtonForAccomodation';
import fonts from '../../config/fonts';
import colors from '../../config/colors';
import images from '../../config/images';

const DriverDetailsComp = ({
  handleCall = () => {},
  handleCancelRequest = () => {},
}) => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <Text style={styles.title}>Driver Details</Text>

      {/* Driver Information */}
      <View style={styles.driverInfoContainer}>
        <Image
          source={images.user_avatar}
          style={styles.driverAvatar}
          resizeMode="cover"
        />
        <View style={styles.driverDetails}>
          <Text style={styles.driverName}>Lorem Ipsum</Text>
          <View style={styles.phoneContainer}>
            <Phone size={14} color={colors.c_666666} />
            <Text style={styles.phoneNumber}>123 456 7890</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.callButton}
          onPress={handleCall}
          activeOpacity={0.7}
        >
          <Phone size={20} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* Cancel Request Button */}
      <GradientButtonForAccomodation
        title="Cancel Request"
        onPress={handleCancelRequest}
        color={colors.white}
        fontSize={16}
        fontFamily={fonts.bold}
        otherStyles={styles.cancelButton}
      />
    </ScrollView>
  );
};

export default DriverDetailsComp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 60,
  },
  title: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    marginBottom: 24,
    textAlign: 'center',
  },
  driverInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    gap: 12,
  },
  driverAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.c_F3F3F3,
  },
  driverDetails: {
    flex: 1,
    gap: 4,
  },
  driverName: {
    fontSize: 16,
    fontFamily: fonts.bold,
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
    color: colors.c_666666,
  },
  callButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.c_F47E20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    width: '100%',
    marginTop: 10,
  },
});
