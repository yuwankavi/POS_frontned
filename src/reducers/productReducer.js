// import { SET_PRODUCTS, FILTER_PRODUCTS, SEARCH_PRODUCTS } from '../constants/actionTypes';
// import { products } from '../constants/products';

// const initialState = {
//   allProducts: products,
//   filteredProducts: products,
//   currentCategory: 'all',
//   searchQuery: ''
// };

// export const productReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case SET_PRODUCTS:
//       return {
//         ...state,
//         allProducts: action.payload,
//         filteredProducts: action.payload
//       };
    
//     case FILTER_PRODUCTS:
//       const filteredByCategory = action.payload === 'all' 
//         ? state.allProducts 
//         : state.allProducts.filter(product => product.category === action.payload);
      
//       const filteredBySearch = filteredByCategory.filter(product =>
//         product.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
//         product.sku.toLowerCase().includes(state.searchQuery.toLowerCase())
//       );
      
//       return {
//         ...state,
//         filteredProducts: filteredBySearch,
//         currentCategory: action.payload
//       };
    
//     case SEARCH_PRODUCTS:
//       const searchFiltered = state.allProducts.filter(product =>
//         product.name.toLowerCase().includes(action.payload.toLowerCase()) ||
//         product.sku.toLowerCase().includes(action.payload.toLowerCase())
//       );
      
//       const categoryFiltered = state.currentCategory === 'all'
//         ? searchFiltered
//         : searchFiltered.filter(product => product.category === state.currentCategory);
      
//       return {
//         ...state,
//         filteredProducts: categoryFiltered,
//         searchQuery: action.payload
//       };
    
//     default:
//       return state;
//   }
// };




// productReducer.js
import { SET_PRODUCTS, FILTER_PRODUCTS, SEARCH_PRODUCTS } from '../constants/actionTypes';
import { products } from '../constants/products';

const initialState = {
  allProducts: products,
  filteredProducts: products,
  currentCategory: 'all',
  searchQuery: ''
};

export const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PRODUCTS:
      return {
        ...state,
        allProducts: action.payload,
        filteredProducts: action.payload
      };
    
    case FILTER_PRODUCTS:
      let filteredByCategory;
      
      if (action.payload === 'all') {
        filteredByCategory = state.allProducts;
      } else if (action.payload.includes('_')) {
        // Handle subcategory filtering (format: category_subcategory)
        const [category, subCategory] = action.payload.split('_');
        filteredByCategory = state.allProducts.filter(product => 
          product.category === category && product.subCategory === subCategory
        );
      } else {
        // Handle main category filtering
        filteredByCategory = state.allProducts.filter(product => product.category === action.payload);
      }
      
      const filteredBySearch = filteredByCategory.filter(product =>
        product.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        (product.barcode && product.barcode.toLowerCase().includes(state.searchQuery.toLowerCase()))
      );
      
      return {
        ...state,
        filteredProducts: filteredBySearch,
        currentCategory: action.payload
      };
    
    case SEARCH_PRODUCTS:
      const searchFiltered = state.allProducts.filter(product =>
        product.name.toLowerCase().includes(action.payload.toLowerCase()) ||
        product.sku.toLowerCase().includes(action.payload.toLowerCase()) ||
        (product.barcode && product.barcode.toLowerCase().includes(action.payload.toLowerCase()))
      );
      
      let categoryFiltered;
      
      if (state.currentCategory === 'all') {
        categoryFiltered = searchFiltered;
      } else if (state.currentCategory.includes('_')) {
         
        const [category, subCategory] = state.currentCategory.split('_');
        categoryFiltered = searchFiltered.filter(product => 
          product.category === category && product.subCategory === subCategory
        );
      } else {
         
        categoryFiltered = searchFiltered.filter(product => product.category === state.currentCategory);
      }
      
      return {
        ...state,
        filteredProducts: categoryFiltered,
        searchQuery: action.payload
      };
    
    default:
      return state;
  }
};