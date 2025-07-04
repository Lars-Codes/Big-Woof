import { Linking, Alert } from 'react-native';

export function formatPhoneNumber(phoneNumber) {
  //given a phone number, format it to (XXX) XXX-XXXX or +1 (XXX) XXX-XXXX
  if (!phoneNumber) return '';
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  // Handle 11-digit numbers starting with 1 (US international format)
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    const match = cleaned.match(/^1(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `+1 (${match[1]}) ${match[2]}-${match[3]}`;
    }
  }
  // Handle 10-digit numbers (standard US format)
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }

  return phoneNumber; // Return the original if it doesn't match the expected format
}

export function validatePhoneNumber(phoneNumber) {
  // Validate phone number format (XXX) XXX-XXXX or XXXXXXXXXX, but must be 10 digits if no international code
  // if international format, it can be 11 digits starting with a 1
  if (!phoneNumber) return false;
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  if (
    cleaned.length === 10 ||
    (cleaned.length === 11 && cleaned.startsWith('1'))
  ) {
    return true;
  }
  return false;
}

export const handlePhonePress = (phoneNumber) => {
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  const formattedPhone = formatPhoneNumber(phoneNumber);

  Alert.alert('Contact', formattedPhone, [
    {
      text: 'Call',
      onPress: () => Linking.openURL(`tel:${cleanPhone}`),
    },
    {
      text: 'Text',
      onPress: () => Linking.openURL(`sms:${cleanPhone}`),
    },
    {
      text: 'Cancel',
      style: 'cancel',
    },
  ]);
};
