import * as actionTypes from '../../constants/POS/productConstants';
import { productService } from '../../services/POS/ProductService';
 
 

// export const fetchProducts = () => async (dispatch) => {
//   dispatch({ type: actionTypes.FETCH_PRODUCTS_REQUEST });
//   try {
//     const products = await productService.getAllProducts();
//     const formattedProducts = await Promise.all(
//       products.map(async (product) => {
//         const imageUrl = await productService.getProductImage(product.IMAGEURL);
//         return {
//           id: product.PPROCODE,
//           name: product.P_DESC,
//           price: parseFloat(product.PSELLPRICE) || 0, 
//           discountType: product.Dis_Type,
//           discountValue: parseFloat(product.Dis_Value) || 0,
//           discountedPrice: parseFloat(product.Dis_APrice) || parseFloat(product.PSELLPRICE) || 0,
//           markedPrice: parseFloat(product.PMarkedPRICE) || parseFloat(product.PSELLPRICE) || 0,
//           category: product.P_TYP || 'Uncategorized',
//           subCategory: product.Sub_CatID,
//           stock: parseFloat(product.P_BALQTY) || 0,
//           sku: product.P_SKU,
//           barcode:  product.P_BarCode || product.P_SKU,
//           image: imageUrl,
//           Whcode: product.PWHCODE,
//         };
//       })
//     );

//     dispatch({
//       type: actionTypes.FETCH_PRODUCTS_SUCCESS,
//       payload: formattedProducts
//     });
//   } catch (error) {
//     dispatch({
//       type: actionTypes.FETCH_PRODUCTS_FAILURE,
//       payload: error.message
//     });
//   }
// };



export const fetchProducts = () => async (dispatch) => {
  dispatch({ type: actionTypes.FETCH_PRODUCTS_REQUEST });
  try {
    const products = await productService.getAllProducts();
    
 
    const formattedProducts = await Promise.all(
      products.map(async (product) => {
        const imageUrl = await productService.getProductImage(product.IMAGEURL);
        
      
        const hasMultipleBatches = product.BatchDetailsModel && product.BatchDetailsModel.length > 1;
        const firstBatch = product.BatchDetailsModel?.[0];
        
        return {
          id: product.PPROCODE, 
          productId: product.PPROCODE,
          name: product.P_DESC,
          price: parseFloat(firstBatch?.PSELLPRICE || product.PSELLPRICE) || 0,
          discountType: firstBatch?.PromoModel?.[0]?.Dis_Type || product.Dis_Type,
          discountValue: parseFloat(firstBatch?.PromoModel?.[0]?.Dis_Value || product.Dis_Value) || 0,
          discountedPrice: parseFloat(firstBatch?.ActualSellPrice || product.Dis_APrice || product.PSELLPRICE) || 0,
          markedPrice: parseFloat(firstBatch?.PMarkedPRICE || product.PMarkedPRICE || product.PSELLPRICE) || 0,
          category: product.P_TYP || 'Uncategorized',
          subCategory: product.Sub_CatID,
          stock: parseFloat(product.Total_BLQTY) || 0, 
          sku: product.P_SKU,
          barcode: product.P_BarCode || product.P_SKU,
          image: imageUrl,
          Whcode: firstBatch?.PWHCODE || product.PWHCODE,
          hasMultipleBatches: hasMultipleBatches,
          totalBatches: product.BatchDetailsModel?.length || 1,
          allBatches: product.BatchDetailsModel?.map((batch, index) => ({
            id: `${product.PPROCODE}_B${batch.PBATID}`,
            productId: product.PPROCODE,
            batchId: batch.PBATID,
            name: product.P_DESC,
            price: parseFloat(batch.PSELLPRICE) || 0,
            discountType: batch.PromoModel?.[0]?.Dis_Type || null,
            discountValue: parseFloat(batch.PromoModel?.[0]?.Dis_Value) || 0,
            discountedPrice: parseFloat(batch.ActualSellPrice) || parseFloat(batch.PSELLPRICE) || 0,
            markedPrice: parseFloat(batch.PMarkedPRICE) || parseFloat(batch.PSELLPRICE) || 0,
            stock: parseFloat(batch.P_BALQTY) || 0,
            sku: product.P_SKU,
            barcode: product.P_BarCode || product.P_SKU,
            image: imageUrl,
            Whcode: batch.PWHCODE,
            expiryDate: batch.PEXDATE,
            batchDetails: batch,
            isBatchProduct: true
          })) || [],
          originalProduct: product
        };
      })
    );

    dispatch({
      type: actionTypes.FETCH_PRODUCTS_SUCCESS,
      payload: formattedProducts
    });
  } catch (error) {
    dispatch({
      type: actionTypes.FETCH_PRODUCTS_FAILURE,
      payload: error.message
    });
  }
};


export const fetchCategories = () => async (dispatch) => {
  dispatch({ type: actionTypes.FETCH_CATEGORIES_REQUEST });
  try {
    const categories = await productService.getAllCategories();
    const formattedCategories = categories.map(cat => ({
      id: cat.Main_CatID,
      label: cat.Main_CatName,
      icon: getCategoryIcon(cat.Main_CatName),
      subcategories: []
    }));
    formattedCategories.unshift({
      id: 'all',
      icon: 'fas fa-boxes',
      label: 'All Products',
      subcategories: []
    });

    dispatch({
      type: actionTypes.FETCH_CATEGORIES_SUCCESS,
      payload: formattedCategories
    });
  } catch (error) {
    dispatch({
      type: actionTypes.FETCH_CATEGORIES_FAILURE,
      payload: error.message
    });
  }
};

