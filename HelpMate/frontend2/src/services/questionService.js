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

async function setQuestion(user, title, content, tags, anonymous, course_id) {
    console.log(user)
    const { data: question } = await http.post("api/" + apiEndpoint + course_id + '/new_question', {
        title,content, tags, anonymous
    }, { headers: { 'x-auth-token': user } });
    console.log("question read:", question)
    return question
}

async function setAnswer(content, anonymous, user, course_id, question_id) {
    console.log(user)
    const { data: question } = await http.post("api/" + "/courses/" + course_id +  "/q/" + question_id + "/new_answer", {
        content, anonymous
    }, { headers: { 'x-auth-token': user } });
    console.log("answer read:", question)
    return question
}

export default {
    getQuestion,
    setQuestion,
    setAnswer
};
