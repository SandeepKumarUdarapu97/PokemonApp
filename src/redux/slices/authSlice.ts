import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  displayName: string | null;
  photoURL: string | null;
  email: string | null;
}

interface NotificationData {
  url : string
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  notificationData: NotificationData | null
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  notificationData: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.notificationData = null
    },
    updateNotificationData: (state, action: PayloadAction<NotificationData| null>) => {
      state.notificationData = action.payload
    },
  },
});

export const { login, logout,updateNotificationData } = authSlice.actions;
export default authSlice.reducer;
