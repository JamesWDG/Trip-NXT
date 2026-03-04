import {
  ActivityIndicator,
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { FC, useEffect, useRef, useState } from 'react';
import { NavigationProp, useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ChevronLeft, MapPin } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Circle, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { width } from '../../../config/constants';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import images from '../../../config/images';
import { useLazyGetNearbyVendorsQuery } from '../../../redux/services/cab.service';
import type { OnlineCabVendor } from '../../../redux/services/cab.service';
import {
  useLazyGetRideForUserQuery,
  useAcceptOfferMutation,
  useRejectOfferMutation,
  useCancelRideMutation,
} from '../../../redux/services/ride.service';
import type { RidePayload } from '../../../redux/services/ride.service';
import { formatUsd } from '../../../utils/currency';

const NEARBY_RADIUS_KM = 15;
/** Poll interval (ms) so new drivers coming online show on the map without leaving the screen */
const NEARBY_POLL_INTERVAL_MS = 12 * 1000;

const GOOGLE_PLACES_API_KEY = 'AIzaSyD28UEoebX1hKscL3odt2TiTRVfe5SSpwE';

type FindARiderParams = {
  rideId?: number;
  pickupText?: string;
  dropoffText?: string;
  distance?: string;
  duration?: string;
  pickupCoords?: { latitude: number; longitude: number };
  dropoffCoords?: { latitude: number; longitude: number };
};

const DEFAULT_REGION = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const FindARider: FC = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { top: safeTop, bottom: safeBottom } = useSafeAreaInsets();
  const route = useRoute<RouteProp<{ params: FindARiderParams }, 'params'>>();
  const params = route.params ?? {};
  const {
    rideId,
    pickupText = 'Pickup',
    dropoffText = 'Drop-off',
    distance,
    duration,
    pickupCoords,
    dropoffCoords,
  } = params;

  const [getRide, { data: rideData }] = useLazyGetRideForUserQuery();
  const [acceptOffer, { isLoading: accepting }] = useAcceptOfferMutation();
  const [rejectOffer] = useRejectOfferMutation();
  const [cancelRide, { isLoading: cancelling }] = useCancelRideMutation();
  const [ride, setRide] = useState<RidePayload | null>(null);
  const ridePollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const mapRef = useRef<MapView>(null);
  const [getNearbyVendors, { data: vendorsResponse, isLoading: loadingVendors, isError: vendorsError }] = useLazyGetNearbyVendorsQuery();
  const [availableVendors, setAvailableVendors] = useState<OnlineCabVendor[]>([]);
  const pulse1 = useRef(new Animated.Value(0)).current;
  const pulse2 = useRef(new Animated.Value(0)).current;
  const pulse3 = useRef(new Animated.Value(0)).current;
  const pulseV = useRef({ v1: 0, v2: 0, v3: 0 });
  const [mapPulse, setMapPulse] = useState({ r1: 80, r2: 80, r3: 80, o1: 0.4, o2: 0.4, o3: 0.4 });


  const updateMapPulse = useRef(() => {
    const { v1, v2, v3 } = pulseV.current;
    setMapPulse({
      r1: 60 + 180 * v1,
      r2: 60 + 180 * v2,
      r3: 60 + 180 * v3,
      o1: 0.35 * (1 - v1),
      o2: 0.35 * (1 - v2),
      o3: 0.35 * (1 - v3),
    });
  }).current;

  useEffect(() => {
    const id1 = pulse1.addListener((payload: { value?: number } | number) => {
      pulseV.current.v1 = typeof payload === 'number' ? payload : (payload?.value ?? 0);
      updateMapPulse();
    });
    const id2 = pulse2.addListener((payload: { value?: number } | number) => {
      pulseV.current.v2 = typeof payload === 'number' ? payload : (payload?.value ?? 0);
      updateMapPulse();
    });
    const id3 = pulse3.addListener((payload: { value?: number } | number) => {
      pulseV.current.v3 = typeof payload === 'number' ? payload : (payload?.value ?? 0);
      updateMapPulse();
    });
    return () => {
      pulse1.removeListener(id1);
      pulse2.removeListener(id2);
      pulse3.removeListener(id3);
    };
  }, [pulse1, pulse2, pulse3]);

  // Initial fetch, refetch on pickup change, and realtime polling (new drivers show without leaving screen)
  useEffect(() => {
    if (!pickupCoords) return;
    const fetch = () => {
      getNearbyVendors({
        latitude: pickupCoords.latitude,
        longitude: pickupCoords.longitude,
        radiusKm: NEARBY_RADIUS_KM,
      });
    };
    fetch();
    const intervalId = setInterval(fetch, NEARBY_POLL_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [pickupCoords?.latitude, pickupCoords?.longitude, getNearbyVendors]);

  // Refetch when screen comes back to focus (e.g. from background or another screen)
  useEffect(() => {
    const unsub = navigation.addListener('focus', () => {
      if (pickupCoords) {
        getNearbyVendors({
          latitude: pickupCoords.latitude,
          longitude: pickupCoords.longitude,
          radiusKm: NEARBY_RADIUS_KM,
        });
      }
    });
    return unsub;
  }, [navigation, pickupCoords, getNearbyVendors]);

  useEffect(() => {
    const list = Array.isArray(vendorsResponse)
      ? vendorsResponse
      : Array.isArray((vendorsResponse as any)?.data)
        ? (vendorsResponse as any).data
        : [];
    setAvailableVendors(list);
  }, [vendorsResponse]);

  // Poll ride when rideId is present (searching / counter_offered / accepted)
  useEffect(() => {
    if (!rideId) return;
    const fetchRide = () => getRide(rideId);
    fetchRide();
    ridePollRef.current = setInterval(fetchRide, 4000);
    return () => {
      if (ridePollRef.current) clearInterval(ridePollRef.current);
    };
  }, [rideId, getRide]);
  useEffect(() => {
    if (rideData && typeof rideData === 'object' && 'id' in rideData) setRide(rideData as RidePayload);
  }, [rideData]);

  useEffect(() => {
    const coords: { latitude: number; longitude: number }[] = [];
    if (pickupCoords) coords.push(pickupCoords);
    if (dropoffCoords) coords.push(dropoffCoords);
    availableVendors.forEach((v) => coords.push({ latitude: v.latitude, longitude: v.longitude }));
    if (coords.length > 0 && mapRef.current) {
      mapRef.current.fitToCoordinates(coords, {
        edgePadding: { top: 120, right: 40, bottom: 280, left: 40 },
        animated: true,
      });
    }
  }, [pickupCoords, dropoffCoords, availableVendors]);

  useEffect(() => {
    const animate = (anim: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
            easing: Easing.out(Easing.ease),
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: true,
            easing: Easing.in(Easing.ease),
          }),
        ]),
      );
    };
    const a1 = animate(pulse1, 0);
    const a2 = animate(pulse2, 400);
    const a3 = animate(pulse3, 800);
    a1.start();
    a2.start();
    a3.start();
    return () => {
      a1.stop();
      a2.stop();
      a3.stop();
    };
  }, [pulse1, pulse2, pulse3]);

  const handleCancel = () => {
    if (rideId) {
      cancelRide({ rideId }).then(() => navigation.goBack()).catch(() => {});
    } else {
      navigation.goBack();
    }
  };

  const pendingOffers = ride?.offers?.filter((o) => o.status === 'pending') ?? [];
  const latestOffer = pendingOffers[pendingOffers.length - 1];

  const hasCoords = pickupCoords && dropoffCoords;
  const initialRegion = pickupCoords
    ? {
        ...pickupCoords,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }
    : DEFAULT_REGION;

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={false}
      >
        {pickupCoords && (
          <>
            <Circle
              center={pickupCoords}
              radius={mapPulse.r1}
              fillColor={`rgba(1, 98, 192, ${mapPulse.o1})`}
              strokeColor="transparent"
            />
            <Circle
              center={pickupCoords}
              radius={mapPulse.r2}
              fillColor={`rgba(1, 98, 192, ${mapPulse.o2})`}
              strokeColor="transparent"
            />
            <Circle
              center={pickupCoords}
              radius={mapPulse.r3}
              fillColor={`rgba(1, 98, 192, ${mapPulse.o3})`}
              strokeColor="transparent"
            />
            <Marker
              coordinate={pickupCoords}
              title="Pickup"
              description={pickupText}
              pinColor={colors.green}
            />
          </>
        )}
        {dropoffCoords && (
          <Marker
            coordinate={dropoffCoords}
            title="Drop-off"
            description={dropoffText}
            pinColor={colors.c_EE4026}
          />
        )}
        {availableVendors.map((v) => (
          <Marker
            key={`vendor-${v.id}-${v.cabId}`}
            coordinate={{ latitude: v.latitude, longitude: v.longitude }}
            title={v.cab?.vehicleModal ?? 'Driver'}
            description={v.cab?.vehicleType ?? ''}
            image={images.car_map}
          />
        ))}
        {hasCoords && (
          <MapViewDirections
            origin={pickupCoords}
            destination={dropoffCoords}
            apikey={GOOGLE_PLACES_API_KEY}
            precision="low"
            strokeWidth={4}
            strokeColor={colors.c_0162C0}
          />
        )}
      </MapView>

      <View style={[styles.overlay, { paddingTop: safeTop + 8 }]} pointerEvents="box-none">
        <View style={styles.topSection}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <ChevronLeft color={colors.white} size={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Find a ride</Text>
            <View style={styles.backBtn} />
          </View>

          <View style={styles.tripCard}>
            <View style={styles.tripRow}>
              <View style={styles.pinWrap}>
                <MapPin size={16} color={colors.green} />
              </View>
              <Text style={styles.tripLabel} numberOfLines={2}>
                {pickupText}
              </Text>
            </View>
            <View style={styles.tripLine} />
            <View style={styles.tripRow}>
              <View style={[styles.pinWrap, styles.pinWrapRed]}>
                <MapPin size={16} color={colors.c_EE4026} />
              </View>
              <Text style={styles.tripLabel} numberOfLines={2}>
                {dropoffText}
              </Text>
            </View>
            {(distance || duration) && (
              <View style={styles.tripMeta}>
                {distance ? <Text style={styles.tripMetaText}>{distance}</Text> : null}
                {distance && duration ? (
                  <Text style={styles.tripMetaDot}> • </Text>
                ) : null}
                {duration ? <Text style={styles.tripMetaText}>{duration}</Text> : null}
              </View>
            )}
          </View>

          {loadingVendors ? (
            <View style={styles.loadingVendorsRow}>
              <ActivityIndicator size="small" color={colors.white} />
              <Text style={styles.subtitle}>Loading available drivers...</Text>
            </View>
          ) : vendorsError ? (
            <>
              <Text style={styles.title}>Couldn&apos;t load drivers</Text>
              <Text style={styles.subtitle}>Check your connection and try again.</Text>
              <TouchableOpacity
                style={styles.retryBtn}
                onPress={() => pickupCoords && getNearbyVendors({ latitude: pickupCoords.latitude, longitude: pickupCoords.longitude, radiusKm: NEARBY_RADIUS_KM })}
                activeOpacity={0.8}
              >
                <Text style={styles.retryBtnText}>Retry</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.title}>
                {availableVendors.length > 0
                  ? `${availableVendors.length} driver${availableVendors.length === 1 ? '' : 's'} available`
                  : 'Finding your ride...'}
              </Text>
              <Text style={styles.subtitle}>
                {availableVendors.length > 0
                  ? 'Available drivers shown on the map (orange pins).'
                  : 'No drivers nearby. Open the Trip-NXt Vendor app → My Vehicle → Mark as online (within ' + NEARBY_RADIUS_KM + ' km of pickup).'}
              </Text>
              {availableVendors.length === 0 && (
                <TouchableOpacity
                  style={styles.retryBtn}
                  onPress={() => pickupCoords && getNearbyVendors({ latitude: pickupCoords.latitude, longitude: pickupCoords.longitude, radiusKm: NEARBY_RADIUS_KM })}
                  activeOpacity={0.8}
                >
                  <Text style={styles.retryBtnText}>Refresh</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>

        {ride?.status === 'counter_offered' && latestOffer && (
          <View style={styles.counterOfferCard}>
            <Text style={styles.counterOfferTitle}>Counter offer</Text>
            <Text style={styles.counterOfferVendor}>
              {latestOffer.vendor?.user?.name ?? 'Driver'} proposed {formatUsd(latestOffer.proposedFare)}
            </Text>
            <View style={styles.counterOfferActions}>
              <TouchableOpacity
                style={styles.rejectOfferBtn}
                onPress={() => rejectOffer({ rideId: ride.id, offerId: latestOffer.id })}
                activeOpacity={0.8}
              >
                <Text style={styles.rejectOfferBtnText}>Reject</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.acceptOfferBtn}
                onPress={() => acceptOffer({ rideId: ride.id, offerId: latestOffer.id })}
                disabled={accepting}
                activeOpacity={0.8}
              >
                <Text style={styles.acceptOfferBtnText}>{accepting ? 'Accepting...' : 'Accept'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {ride?.status === 'accepted' && (
          <View style={styles.acceptedBanner}>
            <Text style={styles.acceptedBannerText}>Ride accepted! Driver is on the way.</Text>
          </View>
        )}
        {ride?.status === 'ongoing' && (
          <View style={[styles.acceptedBanner, { backgroundColor: colors.c_0162C0 }]}>
            <Text style={styles.acceptedBannerText}>Ride in progress. Sit back and relax.</Text>
          </View>
        )}
        {ride?.status === 'completed' && (
          <View style={[styles.acceptedBanner, { backgroundColor: colors.green }]}>
            <Text style={styles.acceptedBannerText}>Ride completed. Thank you!</Text>
          </View>
        )}

        <View style={[styles.footer, { paddingBottom: safeBottom + 16 }]}>
          {ride?.status === 'completed' ? (
            <TouchableOpacity
              style={[styles.cancelBtn, { backgroundColor: colors.green }]}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelBtnText}>Done</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={handleCancel}
              disabled={cancelling}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelBtnText}>{cancelling ? 'Cancelling...' : 'Cancel'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default FindARider;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    width,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  topSection: {
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.c_0162C0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.white,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  tripCard: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.c_DDDDDD,
    marginBottom: 12,
  },
  tripRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pinWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 255, 0, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  pinWrapRed: {
    backgroundColor: 'rgba(238, 64, 38, 0.15)',
  },
  tripLabel: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.black,
  },
  title: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.white,
    marginBottom: 4,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: fonts.normal,
    color: colors.white,
    textAlign: 'center',
    lineHeight: 18,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  tripLine: {
    width: 2,
    height: 20,
    backgroundColor: colors.c_DDDDDD,
    marginLeft: 15,
    marginVertical: 4,
  },
  tripMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.c_F3F3F3,
  },
  tripMetaText: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.c_666666,
  },
  tripMetaDot: {
    fontSize: 13,
    color: colors.c_666666,
  },
  footer: {
    paddingHorizontal: 20,
  },
  cancelBtn: {
    backgroundColor: colors.white,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.c_0162C0,
  },
  cancelBtnText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.c_0162C0,
  },
  loadingVendorsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  retryBtn: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.white,
    borderRadius: 10,
    alignSelf: 'center',
  },
  retryBtnText: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.c_0162C0,
  },
  counterOfferCard: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.c_DDDDDD,
  },
  counterOfferTitle: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: 4,
  },
  counterOfferVendor: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    marginBottom: 12,
  },
  counterOfferActions: {
    flexDirection: 'row',
    gap: 12,
  },
  rejectOfferBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: colors.c_F3F3F3,
    alignItems: 'center',
  },
  rejectOfferBtnText: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: colors.c_666666,
  },
  acceptOfferBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: colors.c_0162C0,
    alignItems: 'center',
  },
  acceptOfferBtnText: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  acceptedBanner: {
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 200, 0, 0.2)',
    alignItems: 'center',
  },
  acceptedBannerText: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.black,
  },
});
