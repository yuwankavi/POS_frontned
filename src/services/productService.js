
import { productsAPI } from './api';
const OFFLINE_PRODUCTS_KEY = 'offline_products';


export const getProducts = async () => {
  try {
    const products = await productsAPI.getAll();
    
    
    localStorage.setItem(OFFLINE_PRODUCTS_KEY, JSON.stringify(products));
    
    return products;
  } catch (error) {

    
    
    const offlineProducts = localStorage.getItem(OFFLINE_PRODUCTS_KEY);
    if (offlineProducts) {
      return JSON.parse(offlineProducts);
    }
    
    
    return [];
  }
};


export const searchProducts = async (query) => {
  try {
    const response = await productsAPI.search(query);
    return response;
  } catch (error) {

    
    
    const products = await getProducts();
    return products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.sku.toLowerCase().includes(query.toLowerCase())
    );
  }
};


export const updateProductStock = async (productId, newStock) => {
  try {
    const product = await productsAPI.getById(productId);
    const updatedProduct = await productsAPI.update(productId, {
      ...product,
      stock: newStock
    });
    
    return updatedProduct;
  } catch (error) {

    throw error;
  }
};