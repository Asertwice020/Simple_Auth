import axios from "axios";
import { setupInterceptors } from "./interceptors.axios.config";
import { CLIENT } from '../constants'

const BASE_URL = import.meta.env.VITE_NODE_ENV === 'development' 
  ? import.meta.env.VITE_SERVER_BASE_URL 
  : '/api/v1';

// ! if you wanted to add access token in auth header so you can add the interceptor here. reference: https://github.com/nz-m/SocialEcho/blob/main/client/src/redux/api/utils.js
// * But currently, I am setting the access token using cookie.

const createApiInstance = (config = {}) => axios.create({
  baseURL: BASE_URL,
  withCredentials: CLIENT.AXIOS.INCLUDE_CREDENTIALS,
  timeout: CLIENT.AXIOS.TIMEOUT,
  ...config
});

// * Create API Instances
const API = createApiInstance();
const API_ADMIN = createApiInstance();

// * Add Interceptors To Instances
setupInterceptors(API);
setupInterceptors(API_ADMIN);

export { API, API_ADMIN };