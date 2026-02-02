import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useEffect, useState } from 'react';
import WrapperWithVideo from '../../components/wrappers/WrapperWithVideo';
import labels from '../../config/labels';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import IntroWrapperWithTitle from '../../components/introWrapperWithTitle/IntroWrapperWithTitle';
import Input from '../../components/input/Input';
import ToggleBox from '../../components/toggleBox/ToggleBox';
import { ShowToast, width } from '../../config/constants';
import GradientButton from '../../components/gradientButton/GradientButton';
import ButtonWithIcon from '../../components/buttonWithIcon/ButtonWithIcon';
import { validateLoginFields } from '../../utils/validations';
import { useLoginMutation } from '../../redux/services/authService';
import { useDispatch, useSelector } from 'react-redux';
import {
  setRememberMe,
  saveCredentials,
  clearCredentials,
} from '../../redux/slices/authSlice';
import { RootState } from '../../redux/store';
import GeneralStyles from '../../utils/GeneralStyles';
import images from '../../config/images';
import { CommonActions } from '@react-navigation/native';

interface stateTypes {
  email: string;
  password: string;
  errors: {
    email: string;
    password: string;
  };
}

const Login = ({ navigation }: { navigation: any }) => {
  const [state, setState] = useState<stateTypes>({
    email: '',
    password: '',
    errors: {
      email: '',
      password: '',
    },
  });
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const rememberMe = useSelector((state: RootState) => state.auth.rememberMe);
  const savedCredentials = useSelector((state: RootState) => state.auth.user);

  // Load saved credentials on mount if rememberMe is true
  useEffect(() => {
    if (rememberMe && savedCredentials?.email && savedCredentials?.password) {
      setState(prevState => ({
        ...prevState,
        email: savedCredentials.email || '',
        password: savedCredentials.password || '',
      }));
    }
  }, []);

  useEffect(() => {
    if (!rememberMe && savedCredentials?.email && savedCredentials?.password) {
      dispatch(clearCredentials());
    }
  }, [rememberMe, dispatch]);

  const handleRememberMe = () => {
    const newRememberMeValue = !rememberMe;
    dispatch(setRememberMe(newRememberMeValue));

    if (!newRememberMeValue) {
      dispatch(clearCredentials());
    }
  };
  const onLoginPress = async () => {
    const errors = validateLoginFields(state);
    setState(prevState => ({
      ...prevState,
      errors,
    }));
    if (errors.email || errors.password) {
      return;
    }
    try {
      let data = {
        email: state.email?.toLowerCase(),
        password: state.password,
      };
      const res = await login(data).unwrap();
      ShowToast('success', res.message ?? 'Login successful');
      if (res.success) {
        if (rememberMe) {
          dispatch(
            saveCredentials({ email: state.email, password: state.password }),
          );
        } else {
          dispatch(clearCredentials());
        }
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'app' }],
          }),
        );
      }
    } catch (error) {
      ShowToast(
        'error',
        (error as { data: { message: string } }).data.message ||
        'Something went wrong',
      );
    }
  };
  const onSignupPress = () => {
    navigation.navigate('Signup');
  };

  const onChangeText = (text: string, key: 'email' | 'password') => {
    setState(prev => ({
      ...prev,
      [key]: text,
      errors: {
        ...prev.errors,
        [key]: '',
      },
    }));
  };

  return (
    <WrapperWithVideo introWrapper={true} otherStyles={styles.introWrapper}>
      <View style={styles.introWrapperContainer} pointerEvents="none">
        <IntroWrapperWithTitle title={labels.login} resizeMode="stretch" />
      </View>

      <KeyboardAvoidingView behavior="padding" style={GeneralStyles.flex}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContentContainer}
        >
          <View style={styles.inputContainer}>
            <Input
              errorBorder={!!state.errors.email}
              errorText={state.errors.email}
              value={state.email}
              onChangeText={text => onChangeText(text, 'email')}
              placeholder={labels.typeYourEmail}
              title={labels.email}
            />
            <Input
              placeholder={labels.typeYourPassword}
              value={state.password}
              secureTextEntry={true}
              onChangeText={text => onChangeText(text, 'password')}
              title={labels.password}
              errorBorder={!!state.errors.password}
              errorText={state.errors.password}
            />
          </View>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={styles.rememberMeContainer}
              onPress={handleRememberMe}
            >
              <ToggleBox isChecked={rememberMe} />
              <Text style={styles.toggleText}>{labels.rememberMe}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => (navigation as any).navigate('ForgotPassword')}
            >
              <Text style={styles.toggleText}>{labels.forgetPassword}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.loginButtonContainer}>
            <GradientButton
              title={labels.login}
              loader={isLoading}
              onPress={(onLoginPress)}
              fontFamily={fonts.bold}
              fontSize={18}
            />
          </View>

          {/* Or Component */}
          <View style={styles.orContainer}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>{labels.or}</Text>
            <View style={styles.orLine} />
          </View>

          {/* Google Signup Button */}
          <View style={styles.continueWithGoogleContainer}>
            <ButtonWithIcon
              type='google'
              title={labels.continueWithGoogle}
              onPress={onLoginPress}
            />
            {Platform.OS === 'ios' && <ButtonWithIcon
              height={35}
              width={35}
              type='apple'
              imageSrc={images.apple}
              title={labels.continueWithApple}
            />}
          </View>

          <View style={styles.dontHaveAnAccountContainer}>
            <Text style={styles.dontHaveAnAccountText}>
              {labels.dontHaveAnAccount}
            </Text>
            <TouchableOpacity onPress={onSignupPress}>
              <Text style={[styles.dontHaveAnAccountText, styles.boldText]}>
                {labels.signup}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </WrapperWithVideo>
  );
};

export default Login;

const styles = StyleSheet.create({
  inputContainer: {
    gap: 16,
    marginTop: 300,
  },
  continueWithGoogleContainer: { flex: 1, marginTop: 28, gap: 20 },
  loginButtonContainer: { marginTop: 40 },
  introWrapper: {
    position: 'absolute',
    // top: -140,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  introWrapperContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 10,
  },
  rememberMeContainer: { flexDirection: 'row', gap: 10 },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    width: width * 0.9,
    paddingHorizontal: 10,
    marginTop: 12,

  },
  toggleText: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.white,
    marginLeft: 10
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 28,
    width: width * 0.9,
  },
  orLine: {
    height: 1,
    flex: 1,
    backgroundColor: colors.white,
  },
  orText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fonts.normal,
  },
  dontHaveAnAccountContainer: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    width: width * 0.9,
    paddingHorizontal: 10,
  },
  dontHaveAnAccountText: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.white,
  },
  boldText: {
    fontFamily: fonts.bold,
  },
  scrollViewContentContainer: {
    paddingBottom: 40,
  },
});
