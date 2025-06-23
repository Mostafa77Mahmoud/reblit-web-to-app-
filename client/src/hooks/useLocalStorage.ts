import { useState, useEffect } from 'react';
import localforage from 'localforage';

// Configure localforage for mobile-optimized storage
localforage.config({
  driver: [localforage.INDEXEDDB, localforage.WEBSQL, localforage.LOCALSTORAGE],
  name: 'ShariaAnalyzer',
  version: 1.0,
  storeName: 'contracts_and_results',
});

export interface StoredContract {
  id: string;
  name: string;
  content: string;
  uploadDate: Date;
  analysisResult?: AnalysisResult;
  thumbnail?: string;
}

export interface AnalysisResult {
  complianceScore: number;
  issues: string[];
  recommendations: string[];
  analysisDate: Date;
}

export const useLocalStorage = () => {
  const [contracts, setContracts] = useState<StoredContract[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadContracts();
  }, []);

  const loadContracts = async () => {
    try {
      const stored = await localforage.getItem<StoredContract[]>('contracts');
      setContracts(stored || []);
    } catch (error) {
      console.error('Error loading contracts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveContract = async (contract: StoredContract) => {
    try {
      const updatedContracts = [...contracts, contract];
      await localforage.setItem('contracts', updatedContracts);
      setContracts(updatedContracts);
      return true;
    } catch (error) {
      console.error('Error saving contract:', error);
      return false;
    }
  };

  const updateContract = async (id: string, updates: Partial<StoredContract>) => {
    try {
      const updatedContracts = contracts.map(contract =>
        contract.id === id ? { ...contract, ...updates } : contract
      );
      await localforage.setItem('contracts', updatedContracts);
      setContracts(updatedContracts);
      return true;
    } catch (error) {
      console.error('Error updating contract:', error);
      return false;
    }
  };

  const deleteContract = async (id: string) => {
    try {
      const updatedContracts = contracts.filter(contract => contract.id !== id);
      await localforage.setItem('contracts', updatedContracts);
      setContracts(updatedContracts);
      return true;
    } catch (error) {
      console.error('Error deleting contract:', error);
      return false;
    }
  };

  const clearAllContracts = async () => {
    try {
      await localforage.clear();
      setContracts([]);
      return true;
    } catch (error) {
      console.error('Error clearing contracts:', error);
      return false;
    }
  };

  return {
    contracts,
    isLoading,
    saveContract,
    updateContract,
    deleteContract,
    clearAllContracts,
  };
};