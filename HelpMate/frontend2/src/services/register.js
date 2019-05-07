import http from "./httpService";

const apiEndpoint = "/api/register/student";

function register(user) {
  return http.post(apiEndpoint, user);
}

export default {
  register
};
