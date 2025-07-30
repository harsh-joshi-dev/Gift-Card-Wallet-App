/**
 * Format a date string to a readable format (e.g., "Dec 31, 2024")
 * Handles multiple date formats including DD-MM-YYYY and ISO strings
 * @param dateString - The date string to format
 * @returns Formatted date string or empty string if invalid
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  // Handle DD-MM-YYYY format specifically
  if (dateString.match(/^\d{2}-\d{2}-\d{4}$/)) {
    const parsedDate = parseDateDDMMYYYY(dateString);
    if (parsedDate) {
      return parsedDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
  }
  
  // Handle ISO strings and other date formats
  const date = new Date(dateString);
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  
  // Use UTC methods to avoid timezone issues for ISO strings
  if (dateString.includes('T') && dateString.includes('Z')) {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Check if a date has expired (is in the past)
 * Handles multiple date formats and timezone issues
 * @param dateString - The date string to check
 * @returns True if the date has expired
 */
export const isExpired = (dateString: string): boolean => {
  if (!dateString) return false;
  
  // Handle DD-MM-YYYY format
  if (dateString.match(/^\d{2}-\d{2}-\d{4}$/)) {
    const parsedDate = parseDateDDMMYYYY(dateString);
    if (!parsedDate) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    parsedDate.setHours(0, 0, 0, 0);
    
    return parsedDate < today;
  }
  
  // Handle ISO strings and other formats
  const expirationDate = new Date(dateString);
  if (isNaN(expirationDate.getTime())) return false;
  
  // Use UTC for ISO strings to avoid timezone issues
  if (dateString.includes('T') && dateString.includes('Z')) {
    const today = new Date();
    const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    const expirationUTC = new Date(Date.UTC(expirationDate.getUTCFullYear(), expirationDate.getUTCMonth(), expirationDate.getUTCDate()));
    return expirationUTC < todayUTC;
  }
  
  const today = new Date();
  return expirationDate < today;
};

/**
 * Check if a date is expiring within a specified number of days
 * @param dateString - The date string to check
 * @param daysThreshold - Number of days threshold (default: 30)
 * @returns True if expiring within the threshold
 */
export const isExpiringSoon = (dateString: string, daysThreshold: number = 30): boolean => {
  if (!dateString) return false;
  
  // Handle DD-MM-YYYY format
  if (dateString.match(/^\d{2}-\d{2}-\d{4}$/)) {
    const parsedDate = parseDateDDMMYYYY(dateString);
    if (!parsedDate) return false;
    
    const today = new Date();
    const thresholdDate = new Date();
    thresholdDate.setDate(today.getDate() + daysThreshold);
    
    // Reset time to start of day for accurate comparison
    today.setHours(0, 0, 0, 0);
    thresholdDate.setHours(0, 0, 0, 0);
    parsedDate.setHours(0, 0, 0, 0);
    
    return parsedDate <= thresholdDate && parsedDate > today;
  }
  
  // Handle ISO strings and other formats
  const expirationDate = new Date(dateString);
  if (isNaN(expirationDate.getTime())) return false;
  
  const today = new Date();
  const thresholdDate = new Date();
  thresholdDate.setDate(today.getDate() + daysThreshold);
  
  return expirationDate <= thresholdDate && expirationDate > today;
};

/**
 * Calculate the number of days until a date expires
 * @param dateString - The date string to calculate from
 * @returns Number of days until expiration (negative if already expired)
 */
export const getDaysUntilExpiration = (dateString: string): number => {
  if (!dateString) return 0;
  
  // Handle DD-MM-YYYY format
  if (dateString.match(/^\d{2}-\d{2}-\d{4}$/)) {
    const parsedDate = parseDateDDMMYYYY(dateString);
    if (!parsedDate) return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    parsedDate.setHours(0, 0, 0, 0);
    
    const diffTime = parsedDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  
  // Handle ISO strings and other formats
  const expirationDate = new Date(dateString);
  if (isNaN(expirationDate.getTime())) return 0;
  
  const today = new Date();
  const diffTime = expirationDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Format a date to DD-MM-YYYY format
 * @param dateString - The date string to format
 * @returns Date in DD-MM-YYYY format
 */
export const formatDateDDMMYYYY = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

/**
 * Parse a DD-MM-YYYY formatted string to a Date object
 * Includes validation to ensure the date is valid
 * @param dateString - The date string in DD-MM-YYYY format
 * @returns Date object or null if invalid
 */
export const parseDateDDMMYYYY = (dateString: string): Date | null => {
  if (!dateString) return null;
  
  const parts = dateString.split('-');
  if (parts.length !== 3) return null;
  
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed in Date constructor
  const year = parseInt(parts[2], 10);
  
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  
  // Create date in local timezone to avoid timezone issues
  const date = new Date(year, month, day, 0, 0, 0, 0);
  
  // Validate that the date was created correctly (handles edge cases like Feb 30)
  if (date.getDate() !== day || date.getMonth() !== month || date.getFullYear() !== year) {
    return null;
  }
  
  return date;
}; 