import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { NavigationProp } from '@react-navigation/native';
import { ChevronLeft, MapPin } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Geolocation from '@react-native-community/geolocation';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { width } from '../../../config/constants';
import BottomSheetComponent, { BottomSheetComponentRef } from '../../../components/bottomSheetComp/BottomSheetComp';

const GOOGLE_PLACES_API_KEY = 'AIzaSyD28UEoebX1hKscL3odt2TiTRVfe5SSpwE';
type PlaceSuggestion = { id: string; description: string; mainText: string };

const DEFAULT_REGION = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

type ActiveField = 'pickup' | 'dropoff' | null;

const BookARide: FC<{ navigation: NavigationProp<any> }> = ({ navigation }) => {
  const { top: safeTop, bottom: safeBottom } = useSafeAreaInsets();
  const [pickupText, setPickupText] = useState('');
  const [pickupCoords, setPickupCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [dropoffText, setDropoffText] = useState('');
  const [dropoffCoords, setDropoffCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeField, setActiveField] = useState<ActiveField>(null);
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mapRef = useRef<MapView>(null);
  const routeSheetRef = useRef<BottomSheetComponentRef>(null);

  const fetchSuggestions = useCallback(async (query: string): Promise<PlaceSuggestion[]> => {
    if (!query || query.length < 2) return [];
    try {
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        query,
      )}&key=${GOOGLE_PLACES_API_KEY}&language=en`;
      const res = await fetch(url);
      const data = await res.json();
     
     
      if (data.status === 'OK' && Array.isArray(data.predictions)) {
        return data.predictions.map((p: any, i: number) => ({
          id: p.place_id || `place-${i}`,
          description: p.description || '',
          mainText: p.structured_formatting?.main_text || p.description?.split(',')[0]?.trim() || '',
        }));
      }
      return [];
    } catch {
      return [];
    }
  }, []);

  const handleChange = useCallback(
    (field: ActiveField, text: string) => {
      if (field === 'pickup') {
        setPickupText(text);
      } else {
        setDropoffText(text);
      }
      setActiveField(field);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (text.length < 2) {
        setSuggestions([]);
        setShowDropdown(false);
        return;
      }
      setShowDropdown(true);
      debounceRef.current = setTimeout(async () => {
        debounceRef.current = null;
        setLoading(true);
        const list = await fetchSuggestions(text);
        setSuggestions(list);
        setLoading(false);
      }, 400);
    },
    [fetchSuggestions],
  );

  const fetchPlaceDetails = useCallback(async (placeId: string): Promise<{ latitude: number; longitude: number } | null> => {
    try {
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(
        placeId,
      )}&key=${GOOGLE_PLACES_API_KEY}&fields=geometry`;
      const res = await fetch(url);
      const data = await res.json();
      const loc = data?.result?.geometry?.location;
      if (loc && typeof loc.lat === 'number' && typeof loc.lng === 'number') {
        return { latitude: loc.lat, longitude: loc.lng };
      }
      return null;
    } catch {
      return null;
    }
  }, []);

  const reverseGeocode = useCallback(async (lat: number, lng: number): Promise<string> => {
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_PLACES_API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      const addr = data?.results?.[0]?.formatted_address;
      return typeof addr === 'string' ? addr : 'Dropped pin';
    } catch {
      return 'Dropped pin';
    }
  }, []);

  const getCurrentPosition = useCallback((): Promise<{ latitude: number; longitude: number } | null> => {
    return new Promise((resolve) => {
      Geolocation.getCurrentPosition(
        (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
      );
    });
  }, []);

  const handleSelect = useCallback(
    async (item: PlaceSuggestion) => {
      const desc = item.description;
      if (activeField === 'pickup') {
        setPickupText(desc);
        setPickupCoords(null);
      } else {
        setDropoffText(desc);
        setDropoffCoords(null);
      }
      setSuggestions([]);
      setShowDropdown(false);
      const coords = await fetchPlaceDetails(item.id);
      if (!coords) return;
      if (activeField === 'pickup') {
        setPickupCoords(coords);
      } else {
        setDropoffCoords(coords);
      }
      setRouteInfo(null);
      const origin = activeField === 'pickup' ? coords : pickupCoords;
      const dest = activeField === 'dropoff' ? coords : dropoffCoords;
      if (!origin || !dest) {
        if (mapRef.current) {
          mapRef.current.animateToRegion({ ...coords, latitudeDelta: 0.0122, longitudeDelta: 0.0121 }, 400);
        }
      }
    },
    [activeField, pickupCoords, dropoffCoords, fetchPlaceDetails],
  );

  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

  useEffect(() => {
    let cancelled = false;
    getCurrentPosition().then(async (pos) => {
      if (cancelled || !pos) return;
      setPickupCoords(pos);
      setPickupText('Current location');
      const address = await reverseGeocode(pos.latitude, pos.longitude);
      if (!cancelled) setPickupText(address || 'Current location');
      if (!cancelled && mapRef.current) {
        mapRef.current.animateToRegion({
          ...pos,
          latitudeDelta: 0.0122,
          longitudeDelta: 0.0121,
        }, 400);
      }
    });
    return () => { cancelled = true; };
  }, [getCurrentPosition, reverseGeocode]);

  useEffect(() => {
    if (loadingRoute || routeInfo) {
      routeSheetRef.current?.open();
    } else {
      routeSheetRef.current?.close();
    }
  }, [loadingRoute, routeInfo]);

  const handlePickupMarkerDragEnd = useCallback(
    async (e: { nativeEvent: { coordinate: { latitude: number; longitude: number } } }) => {
      const { latitude, longitude } = e.nativeEvent.coordinate;
      setPickupCoords({ latitude, longitude });
      const addr = await reverseGeocode(latitude, longitude);
      setPickupText(addr);
      if (dropoffCoords) {
        setRouteInfo(null);
      }
    },
    [dropoffCoords, reverseGeocode],
  );

  const handleDropoffMarkerDragEnd = useCallback(
    async (e: { nativeEvent: { coordinate: { latitude: number; longitude: number } } }) => {
      const { latitude, longitude } = e.nativeEvent.coordinate;
      setDropoffCoords({ latitude, longitude });
      const addr = await reverseGeocode(latitude, longitude);
      setDropoffText(addr);
      if (pickupCoords) {
        setRouteInfo(null);
      }
    },
    [pickupCoords, reverseGeocode],
  );

  const formatRouteInfo = useCallback((distanceKm: number, durationMin: number) => {
    const distanceStr =
      distanceKm >= 1 ? `${distanceKm.toFixed(1)} km` : `${Math.round(distanceKm * 1000)} m`;
    const durationStr =
      durationMin >= 60
        ? `${Math.floor(durationMin / 60)} hr ${Math.round(durationMin % 60)} min`
        : `${Math.round(durationMin)} min`;
    return { distance: distanceStr, duration: durationStr };
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.backButton, { top: safeTop + 12 }]}
        onPress={() => navigation?.goBack()}
        activeOpacity={0.8}
      >
        <ChevronLeft color={colors.white} size={24} />
      </TouchableOpacity>
      <View style={[styles.inputsContainer, { top: safeTop + 56 }]}>
        <View style={styles.inputWrap}>
          <MapPin size={18} color={colors.green} />
          <TextInput
            style={styles.input}
            placeholder="Pickup location"
            placeholderTextColor={colors.c_666666}
            value={pickupText}
            onChangeText={(t) => handleChange('pickup', t)}
            onFocus={() => setActiveField('pickup')}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          />
        </View>
        <View style={[styles.inputWrap, styles.inputWrapSecond]}>
          <MapPin size={18} color={colors.c_EE4026} />
          <TextInput
            style={styles.input}
            placeholder="Drop-off location"
            placeholderTextColor={colors.c_666666}
            value={dropoffText}
            onChangeText={(t) => handleChange('dropoff', t)}
            onFocus={() => setActiveField('dropoff')}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          />
        </View>
        {loading && activeField && (
          <View style={styles.loader}>
            <ActivityIndicator size="small" color={colors.c_0162C0} />
          </View>
        )}
        {showDropdown && suggestions.length > 0 && (
          <View style={styles.dropdown}>
            {suggestions.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.dropdownItem}
                onPress={() => handleSelect(item)}
                activeOpacity={0.7}
              >
                <Text style={styles.dropdownText} numberOfLines={2}>{item.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={DEFAULT_REGION}
        showsUserLocation={false}
        zoomEnabled
      >
        {pickupCoords && (
          <Marker
            coordinate={pickupCoords}
            title="Pickup"
            description={pickupText || 'Pickup location'}
            pinColor={colors.green}
            draggable
            onDragEnd={handlePickupMarkerDragEnd}
          />
        )}
        {dropoffCoords && (
          <Marker
            coordinate={dropoffCoords}
            title="Drop-off"
            description={dropoffText || 'Drop-off location'}
            pinColor={colors.c_EE4026}
            draggable
            onDragEnd={handleDropoffMarkerDragEnd}
          />
        )}
        {pickupCoords && dropoffCoords && (
          <MapViewDirections
            origin={pickupCoords}
            destination={dropoffCoords}
            apikey={GOOGLE_PLACES_API_KEY}
            precision="low"
            strokeWidth={5}
            strokeColor={colors.c_0162C0}
            onStart={() => setLoadingRoute(true)}
            onReady={(result) => {
              setLoadingRoute(false);
              setRouteInfo(formatRouteInfo(result.distance, result.duration));
              mapRef.current?.fitToCoordinates(result.coordinates, {
                edgePadding: { top: 80, right: 40, bottom: 80, left: 40 },
                animated: true,
              });
            }}
            onError={() => {
              setLoadingRoute(false);
              setRouteInfo(null);
            }}
          />
        )}
      </MapView>
      <BottomSheetComponent
        ref={routeSheetRef}
        snapPoints={['35%']}
        enableDynamicSizing={false}
        showBackdrop={true}
      >
        <View style={[styles.routeSheetContent, { paddingBottom: 24 + safeBottom }]}>
          {loadingRoute && (
            <View style={styles.routeLoadingRow}>
              <ActivityIndicator size="small" color={colors.c_0162C0} />
              <Text style={styles.routeLoadingText}>Getting route...</Text>
            </View>
          )}
          {routeInfo && !loadingRoute && (
            <>
              <Text style={styles.routeSheetTitle}>Route details</Text>
              <View style={styles.routeInfoRow}>
                <View style={styles.routeInfoBlock}>
                  <Text style={styles.routeInfoLabel}>Distance</Text>
                  <Text style={styles.routeInfoValue}>{routeInfo.distance}</Text>
                </View>
                <View style={styles.routeInfoBlock}>
                  <Text style={styles.routeInfoLabel}>Duration</Text>
                  <Text style={styles.routeInfoValue}>{routeInfo.duration}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.findRideButton}
                onPress={() => {}}
                activeOpacity={0.8}
              >
                <Text style={styles.findRideButtonText}>Find Ride</Text>
              </TouchableOpacity>
            </>
          )}
          {!loadingRoute && !routeInfo && (
            <View style={styles.routeLoadingRow}>
              <Text style={styles.routeLoadingText}>Route not available</Text>
            </View>
          )}
        </View>
      </BottomSheetComponent>
    </View>
  );
};

export default BookARide;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    zIndex: 11,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.c_0162C0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputsContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 10,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 12,
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.c_DDDDDD,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  inputWrapSecond: {
    marginTop: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.black,
    paddingVertical: 0,
    paddingLeft: 8,
    paddingRight: 36,
  },
  loader: {
    position: 'absolute',
    right: 12,
    top: 58,
    justifyContent: 'center',
  },
  dropdown: {
    position: 'absolute',
    top: 106,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderRadius: 12,
    maxHeight: 220,
    borderWidth: 1,
    borderColor: colors.c_DDDDDD,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.c_F3F3F3,
  },
  dropdownText: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.black,
  },
  map: {
    flex: 1,
    width,
  },
  routeSheetContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    minHeight: 100,
  },
  routeLoadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
  },
  routeLoadingText: {
    fontSize: 15,
    fontFamily: fonts.medium,
    color: colors.black,
  },
  routeSheetTitle: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: 16,
  },
  routeInfoRow: {
    flexDirection: 'row',
    gap: 24,
  },
  routeInfoBlock: {
    flex: 1,
  },
  routeInfoLabel: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    marginBottom: 4,
  },
  routeInfoValue: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  findRideButton: {
    marginTop: 20,
    backgroundColor: colors.c_0162C0,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  findRideButtonText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.white,
  },
});
