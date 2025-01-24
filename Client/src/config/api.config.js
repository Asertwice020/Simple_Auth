import axios from "axios";

const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;

// ! if you wanted to add access token in auth header so you can add the interceptor here. reference: https://github.com/nz-m/SocialEcho/blob/main/client/src/redux/api/utils.js
// * But currently, I am setting the access token using cookie.

const API = axios.create({
  baseURL: BASE_URL,
});

const API_ADMIN = axios.create({
  baseURL: BASE_URL,
});

export { API, API_ADMIN };