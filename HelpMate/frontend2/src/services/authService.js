import jwtDecode from "jwt-decode";
import http from "./httpService";

const apiEndpoint = "/api/login";
const tokenKey = "token";

http.setJwt(getJwt());

async function login(email, password) {
  const { data: user } = await http.post(apiEndpoint, { email, password });
  console.log(tokenKey, user)
  localStorage.setItem(tokenKey, JSON.stringify(user));
}

function loginWithJwt(jwt) {
  localStorage.setItem(tokenKey, jwt);
}

function logout() {
  localStorage.removeItem(tokenKey);
}

function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(tokenKey);
    console.log("storaged: ", (jwt))
    //return jwtDecode(jwt);
    return JSON.parse(jwt)
  } catch (ex) {
    return null;
  }
}

function getJwt() {
  return localStorage.getItem(tokenKey);
}

export default {
  login,
  loginWithJwt,
  logout,
  getCurrentUser,
  getJwt
};
