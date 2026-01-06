import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import RideWrapper from '../../../components/rideWrapper/RideWrapper';
import { NavigationProp } from '@react-navigation/native';
import BottomSheetComponent, {
  BottomSheetComponentRef,
} from '../../../components/bottomSheetComp/BottomSheetComp';
import {
  MapPin,
  Home,
  Briefcase,
  Store,
  GraduationCap,
  Grid3x3,
  Check,
} from 'lucide-react-native';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import { width } from '../../../config/constants';
import PrimaryHeader from '../../../components/primaryHeader/PrimaryHeader';

const SaveAddress = ({
  navigation,
  route,
}: {
  navigation: NavigationProp<any>;
  route?: any;
}) => {
  const openRefModal = useRef<BottomSheetComponentRef>(null);
  const [houseNo, setHouseNo] = useState('');
  const [buildingStreet, setBuildingStreet] = useState('');
  const [landmark, setLandmark] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Home');

  // Fill location field from route params
  useEffect(() => {
    if (route?.params?.location) {
      setBuildingStreet(route.params.location);
    }
  }, [route?.params?.location]);

  useEffect(() => {
    const timer = setTimeout(() => {
      openRefModal.current?.open();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const categories = [
    { id: 'Home', icon: Home, label: 'Home' },
    { id: 'Work', icon: Briefcase, label: 'Work' },
    { id: 'Shop', icon: Store, label: 'Shop' },
    { id: 'Edu', icon: GraduationCap, label: 'Edu' },
    { id: 'Other', icon: Grid3x3, label: 'Other' },
  ];

  const handleSave = () => {
    // Handle save logic
    console.log('Saving address:', {
      houseNo,
      buildingStreet,
      landmark,
      category: selectedCategory,
    });
    openRefModal.current?.close();

    setTimeout(() => {
      navigation.navigate('EnableLocation');
    }, 100);
  };

  return (
    <RideWrapper navigation={navigation} ref={openRefModal}>
      <PrimaryHeader
        title={'Save Address'}
        onBackPress={() => navigation?.goBack()}
      />
      <BottomSheetComponent ref={openRefModal}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.iconContainer}>
              <MapPin size={48} color={colors.c_666666} strokeWidth={1.5} />
              <View style={styles.flagIcon}>
                <View style={styles.flagDot} />
              </View>
            </View>
            <Text style={styles.title}>Save Address</Text>
            <Text style={styles.description}>
              We will need your Location to give you better Experience.
            </Text>
          </View>

          {/* Input Fields */}
          <View style={styles.inputsSection}>
            {/* Two side-by-side inputs */}
            <View style={styles.rowInputs}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="house/Flat No"
                placeholderTextColor={colors.c_666666}
                value={houseNo}
                onChangeText={setHouseNo}
              />
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Building/Street"
                placeholderTextColor={colors.c_666666}
                value={buildingStreet}
                onChangeText={setBuildingStreet}
              />
            </View>

            {/* Full width input */}
            <TextInput
              style={styles.input}
              placeholder="Nearby Landmark (Optional)"
              placeholderTextColor={colors.c_666666}
              value={landmark}
              onChangeText={setLandmark}
            />
          </View>

          {/* Category Buttons */}
          <View style={styles.categoriesSection}>
            <Text style={styles.categoriesTitle}>Category</Text>
            <View style={styles.categoriesRow}>
              {categories.map(category => {
                const Icon = category.icon;
                const isSelected = selectedCategory === category.id;
                return (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryButton,
                      isSelected && styles.categoryButtonSelected,
                    ]}
                    onPress={() => setSelectedCategory(category.id)}
                  >
                    <Icon
                      size={24}
                      color={isSelected ? colors.primary : colors.c_666666}
                      strokeWidth={1.5}
                    />
                    <Text
                      style={[
                        styles.categoryLabel,
                        isSelected && styles.categoryLabelSelected,
                      ]}
                    >
                      {category.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Check size={32} color={colors.white} strokeWidth={3} />
          </TouchableOpacity>
        </ScrollView>
      </BottomSheetComponent>
    </RideWrapper>
  );
};

export default SaveAddress;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 60,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  flagIcon: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flagDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.c_2B2B2B,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  inputsSection: {
    marginBottom: 32,
    gap: 16,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  input: {
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.c_F3F3F3,
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.black,
    borderWidth: 1,
    borderColor: colors.c_DDDDDD,
  },
  halfInput: {
    flex: 1,
  },
  categoriesSection: {
    marginBottom: 32,
  },
  categoriesTitle: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.c_2B2B2B,
    marginBottom: 16,
  },
  categoriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  categoryButton: {
    flex: 1,
    height: 80,
    borderRadius: 12,
    backgroundColor: colors.c_F3F3F3,
    borderWidth: 1,
    borderColor: colors.c_DDDDDD,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  categoryButtonSelected: {
    backgroundColor: colors.white,
    borderColor: colors.primary,
    borderWidth: 2,
  },
  categoryLabel: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.c_666666,
  },
  categoryLabelSelected: {
    color: colors.primary,
    fontFamily: fonts.semibold,
  },
  saveButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
