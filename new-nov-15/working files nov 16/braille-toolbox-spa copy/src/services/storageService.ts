import { useEffect } from 'react';

const STORAGE_KEY = 'brailleToolboxData';

const storageService = {
  saveData: (data: any) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },
  
  loadData: () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  },
  
  clearData: () => {
    localStorage.removeItem(STORAGE_KEY);
  },
  
  updateData: (newData: any) => {
    const currentData = storageService.loadData();
    const updatedData = { ...currentData, ...newData };
    storageService.saveData(updatedData);
  }
};

export default storageService;