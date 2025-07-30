import { configureStore } from '@reduxjs/toolkit';
import giftCardReducer from './giftCardSlice';
import { RootState } from '../types/giftCard';

// Configure Redux store with gift card reducer
// Disable serializable check for persist actions to avoid warnings
export const store = configureStore({
  reducer: {
    giftCards: giftCardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

// Export typed hooks for use throughout the app
export type AppDispatch = typeof store.dispatch;
export type AppState = RootState; 