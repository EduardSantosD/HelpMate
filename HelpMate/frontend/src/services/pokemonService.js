import http from "./httpService";

const apiEndpoint = "/pokemon";

function getPokemon(type = null, pageNumber = 1, pageSize = 20) {
  return http.get(
    `${apiEndpoint}?pageNumber=${pageNumber}&pageSize=${pageSize}&type=${type}`
  );
}

function getPokemonByNumber(number) {
  return http.get(`${apiEndpoint}/${number}`);
}

function getPokemonCount(type) {
  return http.get(`${apiEndpoint}/count?type=${type}`);
}

export default {
  getPokemon,
  getPokemonByNumber,
  getPokemonCount
};
