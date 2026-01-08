import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import  { FC, useEffect, useRef } from 'react';
import colors from '../../config/colors';
import images from '../../config/images';

const Splash: FC<{ navigation: any }> = ({ navigation }) => {
  const animation = useRef(new Animated.Value(10)).current;
  useEffect(() => {
    Animated.timing(animation, {
      toValue: 2000,
      duration: 1000,
      useNativeDriver: false, // can't use native driver for width/height
    }).start();
  }, [animation]);

  const animatedStyle = {
    width: animation,
    height: animation,
    borderRadius: '50%',
  };

  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('GetStarted');
    }, 3000);
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
