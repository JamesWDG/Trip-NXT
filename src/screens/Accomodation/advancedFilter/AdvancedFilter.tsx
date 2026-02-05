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
import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeftIcon } from 'lucide-react-native';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import images from '../../../config/images';
import DateInput from '../../../components/dateInput/DateInput';
import DropdownSelect from '../../../components/dropdownSelect/DropdownSelect';
import PriceRangeSlider from '../../../components/priceRangeSlider/PriceRangeSlider';
import { width } from '../../../config/constants';
import GradientButtonForAccomodation from '../../../components/gradientButtonForAccomodation/GradientButtonForAccomodation';
import CalendarRangePicker from '../../../components/calendarRangePicker/CalendarRangePicker';

const GOOGLE_PLACES_API_KEY = 'AIzaSyD28UEoebX1hKscL3odt2TiTRVfe5SSpwE';
const ROOM_TYPE_OPTIONS = ['Standard', 'Budget', 'Luxury'];
const GUEST_OPTIONS = ['1', '2', '3', '4', '5', '6', '7', '8+'];
const ROOM_OPTIONS = ['1', '2', '3', '4', '5+'];

type CitySuggestion = { id: string; city: string; description: string };

const AdvancedFilter = ({ navigation }: { navigation?: any }) => {
  const { top } = useSafeAreaInsets();
  const [city, setCity] = useState<string>('');
  const [citySuggestions, setCitySuggestions] = useState<CitySuggestion[]>([]);
  const [showCityDropdown, setShowCityDropdown] = useState<boolean>(false);
  const [citySearchLoading, setCitySearchLoading] = useState<boolean>(false);
  const cityDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [checkInDate, setCheckInDate] = useState<string>('');
  const [checkOutDate, setCheckOutDate] = useState<string>('');
  const [checkInDateRaw, setCheckInDateRaw] = useState<string>('');
  const [checkOutDateRaw, setCheckOutDateRaw] = useState<string>('');
  const [guests, setGuests] = useState<string>('');
  const [rooms, setRooms] = useState<string>('');
  const [roomType, setRoomType] = useState<string>('');
  const [priceMin, setPriceMin] = useState<number>(100);
  const [priceMax, setPriceMax] = useState<number>(300);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);

  const headerStyles = useMemo(() => makeHeaderStyles(top), [top]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return `${
      monthNames[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()}`;
  };

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

  const handleDateRangeSelect = (startDate: string, endDate: string) => {
    if (startDate) {
      setCheckInDateRaw(startDate);
      setCheckInDate(formatDate(startDate));
    }
    if (endDate) {
      setCheckOutDateRaw(endDate);
      setCheckOutDate(formatDate(endDate));
    } else if (startDate && !endDate) {
      setCheckOutDateRaw('');
      setCheckOutDate('');
    }
  };

  const parseCount = (s: string): number | undefined => {
    if (!s) return undefined;
    const match = s.replace(/\D/g, '');
    if (match === '' || match === '+') return undefined;
    const n = parseInt(match, 10);
    return Number.isNaN(n) ? undefined : n;
  };

  const handleSearch = () => {
    const filters = {
      city: city.trim() || undefined,
      checkInDate: checkInDateRaw || undefined,
      checkOutDate: checkOutDateRaw || undefined,
      guests: parseCount(guests),
      rooms: parseCount(rooms),
      roomType: roomType ? roomType.toLowerCase() : undefined,
      priceMin: priceMin ?? 100,
      priceMax: priceMax ?? 300,
      page: 1,
      limit: 20,
    };
    navigation?.navigate('HotelSearchResults', { filters });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[headerStyles.headerContainer, styles.header]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
        >
          <ChevronLeftIcon color={colors.white} size={24} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Advance Filter</Text>

        <TouchableOpacity style={styles.profileContainer}>
          <Image source={images.avatar} style={styles.profileImage} />
          <View style={styles.greenDot} />
        </TouchableOpacity>
      </View>

      <View style={styles.mainContainer}>
        {/* Content */}
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* City Filter - type to search city */}
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

            {/* Date Selection - only hotels not booked between these dates */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Check-in & Check-out</Text>
              <View style={styles.dateInputsRow}>
                <DateInput
                  placeholder="Check In"
                  value={checkInDate}
                  onPress={() => setShowCalendar(true)}
                  otherStyles={styles.dateInputHalf}
                />
                <DateInput
                  placeholder="Check Out"
                  value={checkOutDate}
                  onPress={() => setShowCalendar(true)}
                  otherStyles={styles.dateInputHalf}
                />
              </View>
              <Text style={styles.hintText}>
                Only hotels available for these dates will be shown (booked hotels excluded).
              </Text>
            </View>

            {/* Guests & Rooms */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Guests & Rooms</Text>
              <View style={styles.dropdownRow}>
                <DropdownSelect
                  placeholder="Guests"
                  value={guests}
                  onSelect={value => setGuests(value)}
                  options={GUEST_OPTIONS}
                  otherStyles={styles.dropdownHalf}
                />
                <DropdownSelect
                  placeholder="Rooms"
                  value={rooms}
                  onSelect={value => setRooms(value)}
                  options={ROOM_OPTIONS}
                  otherStyles={styles.dropdownHalf}
                />
              </View>
            </View>

            {/* Price Range Per Day */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Price range per day</Text>
              <PriceRangeSlider
                onRangeChange={(min, max) => {
                  setPriceMin(min);
                  setPriceMax(max);
                }}
              />
            </View>

            {/* Room Type */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Room type</Text>
              <DropdownSelect
                placeholder="Room type"
                value={roomType}
                onSelect={value => setRoomType(value)}
                options={ROOM_TYPE_OPTIONS}
              />
            </View>

            {/* Search Button */}
            <View style={styles.buttonContainer}>
              <GradientButtonForAccomodation
                title="Search Now"
                onPress={handleSearch}
                fontSize={16}
                fontFamily={fonts.bold}
                otherStyles={styles.searchButton}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
      {/* Calendar Modal */}
      <Modal
        visible={showCalendar}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCalendar(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Date</Text>
              <TouchableOpacity
                onPress={() => setShowCalendar(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.calendarContainer}
            >
              <CalendarRangePicker
                onDateRangeSelect={handleDateRangeSelect}
                initialStartDate={checkInDateRaw || undefined}
                initialEndDate={checkOutDateRaw || undefined}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AdvancedFilter;

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
  container: {
    flex: 1,
    backgroundColor: colors.c_0162C0,
  },
  flex: {
    flex: 1,
  },
  header: {
    backgroundColor: colors.c_0162C0,
  },
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
  profileContainer: {
    position: 'relative',
    width: 36,
    height: 36,
  },
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
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: 12,
  },
  hintText: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    marginTop: 8,
    marginBottom: 4,
  },
  cityInputWrapper: {
    position: 'relative',
    marginTop: 8,
  },
  cityInput: {
    backgroundColor: colors.white,
    borderRadius: 100,
    height: 48,
    paddingHorizontal: 20,
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.black,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    overflow: 'hidden',
  },
  cityDropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.c_F3F3F3,
  },
  cityDropdownText: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.black,
  },
  dateInputsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateInputHalf: {
    flex: 1,
    width: 'auto',
  },
  dropdownRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dropdownHalf: {
    flex: 1,
  },
  buttonContainer: {
    marginTop: 20,
    width: width * 0.9,
  },
  searchButton: {
    backgroundColor: colors.c_0162C0,
    borderRadius: 100,
    height: 50,
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
    maxHeight: '80%',
    paddingTop: 20,
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
  closeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  closeButtonText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.c_0162C0,
  },
  calendarContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
});
