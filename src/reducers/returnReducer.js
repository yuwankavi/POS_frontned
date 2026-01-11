import {
  RETURN_CREATE_REQUEST,
  RETURN_CREATE_SUCCESS,
  RETURN_CREATE_FAIL,
  RETURN_CREATE_RESET,
  RETURN_SCAN_INVOICE_REQUEST,
  RETURN_SCAN_INVOICE_SUCCESS,
  RETURN_SCAN_INVOICE_FAIL,
  RETURN_UPDATE_ITEM,
  RETURN_RESET_FORM,
  RETURN_SET_INVOICE,
  RETURN_SET_PREVIEW_INVOICE,
  RETURN_FETCH_PRODUCT_QTY_REQUEST,
  RETURN_FETCH_PRODUCT_QTY_SUCCESS,
  RETURN_FETCH_PRODUCT_QTY_FAIL
} from '../constants/returnConstants';

const initialState = {
  loading: false,
  success: false,
  error: null,
  scanLoading: false,
  scanError: null,
  currentInvoice: null,
  previewInvoice: null,
  productQuantities: {},
  quantityLoading: false,
  formData: {
    P_WHCODE: 'A01',
    P_ORIGINALDOCTYPE: 'INV',
    P_ORIGINALDOCNO: '',
    ReturnLines: []
  }
};

export const returnReducer = (state = initialState, action) => {
  switch (action.type) {
    case RETURN_CREATE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case RETURN_CREATE_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        error: null
      };

    case RETURN_CREATE_FAIL:
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload
      };

    case RETURN_CREATE_RESET:
      return {
        ...state,
        loading: false,
        success: false,
        error: null
      };

    case RETURN_SCAN_INVOICE_REQUEST:
      return {
        ...state,
        scanLoading: true,
        scanError: null
      };

    case RETURN_SCAN_INVOICE_SUCCESS:
      return {
        ...state,
        scanLoading: false,
        scanError: null
      };

    case RETURN_SCAN_INVOICE_FAIL:
      return {
        ...state,
        scanLoading: false,
        scanError: action.payload
      };

    case RETURN_SET_PREVIEW_INVOICE:
      return {
        ...state,
        previewInvoice: action.payload
      };

    case RETURN_FETCH_PRODUCT_QTY_REQUEST:
      return {
        ...state,
        quantityLoading: true
      };

    case RETURN_FETCH_PRODUCT_QTY_SUCCESS:
      const { productCode, invoiceNumber, batchId, quantity } = action.payload;

      const quantityKey = `${productCode}_${invoiceNumber}_${batchId}`;
      return {
        ...state,
        productQuantities: {
          ...state.productQuantities,
          [quantityKey]: quantity
        },
        quantityLoading: false
      };


    case RETURN_FETCH_PRODUCT_QTY_FAIL:
      return {
        ...state,
        quantityLoading: false
      };


    case RETURN_SET_INVOICE:
      const invoice = action.payload;
      return {
        ...state,
        currentInvoice: invoice,
        previewInvoice: null,
        productQuantities: {},
        formData: {
          ...state.formData,
          P_ORIGINALDOCNO: invoice.invoiceNumber,
          ReturnLines: invoice.items.map(item => ({
            PRODUCT_CODE: item.PRODUCT_CODE,
            BATCH_ID: item.BATCH_ID,
            QUANTITY: 0,
            UNIT_PRICE: item.price,
            REASON: '',
            maxQuantity: 0
          }))
        }
      };

    case RETURN_UPDATE_ITEM:
      const { itemId, field, value } = action.payload;
      const updatedReturnLines = state.formData.ReturnLines.map((line, index) => {
        if (state.currentInvoice.items[index].id === itemId) {
          return {
            ...line,
            [field]: field === 'QUANTITY' ? Number(value) : value
          };
        }
        return line;
      });

      return {
        ...state,
        formData: {
          ...state.formData,
          ReturnLines: updatedReturnLines
        }
      };

    case RETURN_RESET_FORM:
      return {
        ...initialState,
        formData: {
          ...initialState.formData
        }
      };

    default:
      return state;
  }
};