import { baseApi } from './api';
import { endpoint } from '../../constants/api';

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    registerFcmToken: builder.mutation<{ success?: boolean }, { fcmToken: string }>({
      query: (body) => ({
        url: endpoint.NOTIFICATION_REGISTER_TOKEN,
        method: 'POST',
        body,
      }),
    }),
    getNotifications: builder.query({
      query: () => ({
        url: endpoint.GET_NOTIFICATIONS,
        method: 'GET'
      })
    })
  }),
});

export const { useRegisterFcmTokenMutation, useLazyGetNotificationsQuery } = notificationApi;
