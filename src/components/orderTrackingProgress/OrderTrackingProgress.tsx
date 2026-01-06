import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Check } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../../config/colors';
import fonts from '../../config/fonts';

interface OrderStage {
  label: string;
  completed: boolean;
}

interface OrderTrackingProgressProps {
  stages: OrderStage[];
}

const OrderTrackingProgress = ({ stages }: OrderTrackingProgressProps) => {
  return (
    <View style={styles.container}>
      {stages.map((stage, index) => (
        <React.Fragment key={index}>
          {/* Stage Circle */}
          <View style={styles.stageContainer}>
            {stage.completed ? (
              <LinearGradient
                colors={['#F47E20', '#EE4026']}
                style={styles.completedCircle}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Check size={16} color={colors.white} strokeWidth={3} />
              </LinearGradient>
            ) : (
              <View style={styles.pendingCircle} />
            )}
            <View style={styles.labelContainer}>
              <Text style={styles.label} numberOfLines={1}>
                {stage.label}
              </Text>
            </View>
          </View>

          {/* Connecting Line */}
          {index < stages.length - 1 && (
            <View
              style={[
                styles.connector,
                stage.completed && styles.connectorCompleted,
              ]}
            />
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

export default OrderTrackingProgress;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    paddingVertical: 20,
  },
  stageContainer: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 4,
  },
  completedCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  pendingCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.c_F47E20,
    backgroundColor: colors.white,
    marginBottom: 8,
  },
  labelContainer: {
    marginTop: 4,
    // alignItems: 'center',
    // justifyContent: 'center',
    alignSelf: 'stretch',
    width: 70,
  },
  label: {
    fontSize: 10,
    // backgroundColor: colors.c_EE4026,
    fontFamily: fonts.normal,
    color: colors.black,
    // textAlign: 'right',
    // includeFontPadding: false,
  },
  connector: {
    flex: 1,
    height: 2,
    backgroundColor: colors.c_F3F3F3,
    marginTop: 18,
    marginHorizontal: 2,
    minWidth: 20,
  },
  connectorCompleted: {
    backgroundColor: colors.c_F47E20,
  },
});
