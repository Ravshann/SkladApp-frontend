import Repository from "./Repository";
const api = "/products";
export default {
    get: function () { return Repository.get(`${api}`); }
}