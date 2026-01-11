import {
  FETCH_BATCH_REQUEST,
  FETCH_BATCH_SUCCESS,
  FETCH_BATCH_FAIL,
  ADD_BATCH_REQUEST,
  ADD_BATCH_SUCCESS,
  ADD_BATCH_FAIL,
  FETCH_BATCH_STATUS_REQUEST,
  FETCH_BATCH_STATUS_SUCCESS,
  FETCH_BATCH_STATUS_FAIL,
  TOGGLE_BATCH_STATUS_REQUEST,
  TOGGLE_BATCH_STATUS_SUCCESS,
  TOGGLE_BATCH_STATUS_FAIL,
  BATCH_ACTIVE_REQUEST,
  BATCH_ACTIVE_SUCCESS,
  BATCH_ACTIVE_FAIL,
  BATCH_INACTIVE_REQUEST,
  BATCH_INACTIVE_SUCCESS,
  BATCH_INACTIVE_FAIL
} from "../../constants/Inventory/batchConstant.js";

import batchService from "../../services/Inventory/batchService.js";

// Action: Add Batch
export const addBatch = (batch) => async (dispatch) => {
  dispatch({ type: ADD_BATCH_REQUEST });
  try {
    const data = await batchService.addBatch(batch);
    dispatch({ type: ADD_BATCH_SUCCESS, payload: data });
    dispatch(listBatches()); // refresh list after adding
  } catch (error) {
    dispatch({
      type: ADD_BATCH_FAIL,
      payload: error.message || "Failed to add batch",
    });
  }
};

export const listBatches = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_BATCH_REQUEST });

    const data = await batchService.getAll();


    dispatch({
      type: FETCH_BATCH_SUCCESS,
      payload: data.ResultSet,
    });
  } catch (error) {
    dispatch({
      type: FETCH_BATCH_FAIL,
      payload:
        error.response?.data?.message ||
        error.message ||
        "Failed to load batches",
    });
  }
};


//list by status
// export const getBatchbyStatus = (P_STATUS) => async (dispatch) => {
//   try {
//     dispatch({ type: FETCH_BATCH_REQUEST });

//     const data = await brandService.getBatchbyStatus(P_STATUS);
//     dispatch({
//       type: FETCH_BATCH_STATUS_SUCCESS,
//       payload: data.ResultSet,
//     });
//   } catch (error) {
//     dispatch({
//       type: FETCH_BATCH_STATUS_FAIL,
//       payload:
//         error.response?.data?.message ||
//         error.message ||
//         "Failed to load brand by status",
//     });
//   }
// };

//batch active
export const listActiveBatches = () => async (dispatch) => {
  try {
    dispatch({type: BATCH_ACTIVE_REQUEST});
    const data = await batchService.getActiveBatches();



    dispatch({
      type: BATCH_ACTIVE_SUCCESS,
      payload: data.ResultSet,
    });
  } catch (error) {
    dispatch({
      type: BATCH_ACTIVE_FAIL,
      payload:
        error.response?.data?.message ||
        error.message || "Failed to load active batches",
    });
  }
};

//batch inactive
export const listInactiveBatches = () => async (dispatch) => {
  try {
    dispatch({type: BATCH_INACTIVE_REQUEST});
    const data = await batchService.getInactiveBatches();



    dispatch({
      type: BATCH_INACTIVE_SUCCESS,
      payload: data.ResultSet,
    });
  } catch (error) {
    dispatch({
      type: BATCH_INACTIVE_FAIL,
      payload:
        error.response?.data?.message ||
        error.message || "Failed to load inactive batches",
    });
  }
};

// Action: Toggle Batch Status
export const toggleBatchStatus = (batchId, newStatus) => async (dispatch) => {
  try {
    dispatch({ type: TOGGLE_BATCH_STATUS_REQUEST });

    await batchService.toggleStatus(batchId, newStatus);

    dispatch({ type: TOGGLE_BATCH_STATUS_SUCCESS });
    // dispatch(listBatches()); // Refresh after update
    dispatch(listActiveBatches());
    dispatch(listInactiveBatches());
  } catch (error) {
    dispatch({
      type: TOGGLE_BATCH_STATUS_FAIL,
      payload: error.message || "Failed to update status",
    });
  }
};
