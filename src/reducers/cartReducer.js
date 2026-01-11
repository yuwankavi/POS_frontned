// import { 
//   ADD_TO_CART, 
//   REMOVE_FROM_CART, 
//   UPDATE_QUANTITY, 
//   CLEAR_CART, 
//   APPLY_DISCOUNT,
//   ADD_TAB,
//   REMOVE_TAB,
//   SWITCH_TAB,
//   RENAME_TAB
// } from '../constants/actionTypes';

// const initialState = {
//   tabs: [
//     {
//       id: 'tab-1',
//       name: 'Current Sale 1',
//       items: [],
//       discount: 0,
//       discountType: 'percent',
//       active: true
//     }
//   ],
//   activeTabId: 'tab-1',
//   nextTabNumber: 2
// };

// export const cartReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case ADD_TO_CART:
//       return {
//         ...state,
//         tabs: state.tabs.map(tab => {
//           if (tab.id === state.activeTabId) {
//             const existingItem = tab.items.find(item => item.id === action.payload.id);
            
//             if (existingItem) {
//               return {
//                 ...tab,
//                 items: tab.items.map(item =>
//                   item.id === action.payload.id
//                     ? { ...item, quantity: item.quantity + 1 }
//                     : item
//                 )
//               };
//             } else {
//               return {
//                 ...tab,
//                 items: [...tab.items, { ...action.payload, quantity: 1 }]
//               };
//             }
//           }
//           return tab;
//         })
//       };
    
//     case REMOVE_FROM_CART:
//       return {
//         ...state,
//         tabs: state.tabs.map(tab => {
//           if (tab.id === state.activeTabId) {
//             return {
//               ...tab,
//               items: tab.items.filter(item => item.id !== action.payload)
//             };
//           }
//           return tab;
//         })
//       };
    
//     case UPDATE_QUANTITY:
//       return {
//         ...state,
//         tabs: state.tabs.map(tab => {
//           if (tab.id === state.activeTabId) {
//             return {
//               ...tab,
//               items: tab.items.map(item =>
//                 item.id === action.payload.id
//                   ? { ...item, quantity: action.payload.quantity }
//                   : item
//               )
//             };
//           }
//           return tab;
//         })
//       };
    
//     case CLEAR_CART:
//       return {
//         ...state,
//         tabs: state.tabs.map(tab => {
//           if (tab.id === state.activeTabId) {
//             return {
//               ...tab,
//               items: [],
//               discount: 0
//             };
//           }
//           return tab;
//         })
//       };
    
//     case APPLY_DISCOUNT:
//       return {
//         ...state,
//         tabs: state.tabs.map(tab => {
//           if (tab.id === state.activeTabId) {
//             return {
//               ...tab,
//               discount: action.payload.amount,
//               discountType: action.payload.type
//             };
//           }
//           return tab;
//         })
//       };
    
//     case ADD_TAB:
//       const newTabNumber = state.nextTabNumber;
//       const newTabId = `tab-${newTabNumber}`;
      
//       return {
//         ...state,
//         tabs: [
//           ...state.tabs.map(tab => ({ ...tab, active: false })),
//           {
//             id: newTabId,
//             name: `Current Sale ${newTabNumber}`,
//             items: [],
//             discount: 0,
//             discountType: 'percent',
//             active: true
//           }
//         ],
//         activeTabId: newTabId,
//         nextTabNumber: newTabNumber + 1
//       };
    
//     case REMOVE_TAB:
//       const remainingTabs = state.tabs.filter(tab => tab.id !== action.payload);
      
//       // If we're removing the active tab, activate the first remaining tab
//       let newActiveTabId = state.activeTabId;
//       if (action.payload === state.activeTabId && remainingTabs.length > 0) {
//         newActiveTabId = remainingTabs[0].id;
//         remainingTabs[0].active = true;
//       }
      
//       return {
//         ...state,
//         tabs: remainingTabs,
//         activeTabId: newActiveTabId
//       };
    
//     case SWITCH_TAB:
//       return {
//         ...state,
//         tabs: state.tabs.map(tab => ({
//           ...tab,
//           active: tab.id === action.payload
//         })),
//         activeTabId: action.payload
//       };
    
//     case RENAME_TAB:
//       return {
//         ...state,
//         tabs: state.tabs.map(tab =>
//           tab.id === action.payload.tabId
//             ? { ...tab, name: action.payload.newName }
//             : tab
//         )
//       };
    
//     default:
//       return state;
//   }
// };




import { 
  ADD_TO_CART, 
  REMOVE_FROM_CART, 
  UPDATE_QUANTITY, 
  CLEAR_CART, 
  APPLY_DISCOUNT,
  ADD_TAB,
  REMOVE_TAB,
  SWITCH_TAB,
  RENAME_TAB
} from '../constants/actionTypes';

