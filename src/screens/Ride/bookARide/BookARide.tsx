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
import { MapPin } from 'lucide-react-native';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import MapView from 'react-native-maps';
import { width } from '../../../config/constants';

const GOOGLE_PLACES_API_KEY = 'AIzaSyD28UEoebX1hKscL3odt2TiTRVfe5SSpwE';
type PlaceSuggestion = { id: string; description: string; mainText: string };

const DEFAULT_REGION = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const BookARide: FC<{ navigation: NavigationProp<any> }> = ({ navigation }) => {
  const [location, setLocation] = useState('');
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mapRef = useRef<MapView>(null);

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

  const handleSelect = useCallback(
    async (item: PlaceSuggestion) => {
      setLocation(item.description);
      setSuggestions([]);
      setShowDropdown(false);
      const coords = await fetchPlaceDetails(item.id);
      if (coords) {
        setSelectedCoords(coords);
        mapRef.current?.animateToRegion({
          ...coords,
          latitudeDelta: 0.0122,
          longitudeDelta: 0.0121,
        }, 400);
      }
    },
    [fetchPlaceDetails],
  );

  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

  return (
    <View style={styles.container}>
      <View style={styles.inputWrap}>
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
      />
    </View>
  );
};

export default BookARide;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputWrap: {
    position: 'absolute',
    top: 50,
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
});
