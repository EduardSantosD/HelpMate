import http from "./httpService";

function getTeams() {
  return http.get("/teams");
}

export default {
  getTeams
};
