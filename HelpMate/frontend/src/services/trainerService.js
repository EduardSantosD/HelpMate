import http from "./httpService";

const apiEndpoint = "/trainers";

function register(trainer) {
  return http.post(apiEndpoint, trainer);
}

export default {
  register
};
