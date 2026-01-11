// actions/admin/subCatActions.js
import {
  FETCH_SUB_CATEGORY_REQUEST,
  FETCH_SUB_CATEGORY_SUCCESS,
  FETCH_SUB_CATEGORY_FAIL,
  UPDATE_SUB_CATEGORY_REQUEST,
  UPDATE_SUB_CATEGORY_SUCCESS,
  UPDATE_SUB_CATEGORY_FAIL
} from "../../constants/Inventory/subCatConstant";

import { subCategoryService, createSubCategory } from "../../services/Inventory/subCategoryServices";

export const listSubCategories = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_SUB_CATEGORY_REQUEST });

    // Fetch active and inactive
    const [activeData, inactiveData] = await Promise.all([
      subCategoryService.getAllActive(),
      subCategoryService.getAllInactive()
    ]);


    // Combine both arrays
    const combined = [
      ...(activeData || []),
      ...(inactiveData || [])
    ];


    dispatch({
      type: FETCH_SUB_CATEGORY_SUCCESS,
      payload: combined,
    });

  } catch (error) {
    dispatch({
      type: FETCH_SUB_CATEGORY_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const addSubCategory = (subCatData) => async (dispatch) => {
  try {

    await createSubCategory(subCatData);
    dispatch(listSubCategories());
  } catch (error) {

  }
};

// Update sub category status
export const updateSubCategoryStatus = (Sub_CatID, status) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_SUB_CATEGORY_REQUEST });

    const data = await subCategoryService.updateSubCategoryStatus(Sub_CatID, status);
    

    dispatch({
      type: UPDATE_SUB_CATEGORY_SUCCESS,
      payload: { Sub_CatID, status },
    });

    // Refresh active/inactive main categories after update
    dispatch(listSubCategories());

  } catch (error) {
    dispatch({
      type: UPDATE_SUB_CATEGORY_FAIL,
      payload: error.message || "Failed to update main category status",
    });
  }
};




























// import {
//   FETCH_SUB_CATEGORY_REQUEST,
//   FETCH_SUB_CATEGORY_SUCCESS,
//   FETCH_SUB_CATEGORY_FAIL,
//   ADD_SUB_CATEGORY_REQUEST,
//   ADD_SUB_CATEGORY_SUCCESS,
//   ADD_SUB_CATEGORY_FAIL,
// } from "../../constants/Inventory/subCatConstant";

// import { subCategoryService, createSubCategory } from "../../services/Inventory/subCategoryServices";

// export const listSubCategories = () => async (dispatch) => {
//   try {
//     dispatch({ type: FETCH_SUB_CATEGORY_REQUEST });

//     const subCategories = await subCategoryService.getAll(); // call the service method


//     dispatch({
//       type: FETCH_SUB_CATEGORY_SUCCESS,
//       payload: subCategories,
//     });
//   } catch (error) {
//     dispatch({
//       type: FETCH_SUB_CATEGORY_FAIL,
//       payload:
//         error.response && error.response.data.message
//           ? error.response.data.message
//           : error.message,
//     });
//   }
// };

// export const addSubCategory = (subCatData) => async (dispatch) => {
//   try {
//     await createSubCategory(subCatData);
//     dispatch(listSubCategories()); // refresh list
//   } catch (error) {
//   }
// };

