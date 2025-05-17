import AsyncStorage from '@react-native-async-storage/async-storage';
// import users sign in token or what not

export const setItem = async (key, value) => {
  try {
    // const serializedValue = JSON.stringify(value) + user sign in token to make storage more secure
    const serializedValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error('Error setting item in AsyncStorage:', error);
  }
};

export const getItem = async (key) => {
  try {
    const serializedValue = await AsyncStorage.getItem(key);
    return serializedValue ? JSON.parse(serializedValue) : null;
  } catch (error) {
    console.error('Error getting item from AsyncStorage:', error);
    return null;
  }
};

export const removeItem = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing item from AsyncStorage:', error);
  }
};
