export function formatPhoneNumber(phoneNumber) {
  //given a phone number, format it to (XXX) XXX-XXXX
  if (!phoneNumber) return '';
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phoneNumber; // Return the original if it doesn't match the expected format
}

export function isValidPhoneNumber(phoneNumber) {
  // Check if the phone number is valid
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  return /^\d{10}$/.test(cleaned); // Validates if it contains exactly 10 digits
}
