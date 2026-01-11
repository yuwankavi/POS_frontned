
// // hooks/useLedDisplay.js
// import { useEffect, useRef, useCallback, useState } from 'react';
// import { useSelector } from 'react-redux';
// import ledDisplayService from '../services/ledDisplayService';

// const useLedDisplay = () => {
//   const { tabs, activeTabId } = useSelector((state) => state.cart);
//   const previousTotalRef = useRef(0);
//   const [isConnected, setIsConnected] = useState(false);
//   const [isConnecting, setIsConnecting] = useState(false);
//   const [hasError, setHasError] = useState(false);
//   const [portName, setPortName] = useState('COM2');
//   const [isFallbackMode, setIsFallbackMode] = useState(false);

//   // Calculate total amount from cart - UPDATED to match your cart logic
//   const calculateTotal = useCallback(() => {
//     const activeTab = tabs.find(tab => tab.id === activeTabId) || tabs[0];
//     if (!activeTab) return 0;

//     const { items, discount } = activeTab;

//     // Calculate subtotal with item discounts
//     const subtotal = items.reduce((sum, item) => {
//       // Calculate discounted price per item
//       let discountedPrice = item.price;
      
//       if (item.discountType === "Percentage") {
//         const discountAmount = (item.price * item.discountValue) / 100;
//         discountedPrice = item.price - discountAmount;
//       } else if (item.discountType === "Value") {
//         discountedPrice = item.price - item.discountValue;
//       }
      
//       const itemTotal = discountedPrice * item.quantity;
//       return sum + Math.round(itemTotal * 100) / 100;
//     }, 0);

//     // Apply cart-level discount
//     const total = Math.round((subtotal - discount) * 100) / 100;
//     return total > 0 ? total : 0;
//   }, [tabs, activeTabId]);

//   // Initialize LED display connection
//   const initializeDisplay = useCallback(async () => {
//     if (isConnecting) return;
    
//     setIsConnecting(true);
//     setHasError(false);
    
//     try {
//       const connected = await ledDisplayService.initializeDisplay();
//       setIsConnected(connected);
//       setIsFallbackMode(ledDisplayService.isFallbackMode());
      
//       if (connected) {
//         console.log('LED Display connected successfully');
//         // Display current total immediately after connection
//         const currentTotal = calculateTotal();
//         if (currentTotal > 0) {
//           await ledDisplayService.displayNumber(currentTotal);
//           previousTotalRef.current = currentTotal;
//         }
//       } else {
//         setHasError(true);
//         console.warn('LED Display connection failed');
//       }
//     } catch (error) {
//       console.error('Failed to initialize LED display:', error);
//       setIsConnected(false);
//       setHasError(true);
//     } finally {
//       setIsConnecting(false);
//     }
//   }, [isConnecting, calculateTotal]);

//   // Update LED display with current total
//   const updateDisplay = useCallback(async (total) => {
//     // Only update if total has changed significantly (more than 0.01)
//     if (Math.abs(total - previousTotalRef.current) < 0.01) {
//       return;
//     }

//     if (!isConnected && !isFallbackMode) {
//       // Try to initialize if not connected and not in fallback mode
//       await initializeDisplay();
//       return;
//     }

//     try {
//       await ledDisplayService.displayNumber(total);
//       previousTotalRef.current = total;
//       console.log('LED display updated with amount:', total.toFixed(2));
//     } catch (error) {
//       console.error('Error updating LED display:', error);
//       if (!isFallbackMode) {
//         setIsConnected(false);
//         setHasError(true);
//       }
//     }
//   }, [isConnected, isFallbackMode, initializeDisplay]);

//   // Manual reconnect function
//   const reconnect = useCallback(async () => {
//     setIsConnected(false);
//     setHasError(false);
//     setIsFallbackMode(false);
//     await initializeDisplay();
//   }, [initializeDisplay]);

//   // Test display function
//   const testDisplay = useCallback(async () => {
//     if (!isConnected && !isFallbackMode) {
//       await initializeDisplay();
//     }
    
//     try {
//       // Display test pattern
//       await ledDisplayService.displayNumber(8888.88);
      
//       // Flash status lights
//       await ledDisplayService.controlStatusLights(1, 1, 1, 1);
//       setTimeout(async () => {
//         await ledDisplayService.controlStatusLights(0, 1, 0, 0);
//       }, 1000);
      
//       console.log('LED test pattern displayed');
//     } catch (error) {
//       console.error('Error testing LED display:', error);
//     }
//   }, [isConnected, isFallbackMode, initializeDisplay]);

//   // Cleanup on component unmount
//   const cleanup = useCallback(async () => {
//     try {
//       await ledDisplayService.clearDisplay();
//       // Don't disconnect completely to maintain connection
//     } catch (error) {
//       console.error('Error during LED display cleanup:', error);
//     }
//   }, []);

//   // Effect to initialize display on mount
//   useEffect(() => {
//     initializeDisplay();
    
//     return () => {
//       cleanup();
//     };
//   }, [initializeDisplay, cleanup]);

//   // Effect to update display when cart changes
//   useEffect(() => {
//     const total = calculateTotal();
//     updateDisplay(total);
//   }, [calculateTotal, updateDisplay]);

//   return {
//     isConnected: isConnected || isFallbackMode,
//     isConnecting,
//     hasError,
//     portName,
//     isFallbackMode,
//     reconnect,
//     testDisplay,
//     initializeDisplay
//   };
// };

// export default useLedDisplay;








