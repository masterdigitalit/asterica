import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000',
	proxy:"127.0.0.1:12334", // Set your base URL here
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
