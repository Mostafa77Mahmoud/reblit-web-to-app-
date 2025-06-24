
import { Platform } from 'react-native';

export const isWeb = Platform.OS === 'web';
export const isNative = Platform.OS !== 'web';
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

// Expo-compatible storage
export const getStorageItem = async (key: string) => {
  if (isWeb) {
    return localStorage.getItem(key);
  } else {
    const { AsyncStorage } = await import('@react-native-async-storage/async-storage');
    return await AsyncStorage.getItem(key);
  }
};

export const setStorageItem = async (key: string, value: string) => {
  if (isWeb) {
    localStorage.setItem(key, value);
  } else {
    const { AsyncStorage } = await import('@react-native-async-storage/async-storage');
    await AsyncStorage.setItem(key, value);
  }
};
