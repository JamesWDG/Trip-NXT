import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer, PersistConfig } from 'redux-persist';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import { baseApi } from '../services/api';
import '../services/hotel.service';
import '../services/cab.service';
import '../services/notification.service';
import locationReducer from '../slices/locationSlice';
const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  auth: authReducer,
  location: locationReducer,
});

const persistConfig: PersistConfig<RootState> = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: { warnAfter: 128 },
      serializableCheck: false,
    }).concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof rootReducer>;

const persistor = persistStore(store);

export { store, persistor };
