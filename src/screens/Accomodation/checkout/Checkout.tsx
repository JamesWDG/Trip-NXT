import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState, useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeftIcon, MapPin, Plus } from 'lucide-react-native';

import fonts from '../../../config/fonts';
import images from '../../../config/images';
import DateInput from '../../../components/dateInput/DateInput';
import DropdownSelect from '../../../components/dropdownSelect/DropdownSelect';
import Counter from '../../../components/counter/Counter';
import PriceDetailsCard from '../../../components/priceDetailsCard/PriceDetailsCard';
import PaymentOption from '../../../components/paymentOption/PaymentOption';
import CreditCardDisplay from '../../../components/creditCardDisplay/CreditCardDisplay';
import ToggleBox from '../../../components/toggleBox/ToggleBox';
import GradientButton from '../../../components/gradientButton/GradientButton';
import StarRating from 'react-native-star-rating-widget';
import { width } from '../../../config/constants';
import colors from '../../../config/colors';
import GradientButtonForAccomodation from '../../../components/gradientButtonForAccomodation/GradientButtonForAccomodation';

const getNights = (checkIn: string, checkOut: string): number => {
  if (!checkIn || !checkOut) return 1;
  const start = new Date(checkIn).getTime();
  const end = new Date(checkOut).getTime();
  return Math.max(1, Math.ceil((end - start) / (24 * 60 * 60 * 1000)));
};

const getLocationString = (location: { city?: string; state?: string; country?: string } | null): string => {
  if (!location) return '';
  const parts = [location.city, location.state, location.country].filter(Boolean);
  return parts.join(', ');
};

