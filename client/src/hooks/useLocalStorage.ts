import { useState, useEffect } from 'react';
import localforage from 'localforage';

// Configure localforage for better performance
localforage.config({
  driver: [localforage.INDEXEDDB, localforage.WEBSQL, localforage.LOCALSTORAGE],
  name: 'ShariaaAnalyzer',
  version: 1.0,
  size: 4980736,
  storeName: 'shariaa_data',
  description: 'Shariaa Analyzer offline storage'
});

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => Promise<void>, boolean] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial value from storage
  useEffect(() => {
    const loadStoredValue = async () => {
      try {
        const item = await localforage.getItem<T>(key);
        if (item !== null) {
          setStoredValue(item);
        }
      } catch (error) {
        console.error(`Error loading ${key} from storage:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredValue();
  }, [key]);

  // Save value to storage
  const setValue = async (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      await localforage.setItem(key, valueToStore);
    } catch (error) {
      console.error(`Error saving ${key} to storage:`, error);
    }
  };

  return [storedValue, setValue, isLoading];
}

// Contract storage interface
export interface StoredContract {
  id: string;
  title: string;
  content: string;
  type: string;
  dateCreated: string;
  dateModified: string;
  analysisResult?: any;
  tags: string[];
  thumbnail?: string;
}

// Analysis result storage interface
export interface StoredAnalysisResult {
  id: string;
  contractId: string;
  result: any;
  timestamp: string;
  processingTime: number;
  version: string;
}

// Custom hooks for specific data types
export function useStoredContracts() {
  return useLocalStorage<StoredContract[]>('contracts', []);
}

export function useStoredAnalysisResults() {
  return useLocalStorage<StoredAnalysisResult[]>('analysisResults', []);
}

export function useUserPreferences() {
  return useLocalStorage('userPreferences', {
    theme: 'system',
    language: 'en',
    notifications: true,
    autoSave: true,
    cameraPermission: false
  });
}

// Utility functions for contract management
export const contractStorage = {
  async saveContract(contract: StoredContract): Promise<void> {
    try {
      const contracts = await localforage.getItem<StoredContract[]>('contracts') || [];
      const existingIndex = contracts.findIndex(c => c.id === contract.id);
      
      if (existingIndex >= 0) {
        contracts[existingIndex] = { ...contract, dateModified: new Date().toISOString() };
      } else {
        contracts.push(contract);
      }
      
      await localforage.setItem('contracts', contracts);
    } catch (error) {
      console.error('Error saving contract:', error);
      throw error;
    }
  },

  async getContract(id: string): Promise<StoredContract | null> {
    try {
      const contracts = await localforage.getItem<StoredContract[]>('contracts') || [];
      return contracts.find(c => c.id === id) || null;
    } catch (error) {
      console.error('Error getting contract:', error);
      return null;
    }
  },

  async deleteContract(id: string): Promise<void> {
    try {
      const contracts = await localforage.getItem<StoredContract[]>('contracts') || [];
      const filteredContracts = contracts.filter(c => c.id !== id);
      await localforage.setItem('contracts', filteredContracts);
      
      // Also delete associated analysis results
      const results = await localforage.getItem<StoredAnalysisResult[]>('analysisResults') || [];
      const filteredResults = results.filter(r => r.contractId !== id);
      await localforage.setItem('analysisResults', filteredResults);
    } catch (error) {
      console.error('Error deleting contract:', error);
      throw error;
    }
  },

  async searchContracts(query: string): Promise<StoredContract[]> {
    try {
      const contracts = await localforage.getItem<StoredContract[]>('contracts') || [];
      const lowercaseQuery = query.toLowerCase();
      
      return contracts.filter(contract =>
        contract.title.toLowerCase().includes(lowercaseQuery) ||
        contract.content.toLowerCase().includes(lowercaseQuery) ||
        contract.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      );
    } catch (error) {
      console.error('Error searching contracts:', error);
      return [];
    }
  },

  async getStorageInfo(): Promise<{ used: number; total: number; contracts: number; results: number }> {
    try {
      const contracts = await localforage.getItem<StoredContract[]>('contracts') || [];
      const results = await localforage.getItem<StoredAnalysisResult[]>('analysisResults') || [];
      
      // Estimate storage usage (rough calculation)
      const contractsSize = JSON.stringify(contracts).length;
      const resultsSize = JSON.stringify(results).length;
      const totalUsed = contractsSize + resultsSize;
      
      return {
        used: totalUsed,
        total: 50 * 1024 * 1024, // 50MB estimated limit
        contracts: contracts.length,
        results: results.length
      };
    } catch (error) {
      console.error('Error getting storage info:', error);
      return { used: 0, total: 0, contracts: 0, results: 0 };
    }
  },

  async clearAllData(): Promise<void> {
    try {
      await localforage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }
};

export default useLocalStorage;