import jwtDecode from "jwt-decode";
import http from "./httpService";
import auth from "./authService";

const apiEndpoint = "courses/";
const tokenKey = "question";

http.setJwt(getJwt());

function getJwt() {
    return localStorage.getItem(tokenKey);
}

async function getQuestion(user, question_id, course_id) {
    const { data: question } = await http.get("api/" + apiEndpoint + course_id + '/q/' + question_id , { headers: { 'x-auth-token': user } });
    console.log("question read:", question)
    return question
}

export default {
    getQuestion
};
