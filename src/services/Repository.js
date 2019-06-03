import axios from "axios";
const host = "http://www.sklad-app.tk";
const port = "8080";
const baseurl = host + ":" + port;

export default axios.create({
    baseURL: baseurl
});