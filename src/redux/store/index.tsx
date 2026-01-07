import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer, PersistConfig } from 'redux-persist';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { authApi } from '../services/authService';
import authReducer from '../slices/authSlice';
import { baseApi } from '../services/api';

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  auth: authReducer,
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
    }).concat(authApi.middleware),
});

export type RootState = ReturnType<typeof rootReducer>;

const persistor = persistStore(store);

export { store, persistor };
