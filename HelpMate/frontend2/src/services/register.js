import http from "./httpService";

const apiEndpoint = "/api/register/student";
const apiEndpointProf = "/api/register/professor";

function register(user) {
  return http.post(apiEndpoint, user);
}

function registerProf(user) {
  console.log(user)
  return http.post(apiEndpointProf, user);
}

export default {
  register,
  registerProf
};
