import jwtDecode from "jwt-decode";
import http from "./httpService";

const apiEndpoint = "courses/";
const tokenKey = "courses";

http.setJwt(getJwt());

function getJwt() {
    return localStorage.getItem(tokenKey);
}

async function getCourses(user) {
    console.log("tok:", user)
    const { data: courses } = await http.get(apiEndpoint, {headers: {'x-auth-token' : user}});
    console.log(tokenKey, courses)
    localStorage.setItem(tokenKey, JSON.stringify(courses));
}

export default {
    getCourses
};