const initialState = {
  tabs: [
    {
      id: 'tab-1',
      name: 'Current Sale 1',
      items: [],
      discount: 0,
      discountType: 'percent',
      active: true
    }
  ],
  activeTabId: 'tab-1',
  nextTabNumber: 2
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      return {
        ...state,
        tabs: state.tabs.map(tab => {
          if (tab.id === state.activeTabId) {
            const existingItem = tab.items.find(item => item.id === action.payload.id);
            
            if (existingItem) {
              return {
                ...tab,
                items: tab.items.map(item =>
                  item.id === action.payload.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
                )
              };
            } else {
              return {
                ...tab,
                items: [...tab.items, { ...action.payload, quantity: 1 }]
              };
            }
          }
          return tab;
        })
      };
    
    case REMOVE_FROM_CART:
      return {
        ...state,
        tabs: state.tabs.map(tab => {
          if (tab.id === state.activeTabId) {
            return {
              ...tab,
              items: tab.items.filter(item => item.id !== action.payload)
            };
          }
          return tab;
        })
      };
    
    case UPDATE_QUANTITY:
      return {
        ...state,
        tabs: state.tabs.map(tab => {
          if (tab.id === state.activeTabId) {
            return {
              ...tab,
              items: tab.items.map(item =>
                item.id === action.payload.id
                  ? { ...item, quantity: action.payload.quantity }
                  : item
              )
            };
          }
          return tab;
        })
      };
    
    case CLEAR_CART:
      return {
        ...state,
        tabs: state.tabs.map(tab => {
          if (tab.id === state.activeTabId) {
            return {
              ...tab,
              items: [],
              discount: 0
            };
          }
          return tab;
        })
      };
    
    case APPLY_DISCOUNT:
      return {
        ...state,
        tabs: state.tabs.map(tab => {
          if (tab.id === state.activeTabId) {
            return {
              ...tab,
              discount: action.payload.amount,
              discountType: action.payload.type
            };
          }
          return tab;
        })
      };
    
    case ADD_TAB:
      const newTabNumber = state.nextTabNumber;
      const newTabId = `tab-${newTabNumber}`;
      
      return {
        ...state,
        tabs: [
          ...state.tabs.map(tab => ({ ...tab, active: false })),
          {
            id: newTabId,
            name: `Current Sale ${newTabNumber}`,
            items: [],
            discount: 0,
            discountType: 'percent',
            active: true
          }
        ],
        activeTabId: newTabId,
        nextTabNumber: newTabNumber + 1
      };
    
    case REMOVE_TAB:
      const remainingTabs = state.tabs.filter(tab => tab.id !== action.payload);
      
       
      let newActiveTabId = state.activeTabId;
      if (action.payload === state.activeTabId && remainingTabs.length > 0) {
        newActiveTabId = remainingTabs[0].id;
        remainingTabs[0].active = true;
      }
      
      return {
        ...state,
        tabs: remainingTabs,
        activeTabId: newActiveTabId
      };
    
    case SWITCH_TAB:
      return {
        ...state,
        tabs: state.tabs.map(tab => ({
          ...tab,
          active: tab.id === action.payload
        })),
        activeTabId: action.payload
      };
    
    case RENAME_TAB:
      return {
        ...state,
        tabs: state.tabs.map(tab =>
          tab.id === action.payload.tabId
            ? { ...tab, name: action.payload.newName }
            : tab
        )
      };
    
    default:
      return state;
  }
};










// import { 
//   ADD_TO_CART, 
//   REMOVE_FROM_CART, 
//   UPDATE_QUANTITY, 
//   CLEAR_CART, 
//   APPLY_DISCOUNT 
// } from '../constants/actionTypes';

// const initialState = {
//   items: [],
//   discount: 0,
//   discountType: 'percent'
// };

// export const cartReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case ADD_TO_CART:
//       const existingItem = state.items.find(item => item.id === action.payload.id);
      
//       if (existingItem) {
//         return {
//           ...state,
//           items: state.items.map(item =>
//             item.id === action.payload.id
//               ? { ...item, quantity: item.quantity + 1 }
//               : item
//           )
//         };
//       } else {
//         return {
//           ...state,
//           items: [...state.items, { ...action.payload, quantity: 1 }]
//         };
//       }
    
//     case REMOVE_FROM_CART:
//       return {
//         ...state,
//         items: state.items.filter(item => item.id !== action.payload)
//       };
    
//     case UPDATE_QUANTITY:
//       return {
//         ...state,
//         items: state.items.map(item =>
//           item.id === action.payload.id
//             ? { ...item, quantity: action.payload.quantity }
//             : item
//         )
//       };
    
//     case CLEAR_CART:
//       return {
//         ...state,
//         items: [],
//         discount: 0
//       };
    
//     case APPLY_DISCOUNT:
//       return {
//         ...state,
//         discount: action.payload.amount,
//         discountType: action.payload.type
//       };
    
//     default:
//       return state;
//   }
// };