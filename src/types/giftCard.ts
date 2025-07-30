/**
 * Core gift card data structure
 * Represents a single gift card with all its properties
 */
export interface GiftCard {
  id: string;                    // Unique identifier for the card
  brand: string;                 // Brand/company name (e.g., "Amazon", "Starbucks")
  amount: number;                // Card balance amount
  currency: string;              // Currency code (e.g., "USD", "EUR")
  expirationDate: string;        // Expiration date in ISO format or DD-MM-YYYY
  cardNumber?: string;           // Optional card number for reference
  pin?: string;                  // Optional PIN for the card
  notes?: string;                // Optional user notes
  createdAt: string;             // ISO timestamp when card was created
  updatedAt: string;             // ISO timestamp when card was last updated
}

/**
 * Currency information for display and formatting
 * Used in currency picker and formatting utilities
 */
export interface Currency {
  code: string;                  // Currency code (e.g., "USD")
  name: string;                  // Full currency name (e.g., "US Dollar")
  symbol: string;                // Currency symbol (e.g., "$")
  flag: string;                  // Country flag emoji
}

/**
 * Form data structure for adding/editing gift cards
 * Uses string for amount to handle form input validation
 */
export interface GiftCardFormData {
  brand: string;                 // Brand name
  amount: string;                // Amount as string (for form validation)
  currency: string;              // Currency code
  expirationDate: string;        // Expiration date
  cardNumber?: string;           // Optional card number
  pin?: string;                  // Optional PIN
  notes?: string;                // Optional notes
}

/**
 * Redux state structure for gift cards
 * Manages the list of cards, loading state, and error handling
 */
export interface GiftCardState {
  cards: GiftCard[];             // Array of all gift cards
  loading: boolean;              // Loading state for async operations
  error: string | null;          // Error message if operation fails
}

/**
 * Root Redux state type
 * Currently only contains giftCards slice
 */
export interface RootState {
  giftCards: GiftCardState;
} 