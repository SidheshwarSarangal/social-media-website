import { apiConnector } from '../apiconnector';  // Ensure this is correctly defined
import { endpoints } from '../apis';

const { LOGIN_API, SIGNUP_API, SEND_OTP_API } = endpoints;  // Add SEND_OTP_API to your endpoints

// Login function
export const login = async (credentials) => {
  const response = await apiConnector("POST", LOGIN_API, credentials);
  return response.data;  // Return the data you need
};

// Signup function
export const signup = async (credentials) => {
  const response = await apiConnector("POST", SIGNUP_API, credentials);
  return response.data;  // Return the data you need
};

// Send OTP function
export const sendOtp = async (email) => {
  const response = await apiConnector("POST", SEND_OTP_API, { email });  // Pass the email in the request body
  return response.data;  // Return the data you need
};

// You can export other functions similarly
