import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { FC, useCallback, useEffect, useRef } from 'react';
import colors from '../../config/colors';
import images from '../../config/images';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { CommonActions } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';

const Splash: FC<{ navigation: any }> = ({ navigation }) => {
  const animation = useRef(new Animated.Value(10)).current;
  const { token } = useSelector((state: RootState) => state.auth);
  useEffect(() => {
    Animated.timing(animation, {
      toValue: 2000,
      duration: 1000,
      useNativeDriver: false, // can't use native driver for width/height
    }).start();
    const timeout = setTimeout(() => {
      if (token) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'app' }],
          })
        )
      } else {
        navigation.navigate('GetStarted');
      }
    }, 3000);
    return () => clearTimeout(timeout);
  }, [animation]);

  const animatedStyle = {
    width: animation,
    height: animation,
    borderRadius: '50%',
  };


  const getCurrentPosition = useCallback((): Promise<{ latitude: number; longitude: number } | null> => {
    return new Promise((resolve) => {
      Geolocation.getCurrentPosition(
        (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
      );
    });
  }, []);
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.object, animatedStyle]}>
        <Image source={images.splash} style={styles.image} />
      </Animated.View>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  object: {
    backgroundColor: colors.primary,
    width: 100,
    height: 100,
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 140,
    width: 227,
  },
});
