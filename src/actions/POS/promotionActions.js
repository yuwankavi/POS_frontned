import {
  PROMOTION_CREATE_REQUEST,
  PROMOTION_CREATE_SUCCESS,
  PROMOTION_CREATE_FAIL,
  PROMOTION_LIST_REQUEST,
  PROMOTION_LIST_SUCCESS,
  PROMOTION_LIST_FAIL,
  PROMOTION_UPDATE_REQUEST,
  PROMOTION_UPDATE_SUCCESS,
  PROMOTION_UPDATE_FAIL,
  PROMOTION_DELETE_REQUEST,
  PROMOTION_DELETE_SUCCESS,
  PROMOTION_DELETE_FAIL,
  PROMOTION_DETAILS_REQUEST,
  PROMOTION_DETAILS_SUCCESS,
  PROMOTION_DETAILS_FAIL,
  PROMOTION_STATUS_UPDATE_REQUEST,
  PROMOTION_STATUS_UPDATE_SUCCESS,
  PROMOTION_STATUS_UPDATE_FAIL,
  PRODUCT_LIST_FOR_PROMOTION_REQUEST,
  PRODUCT_LIST_FOR_PROMOTION_SUCCESS,
  PRODUCT_LIST_FOR_PROMOTION_FAIL
} from '../../constants/POS/promotionConstants';
import { promotionService, productService } from '../../services/POS/promotionService';



export const createPromotion = (promotionData) => async (dispatch) => {
  try {
    dispatch({ type: PROMOTION_CREATE_REQUEST });
    
    console.log('Sending promotion data to API:', promotionData);
    
    const response = await promotionService.createPromotion(promotionData);
    
    console.log('API Response:', response);
    
    
    let successPayload = response;
    
   
    if (response && (
        response.success === true || 
        response.Success === true ||
        response.success === 'true' ||
        response.Success === 'true' ||
        response.message?.toLowerCase().includes('success') ||
        response.Message?.toLowerCase().includes('success') ||
        response.status === 'success' ||
        response.Status === 'success'
    )) {
      dispatch({
        type: PROMOTION_CREATE_SUCCESS,
        payload: successPayload
      });
      return successPayload;
    } else {
      
      dispatch({
        type: PROMOTION_CREATE_SUCCESS,
        payload: successPayload
      });
      return successPayload;
    }
  } catch (error) {
    console.error('Promotion creation error:', error);
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.Message || 
                        error.message || 
                        'Failed to create promotion';
    
    dispatch({
      type: PROMOTION_CREATE_FAIL,
      payload: errorMessage
    });
    throw error;
  }
};
 

export const listPromotions = () => async (dispatch) => {
  try {
    dispatch({ type: PROMOTION_LIST_REQUEST });
    const response = await promotionService.getPromotions();

    let promotions = [];
    if (Array.isArray(response)) {
      promotions = response.map(promo => ({
        id: promo.Promo_HID,
        P_PROMODES: promo.Promo_HIDesc,
        P_PROMOTYPE: promo.Promo_HIType,
        P_SDATE: promo.Promo_HSdate,
        P_EDATE: promo.Promo_HEdate,
        P_STATUS: promo.Promo_HStatus,
        createdDate: promo.Promo_HCreatedDate,
        createdBy: promo.Promo_HCreatedBy,
        updatedDate: promo.Promo_HUpdatedDate,
        updatedBy: promo.Promo_HUpdatedBy,
        Details: [] 
      }));
    } else if (response && Array.isArray(response.ResultSet)) {
      promotions = response.ResultSet.map(promo => ({
        id: promo.Promo_HID,
        P_PROMODES: promo.Promo_HIDesc,
        P_PROMOTYPE: promo.Promo_HIType,
        P_SDATE: promo.Promo_HSdate,
        P_EDATE: promo.Promo_HEdate,
        P_STATUS: promo.Promo_HStatus,
        createdDate: promo.Promo_HCreatedDate,
        createdBy: promo.Promo_HCreatedBy,
        updatedDate: promo.Promo_HUpdatedDate,
        updatedBy: promo.Promo_HUpdatedBy,
        Details: [] 
      }));
    }
  
    const promotionsWithDetails = await Promise.all(
      promotions.map(async (promotion) => {
        try {
          const detailsResponse = await promotionService.getPromotionDetails(promotion.id);
          let productDetails = [];
          if (Array.isArray(detailsResponse)) {
            productDetails = detailsResponse.map(detail => ({
              id: detail.Promo_DPID,
              productCode: detail.Promo_DRroCode,
              productName: detail.Promo_DProName,
              discountType: detail.Promo_DDisType,
              batchId: detail.Promo_DBatchId,
              discountPercentage: detail.Promo_DDisPrecentage,
              discountValue: detail.Promo_DDisValue,
              discountPrice: detail.Promo_DDisPrice,
              status: detail.Promo_DStatus,
              createdDate: detail.Promo_DCreatedDate,
              createdBy: detail.Promo_DCreatedBy
            }));
          } else if (detailsResponse && Array.isArray(detailsResponse.ResultSet)) {
            productDetails = detailsResponse.ResultSet.map(detail => ({
              id: detail.Promo_DPID,
              productCode: detail.Promo_DRroCode,
              productName: detail.Promo_DProName,
              batchId: detail.Promo_DBatchId,
              discountType: detail.Promo_DDisType,
              discountPercentage: detail.Promo_DDisPrecentage,
              discountValue: detail.Promo_DDisValue,
              discountPrice: detail.Promo_DDisPrice,
              status: detail.Promo_DStatus,
              createdDate: detail.Promo_DCreatedDate,
              createdBy: detail.Promo_DCreatedBy
            }));
          }
          return {
            ...promotion,
            Details: productDetails
          };
        } catch (error) {

          return promotion; 
        }
      })
    );
    dispatch({
      type: PROMOTION_LIST_SUCCESS,
      payload: promotionsWithDetails
    });
  } catch (error) {
    dispatch({
      type: PROMOTION_LIST_FAIL,
      payload: error.message || 'Failed to load promotions'
    });
  }
};
 
