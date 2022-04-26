import axios from 'axios';
import { parseCookies, setCookie } from 'nookies';

const api = axios.create({
  baseURL: 'http://localhost:3333',
});

const { 'lxp.token': token } = parseCookies()

if(token){
  api.defaults.headers[ 'Authorization']= `Bearer ${token}`
} 

export default api;