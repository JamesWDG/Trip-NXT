import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BellIcon, ChevronLeftIcon } from 'lucide-react-native';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import images from '../../config/images';

interface NotificationItem {
  id: number;
  text: string;
}

const newNotifications: NotificationItem[] = [
  {
    id: 1,
    text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
  },
  {
    id: 2,
    text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
  },
  {
    id: 3,
    text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
  },
  {
    id: 4,
    text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
  },
  {
    id: 5,
    text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
  },
];

// const yesterdayNotifications: NotificationItem[] = [
//   {
//     id: 1,
//     text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
//   },
//   {
//     id: 2,
//     text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
//   },
//   {
//     id: 3,
//     text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
//   },
//   {
//     id: 4,
//     text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
//   },
//   {
//     id: 5,
//     text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
//   },
// ];

const NotificationItemComponent = ({ text }: { text: string }) => {
  return (
    <View style={styles.notificationItem}>
      <View style={styles.bellIconContainer}>
        <BellIcon color={colors.c_0162C0} size={24} />
        <View style={styles.redDot} />
      </View>
      <Text style={styles.notificationText}>{text}</Text>
    </View>
  );
};

const Notifications = ({ navigation }: { navigation?: any }) => {
  const { top } = useSafeAreaInsets();
  const headerStyles = useMemo(() => makeHeaderStyles(top), [top]);

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <View style={headerStyles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
        >
          <ChevronLeftIcon color={colors.white} size={24} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Notifications</Text>

        <TouchableOpacity
          onPress={() => navigation?.navigate('Profile')}
          style={styles.profileContainer}
        >
          <Image source={images.avatar} style={styles.profileImage} />
          <View style={styles.greenDot} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* New Section */}
          {/* <View style={styles.section}> */}
          {/* <Text style={styles.sectionTitle}>New</Text> */}
          <FlatList
            data={newNotifications}
            renderItem={({ item }) => (
              <NotificationItemComponent text={item.text} />
            )}
            keyExtractor={item => item.id.toString()}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
          {/* </View> */}

          {/* Yesterday Section */}
          {/* <View style={styles.section}>
            <Text style={styles.sectionTitle}>Yesterday</Text>
            <FlatList
              data={yesterdayNotifications}
              renderItem={({ item }) => (
                <NotificationItemComponent text={item.text} />
              )}
              keyExtractor={item => item.id.toString()}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View> */}
        </ScrollView>
      </View>
    </View>
  );
};

export default Notifications;

const makeHeaderStyles = (top: number) =>
  StyleSheet.create({
    headerContainer: {
      paddingTop: top + 10,
      paddingBottom: 25,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      backgroundColor: colors.c_0162C0,
    },
  });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.c_0162C0,
  },
  backButton: {
    backgroundColor: colors.c_EE4026,
    padding: 8,
    borderRadius: 100,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  profileContainer: {
    position: 'relative',
    width: 36,
    height: 36,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.white,
  },
  greenDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.green,
    borderWidth: 2,
    borderColor: colors.c_0162C0,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -1,
    // iOS shadow
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    // Android shadow
    elevation: 8,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.black,
    marginBottom: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: colors.white,
    paddingVertical: 12,
  },
  bellIconContainer: {
    position: 'relative',
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  redDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.red,
    borderWidth: 1,
    borderColor: colors.white,
  },
  notificationText: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_505050,
    lineHeight: 20,
  },
  separator: {
    height: 1,
    backgroundColor: colors.c_F3F3F3,
    marginVertical: 8,
  },
});