export const updatePromotionStatus = (promotionId) => async (dispatch) => {
  try {
    dispatch({ type: PROMOTION_STATUS_UPDATE_REQUEST });
    const response = await promotionService.updatePromotionStatus(promotionId);
    dispatch({
      type: PROMOTION_STATUS_UPDATE_SUCCESS,
      payload: { promotionId, response }
    });
     
    dispatch(listPromotions());
    return response;
  } catch (error) {
    dispatch({
      type: PROMOTION_STATUS_UPDATE_FAIL,
      payload: error.message || 'Failed to update promotion status'
    });
    throw error;
  }
};
 
export const updatePromotion = (promotionId, promotionData) => async (dispatch) => {
  try {
    dispatch({ type: PROMOTION_UPDATE_REQUEST });
    const response = await promotionService.updatePromotion(promotionId, promotionData);
    dispatch({
      type: PROMOTION_UPDATE_SUCCESS,
      payload: response
    });
    return response;
  } catch (error) {
    dispatch({
      type: PROMOTION_UPDATE_FAIL,
      payload: error.message || 'Failed to update promotion'
    });
    throw error;
  }
};
 
export const deletePromotion = (promotionId) => async (dispatch) => {
  try {
    dispatch({ type: PROMOTION_DELETE_REQUEST });
    await promotionService.deletePromotion(promotionId);
    dispatch({
      type: PROMOTION_DELETE_SUCCESS,
      payload: promotionId
    });
  } catch (error) {
    dispatch({
      type: PROMOTION_DELETE_FAIL,
      payload: error.message || 'Failed to delete promotion'
    });
    throw error;
  }
};
 
export const getPromotionDetails = (promotionId) => async (dispatch) => {
  try {
    dispatch({ type: PROMOTION_DETAILS_REQUEST });
    const promotion = await promotionService.getPromotionDetails(promotionId);
    dispatch({
      type: PROMOTION_DETAILS_SUCCESS,
      payload: promotion
    });
  } catch (error) {
    dispatch({
      type: PROMOTION_DETAILS_FAIL,
      payload: error.message || 'Failed to load promotion details'
    });
  }
};
 
export const getProductsForPromotion = () => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_LIST_FOR_PROMOTION_REQUEST });
    const response = await productService.getProductsForPromotion();
    let products = [];
    if (Array.isArray(response)) {
      products = response;
    } else if (response && Array.isArray(response.ResultSet)) {
      products = response.ResultSet;
    }
    dispatch({
      type: PRODUCT_LIST_FOR_PROMOTION_SUCCESS,
      payload: products
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_LIST_FOR_PROMOTION_FAIL,
      payload: error.message || 'Failed to load products'
    });
  }
};