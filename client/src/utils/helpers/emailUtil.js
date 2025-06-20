export function validateEmail(email) {
  // must be less than 320 characters
  // must be a valid email format
  if (email.length > 320) {
    return false;
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}
