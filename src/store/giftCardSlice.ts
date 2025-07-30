import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GiftCard, GiftCardState, GiftCardFormData } from '../types/giftCard';

// Storage key for AsyncStorage - keeping it simple for now
const STORAGE_KEY = 'gift_cards';

// Async thunks for CRUD operations
export const loadGiftCards = createAsyncThunk(
  'giftCards/loadGiftCards',
  async () => {
    try {
      const storedCards = await AsyncStorage.getItem(STORAGE_KEY);
      return storedCards ? JSON.parse(storedCards) : [];
    } catch (error) {
      // Log error for debugging but throw user-friendly message
      console.error('Load gift cards error:', error);
      throw new Error('Failed to load gift cards');
    }
  }
);

export const saveGiftCard = createAsyncThunk(
  'giftCards/saveGiftCard',
  async (cardData: GiftCardFormData) => {
    try {
      // Get existing cards from storage
      const storedCards = await AsyncStorage.getItem(STORAGE_KEY);
      const existingCards: GiftCard[] = storedCards ? JSON.parse(storedCards) : [];
      
      // Create new card with generated ID and timestamps
      const newCard: GiftCard = {
        id: Date.now().toString(), // Simple ID generation - could use UUID in production
        ...cardData,
        amount: parseFloat(cardData.amount),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Save updated array back to storage
      const updatedCards = [...existingCards, newCard];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCards));
      
      return newCard;
    } catch (error) {
      console.error('Save gift card error:', error);
      throw new Error('Failed to save gift card');
    }
  }
);

export const updateGiftCard = createAsyncThunk(
  'giftCards/updateGiftCard',
  async ({ id, cardData }: { id: string; cardData: GiftCardFormData }) => {
    try {
      const storedCards = await AsyncStorage.getItem(STORAGE_KEY);
      const existingCards: GiftCard[] = storedCards ? JSON.parse(storedCards) : [];
      
      // Find and update the specific card
      const cardIndex = existingCards.findIndex(card => card.id === id);
      if (cardIndex === -1) {
        throw new Error('Gift card not found');
      }
      
      const updatedCard: GiftCard = {
        ...existingCards[cardIndex],
        ...cardData,
        amount: parseFloat(cardData.amount),
        updatedAt: new Date().toISOString(),
      };
      
      existingCards[cardIndex] = updatedCard;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existingCards));
      
      return updatedCard;
    } catch (error) {
      console.error('Update gift card error:', error);
      throw new Error('Failed to update gift card');
    }
  }
);

export const deleteGiftCard = createAsyncThunk(
  'giftCards/deleteGiftCard',
  async (cardId: string) => {
    try {
      const storedCards = await AsyncStorage.getItem(STORAGE_KEY);
      const existingCards: GiftCard[] = storedCards ? JSON.parse(storedCards) : [];
      
      // Filter out the card to delete
      const updatedCards = existingCards.filter(card => card.id !== cardId);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCards));
      
      return cardId;
    } catch (error) {
      console.error('Delete gift card error:', error);
      throw new Error('Failed to delete gift card');
    }
  }
);

// Initial state for the slice
const initialState: GiftCardState = {
  cards: [],
  loading: false,
  error: null,
};

const giftCardSlice = createSlice({
  name: 'giftCards',
  initialState,
  reducers: {
    // Clear any error state - useful for dismissing error messages
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load gift cards cases
      .addCase(loadGiftCards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadGiftCards.fulfilled, (state, action: PayloadAction<GiftCard[]>) => {
        state.loading = false;
        state.cards = action.payload;
      })
      .addCase(loadGiftCards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load gift cards';
      })
      // Save gift card cases
      .addCase(saveGiftCard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveGiftCard.fulfilled, (state, action: PayloadAction<GiftCard>) => {
        state.loading = false;
        state.cards.push(action.payload);
      })
      .addCase(saveGiftCard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to save gift card';
      })
      // Update gift card cases
      .addCase(updateGiftCard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGiftCard.fulfilled, (state, action: PayloadAction<GiftCard>) => {
        state.loading = false;
        // Find and update the card in the array
        const index = state.cards.findIndex(card => card.id === action.payload.id);
        if (index !== -1) {
          state.cards[index] = action.payload;
        }
      })
      .addCase(updateGiftCard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update gift card';
      })
      // Delete gift card cases
      .addCase(deleteGiftCard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGiftCard.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        // Remove the card from the array
        state.cards = state.cards.filter(card => card.id !== action.payload);
      })
      .addCase(deleteGiftCard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete gift card';
      });
  },
});

export const { clearError } = giftCardSlice.actions;
export default giftCardSlice.reducer; 