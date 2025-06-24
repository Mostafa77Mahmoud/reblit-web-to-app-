
// Platform detection that works in both web and Expo environments
export const isWeb = typeof window !== 'undefined' && !window.navigator?.product?.includes('ReactNative');
export const isNative = typeof window !== 'undefined' && window.navigator?.product?.includes('ReactNative');
export const isIOS = isNative && /iPad|iPhone|iPod/.test(navigator.userAgent);
export const isAndroid = isNative && /Android/.test(navigator.userAgent);

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
