import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeftIcon, Clock } from 'lucide-react-native';
import DatePicker from 'react-native-date-picker';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import images from '../../../config/images';
import DropdownSelect from '../../../components/dropdownSelect/DropdownSelect';
import GradientButtonForAccomodation from '../../../components/gradientButtonForAccomodation/GradientButtonForAccomodation';
import { width } from '../../../config/constants';

const parseTimeToDate = (timeStr: string): Date => {
  const [h, m] = timeStr.split(':').map(Number);
  const d = new Date();
  d.setHours(isNaN(h) ? 12 : h, isNaN(m) ? 0 : m, 0, 0);
  return d;
};

const formatDateToTime = (date: Date): string =>
  `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

const GOOGLE_PLACES_API_KEY = 'AIzaSyD28UEoebX1hKscL3odt2TiTRVfe5SSpwE';
const DAY_OPTIONS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

type CitySuggestion = { id: string; city: string; description: string };

export type RestaurantFilterParams = {
  city?: string;
  minRadius?: number;
  maxRadius?: number;
  day?: string;
  time?: string;
  page?: number;
  limit?: number;
};

const RestaurantFilter = ({ navigation }: { navigation?: any }) => {
  const { top } = useSafeAreaInsets();
  const [city, setCity] = useState('');
  const [citySuggestions, setCitySuggestions] = useState<CitySuggestion[]>([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [citySearchLoading, setCitySearchLoading] = useState(false);
  const cityDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [minRadius, setMinRadius] = useState<string>('5');
  const [maxRadius, setMaxRadius] = useState<string>('20');
  const [day, setDay] = useState<string>('');
  const [time, setTime] = useState<string>('14:30');
  const [showTimePicker, setShowTimePicker] = useState(false);

  const timePickerDate = useMemo(() => parseTimeToDate(time), [time]);
  const headerStyles = useMemo(() => makeHeaderStyles(top), [top]);

  const fetchCitySuggestions = useCallback(async (query: string): Promise<CitySuggestion[]> => {
    if (!query || query.length < 2) return [];
    try {
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        query,
      )}&key=${GOOGLE_PLACES_API_KEY}&types=(regions)&language=en`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.status === 'OK' && data.predictions && Array.isArray(data.predictions)) {
        return data.predictions.map((p: any, index: number) => {
          const main = p.structured_formatting?.main_text || p.description?.split(',')[0]?.trim() || '';
          const secondary = p.structured_formatting?.secondary_text || p.description || '';
          return {
            id: `city-${p.place_id || index}`,
            city: main,
            description: secondary ? `${main}, ${secondary}` : main,
          };
        });
      }
      return [];
    } catch {
      return [];
    }
  }, []);

  const handleCityChange = useCallback(
    (text: string) => {
      setCity(text);
      if (cityDebounceRef.current) clearTimeout(cityDebounceRef.current);
      if (text.length < 2) {
        setCitySuggestions([]);
        setShowCityDropdown(false);
        return;
      }
      setShowCityDropdown(true);
      cityDebounceRef.current = setTimeout(async () => {
        cityDebounceRef.current = null;
        setCitySearchLoading(true);
        const results = await fetchCitySuggestions(text);
        setCitySuggestions(results);
        setCitySearchLoading(false);
      }, 400);
    },
    [fetchCitySuggestions],
  );

  const handleSelectCity = useCallback((suggestion: CitySuggestion) => {
    setCity(suggestion.city);
    setCitySuggestions([]);
    setShowCityDropdown(false);
  }, []);

  useEffect(() => {
    return () => {
      if (cityDebounceRef.current) clearTimeout(cityDebounceRef.current);
    };
  }, []);

  const handleSearch = () => {
    const filters: RestaurantFilterParams = {
      city: city.trim() || undefined,
      minRadius: minRadius ? parseInt(minRadius, 10) : undefined,
      maxRadius: maxRadius ? parseInt(maxRadius, 10) : undefined,
      day: day ? day.toLowerCase() : undefined,
      time: time.trim() || undefined,
      page: 1,
      limit: 10,
    };
    navigation?.navigate('FoodRestaurantSearchResults', { filters });
  };

  return (
    <View style={styles.container}>
      <View style={[headerStyles.headerContainer, styles.header]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
        >
          <ChevronLeftIcon color={colors.white} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Restaurant Filter</Text>
        <TouchableOpacity style={styles.profileContainer}>
          <Image source={images.avatar} style={styles.profileImage} />
          <View style={styles.greenDot} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.mainContainer}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>City</Text>
            <View style={styles.cityInputWrapper}>
              <TextInput
                placeholder="Search city..."
                placeholderTextColor={colors.c_666666}
                style={styles.cityInput}
                value={city}
                onChangeText={handleCityChange}
                onFocus={() => citySuggestions.length > 0 && setShowCityDropdown(true)}
                onBlur={() => setTimeout(() => setShowCityDropdown(false), 200)}
              />
              {citySearchLoading && (
                <View style={styles.cityLoader}>
                  <ActivityIndicator size="small" color={colors.c_0162C0} />
                </View>
              )}
              {showCityDropdown && citySuggestions.length > 0 && (
                <View style={styles.cityDropdown}>
                  {citySuggestions.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.cityDropdownItem}
                      onPress={() => handleSelectCity(item)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.cityDropdownText} numberOfLines={1}>
                        {item.description}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Radius (km)</Text>
            <View style={styles.row}>
              <TextInput
                placeholder="Min (e.g. 5)"
                placeholderTextColor={colors.c_666666}
                style={[styles.input, styles.inputHalf]}
                value={minRadius}
                onChangeText={setMinRadius}
                keyboardType="number-pad"
              />
              <TextInput
                placeholder="Max (e.g. 20)"
                placeholderTextColor={colors.c_666666}
                style={[styles.input, styles.inputHalf]}
                value={maxRadius}
                onChangeText={setMaxRadius}
                keyboardType="number-pad"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Day</Text>
            <DropdownSelect
              placeholder="Select day"
              value={day}
              onSelect={setDay}
              options={DAY_OPTIONS.map(d => d.charAt(0).toUpperCase() + d.slice(1))}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Time</Text>
            <TouchableOpacity
              style={styles.timePickerTouchable}
              onPress={() => setShowTimePicker(true)}
              activeOpacity={0.7}
            >
              <Clock size={20} color={colors.c_666666} />
              <Text style={[styles.timePickerText, !time && styles.timePickerPlaceholder]}>
                {time || 'Select time'}
              </Text>
            </TouchableOpacity>
            <Modal
              visible={showTimePicker}
              transparent
              animationType="slide"
              onRequestClose={() => setShowTimePicker(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Select time</Text>
                    <TouchableOpacity
                      onPress={() => setShowTimePicker(false)}
                      style={styles.modalCloseButton}
                    >
                      <Text style={styles.modalCloseButtonText}>Done</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.timePickerContainer}>
                    <DatePicker
                      date={timePickerDate}
                      mode="time"
                      onDateChange={(date) => setTime(formatDateToTime(date))}
                      theme="light"
                    />
                  </View>
                </View>
              </View>
            </Modal>
          </View>

          <View style={styles.buttonContainer}>
            <GradientButtonForAccomodation
              title="Search"
              onPress={handleSearch}
              fontSize={16}
              fontFamily={fonts.bold}
              otherStyles={styles.searchButton}
            />
          </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default RestaurantFilter;

const makeHeaderStyles = (top: number) =>
  StyleSheet.create({
    headerContainer: {
      paddingTop: top + 10,
      paddingBottom: 25,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      backgroundColor: colors.c_0162C0,
    },
  });

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.c_0162C0 },
  flex: { flex: 1 },
  header: { backgroundColor: colors.c_0162C0 },
  backButton: {
    backgroundColor: colors.c_EE4026,
    padding: 8,
    borderRadius: 100,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  profileContainer: { position: 'relative', width: 36, height: 36 },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.white,
  },
  greenDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.green,
    borderWidth: 2,
    borderColor: colors.c_0162C0,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 100,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -1,
  },
  section: { marginBottom: 24 },
  sectionLabel: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: 12,
  },
  cityInputWrapper: {
    position: 'relative',
    marginTop: 8,
  },
  cityInput: {
    backgroundColor: colors.white,
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.black,
    borderWidth: 1,
    borderColor: colors.c_DDDDDD,
  },
  cityLoader: {
    position: 'absolute',
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  cityDropdown: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginTop: 6,
    maxHeight: 220,
    borderWidth: 1,
    borderColor: colors.c_DDDDDD,
    overflow: 'hidden',
  },
  cityDropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.c_F3F3F3,
  },
  cityDropdownText: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.black,
  },
  timePickerTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.c_DDDDDD,
  },
  timePickerText: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.black,
  },
  timePickerPlaceholder: {
    color: colors.c_666666,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 34,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.c_F3F3F3,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  modalCloseButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  modalCloseButtonText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.c_0162C0,
  },
  timePickerContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.black,
    borderWidth: 1,
    borderColor: colors.c_DDDDDD,
  },
  inputHalf: { flex: 1 },
  row: { flexDirection: 'row', gap: 12 },
  hint: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    marginTop: 6,
  },
  buttonContainer: { marginTop: 24 },
  searchButton: {
    backgroundColor: colors.c_0162C0,
    borderRadius: 100,
    height: 50,
  },
});