// hooks/useLedDisplay.js
import { useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import ledDisplayService from '../services/ledDisplayService';

const useLedDisplay = () => {
  const { tabs, activeTabId } = useSelector((state) => state.cart);
  const previousTotalRef = useRef(0);

  // Calculate total amount from cart
  const calculateTotal = useCallback(() => {
    const activeTab = tabs.find(tab => tab.id === activeTabId) || tabs[0];
    if (!activeTab) return 0;

    const { items, discount } = activeTab;

    // Calculate subtotal with item discounts
    const subtotal = items.reduce((sum, item) => {
      // Calculate discounted price per item
      let discountedPrice = item.price;
      
      if (item.discountType === "Percentage") {
        const discountAmount = (item.price * item.discountValue) / 100;
        discountedPrice = item.price - discountAmount;
      } else if (item.discountType === "Value") {
        discountedPrice = item.price - item.discountValue;
      }
      
      const itemTotal = discountedPrice * item.quantity;
      return sum + Math.round(itemTotal * 100) / 100;
    }, 0);

    // Apply cart-level discount
    const total = Math.round((subtotal - discount) * 100) / 100;
    return total > 0 ? total : 0;
  }, [tabs, activeTabId]);

  // Update LED display with current total
  const updateDisplay = useCallback(async (total) => {
    // Only update if total has changed significantly (more than 0.01)
    if (Math.abs(total - previousTotalRef.current) < 0.01) {
      return;
    }

    try {
      await ledDisplayService.displayNumber(total);
      previousTotalRef.current = total;
    } catch (error) {
      // Silent fail - no console logging
    }
  }, []);

  // Clear LED display
  const clearDisplay = useCallback(async () => {
    try {
      await ledDisplayService.clearAndResetDisplay();
      previousTotalRef.current = 0;
    } catch (error) {
      // Silent fail - no console logging
    }
  }, []);

  // Initialize LED display on mount
  useEffect(() => {
    const initialize = async () => {
      try {
        await ledDisplayService.initializeDisplay();
        // Display current total immediately after connection
        const currentTotal = calculateTotal();
        if (currentTotal > 0) {
          await ledDisplayService.displayNumber(currentTotal);
          previousTotalRef.current = currentTotal;
        }
      } catch (error) {
        // Silent initialization - no console logging
      }
    };

    initialize();
  }, [calculateTotal]);

  // Effect to update display when cart changes
  useEffect(() => {
    const total = calculateTotal();
    updateDisplay(total);
  }, [calculateTotal, updateDisplay]);

  // Return minimal info since we're hiding all status
  return {
    isConnected: ledDisplayService.isReady(),
    isFallbackMode: ledDisplayService.isFallbackMode(),
    clearDisplay
  };
};

export default useLedDisplay;












// // hooks/useLedDisplay.js
// import { useEffect, useRef, useCallback } from 'react';
// import { useSelector } from 'react-redux';
// import ledDisplayService from '../services/ledDisplayService';

// const useLedDisplay = () => {
//   const { tabs, activeTabId } = useSelector((state) => state.cart);
//   const previousTotalRef = useRef(0);

//   // Calculate total amount from cart
//   const calculateTotal = useCallback(() => {
//     const activeTab = tabs.find(tab => tab.id === activeTabId) || tabs[0];
//     if (!activeTab) return 0;

//     const { items, discount } = activeTab;

//     // Calculate subtotal with item discounts
//     const subtotal = items.reduce((sum, item) => {
//       // Calculate discounted price per item
//       let discountedPrice = item.price;
      
//       if (item.discountType === "Percentage") {
//         const discountAmount = (item.price * item.discountValue) / 100;
//         discountedPrice = item.price - discountAmount;
//       } else if (item.discountType === "Value") {
//         discountedPrice = item.price - item.discountValue;
//       }
      
//       const itemTotal = discountedPrice * item.quantity;
//       return sum + Math.round(itemTotal * 100) / 100;
//     }, 0);

//     // Apply cart-level discount
//     const total = Math.round((subtotal - discount) * 100) / 100;
//     return total > 0 ? total : 0;
//   }, [tabs, activeTabId]);

//   // Update LED display with current total
//   const updateDisplay = useCallback(async (total) => {
//     // Only update if total has changed significantly (more than 0.01)
//     if (Math.abs(total - previousTotalRef.current) < 0.01) {
//       return;
//     }

//     try {
//       await ledDisplayService.displayNumber(total);
//       previousTotalRef.current = total;
//     } catch (error) {
//       // Silent fail - no console logging
//     }
//   }, []);

//   // Initialize LED display on mount
//   useEffect(() => {
//     const initialize = async () => {
//       try {
//         await ledDisplayService.initializeDisplay();
//         // Display current total immediately after connection
//         const currentTotal = calculateTotal();
//         if (currentTotal > 0) {
//           await ledDisplayService.displayNumber(currentTotal);
//           previousTotalRef.current = currentTotal;
//         }
//       } catch (error) {
//         // Silent initialization - no console logging
//       }
//     };

//     initialize();
//   }, [calculateTotal]);

//   // Effect to update display when cart changes
//   useEffect(() => {
//     const total = calculateTotal();
//     updateDisplay(total);
//   }, [calculateTotal, updateDisplay]);

//   // Return minimal info since we're hiding all status
//   return {
//     isConnected: ledDisplayService.isReady(),
//     isFallbackMode: ledDisplayService.isFallbackMode()
//   };
// };

// export default useLedDisplay;