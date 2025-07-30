import {
  formatDate,
  isExpired,
  isExpiringSoon,
  getDaysUntilExpiration,
} from '../dateUtils';

describe('dateUtils', () => {
  describe('formatDate', () => {
    it('formats date correctly', () => {
      const dateString = '2024-12-31';
      const formatted = formatDate(dateString);
      expect(formatted).toBe('Dec 31, 2024');
    });
  });

  describe('isExpired', () => {
    it('returns true for expired dates', () => {
      const pastDate = '2020-01-01';
      expect(isExpired(pastDate)).toBe(true);
    });

    it('returns false for future dates', () => {
      const futureDate = '2030-01-01';
      expect(isExpired(futureDate)).toBe(false);
    });
  });

  describe('isExpiringSoon', () => {
    it('returns true for dates expiring within 30 days', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const expiringDate = tomorrow.toISOString().split('T')[0];
      expect(isExpiringSoon(expiringDate)).toBe(true);
    });

    it('returns false for dates not expiring soon', () => {
      const farFuture = new Date();
      farFuture.setDate(farFuture.getDate() + 60);
      const futureDate = farFuture.toISOString().split('T')[0];
      expect(isExpiringSoon(futureDate)).toBe(false);
    });
  });

  describe('getDaysUntilExpiration', () => {
    it('returns correct number of days', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const expiringDate = tomorrow.toISOString().split('T')[0];
      expect(getDaysUntilExpiration(expiringDate)).toBe(1);
    });
  });
}); 