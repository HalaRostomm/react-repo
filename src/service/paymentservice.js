
import axios from "axios";

const API_URL = "http://localhost:8080/user/payment";


class paymentservice {
  constructor() {
    // Create Axios Instance with the token
    this.authAxios = axios.create({
      baseURL: API_URL,
    });

    // Automatically add the token to every request
    this.authAxios.interceptors.request.use((config) => {
      const token = localStorage.getItem("jwt_token"); // Ensure consistency with token name
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }
createPaymentIntent( amount) {
  return this.authAxios.post(`/create-intent?amount=${amount}`);
 }
}

export default new paymentservice();