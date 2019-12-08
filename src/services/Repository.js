import axios from "axios";

const url = process.env.VUE_APP_API;

export default axios.create({
    baseURL: url,
});
