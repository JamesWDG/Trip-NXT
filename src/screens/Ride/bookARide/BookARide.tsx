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
import MapView, { Marker, Polyline } from 'react-native-maps';
import { width } from '../../../config/constants';
import BottomSheetComponent, { BottomSheetComponentRef } from '../../../components/bottomSheetComp/BottomSheetComp';

const GOOGLE_PLACES_API_KEY = 'AIzaSyD28UEoebX1hKscL3odt2TiTRVfe5SSpwE';
type PlaceSuggestion = { id: string; description: string; mainText: string };

/** Decode Google encoded polyline to [{ latitude, longitude }, ...] */
function decodePolyline(encoded: string): { latitude: number; longitude: number }[] {
  const points: { latitude: number; longitude: number }[] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;
  while (index < encoded.length) {
    let result = 0;
    let shift = 0;
    let b: number;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = (result & 1) ? ~(result >> 1) : result >> 1;
    lat += dlat;
    result = 0;
    shift = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = (result & 1) ? ~(result >> 1) : result >> 1;
    lng += dlng;
    points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }
  return points;
}

const DEFAULT_REGION = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const BookARide: FC<{ navigation: NavigationProp<any> }> = ({ navigation }) => {
  const { top: safeTop, bottom: safeBottom } = useSafeAreaInsets();
  const [location, setLocation] = useState('');
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [routePoints, setRoutePoints] = useState<{ latitude: number; longitude: number }[]>([]);
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
    (text: string) => {
      setLocation(text);
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

  const getCurrentPosition = useCallback((): Promise<{ latitude: number; longitude: number } | null> => {
    return new Promise((resolve) => {
      Geolocation.getCurrentPosition(
        (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
      );
    });
  }, []);

  const fetchRoute = useCallback(
    async (origin: { latitude: number; longitude: number }, destination: { latitude: number; longitude: number }) => {
      try {
        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${GOOGLE_PLACES_API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.status !== 'OK' || !data.routes?.[0]) return null;
        const route = data.routes[0];
        const leg = route.legs?.[0];
        const points = route.overview_polyline?.points
          ? decodePolyline(route.overview_polyline.points)
          : [];
        const distance = leg?.distance?.text ?? '';
        const duration = leg?.duration?.text ?? '';
        return { points, distance, duration };
      } catch {
        return null;
      }
    },
    [],
  );

  const handleSelect = useCallback(
    async (item: PlaceSuggestion) => {
      setLocation(item.description);
      setSuggestions([]);
      setShowDropdown(false);
      const coords = await fetchPlaceDetails(item.id);
      if (!coords) return;
      setSelectedCoords(coords);
      setRouteInfo(null);
      setRoutePoints([]);
      setLoadingRoute(true);
      const origin = await getCurrentPosition();
      if (origin) {
        setCurrentLocation(origin);
        const result = await fetchRoute(origin, coords);
        if (result) {
          setRoutePoints(result.points);
          setRouteInfo({ distance: result.distance, duration: result.duration });
          if (result.points.length > 0 && mapRef.current) {
            mapRef.current.fitToCoordinates(
              [origin, ...result.points, coords],
              { edgePadding: { top: 80, right: 40, bottom: 80, left: 40 }, animated: true },
            );
          }
        } else if (mapRef.current) {
          mapRef.current.fitToCoordinates(
            [origin, coords],
            { edgePadding: { top: 80, right: 40, bottom: 80, left: 40 }, animated: true },
          );
        }
      } else if (mapRef.current) {
        mapRef.current.animateToRegion({
          ...coords,
          latitudeDelta: 0.0122,
          longitudeDelta: 0.0121,
        }, 400);
      }
      setLoadingRoute(false);
    },
    [fetchPlaceDetails, getCurrentPosition, fetchRoute],
  );

  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

  useEffect(() => {
    if (loadingRoute || routeInfo) {
      routeSheetRef.current?.open();
    } else {
      routeSheetRef.current?.close();
    }
  }, [loadingRoute, routeInfo]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.backButton, { top: safeTop + 12 }]}
        onPress={() => navigation?.goBack()}
        activeOpacity={0.8}
      >
        <ChevronLeft color={colors.white} size={24} />
      </TouchableOpacity>
      <View style={[styles.inputWrap, { top: safeTop + 77 }]}>
        <MapPin size={20} color={colors.c_666666} />
        <TextInput
          style={styles.input}
          placeholder="Search location..."
          placeholderTextColor={colors.c_666666}
          value={location}
          onChangeText={handleChange}
          onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        />
        {loading && (
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
        showsUserLocation
        zoomEnabled={true}
      >
        {currentLocation && (
          <Marker
            coordinate={currentLocation}
            title="Start"
            description="Your location"
            pinColor={colors.green}
          />
        )}
        {selectedCoords && (
          <Marker
            coordinate={selectedCoords}
            title="Destination"
            description={location || 'Selected place'}
            pinColor={colors.c_EE4026}
          />
        )}
        {(() => {
          const lineCoords =
            currentLocation && selectedCoords && routePoints.length > 0
              ? [currentLocation, ...routePoints, selectedCoords]
              : routePoints.length > 0
                ? routePoints
                : currentLocation && selectedCoords
                  ? [currentLocation, selectedCoords]
                  : [];
          return lineCoords.length > 0 ? (
            <Polyline
              coordinates={lineCoords}
              strokeColor={colors.c_0162C0}
              strokeWidth={5}
            />
          ) : null;
        })()}
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
  inputWrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 10,
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
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  dropdown: {
    position: 'absolute',
    top: 52,
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
