import AsyncStorage from '@react-native-async-storage/async-storage';

// Polyfill localStorage and sessionStorage for React Native using AsyncStorage
class AsyncStoragePolyfill {
  async getItem(key) {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('AsyncStorage getItem error:', error);
      return null;
    }
  }

  async setItem(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('AsyncStorage setItem error:', error);
    }
  }

  async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('AsyncStorage removeItem error:', error);
    }
  }

  async clear() {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('AsyncStorage clear error:', error);
    }
  }
}

// Create synchronous-like interface
const storage = new AsyncStoragePolyfill();

// Initialize polyfill for localStorage and sessionStorage
export function initializeLocalStoragePolyfill() {
  if (typeof window !== 'undefined' && !window.localStorage) {
    // Create mock localStorage with async operations internally
    window.localStorage = {
      getItem: (key) => {
        // Return cached value synchronously or null if not available
        return storage._cache?.[key] || null;
      },
      setItem: (key, value) => {
        // Cache value immediately for sync access
        if (!storage._cache) storage._cache = {};
        storage._cache[key] = value;
        // Persist asynchronously
        storage.setItem(key, value);
      },
      removeItem: (key) => {
        if (storage._cache) delete storage._cache[key];
        storage.removeItem(key);
      },
      clear: () => {
        storage._cache = {};
        storage.clear();
      }
    };

    window.sessionStorage = window.localStorage;
  }
}

// Initialize cache from AsyncStorage
export async function loadStorageCache() {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cache = {};
    
    for (const key of keys) {
      const value = await AsyncStorage.getItem(key);
      if (value) cache[key] = value;
    }
    
    if (storage._cache === undefined) storage._cache = {};
    Object.assign(storage._cache, cache);
    
    return cache;
  } catch (error) {
    console.error('Failed to load storage cache:', error);
    return {};
  }
}

// Direct async storage interface
export { storage as asyncStorage };