export const fetchSubcategories = (mainId) => async (dispatch) => {
  if (mainId === 'all') return;
  dispatch({ type: actionTypes.FETCH_SUBCATEGORIES_REQUEST });
  try {
    const subcategories = await productService.getSubcategoriesByMainId(mainId);
    const formattedSubcategories = subcategories.map(sub => ({
      id: sub.Sub_CatID,
      label: sub.Sub_CatName
    }));
    dispatch({
      type: actionTypes.FETCH_SUBCATEGORIES_SUCCESS,
      payload: { mainId, subcategories: formattedSubcategories }
    });
  } catch (error) {
    dispatch({
      type: actionTypes.FETCH_SUBCATEGORIES_FAILURE,
      payload: error.message
    });
  }
};
 
// export const fetchProductsBySubcategory = (subId) => async (dispatch) => {
//   try {
//     const products = await productService.getProductsBySubId(subId);
//     const formattedProducts = await Promise.all(
//       products.map(async (product) => {
//         const imageUrl = await productService.getProductImage(product.IMAGEURL);
//         return {
//           id: product.PPROCODE,
//           name: product.P_DESC,
//           price: parseFloat(product.PSELLPRICE) || 0,
//           category: product.P_TYP || 'Uncategorized',
//           subCategory: product.Sub_CatID,
//           Whcode: product.PWHCODE,
//           stock: parseFloat(product.P_BALQTY) || 0,
//           sku: product.P_SKU,
//           barcode:  product.P_BarCode || product.P_SKU,
//           image: imageUrl,
//         };
//       })
//     );
//     dispatch({
//       type: actionTypes.SET_PRODUCTS,
//       payload: formattedProducts
//     });
//   } catch (error) {

//   }
// };



export const fetchProductsBySubcategory = (subId) => async (dispatch) => {
  try {
    const products = await productService.getProductsBySubId(subId);
    const formattedProducts = await Promise.all(
      products.map(async (product) => {
        const imageUrl = await productService.getProductImage(product.IMAGEURL);
        
        const hasMultipleBatches = product.BatchDetailsModel && product.BatchDetailsModel.length > 1;
        const firstBatch = product.BatchDetailsModel?.[0];
        
        return {
          id: product.PPROCODE,
          productId: product.PPROCODE,
          name: product.P_DESC,
          price: parseFloat(firstBatch?.PSELLPRICE || product.PSELLPRICE) || 0,
          discountType: firstBatch?.PromoModel?.[0]?.Dis_Type || product.Dis_Type,
          discountValue: parseFloat(firstBatch?.PromoModel?.[0]?.Dis_Value || product.Dis_Value) || 0,
          discountedPrice: parseFloat(firstBatch?.ActualSellPrice || product.Dis_APrice || product.PSELLPRICE) || 0,
          markedPrice: parseFloat(firstBatch?.PMarkedPRICE || product.PMarkedPRICE || product.PSELLPRICE) || 0,
          category: product.P_TYP || 'Uncategorized',
          subCategory: product.Sub_CatID,
          stock: parseFloat(product.Total_BLQTY) || 0,
          sku: product.P_SKU,
          barcode: product.P_BarCode || product.P_SKU,
          image: imageUrl,
          Whcode: firstBatch?.PWHCODE || product.PWHCODE,
          hasMultipleBatches: hasMultipleBatches,
          totalBatches: product.BatchDetailsModel?.length || 1,
          allBatches: product.BatchDetailsModel?.map((batch, index) => ({
            id: `${product.PPROCODE}_B${batch.PBATID}`,
            productId: product.PPROCODE,
            batchId: batch.PBATID,
            name: product.P_DESC,
            price: parseFloat(batch.PSELLPRICE) || 0,
            discountType: batch.PromoModel?.[0]?.Dis_Type || null,
            discountValue: parseFloat(batch.PromoModel?.[0]?.Dis_Value) || 0,
            discountedPrice: parseFloat(batch.ActualSellPrice) || parseFloat(batch.PSELLPRICE) || 0,
            markedPrice: parseFloat(batch.PMarkedPRICE) || parseFloat(batch.PSELLPRICE) || 0,
            stock: parseFloat(batch.P_BALQTY) || 0,
            sku: product.P_SKU,
            barcode: product.P_BarCode || product.P_SKU,
            image: imageUrl,
            Whcode: batch.PWHCODE,
            expiryDate: batch.PEXDATE,
            batchDetails: batch,
            isBatchProduct: true
          })) || [],
          originalProduct: product
        };
      })
    );
    
    dispatch({
      type: actionTypes.SET_PRODUCTS,
      payload: formattedProducts
    });
  } catch (error) {
  }
};






export const filterProducts = (categoryId) => ({
  type: actionTypes.FILTER_PRODUCTS,
  payload: categoryId
});
export const searchProducts = (query) => ({
  type: actionTypes.SEARCH_PRODUCTS,
  payload: query
});
export const setCurrentCategory = (categoryId) => ({
  type: actionTypes.SET_CURRENT_CATEGORY,
  payload: categoryId
});
export const setCurrentSubcategory = (subcategoryId) => ({
  type: actionTypes.SET_CURRENT_SUBCATEGORY,
  payload: subcategoryId
});
const getCategoryIcon = (categoryName) => {
  const iconMap = {
    'electronics': 'fas fa-microchip',
    'computers': 'fas fa-laptop',
    'phones': 'fas fa-mobile-alt',
    'accessories': 'fas fa-headphones',
    'components': 'fas fa-microchip',
  };
  const lowerName = categoryName.toLowerCase();
  return iconMap[lowerName] || 'fas fa-box';
};
 
export const refreshProducts = () => ({
  type: actionTypes.REFRESH_PRODUCTS
});