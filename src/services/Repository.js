import axios from "axios";
// const host = "http://www.sklad-app.tk";
const host = "localhost";
const port = "8080";
const baseurl = host + ":" + port;

export default axios.create({
    baseURL: baseurl
    // baseURL: ``
});