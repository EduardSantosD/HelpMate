import jwtDecode from "jwt-decode";
import http from "./httpService";
import auth from "./authService";

const apiEndpoint = "courses/";
const tokenKey = "user";

http.setJwt(getJwt());

function getJwt() {
    return localStorage.getItem(tokenKey);
}

async function getCourses(user) {
    const { data: courses } = await http.get(apiEndpoint, {headers: {'x-auth-token' : user}});
    const stored_user = auth.getCurrentUser();
    console.log("sdsd", courses)
    stored_user.courses = courses
    localStorage.setItem(tokenKey, JSON.stringify(stored_user));
}

async function getCourse(course_id, token) {
    console.log("course only:", course_id, token)
    const { data: course } = await http.get("api/" + apiEndpoint + course_id, { headers: { 'x-auth-token': token } });
    return course
}

async function createCourse(user, data) {
    data.tags = data.tags.split(',');
    data.year = parseInt(data.year)
    console.log(data)
    const { data: question } = await http.post("api/courses/new_course",  data, { headers: { 'x-auth-token': user } });
    console.log("creatted course:", question)
    return question
}

export default {
    getCourses,
    getCourse,
    createCourse
};
