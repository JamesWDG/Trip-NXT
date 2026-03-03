import Geolocation from '@react-native-community/geolocation';

export const getLocation = async (): Promise<{
  latitude: number;
  longitude: number;
}> => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => {
        console.log('error ===>', error);
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 10000,
      },
    );
  });
};

export const reverseGeocode = async (latitude: number, longitude: number) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_API_KEY`,
    );

    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error(data.status);
    }

    const result = data.results[0];

    const city =
      result.address_components.find((component: any) =>
        component.types.includes('locality'),
      )?.long_name ||
      result.address_components.find((component: any) =>
        component.types.includes('administrative_area_level_2'),
      )?.long_name ||
      null;

    return {
      formattedAddress: result.formatted_address,
      city,
      state: result.address_components.find((c: any) =>
        c.types.includes('administrative_area_level_1'),
      )?.long_name,
      country: result.address_components.find((c: any) =>
        c.types.includes('country'),
      )?.long_name,
    };
  } catch (error) {
    console.log('Reverse geocoding error:', error);
    return null;
  }
};
