import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useMemo, useState } from 'react';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import images from '../../../config/images';
import { ShowToast } from '../../../config/constants';
import {
  useGetSingleHotelBookingQuery,
  useUpdateHotelBookingStatusMutation,
} from '../../../redux/services/hotel.service';
import StatusSuccessPopup from '../../../components/statusSuccessPopup/StatusSuccessPopup';

const CANCELLATION_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

export type HotelBookingDetailType = {
  id: number;
  hotelId: number;
  userId: number;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  numberOfGuests: number;
  numberOfRooms: number;
  guestInfo?: { name?: string; email?: string; phoneNumber?: string };
  hotel?: {
    id: number;
    name: string;
    images?: string[];
    rentPerDay?: number;
    location?: { city?: string; state?: string; country?: string };
    description?: string;
  };
};

const HotelBookingDetail = ({
  navigation,
  route,
}: {
  navigation?: any;
  route?: any;
}) => {
  const bookingId = route?.params?.bookingId as number | undefined;
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successPopupStatus, setSuccessPopupStatus] = useState('');

  const { data: bookingData, isLoading, isError, refetch } = useGetSingleHotelBookingQuery(
    bookingId ?? 0,
    { skip: !bookingId }
  );
  const [updateStatus, { isLoading: isUpdating }] = useUpdateHotelBookingStatusMutation();

  const booking = useMemo(() => {
    const raw = bookingData?.data ?? bookingData;
    return raw as HotelBookingDetailType | undefined;
  }, [bookingData]);

  const canCancel = useMemo(() => {
    if (!booking) return false;
    const status = (booking.status || '').toLowerCase();
    if (status !== 'pending' && status !== 'processing' && status !== 'confirmed') return false;
    const createdAt = booking.createdAt ? new Date(booking.createdAt).getTime() : 0;
    return Date.now() - createdAt <= CANCELLATION_WINDOW_MS;
  }, [booking]);

  const handleCancel = useCallback(async () => {
    if (!bookingId || !canCancel) return;
    try {
      await updateStatus({ id: bookingId, status: 'cancelled' }).unwrap();
      await refetch();
      setSuccessPopupStatus('Cancelled');
      setShowSuccessPopup(true);
    } catch (e: any) {
      ShowToast('error', e?.data?.message ?? 'Failed to cancel booking');
    }
  }, [bookingId, canCancel, updateStatus, refetch]);

  if (!bookingId) {
    return (
      <WrapperContainer title="Booking Detail" onBackPress={() => navigation?.goBack()}>
        <View style={styles.centered}>
          <Text style={styles.emptyText}>Invalid booking</Text>
        </View>
      </WrapperContainer>
    );
  }

  if (isLoading) {
    return (
      <WrapperContainer title="Booking Detail" onBackPress={() => navigation?.goBack()}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.c_0162C0} />
        </View>
      </WrapperContainer>
    );
  }

  if (isError || !booking) {
    return (
      <WrapperContainer title="Booking Detail" onBackPress={() => navigation?.goBack()}>
        <View style={styles.centered}>
          <Text style={styles.emptyText}>Booking not found</Text>
        </View>
      </WrapperContainer>
    );
  }

  const hotel = booking.hotel ?? {};
  const checkIn = booking.checkInDate
    ? new Date(booking.checkInDate).toLocaleDateString(undefined, { dateStyle: 'medium' })
    : '—';
  const checkOut = booking.checkOutDate
    ? new Date(booking.checkOutDate).toLocaleDateString(undefined, { dateStyle: 'medium' })
    : '—';
  const locationStr = hotel.location
    ? [hotel.location.city, hotel.location.state, hotel.location.country]
        .filter(Boolean)
        .join(', ')
    : '—';
  const imageSrc = hotel.images?.[0] ? { uri: hotel.images[0] } : (images.placeholder as any);


  return (
    <WrapperContainer title="Booking Details" onBackPress={() => navigation?.goBack()}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Image source={imageSrc} style={styles.hotelImage} resizeMode="cover" />
          <View style={styles.cardBody}>
            <Text style={styles.hotelName}>{hotel.name ?? 'Hotel'}</Text>
            <View style={styles.statusRow}>
              <Text style={styles.label}>Status </Text>
              <Text
                style={[
                  styles.statusBadge,
                  (booking.status || '').toLowerCase() === 'cancelled' && styles.statusCancelled,
                ]}
              >
                {(booking.status || '').toLowerCase()}
              </Text>
            </View>
            <Text style={styles.location}>{locationStr || '—'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dates</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Check-in</Text>
            <Text style={styles.rowValue}>{checkIn}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Check-out</Text>
            <Text style={styles.rowValue}>{checkOut}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Guests</Text>
            <Text style={styles.rowValue}>{booking.numberOfGuests ?? '—'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Rooms</Text>
            <Text style={styles.rowValue}>{booking.numberOfRooms ?? '—'}</Text>
          </View>
          <View style={[styles.row, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${Number(booking.totalAmount).toFixed(2)}</Text>
          </View>
        </View>

        {booking.guestInfo && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Guest</Text>
            <Text style={styles.guestText}>{booking.guestInfo.name ?? '—'}</Text>
            <Text style={styles.guestSub}>{booking.guestInfo.email ?? ''}</Text>
            <Text style={styles.guestSub}>{booking.guestInfo.phoneNumber ?? ''}</Text>
          </View>
        )}

        {canCancel && (
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
              disabled={isUpdating}
              activeOpacity={0.8}
            >
              {isUpdating ? (
                <View style={styles.cancelButtonContent}>
                  <ActivityIndicator size="small" color={colors.white} />
                  <Text style={styles.cancelButtonText}>Cancelling...</Text>
                </View>
              ) : (
                <Text style={styles.cancelButtonText}>Cancel</Text>
              )}
            </TouchableOpacity>
            <Text style={styles.cancelHint}>
              You can cancel within 24 hours of booking.
            </Text>
          </View>
        )}
      </ScrollView>

      <StatusSuccessPopup
        visible={showSuccessPopup}
        statusLabel={successPopupStatus}
        onDismiss={() => setShowSuccessPopup(false)}
        autoCloseMs={2500}
      />
    </WrapperContainer>
  );
};

export default HotelBookingDetail;

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 40, paddingBottom: 40 },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.c_666666,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  hotelImage: {
    width: '100%',
    height: 180,
    backgroundColor: colors.c_F3F3F3,
  },
  cardBody: { padding: 16 },
  hotelName: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.black,
    marginBottom: 8,
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  label: { fontFamily: fonts.normal, fontSize: 14, color: colors.c_666666 },
  statusBadge: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    textTransform: 'capitalize',
    color: colors.c_0162C0,
    marginLeft: 6,
  },
  statusCancelled: { color: colors.red },
  location: {
    fontFamily: fonts.normal,
    fontSize: 14,
    color: colors.c_666666,
    marginTop: 4,
  },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    color: colors.black,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  rowLabel: { fontFamily: fonts.normal, fontSize: 14, color: colors.c_666666 },
  rowValue: { fontFamily: fonts.medium, fontSize: 14, color: colors.black },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.c_DDDDDD,
    marginTop: 8,
    paddingTop: 12,
  },
  totalLabel: { fontFamily: fonts.bold, fontSize: 16, color: colors.black },
  totalValue: { fontFamily: fonts.bold, fontSize: 18, color: colors.c_0162C0 },
  guestText: { fontFamily: fonts.medium, fontSize: 15, color: colors.black },
  guestSub: { fontFamily: fonts.normal, fontSize: 13, color: colors.c_666666, marginTop: 2 },
  cancelButton: {
    backgroundColor: colors.red ?? '#dc2626',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonContent: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cancelButtonText: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    color: colors.white,
  },
  cancelHint: {
    fontFamily: fonts.normal,
    fontSize: 12,
    color: colors.c_666666,
    marginTop: 8,
    textAlign: 'center',
  },
});
