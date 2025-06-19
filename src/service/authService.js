import axios from "axios";
import {jwtDecode} from "jwt-decode";

const API_URL = "http://localhost:8080/auth"; // Ensure the backend URL is correct

class AuthService {
    async login(username, password) {
        const response = await axios.post(`${API_URL}/login`, { username, password });
    
        if (response.data.token) {
            localStorage.setItem("jwt_token", response.data.token); // Make sure the token is stored here
        }
    
        return response.data;
    }
    decodeToken(token) {
        if (!token) return null;
        try {
          return jwtDecode(token);
        } catch (error) {
          console.error("Error decoding token:", error);
          return null;
        }
      }
    
    register(user) {
        return axios.post(`${API_URL}/register`, user);
    }

    logout() {
        localStorage.removeItem("jwt_token");  // Consistent with the token key in login
    }

    getToken() {
        return localStorage.getItem("jwt_token");
    }

    getUserRole() {
        const token = this.getToken();
        if (!token) return null;

        try {
            const decoded = jwtDecode(token);
            return decoded.role || null; // Ensure your backend includes 'role' in the token payload
        } catch (error) {
            console.error("Invalid token:", error);
            return null;
        }
    }

    isAuthenticated() {
        const token = this.getToken();
        if (!token) return false;

        try {
            const decoded = jwtDecode(token);
            return decoded.exp * 1000 > Date.now(); // Validate token expiration
        } catch (error) {
            return false;
        }
    }
}

export default new AuthService();
