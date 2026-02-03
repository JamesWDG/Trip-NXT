import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useRef } from 'react';
import { CheckCircle2 } from 'lucide-react-native';
import colors from '../../config/colors';
import fonts from '../../config/fonts';

interface StatusSuccessPopupProps {
  visible: boolean;
  statusLabel: string;
  onDismiss: () => void;
  autoCloseMs?: number;
}

const StatusSuccessPopup = ({
  visible,
  statusLabel,
  onDismiss,
  autoCloseMs = 2500,
}: StatusSuccessPopupProps) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityOverlay = useRef(new Animated.Value(0)).current;
  const opacityCard = useRef(new Animated.Value(0)).current;
  const checkScale = useRef(new Animated.Value(0.3)).current;
  const autoCloseRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (visible) {
      scaleAnim.setValue(0);
      opacityOverlay.setValue(0);
      opacityCard.setValue(0);
      checkScale.setValue(0.3);

      Animated.sequence([
        Animated.parallel([
          Animated.timing(opacityOverlay, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(opacityCard, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 80,
            friction: 8,
          }),
          Animated.spring(checkScale, {
            toValue: 1,
            useNativeDriver: true,
            tension: 100,
            friction: 6,
          }),
        ]),
      ]).start();

      autoCloseRef.current = setTimeout(() => {
        handleClose();
      }, autoCloseMs);
    }

    return () => {
      if (autoCloseRef.current) clearTimeout(autoCloseRef.current);
    };
  }, [visible]);

  const handleClose = () => {
    if (autoCloseRef.current) {
      clearTimeout(autoCloseRef.current);
      autoCloseRef.current = null;
    }
    Animated.parallel([
      Animated.timing(opacityOverlay, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacityCard, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => {
      scaleAnim.setValue(0);
      onDismiss();
    });
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        style={StyleSheet.absoluteFill}
        onPress={handleClose}
      >
        <Animated.View
          style={[styles.overlay, { opacity: opacityOverlay }]}
        />
      </TouchableOpacity>
      <View style={styles.centered} pointerEvents="box-none">
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleClose}
          style={styles.cardTouch}
        >
          <Animated.View
            style={[
              styles.card,
              {
                opacity: opacityCard,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Animated.View
              style={[
                styles.iconWrap,
                {
                  transform: [{ scale: checkScale }],
                },
              ]}
            >
              <CheckCircle2
                size={64}
                color={colors.green ?? '#22c55e'}
                strokeWidth={2}
              />
            </Animated.View>
            <Text style={styles.title}>Success!</Text>
            <Text style={styles.message}>
              Status updated to{'\n'}
              <Text style={styles.statusHighlight}>{statusLabel}</Text>
            </Text>
            <Text style={styles.hint}>Tap anywhere to close</Text>
          </Animated.View>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default StatusSuccessPopup;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  cardTouch: {
    alignSelf: 'center',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 28,
    alignItems: 'center',
    minWidth: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  iconWrap: {
    marginBottom: 16,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: colors.black,
    marginBottom: 8,
  },
  message: {
    fontFamily: fonts.normal,
    fontSize: 15,
    color: colors.c_666666,
    textAlign: 'center',
    lineHeight: 22,
  },
  statusHighlight: {
    fontFamily: fonts.semibold,
    color: colors.c_0162C0,
    textTransform: 'capitalize',
  },
  hint: {
    fontFamily: fonts.normal,
    fontSize: 12,
    color: colors.c_666666,
    marginTop: 16,
    opacity: 0.8,
  },
});
