export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[+]?[1-9]\d{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateCardNumber = (number: string): boolean => {
  const cleaned = number.replace(/\s/g, '');
  if (cleaned.length !== 16) return false;

  // Luhn algorithm
  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i), 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

export const validateExpiryDate = (expiry: string): boolean => {
  const [month, year] = expiry.split('/').map(Number);

  if (!month || !year || month < 1 || month > 12) {
    return false;
  }

  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;

  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;

  return true;
};

export const validateCVV = (cvv: string): boolean => {
  return /^\d{3,4}$/.test(cvv);
};

export const validateRequired = (value: unknown): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  if (typeof value === 'number') {
    return true; // 0 is valid
  }

  if (typeof value === 'boolean') {
    return true;
  }

  return value !== null && value !== undefined;
};
