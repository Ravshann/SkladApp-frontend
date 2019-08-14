import axios from "axios";

const host = "https://www.sklad-app.tk";
const port = "8443";
const url = host + ":" + port;

export default axios.create({
    baseURL: url,
});