const Checkout = ({ navigation, route }: { navigation?: any; route?: any }) => {
  const { top } = useSafeAreaInsets();
  const routeParams = route?.params || {};
  const hotel = Array.isArray(routeParams.hotel) ? routeParams.hotel[0] : routeParams.hotel;
  const checkIn = routeParams.checkIn || '';
  const checkOut = routeParams.checkOut || '';
  const nights = useMemo(() => getNights(checkIn, checkOut), [checkIn, checkOut]);

  const [checkInDate, setCheckInDate] = useState<string>(
    routeParams.checkInDisplay || 'Sep 13, 2021',
  );
  const [checkOutDate, setCheckOutDate] = useState<string>(
    routeParams.checkOutDisplay || 'Sep 17, 2021',
  );
  const [roomType, setRoomType] = useState<string>(
    hotel?.hotelType ? String(hotel.hotelType).charAt(0).toUpperCase() + String(hotel.hotelType).slice(1) : 'Standard',
  );
  const maxRooms = hotel?.numberOfRooms ?? 10;
  const [numberOfRooms, setNumberOfRooms] = useState(1);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [bookingEmail, setBookingEmail] = useState('');
  const [sendEmails, setSendEmails] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');

  const headerStyles = useMemo(() => makeHeaderStyles(top), [top]);

  const rentPerDay = hotel?.rentPerDay ?? 0;
  const roomTotal = rentPerDay * nights * numberOfRooms;
  const taxes = Math.round(roomTotal * 0.1);
  const serviceFees = Math.round(roomTotal * 0.02);
  const priceItems = useMemo(
    () => [
      { label: `${numberOfRooms} room x ${nights} night${nights > 1 ? 's' : ''}`, amount: roomTotal },
      { label: 'Taxes', amount: taxes },
      { label: 'Service Fees', amount: serviceFees },
      { label: 'Discount', amount: 0 },
    ],
    [numberOfRooms, nights, roomTotal, taxes, serviceFees],
  );
  const totalAmount = priceItems.reduce((sum, item) => sum + item.amount, 0);

  const hotelImageSource = hotel?.images?.length
    ? { uri: hotel.images[0] }
    : images.hotel_details;
  const hotelLocation = getLocationString(hotel?.location ?? null);

  const handleCompleteBooking = () => {
    // Navigate to Thank You screen
    navigation?.navigate('ThankYouScreen');
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

        <Text style={styles.headerTitle}>Check Out</Text>

        <TouchableOpacity style={styles.profileContainer}>
          <Image source={images.avatar} style={styles.profileImage} />
          <View style={styles.greenDot} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Check In/Check Out Dates */}
        <View style={styles.dateInputsRow}>
          <DateInput
            placeholder="Check In"
            value={checkInDate}
            onPress={() => {}}
            otherStyles={styles.dateInputHalf}
          />
          <DateInput
            placeholder="Check Out"
            value={checkOutDate}
            onPress={() => {}}
            otherStyles={styles.dateInputHalf}
          />
        </View>

        {/* Hotel Card */}
        <View style={styles.hotelCard}>
          <Image
            source={hotelImageSource}
            style={styles.hotelImage}
            resizeMode="cover"
          />
          <View style={styles.hotelInfo}>
            <Text style={styles.hotelName}>{hotel?.name ?? 'Hotel'}</Text>
            <View style={styles.priceLocationRow}>
              <View>
                <Text style={styles.price}>
                  $ {rentPerDay.toLocaleString()}
                  <Text style={styles.perNight}> / night</Text>
                </Text>
                <View style={styles.locationContainer}>
                  <MapPin size={14} color={colors.c_666666} />
                  <Text style={styles.location} numberOfLines={1}>
                    {hotelLocation || '—'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Room Type Section */}
        <View style={styles.roomTypeCard}>
          <Text style={styles.sectionTitle}>Room Type</Text>
          <DropdownSelect
            placeholder="Room Type"
            value={roomType}
            onSelect={value => setRoomType(value)}
            otherStyles={styles.dropdown}
          />

          {/* Number of Rooms, Adults, Children */}
          <Counter
            label="Number Of Rooms"
            value={numberOfRooms}
            onDecrease={() => setNumberOfRooms(Math.max(1, numberOfRooms - 1))}
            onIncrease={() => setNumberOfRooms(Math.min(maxRooms, numberOfRooms + 1))}
            min={1}
            max={maxRooms}
          />
          <Counter
            label="Adult (Age 18+)"
            value={adults}
            onDecrease={() => setAdults(Math.max(1, adults - 1))}
            onIncrease={() => setAdults(Math.min(10, adults + 1))}
            min={1}
            max={10}
          />
          <Counter
            label="Children (0-17)"
            value={children}
            onDecrease={() => setChildren(Math.max(0, children - 1))}
            onIncrease={() => setChildren(Math.min(10, children + 1))}
            min={0}
            max={10}
          />
        </View>

        {/* Price Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitlePriceDetails}>Price Details</Text>
          <PriceDetailsCard
            items={priceItems}
            total={totalAmount}
            onAddMore={() => {}}
          />
        </View>

        {/* Guest Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Guest Details</Text>
          <View style={styles.guestDetailsCard}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Name"
                placeholderTextColor={colors.c_666666}
                value={guestName}
                onChangeText={setGuestName}
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor={colors.c_666666}
                value={guestEmail}
                onChangeText={setGuestEmail}
                keyboardType="email-address"
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor={colors.c_666666}
                value={guestPhone}
                onChangeText={setGuestPhone}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Add More Guest Details Button */}
          <TouchableOpacity
            style={styles.addMoreButton}
            onPress={() => {
              // Handle add more guest details
              console.log('Add more guest details');
            }}
          >
            <View style={styles.addMoreIconContainer}>
              <Plus size={16} color={colors.white} />
            </View>
            <Text style={styles.addMoreText}>Add More Guest Details</Text>
          </TouchableOpacity>
        </View>

        {/* Payment Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Options</Text>
          <View style={styles.paymentOptionsCard}>
            <PaymentOption
              label="Pay Cash Payment on Check-in"
              selected={paymentMethod === 'cash'}
              onSelect={() => setPaymentMethod('cash')}
            />
            <PaymentOption
              label="Pay Through Credit Card"
              selected={paymentMethod === 'card'}
              onSelect={() => setPaymentMethod('card')}
            />
            {paymentMethod === 'card' && (
              <View style={styles.savedCardContainer}>
                <CreditCardDisplay
                  cardNumber="**** 4321"
                  expiryDate="02/27"
                  cardType="VISA"
                />
              </View>
            )}
          </View>
          <View
            style={{
              marginTop: 20,
            }}
          >
            {paymentMethod === 'card' && (
              <CreditCardDisplay
                cardNumber=""
                expiryDate=""
                cardType=""
                onAddNew={() => {
                  console.log('Add new card');
                }}
              />
            )}
          </View>
        </View>

        {/* Manage Your Booking */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Manage Your Booking</Text>
          <Text style={styles.bookingText}>
            Please enter your email address where you would like to receive your
            booking confirmation
          </Text>
          <View style={styles.emailInputContainer}>
            <TextInput
              style={styles.emailInput}
              placeholder="Please enter your email address where you would like to receive your booking confirmation"
              placeholderTextColor={colors.c_666666}
              value={bookingEmail}
              onChangeText={setBookingEmail}
              keyboardType="email-address"
              multiline={true}
            />
          </View>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setSendEmails(!sendEmails)}
          >
            <ToggleBox isChecked={sendEmails} />
            <Text style={styles.checkboxLabel}>
              Send me emails with deals and offers
            </Text>
          </TouchableOpacity>
        </View>

        {/* Complete Booking Button */}
        <View style={styles.buttonContainer}>
          <GradientButtonForAccomodation
            title="Complete Booking"
            onPress={handleCompleteBooking}
            fontSize={16}
            fontFamily={fonts.bold}
            otherStyles={styles.completeButton}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default Checkout;

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
  scrollContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  dateInputsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  dateInputHalf: {
    flex: 1,
    width: 'auto',
  },
  hotelCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  hotelImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  hotelInfo: {
    padding: 16,
  },
  hotelName: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: 12,
  },
  priceLocationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  price: {
    fontSize: 16,
    fontFamily: fonts.normal,
    color: colors.black,
    marginBottom: 6,
  },
  perNight: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  ratingContainer: {
    alignItems: 'flex-end',
    gap: 6,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.black,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
    alignItems: 'center',
  },
  section: {
    marginBottom: 24,
  },
  roomTypeCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.c_F3F3F3,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: 16,
  },
  sectionTitlePriceDetails: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.black,
    // marginBottom: 16,
  },
  dropdown: {
    width: '100%',
    marginBottom: 20,
  },
  guestDetailsCard: {
    backgroundColor: colors.white,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    height: 50,
    borderRadius: 100,
    backgroundColor: colors.white,
    // borderWidth: 0,
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.black,
    borderWidth: 0.2,
  },
  addMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  addMoreIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.c_F47E20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addMoreText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.c_F47E20,
  },
  paymentOptionsCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  savedCardContainer: {
    marginTop: 12,
  },
  bookingText: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    marginBottom: 12,
    lineHeight: 20,
  },
  emailInputContainer: {
    marginBottom: 16,
  },
  emailInput: {
    minHeight: 50,
    borderRadius: 12,
    backgroundColor: colors.c_F3F3F3,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.black,
    textAlignVertical: 'top',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkboxLabel: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.black,
    flex: 1,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 40,
    width: width * 0.9,
  },
  completeButton: {
    backgroundColor: colors.c_0162C0,
    borderRadius: 100,
    height: 50,
  },
});
