import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useState, useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeftIcon } from 'lucide-react-native';
import fonts from '../../../config/fonts';
import images from '../../../config/images';
import DateInput from '../../../components/dateInput/DateInput';
import CalendarRangePicker from '../../../components/calendarRangePicker/CalendarRangePicker';
import { ShowToast, width } from '../../../config/constants';
import colors from '../../../config/colors';
import GradientButtonForAccomodation from '../../../components/gradientButtonForAccomodation/GradientButtonForAccomodation';
import { RouteProp } from '@react-navigation/native';
import { useCheckAvailabilityMutation } from '../../../redux/services/hotel.service';

const CalenderBooking = ({ navigation, route }: { navigation?: any, route: RouteProp<{ params: { hotelId: number, ownerId: number } }> }) => {
  const { top } = useSafeAreaInsets();
  const { hotelId, ownerId } = route.params;
  const [checkInDate, setCheckInDate] = useState<string>(''); // Display format
  const [checkOutDate, setCheckOutDate] = useState<string>(''); // Display format
  const [checkInDateRaw, setCheckInDateRaw] = useState<string>(''); // YYYY-MM-DD format
  const [checkOutDateRaw, setCheckOutDateRaw] = useState<string>(''); // YYYY-MM-DD format
  const [showCalendar, setShowCalendar] = useState<boolean>(true);
  const [checkAvailability, { isLoading }] = useCheckAvailabilityMutation();
  const headerStyles = useMemo(() => makeHeaderStyles(top), [top]);

  const handleDateRangeSelect = (startDate: string, endDate: string) => {
    if (startDate) {
      setCheckInDateRaw(startDate);
      setCheckInDate(formatDate(startDate));
    }
    if (endDate) {
      setCheckOutDateRaw(endDate);
      setCheckOutDate(formatDate(endDate));
    } else if (startDate && !endDate) {
      // Only start date selected, clear end date
      setCheckOutDateRaw('');
      setCheckOutDate('');
    }
  };

  const formatDate = (dateString: string): string => {
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
    return `${monthNames[date.getMonth()]
      } ${date.getDate()}, ${date.getFullYear()}`;
  };

  const handleCheckAvailability = async () => {
    // Navigate to Checkout screen with date information
    if (!checkInDateRaw) {
      ShowToast('error', 'Please select a check in date');
      return;
    }
    if (!checkOutDateRaw) {
      ShowToast('error', 'Please select a check out date');
      return;
    }
    try {
      const response = await checkAvailability({
        hotelId: hotelId,
        checkInDate: checkInDateRaw,
        checkOutDate: checkOutDateRaw,
      });
      console.log('response ===>', response);
      ShowToast('success', response.data.message || 'Availability checked successfully');
      navigation?.navigate('Checkout', {
        checkIn: checkInDateRaw,
        checkOut: checkOutDateRaw,
        checkInDisplay: checkInDate,
        checkOutDisplay: checkOutDate,
        hotelId: hotelId,
        ownerId: ownerId,
      });
    } catch (error) {
      console.log('error ===>', error);
      ShowToast('error', 'Cannot check availability at the moment');
    }
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

        <Text style={styles.headerTitle}>Calendar Booking</Text>

        <TouchableOpacity style={styles.profileContainer}>
          <Image source={images.avatar} style={styles.profileImage} />
          <View style={styles.greenDot} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.selectDateLabel}>Select Date</Text>

          {/* Calendar */}
          {showCalendar && (
            <CalendarRangePicker
              onDateRangeSelect={handleDateRangeSelect}
              initialStartDate={checkInDateRaw || undefined}
              initialEndDate={checkOutDateRaw || undefined}
            />
          )}

          {/* Check In / Check Out Fields */}
          <View style={styles.dateInputsContainer}>
            <DateInput
              placeholder="Check In"
              value={checkInDate}
              onPress={() => setShowCalendar(true)}
              otherStyles={styles.dateInput}
            />
            <DateInput
              placeholder="Check Out"
              value={checkOutDate}
              onPress={() => setShowCalendar(true)}
              otherStyles={styles.dateInput}
            />
          </View>

          {/* Check Availability Button */}
          <View style={styles.buttonContainer}>
            <GradientButtonForAccomodation
              title="Check Availability"
              onPress={handleCheckAvailability}
              fontSize={16}
              fontFamily={fonts.bold}
              otherStyles={styles.availabilityButton}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default CalenderBooking;

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
  contentContainer: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 100,
  },
  selectDateLabel: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: 10,
  },
  dateInputsContainer: {
    gap: 16,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width * 0.9,
  },
  dateInput: {
    marginBottom: 0,
    flex: 1,
    width: '48%',
  },
  buttonContainer: {
    marginTop: 30,
    width: width * 0.9,
  },
  availabilityButton: {
    backgroundColor: colors.c_0162C0,
    borderRadius: 100,
    height: 50,
  },
});
function showToast(arg0: string) {
  throw new Error('Function not implemented.');
}

