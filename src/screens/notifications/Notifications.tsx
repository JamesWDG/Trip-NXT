import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BellIcon, ChevronLeftIcon } from 'lucide-react-native';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import images from '../../config/images';
import { useLazyGetNotificationsQuery } from '../../redux/services/notification.service';
import NotificationsSkeleton from '../../components/notificationsSkeleton/NotificationsSkeleton';

interface NotificationItem {
  id: number;
  userId: number;
  type: string;
  title: string;
  body: string;
  data: {
    rideId: string;
  };
  read: boolean;
  entityType: string;
  entityId: number;
  createdAt: string;
  updatedAt: string;
}

function formatNotificationTime(isoDate: string): string {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

const NotificationItemComponent = ({ item }: { item: NotificationItem }) => {
  const isUnread = !item.read;
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[styles.notificationCard, isUnread && styles.notificationCardUnread]}
    >
      <View style={[styles.iconWrap, isUnread && styles.iconWrapUnread]}>
        <BellIcon
          color={isUnread ? colors.c_0162C0 : colors.c_666666}
          size={22}
        />
        {isUnread && <View style={styles.unreadDot} />}
      </View>
      <View style={styles.notificationContent}>
        {item.title ? (
          <Text style={styles.notificationTitle} numberOfLines={1}>
            {item.title}
          </Text>
        ) : null}
        <Text style={styles.notificationBody} numberOfLines={3}>
          {item.body}
        </Text>
        <Text style={styles.notificationTime}>
          {formatNotificationTime(item.createdAt)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const Notifications = ({ navigation }: { navigation?: any }) => {
  const { top } = useSafeAreaInsets();
  const headerStyles = useMemo(() => makeHeaderStyles(top), [top]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [getNotifications] = useLazyGetNotificationsQuery();

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await getNotifications({}).unwrap();
      setNotifications((res.data?.list ?? []) as NotificationItem[]);
    } catch (error) {
      console.log('notifications error ===>', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

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
          {loading && notifications.length === 0 ? (
            <NotificationsSkeleton />
          ) : (
            <FlatList
              data={notifications}
              renderItem={({ item }) => (
                <NotificationItemComponent item={item} />
              )}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              ListEmptyComponent={
                <View style={styles.emptyWrap}>
                  <BellIcon color={colors.c_CFD1D3} size={48} />
                  <Text style={styles.emptyTitle}>No notifications yet</Text>
                  <Text style={styles.emptySubtext}>
                    We'll notify you when something new arrives.
                  </Text>
                </View>
              }
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          )}
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
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    backgroundColor: colors.white,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.c_F3F3F3,
  },
  notificationCardUnread: {
    backgroundColor: colors.c_F6F6F6,
    borderColor: 'rgba(1, 98, 192, 0.12)',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.c_F3F3F3,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  iconWrapUnread: {
    backgroundColor: 'rgba(1, 98, 192, 0.1)',
  },
  unreadDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.c_EE4026,
    borderWidth: 2,
    borderColor: colors.white,
  },
  notificationContent: {
    flex: 1,
    minWidth: 0,
  },
  notificationTitle: {
    fontSize: 15,
    fontFamily: fonts.semibold,
    color: colors.black,
    marginBottom: 4,
  },
  notificationBody: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_505050,
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: 12,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    marginTop: 8,
  },
  separator: {
    height: 0,
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 17,
    fontFamily: fonts.semibold,
    color: colors.c_2B2B2B,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    marginTop: 8,
    textAlign: 'center',
  },
});
