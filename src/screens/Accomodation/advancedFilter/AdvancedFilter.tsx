import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState, useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeftIcon } from 'lucide-react-native';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import images from '../../../config/images';
import SearchWithInput from '../../../components/searchWithInput/SearchWithInput';
import DateInput from '../../../components/dateInput/DateInput';
import DropdownSelect from '../../../components/dropdownSelect/DropdownSelect';
import PriceRangeSlider from '../../../components/priceRangeSlider/PriceRangeSlider';
import RatingButtons from '../../../components/ratingButtons/RatingButtons';
import GradientButton from '../../../components/gradientButton/GradientButton';
import { width } from '../../../config/constants';
import GradientButtonForAccomodation from '../../../components/gradientButtonForAccomodation/GradientButtonForAccomodation';
import CalendarRangePicker from '../../../components/calendarRangePicker/CalendarRangePicker';

const AdvancedFilter = ({ navigation }: { navigation?: any }) => {
  const { top } = useSafeAreaInsets();
  const [checkInDate, setCheckInDate] = useState<string>('');
  const [checkOutDate, setCheckOutDate] = useState<string>('');
  const [checkInDateRaw, setCheckInDateRaw] = useState<string>('');
  const [checkOutDateRaw, setCheckOutDateRaw] = useState<string>('');
  const [guests, setGuests] = useState<string>('');
  const [rooms, setRooms] = useState<string>('');
  const [roomType, setRoomType] = useState<string>('');
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

  const handleSearch = () => {
    // Handle search logic
    console.log('Search with filters');
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
            {/* City Filter */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>City</Text>
              <View style={styles.searchContainer}>
                <SearchWithInput placeholder="Search City Here..." />
              </View>
            </View>

            {/* Date Selection */}
            <View style={styles.section}>
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
            </View>

            {/* Guests and Rooms */}
            <View style={styles.section}>
              <View style={styles.dropdownRow}>
                <DropdownSelect
                  placeholder="Guests"
                  value={guests}
                  onSelect={value => setGuests(value)}
                  otherStyles={styles.dropdownHalf}
                />
                <DropdownSelect
                  placeholder="Rooms"
                  value={rooms}
                  onSelect={value => setRooms(value)}
                  otherStyles={styles.dropdownHalf}
                />
              </View>
            </View>

            {/* Price Range */}
            <View style={styles.section}>
              <PriceRangeSlider onRangeChange={(min, max) => {}} />
            </View>

            {/* Room Type */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Rooms Type</Text>
              <DropdownSelect
                placeholder="Room Type"
                value={roomType}
                onSelect={value => setRoomType(value)}
              />
            </View>

            {/* Ratings */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Ratings</Text>
              <RatingButtons onRatingSelect={rating => {}} />
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
  searchContainer: {
    marginTop: 8,
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
