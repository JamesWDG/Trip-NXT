import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useState } from 'react';
import WrapperContainer from '../../../components/wrapperContainer/WrapperContainer';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import images from '../../../config/images';
import { ShowToast } from '../../../config/constants';
import {
  useGetOrdersByUserIdQuery,
  useGetSingleOrderQuery,
  useUpdateOrderStatusMutation,
} from '../../../redux/services/restaurant.service';

export type OrderItemType = {
  id: number;
  orderId: number;
  itemId: number;
  quantity: number;
  status: string;
  item: {
    id: number;
    name: string;
    description?: string;
    price: number;
    category?: string;
    image?: string;
  };
};

export type OrderType = {
  id: number;
  userId: number;
  restaurantId: number;
  subTotal: number;
  totalAmount: number;
  tax: number;
  deliveryFee: number;
  status: string;
  createdAt: string;
  items: OrderItemType[];
  restaurant: {
    id: number;
    name: string;
    logo?: string;
    location?: string;
  };
  deliveryAddress?: {
    lat: number;
    lng: number;
    location?: string;
  };
};

const OrderDetail = ({ navigation, route }: { navigation?: any; route?: any }) => {
  const orderId = (route?.params?.orderId ?? route?.params?.order?.id) as number | undefined;
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successPopupStatus, setSuccessPopupStatus] = useState('');

  const { data: orderResponse, isLoading, isError, refetch: refetchOrder } = useGetSingleOrderQuery(
    orderId ?? 0,
    { skip: !orderId }
  );
  const order = (orderResponse?.data ?? orderResponse) as OrderType | undefined;

  const [updateOrderStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();
  const { refetch: refetchOrders } = useGetOrdersByUserIdQuery({});

  const handleUpdateStatus = useCallback(
    async (newStatus: string) => {
      if (!orderId || !order) return;
      try {
        await updateOrderStatus({
          orderId,
          restaurantId: order.restaurantId,
          status: newStatus,
        }).unwrap();
        await refetchOrder();
        await refetchOrders();
        ShowToast('success', `Order status updated to ${newStatus}`);
        setSuccessPopupStatus(newStatus);
        setShowSuccessPopup(true);
      } catch (e: any) {
        ShowToast('error', e?.data?.message ?? 'Failed to update status');
      }
    },
    [orderId, order?.restaurantId, updateOrderStatus, refetchOrder, refetchOrders]
  );

  const handleCancelOrder = useCallback(async () => {
    if (!orderId || !order?.id) return;
    await handleUpdateStatus('cancelled');
  }, [orderId, order?.id, handleUpdateStatus]);

  if (!orderId) {
    return (
      <WrapperContainer title="Order Detail" onBackPress={() => navigation?.goBack()}>
        <View style={styles.centered}>
          <Text style={styles.emptyText}>Order not found</Text>
        </View>
      </WrapperContainer>
    );
  }

  if (isLoading && !order) {
    return (
      <WrapperContainer title="Order Detail" onBackPress={() => navigation?.goBack()}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.c_0162C0} />
        </View>
      </WrapperContainer>
    );
  }

  if (isError || !order) {
    return (
      <WrapperContainer title="Order Detail" onBackPress={() => navigation?.goBack()}>
        <View style={styles.centered}>
          <Text style={styles.emptyText}>Order not found</Text>
        </View>
      </WrapperContainer>
    );
  }

  const restaurant = order.restaurant ?? {};
  const deliveryLocation = order.deliveryAddress?.location ?? '—';
  const orderDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })
    : '—';

  return (
    <WrapperContainer title="Order Details" onBackPress={() => navigation?.goBack()}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.restaurantCard}>
          <Image
            source={
              restaurant.logo ? { uri: restaurant.logo } : (images.placeholder as any)
            }
            style={styles.restaurantLogo}
            resizeMode="cover"
          />
          <View style={styles.restaurantInfo}>
            <Text style={styles.restaurantName}>{restaurant.name ?? 'Restaurant'}</Text>
            <Text style={styles.orderIdText}>Order #{order.id}</Text>
            <Text style={styles.statusText}>{order.status}</Text>
            <Text style={styles.dateText}>{orderDate}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <Text style={styles.deliveryText}>{deliveryLocation}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items</Text>
          {(order.items ?? []).map((row) => (
            <View key={row.id} style={styles.itemRow}>
              <Image
                source={
                  row.item?.image
                    ? { uri: row.item.image }
                    : (images.placeholder as any)
                }
                style={styles.itemImage}
                resizeMode="cover"
              />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{row.item?.name ?? 'Item'}</Text>
                <Text style={styles.itemMeta}>
                  {row.quantity} × ${Number(row.item?.price ?? 0).toFixed(2)} = $
                  {(row.quantity * Number(row.item?.price ?? 0)).toFixed(2)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${Number(order.subTotal).toFixed(2)}</Text>
          </View>
          {order.tax != null && Number(order.tax) > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax</Text>
              <Text style={styles.summaryValue}>${Number(order.tax).toFixed(2)}</Text>
            </View>
          )}
          {order.deliveryFee != null && Number(order.deliveryFee) > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>${Number(order.deliveryFee).toFixed(2)}</Text>
            </View>
          )}
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${Number(order.totalAmount).toFixed(2)}</Text>
          </View>
        </View>

        {(order.status || '').toLowerCase() === 'pending' && (
          <View style={styles.section}>
            <TouchableOpacity
              style={[styles.statusButton, styles.statusButtonDanger]}
              onPress={handleCancelOrder}
              disabled={isUpdating}
              activeOpacity={0.8}
            >
              {isUpdating ? (
                <View style={styles.cancelButtonContent}>
                  <ActivityIndicator size="small" color={colors.white} />
                  <Text style={styles.statusButtonText}>Cancelling...</Text>
                </View>
              ) : (
                <Text style={[styles.statusButtonText, styles.statusButtonTextDanger]}>
                  Cancel Order
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {showSuccessPopup && (
        <View style={styles.popup}>
          <Text style={styles.popupText}>Status: {successPopupStatus}</Text>
          <TouchableOpacity onPress={() => setShowSuccessPopup(false)}>
            <Text style={styles.popupDismiss}>OK</Text>
          </TouchableOpacity>
        </View>
      )}
    </WrapperContainer>
  );
};

export default OrderDetail;

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 40 },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.c_666666,
  },
  restaurantCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  restaurantLogo: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: colors.c_F3F3F3,
  },
  restaurantInfo: { marginLeft: 16, flex: 1 },
  restaurantName: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.black,
    marginBottom: 4,
  },
  orderIdText: {
    fontFamily: fonts.normal,
    fontSize: 14,
    color: colors.c_666666,
    marginBottom: 4,
  },
  statusText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    textTransform: 'capitalize',
    color: colors.c_F59523,
    marginBottom: 2,
  },
  dateText: {
    fontFamily: fonts.normal,
    fontSize: 12,
    color: colors.c_666666,
  },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    color: colors.black,
    marginBottom: 12,
  },
  deliveryText: {
    fontFamily: fonts.normal,
    fontSize: 14,
    color: colors.c_666666,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  itemImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: colors.c_F3F3F3,
  },
  itemDetails: { marginLeft: 12, flex: 1 },
  itemName: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.black,
    marginBottom: 4,
  },
  itemMeta: {
    fontFamily: fonts.normal,
    fontSize: 13,
    color: colors.c_666666,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontFamily: fonts.normal,
    fontSize: 14,
    color: colors.c_666666,
  },
  summaryValue: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.black,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.c_DDDDDD,
    marginTop: 8,
    paddingTop: 12,
  },
  totalLabel: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.black,
  },
  totalValue: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.c_0162C0,
  },
  statusButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusButtonDanger: {
    backgroundColor: colors.c_EE4026,
  },
  statusButtonText: {
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.white,
  },
  statusButtonTextDanger: {
    color: colors.white,
  },
  cancelButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  popup: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  popupText: {
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.black,
    marginBottom: 12,
  },
  popupDismiss: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.c_0162C0,
  },
});
