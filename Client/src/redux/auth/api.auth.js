import { API } from "../../config/api.axios.config";
import { clearAuthState } from "../../utils/tokenHandler";

const authService = {
  signup: async (formData) => {
    try {
      const response = await API.post("/auth/signup", formData);
      return response;
    } catch (error) {
      authService.handleError(error, "signup");
      throw error;
    }
  },

  signin: async (formData) => {
    try {
      const response = await API.post("/auth/signin", formData);
      return response;
    } catch (error) {
      authService.handleError(error, "signin");
      throw error;
    }
  },

  verifyMail: async (formData) => {
    try {
      const accessToken = formData?.accessToken;
      const verificationCode = formData?.verificationCode;
      let URL = "/auth/verify-mail"

      if (accessToken && verificationCode) {
        URL = `${URL}?accessToken=${accessToken}&verificationCode=${verificationCode}`
        return await API.post(URL, formData)
      } else {
        return await API.post(URL, formData)
      }
    } catch (error) {
      authService.handleError(error, "email verification");
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await API.get("/auth/logout");
      clearAuthState();
      return response;
    } catch (error) {
      authService.handleError(error, "logout");
      throw error;
    }
  },

  forgotPassword: async (formData) => {
    try {
      const response = await API.post("/auth/forgot-password", formData);
      return response;
    } catch (error) {
      authService.handleError(error, "password reset request");
      throw error;
    }
  },

  resetPassword: async (formData, token) => {
    try {
      const response = await API.post(`/auth/reset-password/${token}`, formData);
      return response;
    } catch (error) {
      authService.handleError(error, "password reset success");
      throw error;
    }
  },

  changePassword: async (formData) => {
    try {
      const response = await API.post('/auth/change-password', formData)
      return response;
    } catch (error) {
      authService.handleError(error, "change password")
      throw error;
    }
  },

  renewAccessToken: async () => {
    try {
      const response = await API.get("/auth/renew-token");
      return response;
    } catch (error) {
      authService.handleError(error, "refresh token");
      throw error;
    }
  },

  handleError: (error, context) => {
    const message = error.response?.data?.message || error.message;
    console.error(`Auth Error (${context}):`, message);
    
    if (error.response?.status === 401) {
      clearAuthState();
    }
  },

  deactivateAccount: async (formData) => {
    try {
      const response = await API.post("/auth/deactivate-account", formData);
      return response;
    } catch (error) {
      authService.handleError(error, "account deactivation");
      throw error;
    }
  },
  
  removeAccount: async (formData) => {
    try {
      const response = await API.post("/auth/remove-account", formData);
      return response;
    } catch (error) {
      authService.handleError(error, "account deletion");
      throw error;
    }
  },
};

export { authService };
