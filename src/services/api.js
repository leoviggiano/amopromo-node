import axios from 'axios';

// Consumo da API
const api = axios.create({
  baseURL: `http://stub.2xt.com.br/air/`,
});

export default api;
