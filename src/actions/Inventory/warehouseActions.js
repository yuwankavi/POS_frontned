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
} from "../../constants/Inventory/warehouseConstants.js";

import warehouseService from "../../services/Inventory/warehouseService.js";

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















// import {
//   FETCH_WAREHOUSE_REQUEST,
//   FETCH_WAREHOUSE_SUCCESS,
//   FETCH_WAREHOUSE_FAIL,
//   ADD_WAREHOUSE_REQUEST,
//   ADD_WAREHOUSE_SUCCESS,
//   ADD_WAREHOUSE_FAIL
// } from "../../constants/Inventory/warehouseConstants.js";

// import warehouseService from "../../services/Inventory/warehouseService.js";

// // Action: Add Warehouse
// export const addWarehouse = (warehouse) => async (dispatch) => {
//   dispatch({ type: ADD_WAREHOUSE_REQUEST });
//   try {
//     const data = await warehouseService.addWarehouse(warehouse);
//     dispatch({ type: ADD_WAREHOUSE_SUCCESS, payload: data });
//     dispatch(listWarehouses()); // refresh list after adding
//   } catch (error) {
//     dispatch({
//       type: ADD_WAREHOUSE_FAIL,
//       payload: error.message || "Failed to add warehouse",
//     });
//   }
// };
 

// export const listWarehouses = () => async (dispatch, getState) => {
//   const { warehouse } = getState();
//   if (warehouse.loading) return;

//   try {
//     dispatch({ type: FETCH_WAREHOUSE_REQUEST });
//     const data = await warehouseService.getAll();
//     dispatch({ type: FETCH_WAREHOUSE_SUCCESS, payload: data.ResultSet });
//   } catch (error) {
//     dispatch({
//       type: FETCH_WAREHOUSE_FAIL,
//       payload: error.response?.data?.message || error.message,
//     });
//   }
// };

