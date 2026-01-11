import {
  FETCH_WAREHOUSE_REQUEST,
  FETCH_WAREHOUSE_SUCCESS,
  FETCH_WAREHOUSE_FAIL,
  ADD_WAREHOUSE_REQUEST,
  ADD_WAREHOUSE_SUCCESS,
  ADD_WAREHOUSE_FAIL,
  UPDATE_WAREHOUSE_STATUS_REQUEST,
  UPDATE_WAREHOUSE_STATUS_SUCCESS,
  UPDATE_WAREHOUSE_STATUS_FAIL,

    MONTH_END_REQUEST,
  MONTH_END_SUCCESS,
  MONTH_END_FAIL,
} from "../constants/warehouseConstants.js";

import warehouseService from "../services/warehouseService.js";

// Action: Add Warehouse
export const addWarehouse = (warehouse) => async (dispatch) => {
  dispatch({ type: ADD_WAREHOUSE_REQUEST });
  try {
    const data = await warehouseService.addWarehouse(warehouse);
    dispatch({ type: ADD_WAREHOUSE_SUCCESS, payload: data });
    dispatch(listWarehouses()); // refresh list after adding
  } catch (error) {
    dispatch({
      type: ADD_WAREHOUSE_FAIL,
      payload: error.message || "Failed to add warehouse",
    });
  }
};

// Action: List all warehouses (active + inactive)
export const listWarehouses = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_WAREHOUSE_REQUEST });

    // Fetch active and inactive
    const [activeData, inactiveData] = await Promise.all([
      warehouseService.getAllActive(),
      warehouseService.getAllInactive()
    ]);

    // Combine both arrays
    const combined = [
      ...(activeData.ResultSet || []),
      ...(inactiveData.ResultSet || [])
    ];

    dispatch({
      type: FETCH_WAREHOUSE_SUCCESS,
      payload: combined
    });
  } catch (error) {
    dispatch({
      type: FETCH_WAREHOUSE_FAIL,
      payload:
        error.response?.data?.message || error.message || "Failed to load warehouses",
    });
  }
};


// Update warehouse status
export const updateWarehouseStatus = (WH_Code, status) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_WAREHOUSE_STATUS_REQUEST });

    const data = await warehouseService.updateStatus(WH_Code, status);

    dispatch({
      type: UPDATE_WAREHOUSE_STATUS_SUCCESS,
      payload: { WH_Code, status },
    });

    // Refresh active/inactive warehouses after update
    dispatch(listWarehouses());
    
  } catch (error) {
    dispatch({
      type: UPDATE_WAREHOUSE_STATUS_FAIL,
      payload: error.message || "Failed to update warehouse status",
    });
  }
};



// Get Month End History
export const getMonthEndHistory = (warehouseCode) => async (dispatch) => {
  try {
    dispatch({ type: MONTH_END_REQUEST });

    // call your service instead of raw api
    const data = await warehouseService.getMonthEndHistory(warehouseCode);

    dispatch({
      type: MONTH_END_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: MONTH_END_FAIL,
      payload:
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch month-end history",
    });
  }
};



// Month end process - UPDATED to accept both dates
export const processMonthEnd = (startDate, endDate, whCode) => async (dispatch) => {
  try {
    dispatch({ type: MONTH_END_REQUEST });

    const data = await warehouseService.monthEndProcess(startDate, endDate, whCode);

    dispatch({
      type: MONTH_END_SUCCESS,
      payload: data,
    });
    dispatch(listWarehouses()); // Refresh warehouses after month-end
  } catch (error) {
    dispatch({
      type: MONTH_END_FAIL,
      payload:
        error.response?.data?.message || error.message || "Something went wrong",
    });
  }
};