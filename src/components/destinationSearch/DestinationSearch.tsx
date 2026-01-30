import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  FlatList,
  Alert,
} from 'react-native';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SearchIcon, Navigation, Clock, MapPin, LocateFixed } from 'lucide-react-native';
import Geolocation from '@react-native-community/geolocation';
import colors from '../../config/colors';
import fonts from '../../config/fonts';

export interface SearchHistoryItem {
  id: string;
  address: string;
  city: string;
  destination: string;
  lat?: number;
  lng?: number;
  place_id?: string;
}

interface DestinationSearchProps {
  placeholder?: string;
  historyItems?: SearchHistoryItem[];
  onSearchChange?: (text: string) => void;
  onItemPress?: (item: SearchHistoryItem) => void;
  showCurrentLocation?: boolean;
  currentLocation?: SearchHistoryItem;
}

const DestinationSearch: React.FC<DestinationSearchProps> = ({
  placeholder = 'Search for Destination',
  historyItems = [],
  onSearchChange,
  onItemPress,
  showCurrentLocation = true,
  currentLocation,
}) => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<SearchHistoryItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isFetchingCoordinates, setIsFetchingCoordinates] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const displayHistory = historyItems || [];

  // Google Places Autocomplete API
  const GOOGLE_API_KEY = 'AIzaSyD28UEoebX1hKscL3odt2TiTRVfe5SSpwE';

  // Forward geocoding - search places using Google Places Autocomplete
  const searchPlaces = async (query: string): Promise<SearchHistoryItem[]> => {
    if (!query) return [];

    try {
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        query,
      )}&key=${GOOGLE_API_KEY}&types=geocode&language=en`;

      const response = await fetch(url);
      const data = await response.json();

      if (
        data.status === 'OK' &&
        data.predictions &&
        Array.isArray(data.predictions)
      ) {
        return data.predictions.map((prediction: any, index: number) => {
          // Parse the description to extract address and city
          const descriptionParts = prediction.description.split(',');
          const mainText =
            prediction.structured_formatting?.main_text ||
            descriptionParts[0] ||
            '';
          const secondaryText =
            prediction.structured_formatting?.secondary_text ||
            descriptionParts.slice(1).join(',') ||
            '';

          // Extract city from secondary text or description
          const city =
            secondaryText.split(',')[0]?.trim() ||
            descriptionParts[1]?.trim() ||
            '';
          const address = mainText || descriptionParts[0]?.trim() || '';
          const destination = prediction.description || query;

          return {
            id: `search-${index}-${prediction.place_id}`,
            address: address,
            city: city,
            destination: destination,
            place_id: prediction.place_id,
          };
        });
      }
      return [];
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  };

  // Perform search with debounce
  const performSearch = useCallback(async (query: string) => {
    if (query.length < 3) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchPlaces(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    (query: string) => {
      // Clear previous timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Set new timeout
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(query);
      }, 500);
    },
    [performSearch],
  );

  const handleSearchChange = useCallback(
    (text: string) => {
      setSearchText(text);
      onSearchChange?.(text);

      // Clear search results if text is too short
      if (text.length < 3) {
        // Clear previous timeout
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
          searchTimeoutRef.current = null;
        }
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      // Debounce search
      debouncedSearch(text);
    },
    [onSearchChange, debouncedSearch],
  );

  // Fetch place details including coordinates
  const fetchPlaceDetails = async (placeId: string): Promise<{ lat: number; lng: number } | null> => {
    try {
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry&key=${GOOGLE_API_KEY}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && data.result?.geometry?.location) {
        return {
          lat: data.result.geometry.location.lat,
          lng: data.result.geometry.location.lng,
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching place details:', error);
      return null;
    }
  };

  const handleItemPress = async (item: SearchHistoryItem) => {
    // If item already has coordinates, use them
    if (item.lat && item.lng) {
      onItemPress?.(item);
      setSearchText(item?.destination);
      setSearchResults([]);
      return;
    }

    // If item has place_id, fetch coordinates
    if (item.place_id) {
      setIsFetchingCoordinates(true);
      try {
        const coordinates = await fetchPlaceDetails(item.place_id);
        if (coordinates) {
          const itemWithCoordinates: SearchHistoryItem = {
            ...item,
            lat: coordinates.lat,
            lng: coordinates.lng,
          };
          onItemPress?.(itemWithCoordinates);
          console.log('Item with coordinates:', itemWithCoordinates);
        } else {
          // If coordinates fetch fails, still pass the item without coordinates
          onItemPress?.(item);
        }
        setSearchText(item?.destination);
        setSearchResults([]);
      } catch (error) {
        console.error('Error fetching coordinates:', error);
        onItemPress?.(item);
        setSearchText(item?.destination);
        setSearchResults([]);
      } finally {
        setIsFetchingCoordinates(false);
      }
    } else {
      // If no place_id, pass item as is
      onItemPress?.(item);
      setSearchText(item?.destination);
      setSearchResults([]);
    }
  };

  // Reverse geocode coordinates to get address
  const reverseGeocode = async (lat: number, lng: number): Promise<SearchHistoryItem | null> => {
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}&language=en`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && data.results && data.results.length > 0) {
        const result = data.results[0];
        const addressComponents = result.address_components || [];
        
        // Extract address components
        let streetNumber = '';
        let route = '';
        let city = '';
        let country = '';

        addressComponents.forEach((component: any) => {
          const types = component.types;
          if (types.includes('street_number')) {
            streetNumber = component.long_name;
          } else if (types.includes('route')) {
            route = component.long_name;
          } else if (types.includes('locality') || types.includes('administrative_area_level_1')) {
            city = component.long_name;
          } else if (types.includes('country')) {
            country = component.long_name;
          }
        });

        const address = streetNumber && route ? `${streetNumber} ${route}` : route || result.formatted_address.split(',')[0];
        const fullAddress = result.formatted_address;

        return {
          id: `current-location-${Date.now()}`,
          address: address,
          city: city || country,
          destination: fullAddress,
          lat: lat,
          lng: lng,
        };
      }
      return null;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return null;
    }
  };

  // Get current location and show as prediction
  const handleGetCurrentLocation = () => {
    setIsFetchingLocation(true);
    
    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Reverse geocode to get address
        const locationItem = await reverseGeocode(latitude, longitude);
        
        if (locationItem) {
          // Show as search result
          setSearchResults([locationItem]);
          setSearchText(locationItem.destination);
          setIsFetchingLocation(false);
        } else {
          Alert.alert('Error', 'Unable to get address for current location');
          setIsFetchingLocation(false);
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        Alert.alert(
          'Location Error',
          'Unable to get your current location. Please check your location permissions.',
        );
        setIsFetchingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const isSearchingActive = searchText.length >= 3 || searchResults.length > 0;
  const showSearchResults = isSearchingActive;
  const showLocationAndHistory = !isSearchingActive && searchText.length === 0;

  // Render history item
  const renderHistoryItem = ({
    item,
    index,
  }: {
    item: SearchHistoryItem;
    index: number;
  }) => (
    <TouchableOpacity
      style={styles.historyItem}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.resultContent}>
        <Text style={styles.historyLabel}>
          History - {item.address}, {item.city}
        </Text>
        <Text style={styles.resultDestination} numberOfLines={1}>
          {item.destination}
        </Text>
      </View>
      <Clock size={20} color={colors.c_666666} />
    </TouchableOpacity>
  );

  // Render separator for FlatList
  const renderSeparator = () => <View style={styles.separator} />;

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <SearchIcon size={20} color={colors.c_666666} />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={colors.c_666666}
          style={[styles.searchInput, { width: showCurrentLocation ? '80%' : '100%', }]}
          value={searchText}
          onChangeText={handleSearchChange}
        />
        {
          showCurrentLocation && (
            <TouchableOpacity 
              onPress={handleGetCurrentLocation} 
              activeOpacity={0.7}
              disabled={isFetchingLocation}
            >
              {isFetchingLocation ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <LocateFixed size={20} color={colors.primary} />
              )}
            </TouchableOpacity>
          )
        }
      </View>

      {/* Search Results */}
      {showSearchResults && (
        <>
          {isSearching ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.loadingText}>Searching...</Text>
            </View>
          ) : searchResults.length > 0 ? (
            <>
              {searchResults.map((item, index) => (
                <View key={item.id}>
                  {index > 0 && <View style={styles.separator} />}
                  <TouchableOpacity
                    style={styles.resultItem}
                    onPress={() => handleItemPress(item)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.resultContent}>
                      <Text style={styles.resultAddress}>
                        {item.address}, {item.city}
                      </Text>
                      <Text style={styles.resultDestination} numberOfLines={1}>
                        {item.destination}
                      </Text>
                    </View>
                    <Navigation size={20} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              ))}
            </>
          ) : (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>No results found</Text>
            </View>
          )}
        </>
      )}

      {/* Current Location and History */}
      {showLocationAndHistory && (
        <>
          {/* Current Location */}
          {showCurrentLocation && currentLocation && (
            <TouchableOpacity
              style={styles.currentLocationItem}
              onPress={() => handleItemPress(currentLocation)}
              activeOpacity={0.7}
            >
              <View style={styles.resultContent}>
                <Text style={styles.currentLocationLabel}>
                  Current Location - {currentLocation.address},{' '}
                  {currentLocation.city}
                </Text>
                <Text style={styles.resultDestination} numberOfLines={1}>
                  {currentLocation.destination}
                </Text>
              </View>
              <MapPin size={20} color={colors.primary} />
            </TouchableOpacity>
          )}

          {showCurrentLocation &&
            currentLocation &&
            displayHistory.length > 0 && <View style={styles.separator} />}

          {/* History Items */}
          <FlatList
            data={displayHistory}
            renderItem={renderHistoryItem}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={renderSeparator}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.historyListContainer}
          />
        </>
      )}
    </View>
  );
};

export default DestinationSearch;

const styles = StyleSheet.create({
  container: {
    // backgroundColor: colors.white,
    paddingTop: 20,
    paddingBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 100,
    paddingHorizontal: 16,
    // paddingVertical: 12,
    height: 48,
    // gap: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    justifyContent: 'space-between',
  },
  historyListContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 13,
    // Android needs elevation:
    elevation: 5,
  },
  searchInput: {
    height: '100%',
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.black,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  currentLocationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  resultContent: {
    flex: 1,
    marginRight: 10,
  },
  resultAddress: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.black,
    marginBottom: 4,
  },
  resultDestination: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  historyLabel: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    marginBottom: 4,
  },
  currentLocationLabel: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.primary,
    marginBottom: 4,
  },
  separator: {
    height: 1,
    backgroundColor: colors.c_DDDDDD,
    marginVertical: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
  noResultsContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
  },
});
