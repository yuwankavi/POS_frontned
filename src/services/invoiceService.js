
import { transactionsAPI } from './api';
const OFFLINE_TRANSACTIONS_KEY = 'offline_transactions';


export const createTransaction = async (transactionData) => {
  try {
    const transaction = await transactionsAPI.create(transactionData);
    return transaction;
  } catch (error) {

    const offlineTransactions = JSON.parse(
      localStorage.getItem(OFFLINE_TRANSACTIONS_KEY) || '[]'
    );
    
    const transactionWithId = {
      ...transactionData,
      id: `offline_${Date.now()}`,
      synced: false,
      createdAt: new Date().toISOString()
    };
    
    offlineTransactions.push(transactionWithId);
    localStorage.setItem(OFFLINE_TRANSACTIONS_KEY, JSON.stringify(offlineTransactions));
    
    return transactionWithId;
  }
};


export const getTransactionHistory = async () => {
  try {
    const transactions = await transactionsAPI.getAll();
    return transactions;
  } catch (error) {

    
    
    const offlineTransactions = localStorage.getItem(OFFLINE_TRANSACTIONS_KEY);
    if (offlineTransactions) {
      return JSON.parse(offlineTransactions);
    }
    
    return [];
  }
};


export const syncOfflineTransactions = async () => {
  const offlineTransactions = JSON.parse(
    localStorage.getItem(OFFLINE_TRANSACTIONS_KEY) || '[]'
  );
  
  const unsyncedTransactions = offlineTransactions.filter(t => !t.synced);
  
  if (unsyncedTransactions.length === 0) {
    return { success: true, synced: 0 };
  }
  
  let syncedCount = 0;
  
  for (const transaction of unsyncedTransactions) {
    try {
      await transactionsAPI.create(transaction);
      transaction.synced = true;
      syncedCount++;
    } catch (error) {

    }
  }
  
  
  localStorage.setItem(OFFLINE_TRANSACTIONS_KEY, JSON.stringify(offlineTransactions));
  
  return { success: true, synced: syncedCount };
};


export const generateSalesReport = async (startDate, endDate) => {
  try {
    const report = await transactionsAPI.getReports(startDate, endDate);
    return report;
  } catch (error) {

    
    
    const transactions = await getTransactionHistory();
    const filteredTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.createdAt || t.date);
      return transactionDate >= new Date(startDate) && transactionDate <= new Date(endDate);
    });
    
    
    const totalSales = filteredTransactions.reduce((sum, t) => sum + t.total, 0);
    const transactionCount = filteredTransactions.length;
    const averageSale = transactionCount > 0 ? totalSales / transactionCount : 0;
    
    
    const productSales = {};
    filteredTransactions.forEach(t => {
      t.items.forEach(item => {
        if (!productSales[item.id]) {
          productSales[item.id] = { ...item, quantity: 0, revenue: 0 };
        }
        productSales[item.id].quantity += item.quantity;
        productSales[item.id].revenue += item.price * item.quantity;
      });
    });
    
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
    
    return {
      totalSales,
      transactionCount,
      averageSale,
      topProducts,
      transactions: filteredTransactions
    };
  }
};