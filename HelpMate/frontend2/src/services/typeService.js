import http from "./httpService";

function getTypes() {
  return http.get("/types");
}

export default {
  getTypes
};
