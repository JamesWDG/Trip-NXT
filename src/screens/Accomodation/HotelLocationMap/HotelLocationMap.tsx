import React, { useMemo } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import { ChevronLeftIcon } from 'lucide-react-native';
import colors from '../../../config/colors';

type HotelLocationMapParams = {
  latitude: number;
  longitude: number;
  hotelName?: string;
  location?: {
    city?: string;
    state?: string;
    country?: string;
    street?: string;
  };
};

const DEFAULT_LAT = 40.7128;
const DEFAULT_LNG = -74.006;
const REGION_DELTA = 0.012;

const HotelLocationMap = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<{ params: HotelLocationMapParams }>>();
  const { top } = useSafeAreaInsets();

  const { latitude, longitude, hotelName, location } = route.params ?? {};
  const lat = typeof latitude === 'number' ? latitude : DEFAULT_LAT;
  const lng = typeof longitude === 'number' ? longitude : DEFAULT_LNG;

  const initialRegion = useMemo(
    () => ({
      latitude: lat,
      longitude: lng,
      latitudeDelta: REGION_DELTA,
      longitudeDelta: REGION_DELTA,
    }),
    [lat, lng]
  );

  const coordinate = useMemo(() => ({ latitude: lat, longitude: lng }), [lat, lng]);

  const addressSnippet =
    location &&
    [location.city, location.state, location.country]
      .filter(Boolean)
      .join(', ');

      console.log('addressSnippet ===>', addressSnippet);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={false}
        showsMyLocationButton={false}
        zoomEnabled
        scrollEnabled
        pitchEnabled
      >
        <Marker
          coordinate={coordinate}
          title={hotelName ?? 'Hotel'}
          description={addressSnippet || 'Not Available'}
          pinColor={colors.c_0162C0}
        />
      </MapView>
      <TouchableOpacity
        style={[styles.backButton, { top: top + 12 }]}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
      >
        <ChevronLeftIcon color={colors.white} size={24} />
      </TouchableOpacity>
    </View>
  );
};

export default HotelLocationMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.c_0162C0,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
