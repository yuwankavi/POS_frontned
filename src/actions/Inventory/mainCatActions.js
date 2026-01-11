 // actions/admin/mainCatActions.js
import {
  FETCH_MAIN_CATEGORY_REQUEST,
  FETCH_MAIN_CATEGORY_SUCCESS,
  FETCH_MAIN_CATEGORY_FAIL,
  UPDATE_MAIN_CATEGORY_REQUEST,
  UPDATE_MAIN_CATEGORY_SUCCESS,
  UPDATE_MAIN_CATEGORY_FAIL,

} from "../../constants/Inventory/mainCatConstants";

import {mainCategoryService,createCategory} from "../../services/Inventory/mainCategoryService";


export const listMainCategories = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_MAIN_CATEGORY_REQUEST });

    // Fetch active and inactive
    const [activeData, inactiveData] = await Promise.all([
      mainCategoryService.getAllActive(),
      mainCategoryService.getAllInactive()
    ]);

     // Combine both arrays
    const combined = [
      ...(activeData || []),
      ...(inactiveData || [])
    ];



    dispatch({
      type: FETCH_MAIN_CATEGORY_SUCCESS,
      payload: combined,
    });
  } catch (error) {
    dispatch({
      type: FETCH_MAIN_CATEGORY_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const addCategory = (CatData) => async (dispatch) => {
  try {
    await createCategory(CatData);
    dispatch(listMainCategories());
  } catch (error) {

  }
};

// Update category status
export const updateMainCategoryStatus = (Main_CatID, status) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_MAIN_CATEGORY_REQUEST });

    const data = await mainCategoryService.updateStatus(Main_CatID, status);

    dispatch({
      type: UPDATE_MAIN_CATEGORY_SUCCESS,
      payload: { Main_CatID, status },
    });

    // Refresh active/inactive main categories after update
    dispatch(listMainCategories());

  } catch (error) {
    dispatch({
      type: UPDATE_MAIN_CATEGORY_FAIL,
      payload: error.message || "Failed to update main category status",
    });
  }
};





















// import {
//   FETCH_MAIN_CATEGORY_REQUEST,
//   FETCH_MAIN_CATEGORY_SUCCESS,
//   FETCH_MAIN_CATEGORY_FAIL,

// } from "../../constants/Inventory/mainCatConstants";

// import {mainCategoryService,createCategory} from "../../services/Inventory/mainCategoryService";


// export const listMainCategories = () => async (dispatch) => {
//   try {
//     dispatch({ type: FETCH_MAIN_CATEGORY_REQUEST });

//     const mainCategories = await mainCategoryService.getAll(); // call the service method



//     dispatch({
//       type: FETCH_MAIN_CATEGORY_SUCCESS,
//       payload: mainCategories,
//     });
//   } catch (error) {
//     dispatch({
//       type: FETCH_MAIN_CATEGORY_FAIL,
//       payload:
//         error.response && error.response.data.message
//           ? error.response.data.message
//           : error.message,
//     });
//   }
// };

// export const addCategory = (CatData) => async (dispatch) => {
//   try {
//     await createCategory(CatData);
//     dispatch(listMainCategories()); // refresh list after adding

//   } catch (error) {

//   }
// };

