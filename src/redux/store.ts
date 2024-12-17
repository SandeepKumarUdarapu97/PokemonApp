import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';
import thunk from 'redux-thunk';

// Import reducers
import authReducer from './slices/authSlice';
import buttonReducer from './slices/buttonSlice';
import pokemonReducer from './slices/pokemonSlice';

// Redux Persist Configuration
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'buttons'], // Persist only these reducers
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  buttons: buttonReducer,
  pokemon: pokemonReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
