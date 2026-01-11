import axios from "axios";
import { getBrandbyID } from "../../actions/Inventory/brandActions";
import { API_URL } from "../../config";

const AUTH_KEY = localStorage.getItem("token");


const brandService = {
  async addBrand(brand) {
    try {
      const { P_BNAME } = brand;

      // API expects query params
      const url = `${API_URL}/Product/BrandAdd?P_BNAME=${encodeURIComponent(
        P_BNAME
      )}`;

      const response = await axios.get(url, {
        headers: {
          "auth-key": AUTH_KEY,  // <-- add the auth-key here
        },
      });

      return response.data;
    } catch (error) {

      throw error;
    }
  },
      //     "auth-key": AUTH_KEY,  // <-- add the auth-key here
      //   },
      // });

  async getAll() {
    try {
      const response = await axios.get(`${API_URL}/Product/GetBrand`, {
        headers: {
          "auth-key": AUTH_KEY,  // <-- add the auth-key here
        },
      });

      return response.data;
    } catch (error) {

      throw error;
    }
  },

  // get by id
  async getBrandbyID(P_BRID) {
    try {
      const response = await axios.get(
        `${API_URL}/Product/GetBrandById?P_BRID=${P_BRID}`,
        {
          headers: {
            "auth-key": AUTH_KEY,  // <-- add the auth-key here
          }
        }
      );

      return response.data;

    } catch (error) {

      throw error;
    }
  },

  //get by status
  async getBrandbyStatus(P_STATUS) {
    try {
      const response = await axios.get(
        `${API_URL}/Product/GetBrand?P_STATUS=${P_STATUS}`,
        {
          headers: {
            "auth-key": AUTH_KEY,  // <-- add the auth-key here
          }
        }
      );

      return response.data;
    } catch (error) {

    }
  },


  //active brands
  async getActiveBrands() {
    try {
      const response = await axios.get(
        `${API_URL}/Product/GetBrand?P_STATUS=A`,
        {
          headers: {
            "auth-key": AUTH_KEY,  // <-- add the auth-key here
          },
        }

      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },


  //inactive brands
  async getInactiveBrands() {
    try {
      const response = await axios.get(
        `${API_URL}/Product/GetBrand?P_STATUS=I`,
        {
          headers: {
            "auth-key": AUTH_KEY,  // <-- add the auth-key here
          }
        }
      );

      return response.data;
    } catch (error) {

      throw error;
    }
  },

  //update brand
  async updateBrand(P_BRID,P_STATUS) {
    try {
      const response = await axios.get(
        `${API_URL}/Product/BrandStatusUpdate?P_BRID=${P_BRID}&P_STATUS=${P_STATUS}`,
        {
          headers: {
            "auth-key": AUTH_KEY,  // <-- add the auth-key here
          }
        }
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // async getAll() {
  //   try {
  //     const response = await axios.get(`${API_URL}/Product/GetBrand`, {
  //       headers: {
  //         "auth-key": AUTH_KEY,  // <-- add the auth-key here
  //       },
  //     });

  //     return response.data;
  //   } catch (error) {
  //     console.error("Error in getAllBrands service:", error);
  //     throw error;
  //   }
  // },

//  { async getAll() {
//     try {
//       const response = await axios.get(`${API_URL}/Brand/GetBrandList`, {
//         headers: {
//           "auth-key": AUTH_KEY,  // <-- include here too
//         },
//       });

//       return response.data;
//     } catch (error) {
//       console.error("Error fetching brands:", error);
//       throw error;
//     }
//   },
};

export default brandService;