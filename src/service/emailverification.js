// src/service/emailVerificationService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api'; // Adjust port if needed

export const sendVerificationCode = async (email) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/send-code`, null, {
      params: { email }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Failed to send verification code';
  }
};

export const verifyCode = async (email, code) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/verify-code`, null, {
      params: { email, code }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Verification failed';
  }
};