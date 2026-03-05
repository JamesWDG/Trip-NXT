import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import { useNavigation } from '@react-navigation/native';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import AccomodationTabButtons from '../../../components/accomodationTabButtons/AccomodationTabButtons';
import { useGetMyRideHistoryQuery } from '../../../redux/services/ride.service';
import { formatPkr } from '../../../utils/currency';
import type { RidePayload } from '../../../redux/services/ride.service';

interface BookingItem {
  id: string;
  bookingId: string;
  fromAddress: string;
  fromDestination: string;
  toAddress: string;
  toDestination: string;
  date: string;
  time: string;
}

const bookings: BookingItem[] = [
  {
    id: '1',
    bookingId: '5431443675434214',
    fromAddress: 'Kamieńskiego 11, Cracow',
    fromDestination: 'Bonarka City Center',
    toAddress: 'Kobierzyńska Street, Cracow',
    toDestination: 'My Home',
    date: 'Today',
    time: '5:15 pm',
  },
  {
    id: '2',
    bookingId: '5431443675434215',
    fromAddress: 'Puszkarska 7H, Cracow',
    fromDestination: 'Bonarka for Business',
    toAddress: 'Main Street, Cracow',
    toDestination: 'Office',
    date: 'Today',
    time: '3:30 pm',
  },
];

function formatRideDate(iso: string): { date: string; time: string } {
  try {
    const d = new Date(iso);
    const now = new Date();
    const isToday = d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    const date = isToday ? 'Today' : d.toLocaleDateString();
    const time = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    return { date, time };
  } catch {
    return { date: '', time: '' };
  }
}

const BookingCard = ({ item }: { item: BookingItem }) => {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7}>
      <View style={styles.locationSection}>
        <View style={styles.dotLineContainer}>
          <View style={styles.dot} />
          <View style={styles.dashedLine} />
        </View>
        <View style={styles.locationContent}>
          <Text style={styles.locationAddress}>From - {item.fromAddress}</Text>
          <Text style={styles.locationDestination}>{item.fromDestination}</Text>
        </View>
      </View>
      <View style={styles.locationSection}>
        <View style={styles.dotLineContainer}>
          <View style={styles.dot} />
        </View>
        <View style={styles.locationContent}>
          <Text style={styles.locationAddress}>To - {item.toAddress}</Text>
          <Text style={styles.locationDestination}>{item.toDestination}</Text>
        </View>
      </View>
      <View style={styles.separator} />
      <View style={styles.footer}>
        <Text style={styles.bookingId}>ID: {item.bookingId}</Text>
        <Text style={styles.dateTime}>
          {item.date}: {item.time}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const RideHistoryCard = ({ item }: { item: RidePayload }) => {
  const { date, time } = formatRideDate(item.createdAt);
  const fare = item.negotiatedFare ?? item.offeredFare;
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7}>
      <View style={styles.locationSection}>
        <View style={styles.dotLineContainer}>
          <View style={styles.dot} />
          <View style={styles.dashedLine} />
        </View>
        <View style={styles.locationContent}>
          <Text style={styles.locationAddress}>From - {item.pickup?.address ?? 'Pickup'}</Text>
          <Text style={styles.locationDestination}>{item.pickup?.address ?? 'Pickup'}</Text>
        </View>
      </View>
      <View style={styles.locationSection}>
        <View style={styles.dotLineContainer}>
          <View style={styles.dot} />
        </View>
        <View style={styles.locationContent}>
          <Text style={styles.locationAddress}>To - {item.dropoff?.address ?? 'Drop-off'}</Text>
          <Text style={styles.locationDestination}>{item.dropoff?.address ?? 'Drop-off'}</Text>
        </View>
      </View>
      <View style={styles.separator} />
      <View style={styles.footer}>
        <Text style={styles.bookingId}>ID: {item.id}</Text>
        <Text style={styles.dateTime}>{date}: {time} · {formatPkr(fare)}</Text>
      </View>
      <View style={{ marginTop: 4 }}>
        <Text style={[styles.dateTime, { textTransform: 'capitalize', color: colors.c_666666 }]}>{item.status}</Text>
      </View>
    </TouchableOpacity>
  );
};

const MyBookings = () => {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState(0);
  const { data, isLoading, isError } = useGetMyRideHistoryQuery(
    { limit: 30, offset: 0 },
    { skip: activeTab !== 2 }
  );
  const rideList = data?.list ?? [];
  const showRideHistory = activeTab === 2;

  return (
    <WrapperContainer title="My Bookings" navigation={navigation}>
      <View style={styles.mainContainer}>
        <AccomodationTabButtons
          data={['Hotels', 'Foods', 'Ride']}
          activeIndex={activeTab}
          onTabChange={setActiveTab}
        />
      </View>
      {showRideHistory ? (
        isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.c_0162C0} />
            <Text style={styles.loadingText}>Loading ride history...</Text>
          </View>
        ) : isError ? (
          <View style={styles.centered}>
            <Text style={styles.errorText}>Could not load ride history.</Text>
          </View>
        ) : rideList.length === 0 ? (
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No rides yet. Completed rides will appear here.</Text>
          </View>
        ) : (
          <FlatList
            data={rideList}
            renderItem={({ item }) => <RideHistoryCard item={item} />}
            keyExtractor={item => String(item.id)}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )
      ) : (
        <FlatList
          data={bookings}
          renderItem={({ item }) => <BookingCard item={item} />}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </WrapperContainer>
  );
};

export default MyBookings;

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    gap: 16,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  locationSection: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  dotLineContainer: {
    alignItems: 'center',
    marginRight: 12,
    width: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.c_F47E20,
  },
  dashedLine: {
    width: 2,
    flex: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: colors.c_DDDDDD,
    marginTop: 4,
    marginBottom: 4,
  },
  locationContent: {
    flex: 1,
    gap: 4,
  },
  locationAddress: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  locationDestination: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  separator: {
    height: 1,
    backgroundColor: colors.c_DDDDDD,
    marginVertical: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingId: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  dateTime: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.black,
  },
  mainContainer: {
    paddingTop: 30,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    fontFamily: fonts.medium,
    color: colors.c_666666,
    marginTop: 12,
  },
  errorText: {
    fontFamily: fonts.medium,
    color: colors.c_EE4026,
  },
  emptyText: {
    fontFamily: fonts.medium,
    color: colors.c_666666,
    textAlign: 'center',
  },
});
